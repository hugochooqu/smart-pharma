import React, { useState, useEffect } from "react";
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
import useAuthStore from "@/store/auth.store";
import { updateUserProfile } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";

export default function EditProfileScreen() {
  const { user, fetchAuthenticatedUser } = useAuthStore();

  const [name, setName] = useState(user?.name || "");
  const [age, setAge] = useState(user?.age?.toString() || "");
  const [weight, setWeight] = useState(user?.weight?.toString() || "");
  const [height, setHeight] = useState(user?.height?.toString() || "");
  const [avatar] = useState(user?.avatar || null); // Read-only
  const [uploading, setUploading] = useState(false);

  const fields: {
    label: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    keyboard?: KeyboardTypeOptions;
  }[] = [
    { label: "Name", value: name, setValue: setName },
    { label: "Age", value: age, setValue: setAge, keyboard: "number-pad" },
    {
      label: "Weight (kg)",
      value: weight,
      setValue: setWeight,
      keyboard: "decimal-pad",
    },
    {
      label: "Height (cm)",
      value: height,
      setValue: setHeight,
      keyboard: "decimal-pad",
    },
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
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Update failed:", error);
      Alert.alert("Error", "Something went wrong while updating profile.");
    }
    setUploading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black px-4 pt-8">
      <ScrollView>
        {/* Avatar (read-only) */}
        <View className="items-center mb-6">
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600 justify-center items-center">
              <Ionicons name="person" size={32} color="#888" />
            </View>
          )}
          <Text className="text-sm text-gray-500 mt-2">Profile photo</Text>
        </View>

        {/* Editable Fields */}
        {fields.map((field, i) => (
          <View key={i} className="mb-4">
            <Text className="text-sm text-neutral-600 dark:text-neutral-300 mb-1">
              {field.label}
            </Text>
            <TextInput
              value={field.value}
              onChangeText={field.setValue}
              keyboardType={field.keyboard}
              className="p-3 rounded-lg bg-gray-100 dark:bg-neutral-800 text-black dark:text-white"
            />
          </View>
        ))}

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={!hasChanges || uploading}
          className={`p-4 rounded-lg mt-6 ${
            !hasChanges || uploading ? "bg-gray-400" : "bg-blue-600"
          }`}
        >
          <Text className="text-center text-white font-bold text-lg">
            {uploading ? "Saving..." : "Save Changes"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
