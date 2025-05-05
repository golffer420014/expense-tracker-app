'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './auth-context';
import { TransactionsProvider } from './transactions-context';
import { CategoriesProvider } from './categories-context';
import { ThemeProvider } from './theme-provider';
import { BudgetsProvider } from './budgets-context';

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <TransactionsProvider>
        <CategoriesProvider>
          <BudgetsProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </BudgetsProvider>
        </CategoriesProvider>
      </TransactionsProvider>
    </AuthProvider>
  );
} 