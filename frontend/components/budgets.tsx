"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SwipeBudget from "./swipe-budget"
import { useBudgets } from "@/lib/context/budgets-context"
import { useTransactions } from "@/lib/context/transactions-context"
import { formatAmount } from "@/lib/utils"

const months = [
    { value: "01", label: "มกราคม" },
    { value: "02", label: "กุมภาพันธ์" },
    { value: "03", label: "มีนาคม" },
    { value: "04", label: "เมษายน" },
    { value: "05", label: "พฤษภาคม" },
    { value: "06", label: "มิถุนายน" },
    { value: "07", label: "กรกฎาคม" },
    { value: "08", label: "สิงหาคม" },
    { value: "09", label: "กันยายน" },
    { value: "10", label: "ตุลาคม" },
    { value: "11", label: "พฤศจิกายน" },
    { value: "12", label: "ธันวาคม" },
]
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 4 }, (_, i) => {
    const y = currentYear - 1 + i;
    return { value: y.toString(), label: y.toString() };
});

export function Budgets() {
    const { budgets, isLoading, setBudgets, getBudgets, updateBudget: apiUpdateBudget, deleteBudget: apiDeleteBudget } = useBudgets();
    const { showMoney } = useTransactions();
    const [year, setYear] = useState(currentYear.toString());
    const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'))
    const [swipedItemId, setSwipedItemId] = useState<string | null>(null)
    const budgetsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        getBudgets(`year=${year}&month=${month}`);
    }, [year, month]);

    const toggleEdit = (id: string) => {
        setBudgets(budgets.map((item) => (item.id === id ? { ...item, isEditing: !item.isEditing } : item)))
        // Close any active swipe when editing
        setSwipedItemId(null)
    }

    const updateBudget = async (id: string, newBudget: number) => {
        // ยกเลิกการแก้ไขก่อน เพื่อให้ UI ตอบสนองทันที
        setBudgets(
            budgets.map((item) => (item.id === id ? { ...item, amount: newBudget.toString(), isEditing: false } : item)),
        )

        // เรียกใช้ API เพื่ออัพเดทข้อมูล
        await apiUpdateBudget(id, newBudget.toString());
    }

    const handleChange = (id: string, newBudget: number) => {
        setBudgets(
            budgets.map((item) => (item.id === id ? { ...item, amount: newBudget.toString() } : item)),
        )
    }

    const cancelEdit = (id: string) => {
        setBudgets(budgets.map((item) => (item.id === id ? { ...item, isEditing: false } : item)))
    }

    const deleteBudget = async (id: string) => {
        // อัพเดท UI ทันทีเพื่อให้ตอบสนองเร็ว
        setBudgets(budgets.filter((item) => item.id !== id))
        setSwipedItemId(null)

        // เรียกใช้ API เพื่อลบข้อมูล
        await apiDeleteBudget(id);
    }

    const handleSwipe = (id: string) => {
        // ตรวจสอบว่าถ้า ID ที่ได้รับเป็น string ว่าง (จากการ swipe ซ้าย) ให้ตั้งค่าเป็น null
        if (id === "") {
            setSwipedItemId(null)
            return
        }
        // ถ้า swipe ขวา ตรวจสอบว่าเป็น ID เดิมหรือไม่
        setSwipedItemId(id === swipedItemId ? null : id)
    }

    const totalBudget = budgets.reduce((sum, item) => sum + Number(item.amount), 0)

    // Handle clicking outside swipe items to close active swipe
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (swipedItemId && budgetsRef.current) {
                // Check if click is outside the swiped item
                const target = event.target as Node
                const activeItem = document.getElementById(`budget-item-${swipedItemId}`)

                if (activeItem && !activeItem.contains(target)) {
                    setSwipedItemId(null)
                }
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [swipedItemId])

    return (
        <div className="space-y-4" ref={budgetsRef}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">ตั้งค่างบประมาณ</h2>
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
            </div>

            <Card className="!py-0 rounded-md">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-4 text-center">กำลังโหลดข้อมูล...</div>
                    ) : budgets.length === 0 ? (
                        <div className="p-4 text-center">ไม่พบข้อมูลงบประมาณ</div>
                    ) : (
                        <div className="divide-y">
                            {budgets.map((item) => (
                                <div id={`budget-item-${item.id}`} key={item.id}>
                                    <SwipeBudget
                                        item={item}
                                        isActive={swipedItemId === item.id}
                                        showMoney={showMoney}
                                        onChange={handleChange}
                                        onEdit={toggleEdit}
                                        onDelete={deleteBudget}
                                        onUpdate={updateBudget}
                                        onCancel={cancelEdit}
                                        onSwipe={handleSwipe}
                                    />
                                </div>
                            ))}
                            <div className="flex items-center justify-between p-4 bg-muted/50">
                                <span className="font-semibold">รวมทั้งหมด</span>
                                <span className="font-semibold">{formatAmount(totalBudget, showMoney)}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}