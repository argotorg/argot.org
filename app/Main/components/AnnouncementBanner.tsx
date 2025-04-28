import Image from 'next/image'
import Link from '@/components/Link'

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
  return (
    <div className="grid grid-cols-2 rounded-lg bg-amber-500">
      {/* Logo Side */}
      <div className="flex items-center justify-center p-8">
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
      <div className="flex h-[300px] flex-col justify-center p-12">
        <h2 className="mb-4 text-3xl font-bold text-anthracite">We are live!</h2>
        <p className="mb-8 text-xl text-anthracite">
          Argot Collective just launched! Read our manifesto to learn more.
        </p>
        <Link
          href="/blog/hello-world"
          className="inline-flex w-fit items-center rounded-lg bg-anthracite px-6 py-2 font-bold text-ecru transition-colors hover:bg-anthracite/90"
        >
          Read the announcement
        </Link>
      </div>
    </div>
  )
}
