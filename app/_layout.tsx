import {Slot, SplashScreen, Stack} from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect} from "react";
import * as Notifications from 'expo-notifications';

import './global.css';
import useAuthStore from "@/store/auth.store";
import { registerForPushNotificationsAsync } from "@/utils/notifications";
import { ThemeProvider } from "@/context/ThemeContext";
import { useColorScheme } from "react-native";




export default function RootLayout() {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();
  const scheme = useColorScheme();

  const [fontsLoaded, error] = useFonts({
    "QuickSand-Bold": require('../assets/fonts/Quicksand-Bold.ttf'),
    "QuickSand-Medium": require('../assets/fonts/Quicksand-Medium.ttf'),
    "QuickSand-Regular": require('../assets/fonts/Quicksand-Regular.ttf'),
    "QuickSand-SemiBold": require('../assets/fonts/Quicksand-SemiBold.ttf'),
    "QuickSand-Light": require('../assets/fonts/Quicksand-Light.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  if (!fontsLoaded || isLoading) return null;

  

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* This will render all routes inside /app */}
        <Stack.Screen name="start" options={{headerShown: false}} />
      </Stack>
    </ThemeProvider>
  );
};
