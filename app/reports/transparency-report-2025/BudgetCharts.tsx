'use client'

import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts'

interface BudgetItem {
  name: string
  amount: number
}

interface BudgetChartsProps {
  items: BudgetItem[]
}

// Amber color palette from tailwind config
const COLORS = [
  '#966316', // amber-700
  '#BA7F19', // amber-600
  '#D49B3F', // amber-500
  '#DDA952',
  '#E7B865', // amber-400
  '#EDBC76',
  '#F3CC88', // amber-300
]

const formatCurrency = (value: number) => `$${value.toLocaleString()}`

// Add fill colors directly to data (recommended migration from deprecated Cell)
const addColorsToData = (data: BudgetItem[]) =>
  data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }))

export default function BudgetCharts({ items }: BudgetChartsProps) {
  const dataWithColors = addColorsToData(items)
  const total = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-start">
      <div className="relative w-full md:w-1/2">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataWithColors}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="100%"
              innerRadius="40%"
              stroke="none"
              isAnimationActive={true}
              animationBegin={0}
              animationDuration={500}
              animationEasing="ease-out"
            />
            <Tooltip
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              itemStyle={{
                color: '#f5f5f0',
                fontWeight: 600,
              }}
              separator=": "
              isAnimationActive={true}
              animationDuration={500}
              animationEasing="ease-out"
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Total in center of donut */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
          <span className="text-base font-bold text-anthracite dark:text-ecru">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
      <div className="w-full space-y-2 md:w-1/2">
        {items.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-sm"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span>{item.name}</span>
            </div>
            <span className="font-semibold">{formatCurrency(item.amount)}</span>
          </div>
        ))}
        <div className="flex items-center justify-between border-t border-anthracite-300 pt-2 font-bold dark:border-ecru-300">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  )
}
