import ReportLayout from '@/layouts/ReportLayout'
import { genPageMetadata } from 'app/seo'
import reportData from '@/data/reports/2025/transparency-report.json'
import financialData from '@/data/reports/2025/financial-data.json'
import fundingData from '@/data/reports/2025/funding-data.json'
import grantData from '@/data/reports/2025/grant-data.json'
import hiresData from '@/data/reports/2025/hires-data.json'
import BudgetSection from './BudgetSection'
import DonorCard from './DonorCard'
import HireCard from './HireCard'

export const metadata = genPageMetadata({
  title: reportData.title,
  description: reportData.summary,
})

export default function TransparencyReport2025() {
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

            <div className="mt-8 grid gap-6 md:grid-cols-[300px_1fr]">
              <h3 className="text-3xl font-extrabold">New Hires</h3>

              <div className="space-y-4">
                {hiresData.hires.map((hire) => (
                  <HireCard key={hire.role} hire={hire} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight">Budget & Expenses</h2>
          <p className="mb-6">
            From July 1, 2025 through December 31, 2025 our total expenditures amounted to $
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
                <DonorCard key={donor.name} donor={donor} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </ReportLayout>
  )
}
