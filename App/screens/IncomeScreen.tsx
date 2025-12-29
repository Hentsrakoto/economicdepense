import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { useUser } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import { Transaction, useTransactions } from '../hooks/useTransactions';
import { CURRENCIES, translations } from '../utils/i18n';

export default function IncomeScreen() {
  const { transactions, addTransaction, deleteTransaction, editTransaction } = useTransactions();
  const { settings } = useUser();
  const theme = useTheme();
  const t = translations[settings.language] || translations.fr;
  const currencySymbol = CURRENCIES.find(c => c.value === settings.currency)?.symbol || '€';

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const incomes = transactions.filter(t => t.type === 'income').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const mainBg = theme.isDark ? 'bg-[#121212]' : 'bg-[#F2F2EB]';
  const cardBg = theme.isDark ? 'bg-[#1E1E1E] border-gray-800' : 'bg-white border-[#E6E6D8]'; 
  const textColor = theme.isDark ? 'text-white' : 'text-[#3E3E34]';
  const subTextColor = theme.isDark ? 'text-[#A0A0A0]' : 'text-[#8C8C7D]';
  const inputBg = theme.isDark ? 'bg-[#121212] border-gray-700' : 'bg-[#F9F9F5] border-[#D9D9C2]';

  const handleAdd = () => {
    if (!title || !amount) return;
    if (isEditing) {
        editTransaction(isEditing, { title, amount: parseFloat(amount), date: date.toISOString() });
        setIsEditing(null);
    } else {
        addTransaction(title, parseFloat(amount), date, 'income');
    }
    setTitle('');
    setAmount('');
    setDate(new Date());
  };

  const handleEditInit = (t: Transaction) => {
    setTitle(t.title);
    setAmount(t.amount.toString());
    setDate(new Date(t.date));
    setIsEditing(t.id);
  };

  return (
    <View className={`flex-1 pt-12 px-5 ${mainBg}`}>
      <Text className={`${textColor} text-3xl font-bold mb-6`}>{t.incomes}</Text>

      {/* Input Form */}
      <View className={`${cardBg} p-4 rounded-xl mb-6 space-y-3 border`}>
        <TextInput 
          placeholder={t.sourcePlaceholder} 
          placeholderTextColor={theme.isDark ? "#666" : "#A0A090"}
          className={`${inputBg} ${textColor} p-3 rounded-lg border`}
          value={title}
          onChangeText={setTitle}
        />
        <View className="flex-row space-x-3">
             <TextInput 
                placeholder={`${t.amountPlaceholder} (${currencySymbol})`} 
                placeholderTextColor={theme.isDark ? "#666" : "#A0A090"}
                keyboardType="numeric"
                className={`${inputBg} ${textColor} p-3 rounded-lg flex-1 border`}
                value={amount}
                onChangeText={setAmount}
            />
             <Pressable 
                onPress={() => setShowDatePicker(true)}
                className={`${inputBg} justify-center px-4 rounded-lg border`}
             >
                 <Text className={textColor}>{date.toLocaleDateString()}</Text>
             </Pressable>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Pressable onPress={handleAdd} className="bg-green-500 p-3 rounded-lg items-center mt-2 active:bg-green-600">
          <Text className="text-white font-bold">{isEditing ? t.modify : t.addIncome}</Text>
        </Pressable>
        {isEditing && (
            <Pressable onPress={() => { setIsEditing(null); setTitle(''); setAmount(''); }} className="items-center">
                 <Text className={`${subTextColor} text-xs`}>{t.cancelEdit}</Text>
            </Pressable>
        )}
      </View>

      {/* List */}
      <FlatList
        data={incomes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className={`flex-row justify-between items-center ${cardBg} p-4 mb-3 rounded-xl border-l-4 border-l-green-500 border-t border-r border-b`}>
             <View className="flex-1">
              <Text className={`${textColor} font-bold text-lg`}>{item.title}</Text>
              <Text className={subTextColor}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View className="items-end">
                <Text className="text-green-400 font-bold text-lg mb-1">+{item.amount} {currencySymbol}</Text>
                <View className="flex-row space-x-3">
                     <Pressable onPress={() => handleEditInit(item)}>
                        <Ionicons name="pencil" size={20} color={theme.isDark ? "#BB86FC" : "#8B4513"} />
                     </Pressable>
                     <Pressable onPress={() => deleteTransaction(item.id)}>
                        <Ionicons name="trash" size={20} color="#ef4444" />
                     </Pressable>
                </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text className={`${subTextColor} text-center mt-10`}>{t.noIncomes}</Text>}
      />
    </View>
  );
}
