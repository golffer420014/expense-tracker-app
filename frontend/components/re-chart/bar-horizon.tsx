import iReportYearly from '@/interface/i-report-yearly';
import { useTransactions } from '@/lib/context/transactions-context';
import { formatAmount } from '@/lib/utils';
import React from 'react'
import { BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { Bar } from 'recharts';

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number, name: string }[];
  label?: string;
}) => {
  const { showMoney } = useTransactions();

  if (active && payload && payload.length) {
    return (
      <div className="bg-background text-foreground p-2 rounded-md shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((item: { value: number, name: string }, index: number) => (
          <p key={index} className="text-sm">
            {item.name} : <span className={`${item.name === 'รายรับ' ? 'text-green-500' : 'text-red-500'}`}>{formatAmount(item.value, showMoney)}</span>
          </p>
        ))}
      </div>
    );
  }

  return null;
};


const BarHorizon = ({ yearlySummary }: { yearlySummary: iReportYearly[] }) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height={600}>
        <BarChart
          data={yearlySummary}
          layout="vertical"
          margin={{
            top: 0,
            right: 0,
            left: 50,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis dataKey="month" type="category" width={50} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="total_income" name="รายรับ" fill="#10b981" radius={[0, 4, 4, 0]} />
          <Bar dataKey="total_expense" name="รายจ่าย" fill="#ef4444" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarHorizon;