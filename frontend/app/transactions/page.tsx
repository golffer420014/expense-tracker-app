'use client'
import React, { Suspense, useEffect } from 'react'
import { BottomNavbar } from '@/components/bottom-navbar'
import { Skeleton } from '@/components/ui/skeleton'
import { TransactionsList } from '@/components/transactions-list'
import { useTransactions } from '@/lib/context/transactions-context'

const Page = () => {
  const { getTransactions } = useTransactions()

  useEffect(() => {
    getTransactions('')
  }, [])
  return (
    <div className="flex flex-col min-h-[90vh] bg-gray-50 dark:bg-slate-900">
      <main className="flex-1 container max-w-md mx-auto p-4 pb-24">
        <h1 className="text-2xl font-bold mb-6">รายรับรายจ่าย</h1>


        <Suspense fallback={<Skeleton className="h-96 w-full mt-4" />}>
          <TransactionsList />
        </Suspense>
      </main>

      <BottomNavbar />
    </div>
  )
}

export default Page