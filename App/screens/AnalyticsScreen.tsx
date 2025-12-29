import React from 'react';
import { Text, View } from 'react-native';
import { useTransactions } from '../hooks/useTransactions';

export default function AnalyticsScreen() {
  const { transactions } = useTransactions();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const getMonthName = (monthIndex: number) => {
      const date = new Date();
      date.setMonth(monthIndex);
      return date.toLocaleString('default', { month: 'long' });
  };

  const monthlyTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = monthlyTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const total = income - expense;

  const percentage = income > 0 ? (expense / income) * 100 : 0;

  return (
    <View className="flex-1 bg-[#121212] pt-12 px-5">
      <Text className="text-white text-3xl font-bold mb-2">Analyse</Text>
      <Text className="text-[#A0A0A0] text-lg mb-6 capitalize">{getMonthName(currentMonth)} {currentYear}</Text>

      {/* Summary Cards */}
      <View className="flex-row justify-between mb-6">
           <View className="bg-[#1E1E1E] p-5 rounded-2xl flex-1 mr-3 border border-gray-800">
               <Text className="text-[#A0A0A0] mb-2 font-medium">Revenus</Text>
               <Text className="text-green-400 text-2xl font-bold">+{income} €</Text>
           </View>
           <View className="bg-[#1E1E1E] p-5 rounded-2xl flex-1 ml-3 border border-gray-800">
               <Text className="text-[#A0A0A0] mb-2 font-medium">Dépenses</Text>
               <Text className="text-red-400 text-2xl font-bold">-{expense} €</Text>
           </View>
      </View>

      {/* Net Result */}
      <View className="bg-[#1E1E1E] p-6 rounded-2xl mb-8 border border-gray-800 items-center">
          <Text className="text-[#A0A0A0] mb-2 font-medium uppercase tracking-widest">Résultat du mois</Text>
          <Text className={`text-4xl font-extrabold ${total >= 0 ? 'text-white' : 'text-red-500'}`}>
              {total > 0 ? '+' : ''}{total} €
          </Text>
      </View>

      {/* Progress Bar */}
      <View className="mb-8">
          <View className="flex-row justify-between mb-2">
            <Text className="text-white font-bold">Dépenses / Revenus</Text>
            <Text className="text-[#A0A0A0]">{percentage.toFixed(1)}%</Text>
          </View>
          <View className="h-4 bg-[#2C2C2C] rounded-full overflow-hidden">
             <View 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: `${Math.min(percentage, 100)}%` }} 
             />
          </View>
          {percentage > 100 && (
              <Text className="text-red-500 mt-2 text-sm font-bold">Attention: Vous avez dépassé vos revenus !</Text>
          )}
      </View>

    </View>
  );
}
