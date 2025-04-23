import Link from '@/components/Link'

interface ProjectCardProps {
  title: string
  description: string
  href: string
}

export default function ProjectCard({ title, description, href }: ProjectCardProps) {
  return (
    <Link href={href} className="group">
      <div className="bg-ecru-300 dark:bg-anthracite relative h-full overflow-hidden rounded-lg p-6">
        <div className="relative z-10">
          <h3 className="text-anthracite dark:text-ecru mb-4 text-3xl font-bold tracking-tight">
            {title}
          </h3>
          <p className="text-anthracite-400 dark:text-ecru-400 text-lg">{description}</p>
        </div>

        {/* Overlay */}
        <div className="absolute bottom-0 right-0 z-20 h-full w-full translate-y-full bg-amber-500/95 transition-transform duration-300 ease-in-out group-hover:translate-y-0">
          <div className="flex h-full items-center justify-center">
            <span className="text-anthracite text-2xl font-bold">Read More</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
