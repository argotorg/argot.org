// Measures the final heights of the ethdebug post's figures, so the page
// can reserve them at first paint (data/ethdebug-heights.json, read by
// components/EthdebugFigure.tsx). Run it when the figures change:
//
//   cd <a directory where Playwright is installed>
//   node <this repo>/scripts/ethdebug-heights.mjs
//
// It loads each figure the posts use (and a walkthrough's panel) in frames
// of each width in WIDTHS, as the post does, and records the height each
// frame reports once ready: { [key]: { [frame width]: height } }, where
// the key is the scene, `<scene>#walkthrough` for a figure whose panel is
// its own frame, and `<scene>#panel` for that panel. The figures come from
// NEXT_PUBLIC_ETHDEBUG_POST, as on the site (default: the published post).
import { createRequire } from 'node:module'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'data/ethdebug-heights.json')
const ORIGIN = process.env.NEXT_PUBLIC_ETHDEBUG_ORIGIN ?? 'https://ethdebug.github.io'
const POST = process.env.NEXT_PUBLIC_ETHDEBUG_POST ?? `${ORIGIN}/argot-post-2026-10`
const DEMO = `${POST}/demos/inspector`
// frame widths, in px: the text column on common phones (the screen less
// 16px gutters), phones on their side and small tablets, then tablets and
// desktops (less 32px gutters), up to the text column (1024) and `wide`
// (1216) at their widest; and the figures' own breakpoints (560, 660,
// 760), where their heights jump
const WIDTHS = [
  288, 328, 343, 358, 361, 380, 382, 396, 398, 480, 536, 560, 600, 635, 660, 704, 712, 756, 760,
  770, 860, 960, 1024, 1088, 1136, 1216,
]
// how long a frame's height must hold before it counts, and the most to
// wait for all of them
const SETTLE = 2500
const LIMIT = 120_000

const { chromium } = createRequire(join(process.cwd(), 'x.js'))('@playwright/test')

// the figures the posts use: { scene, walkthrough }
const figures = new Map()
const blog = join(ROOT, 'data/blog')
for (const file of readdirSync(blog, { recursive: true })) {
  if (!String(file).endsWith('.mdx')) continue
  const text = readFileSync(join(blog, String(file)), 'utf8')
  for (const [, attrs] of text.matchAll(/<EthdebugFigure\b([^>]*)>/g)) {
    const scene = attrs.match(/\bscene="([^"]+)"/)?.[1]
    if (!scene) continue
    const walkthrough = /\bwalkthrough\b/.test(attrs)
    figures.set(`${scene}${walkthrough ? '#walkthrough' : ''}`, { scene, walkthrough })
  }
}

// one page per figure, with a frame (or a figure and its panel) per width
async function measure(page, { scene, walkthrough }) {
  const frames = WIDTHS.flatMap((w, i) => {
    const hash = `scene=${scene}&theme=light`
    const channel = `c${i}`
    return walkthrough
      ? [
          { key: `${scene}#panel`, w, src: `${DEMO}/embed-panel.html#${hash}&channel=${channel}` },
          {
            key: `${scene}#walkthrough`,
            w,
            src: `${DEMO}/embed.html#${hash}&panel=external&channel=${channel}`,
          },
        ]
      : [{ key: scene, w, src: `${DEMO}/embed.html#${hash}` }]
  })
  return page.evaluate(
    ({ frames, origin, SETTLE, LIMIT }) =>
      new Promise((done) => {
        const seen = frames.map(() => undefined)
        let changed = Date.now()
        const els = frames.map(({ w, src }) => {
          const el = document.createElement('iframe')
          Object.assign(el.style, { width: `${w}px`, height: '480px', border: '0' })
          el.setAttribute('scrolling', 'no')
          el.src = src
          document.body.append(el)
          return el
        })
        addEventListener('message', (e) => {
          const i = els.findIndex((el) => el.contentWindow === e.source)
          const { type, height, ready } = e.data ?? {}
          const sized = type === 'ethdebug:height' || type === 'ethdebug:ready'
          if (i < 0 || e.origin !== origin || !sized) return
          if (typeof height !== 'number' || height <= 0 || ready === false) return
          const h = Math.ceil(height)
          if (seen[i] === h) return
          seen[i] = h
          // (as on the page: the frame takes the height it reports)
          els[i].style.height = `${h}px`
          changed = Date.now()
        })
        const start = Date.now()
        const check = setInterval(() => {
          const all = seen.every((h) => h !== undefined)
          if ((all && Date.now() - changed > SETTLE) || Date.now() - start > LIMIT) {
            clearInterval(check)
            done(frames.map(({ key, w }, i) => [key, w, seen[i]]))
          }
        }, 250)
      }),
    { frames, origin: new URL(DEMO).origin, SETTLE, LIMIT }
  )
}

const browser = await chromium.launch()
const out = {}
await Promise.all(
  [...figures.values()].map(async (figure) => {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
    for (const [key, w, h] of await measure(page, figure)) {
      if (h === undefined) console.warn(`no height: ${key} at ${w}px`)
      else (out[key] ??= {})[w] = h
    }
    await page.close()
  })
)
await browser.close()
const sorted = Object.fromEntries(
  Object.keys(out)
    .sort()
    .map((k) => [k, out[k]])
)
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n')
console.log(`wrote ${OUT}: ${Object.keys(sorted).join(', ')}`)
