'use client';

import { createContext, useContext, useState } from 'react';
import { showToast } from '@/lib/toast';
import axios from 'axios';
import { useAuth } from './auth-context';
import iBudget from '@/interface/i-budget';
import _ from 'lodash';


type BudgetsContextType = {
  budgets: iBudget[];
  isLoading: boolean;
  setBudgets: (budgets: iBudget[]) => void;
  getBudgets: (query: string) => Promise<void>; // ?year=2025&month=05
  createBudget: (budget: iBudget) => Promise<void>;
  updateBudget: (id: string, amount: string) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
};

const BudgetsContext = createContext<BudgetsContextType | undefined>(undefined);

export function BudgetsProvider({ children }: { children: React.ReactNode }) {
  const [budgets, setBudgets] = useState<iBudget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getToken } = useAuth();

  const getBudgets = async (query: string) => {
    try {
      setIsLoading(true);
      if (!getToken()) return;
      const response = await
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/budgets/get-all?${query}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });
      setBudgets(_.map(response.data, (item) => ({
        ...item,
        amount: Number(item.amount),
        isEditing: false,
      })));
    } catch (error) {
      showToast.error('ไม่สามารถดึงข้อมูลงบประมาณได้');
      console.error('Error fetching budgets:', error);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsLoading(false);
    }
  };

  const createBudget = async (budget: iBudget) => {
    try {
      if (!getToken()) return;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/budgets/create`, budget, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      if (response.status === 200) {
        showToast.success('สร้างงบประมาณเรียบร้อย');
        setBudgets([...budgets, response.data]);
      }
    } catch (error) {
      showToast.error('ไม่สามารถสร้างงบประมาณได้');
      console.error('Error creating budget:', error);
    }
  };

  const updateBudget = async (id: string, amount: string) => {
    try {
      if (!getToken()) return;

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/budgets/update-budget/${id}`,
        { amount },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (response.status === 200) {
        showToast.success('อัพเดทงบประมาณเรียบร้อย');

        // อัพเดทข้อมูลในสเตท
        setBudgets(
          budgets.map((budget) =>
            budget.id === id ? { ...budget, amount: amount, isEditing: false } : budget
          )
        );
      }
    } catch (error) {
      showToast.error('ไม่สามารถอัพเดทงบประมาณได้');
      console.error('Error updating budget:', error);
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      if (!getToken()) return;

      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/budgets/remove-budget/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (response.status === 200) {
        showToast.success('ลบงบประมาณเรียบร้อย');

        // ลบข้อมูลออกจากสเตท
        setBudgets(budgets.filter((budget) => budget.id !== id));
      }
    } catch (error) {
      showToast.error('ไม่สามารถลบงบประมาณได้');
      console.error('Error deleting budget:', error);
    }
  };

  const value = {
    budgets,
    isLoading,
    setBudgets,
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
  };

  return <BudgetsContext.Provider value={value}>{children}</BudgetsContext.Provider>;
}

export function useBudgets() {
  const context = useContext(BudgetsContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within an BudgetsProvider');
  }
  return context;
} 