import { describe, it, expect } from 'vitest'
import { SHOP_URL, CLUB_URL } from './shop-api'
import indexHtml from '../../index.html?raw'

// Leo, 21/11/2026: navigation goes to the geekpoptoys hosts. The legacy
// geeketoys.com.br stays only for API calls (api.*), the radio (radio.*),
// e-mail addresses and free text such as WhatsApp greetings.
const sources = import.meta.glob(['../**/*.{ts,tsx}', '!../**/*.test.{ts,tsx}'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

/** URL to a geeketoys host that is not the API or the radio. */
const LEGACY_NAV = /https?:\/\/(?!api\.|radio\.)([a-z0-9-]+\.)?geeketoys\.com\.br/g

describe('navigation hosts (family: every source file + index.html)', () => {
  it('scans the whole app', () => {
    expect(Object.keys(sources).length).toBeGreaterThan(40)
  })

  it('SHOP_URL and CLUB_URL are the geekpoptoys hosts', () => {
    expect(SHOP_URL).toBe('https://shop.geekpoptoys.com.br')
    expect(CLUB_URL).toBe('https://club.geekpoptoys.com.br')
  })

  it('no link to a legacy geeketoys host outside api.* and radio.*', () => {
    const hits = Object.entries({ ...sources, 'index.html': indexHtml }).flatMap(([file, src]) =>
      [...src.matchAll(LEGACY_NAV)].map((m) => `${file}: ${m[0]}`)
    )
    expect(hits).toEqual([])
  })

  it('the API and the radio stay on geeketoys', () => {
    expect(sources['./shop-api.ts']).toContain("'https://api.geeketoys.com.br'")
  })
})
