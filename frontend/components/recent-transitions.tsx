"use client"

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingBag, Plus, Minus, ArrowRight, Coffee, Bus, Home, Briefcase } from "lucide-react"
import { useTransactions } from "@/lib/context/transactions-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { cn, formatAmount } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useCategories } from "@/lib/context/categories-context"

const getCategoryIcon = (category: string) => {
    switch (category) {
        case "อาหาร":
            return <Coffee className="h-4 w-4" />
        case "เดินทาง":
            return <Bus className="h-4 w-4" />
        case "ช้อปปิ้ง":
            return <ShoppingBag className="h-4 w-4" />
        case "ที่พัก":
            return <Home className="h-4 w-4" />
        case "รายได้":
            return <Briefcase className="h-4 w-4" />
        default:
            return <Coffee className="h-4 w-4" />
    }
}

// Helper function to get color by category
const getCategoryColor = (category: string) => {
    switch (category) {
        case "อาหาร":
            return "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300"
        case "เดินทาง":
            return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
        case "ช้อปปิ้ง":
            return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300"
        case "ที่พัก":
            return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
        case "รายได้":
            return "bg-emerald-100 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
        default:
            return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
    }
}



export function RecentTransactions() {
    const router = useRouter()
    const { transactions, isLoading: isTransactionsLoading, showMoney } = useTransactions();
    const { isLoading: isCategoriesLoading } = useCategories();


    const formatDate = (dateString: Date) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("th-TH", { day: "numeric", month: "short" })
    }



    if (isTransactionsLoading || isCategoriesLoading) {
        return (
            <Card className="!pt-6">
                <CardHeader>
                    <CardTitle>รายการล่าสุด</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-[200px]" />
                                    <Skeleton className="h-3 w-[150px]" />
                                </div>
                                <Skeleton className="h-4 w-[100px]" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (transactions.length === 0) {
        return (
            <Card className="!pt-6">
                <CardHeader>
                    <CardTitle>รายการล่าสุด</CardTitle>
                </CardHeader>
                <CardContent className="!p-0 !py-0">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-muted p-4 mb-4">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">ไม่มีรายการ</h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-4">
                            เริ่มต้นบันทึกรายการแรกของคุณ
                        </p>
                        <Button variant="outline" className="gap-2">
                            เพิ่มรายการใหม่
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className=" !pb-0">
            <CardHeader>
                <CardTitle>รายการล่าสุด</CardTitle>
            </CardHeader>
            <CardContent className="!p-0">
                <div className="">
                    {transactions
                        // .filter(transaction => {
                        //     // Filter transactions for current month
                        //     const currentDate = new Date();
                        //     const transactionDate = new Date(transaction.date);
                        //     return (
                        //         transactionDate.getMonth() === currentDate.getMonth() &&
                        //         transactionDate.getFullYear() === currentDate.getFullYear()
                        //     );
                        // })
                        .slice(0, 5)
                        .map((transaction) => {
                        return (
                            <div
                                key={transaction.id || 0}
                                className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                            >
                                <Avatar className={cn(
                                    "h-10 w-10 transition-transform group-hover:scale-110",
                                    transaction.category_name && getCategoryColor(transaction.category_name)
                                )}>
                                    <AvatarFallback>
                                        {getCategoryIcon(transaction?.category_name || '')}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                        <p className="font-medium truncate">{transaction.description || 'N/A'}</p>
                                        {transaction.is_recurring && (
                                            <Badge variant="secondary" className="text-xs">
                                                รายเดือน
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <span>{formatDate(transaction.date)}</span>
                                        <span>•</span>
                                        <span>{transaction.category_name || 'ไม่มีหมวดหมู่'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className={cn(
                                        "flex items-center font-medium",
                                        transaction.type === "income" ? "text-green-600" : "text-red-600"
                                    )}>
                                        {transaction.type === "income" ? (
                                            <Plus className="h-4 w-4 mr-1" />
                                        ) : (
                                            <Minus className="h-4 w-4 mr-1" />
                                        )}
                                        {formatAmount(transaction.amount, showMoney)}
                                    </div>


                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
            <CardFooter className="border-t !p-0 !py-0">
                <Button variant="ghost" className="w-full !py-6 gap-2 cursor-pointer" onClick={() => router.push('/transactions')}>
                    ดูรายการทั้งหมด
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}