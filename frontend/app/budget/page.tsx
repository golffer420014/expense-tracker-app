import React, { Suspense } from 'react'
import { BottomNavbar } from '@/components/bottom-navbar'
const page = () => {
  return (
    <div className="flex flex-col min-h-[90vh] bg-gray-50 dark:bg-slate-900">
      <main className="flex-1 container max-w-md mx-auto p-4 pb-24">
        <h1 className="text-2xl font-bold mb-6">ตั้งค่างบประมาณ</h1>


      </main>

      <BottomNavbar />
    </div>
  )
}

export default page