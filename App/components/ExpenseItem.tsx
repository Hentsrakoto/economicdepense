import React from 'react';
import { Text, View } from 'react-native';

type ExpenseItemProps = {
  title: string;
  amount: number;
  date: Date;
  type: 'expense' | 'income';
};

export default function ExpenseItem({ title, amount, date, type }: ExpenseItemProps) {
  return (
    <View className="flex-row justify-between items-center p-4 bg-white rounded-lg mb-2 shadow-sm">
      <View>
        <Text className="font-semibold text-lg">{title}</Text>
        <Text className="text-gray-500 text-sm">{date.toLocaleDateString()}</Text>
      </View>
      <Text className={`font-bold text-lg ${type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>
        {type === 'expense' ? '-' : '+'}{amount} €
      </Text>
    </View>
  );
}
