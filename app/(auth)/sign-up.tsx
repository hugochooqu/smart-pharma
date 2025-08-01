import { View, Text, Button, Alert, Pressable } from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import { createUser } from "@/lib/appwrite";
import { Ionicons } from "@expo/vector-icons";


const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  
  const [form, setForm] = useState({name: "", email: "", password: "" });

  const submit = async () => {
    const {name, email, password } = form;

    if (!name || !email || !password)
      return Alert.alert(
        "Error",
        "Please enter valid email address & password."
      );

    setIsSubmitting(true);

    try {
      await createUser({email, password, name});

        router.replace('/');
    } catch(error: any) {
        Alert.alert('Error', error.message);
        // Sentry.captureEvent(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">
     <CustomInput
        placeholder="Enter your full name"
        value={form.name}
        onChangeText={(text) => setForm((prev) => ({ ...prev, name: text}))}
        label="Full Name"
      />
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        onChangeText={(text) => setForm((prev) => ({ ...prev, email: text}))}
        label="Email"
        keyboardType="email-address"
      />
      <CustomInput
  placeholder="Enter your password"
  value={form.password}
  onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
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
      <CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submit} />

      <View className="flex justify-center mt-5 flex-row gap-2">
        <Text className="text-lg text-gray-900">Already have an account?</Text>
        <Link href="/sign-in" className="text-lg text-blue-600">
          Sign In
        </Link>
      </View>
    </View>
  );
};

export default SignUp;
