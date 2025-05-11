// import React, { Suspense } from 'react'
import { BottomNavbar } from '@/components/bottom-navbar'
import BarHorizon from '@/components/year-summary'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Suspense } from 'react'

const page = () => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-68px)] bg-gray-50 dark:bg-slate-900">
      <main className="flex-1 container max-w-md mx-auto p-4 pb-24">
        <h1 className="text-2xl font-bold mb-6">รายงาน</h1>

        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 gap-2 mb-6">
            <TabsTrigger value="monthly">รายเดือน</TabsTrigger>
            <TabsTrigger value="category">หมวดหมู่</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            <Suspense fallback={<Skeleton className="h-80 w-full" />}>
              <BarHorizon />
            </Suspense>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNavbar />
    </div>
  )
}

export default page