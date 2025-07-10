import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/context/ThemeContext";
import {
  fetchRemindersForRecommendation,
  fetchIntakeLogs,
} from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import HealthTipCard from "@/components/HealthTipCard";

const { width } = Dimensions.get("window");

export default function ProgressScreen() {
  const { theme } = useThemeContext();
  const { user } = useAuthStore();

  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week");
  const [dosesTaken, setDosesTaken] = useState(0);
  const [dosesExpected, setDosesExpected] = useState(0);
  const [adherenceRate, setAdherenceRate] = useState(0);
  const [streak, setStreak] = useState(0);

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, []);

  useEffect(() => {
    const computeProgress = async () => {
      if (!user?.$id) return;

      try {
        const reminders = await fetchRemindersForRecommendation(user.$id) || [];
        const logs = await fetchIntakeLogs(user.$id) || [];

        const today = new Date();
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(today.getDate() - i);
          d.setHours(0, 0, 0, 0);
          return d;
        });

        let totalTaken = 0;
        let totalExpected = 0;
        let streakCounter = 0;

        for (const day of last7Days) {
          const dayStart = new Date(day);
          const dayEnd = new Date(day);
          dayEnd.setHours(23, 59, 59, 999);

          const logsForDay = logs.filter((log: any) => {
            const takenAt = log?.takenAt ? new Date(log.takenAt) : null;
            return takenAt && takenAt >= dayStart && takenAt <= dayEnd;
          });

          let expectedForDay = 0;
          for (const rem of reminders) {
            if (!rem?.startDate || !rem?.durationDays || !rem?.frequencyPerDay) continue;

            const remStart = new Date(rem.startDate);
            remStart.setHours(0, 0, 0, 0);

            const remEnd = new Date(rem.startDate);
            remEnd.setDate(remEnd.getDate() + Number(rem.durationDays) - 1);
            remEnd.setHours(23, 59, 59, 999);

            const isActive = dayStart >= remStart && dayStart <= remEnd;
            if (isActive) {
              expectedForDay += Number(rem.frequencyPerDay || 0);
            }
          }

          totalTaken += logsForDay.length;
          totalExpected += expectedForDay;

          if (expectedForDay > 0 && logsForDay.length >= expectedForDay) {
            streakCounter += 1;
          } else {
            break;
          }
        }

        setDosesTaken(totalTaken);
        setDosesExpected(totalExpected);
        setAdherenceRate(
          totalExpected > 0 ? Math.round((totalTaken / totalExpected) * 100) : 0
        );
        setStreak(streakCounter);
      } catch (error) {
        console.error("❌ Error computing progress:", error);
      }
    };

    computeProgress();
  }, [user?.$id]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fadeAnim.value }));
  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value }],
  }));

  const ProgressCard = ({ title, value, subtitle, icon, color }: any) => {
    const scaleAnim = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleAnim.value }],
    }));

    return (
      <TouchableOpacity
        onPressIn={() => (scaleAnim.value = withSpring(0.95))}
        onPressOut={() => (scaleAnim.value = withSpring(1))}
        className="w-[47%] mb-4 rounded-xl bg-white dark:bg-neutral-800 shadow"
        activeOpacity={0.9}
      >
        <Animated.View style={animatedStyle} className="flex-row items-center p-4">
          <View
            className={`w-10 h-10 rounded-full mr-3 justify-center items-center`}
            style={{ backgroundColor: color }}
          >
            <Ionicons name={icon} size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-black dark:text-white">{value}</Text>
            <Text className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {title}
            </Text>
            <Text className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const PeriodSelector = () => (
    <View className="flex-row mb-4">
      {["week", "month"].map((period) => (
        <TouchableOpacity
          key={period}
          onPress={() => setSelectedPeriod(period as "week" | "month")}
          className={`flex-1 mx-1 py-2 rounded-full items-center ${
            selectedPeriod === period ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          <Text
            className={`text-sm font-semibold ${
              selectedPeriod === period ? "text-white" : "text-black dark:text-white"
            }`}
          >
            {period === "week" ? "Week" : "Month"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [5, 6, 4, 3, 2, 3, 2].map((d) => isNaN(d) ? 0 : d),
        color: () => "#3b82f6",
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: () => "#3b82f6",
    labelColor: () => "#3b82f6",
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#2563eb",
    },
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-slate-900 px-4 pt-10" contentContainerStyle={{ paddingBottom: 120 }}>
      <Animated.View style={fadeStyle}>
        <Text className="text-2xl font-bold mb-1 text-black dark:text-white">Your Health Progress</Text>
        <Text className="text-base text-gray-600 dark:text-gray-400 mb-6">
          Track your symptoms and medication adherence
        </Text>
      </Animated.View>

      <Animated.View style={slideStyle}>
        <Text className="text-lg font-semibold text-black dark:text-white mb-4">
          This Week's Overview
        </Text>
        <View className="flex-row flex-wrap justify-between">
          <ProgressCard
            title="Doses Taken"
            value={`${dosesTaken ?? 0}/${dosesExpected ?? 0}`}
            subtitle={`${isNaN(adherenceRate) ? 0 : adherenceRate}% adherence`}
            icon="checkmark-circle"
            color="#22c55e"
          />
          <ProgressCard
            title="Days Streak"
            value={streak ?? 0}
            subtitle={streak >= 7 ? "Perfect week!" : `${streak} day streak`}
            icon="flame"
            color="#f59e0b"
          />
          <ProgressCard
            title="Symptom Relief"
            value="N/A"
            subtitle="(Track manually)"
            icon="trending-up"
            color="#3b82f6"
          />
          <ProgressCard
            title="Side Effects"
            value="0"
            subtitle="(Logging coming soon)"
            icon="warning"
            color="#ef4444"
          />
        </View>
      </Animated.View>

      <Animated.View style={slideStyle} className="mt-6">
        <Text className="text-lg font-semibold text-black dark:text-white mb-4">
          Symptom Severity Trend
        </Text>
        <PeriodSelector />
        <View className="rounded-xl overflow-hidden bg-white dark:bg-neutral-800 p-2">
          <LineChart
            data={lineChartData}
            width={width - 48}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>
      </Animated.View>

      <Animated.View style={slideStyle} className="mt-8">
        <Text className="text-lg font-semibold text-black dark:text-white mb-4">
          Current Symptom Levels
        </Text>
        <View className="bg-gray-100 dark:bg-neutral-800 rounded-xl p-6 items-center justify-center min-h-[180px]">
          <Text className="text-base font-semibold text-black dark:text-white mb-2">
            Symptom Radar Chart
          </Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Visualization coming soon
          </Text>
        </View>
      </Animated.View>

      <Animated.View style={slideStyle} className="mt-8 mb-16">
        <HealthTipCard />
      </Animated.View>
    </ScrollView>
  );
}
