import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";

export default function StartScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkBiometricAndProceed = async () => {
      const isEnabled = await AsyncStorage.getItem("biometric_enabled");

      if (isEnabled === "true") {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Login with Biometrics",
          fallbackLabel: "Use passcode",
        });

        if (result.success) {
          // ✅ Proceed to app
          router.replace("/(tabs)");
        } else {
          Alert.alert("Authentication failed", "Redirecting to login screen.");
          router.replace("/(auth)/sign-in");
        }
      } else {
        // ⛔ No biometric login — show regular login
        router.replace("/(auth)/sign-in");
      }
    };

    checkBiometricAndProceed();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-black">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-4 text-blue-700 dark:text-white text-base">
        Checking security...
      </Text>
    </View>
  );
}
