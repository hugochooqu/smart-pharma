import {View, Text, TextInput} from 'react-native'
import {CustomInputProps} from "@/type";
import {useState} from "react";
import cn from "clsx";

const CustomInput = ({
    placeholder = 'Enter text',
    value,
    onChangeText,
    label,
    secureTextEntry = false,
    keyboardType="default"
}: CustomInputProps) => {
    const [isFocused, setIsFocused] = useState(false);


    return (
        <View className="w-full">
            <Text className="text-base text-start w-full  text-gray-500 pl-2">{label}</Text>

            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                placeholderTextColor="#888"
                className={cn('text-dark-100 border-b leading-5 rounded-lg p-3 w-full', isFocused ? 'border-blue-500' : 'border-gray-300')}
            />
        </View>
    )
}
export default CustomInput