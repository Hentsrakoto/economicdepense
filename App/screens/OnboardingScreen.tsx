import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Typography } from '../components/ui/Typography';
import { useUser } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import { CURRENCIES, Currency, LANGUAGES, Language, translations } from '../utils/i18n';

const StepIndicator = ({ currentStep, totalSteps, theme }: { currentStep: number; totalSteps: number, theme: any }) => {
  return (
    <View className="flex-row justify-between mb-8 px-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View key={index} className="flex-1 flex-row items-center">
             <View 
                className={`h-2 flex-1 rounded-full mx-1 ${
                    index + 1 <= currentStep 
                    ? (theme.isDark ? 'bg-blue-600' : 'bg-[#8B4513]') 
                    : (theme.isDark ? 'bg-gray-700' : 'bg-[#D9D9C2]')
                }`} 
             />
        </View>
      ))}
    </View>
  );
};

const REGION_OPTIONS = [
    { label: 'Europe (Français)', value: 'fr', region: 'Europe', nationality: 'Européen' },
    { label: 'International (English)', value: 'en', region: 'International', nationality: 'International' },
    { label: 'Madagascar (Malagasy)', value: 'mg', region: 'Madagascar', nationality: 'Malgache' },
    { label: 'Deutschland (Deutsch)', value: 'de', region: 'Deutschland', nationality: 'Deutsch' }
];

export default function OnboardingScreen() {
  const { updateSettings } = useUser();
  const theme = useTheme();
  
  const [firstName, setFirstName] = useState('');
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('fr'); 
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('MGA');
  const [principalFund, setPrincipalFund] = useState('');

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const t = translations[selectedLanguage] || translations.fr;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const selectedRegionData = REGION_OPTIONS.find(r => r.value === selectedLanguage);
      
      await updateSettings({
        name,
        firstName,
        region: selectedRegionData ? selectedRegionData.region : 'International',
        nationality: selectedRegionData ? selectedRegionData.nationality : 'International',
        language: selectedLanguage,
        currency: selectedCurrency,
        isOnboarded: true,
        theme: 'light', 
        principalFund: parseFloat(principalFund) || 0,
        revenueTypes: [],
      });
      theme.setTheme('light'); 
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
      if (step === 1) return name.trim().length > 0 && firstName.trim().length > 0;
      if (step === 2) return selectedLanguage !== undefined;
      if (step === 3) return true;
      return false;
  };

  const bgColor = theme.isDark ? 'bg-[#121212]' : 'bg-[#F2F2EB]';

  return (
    <SafeAreaView style={{ flex: 1 }} className={bgColor}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
          
          {/* Header */}
          <View className="mb-6 mt-4">
             {step > 1 && (
                 <TouchableOpacity onPress={handleBack} className="mb-4">
                     <Ionicons name="arrow-back" size={24} color={theme.isDark ? "white" : "#3E3E34"} />
                 </TouchableOpacity>
             )}
            <Typography variant="h1" className="mb-2">
                {step === 1 && t.welcome}
                {step === 2 && t.selectLanguage}
                {step === 3 && t.selectCurrency}
            </Typography>
            <Typography className="text-gray-500">
                {step === 1 && t.enterName}
                {step === 2 && "D'où venez-vous ?"}
                {step === 3 && "Quelle devise utilisez-vous ?"}
            </Typography>
          </View>

          <StepIndicator currentStep={step} totalSteps={totalSteps} theme={theme} />

          <View className="flex-1 justify-center">
            {/* Step 1: Name & First Name */}
            {step === 1 && (
                <View className="space-y-6">
                    <Input
                        label={t.name}
                        placeholder="Doe"
                        value={name}
                        onChangeText={setName}
                    />
                    <Input
                        label={t.firstName}
                        placeholder="John"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>
            )}

            {/* Step 2: Language & Region */}
            {step === 2 && (
                <View className="space-y-6">
                    <View>
                        <Typography className="mb-2 font-medium">{t.preferredLanguage}</Typography>
                         <View className="flex-row flex-wrap gap-2">
                            {LANGUAGES.map((lang) => (
                                <Badge
                                    key={lang.value}
                                    selected={selectedLanguage === lang.value}
                                    onPress={() => setSelectedLanguage(lang.value as Language)}
                                    className="px-4 py-2" // increased padding manually instead of size prop
                                >
                                    {lang.label}
                                </Badge>
                            ))}
                         </View>
                    </View>
                    
                    <View>
                        <Typography className="mb-2 font-medium">Nationalité / Région</Typography>
                        <View className="flex-row flex-wrap gap-2">
                             {REGION_OPTIONS.map((reg) => (
                                <Badge
                                    key={reg.value}
                                    selected={selectedLanguage === reg.value}
                                    onPress={() => setSelectedLanguage(reg.value as Language)}
                                    className="px-4 py-2"
                                >
                                    {reg.label}
                                </Badge>
                             ))}
                        </View>
                    </View>
                </View>
            )}

            {/* Step 3: Currency */}
            {step === 3 && (
                <View className="flex-row flex-wrap gap-3">
                    {CURRENCIES.map((curr) => (
                    <TouchableOpacity
                        key={curr.value}
                        onPress={() => setSelectedCurrency(curr.value as Currency)}
                        className="w-[48%]"
                    >
                        <Card 
                            className={`p-4 border ${selectedCurrency === curr.value ? 'border-primary bg-primary/10' : ''}`}
                        >
                            <View className="flex-row justify-between items-start">
                                <View>
                                     <Typography variant="h3">{curr.symbol}</Typography>
                                     <Typography variant="caption">{curr.label}</Typography>
                                </View>
                                {selectedCurrency === curr.value && (
                                    <Ionicons name="checkmark-circle" size={24} color={theme.isDark ? "#3b82f6" : "#8B4513"} />
                                )}
                            </View>
                        </Card>
                    </TouchableOpacity>
                    ))}
                    
                    <View className="w-full mt-4">
                        <Input
                             label={t.principalFund}
                             placeholder="0.00"
                             keyboardType="numeric"
                             value={principalFund}
                             onChangeText={setPrincipalFund}
                        />
                        <Typography variant="caption" className="mt-2 text-right">
                           {CURRENCIES.find(c => c.value === selectedCurrency)?.symbol}
                        </Typography>
                    </View>
                </View>
            )}
          </View>

          {/* Footer Buttons */}
          <View className="mt-8">
            <Button
                onPress={handleNext}
                disabled={!isStepValid()}
                className={!isStepValid() ? 'opacity-50' : ''}
            >
               <View className="flex-row items-center space-x-2">
                   <Typography className="text-white font-bold text-lg mr-2">
                        {step === totalSteps ? t.start : "Suivant"}
                   </Typography>
                   {step < totalSteps && <Ionicons name="arrow-forward" size={20} color="white" />}
               </View>
            </Button>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
