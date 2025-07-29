import ProjectCard from './components/ProjectCard'
import { projects } from './data/projects'
import AnnouncementBanner from './components/AnnouncementBanner'
import Hero from './components/Hero'

export default function Main() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-3xl space-y-4 py-12 text-sm md:text-xl">
        <p className="mx-auto max-w-prose text-center">
          The Argot Collective is a new non-profit organization maintaining Ethereum's core
          infrastructure formed by 25 former Ethereum Foundation employees.
          <br /> <br />
          Operating democratically and transparently, we aim to provide stable, long-term support
          for crucial projects, free from commercial pressures.
        </p>
      </section>

      <section className="space-y-4 pb-12">
        <h2 className="text-center text-3xl font-extrabold md:text-left">Our Projects</h2>
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
        </div>
      </section>

      {/* Announcement Banner */}
      <section>
        <AnnouncementBanner />
      </section>
    </>
  )
}
