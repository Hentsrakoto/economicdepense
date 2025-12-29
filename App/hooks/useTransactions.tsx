import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getData, storeData } from '../utils/storage';

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string; // ISO string
  type: TransactionType;
}

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (title: string, amount: number, date: Date, type: TransactionType) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (id: string, updated: Partial<Transaction>) => void;
  getMonthlyTotal: (type: TransactionType, month: number, year: number) => number;
  getBalance: () => number;
  loading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await getData('transactions');
    if (data) setTransactions(data);
    setLoading(false);
  };

  const saveTransactions = async (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    await storeData('transactions', newTransactions);
  };

  const addTransaction = (title: string, amount: number, date: Date, type: TransactionType) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title,
      amount,
      date: date.toISOString(),
      type,
    };
    saveTransactions([...transactions, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    Alert.alert(
      "Supprimer",
      "Êtes-vous sûr de vouloir supprimer ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive", 
          onPress: () => saveTransactions(transactions.filter(t => t.id !== id))
        }
      ]
    );
  };

  const editTransaction = (id: string, updated: Partial<Transaction>) => {
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, ...updated } : t
    );
    saveTransactions(updatedTransactions);
  };

  const getMonthlyTotal = (type: TransactionType, month: number, year: number) => {
    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === type && d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getBalance = () => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return income - expense;
  };

  return (
    <TransactionContext.Provider value={{
      transactions, addTransaction, deleteTransaction, editTransaction, getMonthlyTotal, getBalance, loading
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error("useTransactions must be used within a TransactionProvider");
  return context;
};
