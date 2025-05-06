import { Suspense } from "react"
import { BottomNavbar } from "@/components/bottom-navbar"
import { Budgets } from "@/components/budgets"
import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-68px)] bg-gray-50 dark:bg-gray-900">
      <main className="flex-1 container max-w-md mx-auto p-4 pb-24">
        <h1 className="text-2xl font-bold mb-6">งบประมาณ</h1>

        <Suspense fallback={<Skeleton className="h-80 w-full" />}>
          <Budgets />
        </Suspense>

      </main>

      <BottomNavbar />
    </div>
  )
}