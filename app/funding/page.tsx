import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: "Support Argot's Work - Donations",
  description:
    "Support the development and maintenance of Ethereum's core infrastructure tools. Fund the longevity and security of Ethereum applications.",
}

export default function DonationsPage() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
          Support Argot's Work
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Fund the infrastructure Ethereum runs on
        </p>
      </div>

      <div className="container py-12">
        <div className="mx-auto max-w-3xl space-y-6 text-base md:text-xl">
          <p className="max-w-prose">
            The tools we maintain sit at the very core of Ethereum. By funding Argot, you're funding
            the longevity and security of Ethereum applications and the ecosystem as a whole.
          </p>

          <p className="max-w-prose">
            No donation is too small to make an impact, whether you contribute directly or consider
            us for a token allocation.
          </p>

          <div className="mt-8 rounded-lg bg-ecru-300 p-8 dark:bg-anthracite-700">
            <p className="text-center text-lg font-bold md:text-xl">
              Fund the infrastructure Ethereum runs on and get in touch: <br />
              <a
                href="mailto:funding@argot.org"
                className="text-amber-600 underline hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
              >
                funding@argot.org
              </a>
            </p>
          </div>

          <div className="mt-8">
            <p className="text-center text-base italic md:text-lg">
              Thanks to our supporters so far who have made strategic contributions to our work.
            </p>
            <div className="bg-ecru-100 mt-6 flex flex-wrap items-center justify-center gap-8 rounded-lg py-8 dark:bg-anthracite-600">
              <Image
                src="/static/ef.png"
                alt="Ethereum Foundation"
                className="h-16 w-auto"
                width={400}
                height={100}
              />
              <Image
                src="/static/octant.svg"
                alt="Octant"
                className="h-16 w-auto p-2"
                width={400}
                height={100}
              />
              <Image
                src="/static/optimism.svg"
                alt="Optimism"
                className="h-10 w-auto p-2"
                width={400}
                height={100}
              />
            </div>
          </div>

          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold">Why Support Argot?</h2>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Critical Infrastructure</h3>
              <p>
                Our projects form the foundation of Ethereum development. Solidity powers smart
                contracts, Sourcify enables verification, and our other tools ensure the ecosystem
                remains secure and accessible.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Independent Development</h3>
              <p>
                As an independent collective, we're free from commercial pressures that might
                compromise the integrity of these essential tools. Your support helps us maintain
                this independence.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Long-term Sustainability</h3>
              <p>
                We're committed to the long-term maintenance and evolution of these projects. Your
                contribution ensures they continue to evolve with the ecosystem's needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
