"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, MoreVertical, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useTransactions } from "@/lib/context/transactions-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { TransactionForm } from "@/components/transaction-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog"
import { formatAmount } from "@/lib/utils"
import { getCategoryIcon, getCategoryColor } from "@/lib/category-utils"



type Transaction = {
    id: number
    description: string
    amount: number
    category: string
    date: Date
    isIncome: boolean
}

// Define properly typed formData interface
interface TransactionFormData {
    type: "expense" | "income";
    amount: string;
    category: string;
    description?: string;
    note?: string;
    date: Date;
}

export function TransactionsList() {
    const { isLoading, transactions, filteredTransactions, getTransactions, showMoney, deleteTransaction } = useTransactions();
    const [model, setModel] = useState<Transaction[]>()
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8
    const [editingTransactionId, setEditingTransactionId] = useState<number | undefined>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState<TransactionFormData | undefined>(undefined)

    // Add state for delete confirmation
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [deletingTransactionId, setDeletingTransactionId] = useState<number | undefined>(undefined)

    useEffect(() => {
        setInitialModel()
    }, [transactions])

    useEffect(() => {
        getTransactions('')
    }, [])

    // Set form data when editing transaction is selected
    useEffect(() => {
        if (editingTransactionId) {
            const transaction = transactions.find(t => t.id === editingTransactionId);
            if (transaction) {
                setFormData({
                    type: transaction.type,
                    amount: transaction.amount.toString(),
                    category: transaction.category_id?.toString() || "",
                    description: transaction.description || "",
                    note: transaction.note || "",
                    date: new Date(transaction.date),
                });
            }
        } else {
            setFormData(undefined);
        }
    }, [editingTransactionId, transactions]);

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
        setEditingTransactionId(id)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        // Open confirmation dialog instead of deleting directly
        setDeletingTransactionId(id)
        setIsDeleteDialogOpen(true)
    }

    // Create function to handle actual deletion after confirmation
    const confirmDelete = async () => {
        if (deletingTransactionId) {
            try {
                await deleteTransaction(deletingTransactionId)
                setModel(model?.filter((t) => t.id !== deletingTransactionId))
            } catch (error) {
                console.error("Error deleting transaction:", error)
            } finally {
                closeDeleteDialog()
            }
        }
    }

    // Function to close delete dialog
    const closeDeleteDialog = () => {
        setIsDeleteDialogOpen(false)
        setDeletingTransactionId(undefined)
    }

    const handleDialogClose = () => {
        setIsDialogOpen(false)
        setEditingTransactionId(undefined)
        setFormData(undefined)
        // Refresh transactions after editing
        getTransactions('')
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
                            <div key={index} className="flex items-center p-3 hover:bg-muted/50">
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
                                        {formatAmount(transaction.amount, showMoney)}
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
                        <Card className="!pt-6">
                            <CardContent className="!p-0 !py-0">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="rounded-full bg-muted p-4 mb-4">
                                        <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-medium">ไม่มีรายการ</h3>
                                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                                        {searchTerm ? "ไม่พบรายการที่คุณกำลังค้นหา" : "เริ่มต้นบันทึกรายการแรกของคุณ"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
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

            <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleDialogClose()}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingTransactionId ? "แก้ไขรายการ" : "เพิ่มรายการใหม่"}</DialogTitle>
                    </DialogHeader>
                    <TransactionForm
                        onSuccess={handleDialogClose}
                        initialData={formData}
                        isEditId={editingTransactionId}
                    />
                </DialogContent>
            </Dialog>

            {/* Add delete confirmation dialog */}
            <ConfirmDeleteDialog
                isOpen={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                onConfirm={confirmDelete}
                title="ยืนยันการลบรายการ"
                description="คุณต้องการลบรายการนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
            />
        </div>
    )
}