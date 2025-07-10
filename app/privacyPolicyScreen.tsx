import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 px-4 pt-6">
      <ScrollView>
        <Text className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">
          🤔 Need Help?
        </Text>

        <Text className="text-base mb-2 text-gray-700 dark:text-gray-200">
          If you're experiencing issues or have questions, we're here to help.
        </Text>

        <Text className="text-lg font-semibold mt-4 text-blue-700 dark:text-blue-200">
          📩 Contact Support
        </Text>
        <Text className="text-base text-gray-700 dark:text-gray-300">
          Email: support@smartpharma.health
        </Text>
        <Text className="text-base text-gray-700 dark:text-gray-300 mb-2">
          Phone: +234-801-234-5678 (Mon–Fri, 9am–5pm)
        </Text>

        <Text className="text-lg font-semibold mt-4 text-blue-700 dark:text-blue-200">
          📱 App Tips
        </Text>
        <Text className="text-base text-gray-700 dark:text-gray-300">
          - Make sure notifications are enabled for reminders.
          {"\n"}- Keep the app updated for latest herbs and features.
          {"\n"}- Use “Symptoms” to get personalized herbal recommendations.
          {"\n"}- Use “Reminders” to stay on track daily.
        </Text>

        <Text className="text-lg font-semibold mt-4 text-blue-700 dark:text-blue-200">
          🌿 Herbal Guidance
        </Text>
        <Text className="text-base text-gray-700 dark:text-gray-300 mb-20">
          You can ask for alternative suggestions if you’re unsure about a recommendation.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
