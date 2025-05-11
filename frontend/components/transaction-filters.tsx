"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useCategories } from "@/lib/context/categories-context"
import { useTransactions } from "@/lib/context/transactions-context"



export function TransactionFilters(
) {
  const { filteredTransactions, setFilteredTransactions } = useTransactions()
  const { categories } = useCategories()

  const categoriesFiltered = categories.filter((cat) => {
    if (filteredTransactions.type === "all") {
      return true
    }
    return cat.type === filteredTransactions.type
  })

  const handleReset = () => {
    setFilteredTransactions({
      date: undefined,
      category: 'all',
      type: 'all'
    })
  }


  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      {/* {model.map((transaction: Transaction) => (
        <div key={transaction.id}>
          {transaction.date}
        </div>
      ))} */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="lg" className="h-9">
            <CalendarIcon className=" h-4 w-4" />
            {filteredTransactions.date ? format(filteredTransactions.date, "dd/MM/yyyy") : "วันที่"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={filteredTransactions.date} onSelect={(date) => setFilteredTransactions({ ...filteredTransactions, date })} initialFocus />
        </PopoverContent>
      </Popover>

      <Select value={filteredTransactions.category} onValueChange={(value) => setFilteredTransactions({ ...filteredTransactions, category: value })}>
        <SelectTrigger className="w-[130px] h-8">
          <SelectValue placeholder="หมวดหมู่" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทั้งหมด</SelectItem>
          {categoriesFiltered.map((cat) => (
            <SelectItem key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filteredTransactions.type} onValueChange={(value) => setFilteredTransactions({ ...filteredTransactions, type: value })}>
        <SelectTrigger className="w-[130px] h-8">
          <SelectValue placeholder="ประเภท" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ทั้งหมด</SelectItem>
          <SelectItem value="expense">รายจ่าย</SelectItem>
          <SelectItem value="income">รายรับ</SelectItem>
        </SelectContent>
      </Select>

      {(filteredTransactions.date || filteredTransactions.category || filteredTransactions.type) && (
        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={handleReset}>
          รีเซ็ต
        </Button>
      )}
    </div>
  )
}