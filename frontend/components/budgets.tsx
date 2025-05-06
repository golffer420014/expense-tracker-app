"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SwipeBudget from "./swipe-budget"
import { useBudgets } from "@/lib/context/budgets-context"
import { useTransactions } from "@/lib/context/transactions-context"
import { formatAmount } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useCategories } from "@/lib/context/categories-context"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import iBudget from '@/interface/i-budget'
import { ConfirmDeleteDialog } from "./confirm-delete-dialog"

// ข้อมูลสำหรับ dropdown เดือน
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

// ข้อมูลสำหรับ dropdown ปี (ปีปัจจุบัน -1 ถึง ปีปัจจุบัน +2)
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 4 }, (_, i) => {
    const y = currentYear - 1 + i;
    return { value: y.toString(), label: y.toString() };
});

// Schema สำหรับตรวจสอบความถูกต้องของฟอร์มเพิ่มงบประมาณ
const formSchema = z.object({
    category_id: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
    amount: z.string().min(1, "กรุณาระบุจำนวนเงิน")
});

// ประเภทข้อมูลหมวดหมู่
interface Category {
    id: number;
    name: string;
    type: string;
}

export function Budgets() {
    // ===== CONTEXT & STATE =====
    // Context hooks
    const { 
        budgets, 
        isLoading, 
        setBudgets, 
        getBudgets, 
        updateBudget: apiUpdateBudget, 
        deleteBudget: apiDeleteBudget, 
        createBudget: apiCreateBudget 
    } = useBudgets();
    const { categories } = useCategories();
    const { showMoney } = useTransactions();
    
    // การเลือกเดือนและปี
    const [year, setYear] = useState(currentYear.toString());
    const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
    
    // สถานะการ swipe
    const [swipedItemId, setSwipedItemId] = useState<string | null>(null);
    const budgetsRef = useRef<HTMLDivElement>(null);
    
    // สถานะสำหรับ dialog เพิ่มงบประมาณ
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expenseCategories, setExpenseCategories] = useState<Category[]>([]);
    
    // สถานะสำหรับ dialog ยืนยันการลบ
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);

    // ===== FORM HANDLING =====
    // สร้าง form สำหรับเพิ่มงบประมาณ
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category_id: "",
            amount: "",
        },
    });

    // ===== EFFECTS =====
    // โหลดข้อมูลงบประมาณเมื่อเดือนหรือปีเปลี่ยน
    useEffect(() => {
        getBudgets(`year=${year}&month=${month}`);
    }, [year, month]);

    // กรองเฉพาะหมวดหมู่ประเภทรายจ่าย
    useEffect(() => {
        if (categories.length > 0) {
            setExpenseCategories(categories.filter(category => category.type === "expense"));
        }
    }, [categories]);

    // จัดการคลิกนอก swipe item เพื่อปิด
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (swipedItemId && budgetsRef.current) {
                // Check if click is outside the swiped item
                const target = event.target as Node;
                const activeItem = document.getElementById(`budget-item-${swipedItemId}`);

                if (activeItem && !activeItem.contains(target)) {
                    setSwipedItemId(null);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [swipedItemId]);

    // ===== EVENT HANDLERS =====
    // การ submit form เพิ่มงบประมาณ
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const selectedCategory = categories.find(cat => cat.id.toString() === values.category_id);

            if (!selectedCategory) {
                throw new Error("หมวดหมู่ไม่ถูกต้อง");
            }

            const newBudget = {
                category_id: parseInt(values.category_id),
                name: selectedCategory.name,
                type: "expense",
                month: `${year}-${month}`,
                amount: values.amount,
                isEditing: false
            } as iBudget;

            await apiCreateBudget(newBudget);
            getBudgets(`year=${year}&month=${month}`);
            
            // ปิด dialog และรีเซ็ตฟอร์ม
            setIsAddDialogOpen(false);
            form.reset();
        } catch (error) {
            console.error("Error creating budget:", error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // ===== BUDGET ITEM OPERATIONS =====
    // เปิด/ปิดโหมดแก้ไข
    const toggleEdit = (id: string) => {
        setBudgets(budgets.map((item) => (item.id === id ? { ...item, isEditing: !item.isEditing } : item)));
        setSwipedItemId(null);
    };

    // อัพเดตงบประมาณ
    const updateBudget = async (id: string, newBudget: number) => {
        setBudgets(
            budgets.map((item) => (item.id === id ? { ...item, amount: newBudget.toString(), isEditing: false } : item)),
        );

        await apiUpdateBudget(id, newBudget.toString());
    };

    // กำลังแก้ไขงบประมาณ (input change)
    const handleChange = (id: string, newBudget: number) => {
        setBudgets(
            budgets.map((item) => (item.id === id ? { ...item, amount: newBudget.toString() } : item)),
        );
    };

    // ยกเลิกการแก้ไข
    const cancelEdit = (id: string) => {
        setBudgets(budgets.map((item) => (item.id === id ? { ...item, isEditing: false } : item)));
    };

    // ลบงบประมาณ
    const deleteBudget = async (id: string) => {
        console.log(id);
        setBudgets(budgets.filter((item) => item.id !== id));
        setSwipedItemId(null);

        await apiDeleteBudget(id);
    };

    // จัดการ swipe
    const handleSwipe = (id: string) => {
        // ตรวจสอบว่าถ้า ID ที่ได้รับเป็น string ว่าง (จากการ swipe ซ้าย) ให้ตั้งค่าเป็น null
        if (id === "") {
            setSwipedItemId(null);
            return;
        }
        // ถ้า swipe ขวา ตรวจสอบว่าเป็น ID เดิมหรือไม่
        setSwipedItemId(id === swipedItemId ? null : id);
    };

    // คำนวณยอดรวมงบประมาณ
    const totalBudget = budgets.reduce((sum, item) => sum + Number(item.amount), 0);

    // ===== RENDER =====
    return (
        <div className="space-y-4" ref={budgetsRef}>
            {/* ส่วนหัว: ชื่อหน้า และตัวเลือกเดือน/ปี */}
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

            {/* ปุ่มเพิ่มงบประมาณ */}
            <div className="">
                <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="w-full"
                    variant="outline"
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    เพิ่มงบประมาณ
                </Button>
            </div>

            {/* แสดงรายการงบประมาณ */}
            <Card className="!py-0 rounded-md">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-4 text-center">กำลังโหลดข้อมูล...</div>
                    ) : (
                        <div className="divide-y">
                            {budgets.length === 0 ? (
                                <div className="p-4 text-center">ไม่พบข้อมูลงบประมาณ</div>
                            ) : (
                                budgets.map((item) => (
                                    <div id={`budget-item-${item.id}`} key={item.id}>
                                        <SwipeBudget
                                            item={item}
                                            isActive={swipedItemId === item.id}
                                            showMoney={showMoney}
                                            onChange={handleChange}
                                            onEdit={toggleEdit}
                                            onDelete={() => {
                                                setItemToDeleteId(item.id);
                                                setIsDeleteDialogOpen(true);
                                            }}
                                            onUpdate={updateBudget}
                                            onCancel={cancelEdit}
                                            onSwipe={handleSwipe}
                                        />
                                    </div>
                                ))
                            )}

                            {/* แสดงยอดรวมงบประมาณ */}
                            <div className="flex items-center justify-between p-4 bg-muted/50">
                                <span className="font-semibold">รวมทั้งหมด</span>
                                <span className="font-semibold">{formatAmount(totalBudget, showMoney)}</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            
            {/* กล่องยืนยันการลบ */}
            <ConfirmDeleteDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={() => {
                    if (itemToDeleteId) {
                        deleteBudget(itemToDeleteId);
                    }
                    setIsDeleteDialogOpen(false);
                }}
                title="ยืนยันการลบรายการ"
                description="คุณต้องการลบรายการนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้"
            />

            {/* กล่องเพิ่มงบประมาณ */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>เพิ่มงบประมาณ</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="category_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>หมวดหมู่</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            >
                                            <FormControl
                                            className="w-full"
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="เลือกหมวดหมู่" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {expenseCategories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>จำนวนเงิน</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAddDialogOpen(false)}
                                    type="button"
                                >
                                    ยกเลิก
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "กำลังบันทึก..." : "เพิ่ม"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}