'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/context/auth-context';
import { TransactionsProvider } from '@/lib/context/transactions-context';
import { CategoriesProvider } from '@/lib/context/categories-context';
import { ThemeProvider } from '@/lib/context/theme-provider';
import { BudgetsProvider } from '@/lib/context/budgets-context';
import { ReportsProvider } from '@/lib/context/reports-context';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <TransactionsProvider>
        <CategoriesProvider>
          <BudgetsProvider>
            <ReportsProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </ReportsProvider>
        </BudgetsProvider>
        </CategoriesProvider>
      </TransactionsProvider>
    </AuthProvider>
  );
} 