import React from 'react';
import { Text, View } from 'react-native';
import { useUser } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import { CURRENCIES } from '../utils/i18n';

type ExpenseItemProps = {
  title: string;
  amount: number;
  date: Date;
  type: 'expense' | 'income';
};

export default function ExpenseItem({ title, amount, date, type }: ExpenseItemProps) {
  const { settings } = useUser();
  const theme = useTheme();
  const currencySymbol = CURRENCIES.find(c => c.value === settings.currency)?.symbol || '€';
  
  const containerBg = theme.isDark ? 'bg-[#1E1E1E]' : 'bg-white border-b border-[#E6E6D8]'; 
  const titleColor = theme.isDark ? 'text-white' : 'text-[#3E3E34]';
  const subTextColor = theme.isDark ? 'text-gray-500' : 'text-[#8C8C7D]';

  return (
    <View className={`flex-row justify-between items-center p-4 rounded-lg mb-2 shadow-sm ${containerBg}`}>
      <View>
        <Text className={`font-semibold text-lg ${titleColor}`}>{title}</Text>
        <Text className={`${subTextColor} text-sm`}>{date.toLocaleDateString()}</Text>
      </View>
      <Text className={`font-bold text-lg ${type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
        {type === 'expense' ? '-' : '+'}{amount} {currencySymbol}
      </Text>
    </View>
  );
}
