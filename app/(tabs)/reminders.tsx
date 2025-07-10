import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "@/store/auth.store";
import { fetchActiveReminders, saveReminder } from "@/lib/appwrite";
import { useLocalSearchParams } from "expo-router";
import { Reminder } from "@/type";

const frequencyOptions = [1, 2, 3];

export default function RemindersScreen() {
  const [frequency, setFrequency] = useState(1);
  const [times, setTimes] = useState<Date[]>([new Date()]);
  const [showPickers, setShowPickers] = useState<boolean[]>([false]);
  const [days, setDays] = useState("7");
  const [note, setNote] = useState("");
  const [activeReminders, setActiveReminders] = useState<Reminder[]>([]);

  const mapToReminder = (docs: any[]): Reminder[] =>
  docs.map((doc) => ({
    $id: doc.$id,
    userId: doc.userId,
    recommendationId: doc.recommendationId || "custom",
    frequencyPerDay: doc.frequencyPerDay,
    times: doc.times,
    durationDays: doc.durationDays,
    note: doc.note || "",
    startDate: doc.startDate,
  }));

  const { user } = useAuthStore();
  const { recommendationId } = useLocalSearchParams<{
    recommendationId?: string;
  }>();

  // 🧠 Select frequency
  const handleFrequencySelect = (count: number) => {
    setFrequency(count);
    setTimes(Array(count).fill(new Date()));
    setShowPickers(Array(count).fill(false));
  };

  const handleTimeChange = (index: number, _: any, selected?: Date) => {
    const updatedPickers = [...showPickers];
    updatedPickers[index] = false;
    setShowPickers(updatedPickers);

    if (selected) {
      const updatedTimes = [...times];
      updatedTimes[index] = selected;
      setTimes(updatedTimes);
    }
  };

  // ✅ Save Reminder + Schedule Notification
 const scheduleReminders = async () => {
  if (!user) return;

  const newReminders: { time: Date; note: string }[] = [];

  try {
    // ✅ Schedule local notifications
    for (const time of times) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "SmartPharma Reminder",
          body: note || "Time to take your herbal medicine.",
          sound: true,
        },
        trigger: {
          hour: time.getHours(),
          minute: time.getMinutes(),
          repeats: true,
          type: "daily",
          channelId: "default",
        } as Notifications.DailyTriggerInput,
      });

      newReminders.push({ time, note });
    }

    // ✅ Save reminder in Appwrite
    await saveReminder({
      userId: user.$id,
      recommendationId: recommendationId || "custom", // fallback if user came directly
      frequencyPerDay: frequency,
      times: times.map((t) => t.toISOString()),
      durationDays: Number(days),
      note,
      startDate: new Date(),
    });

    Alert.alert("Success", "Reminder saved successfully.");
    setNote("");
    setDays("7");

    // ✅ Fetch and set updated reminders
    const rawReminders = await fetchActiveReminders(user.$id);
    setActiveReminders(mapToReminder(rawReminders));
  } catch (error) {
    console.error("❌ Failed to save reminder:", error);
    Alert.alert("Error", "Failed to schedule reminder. Try again.");
  }
};


  useEffect(() => {
  if (!user) return;

  fetchActiveReminders(user.$id).then((rawReminders) => {
    setActiveReminders(mapToReminder(rawReminders));
  });
}, []);


  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-6">
            Set Medication Reminder
          </Text>

          {/* Frequency Selection */}
          <Text className="text-blue-700 dark:text-blue-200 font-semibold mb-2">
            Frequency per Day
          </Text>
          <View className="flex-row justify-between mb-4">
            {frequencyOptions.map((count) => (
              <Pressable
                key={count}
                onPress={() => handleFrequencySelect(count)}
                className={`flex-1 mx-1 p-4 rounded-lg border ${
                  frequency === count
                    ? "bg-blue-100 dark:bg-blue-950 border-blue-500"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                }`}
              >
                <Text className="text-center text-lg font-medium text-blue-800 dark:text-blue-200">
                  {count}x / Day
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Time Pickers */}
          <Text className="text-blue-700 dark:text-blue-200 font-semibold mb-2">
            Select Reminder Time(s)
          </Text>
          {times.map((time, index) => (
            <View key={index} className="mb-3">
              <Pressable
                onPress={() => {
                  const updated = [...showPickers];
                  updated[index] = true;
                  setShowPickers(updated);
                }}
                className="flex-row items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <Ionicons name="time-outline" size={20} color="#3B82F6" />
                <Text className="ml-3 text-blue-800 dark:text-blue-200 font-semibold">
                  {time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>

              {showPickers[index] && (
                <DateTimePicker
                  value={time}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(e, selected) =>
                    handleTimeChange(index, e, selected)
                  }
                />
              )}
            </View>
          ))}

          {/* Duration */}
          <Text className="text-blue-700 dark:text-blue-200 font-semibold mt-4 mb-2">
            Duration (in Days)
          </Text>
          <TextInput
            value={days}
            onChangeText={setDays}
            keyboardType="numeric"
            className="p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg"
            placeholder="E.g. 7"
            placeholderTextColor="#888"
          />

          {/* Custom Note */}
          <Text className="text-blue-700 dark:text-blue-200 font-semibold mt-4 mb-2">
            Custom Note (optional)
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            className="p-3 h-24 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg"
            placeholder="E.g. Take after food"
            placeholderTextColor="#888"
          />

          {!recommendationId && (
            <Text className="text-xs text-orange-500 italic mb-3">
              No linked recommendation — this will be saved as a general
              reminder.
            </Text>
          )}

          {/* Submit Button */}
          <Pressable
            onPress={scheduleReminders}
            className="bg-blue-600 dark:bg-blue-500 mt-6 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Save Reminder
            </Text>
          </Pressable>

          {/* Active Reminders */}
          {activeReminders.length > 0 && (
            <View className="mt-10">
              <Text className="text-xl font-semibold mb-4 text-blue-800 dark:text-blue-300">
                Active Reminders
              </Text>

              {activeReminders.map((reminder) => (
                <View
                  key={reminder.$id}
                  className="mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900"
                >
                  <Text className="text-blue-800 dark:text-white font-semibold">
                    {reminder.frequencyPerDay}x/day
                  </Text>
                  <Text className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    Times:{" "}
                    {reminder.times
                      .map((t: string) =>
                        new Date(t).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      )
                      .join(", ")}
                  </Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-300 italic">
                    Note: {reminder.note || "—"}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
