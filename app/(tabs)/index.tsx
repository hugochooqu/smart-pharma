import { colors, quickNav } from "@/constants";
import {
  FlatList,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useAuthStore from "@/store/auth.store";
import { useEffect, useState } from "react";
import {
  fetchIntakeLogs,
  fetchRemindersForRecommendation,
  saveIntakeLog,
} from "@/lib/appwrite";
import HealthTipCard from "@/components/HealthTipCard";

export default function Index() {
  const [todayReminders, setTodayReminders] = useState<any[]>([]);
  const [takenIds, setTakenIds] = useState<string[]>([]);

  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const fetchTodayReminders = async () => {
      if (!user) return;

      const allReminders = await fetchRemindersForRecommendation(user.$id);
      const logs = await fetchIntakeLogs(user.$id);
      const today = new Date().toDateString();

      // Filter valid reminders
      const validReminders = allReminders.filter((r: any) => {
        const start = new Date(r.startDate);
        const duration = Number(r.durationDays);
        const end = new Date(start);
        end.setDate(start.getDate() + duration - 1);
        end.setHours(23, 59, 59, 999);

        return (
          new Date() >= start &&
          new Date() <= end &&
          r.recommendationId &&
          r.recommendationId !== "custom"
        );
      });

      // Expand each reminder into individual doses
      const expanded = validReminders.flatMap((r: any) =>
        r.times.map((time: string, index: number) => ({
          ...r,
          singleTime: time,
          timeIndex: index,
          uniqueId: `${r.$id}-${index}`,
        }))
      );

      // Find taken doses today
      const takenToday = logs
        .filter((log) => new Date(log.$createdAt).toDateString() === today)
        .map((log) => log.reminderId + "-" + log.timeIndex);

      setTodayReminders(expanded);
      setTakenIds(takenToday);
    };

    fetchTodayReminders();
  }, []);

  const QuickActionCard = ({ id, title, subtitle, icon, color, screen }: any) => {
    return (
      <Pressable className="flex-1 m-2 p-5 bg-white dark:bg-neutral-800 rounded-xl shadow-lg shadow-slate-600 items-center justify-center">
        {({ pressed }) => (
          <TouchableWithoutFeedback onPress={() => router.push(screen)}>
            <View className="items-center justify-center">
              <View
                className="w-16 h-16 rounded-full justify-center items-center mb-3"
                style={{ backgroundColor: color, opacity: pressed ? 0.8 : 1 }}
              >
                <Ionicons name={icon} size={24} color="white" />
              </View>
              <Text className="text-gray-900 dark:text-white font-bold text-lg text-center">
                {title}
              </Text>
              <Text className="text-gray-700 dark:text-white text-center">
                {subtitle}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <FlatList
        data={quickNav}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <QuickActionCard
            id={item.id}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            color={colors[item.color as keyof typeof colors]}
            screen={item.screen}
          />
        )}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        ListHeaderComponent={() => (
          <View>
            <View className="px-4 pt-6 pb-2 flex flex-row justify-between items-center">
              <Text className="text-3xl font-semibold text-black dark:text-white">
                Hello {user?.name}
              </Text>
            </View>
            <Text className="px-4 text-lg font-semibold text-gray-400 dark:text-gray-300">
              Let&apos;s take care of your health today
            </Text>
            <Text className="text-2xl font-bold text-neutral-600 dark:text-neutral-300 py-6 px-4">
              Quick Actions
            </Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View className="px-4 pb-20">
            <HealthTipCard />

            {todayReminders.length > 0 && (
              <View className="mt-6">
                <Text className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
                  Today’s Medications
                </Text>

                {todayReminders.map((reminder) => {
                  const takenKey = reminder.uniqueId;
                  const taken = takenIds.includes(takenKey);

                  return (
                    <View
                      key={takenKey}
                      className="mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900"
                    >
                      <Text className="text-blue-800 dark:text-white font-semibold">
                        Time:{" "}
                        {new Date(reminder.singleTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>

                      <Text className="text-sm text-gray-700 dark:text-gray-300 italic mb-3">
                        Note: {reminder.note || "—"}
                      </Text>

                      <Pressable
                        onPress={async () => {
                          if (!user) return;

                          await saveIntakeLog({
                            userId: user.$id,
                            recommendationId: reminder.recommendationId,
                            reminderId: reminder.$id,
                            timeIndex: reminder.timeIndex,
                          });

                          setTakenIds((prev) => [...prev, takenKey]);
                        }}
                        className={`p-3 rounded-md ${
                          taken ? "bg-green-600" : "bg-blue-600"
                        }`}
                      >
                        <Text className="text-white text-center font-bold">
                          {taken ? "✅ Taken" : "Take"}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}
