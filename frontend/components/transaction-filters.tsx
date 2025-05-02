"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useCategories } from "@/lib/context/categories-context"



export function TransactionFilters(
) {
  const { categories } = useCategories()
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [category, setCategory] = useState<string>("all")
  const [type, setType] = useState<string>("")


  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      {/* {model.map((transaction: Transaction) => (
        <div key={transaction.id}>
          {transaction.date}
        </div>
      ))} */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <CalendarIcon className=" h-4 w-4" />
            {date ? format(date, "dd/MM/yyyy") : "วันที่"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        </PopoverContent>
      </Popover>

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-[110px] h-8">
          <SelectValue placeholder="หมวดหมู่" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทั้งหมด</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[110px] h-8">
          <SelectValue placeholder="ประเภท" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทั้งหมด</SelectItem>
          <SelectItem value="expense">รายจ่าย</SelectItem>
          <SelectItem value="income">รายรับ</SelectItem>
        </SelectContent>
      </Select>

      {(date || category || type) && (
        <Button variant="ghost" size="sm" className="h-8 px-2">
          รีเซ็ต
        </Button>
      )}
    </div>
  )
}