import { Models } from "react-native-appwrite";

export type CustomInputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  rightIcon?: React.ReactNode; // 👈 add this
};

export interface CustomButtonProps {
    onPress?: () => void;
    title?: string;
    style?: string;
    leftIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
}

export interface CreateUserPrams {
    email: string;
    password: string;
    name: string;
}

export interface SignInParams {
    email: string;
    password: string;
}

export interface User extends Models.Document {
    name: string;
    email: string;
    avatar: string;
}

type ReminderConfig = {
  drugId: string;
  timesPerDay: number;
  times: string[]; // e.g. ['08:00', '14:00']
  durationDays: number;
  note?: string;
};


export interface ReccomendationParams {
    userId: string;
  symptoms: string[];
  customSymptoms: string;
  recommendations: string;
}

type HerbalRecommendation = {
  herb: string;
  effect: string;
  dosage: string;
};

type RecommendationHistory = {
  id: string;
  symptoms: any;
  customSymptoms: any;
  createdAt: any;
  recommendation: any;
};

type Reminder = {
  $id: string;
  frequencyPerDay: number;
  times: string[];
  note: string;
  startDate: string;
  durationDays: number;
  recommendationId: string;
};