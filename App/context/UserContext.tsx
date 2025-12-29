import { useColorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Currency, Language } from '../utils/i18n';
import { getData, storeData } from '../utils/storage';

interface UserSettings {
  name: string;
  firstName: string;
  region: string;
  nationality: string;
  language: Language;
  currency: Currency;
  isOnboarded: boolean;
  theme: 'light' | 'dark' | 'system';
}

interface UserContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  loading: boolean;
  toggleTheme: () => void;
}

const defaultSettings: UserSettings = {
  name: '',
  firstName: '',
  region: '',
  nationality: '',
  language: 'fr',
  currency: 'MGA',
  isOnboarded: false,
  theme: 'system',
};

const UserContext = createContext<UserContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  loading: true,
  toggleTheme: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
     if (!loading) {
         if (settings.theme === 'system') {
             setColorScheme('system');
         } else {
             setColorScheme(settings.theme as "light" | "dark" | "system");
         }
     }
  }, [settings.theme, loading, setColorScheme]);

  const loadSettings = async () => {
    try {
      const storedSettings = await getData('user_settings');
      if (storedSettings) {
        setSettings({ ...defaultSettings, ...storedSettings });
      }
    } catch (error) {
      console.error('Failed to load user settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    await storeData('user_settings', updated);
  };

  const toggleTheme = () => {
      const newTheme = settings.theme === 'light' ? 'dark' : 'light';
      updateSettings({ theme: newTheme });
  };

  return (
    <UserContext.Provider value={{ settings, updateSettings, loading, toggleTheme }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
