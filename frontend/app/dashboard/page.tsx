import React, { Suspense } from 'react'
import { BottomNavbar } from '@/components/bottom-navbar'
import { RecentTransactions } from '@/components/recent-transitions'
import { Skeleton } from '@/components/ui/skeleton'
import { CategoryBreakdown } from '@/components/category-breakdown'
import { MonthSummary } from '@/components/month-summary'
import { MonthSelector } from '@/components/month-selector'
const page = () => {
  return (
    <div className="flex flex-col min-h-[90vh] bg-gray-50 dark:bg-slate-900">
      <main className="flex-1 container max-w-md mx-auto p-4 pb-24">
        <h1 className="text-2xl font-bold mb-6">รายรับรายจ่าย</h1>

        <MonthSelector />

        <Suspense fallback={<Skeleton className="h-32 w-full mb-6" />}>
          <MonthSummary />
        </Suspense>

        <div className="mt-6">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <RecentTransactions />
          </Suspense>
        </div>

        <div className="mt-6">
          <Suspense fallback={<Skeleton className="h-64 w-full" />}>
            <CategoryBreakdown />
          </Suspense>
        </div>
      </main>

      <BottomNavbar />
    </div>
  )
}

export default page