interface Donor {
  name: string
  amount: string
  date: string
  description: string
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
    </div>
  )
}
