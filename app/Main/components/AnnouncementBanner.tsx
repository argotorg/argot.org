import Image from 'next/image'
import Link from '@/components/Link'
import { allBlogs } from 'contentlayer/generated'
import { sortPosts } from 'pliny/utils/contentlayer'
import { HiExternalLink } from 'react-icons/hi'

function LineRow({ direction = 'right', index }: { direction: 'left' | 'right'; index: number }) {
  // Generate random lines
  const widths = Array.from(
    { length: Math.floor(Math.random() * 15) + 2 }, // Random number of lines between
    () => Math.floor(Math.random() * 100) + 35 // Width between 35px and 135px
  )
  // Generate random gaps between 4px and 12px
  const gaps = Array.from({ length: 20 }, () => Math.floor(Math.random() * 60) + 12)

  return (
    <div className="flex h-[30px] items-center">
      <div
        className={`flex ${direction === 'right' ? 'animate-slide-right' : 'animate-slide-left'}`}
        style={{ animationDelay: `${index * 0.2}s` }}
      >
        {widths.map((width, i) => (
          <div key={i} className="flex items-center">
            <svg height="30" width={width} className="text-anthracite">
              <rect width={width} height="30" rx="2.5" fill="currentColor" />
            </svg>
            {i < gaps.length && <div style={{ width: `${gaps[i]}px` }} />}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnnouncementBanner() {
  const sortedPosts = sortPosts(allBlogs)
  const latestPost = sortedPosts[0]
    ? {
        title: sortedPosts[0].title,
        summary: sortedPosts[0].summary,
        slug: sortedPosts[0].slug,
        href: sortedPosts[0].externalUrl || `/blog/${sortedPosts[0].slug}`,
        isExternal: !!sortedPosts[0].externalUrl,
      }
    : null

  if (!latestPost) {
    return null
  }

  return (
    <div className="grid grid-cols-1 rounded-lg bg-amber-500 md:grid-cols-2">
      {/* Logo Side */}
      <div className="flex items-center justify-center p-4 md:p-8">
        <div className="flex w-full items-center justify-between overflow-hidden rounded-xl bg-amber-400/50 py-8">
          {/* Left Lines Container */}
          <div className="flex h-[150px] flex-1 flex-col justify-between overflow-hidden">
            <LineRow direction="right" index={0} />
            <div className="h-[30px]" />
            <LineRow direction="left" index={1} />
            <div className="h-[30px]" />
            <LineRow direction="right" index={2} />
          </div>

          <Image
            src="/static/icon.svg"
            alt="Argot Collective Logo"
            width={120}
            height={150}
            className="mx-2 h-[150px] w-auto"
          />

          {/* Right Lines Container */}
          <div className="flex h-[150px] flex-1 flex-col justify-between overflow-hidden">
            <LineRow direction="right" index={3} />
            <div className="h-[30px]" />
            <LineRow direction="left" index={4} />
            <div className="h-[30px]" />
            <LineRow direction="right" index={5} />
          </div>
        </div>
      </div>

      {/* Content Side */}
      <div className="mb-6 mt-4 flex flex-col items-center justify-center px-6 text-center md:h-[300px] md:items-start md:px-12 md:text-left">
        <h2 className="mb-4 text-3xl font-bold text-anthracite">Read our latest blog post</h2>
        <p className="mb-4 text-xl text-anthracite md:mb-8">{latestPost.title}</p>
        <Link
          href={latestPost.href}
          className="inline-flex w-fit items-center gap-2 rounded-lg bg-anthracite px-6 py-2 font-bold text-ecru transition-colors hover:bg-anthracite/90"
        >
          Read
          {latestPost.isExternal && <HiExternalLink className="h-4 w-4" />}
        </Link>
      </div>
    </div>
  )
}
