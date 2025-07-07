import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import useAuthStore from "@/store/auth.store";

const profile = () => {
  const {user} = useAuthStore()
  return (
    <ScrollView className="flex-1 pr-4 pl-10 pt-20">
      <View className="flex flex-row items-center">
        <View className="w-[80px] h-[80px] rounded-xl justify-center items-center mr-16">
          <Image
            source={user?.avatar ? { uri: user.avatar } : undefined}
            className="size-32 rounded-full"
            resizeMode="contain"
          />
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-bold mb-2">{user?.name}</Text>
          <Text className="text-lg mb-2">{user?.email}</Text>
          <Text className="text-base">28 years old . 70 kg . 175cm</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default profile;
