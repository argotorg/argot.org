import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <>
      <div className="flex flex-col">
        <p className="mt-8">
          The Argot Collective is a new non-profit maintaining Ethereum's core infrastructure formed
          by 25 former Ethereum Foundation employees. Operating democratically and transparently, we
          aim to provide stable, long-term support for crucial projects, free from commercial
          pressures.
        </p>
        <p className="mt-8">
          Initially, the Argot collective will be home to the following projects:
        </p>
        <ul className="mt-2 list-inside list-disc">
          <li>Act: Formal specification language for smart contracts</li>
          <li>Ethdebug: Standardized debug info format for the EVM</li>
          <li>Fe: Smart contract language</li>
          <li>Hevm: Symbolic execution engine for the EVM</li>
          <li>Solidity: Smart contract language</li>
          <li>Sourcify: Open-source and decentralized source-code verification service</li>
        </ul>
        <p className="mt-8">
          Read more about Argot Collective in our{' '}
          <Link href="/blog/hello-world" className="underline">
            <span className="font-bold underline">announcement post</span>
          </Link>
          .
        </p>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
    </>
  )
}
