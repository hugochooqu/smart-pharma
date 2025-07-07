import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
// import { getHerbalRecommendation } from '@/utils/gemini';

const commonSymptoms = [
  'Headache',
  'Fever',
  'Cold/Cough',
  'Fatigue',
  'Joint Pain',
  'Digestive Issues',
  'Skin Rash',
  'Insomnia',
  'Anxiety',
  'Back Pain',
];

export default function SymptomsScreen() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customSymptoms, setCustomSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState('');

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0 && customSymptoms.trim() === '') return;

    setLoading(true);

    const tagString = selectedTags.join(', ');
    const hasTags = tagString !== '';
    const hasCustom = customSymptoms.trim() !== '';

    let prompt = 'You are a certified herbalist.';

    if (hasTags && hasCustom) {
      prompt += ` A patient reports the following symptoms: ${tagString} and also describes: "${customSymptoms}".`;
    } else if (hasTags) {
      prompt += ` A patient reports the following symptoms: ${tagString}.`;
    } else if (hasCustom) {
      prompt += ` A patient describes their condition as: "${customSymptoms}".`;
    }

    prompt += ' Suggest a personalized herbal blend with dosage and precautions.';


    console.log(prompt)
    // const result = await getHerbalRecommendation(prompt);
    // setRecommendation(result);
    setLoading(false);
  };

  return (
    <ScrollView className="px-4 pt-12 bg-white h-full">
      <Text className="text-xl font-bold mb-4 text-blue-900">Describe your symptoms</Text>

      {/* Structured Tags */}
      <Text className="mb-2 text-blue-800 font-medium">Select common symptoms:</Text>
      <View className="flex-row flex-wrap mb-6">
        {commonSymptoms.map((symptom, index) => (
          <Pressable
            key={index}
            onPress={() => toggleTag(symptom)}
            className={`px-3 py-1 m-1 rounded-full border ${
              selectedTags.includes(symptom)
                ? 'bg-blue-500 border-blue-600'
                : 'bg-white border-blue-300'
            }`}
          >
            <Text
              className={`text-sm ${
                selectedTags.includes(symptom) ? 'text-white' : 'text-blue-700'
              }`}
            >
              {symptom}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Free-form Input */}
      <Text className="text-blue-800 font-medium mb-1">Add more detail (optional):</Text>
      <TextInput
        className="border border-blue-400 p-4 rounded-md mb-4 h-32 text-base"
        multiline
        value={customSymptoms}
        onChangeText={setCustomSymptoms}
        placeholder="E.g. I've had persistent muscle soreness for over a week..."
      />

      {/* Submit */}
      <Pressable
        disabled={selectedTags.length === 0 && customSymptoms.trim() === ''}
        className={`p-3 rounded-md ${
          selectedTags.length === 0 && customSymptoms.trim() === ''
            ? 'bg-gray-400'
            : 'bg-blue-600'
        }`}
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-semibold">Get Recommendation</Text>
      </Pressable>

      {/* Spinner */}
      {loading && <ActivityIndicator className="mt-4" size="large" color="#3B82F6" />}

      {/* AI Output */}
      {recommendation !== '' && (
        <View className="mt-6 bg-blue-50 p-4 rounded-lg">
          <Text className="text-lg font-medium mb-2 text-blue-800">AI Herbal Blend:</Text>
          <Text className="text-base text-blue-900">{recommendation}</Text>
        </View>
      )}
    </ScrollView>
  );
}
