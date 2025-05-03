"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Coffee, Bus, Home, Briefcase, MoreVertical, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useTransactions } from "@/lib/context/transactions-context"
import { Skeleton } from "./ui/skeleton"
import { Button } from "@/components/ui/button"

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
    const { isLoading, transactions, filteredTransactions, getTransactions, showMoney } = useTransactions();
    const [model, setModel] = useState<Transaction[]>()
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    useEffect(() => {
        setInitialModel()
    }, [transactions])

    useEffect(() => {
        getTransactions('')
    }, [])

    const setInitialModel = () => {
        setModel(transactions.map((t) => ({
            id: t.id!, // Add non-null assertion since id is required
            description: t.description || 'N/A', // Provide default empty string
            amount: t.amount,
            category: t.category_name ?? "ไม่มีหมวดหมู่",
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

    // Apply model filtering first by search term, then by filter criteria
    const applyFiltering = (transaction: Transaction) => {
        // First apply search term filter
        const matchesSearch = 
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!matchesSearch) return false;
        
        // Then apply context filters
        if (filteredTransactions.type !== 'all') {
            const isIncomeFilter = filteredTransactions.type === 'income';
            if (transaction.isIncome !== isIncomeFilter) return false;
        }
        
        if (filteredTransactions.category !== 'all' && transaction.category !== filteredTransactions.category) {
            return false;
        }
        
        if (filteredTransactions.date) {
            const filterDate = new Date(filteredTransactions.date);
            const transactionDate = new Date(transaction.date);
            
            if (
                filterDate.getFullYear() !== transactionDate.getFullYear() ||
                filterDate.getMonth() !== transactionDate.getMonth() ||
                filterDate.getDate() !== transactionDate.getDate()
            ) {
                return false;
            }
        }
        
        return true;
    }

    const transactionsFiltered = model?.filter(applyFiltering);

    // Reset to first page when search term or filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, filteredTransactions])

    // Calculate pagination
    const totalItems = transactionsFiltered?.length || 0
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedTransactions = transactionsFiltered?.slice(startIndex, startIndex + itemsPerPage)

    // Page navigation handlers
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }


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
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <Input
                        placeholder="ค้นหารายการ..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
              
            </div>

            <Card className="overflow-hidden !p-0">
                <div className="divide-y">
                    {paginatedTransactions && paginatedTransactions.length > 0 ? (
                        paginatedTransactions.map((transaction, index) => (
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
                                        {showMoney 
                                            ? transaction.amount 
                                                ? Number(transaction.amount).toLocaleString('th-TH', {
                                                    style: 'currency',
                                                    currency: 'THB',
                                                    minimumFractionDigits: 0,
                                                  }) 
                                                : "0"
                                            : "••••••"
                                        }
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
                
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t p-4">
                        <div className="text-sm text-muted-foreground">
                            หน้า {currentPage} จาก {totalPages} ({totalItems} รายการ)
                        </div>
                        <div className="flex space-x-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={goToPreviousPage} 
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={goToNextPage} 
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}