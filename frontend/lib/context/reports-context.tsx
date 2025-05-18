'use client';

import { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/lib/context/auth-context';
import iReportYearly from '@/interface/i-report-yearly';
import _ from 'lodash';
import { months } from '@/lib/date-utils';
import { iReportExpenseBudget } from '@/interface/i-report-expense-budget';

type ReportsContextType = {
    yearlySummary: iReportYearly[];
    expenseBudgetSummary: iReportExpenseBudget[];
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    getYearlySummary: (year: string) => Promise<void>; // ?year=2025&month=05
    getExpenseBudgetSummary: (year: string, month: string) => Promise<void>; // ?year=2025&month=05
};

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: React.ReactNode }) {
    const [yearlySummary, setYearlySummary] = useState<iReportYearly[]>([]);
    const [expenseBudgetSummary, setExpenseBudgetSummary] = useState<iReportExpenseBudget[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getToken } = useAuth();

    const getYearlySummary = async (year: string) => {
        try {
            setIsLoading(true);
            if (!getToken()) return;
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/get-yearly-summary?year=${year}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            const data = _.map(response.data, (item, index) => ({
                ...item,
                month: months[index].label
            }));
            setYearlySummary(data);
        } catch (error) {
            console.error('Error getting yearly summary:', error);
        } finally {
            await new Promise((resolve) => setTimeout(resolve, 500))
            setIsLoading(false);
        }
    };

    const getExpenseBudgetSummary = async (year: string, month: string) => {
        try {
            setIsLoading(true);
            if (!getToken()) return;
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports/get-expense-budget-summary?year=${year}&month=${month}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            console.log(response.data);
            setExpenseBudgetSummary(response.data);
        } catch (error) {
            console.error('Error getting expense budget summary:', error);
        } finally {
            await new Promise((resolve) => setTimeout(resolve, 500))
            setIsLoading(false);
        }
    };

    const value = {
        yearlySummary,
        expenseBudgetSummary,
        isLoading,
        setIsLoading,
        getYearlySummary,
        getExpenseBudgetSummary,
    };

    return <ReportsContext.Provider value={value}>{children}</ReportsContext.Provider>;
}

export function useReports() {
    const context = useContext(ReportsContext);
    if (context === undefined) {
        throw new Error('useReports must be used within an ReportsProvider');
    }
    return context;
} 