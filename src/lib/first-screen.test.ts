import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { QueryClient } from '@tanstack/react-query'
import { primeFirstScreen } from './first-screen'
import { resetBootData } from './boot-data'
import { fetchShopPromo } from './shop-api'
import { SHOP_PROMO_QUERY_KEY } from '@/hooks/useShopPromo'
import { ACTIVE_EVENT_QUERY_KEY } from '@/hooks/useActiveEvent'
import bootJs from '../../public/boot.js?raw'
import indexHtml from '../../index.html?raw'

const PROMO = { enabled: true, percent: 5, bannerEnabled: true, bannerText: 'No site é 5% mais barato' }

describe('first screen from boot.js', () => {
  let fetchSpy: ReturnType<typeof vi.fn>
  beforeEach(() => {
    resetBootData()
    fetchSpy = vi.fn(() => Promise.reject(new Error('network not expected')))
    vi.stubGlobal('fetch', fetchSpy)
  })
  afterEach(() => {
    delete window.__geekpopBoot
    vi.unstubAllGlobals()
  })

  it('seeds promo and event from the boot answers without touching the network', async () => {
    window.__geekpopBoot = { '/promo': Promise.resolve(PROMO), '/events/active': Promise.resolve({ event: null }) }
    const client = new QueryClient()
    await primeFirstScreen(client)
    expect(client.getQueryData(SHOP_PROMO_QUERY_KEY)).toEqual(PROMO)
    expect(client.getQueryData(ACTIVE_EVENT_QUERY_KEY)).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('a slow or failed answer is left to the query: render is not held past the cap', async () => {
    window.__geekpopBoot = { '/promo': new Promise(() => {}), '/events/active': Promise.resolve(null) }
    const client = new QueryClient()
    const t0 = Date.now()
    await primeFirstScreen(client, 50)
    expect(Date.now() - t0).toBeLessThan(400)
    expect(client.getQueryData(SHOP_PROMO_QUERY_KEY)).toBeUndefined()
    expect(client.getQueryData(ACTIVE_EVENT_QUERY_KEY)).toBeUndefined()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('no boot (other routes): returns at once', async () => {
    const client = new QueryClient()
    await primeFirstScreen(client)
    expect(client.getQueryData(SHOP_PROMO_QUERY_KEY)).toBeUndefined()
  })

  it('a boot answer is used once; the next call goes to the network', async () => {
    window.__geekpopBoot = { '/promo': Promise.resolve(PROMO) }
    await primeFirstScreen(new QueryClient())
    fetchSpy.mockResolvedValueOnce(new Response(JSON.stringify({ ...PROMO, percent: 7 })))
    expect((await fetchShopPromo()).percent).toBe(7)
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('boot.js runs only on the home, and loads before the bundle', () => {
    expect(bootJs).toContain("location.pathname !== '/'")
    for (const p of ['/promo', '/events/active']) expect(bootJs).toContain(`'${p}'`)
    expect(indexHtml.indexOf('<script src="/boot.js"></script>')).toBeGreaterThan(0)
    expect(indexHtml.indexOf('<script src="/boot.js"></script>')).toBeLessThan(indexHtml.indexOf('src="/src/main.tsx"'))
  })
})
