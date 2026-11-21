/**
 * First-screen API calls started by public/boot.js while the bundle downloads
 * (home only: /promo and /events/active). The app's first call for each path
 * reuses that request instead of opening another one.
 */

declare global {
  interface Window {
    __geekpopBoot?: Record<string, Promise<unknown>>
  }
}

const taken = new Set<string>()

/** The boot request for `path` (pending or done), once; undefined → use the network. */
export function takeBootRequest<T>(path: string): Promise<T | null> | undefined {
  const boot = typeof window !== 'undefined' ? window.__geekpopBoot : undefined
  if (!boot || !(path in boot) || taken.has(path)) return undefined
  taken.add(path)
  return Promise.resolve(boot[path] as Promise<T | null>).catch(() => null)
}

/** Test helper. */
export function resetBootData(): void {
  taken.clear()
}
