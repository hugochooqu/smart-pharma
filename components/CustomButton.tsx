import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native'
import React from 'react'
import {CustomButtonProps} from "@/type";
import cn from "clsx";

const CustomButton = ({
    onPress,
    title="Click Me",
    style,
    textStyle,
    leftIcon,
    isLoading = false
}: CustomButtonProps) => {
    return (
        <TouchableOpacity className={cn('rounded-full p-3 w-full flex flex-row justify-center bg-blue-500', style)} onPress={onPress}>
            {leftIcon}

            <View className="flex-center flex-row">
                {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                ): (
                    <Text className={cn('text-white text-base font-semibold', textStyle)}>
                        {title}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    )
}
export default CustomButton