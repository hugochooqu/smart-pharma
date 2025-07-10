// context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useDeviceColorScheme } from 'nativewind';
import clsx from 'clsx';

// 🟡 Make sure this comes BEFORE it’s used
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme?: Theme;
}) => {
  const deviceTheme = useColorScheme() ?? 'light';
  const [theme, setThemeState] = useState<Theme>(initialTheme ?? deviceTheme);
  const { setColorScheme } = useDeviceColorScheme();

  // Apply theme to NativeWind
  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  // Load theme from storage
  useEffect(() => {
    const loadStoredTheme = async () => {
      const stored = await AsyncStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
        setColorScheme(stored);
      }
    };

    loadStoredTheme();
  }, []);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    setColorScheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <View className={clsx('flex-1', theme === 'dark' && 'dark')}>{children}</View>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error('useThemeContext must be used inside ThemeProvider');
  return context;
};
