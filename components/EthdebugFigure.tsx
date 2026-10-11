'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useTheme } from 'next-themes'

// a figure's caption
const CAPTION =
  'mx-auto max-w-[50rem] text-center text-lg font-medium leading-snug text-anthracite-500 dark:text-ecru-200'
// where the post's figures come from (to try unpublished figure changes,
// set these to a local copy of the post's site, in .env.local)
const ORIGIN = process.env.NEXT_PUBLIC_ETHDEBUG_ORIGIN ?? 'https://ethdebug.github.io'
const POST = process.env.NEXT_PUBLIC_ETHDEBUG_POST ?? `${ORIGIN}/argot-post-2026-10`
const DEMO = `${POST}/demos/inspector`
// how far ahead of the screen a figure starts loading (two screens' heights,
// above and below)
const NEAR = '200% 0px'
// a frame's height until its content is ready
const DEFAULT_HEIGHT = 480
// a frame that reports no height by then shows a note instead
const TIMEOUT = 10_000

type Size = 'narrow' | 'text' | 'wide'
type Theme = 'light' | 'dark'
type Data = { type?: string; [k: string]: unknown }

// The frame's width, centred on the text column. Below `md` each size is
// the text column (the page's own gutter); from `md`, `wide` takes up to
// 96px more on each side, inside the page's 32px gutters.
const WIDTH: Record<Size, string> = {
  narrow: '[--w:min(100%,790px)]',
  text: '',
  wide: 'md:[--w:min(100%_+_192px,100vw_-_64px)]',
}

// What a frame shows before its content is ready: a quiet box of the
// size the figure will take.
function Placeholder({ late }: { late?: boolean }) {
  return (
    <div className="absolute inset-0 grid place-items-center rounded border border-anthracite-100 bg-ecru-200/50 text-sm text-anthracite-200 dark:border-anthracite-400 dark:bg-anthracite-600/50">
      {late ? (
        <span>
          Figure unavailable: <a href={`${POST}/companion/`}>see the companion page</a>.
        </span>
      ) : (
        <span aria-hidden>Loading figure…</span>
      )}
    </div>
  )
}

// A frame of the post's inspector. It keeps DEFAULT_HEIGHT, under a quiet
// placeholder, until the embed reports its content ready (a height with
// `ready: false` is a skeleton's, and is ignored); it then takes the
// content's height. It tells the embed the site's theme, on load
// and on each change. (Without a `src`, as before the site's theme is
// known, it is the placeholder alone.) With no height in TIMEOUT after
// load (say, a 404 page), the placeholder says the figure is unavailable.
function Frame({ src, title, theme }: { src?: string; title: string; theme?: Theme }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState<number>()
  const [late, setLate] = useState(false)
  // (a frame starts loading once it is within NEAR of the screen, so it is
  // ready when the reader gets there; the browser's own lazy loading waits
  // longer than the figures need)
  const [near, setNear] = useState(false)
  const room = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = room.current
    if (near || !el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), {
      rootMargin: NEAR,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [near])

  useEffect(() => {
    const listen = (e: MessageEvent<Data>) => {
      const el = frame.current
      if (e.origin !== ORIGIN || !el || e.source !== el.contentWindow) return
      const { type, height: h, ready } = e.data ?? {}
      if (type === 'ethdebug:height' && typeof h === 'number' && h > 0 && ready !== false)
        setHeight(Math.ceil(h))
    }
    addEventListener('message', listen)
    return () => removeEventListener('message', listen)
  }, [])

  const tell = useCallback(() => {
    // (a frame not loading the figure yet has no one to tell)
    if (!frame.current?.getAttribute('src')) return
    frame.current.contentWindow?.postMessage({ type: 'ethdebug:theme', theme }, ORIGIN)
  }, [theme])
  useEffect(tell, [tell])

  const timer = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => () => clearTimeout(timer.current), [])
  const onLoad = () => {
    // (an empty frame, not yet near, loads a blank page: not the figure)
    if (!near || !src) return
    tell()
    timer.current ??= setTimeout(() => setLate(true), TIMEOUT)
  }

  return (
    <div ref={room} className="relative" style={{ height: height ?? DEFAULT_HEIGHT }}>
      {!height && <Placeholder late={late} />}
      <iframe
        ref={frame}
        src={near ? src : undefined}
        title={title}
        loading="eager"
        scrolling="no"
        onLoad={onLoad}
        className="absolute inset-0 block h-full w-full border-0"
        style={{ colorScheme: src && theme, opacity: height ? 1 : 0, outline: 'none' }}
      />
    </div>
  )
}

// A figure from the ethdebug post's inspector, with a caption. Its `size`
// is `narrow` (at most 790px, centred), `text` (the text column), or
// `wide`. The caption is always on the text column.
export default function EthdebugFigure({
  scene,
  size,
  children,
}: {
  scene: string
  size: Size
  children?: ReactNode
}) {
  const { resolvedTheme } = useTheme()
  const theme: Theme | undefined = !resolvedTheme
    ? undefined
    : resolvedTheme === 'dark'
      ? 'dark'
      : 'light'
  // the theme the frames load with (later changes go by message)
  const [initial, setInitial] = useState<Theme>()
  useEffect(() => setInitial((t) => t ?? theme), [theme])

  return (
    <figure className="my-12 [&+h2]:mt-16">
      <div className={`ml-[calc((100%_-_var(--w))/2)] w-[var(--w)] [--w:100%] ${WIDTH[size]}`}>
        <div>
          <Frame
            src={initial && `${DEMO}/embed.html#scene=${scene}&theme=${initial}`}
            title={`ethdebug figure: ${scene}`}
            theme={theme ?? initial}
          />
        </div>
      </div>
      {children && (
        <figcaption className={`${CAPTION} mb-0 mt-4`} style={{ textWrap: 'balance' }}>
          {children}
        </figcaption>
      )}
    </figure>
  )
}
