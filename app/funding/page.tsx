import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: "Support Argot's Work - Donations",
  description:
    "Support the development and maintenance of Ethereum's core infrastructure tools. Fund the longevity and security of Ethereum applications.",
}

export default function DonationsPage() {
  return (
    <div className="mx-auto max-w-prose text-center">
      <div className="space-y-2 pb-8 pt-6">
        <h1 className="text-3xl font-extrabold sm:text-2xl md:text-3xl">Support Argot</h1>
      </div>

      <div className="">
        <div className="mx-auto space-y-6 text-base md:text-xl">
          <p className="">
            The tools we maintain sit at the very core of Ethereum. By funding Argot, you're funding
            the longevity and security of Ethereum applications and the ecosystem as a whole.
          </p>

          <p className="">
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
            <div className="bg-ecru-100 mt-6 flex flex-wrap items-center justify-center gap-8 rounded-lg py-8 ">
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
        </div>
      </div>
    </div>
  )
}
