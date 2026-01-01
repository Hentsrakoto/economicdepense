import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
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

  return (
    <SafeAreaView className={`flex-1 ${mainBg}`} edges={['top']}>
      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-8">
          <Typography variant="h3" className="mb-1">{t.welcome},</Typography>
          <Typography variant="h1" className="text-primary">{settings.firstName || settings.name}</Typography>
        </View>

        {/* Balance Card - Force solid color for visibility */}
        <View 
            className="mb-8 p-6 rounded-2xl shadow-lg"
            style={{ backgroundColor: '#2563EB', borderColor: '#1D4ED8', borderWidth: 1 }} // Blue-600/700
        >
           <View className="flex-row justify-between items-center mb-4">
              <Typography className="text-blue-100 font-medium">{t.totalBalance}</Typography>
              <Ionicons name="wallet" size={24} color="white" />
           </View>
           <Typography className="text-4xl font-extrabold text-white">
             {balance.toFixed(2)} {currencySymbol}
           </Typography>
        </View>


        {/* Recent Transactions */}
        <View className="mb-6">
          <Typography variant="h3" className="mb-4">{t.recentTransactions}</Typography>
          {recentTransactions.map((t) => (
            <Card key={t.id} className="mb-3 py-3">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <View className={`p-3 rounded-full mr-3 ${t.type === 'expense' ? 'bg-red-100 dark:bg-red-900/20' : 'bg-green-100 dark:bg-green-900/20'}`}>
                             <Ionicons 
                                name={t.type === 'expense' ? 'cart' : 'cash'} 
                                size={20} 
                                color={t.type === 'expense' ? '#EF4444' : '#22C55E'} 
                            />
                        </View>
                        <View>
                            <Typography variant="body" className="font-bold">{t.title}</Typography>
                            <Typography variant="caption">{new Date(t.date).toLocaleDateString()}</Typography>
                        </View>
                    </View>
                    <Typography className={`font-bold text-base ${t.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
                        {t.type === 'expense' ? '-' : '+'}{t.amount} {currencySymbol}
                    </Typography>
                </View>
            </Card>
          ))}
          {recentTransactions.length === 0 && (
             <Typography className="text-center mt-4 text-gray-400">Aucune transaction récente.</Typography>
          )}
        </View>
        <View className="h-20" /> 
      </ScrollView>
    </SafeAreaView>
  );
}
