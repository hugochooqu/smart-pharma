import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Switch,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import useAuthStore from "@/store/auth.store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeContext } from "@/context/ThemeContext";
import { router } from "expo-router";

const ProfileScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const { theme, setTheme } = useThemeContext();
  const { user, logout } = useAuthStore();

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withSpring(0);
  }, []);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: slideAnim.value }],
  }));

  const ProfileCard = ({ title, subtitle, icon, onPress }: any) => {
    const scaleAnim = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleAnim.value }],
    }));

    return (
      <TouchableOpacity
        onPressIn={() => (scaleAnim.value = withSpring(0.98))}
        onPressOut={() => (scaleAnim.value = withSpring(1))}
        onPress={onPress}
        className="mb-3 rounded-xl bg-white dark:bg-neutral-800 shadow"
      >
        <Animated.View
          style={animatedStyle}
          className="flex-row items-center px-4 py-3"
        >
          <View className="bg-blue-600 p-2 rounded-full mr-3">
            <Ionicons name={icon} size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-neutral-800 dark:text-white">
              {title}
            </Text>
            <Text className="text-sm text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#aaa" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const SettingItem = ({
    title,
    subtitle,
    icon,
    value,
    onValueChange,
  }: any) => {
    const scaleAnim = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleAnim.value }],
    }));

    return (
      <TouchableOpacity
        onPressIn={() => (scaleAnim.value = withSpring(0.98))}
        onPressOut={() => (scaleAnim.value = withSpring(1))}
        className="mb-3 rounded-xl bg-white dark:bg-neutral-800 shadow"
      >
        <Animated.View
          style={animatedStyle}
          className="flex-row items-center px-4 py-3"
        >
          <View className="bg-blue-600 p-2 rounded-full mr-3">
            <Ionicons name={icon} size={20} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-neutral-800 dark:text-white">
              {title}
            </Text>
            <Text className="text-sm text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </Text>
          </View>
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: "#ccc", true: "#3B82F6" }}
            thumbColor={value ? "white" : "#999"}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
        <ScrollView
          className="flex-1 px-4 pt-12 bg-white dark:bg-slate-900"
          contentContainerStyle={{ paddingBottom: 120 }} // ✅ prevents hiding under tab
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View style={fadeStyle}>
            <View className="flex-row items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-blue-600 justify-center items-center mr-4">
                <Ionicons name="person" size={40} color="white" />
              </View>
              <View>
                <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {user?.name}
                </Text>
                <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                  {user?.email}
                </Text>
                <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                  {`${user?.age || 0} yrs • ${user?.weight || 0} kg • ${user?.height || 0} cm`}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Stats */}
          <Animated.View
            style={slideStyle}
            className="flex-row justify-between mb-6"
          >
            {[
              { label: "Days Streak", value: "7" },
              { label: "Adherence", value: "85%" },
              { label: "Medications", value: "12" },
            ].map((stat, i) => (
              <View
                key={i}
                className="flex-1 bg-white dark:bg-neutral-800 mx-1 p-4 rounded-xl items-center shadow"
              >
                <Text className="text-xl font-bold text-neutral-900 dark:text-white">
                  {stat.value}
                </Text>
                <Text className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                  {stat.label}
                </Text>
              </View>
            ))}
          </Animated.View>

          {/* Profile Section */}
          <Animated.View style={slideStyle}>
            <Text className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Profile
            </Text>
            <ProfileCard
              title="Edit Profile"
              subtitle="Update your personal info"
              icon="person-outline"
              onPress={() => router.push("/edit-profile")}
            />
            {/* <ProfileCard
              title="Medical History"
              subtitle="View health records"
              icon="medical-outline"
            />
            <ProfileCard
              title="Allergies"
              subtitle="Manage sensitivities"
              icon="warning-outline"
            />
            <ProfileCard
              title="Emergency Contacts"
              subtitle="Set emergency numbers"
              icon="call-outline"
            /> */}
          </Animated.View>

          {/* Settings */}
          <Animated.View style={slideStyle} className="mt-6">
            <Text className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Settings
            </Text>
            <SettingItem
              title="Push Notifications"
              subtitle="Reminders about medications"
              icon="notifications-outline"
              value={notifications}
              onValueChange={setNotifications}
            />
            <SettingItem
              title="Dark Mode"
              subtitle="Toggle theme"
              icon="moon-outline"
              value={theme === "dark"}
              onValueChange={(value: boolean) =>
                setTheme(value ? "dark" : "light")
              }
            />
          </Animated.View>

          {/* Help & Legal */}
          <Animated.View style={slideStyle} className="mt-6">
            <Text className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Info
            </Text>
            <ProfileCard
              title="Help & Support"
              subtitle="Reach out for assistance"
              icon="help-circle-outline"
              onPress={() => router.push("/helpScreen")}
            />
            <ProfileCard
              title="Privacy Policy"
              subtitle="How we handle your data"
              icon="shield-outline"
              onPress={() => router.push("/privacyPolicyScreen")}
            />
            <ProfileCard
              title="About SmartPharma"
              subtitle="Version 1.0.0"
              icon="information-circle-outline"
              onPress={() => router.push("/about")}
            />
          </Animated.View>

          {/* Logout */}

          <Animated.View style={slideStyle} className="my-8">
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Confirm Logout",
                  "Are you sure you want to log out?",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Logout",
                      style: "destructive",
                      onPress: async () => {
                        await logout();
                        router.replace("/sign-in");
                      },
                    },
                  ],
                  { cancelable: true }
                )
              }
              className="bg-red-600 py-4 rounded-xl items-center flex-row justify-center"
            >
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                Log Out
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;
