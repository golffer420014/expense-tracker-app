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

  // Split the routes into two parts for layout
  const firstHalf = routes.slice(0, 2)
  const secondHalf = routes.slice(2, 4)

  if (!mounted) return null

//   const isDarkTheme = theme === "dark"

  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-10 backdrop-blur-md",
          // isDarkTheme
          //   ? "bg-gray-900/90 border-t border-gray-800"
          //   : "bg-white/90 border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]",
        )}
      >
        <div className="container max-w-md mx-auto">
          <div className="flex justify-between items-center h-16 px-4">
            <div className="flex justify-around items-center flex-1">
              {firstHalf.map((route) => {
                const isActive = pathname === route.path
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    className="group relative flex flex-col items-center justify-center w-full h-full"
                  >
                    <div
                      className={cn(
                        "absolute -top-1 w-1 h-1 rounded-full transition-all duration-300",
                        isActive ? "bg-primary scale-100" : "scale-0",
                      )}
                    />
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center transition-all duration-200",
                        isActive ? "text-primary -translate-y-1" : "text-muted-foreground group-hover:text-primary/70",
                      )}
                    >
                      {route.icon}
                      <span className={cn("text-xs mt-1 transition-all", isActive ? "font-medium" : "font-normal")}>
                        {route.name}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Center Add Button */}
            <div className="flex-shrink-0 -mt-8 relative">
              <div
                className={cn(
                  "absolute inset-0 rounded-full blur-md -z-10 opacity-30",
                  // isDarkTheme ? "bg-primary" : "bg-primary",
                )}
              />
              <Button
                onClick={() => setOpen(true)}
                size="icon"
                className={cn(
                  "h-14 w-14 rounded-full shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95",
                  // isDarkTheme
                  //   ? "bg-gradient-to-br from-primary to-primary/80 hover:from-primary hover:to-primary/90"
                  "bg-gradient-to-br from-primary to-primary/80 hover:from-primary hover:to-primary/90",
                )}
              >
                <Plus className="h-6 w-6 text-white" />
              </Button>
            </div>

            <div className="flex justify-around items-center flex-1">
              {secondHalf.map((route) => {
                const isActive = pathname === route.path
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    className="group relative flex flex-col items-center justify-center w-full h-full"
                  >
                    <div
                      className={cn(
                        "absolute -top-1 w-1 h-1 rounded-full transition-all duration-300",
                        isActive ? "bg-primary scale-100" : "scale-0",
                      )}
                    />
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center transition-all duration-200",
                        isActive ? "text-primary -translate-y-1" : "text-muted-foreground group-hover:text-primary/70",
                      )}
                    >
                      {route.icon}
                      <span className={cn("text-xs mt-1 transition-all", isActive ? "font-medium" : "font-normal")}>
                        {route.name}
                      </span>
                    </div>
                  </Link>
                )
              })}
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
