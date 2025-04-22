'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from './auth-context';

interface Transaction {
  id?: number;
  type: 'expense' | 'income';
  amount: number;
  category_id: number;
  description?: string;
  note?: string;
  is_recurring: boolean;
  date: Date;
}

// {
//     "type": "expense",
//     "amount": "100",
//     "category": "food",
//     "description": "jioji",
//     "date": "2025-04-22T15:30:41.482Z"
// }

interface TransactionsContextType {
  transactions: Transaction[];
  isLoading: boolean;
//   createTransaction: (data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  createTransaction: (data: Transaction) => Promise<void>;
  updateTransaction: (id: number, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  getTransactions: () => Promise<void>;
  getTransactionById: (id: number) => Promise<Transaction | null>;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();

  const getTransactions = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/get-all`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('ไม่สามารถดึงข้อมูลรายการได้');
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setTransactions((prev) => [...prev, response.data]);
      toast.success('บันทึกรายการสำเร็จ');
      getTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('ไม่สามารถบันทึกรายการได้');
      throw error;
    }
  };

  const updateTransaction = async (id: number, data: Partial<Transaction>) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/update/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setTransactions((prev) =>
        prev.map((transaction) => (transaction.id === id ? response.data : transaction))
      );
      toast.success('อัปเดตรายการสำเร็จ');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('ไม่สามารถอัปเดตรายการได้');
      throw error;
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/transactions/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
      toast.success('ลบรายการสำเร็จ');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('ไม่สามารถลบรายการได้');
      throw error;
    }
  };

  const getTransactionById = async (id: number): Promise<Transaction | null> => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/get-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      toast.error('ไม่สามารถดึงข้อมูลรายการได้');
      return null;
    }
  };

  useEffect(() => {
    getTransactions();
  }, []);

  const value = {
    transactions,
    isLoading,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactions,
    getTransactionById,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
} 