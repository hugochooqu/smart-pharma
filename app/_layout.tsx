import {Slot, SplashScreen, Stack} from "expo-router";
import { useFonts } from 'expo-font';
import { useEffect} from "react";
import * as Notifications from 'expo-notifications';

import './global.css';
import * as Sentry from '@sentry/react-native';
import useAuthStore from "@/store/auth.store";
import { registerForPushNotificationsAsync } from "@/utils/notifications";
import { ThemeProvider } from "@/context/ThemeContext";
import { useColorScheme } from "react-native";

Sentry.init({
  dsn: 'https://4a6840595bc6e27c282090b9b4570e45@o4508299493179392.ingest.de.sentry.io/4509629506060368',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});


export default Sentry.wrap(function RootLayout() {
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
});
