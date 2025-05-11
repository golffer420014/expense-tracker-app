'use client';

import { ReactNode } from 'react';
import { AuthProvider } from './auth-context';
import { TransactionsProvider } from './transactions-context';
import { CategoriesProvider } from './categories-context';
import { ThemeProvider } from './theme-provider';
import { BudgetsProvider } from './budgets-context';
import { ReportsProvider } from './reports-context';

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