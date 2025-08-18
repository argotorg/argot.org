import ProjectCard from './components/ProjectCard'
import { projects } from './data/projects'
import AnnouncementBanner from './components/AnnouncementBanner'
import Hero from './components/Hero'
import About from './components/About'

export default function Main() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-3xl space-y-4 py-12 text-sm md:text-xl">
        <div className="rounded-lg bg-ecru-300 p-8 dark:bg-anthracite-700">
          <p className="mx-auto max-w-prose text-justify">
            Argot Collective is a non-profit, independent research and development group sustaining
            Ethereum's core programming languages and tooling, most notably Solidity.
            <br />
            <br />
            By uniting expertise in compilers, formal verification, and language design under one
            roof, we make smart contract and Ethereum application development simpler, safer, and
            more resilient.
          </p>
        </div>
      </section>

      <About />

      <section className="space-y-4 py-12">
        <h2 className="text-center text-3xl font-extrabold">Our Projects</h2>
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
