'use client'

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useTheme } from 'next-themes'

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
const REVEAL_TO = -0.8
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
// a figure's caption, and its beats (an annotated figure's caption, told in
// parts)
const CAPTION =
  'mx-auto max-w-[50rem] text-center text-lg font-medium leading-snug text-anthracite-500 dark:text-ecru-200'
// where the post's figures come from (to try unpublished figure changes,
// set these to a local copy of the post's site, in .env.local)
const ORIGIN = process.env.NEXT_PUBLIC_ETHDEBUG_ORIGIN ?? 'https://ethdebug.github.io'
const POST = process.env.NEXT_PUBLIC_ETHDEBUG_POST ?? `${ORIGIN}/argot-post-2026-10`
const DEMO = `${POST}/demos/inspector`
// a frame's height before the manifest says better
const DEFAULT_HEIGHT = 480
// a frame that reports no height by then shows a note instead
const TIMEOUT = 10_000

type Size = 'text' | 'wide' | 'full'
type Theme = 'light' | 'dark'
type Data = { type?: string; [k: string]: unknown }

// The frame's width, centred on the text column. Below `md` each size is
// the text column (the page's own gutter); from `md`, `wide` takes up to
// 96px more on each side and `full` the page less its 32px gutters.
const WIDTH: Record<Size, string> = {
  text: '',
  wide: 'md:[--w:min(100%_+_192px,100vw_-_64px)]',
  full: 'md:[--w:calc(100vw_-_64px)]',
}

// The embed's final heights, measured when it is built:
// { [scene]: { [frame width in px]: height } }. Fetched once per page.
let manifest: Promise<Record<string, Record<string, number>>> | undefined
const heights = () =>
  (manifest ??= fetch(`${DEMO}/heights.json`)
    .then((r) => (r.ok ? r.json() : {}))
    .catch(() => ({})))

// the height measured at the width nearest to this frame's
function nearest(table: Record<string, number> = {}, width: number) {
  const widths = Object.keys(table).map(Number).filter(Boolean)
  if (!widths.length) return undefined
  const w = widths.reduce((a, b) => (Math.abs(b - width) < Math.abs(a - width) ? b : a))
  return table[String(w)]
}

// Keeps the reader's place across a reload. The figures take their full
// height only after the page loads, so the browser's own restore lands in
// the wrong place; instead remember the first block of the post on screen
// (and how far down the screen it was) and hold the page there while the
// figures settle, until the reader scrolls.
let placeKept = false
function keepPlace() {
  if (placeKept) return
  placeKept = true
  const key = `ethdebug-place:${location.pathname}`
  const blocks = () => [...document.querySelectorAll('main :is(h2, p, figure)')]
  addEventListener('pagehide', () => {
    const all = blocks()
    const i = all.findIndex((el) => el.getBoundingClientRect().bottom > 0)
    try {
      if (i >= 0)
        sessionStorage.setItem(key, JSON.stringify([i, all[i].getBoundingClientRect().top]))
    } catch {
      // (no storage: no place kept)
    }
  })
  let saved: [number, number] | undefined
  try {
    saved = JSON.parse(sessionStorage.getItem(key) ?? 'null') ?? undefined
  } catch {
    // (no storage: no place to keep)
  }
  if (!saved) return
  const [i, top] = saved
  history.scrollRestoration = 'manual'
  let held = true
  const until = Date.now() + 10_000
  const release = () => (held = false)
  for (const type of ['wheel', 'touchstart', 'keydown', 'mousedown'])
    addEventListener(type, release, { once: true, passive: true })
  const hold = () => {
    if (!held || Date.now() > until) return
    const el = blocks()[i]
    if (el) {
      const y = el.getBoundingClientRect().top + scrollY - top
      if (Math.abs(y - scrollY) > 1) scrollTo(0, y)
    }
    requestAnimationFrame(hold)
  }
  hold()
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

// A frame of the post's inspector. It keeps its reserved height, under a
// quiet placeholder, until the embed reports its content ready (a height
// with `ready: false` is a skeleton's, and is ignored); it then takes the
// content's height. It tells the embed the site's theme, on load and on
// each change. With no height in TIMEOUT after load (say, a 404 page),
// the placeholder says the figure is unavailable.
function Frame({
  src,
  title,
  theme,
  reserve = DEFAULT_HEIGHT,
  onMessage,
  frameRef,
}: {
  src: string
  title: string
  theme: Theme
  reserve?: number
  onMessage?: (data: Data, el: HTMLIFrameElement) => void
  frameRef?: React.MutableRefObject<HTMLIFrameElement | null>
}) {
  const own = useRef<HTMLIFrameElement>(null)
  const frame = frameRef ?? own
  const [height, setHeight] = useState<number>()
  const [late, setLate] = useState(false)

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

  const tell = useCallback(
    () => frame.current?.contentWindow?.postMessage({ type: 'ethdebug:theme', theme }, ORIGIN),
    [theme]
  )
  useEffect(tell, [tell])

  const timer = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => () => clearTimeout(timer.current), [])
  const onLoad = () => {
    tell()
    timer.current ??= setTimeout(() => setLate(true), TIMEOUT)
  }

  return (
    <div className="relative" style={{ height: height ?? reserve }}>
      {!height && reserve > 0 && <Placeholder late={late} />}
      <iframe
        ref={frame}
        src={src}
        title={title}
        loading="lazy"
        scrolling="no"
        onLoad={onLoad}
        className="block h-full w-full border-0"
        style={{ colorScheme: theme, opacity: height ? 1 : 0, outline: 'none' }}
      />
    </div>
  )
}

// A figure from the ethdebug post's inspector, with a caption. Its `size`
// is `text` (the text column), `wide`, or `full`; without one it follows
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
  useEffect(keepPlace, [])
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
  const release = row ? `${RELEASE_ROWS * row}px` : FALLBACK
  const [reserve, setReserve] = useState<number>()
  const box = useRef<HTMLDivElement>(null)
  const sentinel = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLIFrameElement>(null)
  const figure = useRef<HTMLIFrameElement>(null)
  // (a figure with beats is an annotated one; it says so itself too)
  const [reveals, setReveals] = useState(!!beats?.length)

  const runway = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [tall, setTall] = useState<number>()
  const [screen, setScreen] = useState<number>()
  // which beat shows (-1: none yet)
  const [beat, setBeat] = useState(-1)
  // (the beat the phone's bubble says: it follows `beat` a moment late,
  // once the last one has faded out)
  const [told, setTold] = useState(-1)
  useEffect(() => {
    if (beat === told) return
    if (beat < 0 || told < 0) return setTold(beat)
    const t = setTimeout(() => setTold(beat), 160)
    return () => clearTimeout(t)
  }, [beat, told])
  useEffect(() => {
    const el = stage.current
    if (!reveals || !el) return
    const measure = () => {
      setTall(el.offsetHeight)
      setScreen(innerHeight)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      removeEventListener('resize', measure)
    }
  }, [reveals])
  const pinned = !!(reveals && tall && screen && tall <= screen * FITS)
  const story = beats ?? []
  const hold = pinned ? (screen! - tall!) / 2 : 0

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
      if (pinned && runway.current) {
        // how far into the story, in screens
        const at = (hold - runway.current.getBoundingClientRect().top) / innerHeight
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
        // (and the bubble goes before the figure's end reaches it)
        const gone = el.getBoundingClientRect().bottom < innerHeight * 0.3
        setBeat(top > start || gone ? -1 : progress < 1 ? 0 : final)
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
  }, [reveals, pinned, hold, beats?.length, initial])

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

  useEffect(() => {
    if (!scene) return
    heights().then((m) => setReserve(nearest(m[scene], box.current?.offsetWidth ?? 0)))
  }, [scene, size])

  const onFigure = useCallback((data: Data, el: HTMLIFrameElement) => {
    if (data.columns === 1 || data.columns === 2) setReported(data.columns === 2 ? 'wide' : 'text')
    if (typeof data.row === 'number' && data.row > 0) setRow(data.row)
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
          above the panel tells when it is stuck, so it can go flush.) */}
      <div
        ref={runway}
        className="flow-root"
        style={
          walkthrough && scene && initial
            ? { marginBottom: release }
            : pinned
              ? { height: tall! + screen! * RUNWAY }
              : undefined
        }
      >
        {scene && initial && walkthrough && (
          <>
            <div ref={sentinel} aria-hidden="true" />
            <div className="sticky top-0 z-10">
              <Frame
                src={`${DEMO}/embed-panel.html#${hash(`&channel=${channel}`)}`}
                title={`ethdebug walkthrough: ${scene}`}
                theme={theme ?? initial}
                reserve={0}
                onMessage={onPanel}
                frameRef={panel}
              />
            </div>
          </>
        )}
        <div ref={stage} style={pinned ? { position: 'sticky', top: hold } : undefined}>
          {story.length > 0 && !pinned && (
            // (not pinned, as on a phone: one amber bubble over the top of
            // the figure, where the reader is looking. It takes no room: it
            // starts a little way into the figure, so the top of the dump
            // shows above it, then sticks to the screen's top while the
            // figure scrolls under it, and leaves with the figure's end. It
            // shows the newest beat: the old one fades out before the new one
            // fades in, so the two never show at once)
            <div className="sticky top-3 z-10 -mb-11 mt-11 h-0">
              <div
                aria-hidden={beat < 0}
                className="mx-auto max-w-[34rem] rounded-xl border-l-4 border-amber-500 bg-[#FBEFD9] px-4 py-2.5 shadow-lg transition-[opacity,transform] duration-300 dark:border-amber-400 dark:bg-[#3A2F22]"
                style={{
                  opacity: beat >= 0 ? 1 : 0,
                  transform: beat >= 0 ? 'none' : 'translateY(-0.5rem)',
                }}
              >
                <p
                  className="my-0 text-center text-[15px] font-semibold leading-snug text-anthracite-700 transition-opacity duration-150 dark:text-ecru-100"
                  style={{
                    textWrap: 'balance',
                    whiteSpace: 'pre-line',
                    opacity: told === beat ? 1 : 0,
                  }}
                >
                  {story[Math.max(0, told)]}
                </p>
              </div>
            </div>
          )}
          <div
            ref={box}
            className={`ml-[calc((100%_-_var(--w))/2)] w-[var(--w)] [--w:100%] ${WIDTH[size]}`}
            style={
              walkthrough && scene && initial
                ? { marginBottom: `calc(-1 * ${release})` }
                : undefined
            }
          >
            {!scene ? (
              <div className="grid h-60 place-items-center rounded border-2 border-dashed border-anthracite-100 text-anthracite-300 dark:border-anthracite-400 dark:text-ecru-600">
                FIGURE TODO: {todo}
              </div>
            ) : !initial ? (
              <div className="relative" style={{ height: reserve ?? DEFAULT_HEIGHT }}>
                <Placeholder />
              </div>
            ) : (
              <Frame
                src={`${DEMO}/embed.html#${hash(walkthrough ? `&panel=external&channel=${channel}` : '')}`}
                title={`ethdebug figure: ${scene}`}
                theme={theme ?? initial}
                reserve={reserve}
                onMessage={onFigure}
                frameRef={figure}
              />
            )}
          </div>
          {story.length > 0 && pinned && (
            // (pinned, each beat shows once the story reaches it and stays,
            // under the still figure, marked as the post's narration by an
            // amber rule; their room is kept from the start, so nothing
            // moves)
            <div className="mt-6 space-y-3">
              <div
                aria-hidden="true"
                className="mx-auto h-0.5 w-12 rounded bg-amber-500 transition-opacity duration-500"
                style={{ opacity: beat >= 0 ? 1 : 0 }}
              />
              {story.map((text, i) => (
                <p
                  key={i}
                  className={`${CAPTION} my-0 transition-opacity duration-500`}
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
      </div>
      {children && (
        <figcaption className={`${CAPTION} mb-0 mt-4`} style={{ textWrap: 'balance' }}>
          {children}
        </figcaption>
      )}
    </figure>
  )
}
