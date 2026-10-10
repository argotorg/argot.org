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

// how much of a walkthrough figure's end stays below its panel when the
// panel lets go of the screen's top
// whether a walkthrough step may scroll the page to bring its lit rows
// into view (off: testing whether page scrolling drops the panel's clicks)
const AUTO_SCROLL = true
// how many storage rows of a walkthrough figure's end stay below its panel
// when the panel lets go (the embed reports a row's pitch; until it does,
// FALLBACK)
const RELEASE_ROWS = 5
const FALLBACK = '160px'
// where an annotated figure's top is (as a fraction of the screen's
// height from its top) when its reveal starts, and when it is complete
const REVEAL_FROM = 0.25
const REVEAL_TO = -0.45
// (not pinned, the same story in screens' heights of scrolling: the first
// beat shows at REVEAL_FROM, the bytes stay raw for STILL more, the reveal
// runs to REVEAL_TO, then the second beat, and the figure's own note STILL
// later)
const STILL = 0.25
// an annotated figure that fits on the screen instead holds still in its
// middle while the reader scrolls through its story, in parts measured in
// screens' heights: LEAD, the raw bytes alone, for a look first; BEAT,
// the first beat (a paragraph under the figure) shows; REVEAL, the
// annotations come in; HOLD, the finished figure, the other beats added
// in turn over it
const LEAD = 0.25
const BEAT = 0.35
const REVEAL = 0.7
const HOLD = 0.7
const RUNWAY = LEAD + BEAT + REVEAL + HOLD
// (it fits when it takes at most this much of the screen's height)
const FITS = 0.95
// (and the room its beats take under it, pinned)
const BEATS_ROOM = 160
// a figure's caption, and its beats (an annotated figure's caption, told in
// parts)
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

type Size = 'narrow' | 'text' | 'wide' | 'full'
type Theme = 'light' | 'dark'
type Data = { type?: string; [k: string]: unknown }

// (each size's widest frame)
const WIDEST: Record<Size, number> = { narrow: 790, text: 1024, wide: 1216, full: Infinity }

// The frame's width, centred on the text column. Below `md` each size is
// the text column (the page's own gutter); from `md`, `wide` takes up to
// 96px more on each side and `full` the page less its 32px gutters.
const WIDTH: Record<Size, string> = {
  narrow: '[--w:min(100%,790px)]',
  text: '',
  wide: 'md:[--w:min(100%_+_192px,100vw_-_64px)]',
  full: 'md:[--w:calc(100vw_-_64px)]',
}

// The figures' final heights, measured by scripts/ethdebug-heights.mjs:
// { [key]: { [frame width in px]: height } }, where the key is the scene,
// `<scene>#walkthrough` for a figure whose panel is its own frame, and
// `<scene>#panel` for that panel. (A scene it hasn't measured reserves
// DEFAULT_HEIGHT: run it again when the figures change.)
const HEIGHTS: Record<string, Record<string, number>> = heights

// The page's layout is final at first paint (so the browser's own scroll
// restore lands where the reader was): each frame reserves its measured
// height in CSS, picked by the frame's own width (a container query, the
// height at the nearest measured width at or below it), and an annotated
// figure pins (or not) by a media query on the screen's height, its
// threshold from that same height. `id` names the figure's elements:
// `id` the figure's box (the container), `id-f` its frame, `id-pc` and
// `id-p` the walkthrough panel's box and frame, `id-s` the stage, `id-r`
// the runway's room, `id-b` the pinned beats, `id-u` the phone's bubbles.
function layout(
  id: string,
  figure?: Record<string, number>,
  panel?: Record<string, number>,
  pin?: boolean
) {
  const steps = (table: Record<string, number> = {}) =>
    Object.entries(table)
      .map(([w, h]) => [Number(w), h])
      .sort(([a], [b]) => a - b)
  const at = (w: number, i: number, rules: string) =>
    i === 0 ? rules : `@container (min-width: ${w}px) { ${rules} }`
  const f = `.${id} .${id}`
  const unpinned = `${f}-s { position: relative; top: auto; --pinned: 0; } ${f}-r, ${f}-b { display: none; } ${f}-u { display: block; }`
  const pinned = (h: number) =>
    `${f}-s { position: sticky; top: calc((100svh - var(--stage, ${h + BEATS_ROOM}px)) / 2); --pinned: 1; } ${f}-r { display: block; height: ${RUNWAY * 100}svh; } ${f}-b { display: block; } ${f}-u { display: none; }`
  const css = [
    `.${id}, .${id}-pc { container-type: inline-size; }`,
    // (on a dark page, a light poster, as rendered before the page knew
    // its theme, stays hidden until the dark one has loaded in its place)
    `.dark .${id}-i[data-shown="light"] { visibility: hidden; }`,
    // (an annotated figure's poster is revealed: never shown on a page
    // with its script, where the figure opens raw; in print it is, and
    // with no script, by a <noscript> rule. Its room is kept, and reader
    // views still take it)
    `.${id}-i[data-spoils] { opacity: 0; }`,
    `@media print { .${id}-i[data-spoils] { opacity: 1; } }`,
  ]
  steps(figure).forEach(([w, h], i) => {
    css.push(at(w, i, `${f}-f { height: ${h}px; }`))
    if (!pin) return
    css.push(at(w, i, unpinned))
    // (it fits when its frame and its beats' room take at most FITS of
    // the screen's height)
    const tall = Math.ceil((h + BEATS_ROOM) / FITS)
    css.push(at(w, i, `@media (min-height: ${tall}px) { ${pinned(h)} }`))
  })
  if (pin && !figure) css.push(unpinned)
  steps(panel).forEach(([w, h], i) => css.push(at(w, i, `.${id}-pc .${id}-p { height: ${h}px; }`)))
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
  spoils,
}: {
  scene: string
  size: Size
  theme: Theme
  alt: string
  className: string
  // (it shows the figure's payoff: shown only with no script, and in print)
  spoils?: boolean
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
        data-spoils={spoils || undefined}
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
  onMessage,
  frameRef,
  eager,
  poster,
}: {
  src?: string
  title: string
  theme?: Theme
  // (the class that gives it its reserved height)
  reserve?: string
  onMessage?: (data: Data, el: HTMLIFrameElement) => void
  frameRef?: React.MutableRefObject<HTMLIFrameElement | null>
  // (load at once, not when it nears the screen)
  eager?: boolean
  poster?: ReactNode
}) {
  const own = useRef<HTMLIFrameElement>(null)
  const frame = frameRef ?? own
  const [height, setHeight] = useState<number>()
  const [late, setLate] = useState(false)
  // (a frame starts loading once it is within NEAR of the screen, so it is
  // ready when the reader gets there; the browser's own lazy loading waits
  // longer than the figures need)
  const [near, setNear] = useState(!!eager)
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
      const sized = type === 'ethdebug:height' || type === 'ethdebug:ready'
      if (sized && typeof h === 'number' && h > 0 && ready !== false) setHeight(Math.ceil(h))
      onMessage?.(e.data, el)
    }
    addEventListener('message', listen)
    return () => removeEventListener('message', listen)
  }, [onMessage])

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
// is `narrow` (at most 790px, centred), `text` (the text column), `wide`, or
// `full`; without one it follows
// the embed's columns (2: wide). The caption is always on the text
// column. With `walkthrough`, the walkthrough panel is its own frame that
// sticks to the top of the screen while the figure is in view (the two
// frames share a channel).
export default function EthdebugFigure({
  scene,
  size: declared,
  walkthrough,
  beats,
  todo,
  children,
}: {
  scene?: string
  size?: Size
  walkthrough?: boolean
  // an annotated figure's story: paragraphs added under it in turn while
  // it is pinned (before its reveal, and once it is done)
  // (a \n in one breaks its line there)
  beats?: string[]
  todo?: string
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

  const [reported, setReported] = useState<Size>()
  const [row, setRow] = useState<number>()
  // (where the figure's storage dump ends, in its frame, as it says: the
  // phone's beat bubbles let go before it; until it says, a guess)
  const [storageEnd, setStorageEnd] = useState<number>()
  const [frameTall, setFrameTall] = useState<number>()
  const release = row ? `${RELEASE_ROWS * row}px` : FALLBACK
  const box = useRef<HTMLDivElement>(null)
  const sentinel = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLIFrameElement>(null)
  const figure = useRef<HTMLIFrameElement>(null)
  // (a figure with beats is an annotated one; it says so itself too)
  const [reveals, setReveals] = useState(!!beats?.length)

  const stage = useRef<HTMLDivElement>(null)
  // (the stage's room for the story, in screens' heights, pinned)
  const room = useRef<HTMLDivElement>(null)
  // which beat shows (-1: none yet)
  const [beat, setBeat] = useState(-1)
  const story = beats ?? []
  // Whether the annotated figure is pinned, as its CSS decides (`layout`:
  // it fits when its frame's measured height plus room for its beats takes
  // at most FITS of the screen's height); read here, with the stage's
  // height, which centres it on the screen
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const el = stage.current
    if (!story.length || !el) return
    const measure = () => {
      el.style.setProperty('--stage', `${el.offsetHeight}px`)
      setPinned(getComputedStyle(el).getPropertyValue('--pinned').trim() === '1')
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    if (el.parentElement) ro.observe(el.parentElement)
    addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      removeEventListener('resize', measure)
    }
  }, [story.length])

  // an annotated figure starts raw and reveals its annotations as the
  // reader scrolls (and goes back when scrolled back), by a progress from
  // 0 to 1 that the embed stages its annotations by. Pinned, the figure
  // holds still in the middle of the screen while the reader scrolls
  // through its story (LEAD, BEAT, REVEAL, HOLD), and progress runs over
  // REVEAL;
  // otherwise it runs from the figure's top REVEAL_FROM of the way down
  // the screen to REVEAL_TO.
  useEffect(() => {
    const el = figure.current
    if (!reveals || !el) return
    let last = -1
    let frame = 0
    const tell = () => {
      frame = 0
      let progress: number
      // (how far through HOLD, 0 to 1: the figure may add notes over it)
      let after = 0
      if (pinned && stage.current && room.current) {
        // how far into the story, in screens (the room's height is
        // RUNWAY screens; the stage sticks at its `top`)
        const hold = parseFloat(getComputedStyle(stage.current).top) || 0
        const screen = room.current.offsetHeight / RUNWAY || innerHeight
        const top = stage.current.parentElement!.getBoundingClientRect().top
        const at = (hold - top) / screen
        progress = (at - LEAD - BEAT) / REVEAL
        // (beats after the first share the first half of HOLD)
        const later = Math.max(1, (beats?.length ?? 1) - 1)
        const held = (at - LEAD - BEAT - REVEAL) / (HOLD / 2)
        after = Math.min(1, Math.max(0, held / 2))
        setBeat(at < LEAD ? -1 : held < 0 ? 0 : 1 + Math.min(later - 1, Math.floor(held * later)))
      } else {
        const top = el.getBoundingClientRect().top
        const start = innerHeight * REVEAL_FROM
        const begin = start - innerHeight * STILL
        const end = innerHeight * REVEAL_TO
        progress = (begin - top) / (begin - end)
        after = top < end - innerHeight * STILL ? 1 : 0
        const final = (beats?.length ?? 1) - 1
        setBeat(top > start ? -1 : progress < 1 ? 0 : final)
      }
      progress = Math.min(1, Math.max(0, progress))
      if (progress + after === last) return
      last = progress + after
      el.contentWindow?.postMessage(
        { type: 'ethdebug:reveal', on: progress > 0, progress, after },
        ORIGIN
      )
    }
    const schedule = () => (frame ||= requestAnimationFrame(tell))
    tell()
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    return () => {
      removeEventListener('scroll', schedule)
      removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [reveals, pinned, beats?.length, initial])

  // the panel is stuck while its sentinel is above the screen's top and
  // the figure is still on screen; it is told, to square its top corners
  const stuck = useRef(false)
  const tellStuck = useCallback(
    () =>
      panel.current?.contentWindow?.postMessage(
        { type: 'ethdebug:stuck', stuck: stuck.current },
        ORIGIN
      ),
    []
  )
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      stuck.current = !e.isIntersecting && e.boundingClientRect.top < 0
      tellStuck()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [initial, scene])
  const channel = useId().replace(/[^a-zA-Z0-9]/g, '')
  const size = declared ?? reported ?? (todo ? 'text' : 'wide')

  // (the figure's CSS: its reserved heights, and its pin)
  const id = `ethdebug-${channel}`
  const key = `${scene}${walkthrough ? '#walkthrough' : ''}`
  const css = scene
    ? layout(
        id,
        HEIGHTS[key],
        walkthrough ? HEIGHTS[`${scene}#panel`] : undefined,
        story.length > 0
      )
    : ''

  const onFigure = useCallback((data: Data, el: HTMLIFrameElement) => {
    if (data.columns === 1 || data.columns === 2) setReported(data.columns === 2 ? 'wide' : 'text')
    if (typeof data.row === 'number' && data.row > 0) setRow(data.row)
    if (typeof data.storageBottom === 'number') setStorageEnd(data.storageBottom)
    if (typeof data.height === 'number' && data.height > 0) setFrameTall(data.height)
    if (data.reveal === true) setReveals(true)
    // the figure asks the page to bring a point of it into view, below
    // the sticky panel (it can't scroll itself: it is as tall as its content)
    if (!AUTO_SCROLL) return
    if (data.type !== 'ethdebug:scroll-to' || typeof data.y !== 'number') return
    // only when the lit rows [y, bottom] are not in view below the panel
    // (where the panel is now: a read)
    const under = panel.current?.getBoundingClientRect().bottom ?? 0
    const frame = el.getBoundingClientRect().top
    const bottom = typeof data.bottom === 'number' ? data.bottom : data.y
    const seen = frame + data.y >= under + 8 && frame + bottom <= innerHeight - 8
    if (seen) return
    const top = frame + scrollY + data.y - under - 16
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    scrollTo({ top, behavior: still ? 'auto' : 'smooth' })
  }, [])
  const onPanel = useCallback(
    (data: Data) => {
      // (a panel that has just loaded learns whether it is stuck)
      if (data.type === 'ethdebug:height') tellStuck()
    },
    [tellStuck]
  )

  const hash = (more = '') => `scene=${scene}&theme=${initial}${more}`

  return (
    <figure className="my-12 [&+h2]:mt-16">
      {/* (with a walkthrough: the panel, at the text column's width, a
          sticky child in the flow of a plain box that holds it and the
          figure, so it sticks to the top of the screen while the figure is
          in view. The box ends `release` above the figure's end (the
          figure's own box overhangs it by that much, by margins: no
          measuring), so the panel lets go before the figure does and the
          figure's end shows below it (flow-root: the overhang shortens
          this box instead of collapsing through it). The sentinel just
          above the panel tells when it is stuck, so it can go flush.
          An annotated figure, pinned, holds still in the middle of the
          screen while the reader scrolls through RUNWAY screens' heights
          of room below it: its stage is sticky in a box of the stage and
          the room. Its CSS, from `layout`, decides all of this before any
          script runs, so the page's layout is final at first paint.) */}
      {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      {story.length > 0 && (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<style>.${id}-i[data-spoils] { opacity: 1; }</style>`,
          }}
        />
      )}
      <div
        className="flow-root [container-type:inline-size]"
        style={walkthrough && scene ? { marginBottom: release } : undefined}
      >
        {scene && walkthrough && (
          <>
            <div ref={sentinel} aria-hidden="true" />
            {/* (the panel at the text column's width, over the figure, which
                may be wider; while stuck it sits on a band of the page's own
                colour as wide as the figure, so the figure never shows at its
                sides) */}
            <div
              className={`sticky top-0 z-10 ml-[calc((100%_-_var(--w))/2)] w-[var(--w)] bg-ecru [--w:100%] dark:bg-anthracite ${WIDTH[size]}`}
            >
              <div className={`mx-auto w-[100cqw] ${id}-pc`}>
                <Frame
                  src={initial && `${DEMO}/embed-panel.html#${hash(`&channel=${channel}`)}`}
                  title={`ethdebug walkthrough: ${scene}`}
                  theme={theme ?? initial}
                  reserve={HEIGHTS[`${scene}#panel`] && `${id}-p`}
                  onMessage={onPanel}
                  frameRef={panel}
                />
              </div>
            </div>
          </>
        )}
        <div
          className={`${id} ml-[calc((100%_-_var(--w))/2)] w-[var(--w)] [--w:100%] ${WIDTH[size]}`}
          style={walkthrough && scene ? { marginBottom: `calc(-1 * ${release})` } : undefined}
        >
          <div ref={stage} className={`relative ${id}-s`}>
            {story.length > 0 && (
              // (not pinned, as on a phone: the first beat as an amber bubble
              // near the middle of the screen, the rest as its footnotes. They
              // take no room: a band over the figure, from a little way into
              // it to just before the end of its storage dump, holds them in
              // the middle of the screen while the figure scrolls under them;
              // then they scroll away with the page)
              <div
                className={`pointer-events-none absolute inset-x-0 top-11 z-10 ${id}-u`}
                style={{ height: Math.max(0, (storageEnd ?? (frameTall ?? 0) * 0.65) - 44 - 16) }}
              >
                <div className="sticky top-[30svh] mx-auto max-w-[34rem]">
                  {/* (the first beat is the bubble; the ones after it are its
                    footnotes, a drawer that slides out from under it in the
                    same colours, smaller: seen, but not the story) */}
                  <div
                    aria-hidden={beat < 0}
                    className="relative z-10 rounded-xl border-l-4 border-amber-500 bg-[#FBEFD9] px-4 py-3 shadow-sm transition-[opacity,transform,border-radius] duration-300 dark:border-amber-400 dark:bg-[#3A2F22]"
                    style={{
                      opacity: beat >= 0 ? 1 : 0,
                      transform: beat >= 0 ? 'none' : 'translateY(0.5rem)',
                      ...(beat >= 1
                        ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }
                        : {}),
                    }}
                  >
                    <p
                      className="my-0 text-center text-[16px] font-semibold leading-snug text-anthracite-700 dark:text-ecru-100"
                      style={{ textWrap: 'balance', whiteSpace: 'pre-line' }}
                    >
                      {story[0]}
                    </p>
                  </div>
                  {story.length > 1 && (
                    <div className="overflow-hidden rounded-b-xl">
                      <div
                        aria-hidden={beat < 1}
                        className="space-y-1 rounded-b-xl border-l-4 border-t border-amber-500 border-t-amber-500/30 bg-[#FBEFD9] px-4 pb-2.5 pt-2 shadow-sm transition-[opacity,transform] duration-300 dark:border-amber-400 dark:border-t-amber-400/30 dark:bg-[#3A2F22]"
                        style={{
                          opacity: beat >= 1 ? 1 : 0,
                          transform: beat >= 1 ? 'none' : 'translateY(-100%)',
                        }}
                      >
                        {story.slice(1).map((text, i) => (
                          <p
                            key={i}
                            className="my-0 text-center text-[13px] font-medium leading-snug text-anthracite-400 dark:text-ecru-300"
                            style={{ textWrap: 'balance', whiteSpace: 'pre-line' }}
                          >
                            {text}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div ref={box}>
              {!scene ? (
                <div className="grid h-60 place-items-center rounded border-2 border-dashed border-anthracite-100 text-anthracite-300 dark:border-anthracite-400 dark:text-ecru-600">
                  FIGURE TODO: {todo}
                </div>
              ) : (
                <Frame
                  src={
                    initial &&
                    `${DEMO}/embed.html#${hash(walkthrough ? `&panel=external&channel=${channel}` : '')}`
                  }
                  title={`ethdebug figure: ${scene}`}
                  theme={theme ?? initial}
                  reserve={HEIGHTS[key] && `${id}-f`}
                  onMessage={onFigure}
                  frameRef={figure}
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
                      spoils={story.length > 0}
                    />
                  }
                  // (a figure with a story loads at once, so it is ready by
                  // the time the reader scrolls into it)
                  eager={story.length > 0}
                />
              )}
            </div>
            {story.length > 0 && (
              // (pinned, each beat shows once the story reaches it and stays,
              // under the still figure, marked as the post's narration by an
              // amber rule; their room is kept from the start, so nothing
              // moves)
              <div className={`mt-6 space-y-3 ${id}-b`}>
                <div
                  aria-hidden="true"
                  className="mx-auto h-0.5 w-12 rounded bg-amber-500 transition-opacity duration-500"
                  style={{ opacity: beat >= 0 ? 1 : 0 }}
                />
                {story.map((text, i) => (
                  <p
                    key={i}
                    // (the beats after the first are its footnotes: smaller,
                    // quieter, right under it)
                    className={
                      i === 0
                        ? `${CAPTION} my-0 transition-opacity duration-500`
                        : 'mx-auto -mt-1 mb-0 max-w-[50rem] text-center text-sm leading-snug text-anthracite-300 transition-opacity duration-500 dark:text-ecru-400'
                    }
                    style={{
                      textWrap: 'balance',
                      whiteSpace: 'pre-line',
                      opacity: beat >= i ? 1 : 0,
                    }}
                  >
                    {text}
                  </p>
                ))}
              </div>
            )}
          </div>
          {story.length > 0 && <div ref={room} aria-hidden="true" className={`${id}-r`} />}
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
