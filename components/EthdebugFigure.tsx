'use client'

import {
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useTheme } from 'next-themes'
import heights from '@/data/ethdebug-heights.json'

// a figure's caption
const CAPTION =
  'mx-auto max-w-[50rem] text-center text-lg font-medium leading-snug text-anthracite-500 dark:text-ecru-200'
// where the post's figures come from (to try unpublished figure changes,
// set these to a local copy of the post's site, in .env.local)
const ORIGIN = process.env.NEXT_PUBLIC_ETHDEBUG_ORIGIN ?? 'https://ethdebug.github.io'
const POST = process.env.NEXT_PUBLIC_ETHDEBUG_POST ?? `${ORIGIN}/argot-post-2026-10`
const DEMO = `${POST}/demos/inspector`
// each figure's poster, a still of it as it opens (the reveal: revealed),
// for reader views, print, readers with no script, and link previews; it
// holds the figure's place until the frame is ready, and stays under it.
// From the published post always: a local copy of its site has none (the
// post's deploy makes them, bin/posters.mjs), at the frame widths
// POSTER_WIDTHS, light and dark, twice the pixels below 1024
const POSTERS = 'https://ethdebug.github.io/argot-post-2026-10/demos/inspector/posters'
const POSTER_WIDTHS = [343, 358, 680, 790, 960, 1024, 1216]
// (a poster is chosen by the screen's width, from which its frame is at
// least the poster's width: a frame is the screen less its gutters, 2 ×
// 16px below `md` and 2 × 32px from it, up to its size's widest)
const from = (w: number) => (w + 32 < 768 ? w + 32 : w + 64)
// a figure's poster's description, for a scene with no caption
const DESCRIBED: Record<string, string> = {
  reveal: "A contract's storage as raw bytes, annotated with the variables they hold",
}
// how far ahead of the screen a figure starts loading (two screens' heights,
// above and below)
const NEAR = '200% 0px'
// a frame's height for a scene with none measured
const DEFAULT_HEIGHT = 480
// a frame that reports no height by then shows a note instead
const TIMEOUT = 10_000

type Size = 'narrow' | 'text' | 'wide'
type Theme = 'light' | 'dark'
type Data = { type?: string; [k: string]: unknown }

// (each size's widest frame)
const WIDEST: Record<Size, number> = { narrow: 790, text: 1024, wide: 1216 }

// The frame's width, centred on the text column. Below `md` each size is
// the text column (the page's own gutter); from `md`, `wide` takes up to
// 96px more on each side, inside the page's 32px gutters.
const WIDTH: Record<Size, string> = {
  narrow: '[--w:min(100%,790px)]',
  text: '',
  wide: 'md:[--w:min(100%_+_192px,100vw_-_64px)]',
}

// The figures' final heights, measured by scripts/ethdebug-heights.mjs:
// { [scene]: { [frame width in px]: height } }. (A scene it hasn't
// measured reserves DEFAULT_HEIGHT: run it again when the figures change.)
const HEIGHTS: Record<string, Record<string, number>> = heights

// The page's layout is final at first paint (so the browser's own scroll
// restore lands where the reader was): each frame reserves its measured
// height in CSS, picked by the frame's own width (a container query, the
// height at the nearest measured width at or below it). `id` names the
// figure's elements: `id` the figure's box (the container), `id-f` its
// frame.
function layout(id: string, figure?: Record<string, number>) {
  const steps = (table: Record<string, number> = {}) =>
    Object.entries(table)
      .map(([w, h]) => [Number(w), h])
      .sort(([a], [b]) => a - b)
  const at = (w: number, i: number, rules: string) =>
    i === 0 ? rules : `@container (min-width: ${w}px) { ${rules} }`
  const f = `.${id} .${id}`
  const css = [
    `.${id} { container-type: inline-size; }`,
    // (on a dark page, a light poster, as rendered before the page knew
    // its theme, stays hidden until the dark one has loaded in its place)
    `.dark .${id}-i[data-shown="light"] { visibility: hidden; }`,
  ]
  steps(figure).forEach(([w, h], i) => css.push(at(w, i, `${f}-f { height: ${h}px; }`)))
  return css.join('\n')
}

// A caption's words, for its poster's description
function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

// A figure's poster, in normal flow at its own size (centred; never wider
// than the frame; cut at the frame's reserved height), the one for the
// frame's width: a <source> for each poster width its size reaches, by the
// screen's width, and its `src` the widest up to the text column's, for
// readers that take that alone.
function Poster({
  scene,
  size,
  theme,
  alt,
  className,
}: {
  scene: string
  size: Size
  theme: Theme
  alt: string
  className: string
}) {
  const widths = POSTER_WIDTHS.filter((w) => w <= WIDEST[size])
  const url = (w: number) => `${POSTERS}/${scene}-${theme}-${w}.webp`
  const set = (w: number) => `${url(w)} ${w < 1024 ? 2 : 1}x`
  return (
    <picture>
      {widths
        .slice(1)
        .reverse()
        .map((w) => (
          <source key={w} media={`(min-width: ${from(w)}px)`} srcSet={set(w)} />
        ))}
      <img
        src={url(Math.max(...widths.filter((w) => w <= 1024)))}
        srcSet={set(widths[0])}
        alt={alt}
        // (the theme of the poster it shows: light, as rendered; then, on
        // each load, the loaded one's)
        data-shown="light"
        onLoad={(e) => {
          const img = e.currentTarget
          img.dataset.shown = img.currentSrc.includes('-dark-') ? 'dark' : 'light'
        }}
        loading="lazy"
        className={`mx-auto my-0 block max-w-full ${className}`}
      />
    </picture>
  )
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

// A frame of the post's inspector. It keeps its reserved height (by its
// `reserve` class, from the CSS of `layout`; with none, DEFAULT_HEIGHT),
// under a quiet placeholder, until the embed reports its content ready (a
// height with `ready: false` is a skeleton's, and is ignored); it then
// takes the content's height. With a `poster`, that is what it shows
// instead of the placeholder, in the flow, the frame over it (opaque, in
// the page's colour, once ready). It tells the embed the site's theme, on load
// and on each change. (Without a `src`, as before the site's theme is
// known, it is the placeholder alone.) With no height in TIMEOUT after
// load (say, a 404 page), the placeholder says the figure is unavailable.
function Frame({
  src,
  title,
  theme,
  reserve,
  poster,
}: {
  src?: string
  title: string
  theme?: Theme
  // (the class that gives it its reserved height)
  reserve?: string
  poster?: ReactNode
}) {
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
    <div
      ref={room}
      className={`relative ${reserve ?? ''}`}
      // (a poster cut at the frame's height; inline, as a class with
      // "hidden" in it makes reader views drop the box)
      style={{
        overflow: poster ? 'hidden' : undefined,
        ...(height ? { height } : reserve ? undefined : { height: DEFAULT_HEIGHT }),
      }}
    >
      {poster}
      {!height && (!poster || late) && <Placeholder late={late} />}
      <iframe
        ref={frame}
        src={near ? src : undefined}
        title={title}
        loading="eager"
        scrolling="no"
        onLoad={onLoad}
        className={`absolute inset-0 block h-full w-full border-0 ${
          height ? 'bg-ecru dark:bg-anthracite' : ''
        } ${poster ? 'print:hidden' : ''}`}
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

  // (the figure's CSS: its reserved heights)
  const id = `ethdebug-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const css = layout(id, HEIGHTS[scene])

  return (
    <figure className="my-12 [&+h2]:mt-16">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        className={`${id} ml-[calc((100%_-_var(--w))/2)] w-[var(--w)] [--w:100%] ${WIDTH[size]}`}
      >
        <div>
          <Frame
            src={initial && `${DEMO}/embed.html#scene=${scene}&theme=${initial}`}
            title={`ethdebug figure: ${scene}`}
            theme={theme ?? initial}
            reserve={HEIGHTS[scene] && `${id}-f`}
            poster={
              <Poster
                scene={scene}
                size={size}
                // (before the page's theme is known here, light, as
                // rendered on the server)
                theme={(initial && theme) || 'light'}
                alt={
                  textOf(children).replace(/\s+/g, ' ').trim() ||
                  DESCRIBED[scene] ||
                  `ethdebug figure: ${scene}`
                }
                className={`${id}-i`}
              />
            }
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
