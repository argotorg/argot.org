import ReportLayout from '@/layouts/ReportLayout'
import { genPageMetadata } from 'app/seo'
import reportData from '@/data/reports/transparency-report-2024.json'

export const metadata = genPageMetadata({
  title: reportData.title,
  description: reportData.summary,
})

function PieChart({ data }: { data: Array<{ name: string; percentage: number; amount: number }> }) {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899']
  let cumulativePercentage = 0

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative h-64 w-64">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90 transform">
          {data.map((item, index) => {
            const percentage = item.percentage
            const offset = cumulativePercentage
            cumulativePercentage += percentage

            const startAngle = (offset / 100) * 360
            const endAngle = (cumulativePercentage / 100) * 360
            const largeArcFlag = percentage > 50 ? 1 : 0

            const startX = 50 + 50 * Math.cos((startAngle * Math.PI) / 180)
            const startY = 50 + 50 * Math.sin((startAngle * Math.PI) / 180)
            const endX = 50 + 50 * Math.cos((endAngle * Math.PI) / 180)
            const endY = 50 + 50 * Math.sin((endAngle * Math.PI) / 180)

            return (
              <path
                key={index}
                d={`M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                fill={colors[index % colors.length]}
                className="transition-opacity hover:opacity-80"
              />
            )
          })}
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {item.name}: ${item.amount.toLocaleString()} ({item.percentage.toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BarChart({ data }: { data: Array<{ name: string; allocation: number }> }) {
  const maxAllocation = Math.max(...data.map((item) => item.allocation))

  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
            <span className="text-gray-500 dark:text-gray-400">{item.allocation}%</span>
          </div>
          <div className="h-8 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${(item.allocation / maxAllocation) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TransparencyReport2024() {
  return (
    <ReportLayout title={reportData.title} date={reportData.date}>
      <div className="space-y-12">
        <section>
          <p className="text-lg text-gray-700 dark:text-gray-300">{reportData.summary}</p>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Admin updates
          </h2>
          <div className="space-y-6">
            {reportData.sections.adminUpdates.map((update, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-6 dark:border-gray-700"
              >
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {update.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{update.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Financial Overview
          </h2>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Budget</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                ${reportData.sections.financialData.totalBudget.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">Spent</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${reportData.sections.financialData.spent.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">Remaining</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${reportData.sections.financialData.remaining.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Spending by Category
            </h3>
            <PieChart data={reportData.sections.financialData.categories} />
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Project Allocation
          </h2>
          <BarChart data={reportData.sections.projectBreakdown} />
        </section>
      </div>
    </ReportLayout>
  )
}
