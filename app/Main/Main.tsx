import ProjectCard from './components/ProjectCard'
import { projects } from './data/projects'

export default function Home() {
  return (
    <>
      <section className="flex min-h-[60vh] w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            A credible neutral home
            <br />
            for Ethereum infrastructure
          </h1>
        </div>
      </section>

      <section className="mx-auto min-h-[40vh] max-w-3xl space-y-4 py-12 text-xl">
        <p className="mx-auto max-w-prose text-center">
          The Argot Collective is a new non-profit organization maintaining Ethereum's core
          infrastructure formed by 25 former Ethereum Foundation employees.
          <br />
          Operating democratically and transparently, we aim to provide stable, long-term support
          for crucial projects, free from commercial pressures.
        </p>
      </section>

      <section className="space-y-4 py-12 text-xl">
        <h2 className="text-3xl font-extrabold">Our Projects</h2>
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </section>
    </>
  )
}
