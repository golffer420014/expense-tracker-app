'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { showToast } from '@/lib/utils/toast';
import axios from 'axios';

interface categories {
  id: number;
  category_id: number;
  name: string;
  type: string;
  note: string;
  description: string;
  date: Date;
}

type CategoriesContextType = {
  categories: categories[];
  isLoading: boolean;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<categories[]>([]);
  const [isLoading, setIsLoading] = useState(true);


  const getCategories = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/get-all`);
        setCategories(response.data);
    } catch (error) {
        showToast.error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
        console.error('Error fetching categories:', error);
    } finally {
        setIsLoading(false);
    }
}

  useEffect(() => {
    getCategories();
  }, []);

  const value = {
    categories,
    isLoading,
  };

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within an CategoriesProvider');
  }
  return context;
} 