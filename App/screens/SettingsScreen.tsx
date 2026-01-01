import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Typography } from '../components/ui/Typography';
import { useUser } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import { CURRENCIES, Currency, LANGUAGES, Language, translations } from '../utils/i18n';

// Constants
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
    const [principalFund, setPrincipalFund] = useState(settings.principalFund?.toString() || '0');
    const [revenueTypes, setRevenueTypes] = useState<string[]>(settings.revenueTypes || []);
    const [newRevenueType, setNewRevenueType] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const handleSave = async () => {
        const selectedRegionData = REGION_OPTIONS.find(r => r.value === language);
        
        await updateSettings({
            name,
            firstName,
            language,
            currency,
            principalFund: parseFloat(principalFund) || 0,
            revenueTypes,
            region: selectedRegionData ? selectedRegionData.region : 'International',
            nationality: selectedRegionData ? selectedRegionData.nationality : 'International',
        });
        setMessage(t.saveSuccess);
        setTimeout(() => setMessage(null), 3000);
    };

    const bgColor = theme.isDark ? 'bg-[#121212]' : 'bg-[#F2F2EB]';

    return (
        <View className={`flex-1 pt-12 px-5 ${bgColor}`}>
            <Typography variant="h2" className="mb-6">{t.settings}</Typography>

            <ScrollView showsVerticalScrollIndicator={false}>
                {message && (
                    <Card className="bg-green-500 border-green-600 mb-4 p-3">
                        <Typography className="text-white font-bold text-center">{message}</Typography>
                    </Card>
                )}

                <Card className="mb-8">
                    <View className="space-y-4">
                        <Input
                            label={t.name}
                            value={name}
                            onChangeText={setName}
                        />
                        <Input
                            label={t.firstName}
                            value={firstName}
                            onChangeText={setFirstName}
                        />

                        {/* Language */}
                        <View>
                            <Typography variant="caption" className="mb-2 ml-1 font-medium">{t.preferredLanguage}</Typography>
                            <View className="flex-row flex-wrap gap-2">
                                {LANGUAGES.map((lang) => (
                                    <Badge
                                        key={lang.value}
                                        selected={language === lang.value}
                                        onPress={() => setLanguage(lang.value as Language)}
                                    >
                                        {lang.label}
                                    </Badge>
                                ))}
                            </View>
                        </View>

                        {/* Currency */}
                        <View>
                            <Typography variant="caption" className="mb-2 ml-1 font-medium">{t.preferredCurrency}</Typography>
                            <View className="flex-row flex-wrap gap-2">
                                {CURRENCIES.map((curr) => (
                                    <Badge
                                        key={curr.value}
                                        selected={currency === curr.value}
                                        onPress={() => setCurrency(curr.value as Currency)}
                                    >
                                        {`${curr.symbol} ${curr.label.split(' ')[0]}`}
                                    </Badge>
                                ))}
                            </View>
                        </View>

                        {/* Principal Fund */}
                        <Input
                            label={t.principalFund}
                            value={principalFund}
                            onChangeText={setPrincipalFund}
                            keyboardType="numeric"
                            placeholder="0.00"
                        />

                        {/* Revenue Types */}
                        <View>
                            <Typography variant="caption" className="mb-2 ml-1 font-medium">{t.revenueTypes}</Typography>
                            <View className="flex-row flex-wrap gap-2 mb-3">
                                {revenueTypes.map((type, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        onPress={() => setRevenueTypes(revenueTypes.filter((_, i) => i !== index))}
                                    >
                                        {`${type} ✕`}
                                    </Badge>
                                ))}
                            </View>

                            <View className="flex-row space-x-2 items-center">
                                <Input
                                    containerClassName="flex-1"
                                    value={newRevenueType}
                                    onChangeText={setNewRevenueType}
                                    placeholder={t.newRevenueType}
                                />
                                <Button
                                    size="icon"
                                    className="rounded-xl w-12 h-12"
                                    onPress={() => {
                                        if (newRevenueType.trim()) {
                                            setRevenueTypes([...revenueTypes, newRevenueType.trim()]);
                                            setNewRevenueType('');
                                        }
                                    }}
                                >
                                    +
                                </Button>
                            </View>
                        </View>

                        <Button onPress={handleSave} className="mt-4 bg-green-600">
                            {t.save}
                        </Button>
                    </View>
                </Card>
                <View className="h-20" /> 
            </ScrollView>
        </View>
    );
}
