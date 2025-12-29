import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useUser } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import { useTransactions } from '../hooks/useTransactions';
import { CURRENCIES, translations } from '../utils/i18n';

export default function HomeScreen() {
  const { getBalance, transactions } = useTransactions();
  const { settings } = useUser();
  const theme = useTheme();

  const t = translations[settings.language] || translations.fr;
  const currencySymbol = CURRENCIES.find(c => c.value === settings.currency)?.symbol || '€';
  
  const balance = getBalance();
  const recentTransactions = transactions.slice(-5).reverse();

  const mainBg = theme.isDark ? 'bg-[#121212]' : 'bg-[#F2F2EB]';
  const cardBg = theme.isDark ? 'bg-[#1E1E1E] border-gray-800' : 'bg-white border-[#E6E6D8]'; 
  const textColor = theme.isDark ? 'text-white' : 'text-[#3E3E34]';
  const subTextColor = theme.isDark ? 'text-[#A0A0A0]' : 'text-[#8C8C7D]';

  return (
    <View className={`flex-1 ${mainBg}`}>
      <ScrollView className="px-5 pt-12">
        {/* Header */}
        <View className="mb-8">
          <Text className={`${subTextColor} text-lg`}>{t.welcome}, {settings.firstName || settings.name}</Text>
        </View>

        {/* Balance Card */}
        <View className={`${cardBg} p-6 rounded-2xl shadow-sm mb-8 border`}>
           <View className="flex-row justify-between items-center mb-2">
              <Text className={`${subTextColor} font-medium`}>{t.totalBalance}</Text>
              <Ionicons name="card" size={24} color={theme.isDark ? "#BB86FC" : "#8B4513"} />
           </View>
           <Text className={`text-4xl font-extrabold ${balance >= 0 ? textColor : 'text-red-400'}`}>
             {balance.toFixed(2)} {currencySymbol}
           </Text>
        </View>

         {/* Summary Actions */}
        <View className="flex-row justify-between mb-8">
            <View className={`${cardBg} p-4 rounded-xl flex-1 mr-3 items-center border`}>
                <View className="bg-green-500/20 p-3 rounded-full mb-2">
                    <Ionicons name="arrow-up" size={24} color="#4ADE80" />
                </View>
                <Text className="text-green-500 font-bold">{t.incomes}</Text>
            </View>
            <View className={`${cardBg} p-4 rounded-xl flex-1 ml-3 items-center border`}>
                <View className="bg-red-500/20 p-3 rounded-full mb-2">
                    <Ionicons name="arrow-down" size={24} color="#F87171" />
                </View>
                <Text className="text-red-500 font-bold">{t.expenses}</Text>
            </View>
        </View>

        {/* Recent Transactions */}
        <View className="mb-6">
          <Text className={`${textColor} text-xl font-bold mb-4`}>{t.recentTransactions}</Text>
          {recentTransactions.map((t) => (
            <View key={t.id} className={`flex-row justify-between items-center ${cardBg} p-4 mb-3 rounded-xl border`}>
                <View className="flex-row items-center">
                    <View className={`p-3 rounded-full mr-3 ${t.type === 'expense' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                         <Ionicons 
                            name={t.type === 'expense' ? 'cart' : 'cash'} 
                            size={20} 
                            color={t.type === 'expense' ? '#F87171' : '#4ADE80'} 
                        />
                    </View>
                    <View>
                        <Text className={`${textColor} font-bold text-base`}>{t.title}</Text>
                        <Text className={`${subTextColor} text-xs`}>{new Date(t.date).toLocaleDateString()}</Text>
                    </View>
                </View>
                <Text className={`font-bold text-base ${t.type === 'expense' ? 'text-red-400' : 'text-green-500'}`}>
                    {t.type === 'expense' ? '-' : '+'}{t.amount} {currencySymbol}
                </Text>
            </View>
          ))}
          {recentTransactions.length === 0 && (
             <Text className={`${subTextColor} text-center mt-4`}>Aucune transaction récente.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
