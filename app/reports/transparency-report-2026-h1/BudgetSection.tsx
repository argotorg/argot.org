'use client'

import { useState } from 'react'
import BudgetCharts from './BudgetCharts'

interface BudgetItem {
  name: string
  amount: number
}

interface BudgetSectionProps {
  budgetExpenses: BudgetItem[]
  salaryByProject: BudgetItem[]
}

type Tab = 'total' | 'salaries'

export default function BudgetSection({ budgetExpenses, salaryByProject }: BudgetSectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>('total')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'total', label: 'Total' },
    { id: 'salaries', label: 'Salaries per Project' },
  ]

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-lg bg-ecru-500 p-1 dark:bg-anthracite-600">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-6 py-2 text-sm font-semibold transition-all duration-200 ease-out ${
                activeTab === tab.id
                  ? 'bg-anthracite text-ecru shadow-md dark:bg-ecru-600 dark:text-anthracite'
                  : 'text-anthracite-600 hover:text-anthracite dark:text-ecru-600 dark:hover:text-ecru'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'total' ? (
        <>
          <BudgetCharts items={budgetExpenses} />
          <p className="mt-6 text-right text-sm italic">
            *Professional Services includes the domicile in Switzerland, design, accounting and
            banking fees.
          </p>
        </>
      ) : (
        <>
          <BudgetCharts items={salaryByProject} />
          <p className="mt-6 text-right text-sm italic">
            **Org includes Admin, Ops, and Fundraising
          </p>
        </>
      )}
    </div>
  )
}
