"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTransactions } from "@/lib/context/transactions-context";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Skeleton } from "./ui/skeleton";

export function MonthSummary() {
  const { isLoading, summary } = useTransactions();


  const formatNumber = (value: string) => {
    if (!value) return '0';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [integer, decimal] = value.split('.');
    return Number(integer).toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
    });
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden !p-0">
        <CardContent className="!p-0">
          <div className="grid grid-cols-3 divide-x">
            <div className="p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-1">รายรับ</span>
              <div className="flex items-center">
                <Skeleton className="h-[24px] w-16" />
              </div>
            </div>

            <div className="p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-1">รายจ่าย</span>
              <div className="flex items-center">
                <Skeleton className="h-[24px] w-16" />
              </div>
            </div>

            <div className="p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-1">คงเหลือ</span>
              <Skeleton className="h-[24px] w-16" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden !p-0">
      <CardContent className="!p-0">
        <div className="grid grid-cols-3 divide-x">
          <div className="p-4 flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">รายรับ</span>
            <div className="flex items-center">
              <ArrowUpIcon className="h-4 w-4 mr-1 text-green-500" />
              <span className="font-semibold">{formatNumber(summary.total_income ?? '0')}</span>
            </div>
          </div>

          <div className="p-4 flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">รายจ่าย</span>
            <div className="flex items-center">
              <ArrowDownIcon className="h-4 w-4 mr-1 text-red-500" />
              <span className="font-semibold">{formatNumber(summary.total_expense ?? '0')}</span>
            </div>
          </div>

          <div className="p-4 flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">คงเหลือ</span>
            <span className={`font-semibold ${Number(summary.balance) >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatNumber(summary.balance ?? '0')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}