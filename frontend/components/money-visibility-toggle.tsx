"use client"

import { Eye, EyeOff } from "lucide-react"
import { useTransactions } from "@/lib/context/transactions-context"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/auth-context"

export function MoneyVisibilityToggle() {
  const { showMoney, toggleShowMoney } = useTransactions()
  const { isAuthenticated } = useAuth()
  return (
    isAuthenticated &&
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleShowMoney}
      title={showMoney ? "ซ่อนจำนวนเงิน" : "แสดงจำนวนเงิน"}
      className="text-muted-foreground hover:text-foreground"
    >
      {showMoney ? (
        <Eye className="h-4 w-4" />
      ) : (
        <EyeOff className="h-4 w-4" />
      )}
    </Button>

  )
} 