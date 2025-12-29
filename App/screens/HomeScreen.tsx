import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTransactions } from '../hooks/useTransactions';

export default function HomeScreen() {
  const { getBalance, transactions } = useTransactions();
  
  const balance = getBalance();
  const recentTransactions = transactions.slice(-5).reverse();

  return (
    <View className="flex-1 bg-[#121212]">
      <ScrollView className="px-5 pt-12">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-[#A0A0A0] text-lg">Bienvenue,</Text>
          <Text className="text-white text-3xl font-bold">Mon Budget</Text>
        </View>

        {/* Balance Card */}
        <View className="bg-[#1E1E1E] p-6 rounded-2xl shadow-lg mb-8 border border-gray-800">
           <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[#A0A0A0] font-medium">Solde Total</Text>
              <Ionicons name="card" size={24} color="#BB86FC" />
           </View>
           <Text className={`text-4xl font-extrabold ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
             {balance.toFixed(2)} €
           </Text>
        </View>

         {/* Summary Actions */}
        <View className="flex-row justify-between mb-8">
            <View className="bg-[#1E1E1E] p-4 rounded-xl flex-1 mr-3 items-center border border-gray-800">
                <View className="bg-green-500/20 p-3 rounded-full mb-2">
                    <Ionicons name="arrow-up" size={24} color="#4ADE80" />
                </View>
                <Text className="text-green-400 font-bold">Revenus</Text>
            </View>
            <View className="bg-[#1E1E1E] p-4 rounded-xl flex-1 ml-3 items-center border border-gray-800">
                <View className="bg-red-500/20 p-3 rounded-full mb-2">
                    <Ionicons name="arrow-down" size={24} color="#F87171" />
                </View>
                <Text className="text-red-400 font-bold">Dépenses</Text>
            </View>
        </View>

        {/* Recent Transactions */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold mb-4">Récent</Text>
          {recentTransactions.map((t) => (
            <View key={t.id} className="flex-row justify-between items-center bg-[#1E1E1E] p-4 mb-3 rounded-xl border border-gray-800">
                <View className="flex-row items-center cursor-pointer">
                    <View className={`p-3 rounded-full mr-3 ${t.type === 'expense' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                         <Ionicons 
                            name={t.type === 'expense' ? 'cart' : 'cash'} 
                            size={20} 
                            color={t.type === 'expense' ? '#F87171' : '#4ADE80'} 
                        />
                    </View>
                    <View>
                        <Text className="text-white font-bold text-base">{t.title}</Text>
                        <Text className="text-[#A0A0A0] text-xs">{new Date(t.date).toLocaleDateString()}</Text>
                    </View>
                </View>
                <Text className={`font-bold text-base ${t.type === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
                    {t.type === 'expense' ? '-' : '+'}{t.amount} €
                </Text>
            </View>
          ))}
          {recentTransactions.length === 0 && (
             <Text className="text-[#A0A0A0] text-center mt-4">Aucune transaction récente.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
