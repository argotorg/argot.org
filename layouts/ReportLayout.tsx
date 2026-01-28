import { ReactNode } from 'react'
import Link from '@/components/Link'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import siteMetadata from '@/data/siteMetadata'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface ReportLayoutProps {
  title: string
  date: string
  children: ReactNode
  className?: string
}

export default function ReportLayout({ title, date, children, className }: ReportLayoutProps) {
  return (
    <>
      <ScrollTopAndComment />
      <article className={className}>
        <div className="">
          <header className="pt-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                  {title}
                </h1>
              </div>
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-base font-medium leading-6">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                  </dd>
                </div>
              </dl>
            </div>
          </header>
          <div className="divide-y pb-8">
            <div className="divide-y">
              <div className="prose max-w-none pb-8 pt-10 dark:prose-invert">{children}</div>
            </div>
            <footer>
              <div className="pt-4 xl:pt-8">
                <Link href="/reports" aria-label="Back to reports">
                  &larr; Back to reports
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </>
  )
}
