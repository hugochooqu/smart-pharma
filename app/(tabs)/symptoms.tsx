import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { getHerbalRecommendation } from "@/utils/gemini";
import { fetchUserRecommendations, saveRecommendations } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";
import { HerbalRecommendation, RecommendationHistory } from "@/type";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const commonSymptoms = [
  "Headache",
  "Fever",
  "Cold/Cough",
  "Fatigue",
  "Joint Pain",
  "Digestive Issues",
  "Skin Rash",
  "Insomnia",
  "Anxiety",
  "Back Pain",
];

export default function SymptomsScreen() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customSymptoms, setCustomSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<HerbalRecommendation[]>([]);
  const [history, setHistory] = useState<RecommendationHistory[]>([]);

  const { user } = useAuthStore();
  const userId = user?.$id;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const buildPrompt = (coreSymptoms: string) => {
    return `You are a certified Nigerian herbalist.

Given these symptoms: ${coreSymptoms}

Do not include explanations or text, just return one herbal recommendation in **pure JSON** format.

This recommendation can either be:
- A single herb that works well, OR
- A blend (mixture) of herbs that work together.

Return only one object, structured like this:

{
  "herb": "Ginger + Clove + Lemon",
  "effect": "Helps with cold symptoms, boosts immunity and soothes throat",
  "dosage": "Boil all together in 500ml water and drink twice daily"
}

Do NOT wrap in an array or add markdown. Just return this single JSON object.`;
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0 && customSymptoms.trim() === "") return;

    setLoading(true);

    const tagString = selectedTags.join(", ");
    const coreSymptoms = tagString && customSymptoms
      ? `${tagString}, and also: ${customSymptoms}`
      : tagString || customSymptoms;

    const prompt = buildPrompt(coreSymptoms);
    const result = await getHerbalRecommendation(prompt);

    try {
      const cleaned = result
        .trim()
        .replace(/^```json/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      setRecommendation([parsed]); // Always store as an array for consistent rendering
    } catch (error) {
      console.error("❌ Failed to parse recommendation:", error);
    }

    setLoading(false);
  };

  const handleAcceptOne = async (item: HerbalRecommendation) => {
    try {
      if (!userId) throw new Error("User ID is missing");

      await saveRecommendations({
        userId,
        symptoms: selectedTags,
        customSymptoms,
        recommendations: JSON.stringify([item]),
      });

      setRecommendation([]);
      setSelectedTags([]);
      setCustomSymptoms('') // Clear current view

      const data = await fetchUserRecommendations(userId); // Refresh history
      setHistory(data);
    } catch (err) {
      console.error("❌ Failed to save one recommendation", err);
    }
  };

  const handleReject = () => setRecommendation([]);

  useEffect(() => {
    const loadHistory = async () => {
      if (!userId) return;
      const data = await fetchUserRecommendations(userId);
      setHistory(data);
    };

    loadHistory();
  }, [userId]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
        <ScrollView className="px-4 pt-12" contentContainerStyle={{ paddingBottom: 120 }}>
          <Text className="text-xl font-bold mb-4 text-blue-900 dark:text-blue-200">
            Describe your symptoms
          </Text>

          <Text className="mb-2 text-blue-800 dark:text-blue-300 font-medium">
            Select common symptoms:
          </Text>
          <View className="flex-row flex-wrap mb-6">
            {commonSymptoms.map((symptom, index) => (
              <Pressable
                key={index}
                onPress={() => toggleTag(symptom)}
                className={`px-3 py-1 m-1 rounded-full border ${
                  selectedTags.includes(symptom)
                    ? "bg-blue-500 border-blue-600"
                    : "bg-gray-100 dark:bg-gray-800 border-blue-300"
                }`}
              >
                <Text
                  className={`text-sm ${
                    selectedTags.includes(symptom)
                      ? "text-white"
                      : "text-blue-700 dark:text-blue-300"
                  }`}
                >
                  {symptom}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text className="text-blue-800 dark:text-blue-300 font-medium mb-1">
            Add more detail (optional):
          </Text>
          <TextInput
            className="border border-blue-400 dark:border-blue-300 p-4 rounded-md mb-4 h-32 text-base text-black dark:text-white bg-white dark:bg-gray-900"
            multiline
            value={customSymptoms}
            onChangeText={setCustomSymptoms}
            placeholder="E.g. I've had persistent muscle soreness for over a week..."
            placeholderTextColor="#888"
          />

          <Pressable
            disabled={selectedTags.length === 0 && customSymptoms.trim() === ""}
            className={`p-3 rounded-md ${
              selectedTags.length === 0 && customSymptoms.trim() === ""
                ? "bg-gray-400"
                : "bg-blue-600"
            }`}
            onPress={handleSubmit}
          >
            <Text className="text-white text-center font-semibold">
              Get Recommendation
            </Text>
          </Pressable>

          {loading && <ActivityIndicator className="mt-4" size="large" color="#3B82F6" />}

          {recommendation.length > 0 && (
            <View className="mt-6 bg-blue-50 dark:bg-gray-800 p-4 rounded-lg pb-20">
              <Text className="text-lg font-medium mb-4 text-blue-800 dark:text-blue-300">
                AI Herbal Blend:
              </Text>

              {recommendation.map((item, index) => (
                <View key={index} className="mb-4 p-3 bg-white dark:bg-gray-900 rounded-lg shadow">
                  <Text className="text-blue-900 dark:text-blue-200 font-semibold text-base">
                    🌿 {item.herb}
                  </Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-300">
                    Effect: {item.effect}
                  </Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-300">
                    Dosage: {item.dosage}
                  </Text>

                  <View className="flex-row mt-3 justify-between flex-wrap gap-2">
                    <Pressable
                      onPress={() => handleAcceptOne(item)}
                      className="bg-green-500 px-4 py-2 rounded-md"
                    >
                      <Text className="text-white font-medium">Accept</Text>
                    </Pressable>
                    <Pressable
                      onPress={handleReject}
                      className="bg-red-500 px-4 py-2 rounded-md"
                    >
                      <Text className="text-white font-medium">Reject</Text>
                    </Pressable>
                    <Pressable
                      onPress={handleSubmit}
                      className="bg-yellow-500 px-4 py-2 rounded-md"
                    >
                      <Text className="text-white font-medium">Another Option</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View className="pt-6">
            <Text className="text-xl font-semibold py-4 text-blue-900 dark:text-blue-200">
              Recommendations:
            </Text>
            {history.map((entry) => (
              <Pressable
                key={entry.id}
                className="mb-4 p-3 bg-blue-50 dark:bg-gray-800 rounded-lg"
                onPress={() =>
                  router.push({
                    pathname: "/reminders",
                    params: { recommendationId: entry.id },
                  })
                }
              >
                <Text className="text-blue-900 dark:text-blue-100 font-semibold mb-1">
                  Symptoms: {(entry.symptoms as string[]).join(", ")}
                </Text>
                {entry.customSymptoms && (
                  <Text className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    Extra: {entry.customSymptoms}
                  </Text>
                )}
                {Array.isArray(entry.recommendation) &&
                  entry.recommendation.map((r, i) => (
                    <View key={i} className="mb-2">
                      <Text className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        🌿 {r.herb}
                      </Text>
                      <Text className="text-xs text-gray-700 dark:text-gray-300">
                        Effect: {r.effect}
                      </Text>
                      <Text className="text-xs text-gray-700 dark:text-gray-300">
                        Dosage: {r.dosage}
                      </Text>
                    </View>
                  ))}
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
