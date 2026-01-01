import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Typography } from '../components/ui/Typography';
import { useUser } from '../context/UserContext';
import { useTheme } from '../hooks/useTheme';
import { Transaction, useTransactions } from '../hooks/useTransactions';
import { CURRENCIES, translations } from '../utils/i18n';

export default function ExpensesScreen() {
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

  const expenses = transactions.filter(t => t.type === 'expense').sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAdd = () => {
    if (!title || !amount) return;
    if (isEditing) {
        editTransaction(isEditing, { title, amount: parseFloat(amount), date: date.toISOString() });
        setIsEditing(null);
    } else {
        addTransaction(title, parseFloat(amount), date, 'expense');
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

  const bgColor = theme.isDark ? 'bg-[#121212]' : 'bg-[#F2F2EB]';

  return (
    <SafeAreaView className={`flex-1 flex-col px-5 ${bgColor}`} edges={['top']}>
      <Typography variant="h2" className="mb-6 mt-4">{t.expenses}</Typography>

      {/* Input Form */}
      <Card className="mb-6 border">
        <View className="space-y-4">
            <Input 
                placeholder={t.titlePlaceholder} 
                value={title}
                onChangeText={setTitle}
            />
            
            <View className="flex-row space-x-3">
                <Input
                    containerClassName="flex-1"
                    placeholder={`${t.amountPlaceholder} (${currencySymbol})`} 
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
                
                <Button 
                    variant="outline"
                    onPress={() => setShowDatePicker(true)}
                >
                    {date.toLocaleDateString()}
                </Button>
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

            <Button onPress={handleAdd} className="bg-red-500">
                {isEditing ? t.modify : t.addExpense}
            </Button>
            
            {isEditing && (
                 <TouchableOpacity onPress={() => { setIsEditing(null); setTitle(''); setAmount(''); }} className="items-center">
                    <Typography variant="caption">{t.cancelEdit}</Typography>
                 </TouchableOpacity>
            )}
        </View>
      </Card>

      {/* List */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card className="mb-3 border-l-4 border-l-red-500 py-3">
            <View className="flex-row justify-between items-center">
                <View className="flex-1">
                    <Typography variant="h4">{item.title}</Typography>
                    <Typography variant="caption">{new Date(item.date).toLocaleDateString()}</Typography>
                </View>
                <View className="items-end">
                    <Typography className="text-red-400 font-bold text-lg mb-1">-{item.amount} {currencySymbol}</Typography>
                    <View className="flex-row space-x-3">
                         <TouchableOpacity onPress={() => handleEditInit(item)}>
                            <Ionicons name="pencil" size={20} color={theme.isDark ? "#BB86FC" : "#8B4513"} />
                         </TouchableOpacity>
                         <TouchableOpacity onPress={() => deleteTransaction(item.id)}>
                            <Ionicons name="trash" size={20} color="#ef4444" />
                         </TouchableOpacity>
                    </View>
                </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={<Typography className="text-center mt-10 text-gray-400">{t.noExpenses}</Typography>}
      />
    </SafeAreaView>
  );
}

