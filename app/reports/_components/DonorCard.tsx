import Link from '@/components/Link'

interface Donor {
  name: string
  amount: string
  date: string
  description: string
  link?: {
    href: string
    label: string
  }
}

interface DonorCardProps {
  donor: Donor
}

export default function DonorCard({ donor }: DonorCardProps) {
  return (
    <div className="rounded-lg bg-ecru-100/40 p-6 dark:bg-anthracite-600/80">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-semibold">{donor.amount}</div>
        <div className="text-base">{donor.date}</div>
      </div>
      <h4 className="text-2xl font-extrabold">{donor.name}</h4>
      <div className="mt-2 text-sm">{donor.description}</div>
      {donor.link && (
        <Link
          href={donor.link.href}
          className="mt-3 inline-block text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
        >
          {donor.link.label} &rarr;
        </Link>
      )}
    </div>
  )
}
