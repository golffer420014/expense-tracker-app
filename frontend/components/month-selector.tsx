"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useTransactions } from "@/lib/context/transactions-context";

export function MonthSelector() {
  const { getUserMonthlySummary, getTransactions , isLoading  } = useTransactions();
  const [currentDate, setCurrentDate] = useState(new Date())

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("th-TH", { month: "long", year: "numeric" })
  }

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const isCurrentMonth = () => {
    const now = new Date()
    return currentDate.getMonth() === now.getMonth() && currentDate.getFullYear() === now.getFullYear()
  }

  useEffect(() => {
    getUserMonthlySummary(currentDate.getMonth() + 1, currentDate.getFullYear())
    getTransactions(JSON.stringify({
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear()
    }))
  }, [currentDate])

  if (isLoading) {
    return <div className="flex items-center justify-center mb-4">
      <Loader2 className="w-28 h-[40px] animate-spin text-primary" />
    </div>
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <h2 className="text-lg font-medium">{formatMonth(currentDate)}</h2>

      <Button variant="outline" size="icon" onClick={goToNextMonth} disabled={isCurrentMonth()}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}