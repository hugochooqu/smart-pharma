import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
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
  const [reminders, setReminders] = useState<{ time: Date; note: string }[]>([]);
  
const [todayReminders, setTodayReminders] = useState<Reminder[]>([]);

  const { user } = useAuthStore();
  const { recommendationId } = useLocalSearchParams<{ recommendationId: string }>();

  const handleFrequencySelect = (count: number) => {
    setFrequency(count);
    setTimes(Array(count).fill(new Date()));
    setShowPickers(Array(count).fill(false));
  };

  const handleTimeChange = (
    index: number,
    _: any,
    selected: Date | undefined
  ) => {
    const updatedPickers = [...showPickers];
    updatedPickers[index] = false;
    setShowPickers(updatedPickers);

    if (selected) {
      const updatedTimes = [...times];
      updatedTimes[index] = selected;
      setTimes(updatedTimes);
    }
  };

  const scheduleReminders = async () => {
    if (!user) return;

    const newReminders: { time: Date; note: string }[] = [];

    try {
      // ✅ Local notification
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

      // ✅ Save to Appwrite
      await saveReminder({
        userId: user.$id,
        recommendationId,
        frequencyPerDay: frequency,
        times: times.map((t) => t.toISOString()),
        durationDays: Number(days),
        note,
        startDate: new Date(),
      });

      console.log("✅ Reminder saved to Appwrite");
      setReminders((prev) => [...prev, ...newReminders]);
    } catch (error) {
      console.error("❌ Failed to save reminder:", error);
    }
  };

  useEffect(() => {
  const getReminders = async () => {
    if (!user) return;

    const reminders = await fetchActiveReminders(user.$id);
    setTodayReminders(reminders as unknown as Reminder[]); // or setReminders
  };

  getReminders();
}, []);

  useEffect(() => {
    const debugScheduledNotifications = async () => {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log("📅 Scheduled Notifications:", JSON.stringify(scheduled, null, 2));
    };

    debugScheduledNotifications();
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
          <Text className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">
            Set Medication Reminder
          </Text>

          <Text className="text-blue-700 dark:text-blue-200 font-semibold mb-2">
            Frequency per Day
          </Text>
          <View className="flex-row justify-between mb-4 flex-wrap">
            {frequencyOptions.map((count) => (
              <Pressable
                key={count}
                onPress={() => handleFrequencySelect(count)}
                className={`w-[48%] p-4 rounded-xl border mb-3 ${
                  frequency === count
                    ? "bg-blue-100 dark:bg-blue-950 border-blue-500"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                }`}
              >
                <Text className="text-center text-lg text-blue-700 dark:text-blue-200 font-semibold">
                  {count}x Daily
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-blue-700 dark:text-blue-200 font-semibold mb-2">
            Select Time(s)
          </Text>
          {times.map((time, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <Pressable
                onPress={() => {
                  const updated = [...showPickers];
                  updated[index] = true;
                  setShowPickers(updated);
                }}
                className="flex-row items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <Ionicons name="time-outline" size={20} color="#3B82F6" />
                <Text className="ml-2 text-blue-700 dark:text-blue-200">
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
                  onChange={(e, selected) => handleTimeChange(index, e, selected)}
                />
              )}
            </View>
          ))}

          <Text className="text-blue-700 dark:text-blue-200 font-semibold mb-2 mt-4">
            Duration (in days)
          </Text>
          <TextInput
            keyboardType="number-pad"
            value={days}
            onChangeText={setDays}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white p-3 rounded-lg mb-4"
            placeholder="E.g. 7"
            placeholderTextColor="#888"
          />

          <Text className="text-blue-700 dark:text-blue-200 font-semibold mb-2">
            Custom Note (Optional)
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white p-3 rounded-lg h-24 text-sm"
            placeholder="E.g. Take after food"
            placeholderTextColor="#888"
          />

          <Pressable
            onPress={scheduleReminders}
            className="bg-blue-600 dark:bg-blue-500 mt-6 p-4 rounded-lg"
          >
            <Text className="text-white font-bold text-center text-lg">
              Save Reminder
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              await Notifications.cancelAllScheduledNotificationsAsync();
              console.log("✅ All scheduled notifications cancelled");
              setReminders([]);
            }}
            className="bg-red-500 p-3 rounded-md mt-4"
          >
            <Text className="text-white text-center font-semibold">
              Clear All Reminders
            </Text>
          </Pressable>

          <Pressable
            onPress={async () => {
              const scheduled = await Notifications.getAllScheduledNotificationsAsync();
              console.log("📅 Scheduled Notifications:", JSON.stringify(scheduled, null, 2));
            }}
            className="mt-4 p-2 bg-yellow-400 rounded-md"
          >
            <Text className="text-center text-black font-semibold">
              Log Scheduled Reminders
            </Text>
          </Pressable>

         {todayReminders.length > 0 && (
  <View className="mt-6 px-4">
    <Text className="text-xl font-semibold mb-4 text-blue-700 dark:text-blue-300">
      Active Reminders
    </Text>

    {todayReminders.map((reminder) => (
      <View
        key={reminder.$id}
        className="mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900"
      >
        <Text className="text-blue-800 dark:text-white font-semibold">
          Frequency: {reminder.frequencyPerDay}x/day
        </Text>
        <Text className="text-sm text-blue-600 dark:text-blue-300 mb-2">
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
        <Text className="text-sm text-gray-700 dark:text-gray-300 italic mb-3">
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
