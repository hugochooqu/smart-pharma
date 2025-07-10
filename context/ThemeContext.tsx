// context/ThemeContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, View } from 'react-native';
import { useColorScheme as useDeviceColorScheme } from 'nativewind';
import clsx from 'clsx';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children, initialTheme }: { children: ReactNode; initialTheme?: Theme }) => {
  const deviceTheme = useColorScheme() ?? 'light';
  const [theme, setTheme] = useState<Theme>(initialTheme ?? deviceTheme);
  const { setColorScheme } = useDeviceColorScheme();

  useEffect(() => {
    setColorScheme(theme); // This updates NativeWind
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <View className={clsx('flex-1', theme === 'dark' && 'dark')}>{children}</View>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used inside ThemeProvider');
  return context;
};
