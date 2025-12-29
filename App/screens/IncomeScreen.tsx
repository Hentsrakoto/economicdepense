import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { Transaction, useTransactions } from '../hooks/useTransactions';

export default function IncomeScreen() {
  const { transactions, addTransaction, deleteTransaction, editTransaction } = useTransactions();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const incomes = transactions.filter(t => t.type === 'income').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
    <View className="flex-1 bg-[#121212] pt-12 px-5">
      <Text className="text-white text-3xl font-bold mb-6">Revenus</Text>

      {/* Input Form */}
      <View className="bg-[#1E1E1E] p-4 rounded-xl mb-6 space-y-3 border border-gray-800">
        <TextInput 
          placeholder="Source (ex: Salaire)" 
          placeholderTextColor="#666"
          className="bg-[#121212] text-white p-3 rounded-lg border border-gray-700"
          value={title}
          onChangeText={setTitle}
        />
        <View className="flex-row space-x-3">
             <TextInput 
                placeholder="Montant (€)" 
                placeholderTextColor="#666"
                keyboardType="numeric"
                className="bg-[#121212] text-white p-3 rounded-lg flex-1 border border-gray-700"
                value={amount}
                onChangeText={setAmount}
            />
             <Pressable 
                onPress={() => setShowDatePicker(true)}
                className="bg-[#121212] justify-center px-4 rounded-lg border border-gray-700"
             >
                 <Text className="text-white">{date.toLocaleDateString()}</Text>
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
          <Text className="text-white font-bold">{isEditing ? "Modifier" : "Ajouter le revenu"}</Text>
        </Pressable>
        {isEditing && (
            <Pressable onPress={() => { setIsEditing(null); setTitle(''); setAmount(''); }} className="items-center">
                 <Text className="text-[#A0A0A0] text-xs">Annuler modification</Text>
            </Pressable>
        )}
      </View>

      {/* List */}
      <FlatList
        data={incomes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center bg-[#1E1E1E] p-4 mb-3 rounded-xl border-l-4 border-l-green-500 border-t border-r border-b border-gray-800">
             <View className="flex-1">
              <Text className="text-white font-bold text-lg">{item.title}</Text>
              <Text className="text-[#A0A0A0]">{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <View className="items-end">
                <Text className="text-green-400 font-bold text-lg mb-1">+{item.amount} €</Text>
                <View className="flex-row space-x-3">
                     <Pressable onPress={() => handleEditInit(item)}>
                        <Ionicons name="pencil" size={20} color="#BB86FC" />
                     </Pressable>
                     <Pressable onPress={() => deleteTransaction(item.id)}>
                        <Ionicons name="trash" size={20} color="#ef4444" />
                     </Pressable>
                </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text className="text-[#A0A0A0] text-center mt-10">Aucun revenu ce mois-ci.</Text>}
      />
    </View>
  );
}
