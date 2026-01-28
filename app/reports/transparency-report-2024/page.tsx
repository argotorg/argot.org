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
            <span className="text-sm">
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
            <span className="font-medium">{item.name}</span>
            <span className="">{item.allocation}%</span>
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
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight">Introduction</h2>
          <div className="space-y-4 text-lg">
            <p>
              Financial and organizational transparency is a core value of the Argot Collective. We
              believe the Ethereum community should not be asked to place its trust in opaque,
              unaccountable, or self-interested institutions. Instead, public-goods stewardship must
              be grounded in openness, traceability, and clear responsibility.
            </p>
            <p>
              Argot is therefore committed to publishing detailed disclosures of our internal and
              external expenditures on a six-month basis. This document represents our first
              transparency report following the completion of our incorporation process in July
              2025. During this initial period, our primary expenses have been direct contributor
              payments supporting the continued development of Solidity, Sourcify, hevm, Fe,
              ethdebug and Act.
            </p>
            <p>
              This report is intended to provide the community with a clear and verifiable view into
              how resources entrusted to Argot are allocated and governed.
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight">Admin Updates</h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-xl font-semibold">Incorporation</h3>
              <p className="mb-3">
                Argot has completed its incorporation process. Corporate registry information is
                available for reference, reflecting the organization's legal structure and
                jurisdiction{' '}
                <a
                  href="https://www.zefix.ch/en/search/entity/list/firm/1674090"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                . All relevant employment contracts and supporting infrastructure have been
                transitioned from EF to Argot to ensure continuity of work, clear ownership, and
                aligned operational responsibility. In parallel, all applicable projects have been
                formally migrated from the Ethereum GitHub organization (
                <a
                  href="https://github.com/ethereum"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/ethereum
                </a>
                ) to the Argot organization (
                <a
                  href="https://github.com/argotorg"
                  className="underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/argotorg
                </a>
                ), consolidating both governance and technical stewardship under a single entity.
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-xl font-semibold">New hires</h3>
              <ul className="list-inside list-disc space-y-2">
                <li>
                  <strong>Operations (part-time):</strong> Supporting back-office operations and
                  payroll administration.
                </li>
                <li>
                  <strong>Fundraising & Ecosystem (full-time):</strong> Supporting donor relations,
                  grant coordination, and long-term funding strategy.
                </li>
                <li>
                  <strong>Solidity Engineer (full-time):</strong> Strengthening the C++
                  implementation of the Solidity compiler through backend and optimizer features
                  contributions, including SSA-CFG and ethdebug.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight">Financial Overview</h2>
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <div className="text-sm font-medium uppercase tracking-wide">Total Budget</div>
              <div className="text-3xl font-bold">
                ${reportData.sections.financialData.totalBudget.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <div className="text-sm font-medium uppercase tracking-wide">Spent</div>
              <div className="text-3xl font-bold">
                ${reportData.sections.financialData.spent.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-700">
              <div className="text-sm font-medium uppercase tracking-wide">Remaining</div>
              <div className="text-3xl font-bold">
                ${reportData.sections.financialData.remaining.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="mb-4 text-lg font-bold uppercase tracking-wide">Spending by Category</h3>
            <PieChart data={reportData.sections.financialData.categories} />
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight">Project Allocation</h2>
          <BarChart data={reportData.sections.projectBreakdown} />
        </section>
      </div>
    </ReportLayout>
  )
}
