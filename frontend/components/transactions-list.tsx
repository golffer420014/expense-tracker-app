"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Coffee, Bus, Home, Briefcase, MoreVertical, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useTransactions } from "@/lib/context/transactions-context"
import { Skeleton } from "./ui/skeleton"
import { useCategories } from "@/lib/context/categories-context"
import { TransactionFilters } from "./transaction-filters"

// Helper function to get icon by category
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

type Transaction = {
    id: number
    description: string
    amount: number
    category: string
    date: Date
    isIncome: boolean
}

export function TransactionsList() {
    const { isLoading, transactions } = useTransactions();
    const { categories } = useCategories();
    const [model, setModel] = useState<Transaction[]>()
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        setInitialModel()
    }, [transactions])

    const setInitialModel = () => {
        setModel(transactions.map((t) => ({
            id: t.id!, // Add non-null assertion since id is required
            description: t.description || 'N/A', // Provide default empty string
            amount: t.amount,
            category: categories.find((c: { id: number, name: string }) => c.id === t.category_id)?.name ?? "ไม่มีหมวดหมู่",
            date: t.date,
            isIncome: t.type === "income",
        })))
    }

    const handleEdit = (id: number) => {
        // Navigate to edit page or open edit modal
        console.log("Edit transaction", id)
    }

    const handleDelete = (id: number) => {
        // Delete transaction
        setModel(model?.filter((t) => t.id !== id))
    }

    const formatDate = (dateString: Date) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("th-TH", { day: "numeric", month: "short" })
    }

    const filteredTransactions = model?.filter(
        (transaction) =>
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )


    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>รายการทั้งหมด</CardTitle>
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

    return (
        <div className="space-y-4">
            <TransactionFilters model={model ?? []} setInitialModel={setInitialModel} setModel={setModel} />
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                <Input
                    placeholder="ค้นหารายการ..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Card className="overflow-hidden !p-0">
                <div className="divide-y">
                    {filteredTransactions && filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction, index) => (
                            <div key={index} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                                <div
                                    className={`flex items-center justify-center h-10 w-10 rounded-full mr-3 ${getCategoryColor(transaction.category)}`}
                                >
                                    {getCategoryIcon(transaction.category)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{transaction.description}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDate(transaction.date)} • {transaction.category}
                                    </p>
                                </div>

                                <div className="flex items-center">
                                    <span className={`font-medium ${transaction.isIncome ? "text-green-600" : "text-red-600"}`}>
                                        {transaction.isIncome ? "+" : "-"}
                                        {transaction.amount ? Number(transaction.amount).toLocaleString('th-TH', {
                                            style: 'currency',
                                            currency: 'THB',
                                            minimumFractionDigits: 0,
                                        }) : "0"}
                                    </span>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="ml-2 focus:outline-none">
                                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(transaction.id)}>แก้ไข</DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(transaction.id)}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                ลบ
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center text-muted-foreground">ไม่พบรายการที่ค้นหา</div>
                    )}
                </div>
            </Card>
        </div>
    )
}