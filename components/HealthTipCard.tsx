import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchHealthTipFromAI } from "@/utils/gemini";


export default function HealthTipCard() {
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getTip = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await fetchHealthTipFromAI();
      setTip(result);
    } catch (err: any) {
      setError("Failed to load tip. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTip();
  }, []);

  return (
    <View className="bg-blue-100 dark:bg-blue-900 p-4 rounded-xl mt-4">
      <View className="flex-row items-start">
        <Ionicons name="bulb-outline" size={24} color="#3b82f6" />
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-black dark:text-white mb-1">
            Daily Health Tip 💡
          </Text>

          {loading ? (
            <ActivityIndicator color="#3b82f6" />
          ) : error ? (
            <Text className="text-sm text-red-500">{error}</Text>
          ) : (
            <Text className="text-sm text-gray-700 dark:text-gray-300">
              {tip}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
