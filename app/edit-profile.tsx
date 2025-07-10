import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Alert,
  KeyboardTypeOptions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useAuthStore from "@/store/auth.store";
import { updateUserProfile } from "@/lib/appwrite";

export default function EditProfileScreen() {
  const { user, fetchAuthenticatedUser } = useAuthStore();

  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.age?.toString() || "");
  const [weight, setWeight] = useState(user?.weight?.toString() || "");
  const [height, setHeight] = useState(user?.height?.toString() || "");
  const [avatar] = useState(user?.avatar || null); // future-proof for uploads
  const [uploading, setUploading] = useState(false);

  const fields: {
    label: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    keyboard?: KeyboardTypeOptions;
    icon?: keyof typeof Ionicons.glyphMap;
  }[] = [
    { label: "Full Name", value: name, setValue: setName, icon: "person-outline" },
    { label: "Age", value: age, setValue: setAge, keyboard: "number-pad", icon: "calendar-outline" },
    { label: "Weight (kg)", value: weight, setValue: setWeight, keyboard: "decimal-pad", icon: "fitness-outline" },
    { label: "Height (cm)", value: height, setValue: setHeight, keyboard: "decimal-pad", icon: "body-outline" },
  ];

  const hasChanges =
    name !== user?.name ||
    age !== user?.age?.toString() ||
    weight !== user?.weight?.toString() ||
    height !== user?.height?.toString();

  const handleSave = async () => {
    if (!user) return;

    setUploading(true);
    try {
      await updateUserProfile({
        userId: user.$id,
        name,
        age: Number(age),
        weight: Number(weight),
        height: Number(height),
        avatar,
      });
      await fetchAuthenticatedUser();
      Alert.alert("✅ Success", "Your profile has been updated.");
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("❌ Error", "Failed to update profile. Please try again.");
    }
    setUploading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black px-4 pt-8">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Avatar */}
        <View className="items-center mb-6">
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              className="w-28 h-28 rounded-full border-2 border-blue-500"
            />
          ) : (
            <View className="w-28 h-28 rounded-full bg-gray-300 dark:bg-gray-700 justify-center items-center border border-blue-500">
              <Ionicons name="person-outline" size={38} color="#555" />
            </View>
          )}
          <Text className="text-sm text-gray-500 mt-2">
            Profile photo (not editable yet)
          </Text>
        </View>

        {/* Inputs */}
        {fields.map((field, i) => (
          <View key={i} className="mb-4">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {field.label}
            </Text>
            <View className="flex-row items-center bg-gray-100 dark:bg-neutral-800 rounded-lg px-3 py-2">
              {field.icon && (
                <Ionicons name={field.icon} size={20} color="#3B82F6" className="mr-2" />
              )}
              <TextInput
                value={field.value}
                onChangeText={field.setValue}
                keyboardType={field.keyboard}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                placeholderTextColor="#888"
                returnKeyType="done"
                autoCapitalize="none"
                className="flex-1 text-black dark:text-white text-base"
              />
            </View>
          </View>
        ))}

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={!hasChanges || uploading}
          className={`p-4 rounded-lg mt-8 ${
            !hasChanges || uploading ? "bg-gray-400" : "bg-blue-600"
          }`}
        >
          <Text className="text-white text-center font-bold text-lg">
            {uploading ? "Saving..." : "Save Changes"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
