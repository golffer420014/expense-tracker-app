"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ListPlus, PieChart, Plus, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TransactionForm } from "@/components/transaction-form"
import { cn } from "@/lib/utils"
// import { useTheme } from "next-themes"

export function BottomNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
//   const { theme } = useTheme()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const routes = [
    {
      name: "แดชบอร์ด",
      path: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "รายการ",
      path: "/transactions",
      icon: <ListPlus className="h-5 w-5" />,
    },
    {
      name: "รายงาน",
      path: "/reports",
      icon: <PieChart className="h-5 w-5" />,
    },
    {
      name: "งบประมาณ",
      path: "/budget",
      icon: <DollarSign className="h-5 w-5" />,
    },
  ]

  if (!mounted) return null

//   const isDarkTheme = theme === "dark"

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="container max-w-md mx-auto px-4">
          <div className="relative">
            {/* Floating Add Button */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
              <Button
                onClick={() => setOpen(true)}
                size="icon"
                className="h-16 w-16 rounded-full shadow-lg bg-gradient-to-br from-primary to-primary/80 hover:from-primary hover:to-primary/90 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Plus className="h-8 w-8 text-white" />
              </Button>
            </div>

            {/* Navigation Bar */}
            <div className="bg-background/80 backdrop-blur-lg rounded-t-2xl border border-border shadow-lg">
              <div className="flex justify-between items-center h-20 px-6">
                {routes.map((route) => {
                  const isActive = pathname === route.path
                  return (
                    <Link
                      key={route.path}
                      href={route.path}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1 w-16",
                        "transition-all duration-300",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-full transition-all duration-300",
                        isActive ? "bg-primary/10" : "hover:bg-primary/5"
                      )}>
                        {route.icon}
                      </div>
                      <span className={cn(
                        "text-xs font-medium transition-all duration-300",
                        isActive ? "scale-110" : "scale-100"
                      )}>
                        {route.name}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>เพิ่มรายการใหม่</DialogTitle>
          </DialogHeader>
          <TransactionForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
