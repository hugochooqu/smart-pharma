import { colors, quickNav } from "@/constants";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Fragment } from "react";

export default function Index() {
  const QuickActionCard = ({ id, title, subtitle, icon, color }: any) => {
    return (
      <Pressable className="flex-1 m-2 p-5 bg-white rounded-xl shadow-lg shadow-slate-600 items-center justify-center ">
        {({ pressed }) => (
          <Fragment>
            <View
              className="w-16 h-16 rounded-full justify-center items-center mb-3"
              style={{ backgroundColor: color }}
            >
              <Ionicons name={icon} size={24} color="white" />
            </View>
            <Text className="text-gray-900 font-bold text-lg text-center">
              {title}
            </Text>
            <Text className="text-gray-700 text-center">{subtitle}</Text>
          </Fragment>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={quickNav}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <QuickActionCard
            id={item.id}
            title={item.title}
            subtitle={item.subtitle}
            icon={item.icon}
            color={colors[item.color as keyof typeof colors]}
          />
        )}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
        ListHeaderComponent={() => (
          <View>
            <View className="px-6 pt-6 pb-2 flex flex-row justify-between">
              <Text className=" text-3xl font-semibold">Hello user</Text>
              <Text className=" text-3xl font-semibold">Profile pics</Text>
            </View>
            <Text className="px-6 text-lg font-semibold text-gray-400">
              Let&apos;s take care of your health today
            </Text>
            <Text className="text-2xl font-bold text-neutral-600 p-6">
              Quick Actions
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
