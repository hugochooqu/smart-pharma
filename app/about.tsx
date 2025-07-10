import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 px-4 pt-6">
      <ScrollView>
        <Text className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">
          ℹ️ About SmartPharma
        </Text>

        <Text className="text-base text-gray-700 dark:text-gray-300 mb-4">
          SmartPharma is an AI-powered herbal health companion designed to help you manage your wellness using trusted African herbal knowledge enhanced by modern science.
        </Text>

        <Text className="text-lg font-semibold text-blue-700 dark:text-blue-200">
          🎯 Our Mission
        </Text>
        <Text className="text-base text-gray-700 dark:text-gray-300 mb-4">
          We empower individuals with personalized, plant-based health solutions that are safe, natural, and effective.
        </Text>

        <Text className="text-lg font-semibold text-blue-700 dark:text-blue-200">
          🧠 How It Works
        </Text>
        <Text className="text-base text-gray-700 dark:text-gray-300 mb-4">
          Our AI interprets your symptoms and recommends herbs commonly found in Nigeria and Africa — complete with usage instructions.
        </Text>

        <Text className="text-lg font-semibold text-blue-700 dark:text-blue-200">
          📍 Built in Africa
        </Text>
        <Text className="text-base text-gray-700 dark:text-gray-300">
          SmartPharma is proudly developed in Nigeria, for Africans and global users seeking alternative health options.
        </Text>

        <Text className="text-lg font-semibold text-blue-700 dark:text-blue-200 mt-4">
          📬 Contact
        </Text>
        <Text className="text-base text-gray-700 dark:text-gray-300 mb-20">
          Email: hello@smartpharma.health
          {"\n"}Instagram: @smartpharma_app
          {"\n"}Twitter: @SmartPharmaNG
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
