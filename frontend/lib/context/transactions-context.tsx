'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from './auth-context';

interface Transaction {
  id?: number;
  type: 'expense' | 'income';
  amount: number;
  category_name?: string; // case get
  category_id?: number; // case post
  description?: string;
  note?: string;
  is_recurring: boolean;
  date: Date;
}

interface Summary {
  user_id: string;
  year: number;
  month: number;
  total_income: number;
  total_expense: number;
  balance: number;
  total_days_in_month: number;
  today: number;
  days_left: number;
  avg_daily_budget_left: number;
}

interface TransactionsContextType {
  transactions: Transaction[];
  summary: Summary;
  filteredTransactions: Filter;
  showMoney: boolean;
  isLoading: boolean;
  setFilteredTransactions: (filteredTransactions: Filter) => void;
  //   createTransaction: (data: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  createTransaction: (data: Transaction) => Promise<number>;
  updateTransaction: (id: number, data: Partial<Transaction>) => Promise<number>;
  deleteTransaction: (id: number) => Promise<void>;
  getTransactions: (search?: string) => Promise<void>;
  getUserMonthlySummary: (month: number, year: number) => Promise<void>;
  toggleShowMoney: () => void;
}

interface Filter {
  date?: Date;
  category?: string;
  type?: string;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  // 

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    user_id: '',
    total_income: 0,
    total_expense: 0,
    balance: 0,
    month: 0,
    year: 0,
    total_days_in_month: 0,
    today: 0,
    days_left: 0,
    avg_daily_budget_left: 0
  });
  const [filteredTransactions, setFilteredTransactions] = useState<Filter>({
    date: undefined,
    category: 'all',
    type: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showMoney, setShowMoney] = useState(true);

  useEffect(() => {
    const savedShowMoney = localStorage.getItem('showMoney');
    if (savedShowMoney !== null) {
      setShowMoney(savedShowMoney === 'true');
    }
  }, []);

  const toggleShowMoney = () => {
    const newValue = !showMoney;
    setShowMoney(newValue);
    localStorage.setItem('showMoney', newValue.toString());
  };

  const getTransactions = async (search?: string) => {
    try {
      if (!getToken()) {
        return;
      }
      setIsLoading(true);
      const route = search ? `/transactions/get-all?search=${search}` : '/transactions/get-all';
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${route}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('ไม่สามารถดึงข้อมูลรายการได้');
    } finally {
      await new Promise(resolve => setTimeout(resolve, 500));
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
      return response.status;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('ไม่สามารถบันทึกรายการได้');
      throw error;
    }
  };

  const updateTransaction = async (id: number, data: Partial<Transaction>) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/update-transaction/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return response.status;
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('ไม่สามารถอัปเดตรายการได้');
      throw error;
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/transactions/remove-transaction/${id}`, {
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

  // _____________

  const getUserMonthlySummary = async (month: number, year: number) => {
    try {
      if (!getToken()) {
        return;
      }
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transactions/get-user-monthly-summary`, {
        month,
        year,
      }, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching user monthly summary:', error);
      toast.error('ไม่สามารถดึงข้อมูลรายการได้');
    }
  }

  const value = {
    transactions,
    summary,
    filteredTransactions,
    showMoney,
    isLoading,
    setFilteredTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactions,
    getUserMonthlySummary,
    toggleShowMoney,
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