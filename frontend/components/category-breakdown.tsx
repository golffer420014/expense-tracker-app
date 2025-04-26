"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useEffect, useState } from "react"
import { useTransactions } from "@/lib/context/transactions-context"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingBag } from "lucide-react"

type CategoryData = {
    name: string
    value: number
    color: string
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

const formatAmount = (amount: number) => {
    return amount.toLocaleString('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

const CustomTooltip = ({ active, payload }: { active: boolean, payload: { value: number, name: string }[] }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background text-foreground p-2 rounded-md shadow-md">
                <p className="label">{`จำนวนเงิน : ${formatAmount(payload[0].value)} บาท`}</p>
            </div>
        );
    }
}

export function CategoryBreakdown() {
    const { transactions, isLoading } = useTransactions()
    const [data, setData] = useState<CategoryData[]>([
        { name: "อาหาร", value: 8500, color: "#f59e0b" },
    ])

    useEffect(() => {
        const expenseCategories = transactions.filter((transaction) => transaction.type === "expense")

        // Group by category and sum amounts
        const categoryMap = new Map<string, number>()
        expenseCategories.forEach(transaction => {
            const category = transaction.description || "N/A"
            const currentAmount = categoryMap.get(category) || 0
            // Convert amount to number if it's a string
            const amount = typeof transaction.amount === 'string'
                ? parseFloat(transaction.amount)
                : transaction.amount
            categoryMap.set(category, currentAmount + amount)
        })

        // Convert to array with colors
        const categoryData = Array.from(categoryMap.entries()).map(([name, value], index) => ({
            name,
            value,
            color: COLORS[index % COLORS.length]
        }))


        setData(categoryData)
    }, [transactions])

    const total = data.reduce((sum, item) => sum + item.value, 0)

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>หมวดหมู่รายจ่าย</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center">
                        <Skeleton className="h-48 w-48 rounded-full" />
                    </div>
                    <div className="mt-4 space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>หมวดหมู่รายจ่าย</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">ไม่มีข้อมูล</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            ยังไม่มีรายการรายจ่าย
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>หมวดหมู่รายจ่าย</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
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
                                    percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                                }
                                labelLine={false}
                            >
                                {data.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        className="transition-opacity hover:opacity-80"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                content={<CustomTooltip active={true} payload={data} />}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 space-y-3">
                    {data.map((category) => (
                        <div
                            key={category.name}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                />
                                <span className="font-medium">{category.name}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="font-medium">
                                    {formatAmount(category.value)}
                                </span>
                                <span className="text-sm text-muted-foreground min-w-[50px] text-right">
                                    {((category.value / total) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}