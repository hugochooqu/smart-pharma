// import { View, Text, ActivityIndicator, Alert } from "react-native";
// import { useRouter } from "expo-router";
// import { useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as LocalAuthentication from "expo-local-authentication";

// export default function StartScreen() {
//   const router = useRouter();

//   useEffect(() => {
//     const checkBiometricAndProceed = async () => {
//       const isEnabled = await AsyncStorage.getItem("biometric_enabled");

//       if (isEnabled === "true") {
//         const result = await LocalAuthentication.authenticateAsync({
//           promptMessage: "Login with Biometrics",
//           fallbackLabel: "Use passcode",
//         });

//         if (result.success) {
//           // ✅ Proceed to app
//           router.replace("/(tabs)");
//         } else {
//           Alert.alert("Authentication failed", "Redirecting to login screen.");
//           router.replace("/(auth)/sign-in");
//         }
//       } else {
//         // ⛔ No biometric login — show regular login
//         router.replace("/(auth)/sign-in");
//       }
//     };

//     checkBiometricAndProceed();
//   }, []);

//   return (
//     <View className="flex-1 justify-center items-center bg-white dark:bg-black">
//       <ActivityIndicator size="large" color="#3B82F6" />
//       <Text className="mt-4 text-blue-700 dark:text-white text-base">
//         Checking security...
//       </Text>
//     </View>
//   );
// }

// app/(intro)/IntroScreen.tsx
import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";

export default function IntroScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/"); // Replace with your main tab route
    }, 2500); // 2.5 seconds splash screen

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-slate-900">
      {/* <Image
        source={require("@/assets/logo.png")} // Add your logo image
        className="w-32 h-32 mb-4"
        resizeMode="contain"
      /> */}
      <Text className="text-2xl font-bold text-blue-700 dark:text-blue-300">
        SmartPharma
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 mt-2">
        Personalized Herbal Health
      </Text>
    </View>
  );
}

