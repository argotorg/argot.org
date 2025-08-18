import ProjectCard from './components/ProjectCard'
import { projects } from './data/projects'
import AnnouncementBanner from './components/AnnouncementBanner'
import Hero from './components/Hero'
import Link from 'next/link'

export default function Main() {
  return (
    <>
      <Hero />

      <section className="mx-auto space-y-4 py-12 text-base md:text-lg">
        <div className="rounded-lg bg-ecru-300 p-4 dark:bg-anthracite-600 md:p-8">
          <p className="">
            Argot Collective is a non-profit, independent research and development group sustaining
            Ethereum's core programming languages and tooling, most notably Solidity. We provide a
            stable, long-term home for these projects.
            <br />
            <br />
            By uniting expertise in compilers, formal verification, and language design under one
            roof, we make smart contract and Ethereum application development simpler, safer, and
            more resilient.
          </p>

          <div className="mt-6">
            <h3 className="mb-2 text-xl font-bold md:text-2xl">
              We believe Ethereum's core infrastructure should be:
            </h3>

            <ul className="list-disc space-y-2 pl-6 text-base marker:text-amber-500 md:text-lg">
              <li>
                <strong>Independent</strong> - free from commercial capture, enabling collaboration
                over control.
              </li>

              <li>
                <strong>Open-source</strong> - software that anyone can inspect, use, and contribute
                to.
              </li>

              <li>
                <strong>Rigorously engineered</strong> - minimizing compiler bugs, improving
                developer safety, and responding to real-world usage patterns.
              </li>

              <li>
                <strong>Sustainable</strong> - supported by long-term stewardship, not short-term
                incentives.
              </li>
            </ul>

            <p className="mt-6">
              To learn more about our governance and values, please read our{' '}
              <Link
                href="/blog/hello-world"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 underline dark:text-amber-400"
              >
                manifesto
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4 py-12">
        <h2 className="text-3xl font-extrabold">Our Projects</h2>
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
