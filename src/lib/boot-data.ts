/**
 * First-screen API answers requested by public/boot.js while the bundle
 * downloads (home only: /promo and /events/active). Same idea as the shop
 * (clube-geek-toys src/lib/boot-data.ts).
 */

declare global {
  interface Window {
    __geekpopBoot?: Record<string, Promise<unknown>>
  }
}

const settled = new Map<string, unknown>()
const taken = new Set<string>()
let watching: Promise<void> | null = null

function boot(): Record<string, Promise<unknown>> | undefined {
  return typeof window !== 'undefined' ? window.__geekpopBoot : undefined
}

function watch(): Promise<void> {
  if (watching) return watching
  const b = boot()
  watching = b
    ? Promise.all(
        Object.entries(b).map(([path, p]) =>
          Promise.resolve(p)
            .then((data) => {
              if (data != null) settled.set(path, data)
            })
            .catch(() => undefined)
        )
      ).then(() => undefined)
    : Promise.resolve()
  return watching
}

export function hasBootData(): boolean {
  return boot() != null
}

/** Resolves when every boot answer is in, or after `capMs`, whichever first. */
export function bootDataReady(capMs = 400): Promise<void> {
  return Promise.race([watch(), new Promise<void>((r) => setTimeout(r, capMs))])
}

/** True when the boot answer for `path` already arrived with data. */
export function hasBootAnswer(path: string): boolean {
  return settled.has(path) && !taken.has(path)
}

/** The boot answer for `path`, once: later calls go to the network. */
export function takeBootData<T>(path: string): T | undefined {
  if (!hasBootAnswer(path)) return undefined
  taken.add(path)
  return settled.get(path) as T
}

/** Test helper. */
export function resetBootData(): void {
  settled.clear()
  taken.clear()
  watching = null
}
