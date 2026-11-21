import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { resetBootData } from './boot-data'
import { fetchShopPromo } from './shop-api'
import bootJs from '../../public/boot.js?raw'
import indexHtml from '../../index.html?raw'

const PROMO = { enabled: true, percent: 5, bannerEnabled: true, bannerText: 'x' }

describe('boot.js requests', () => {
  let fetchSpy: ReturnType<typeof vi.fn>
  beforeEach(() => {
    resetBootData()
    fetchSpy = vi.fn(async () => new Response(JSON.stringify({ ...PROMO, percent: 7 })))
    vi.stubGlobal('fetch', fetchSpy)
  })
  afterEach(() => {
    delete window.__geekpopBoot
    vi.unstubAllGlobals()
  })

  it('the first call reuses the boot request (even still pending); the next one goes to the network', async () => {
    let resolve!: (v: unknown) => void
    window.__geekpopBoot = { '/promo': new Promise((r) => (resolve = r)) }
    const first = fetchShopPromo()
    resolve(PROMO)
    expect((await first).percent).toBe(5)
    expect(fetchSpy).not.toHaveBeenCalled()
    expect((await fetchShopPromo()).percent).toBe(7)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('a failed boot request falls back to the network', async () => {
    window.__geekpopBoot = { '/promo': Promise.resolve(null) }
    expect((await fetchShopPromo()).percent).toBe(7)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('boot.js runs only on the home, before the bundle, and the app never waits for it', () => {
    expect(bootJs).toContain("location.pathname !== '/'")
    for (const p of ['/promo', '/events/active']) expect(bootJs).toContain(`'${p}'`)
    const at = indexHtml.indexOf('<script src="/boot.js"></script>')
    expect(at).toBeGreaterThan(0)
    expect(at).toBeLessThan(indexHtml.indexOf('src="/src/main.tsx"'))
  })
})
