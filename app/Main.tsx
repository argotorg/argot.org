import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  return (
    <>
      <div className="prose max-w-none dark:prose-invert">
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
          <li>
            <Link href="https://github.com/ethereum/act">Act</Link>: Formal specification language
            for smart contracts
          </li>
          <li>
            <Link href="https://ethdebug.github.io/format/index.html">Ethdebug</Link>: Standardized
            debug info format for the EVM
          </li>
          <li>
            <Link href="https://fe-lang.org/">Fe</Link>: Smart contract language
          </li>
          <li>
            <Link href="https://hevm.dev">Hevm</Link>: Symbolic execution engine for the EVM
          </li>
          <li>
            <Link href="https://soliditylang.org/">Solidity</Link>: Smart contract language
          </li>
          <li>
            <Link href="https://sourcify.dev/">Sourcify</Link>: Open-source and decentralized
            source-code verification service
          </li>
        </ul>
        <p className="mt-8">
          Read more about Argot Collective in our{' '}
          <Link href="/blog/hello-world">
            <span className="font-bold">announcement post</span>
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
