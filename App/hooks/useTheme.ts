import { useColorScheme as useNativeWindColorScheme } from "nativewind";

export function useTheme() {
  const { colorScheme, toggleColorScheme, setColorScheme } = useNativeWindColorScheme();
  
  return {
    isDark: colorScheme === 'dark',
    colorScheme,
    toggleTheme: toggleColorScheme,
    setTheme: setColorScheme,
    colors: {
        bg: colorScheme === 'dark' ? '#121212' : '#F2F2EB', // dark.bg vs beige.100
        surface: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
        text: colorScheme === 'dark' ? '#FFFFFF' : '#3E3E34',
        textSec: colorScheme === 'dark' ? '#A0A0A0' : '#8C8C7D',
        primary: colorScheme === 'dark' ? '#BB86FC' : '#8B4513',
    }
  };
}
