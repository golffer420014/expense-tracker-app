'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { showToast } from '@/lib/toast';
import axios from 'axios';
import { useAuth } from '@/lib/context/auth-context';
import _ from 'lodash';

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
  const { getToken } = useAuth();

  const getCategories = async () => {
    try {
      if (!getToken()) return;
  
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/get-all`);
      const sorted = sortCategories(response.data);
      setCategories(sorted);
    } catch (error) {
      showToast.error('ไม่สามารถดึงข้อมูลหมวดหมู่ได้');
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // option

  const sortCategories = (categories: categories[]) => {
    const sorted = _.chain(categories)
      .groupBy('type') // แยก income / expense
      .map((items: categories[]) => {
        const others = items.filter(i => i.name === 'อื่นๆ');
        const normal = _.orderBy(items.filter(i => i.name !== 'อื่นๆ'), ['name'], ['asc']);
        return [...normal, ...others];
      })
      .flatten()
      .value();
  
    return sorted;
  };

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