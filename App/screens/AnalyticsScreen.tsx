import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import { useTransactions } from '../hooks/useTransactions';
import { CURRENCIES, translations } from '../utils/i18n';

export default function AnalyticsScreen() {
  const { transactions } = useTransactions();
  const { settings } = useUser();
  const theme = useTheme();

  const t = translations[settings.language] || translations.fr;
  const currencySymbol = CURRENCIES.find(c => c.value === settings.currency)?.symbol || '€';

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const getMonthName = (monthIndex: number) => {
      const date = new Date();
      date.setMonth(monthIndex);
      return date.toLocaleString(settings.language, { month: 'long' });
  };

  const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = monthlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const total = income - expense;

  const percentage = income > 0 ? (expense / income) * 100 : 0;

  const mainBg = theme.isDark ? 'bg-[#121212]' : 'bg-[#F2F2EB]';
  const cardBg = theme.isDark ? 'bg-[#1E1E1E] border-gray-800' : 'bg-white border-[#E6E6D8]'; 
  const textColor = theme.isDark ? 'text-white' : 'text-[#3E3E34]';
  const subTextColor = theme.isDark ? 'text-[#A0A0A0]' : 'text-[#8C8C7D]';

  return (
    <SafeAreaView className={`flex-1 px-5 ${mainBg}`} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16 }}>
        <Text className={`${textColor} text-3xl font-bold mb-2`}>{t.analysis}</Text>
        <Text className={`${subTextColor} text-lg mb-6 capitalize`}>{getMonthName(currentMonth)} {currentYear}</Text>

        {/* Summary Cards */}
        <View className="flex-row justify-between mb-6">
            <View className={`${cardBg} p-5 rounded-2xl flex-1 mr-3 border`}>
                <Text className={`${subTextColor} mb-2 font-medium`}>{t.incomes}</Text>
                <Text className="text-green-500 text-2xl font-bold">+{income} {currencySymbol}</Text>
            </View>
            <View className={`${cardBg} p-5 rounded-2xl flex-1 ml-3 border`}>
                <Text className={`${subTextColor} mb-2 font-medium`}>{t.expenses}</Text>
                <Text className="text-red-500 text-2xl font-bold">-{expense} {currencySymbol}</Text>
            </View>
        </View>

        {/* Net Result */}
        <View className={`${cardBg} p-6 rounded-2xl mb-8 border items-center`}>
            <Text className={`${subTextColor} mb-2 font-medium uppercase tracking-widest`}>{t.monthResult}</Text>
            <Text className={`text-4xl font-extrabold ${total >= 0 ? textColor : 'text-red-500'}`}>
                {total > 0 ? '+' : ''}{total} {currencySymbol}
            </Text>
        </View>

        {/* Progress Bar */}
        <View className="mb-8">
            <View className="flex-row justify-between mb-2">
              <Text className={`${textColor} font-bold`}>{t.expenses} / {t.incomes}</Text>
              <Text className={subTextColor}>{percentage.toFixed(1)}%</Text>
            </View>
            <View className="h-4 bg-gray-300 rounded-full overflow-hidden">
              <View 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ width: `${Math.min(percentage, 100)}%` }} 
              />
            </View>
            {percentage > 100 && (
                <Text className="text-red-500 mt-2 text-sm font-bold">{t.warningOverBudget}</Text>
            )}
        </View>
        <View className="h-20" />
      </ScrollView>

    </SafeAreaView>
  );
}
