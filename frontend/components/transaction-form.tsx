"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { useTransactions } from "@/lib/context/transactions-context"
import axios from "axios"
import { toast } from "sonner"

const formSchema = z.object({
  type: z.enum(["expense", "income"]),
  amount: z.string().min(1, "กรุณาระบุจำนวนเงิน"),
  category: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  description: z.string().optional(),
  note: z.string().optional(),
  date: z.date({
    required_error: "กรุณาเลือกวันที่",
  }),
})

interface categories {
  id: number;
  category_id: number;
  name: string;
  type: string;
  note: string;
  description: string;
  date: Date;
}

type TransactionFormProps = {
  onSuccess: () => void
  initialData?: z.infer<typeof formSchema>
}

export function TransactionForm({ onSuccess, initialData }: TransactionFormProps) {
  const { createTransaction } = useTransactions();
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [expenseCategories, setExpenseCategories] = useState<categories[]>([])
  const [incomeCategories, setIncomeCategories] = useState<categories[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/get-all`)
      setExpenseCategories(categories.data.filter((category: categories) => category.type === "expense"))
      setIncomeCategories(categories.data.filter((category: categories) => category.type === "income"))


    };

    fetchCategories();
  }, []);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      type: "expense",
      amount: "",
      category: "",
      description: "",
      date: new Date(),
    },
  })


  const transactionType = form.watch("type")



  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    try {
      await createTransaction({
        type: values.type,
        amount: parseFloat(values.amount),
        category_id: parseInt(values.category),
        description: values.description,
        note: values.note,
        date: values.date,
        is_recurring: false,
      })
      toast.success("บันทึกรายการสำเร็จ")
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSuccess()
    } catch (error) {
      console.error("Error saving transaction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>ประเภทรายการ</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-1">
                  <div className="flex items-center space-x-1 flex-1">
                    <RadioGroupItem value="expense" id="expense" className="sr-only" />
                    <label
                      htmlFor="expense"
                      className={cn(
                        "flex-1 rounded-md border border-muted px-3 py-2 text-center text-sm cursor-pointer",
                        field.value === "expense"
                          ? "bg-red-100 border-red-300 dark:bg-red-900 dark:border-red-700"
                          : "",
                      )}
                    >
                      รายจ่าย
                    </label>
                  </div>

                  <div className="flex items-center space-x-1 flex-1">
                    <RadioGroupItem value="income" id="income" className="sr-only" />
                    <label
                      htmlFor="income"
                      className={cn(
                        "flex-1 rounded-md border border-muted px-3 py-2 text-center text-sm cursor-pointer",
                        field.value === "income"
                          ? "bg-green-100 border-green-300 dark:bg-green-900 dark:border-green-700"
                          : "",
                      )}
                    >
                      รายรับ
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
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
                <Input placeholder="0.00" {...field} type="number" step="0.01" min="0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>หมวดหมู่</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(transactionType === "expense" ? expenseCategories : incomeCategories).map((category) => (
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>คำอธิบาย</FormLabel>
              <FormControl>
                <Textarea placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>วันที่</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "dd/MM/yyyy") : <span>เลือกวันที่</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button" onClick={onSuccess}>
            ยกเลิก
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
