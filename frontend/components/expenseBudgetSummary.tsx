"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertCircle } from "lucide-react"
import { currentYear, months, years } from "@/lib/date-utils"
import { useReports } from "@/lib/context/reports-context"
import { useTransactions } from "@/lib/context/transactions-context"
import { formatAmount } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { TooltipProps } from 'recharts';

type CategoryData = {
  name: string
  value: number
  budget: number
  isOver: boolean
}

const COLORS = [
  "#f59e0b", // amber
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#ec4899", // pink
  "#6366f1", // indigo
  "#14b8a6", // teal
  "#f43f5e", // rose
]

const CustomTooltip = (props: TooltipProps<string, number>) => {
  const { active, payload } = props;
  const { showMoney } = useTransactions();

  if (active && payload && payload.length) {
    return (
      <div className="bg-background text-foreground p-2 rounded-md shadow-md">
        <p className="label">{`จำนวนเงิน : ${formatAmount(payload[0].value ?? 0, showMoney)} บาท`}</p>
      </div>
    );
  }
  return null;
}


export function ExpenseBudgetSummary() {
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const { showMoney } = useTransactions();
  const [viewType, setViewType] = useState("pie")
  const { expenseBudgetSummary, getExpenseBudgetSummary } = useReports();

  useEffect(() => {
    getExpenseBudgetSummary(year, month);
  }, [year, month]);

  // Transform expenseBudgetSummary data to match the required format
  const data: CategoryData[] = expenseBudgetSummary?.map((item) => ({
    name: item.category_name,
    value: Number(item.total_expense),
    budget: Number(item.budget_amount),
    isOver: item.is_over_budget
  })) || [];

  const total = data.reduce((sum, item) => sum + item.value, 0)

  // Transform data for bar chart
  const barData = data.map((item) => ({
    name: item.name,
    จ่ายจริง: item.value,
    งบประมาณ: item.budget,
  }))

  // Calculate total budget
  const totalBudget = data.reduce((sum, item) => sum + item.budget, 0)
  const getbudgetPercentage = (value: number, budget: number) => {
    return Math.min(100, Math.round((value / budget) * 100))
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">สัดส่วนรายจ่ายตามหมวดหมู่</CardTitle>
        <div className="flex gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="ปี" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y.value} value={y.value}>
                  {y.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="เดือน" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pie" onValueChange={setViewType} className="w-full mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pie">แผนภูมิวงกลม</TabsTrigger>
            <TabsTrigger value="bar">แผนภูมิแท่ง</TabsTrigger>
            <TabsTrigger value="budget">งบประมาณ</TabsTrigger>
          </TabsList>
        </Tabs>

        {viewType === "pie" && (
          <div className="h-80">
            {data.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400">ไม่มีข้อมูล</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ percent }: { percent: number }) =>
                      percent > 0.05 ? `${(percent * 100).toFixed(2)}%` : ''
                    }
                    labelLine={false}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="transition-opacity hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={CustomTooltip} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        )}

        {viewType === "bar" && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={80} />
                <Tooltip content={CustomTooltip} />
                <Legend />
                <Bar dataKey="งบประมาณ" fill="#3b82f6" />
                <Bar dataKey="จ่ายจริง" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {viewType === "budget" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">

                <span className="text-sm font-medium">งบประมาณรวม <Badge variant="outline">{formatAmount(totalBudget, showMoney)}</Badge></span>
              </div>

            </div>

            <div className="space-y-4">
              {data.map((category) => {
                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm">
                        {formatAmount(category.value, showMoney)} / {formatAmount(category.budget, showMoney)}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={getbudgetPercentage(category.value, category.budget)}
                        color={
                          category.isOver
                            ? "bg-[#f43f5e]" // แดง
                            : getbudgetPercentage(category.value, category.budget) >= 80
                              ? "bg-[#f59e0b]" // ส้ม
                              : "bg-[#10b981]" // เขียว
                        }
                      />
                      <div
                        className="absolute top-0 h-full w-[2px] bg-black dark:bg-white transition-all"
                        style={{ left: `${getbudgetPercentage(category.value, category.budget)}%` }}
                      ></div>
                    </div>
                    {category.isOver && (
                      <div className="flex items-center text-[#f43f5e] text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>เกินงบประมาณ {formatAmount(category.value - category.budget, showMoney)}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {viewType !== "budget" && (
          <div className="mt-4 space-y-3">
            {data.map((category, index) => (
              <div
                key={category.name}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium">
                    {formatAmount(category.value, showMoney)}
                  </span>
                  <span className="text-sm text-muted-foreground min-w-[50px] text-right">
                    {((category.value / total) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}