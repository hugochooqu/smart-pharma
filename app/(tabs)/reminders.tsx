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

const frequencyOptions = [1, 2, 3];

export default function RemindersScreen() {
  const [frequency, setFrequency] = useState(1);
  const [times, setTimes] = useState<Date[]>([new Date()]);
  const [showPickers, setShowPickers] = useState<boolean[]>([false]);
  const [days, setDays] = useState("7");
  const [note, setNote] = useState("");
  const [reminders, setReminders] = useState<{ time: Date; note: string }[]>(
    []
  );

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
    setShowPickers((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
    if (selected) {
      const updatedTimes = [...times];
      updatedTimes[index] = selected;
      setTimes(updatedTimes);
    }
  };

  const scheduleReminders = async () => {
    const newReminders: { time: Date; note: string }[] = [];
    for (const time of times) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "SmartPharma Reminder",
          body: note || "Time to take your herbal medicine.",
          sound: true,
        },
        trigger: {
          type: "daily",
          hour: time.getHours(),
          minute: time.getMinutes(),
          repeats: true,
          channelId: "default",
        } as Notifications.SchedulableNotificationTriggerInput,
      });
      newReminders.push({ time, note });
    }

    setReminders((prev) => [...prev, ...newReminders]);

    // 🔄 Save to Appwrite here if needed
  };

  useEffect(() => {
    const debugScheduledNotifications = async () => {
      const scheduled =
        await Notifications.getAllScheduledNotificationsAsync();
      console.log("📅 Scheduled Notifications:", JSON.stringify(scheduled, null, 2));
    };

    debugScheduledNotifications();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-2xl font-bold text-blue-800 mb-4">
            Set Medication Reminder
          </Text>

          <Text className="text-blue-700 font-semibold mb-2">
            Frequency per Day
          </Text>
          <View className="flex-row justify-between mb-4 flex-wrap">
            {frequencyOptions.map((count) => (
              <Pressable
                key={count}
                onPress={() => handleFrequencySelect(count)}
                className={`w-[48%] p-4 rounded-xl border mb-3 ${
                  frequency === count
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <Text className="text-center text-lg text-blue-700 font-semibold">
                  {count}x Daily
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-blue-700 font-semibold mb-2">Select Time(s)</Text>
          {times.map((t, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <Pressable
                onPress={() => {
                  const updated = [...showPickers];
                  updated[index] = true;
                  setShowPickers(updated);
                }}
                className="flex-row items-center p-3 bg-gray-100 rounded-lg"
              >
                <Ionicons name="time-outline" size={20} color="#3B82F6" />
                <Text className="ml-2 text-blue-700">
                  {t.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Pressable>
              {showPickers[index] && (
                <DateTimePicker
                  value={t}
                  mode="time"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(e, selected) => handleTimeChange(index, e, selected)}
                />
              )}
            </View>
          ))}

          <Text className="text-blue-700 font-semibold mb-2 mt-4">
            Duration (in days)
          </Text>
          <TextInput
            keyboardType="number-pad"
            value={days}
            onChangeText={setDays}
            className="border border-gray-300 p-3 rounded-lg mb-4"
            placeholder="E.g. 7"
          />

          <Text className="text-blue-700 font-semibold mb-2">
            Custom Note (Optional)
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            multiline
            className="border border-gray-300 p-3 rounded-lg h-24 text-sm"
            placeholder="E.g. Take after food"
          />

          <Pressable
            onPress={scheduleReminders}
            className="bg-blue-600 mt-6 p-4 rounded-lg"
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
              const scheduled =
                await Notifications.getAllScheduledNotificationsAsync();
              console.log("📅 Scheduled Notifications:", JSON.stringify(scheduled, null, 2));
            }}
            className="mt-4 p-2 bg-yellow-400 rounded-md"
          >
            <Text className="text-center text-black font-semibold">
              Log Scheduled Reminders
            </Text>
          </Pressable>

          <Text className="text-lg font-semibold mt-6 text-blue-800">
            Scheduled Reminders:
          </Text>
          {reminders.length === 0 && (
            <Text className="text-gray-500 mt-2">No reminders set yet.</Text>
          )}

          {reminders.map((r, i) => (
            <View
              key={i}
              className="flex-row items-center justify-between mt-2 p-3 bg-blue-50 rounded-md"
            >
              <View>
                <Text className="text-blue-900 font-semibold">
                  {r.time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
                <Text className="text-sm text-blue-700">
                  {r.note || "No note added"}
                </Text>
              </View>
              <Ionicons name="notifications" size={20} color="#3B82F6" />
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
