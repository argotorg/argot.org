interface Hire {
  role: string
  description: string
}

interface HireCardProps {
  hire: Hire
}

export default function HireCard({ hire }: HireCardProps) {
  return (
    <div className="rounded-lg bg-ecru-100/40 p-6 dark:bg-anthracite-600/80">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-8">
        <h4 className="text-xl font-extrabold md:w-48 md:shrink-0">{hire.role}</h4>
        <div className="text-sm">{hire.description}</div>
      </div>
    </div>
  )
}
