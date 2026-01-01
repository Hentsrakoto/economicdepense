import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useUser } from '../context/UserContext';
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

  const { settings } = useUser();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    const data = await getData('transactions');
    if (data) setTransactions(data);
    setLoading(false);
  };



  const addTransaction = React.useCallback((title: string, amount: number, date: Date, type: TransactionType) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title,
      amount,
      date: date.toISOString(),
      type,
    };
    // Need access to current transactions, so we use functional update in saveTransactions if possible or dependency
    // Since saveTransactions is async and we need optimistic update or reliable state, let's keep it simple.
    // Ideally use setTransactions(prev => ...) but we need to save to disk too.
    
    setTransactions(prev => {
        const updated = [...prev, newTransaction];
        storeData('transactions', updated); // Fire and forget for disk
        return updated;
    });
  }, []);

  const deleteTransaction = React.useCallback((id: string) => {
    Alert.alert(
      "Supprimer",
      "Êtes-vous sûr de vouloir supprimer ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive", 
          onPress: () => {
             setTransactions(prev => {
                const updated = prev.filter(t => t.id !== id);
                storeData('transactions', updated);
                return updated;
             });
          }
        }
      ]
    );
  }, []);

  const editTransaction = React.useCallback((id: string, updated: Partial<Transaction>) => {
    setTransactions(prev => {
         const newTrans = prev.map(t => t.id === id ? { ...t, ...updated } : t);
         storeData('transactions', newTrans);
         return newTrans;
    });
  }, []);

  const getMonthlyTotal = React.useCallback((type: TransactionType, month: number, year: number) => {
    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return t.type === type && d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const getBalance = React.useCallback(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return (settings.principalFund || 0) + income - expense;
  }, [transactions, settings.principalFund]);

  const value = React.useMemo(() => ({
    transactions, 
    addTransaction, 
    deleteTransaction, 
    editTransaction, 
    getMonthlyTotal, 
    getBalance, 
    loading
  }), [transactions, loading, addTransaction, deleteTransaction, editTransaction, getMonthlyTotal, getBalance]);

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) throw new Error("useTransactions must be used within a TransactionProvider");
  return context;
};
