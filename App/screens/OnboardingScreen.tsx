import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import { CURRENCIES, Currency, LANGUAGES, Language } from '../utils/i18n';
// ...
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

  const [step, setStep] = useState(1);
  const totalSteps = 3;

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
  const textColor = theme.isDark ? 'text-white' : 'text-[#3E3E34]';
  const subTextColor = theme.isDark ? 'text-gray-400' : 'text-[#8C8C7D]';
  const inputBg = theme.isDark ? 'bg-[#1E1E1E]' : 'bg-white';
  const inputBorder = theme.isDark ? 'border-gray-700' : 'border-[#D9D9C2]';
  const buttonBg = theme.isDark ? 'bg-blue-600' : 'bg-[#8B4513]';

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
            <Text className={`text-3xl font-bold mb-2 ${textColor}`}>
                {step === 1 && "Parlons de vous"}
                {step === 2 && "Vos origines"}
                {step === 3 && "Votre monnaie"}
            </Text>
            <Text className={`text-lg ${subTextColor}`}>
                {step === 1 && "Dites-nous comment vous appeler."}
                {step === 2 && "D'où venez-vous ?"}
                {step === 3 && "Quelle devise utilisez-vous ?"}
            </Text>
          </View>

          <StepIndicator currentStep={step} totalSteps={totalSteps} theme={theme} />

          <View className="flex-1 justify-center">
            {/* Step 1: Name & First Name */}
            {step === 1 && (
                <View className="space-y-6">
                    <View>
                        <Text className={`mb-2 font-medium ${textColor}`}>Nom</Text>
                        <TextInput
                            className={`${inputBg} ${textColor} p-4 rounded-xl border ${inputBorder}`}
                            placeholder="Votre nom"
                            placeholderTextColor={theme.isDark ? "#6b7280" : "#A0A0A0"}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>
                    <View>
                        <Text className={`mb-2 font-medium ${textColor}`}>Prénom</Text>
                        <TextInput
                            className={`${inputBg} ${textColor} p-4 rounded-xl border ${inputBorder}`}
                            placeholder="Votre prénom"
                            placeholderTextColor={theme.isDark ? "#6b7280" : "#A0A0A0"}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>
                </View>
            )}

            {/* Step 2: Language & Region */}
            {step === 2 && (
                <View className="space-y-6">
                    <View>
                        <Text className={`mb-2 font-medium ${textColor}`}>Langue préférée</Text>
                         <View className="flex-row flex-wrap gap-2">
                            {LANGUAGES.map((lang) => (
                                <TouchableOpacity
                                    key={lang.value}
                                    onPress={() => setSelectedLanguage(lang.value as Language)}
                                    className={`px-4 py-2 rounded-full border ${
                                        selectedLanguage === lang.value
                                        ? (theme.isDark ? 'bg-blue-600 border-blue-600' : 'bg-[#8B4513] border-[#8B4513]')
                                        : `${inputBg} ${inputBorder}`
                                    }`}
                                >
                                    <Text className={selectedLanguage === lang.value ? 'text-white font-bold' : textColor}>
                                        {lang.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                         </View>
                    </View>
                    
                    <View>
                        <Text className={`mb-2 font-medium ${textColor}`}>Nationalité / Région</Text>
                        <View className="flex-row flex-wrap gap-2">
                             {REGION_OPTIONS.map((reg) => (
                                <TouchableOpacity
                                    key={reg.value}
                                    onPress={() => setSelectedLanguage(reg.value as Language)}
                                    className={`px-4 py-2 rounded-full border ${
                                        selectedLanguage === reg.value
                                        ? (theme.isDark ? 'bg-blue-600 border-blue-600' : 'bg-[#8B4513] border-[#8B4513]')
                                        : `${inputBg} ${inputBorder}`
                                    }`}
                                >
                                    <Text className={selectedLanguage === reg.value ? 'text-white font-bold' : textColor}>
                                        {reg.label}
                                    </Text>
                                </TouchableOpacity>
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
                        className={`w-[48%] p-4 rounded-xl border flex-row items-center justify-between ${
                            selectedCurrency === curr.value 
                            ? (theme.isDark ? 'bg-blue-600/20 border-blue-600' : 'bg-[#8B4513]/10 border-[#8B4513]') 
                            : `${inputBg} ${inputBorder}`
                        }`}
                    >
                        <View>
                             <Text className={`font-bold text-lg ${textColor}`}>{curr.symbol}</Text>
                             <Text className={`text-sm ${subTextColor}`}>{curr.label}</Text>
                        </View>
                        {selectedCurrency === curr.value && (
                            <Ionicons name="checkmark-circle" size={24} color={theme.isDark ? "#3b82f6" : "#8B4513"} />
                        )}
                    </TouchableOpacity>
                    ))}
                </View>
            )}
          </View>

          {/* Footer Buttons */}
          <View className="mt-8">
            <TouchableOpacity
                onPress={handleNext}
                disabled={!isStepValid()}
                className={`p-4 rounded-xl items-center flex-row justify-center space-x-2 ${
                    isStepValid() ? buttonBg : 'bg-gray-400 opacity-50'
                }`}
            >
                <Text className="text-white font-bold text-lg">
                    {step === totalSteps ? "Commencer" : "Suivant"}
                </Text>
                {step < totalSteps && <Ionicons name="arrow-forward" size={20} color="white" />}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
