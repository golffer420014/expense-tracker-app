"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, X, Check, Trash2, List } from "lucide-react"
import { showToast } from "@/lib/toast"
import { useSwipeable } from "react-swipeable"

type BudgetItem = {
    id: string
    name: string
    budget: number
    isEditing: boolean
}

// Swipeable Budget Item Component
function SwipeableBudgetItem({
    item,
    isActive,
    onEdit,
    onDelete,
    onUpdate,
    onCancel,
    onSwipe
}: {
    item: BudgetItem,
    isActive: boolean,
    onEdit: (id: string) => void,
    onDelete: (id: string) => void,
    onUpdate: (id: string, budget: number) => void,
    onCancel: (id: string) => void,
    onSwipe: (id: string) => void
}) {
    const swipeHandlers = useSwipeable({
        onSwipedRight: () => onSwipe(item.id),
        onSwipedLeft: () => onSwipe(""),
        trackMouse: true
    });

    return (
        <div className="relative overflow-hidden">
            <div
                {...swipeHandlers}
                className={`flex items-center justify-between p-4 transition-transform duration-400 ${isActive ? 'transform translate-x-16' : ''
                    }`}
            >
                <div className="flex items-center gap-2">
                    <List className={`h-4 w-4 transition-opacity duration-400 ${!isActive ? 'opacity-100' : 'opacity-0'}`} />
                    <span className={`font-medium transition-transform duration-400 ${isActive && '-translate-x-8'}`}>{item.name}</span>
                </div>
                {item.isEditing ? (
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            defaultValue={item.budget}
                            className="w-24 h-8"
                            onChange={(e) => {
                                const newBudget = Number.parseInt(e.target.value)
                                if (!isNaN(newBudget) && newBudget >= 0) {
                                    onUpdate(item.id, newBudget)
                                }
                            }}
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onUpdate(item.id, item.budget)}>
                            <Check className="h-4 w-4 text-emerald-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onCancel(item.id)}>
                            <X className="h-4 w-4 text-red-500" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <span className={`transition-transform duration-400 ${isActive && '-translate-x-8'}`}>{item.budget.toLocaleString()} บาท</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item.id)}>
                            <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Delete button that appears when swiped */}
            <div
                className="absolute top-0 left-0 h-full flex items-center justify-center bg-red-500 text-white"
                style={{
                    width: '64px',
                    transform: isActive ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.2s ease-in-out'
                }}
            >
                <Button
                    variant="link"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-red-600"
                    onClick={() => onDelete(item.id)}
                >
                    <Trash2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}

export function Budgets() {
    const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
        { id: "food", name: "อาหาร", budget: 7000, isEditing: false },
        { id: "transport", name: "เดินทาง", budget: 4000, isEditing: false },
        { id: "shopping", name: "ช้อปปิ้ง", budget: 5000, isEditing: false },
        { id: "housing", name: "ที่พัก", budget: 12000, isEditing: false },
        { id: "health", name: "สุขภาพ", budget: 2000, isEditing: false },
        { id: "other", name: "อื่นๆ", budget: 3000, isEditing: false },
    ])

    const [month, setMonth] = useState((new Date().getMonth() + 1).toString())
    const [swipedItemId, setSwipedItemId] = useState<string | null>(null)
    const budgetsRef = useRef<HTMLDivElement>(null)

    const months = [
        { value: "1", label: "มกราคม" },
        { value: "2", label: "กุมภาพันธ์" },
        { value: "3", label: "มีนาคม" },
        { value: "4", label: "เมษายน" },
        { value: "5", label: "พฤษภาคม" },
        { value: "6", label: "มิถุนายน" },
        { value: "7", label: "กรกฎาคม" },
        { value: "8", label: "สิงหาคม" },
        { value: "9", label: "กันยายน" },
        { value: "10", label: "ตุลาคม" },
        { value: "11", label: "พฤศจิกายน" },
        { value: "12", label: "ธันวาคม" },
    ]

    const toggleEdit = (id: string) => {
        setBudgetItems(budgetItems.map((item) => (item.id === id ? { ...item, isEditing: !item.isEditing } : item)))
        // Close any active swipe when editing
        setSwipedItemId(null)
    }

    const updateBudget = (id: string, newBudget: number) => {
        setBudgetItems(
            budgetItems.map((item) => (item.id === id ? { ...item, budget: newBudget, isEditing: false } : item)),
        )
        showToast.success("งบประมาณถูกอัพเดทแล้ว")
    }

    const cancelEdit = (id: string) => {
        setBudgetItems(budgetItems.map((item) => (item.id === id ? { ...item, isEditing: false } : item)))
    }

    const deleteBudget = (id: string) => {
        setBudgetItems(budgetItems.filter((item) => item.id !== id))
        setSwipedItemId(null)
        showToast.success("ลบรายการงบประมาณสำเร็จแล้ว")
    }

    const handleSwipe = (id: string) => {
        setSwipedItemId(id === swipedItemId ? null : id)
    }

    const totalBudget = budgetItems.reduce((sum, item) => sum + item.budget, 0)

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


            <Card className="!py-0 rounded-md">
                <CardContent className="p-0">
                    <div className="divide-y">
                        {budgetItems.map((item) => (
                            <div id={`budget-item-${item.id}`} key={item.id}>
                                <SwipeableBudgetItem
                                    item={item}
                                    isActive={swipedItemId === item.id}
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
                            <span className="font-semibold">{totalBudget.toLocaleString()} บาท</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}