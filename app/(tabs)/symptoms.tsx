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
  const [recommendation, setRecommendation] = useState<HerbalRecommendation[]>(
    []
  );
  const [history, setHistory] = useState<RecommendationHistory[]>([]);
  const [acceptedIds, setAcceptedIds] = useState<number[]>([]);

  const { user } = useAuthStore();
  const userId = user?.$id;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0 && customSymptoms.trim() === "") return;

    setLoading(true);

    const tagString = selectedTags.join(", ");
    const hasTags = tagString !== "";
    const hasCustom = customSymptoms.trim() !== "";

    let coreSymptoms = "";
    if (hasTags && hasCustom) {
      coreSymptoms = `${tagString}, and also: ${customSymptoms}`;
    } else if (hasTags) {
      coreSymptoms = tagString;
    } else {
      coreSymptoms = customSymptoms;
    }

    const prompt = `You are a certified nigerian herbalist.

Given the following symptoms: ${coreSymptoms}.


Do not include introductions, explanations, or disclaimers. Be straight to the point. 

Provide a list of suitable herbs that are common to find in africa, particularly nigeria with the following structure in **pure JSON array format**. Do not add any text before or after the JSON. Just return raw JSON.

Each herb should be an object with:
- "herb": name of the herb
- "effect": 1-2 lines about its benefit
- "dosage": preparation or dosage instructions

Example format:

[
  {
    "herb": "Ginger",
    "effect": "Reduces inflammation and boosts immunity",
    "dosage": "1 tsp grated root in hot water, twice daily"
  },
  {
    "herb": "Moringa",
    "effect": "Supports energy and nutrient levels",
    "dosage": "2 capsules (500mg) once daily"
  }
]
`;
    const result = await getHerbalRecommendation(prompt);
    console.log("🤖 Raw AI result:", result);

    let parsedResult;

    try {
      const cleaned = result
        .trim()
        .replace(/^```json/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

      parsedResult = JSON.parse(cleaned);
      console.log("✅ Parsed result:", parsedResult);
      setRecommendation(parsedResult);
    } catch (error) {
      console.error("❌ Failed to parse recommendation:", error);
      console.log("🔍 Raw content:", result);
    }

    setLoading(false);
  };

  const handleAcceptOne = async (item: HerbalRecommendation, index: number) => {
    try {
      if (!userId) throw new Error("User ID is missing");

      await saveRecommendations({
        userId,
        symptoms: selectedTags,
        customSymptoms,
        recommendations: JSON.stringify([item]), // Save only 1
      });

      setAcceptedIds((prev) => [...prev, index]);

      // Remove it from UI
      setRecommendation((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error("❌ Failed to save one recommendation", err);
    }
  };

  const handleRejectOne = (index: number) => {
    setRecommendation((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAcceptAll = async () => {
    setLoading(true);
    try {
      if (!userId) throw new Error("User ID is missing");
      await saveRecommendations({
        userId,
        symptoms: selectedTags,
        customSymptoms,
        recommendations: JSON.stringify(recommendation),
      });
    } catch (err) {
      console.error("❌ Failed to save to Appwrite", err);
    }

    setRecommendation([]);
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      if (!userId) throw new Error("User ID is missing");
      const data = await fetchUserRecommendations(userId);
      console.log(data)
      setHistory(data); // history = useState([])
    };

    loadData();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
        <ScrollView
          className="px-4 pt-12 bg-white dark:bg-slate-900"
          contentContainerStyle={{ paddingBottom: 120 }}
        >
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

          {loading && (
            <ActivityIndicator className="mt-4" size="large" color="#3B82F6" />
          )}

          {recommendation.length > 0 && (
            <View className="mt-6 bg-blue-50 dark:bg-gray-800 p-4 rounded-lg pb-20">
              <Text className="text-lg font-medium mb-4 text-blue-800 dark:text-blue-300">
                AI Herbal Blend:
              </Text>

              {recommendation.map((item, index) => (
                <View
                  key={index}
                  className="mb-4 p-3 bg-white dark:bg-gray-900 rounded-lg shadow"
                >
                  <Text className="text-blue-900 dark:text-blue-200 font-semibold text-base">
                    🌿 {item.herb}
                  </Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-300">
                    Effect: {item.effect}
                  </Text>
                  <Text className="text-sm text-gray-700 dark:text-gray-300">
                    Dosage: {item.dosage}
                  </Text>

                  <View className="flex-row mt-3 justify-between">
                    <Pressable
                      onPress={() => handleAcceptOne(item, index)}
                      className="bg-green-500 px-4 py-2 rounded-md"
                    >
                      <Text className="text-white font-medium">Accept</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleRejectOne(index)}
                      className="bg-red-500 px-4 py-2 rounded-md"
                    >
                      <Text className="text-white font-medium">Reject</Text>
                    </Pressable>
                  </View>
                </View>
              ))}

              <Pressable
                onPress={handleAcceptAll}
                className="bg-blue-600 p-3 mt-6 rounded-lg"
              >
                <Text className="text-white text-center font-semibold">
                  Accept All
                </Text>
              </Pressable>
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
                    Extra: {entry.customSymptoms as string}
                  </Text>
                )}
                {Array.isArray(entry.recommendation) &&
                  entry.recommendation.map((r, i) => (
                    <View
                      key={i}
                      className="mb-2"
                    >
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
