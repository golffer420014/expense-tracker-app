'use client';

import { currentYear, years } from '@/lib/utils';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useReports } from '@/lib/context/reports-context';
import { ShoppingBag } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import BarHorizon from './re-chart/bar-horizon';





const YearlySummary = () => {
  const [year, setYear] = useState(currentYear.toString())
  const { yearlySummary, getYearlySummary, isLoading } = useReports();

  useEffect(() => {
    getYearlySummary(year);
  }, [year]);


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">สรุปรายเดือน</CardTitle>
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="ปี" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y.value} value={y.value}>
                {y.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1 overflow-hidden">
                    <Skeleton className="h-4 w-[300px]" />
                    <Skeleton className="h-3 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            yearlySummary.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">ไม่มีข้อมูล</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  ไม่พบข้อมูลของปีนี้
                </p>
              </div>
            ) : (
              <BarHorizon yearlySummary={yearlySummary} />
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default YearlySummary;
