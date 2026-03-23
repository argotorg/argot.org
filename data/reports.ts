import transparencyReport2025 from './reports/2025/transparency-report.json'
import type { ListPost } from '@/layouts/ListLayout'

export interface Report {
  slug: string
  title: string
  date: string
  summary: string
}

const reports: Report[] = [
  {
    slug: 'transparency-report-2025',
    ...transparencyReport2025,
  },
]

export function reportsAsListPosts(): ListPost[] {
  return reports.map((report) => ({
    slug: report.slug,
    title: report.title,
    date: report.date,
    summary: report.summary,
    path: `reports/${report.slug}`,
    tags: [],
    isReport: true,
    type: 'Blog',
    filePath: '',
    readingTime: { text: '', minutes: 0, time: 0, words: 0 },
    toc: '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    structuredData: {} as Record<string, any>,
  }))
}

export default reports
