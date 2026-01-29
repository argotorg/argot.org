import ReportLayout from '@/layouts/ReportLayout'
import { genPageMetadata } from 'app/seo'
import reportData from '@/data/reports/2025/transparency-report.json'
import financialData from '@/data/reports/2025/financial-data.json'
import BudgetCharts from './BudgetCharts'

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
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight">Budget & Expenses</h2>
          <p className="mb-6">
            From July 1, 2025 through December 31, 2025 our total expenditures amounted to $
            {financialData.totalSpent.toLocaleString()}
          </p>
          <BudgetCharts
            budgetExpenses={financialData.budgetExpenses}
            salaryByProject={financialData.salaryByProject}
          />
          <p className="mt-6 text-sm italic">
            *Professional Services includes the domicile in Switzerland, design, accounting and
            banking fees.
          </p>
          <p className="mt-2 text-sm italic">**Org includes Admin, Ops, and Fundraising</p>
        </section>
      </div>
    </ReportLayout>
  )
}
