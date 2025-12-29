import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SectionList, Text, View } from 'react-native';
import { useUser } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import { useTransactions } from '../hooks/useTransactions';
import { CURRENCIES, translations } from '../utils/i18n';

export default function HistoryScreen() {
  const { transactions } = useTransactions();
  const { settings } = useUser();
  const theme = useTheme();

  const t = translations[settings.language] || translations.fr;
  const currencySymbol = CURRENCIES.find(c => c.value === settings.currency)?.symbol || '€';

  // Group by Month/Year
  const groupedData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const key = `${date.toLocaleString(settings.language, { month: 'long' })} ${date.getFullYear()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(transaction);
    return acc;
  }, {} as Record<string, typeof transactions>);

  const sections = Object.keys(groupedData).map(key => ({
    title: key,
    data: groupedData[key].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }));

  const mainBg = theme.isDark ? 'bg-[#121212]' : 'bg-[#F2F2EB]';
  const cardBg = theme.isDark ? 'bg-[#1E1E1E] border-gray-800' : 'bg-white border-[#E6E6D8]'; 
  const textColor = theme.isDark ? 'text-white' : 'text-[#3E3E34]';
  const subTextColor = theme.isDark ? 'text-[#A0A0A0]' : 'text-[#8C8C7D]';
  const headerText = theme.isDark ? 'text-[#BB86FC]' : 'text-[#8B4513]';

  return (
    <View className={`flex-1 pt-12 px-5 ${mainBg}`}>
      <Text className={`${textColor} text-3xl font-bold mb-6`}>{t.history}</Text>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <View className={`${mainBg} py-2 mb-2`}>
             <Text className={`${headerText} text-lg font-bold capitalize`}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
             <View className={`flex-row justify-between items-center ${cardBg} p-4 mb-3 rounded-xl border`}>
                <View className="flex-row items-center">
                    <View className={`p-2 rounded-full mr-3 ${item.type === 'expense' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                         <Ionicons 
                            name={item.type === 'expense' ? 'cart' : 'cash'} 
                            size={16} 
                            color={item.type === 'expense' ? '#F87171' : '#4ADE80'} 
                        />
                    </View>
                    <Text className={`${textColor} font-medium`}>{item.title}</Text>
                </View>
                <Text className={`font-bold ${item.type === 'expense' ? 'text-red-400' : 'text-green-500'}`}>
                    {item.type === 'expense' ? '-' : '+'}{item.amount} {currencySymbol}
                </Text>
            </View>
        )}
        ListEmptyComponent={<Text className={`${subTextColor} text-center mt-20`}>{t.noHistory}</Text>}
      />
    </View>
  );
}
