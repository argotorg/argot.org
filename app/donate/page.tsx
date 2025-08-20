import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Argot Collective - Donations',
  description:
    'Support the development and maintenance of Ethereum’s core infrastructure tools. Fund the longevity and security of Ethereum applications.',
}

interface Funder {
  name: string
  url: string
  logo: {
    light: string
    dark?: string
  }
  className?: string
}

const funders: Funder[] = [
  {
    name: 'Ethereum Foundation',
    url: 'https://ethereum.foundation/',
    logo: {
      light: '/static/funders/ef.png',
      dark: '/static/funders/ef-white.png',
    },
    className: 'h-16 w-auto',
  },
  {
    name: 'Octant',
    url: 'https://octant.app/',
    logo: {
      light: '/static/funders/octant-horizontal-black.svg',
      dark: '/static/funders/octant-horizontal-white.svg',
    },
    className: 'h-16 w-auto p-2',
  },
  {
    name: 'Optimism',
    url: 'https://optimism.io/',
    logo: {
      light: '/static/funders/op-black.png',
      dark: '/static/funders/op-white.png',
    },
    className: 'h-10 w-auto p-2',
  },
]

export default function DonationsPage() {
  return (
    <div className="mx-auto">
      <div className="space-y-2 pb-8 pt-6">
        <h1 className="text-3xl font-bold sm:text-2xl md:text-3xl">Support Argot</h1>
      </div>

      <div className="">
        <div className="mx-auto space-y-6 text-base md:text-lg">
          <p className="">
            The tools we maintain sit at the very core of Ethereum. By funding Argot, you're funding
            the longevity and security of Ethereum applications and the ecosystem as a whole. No
            donation is too small to make an impact, whether you contribute directly or consider us
            for a token allocation.
          </p>
          <h3 className="font-bold">We believe Ethereum's core infrastructure should be:</h3>

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
              <strong>Rigorously engineered</strong> - minimizing compiler bugs, improving developer
              safety, and responding to real-world usage patterns.
            </li>

            <li>
              <strong>Sustainable</strong> - supported by long-term stewardship, not short-term
              incentives.
            </li>
          </ul>

          <p className="font-bold">
            Fund the infrastructure Ethereum runs on and get in touch:{' '}
            <a
              href="mailto:funding@argot.org"
              className="text-amber-600 underline hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
            >
              funding@argot.org
            </a>
          </p>
        </div>
        <div className="mt-20 flex flex-col space-y-4 rounded-lg bg-ecru-300 p-8 dark:bg-anthracite-600 md:flex-row md:items-center md:justify-evenly md:space-y-0">
          <p className="break-words text-center text-base font-semibold sm:text-left md:text-xl">
            Thanks to our supporters so far:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 rounded-lg">
            {funders.map((funder) => (
              <Link
                key={funder.name}
                href={funder.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-75"
                aria-label={`Visit ${funder.name}`}
              >
                {funder.logo.dark ? (
                  <>
                    <Image
                      src={funder.logo.light}
                      alt={funder.name}
                      className={`${funder.className} dark:hidden`}
                      width={400}
                      height={100}
                    />
                    <Image
                      src={funder.logo.dark}
                      alt={funder.name}
                      className={`${funder.className} hidden dark:block`}
                      width={400}
                      height={100}
                    />
                  </>
                ) : (
                  <Image
                    src={funder.logo.light}
                    alt={funder.name}
                    className={funder.className}
                    width={400}
                    height={100}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
