import { View, Text, Alert, Pressable } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { signIn } from "@/lib/appwrite";
import useAuthStore from "@/store/auth.store";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { fetchAuthenticatedUser } = useAuthStore();

  const submit = async () => {
    const { email, password } = form;

    if (!email || !password) {
      setErrorMessage("Please enter a valid email address and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await signIn({ email, password });
      await fetchAuthenticatedUser();
      router.replace("/");
    } catch (error: any) {
      console.error("SignIn error:", error);
      setErrorMessage(error.message || "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
      {errorMessage ? (
        <View className="bg-red-100 border border-red-400 p-3 rounded-md">
          <Text className="text-red-700 font-medium">{errorMessage}</Text>
        </View>
      ) : null}

      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
        label="Email"
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) =>
          setForm((prev) => ({ ...prev, password: text }))
        }
        label="Password"
        secureTextEntry={!showPassword}
        rightIcon={
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#3B82F6"
            />
          </Pressable>
        }
      />

      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="text-lg text-gray-900">Don't have an account?</Text>
        <Link href="/sign-up" className="text-lg text-blue-600 font-medium">
          Sign Up
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
