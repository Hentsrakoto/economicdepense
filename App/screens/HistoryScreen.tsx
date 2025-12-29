import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SectionList, Text, View } from 'react-native';
import { useTransactions } from '../hooks/useTransactions';

export default function HistoryScreen() {
  const { transactions } = useTransactions();

  // Group by Month/Year
  const groupedData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const key = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(transaction);
    return acc;
  }, {} as Record<string, typeof transactions>);

  const sections = Object.keys(groupedData).map(key => ({
    title: key,
    data: groupedData[key].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }));

  return (
    <View className="flex-1 bg-[#121212] pt-12 px-5">
      <Text className="text-white text-3xl font-bold mb-6">Historique</Text>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <View className="bg-[#121212] py-2 mb-2">
             <Text className="text-[#BB86FC] text-lg font-bold capitalize">{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
             <View className="flex-row justify-between items-center bg-[#1E1E1E] p-4 mb-3 rounded-xl border border-gray-800">
                <View className="flex-row items-center">
                    <View className={`p-2 rounded-full mr-3 ${item.type === 'expense' ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
                         <Ionicons 
                            name={item.type === 'expense' ? 'cart' : 'cash'} 
                            size={16} 
                            color={item.type === 'expense' ? '#F87171' : '#4ADE80'} 
                        />
                    </View>
                    <Text className="text-white font-medium">{item.title}</Text>
                </View>
                <Text className={`font-bold ${item.type === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
                    {item.type === 'expense' ? '-' : '+'}{item.amount} €
                </Text>
            </View>
        )}
        ListEmptyComponent={<Text className="text-[#A0A0A0] text-center mt-20">Aucun historique disponible.</Text>}
      />
    </View>
  );
}
