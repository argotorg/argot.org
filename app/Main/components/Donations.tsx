import Image from 'next/image'

export default function Donations() {
  return (
    <section className="space-y-8 py-12">
      <h2 className="mb-8 text-center text-3xl font-extrabold">Support Argot's Work</h2>

      <div className="mx-auto max-w-3xl space-y-6 text-sm md:text-xl">
        <p className="max-w-prose">
          The tools we maintain sit at the very core of Ethereum. By funding Argot, you're funding
          the longevity and security of Ethereum applications and the ecosystem as a whole.
        </p>

        <p className="max-w-prose">
          No donation is too small to make an impact, whether you contribute directly or consider us
          for a token allocation.
        </p>

        <div className="mt-8 rounded-lg py-8">
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
          <p className="text-center text-base italic text-gray-600 dark:text-gray-400 md:text-lg">
            Thanks to our supporters so far who have made strategic contributions to our work.
          </p>
          <div className="flex items-center justify-center gap-8 py-4">
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
    </section>
  )
}
