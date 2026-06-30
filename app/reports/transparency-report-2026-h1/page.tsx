import ReportLayout from '@/layouts/ReportLayout'
import { genPageMetadata } from 'app/seo'
import reportData from '@/data/reports/2026-h1/transparency-report.json'
import financialData from '@/data/reports/2026-h1/financial-data.json'
import fundingData from '@/data/reports/2026-h1/funding-data.json'
import grantData from '@/data/reports/2026-h1/grant-data.json'
import hiresData from '@/data/reports/2026-h1/hires-data.json'
import BudgetSection from './BudgetSection'
import DonorCard from './DonorCard'
import HireCard from './HireCard'

export const metadata = genPageMetadata({
  title: reportData.title,
  description: reportData.summary,
})

export default function TransparencyReport2026H1() {
  return (
    <ReportLayout title={reportData.title} date={reportData.date}>
      <div className="space-y-12">
        <section>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight">Introduction</h2>
          <div className="space-y-4 text-lg">
            <p>
              This is Argot Collective's bi-annual transparency report, detailing all spending from
              January 16 to July 1, 2026. Financial and organizational transparency is a core value
              of the collective. We believe public-goods stewardship requires openness and
              accountability.
            </p>
            <p>
              This is our second transparency report. Due to a slight delay in publishing the first
              report, the period covered here is slightly shorter than six months. This is reflected
              in the numbers.
            </p>
            <p>
              As with our previous report, the majority of expenses are contributor salaries
              supporting the continued development of Solidity, ethdebug, Fe, Sourcify, hevm, and
              act.
            </p>
          </div>
        </section>

        <section>
          <div className="mt-8 grid gap-6 md:grid-cols-[300px_1fr]">
            <h3 className="text-3xl font-extrabold">New Hires</h3>

            <div className="space-y-4">
              {hiresData.hires.map((hire) => (
                <HireCard key={hire.role} hire={hire} />
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight">Budget & Expenses</h2>
          <p className="mb-6">
            From January 16, 2026 through July 1, 2026 our total expenditures amounted to $
            {financialData.totalSpent.toLocaleString()}
          </p>
          <BudgetSection
            budgetExpenses={financialData.budgetExpenses}
            salaryByProject={financialData.salaryByProject}
          />
        </section>

        <section>
          <div className="mt-8 grid gap-6 md:grid-cols-[300px_1fr]">
            <h3 className="text-3xl font-extrabold">Grants</h3>
            <div className="space-y-4">
              {grantData.grantees.map((grantee) => (
                <DonorCard key={grantee.name} donor={grantee} />
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight">Funding</h2>
          <div className="space-y-4">
            <p>{fundingData.intro}</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-[300px_1fr]">
            <h3 className="text-3xl font-extrabold">Donors</h3>

            <div className="space-y-4">
              {fundingData.donors.map((donor) => (
                <DonorCard key={`${donor.name}-${donor.date}`} donor={donor} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </ReportLayout>
  )
}
