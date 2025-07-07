import { View, Text, KeyboardAvoidingView, ScrollView, Platform, Dimensions, ImageBackground, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Slot } from 'expo-router'
import { images } from '@/constants'
import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'

export default function _layout() {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView className="bg-white h-full" keyboardShouldPersistTaps="handled">
                <View className="w-full relative" style={{ height: Dimensions.get('screen').height / 3.00}}>
                    <ImageBackground source={images.loginGraphic} className="size-full rounded-b-xl" resizeMode='cover' />
                </View>
                <Slot />
            </ScrollView>
        </KeyboardAvoidingView>
  )
}