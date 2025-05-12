"use client"

import { Card, CardContent } from "@/components/ui/card"
import { useTransactions } from "@/lib/context/transactions-context";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton";
import { formatAmount } from "@/lib/utils";

export function MonthSummary() {
  const { isLoading, summary, showMoney } = useTransactions();



  if (isLoading) {
    return (
      <Card className="overflow-hidden !p-0">
        <CardContent className="!p-0">
          <div className="grid grid-cols-3 divide-x divide-y">
            {/* Skeleton loaders */}
            <div className="p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-1">รายรับ</span>
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-1">รายจ่าย</span>
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-1">คงเหลือ</span>
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="col-span-3 p-4 flex flex-col items-center">
              <span className="text-sm text-muted-foreground mb-1">งบประมาณ</span>
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden !p-0">
      <CardContent className="!p-0">
        <div className="grid grid-cols-3 divide-x divide-y">
          {/* รายรับ */}
          <div className="p-4 flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">รายรับ</span>
            <div className="flex items-center">
              <ArrowUpIcon className="h-4 w-4 mr-1 text-green-500" />
              <span className="font-semibold">{formatAmount(summary.total_income, showMoney)}</span>
            </div>
          </div>

          {/* รายจ่าย */}
          <div className="p-4 flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">รายจ่าย</span>
            <div className="flex items-center">
              <ArrowDownIcon className="h-4 w-4 mr-1 text-red-500" />
              <span className="font-semibold">{formatAmount(summary.total_expense, showMoney)}</span>
            </div>
          </div>

          {/* คงเหลือ */}
          <div className="p-4 flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">คงเหลือ</span>
            <span className={`font-semibold ${Number(summary.balance) >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatAmount(summary.balance, showMoney)}
            </span>
          </div>

          {/* งบประมาณ */}
          <div className="col-span-3 p-4 flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">งบประมาณ</span>
            <div className="flex items-center">
              <span className="font-semibold">{formatAmount(summary.avg_daily_budget_left, showMoney)}</span>
              <span className="text-sm text-muted-foreground ml-1">ต่อวัน</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
