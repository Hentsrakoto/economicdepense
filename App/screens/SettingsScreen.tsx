import React, { useState } from 'react';
import { Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import { CURRENCIES, Currency, LANGUAGES, Language, translations } from '../utils/i18n';

// Constants defined in the file scope as per request
const REGION_OPTIONS = [
    { label: 'Europe (Français)', value: 'fr', region: 'Europe', nationality: 'Européen' },
    { label: 'International (English)', value: 'en', region: 'International', nationality: 'International' },
    { label: 'Madagascar (Malagasy)', value: 'mg', region: 'Madagascar', nationality: 'Malgache' },
    { label: 'Deutschland (Deutsch)', value: 'de', region: 'Deutschland', nationality: 'Deutsch' }
];

export default function SettingsScreen() {
    const { settings, updateSettings } = useUser();
    const theme = useTheme();
    const t = translations[settings.language] || translations.fr;

    const [name, setName] = useState(settings.name);
    const [firstName, setFirstName] = useState(settings.firstName);
    const [language, setLanguage] = useState<Language>(settings.language);
    const [currency, setCurrency] = useState<Currency>(settings.currency);
    const [message, setMessage] = useState<string | null>(null);

    const handleSave = async () => {
        const selectedRegionData = REGION_OPTIONS.find(r => r.value === language);
        
        await updateSettings({
            name,
            firstName,
            language,
            currency,
            region: selectedRegionData ? selectedRegionData.region : 'International',
            nationality: selectedRegionData ? selectedRegionData.nationality : 'International',
        });
        setMessage(t.saveSuccess);
        
        // Hide message after 3 seconds
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };

    const bgColor = theme.isDark ? 'bg-[#121212]' : 'bg-[#F2F2EB]';
    const cardBg = theme.isDark ? 'bg-[#1E1E1E] border-gray-800' : 'bg-white border-[#E6E6D8]';
    const textColor = theme.isDark ? 'text-white' : 'text-[#3E3E34]';
    const subTextColor = theme.isDark ? 'text-[#A0A0A0]' : 'text-[#8C8C7D]';
    const inputBg = theme.isDark ? 'bg-[#121212] border-gray-700' : 'bg-[#F9F9F5] border-[#D9D9C2]';
    const activeChipBg = theme.isDark ? 'bg-blue-600 border-blue-600' : 'bg-[#8B4513] border-[#8B4513]';
    const activeChipText = 'text-white font-bold';
    
    return (
        <View className={`flex-1 pt-12 px-5 ${bgColor}`}>
            <Text className={`${textColor} text-3xl font-bold mb-6`}>{t.settings}</Text>

            {message && (
                <View className="bg-green-500 p-3 rounded-lg mb-4">
                    <Text className="text-white text-center font-bold">{message}</Text>
                </View>
            )}

            <View className={`${cardBg} p-5 rounded-2xl border space-y-4`}>
                {/* Name */}
                <View>
                    <Text className={`${subTextColor} mb-1 ml-1`}>{t.name}</Text>
                    <TextInput
                        className={`${inputBg} ${textColor} p-3 rounded-xl border`}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* First Name */}
                <View>
                    <Text className={`${subTextColor} mb-1 ml-1`}>{t.firstName}</Text>
                    <TextInput
                        className={`${inputBg} ${textColor} p-3 rounded-xl border`}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>

                {/* Language */}
                <View>
                    <Text className={`${subTextColor} mb-2 ml-1`}>{t.preferredLanguage}</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {LANGUAGES.map((lang) => (
                            <TouchableOpacity
                                key={lang.value}
                                onPress={() => setLanguage(lang.value as Language)}
                                className={`px-3 py-2 rounded-full border ${language === lang.value ? activeChipBg : `${inputBg}`}`}
                            >
                                <Text className={language === lang.value ? activeChipText : textColor}>{lang.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Currency */}
                <View>
                    <Text className={`${subTextColor} mb-2 ml-1`}>{t.preferredCurrency}</Text>
                     <View className="flex-row flex-wrap gap-2">
                        {CURRENCIES.map((curr) => (
                             <TouchableOpacity
                                key={curr.value}
                                onPress={() => setCurrency(curr.value as Currency)}
                                className={`px-3 py-2 rounded-full border ${currency === curr.value ? activeChipBg : `${inputBg}`}`}
                            >
                                <Text className={currency === curr.value ? activeChipText : textColor}>{curr.symbol} {curr.label.split(' ')[0]}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Save Button */}
                <Pressable onPress={handleSave} className="bg-green-500 p-4 rounded-xl items-center mt-4 active:bg-green-600">
                    <Text className="text-white font-bold text-lg">{t.save}</Text>
                </Pressable>
            </View>
        </View>
    );
}
