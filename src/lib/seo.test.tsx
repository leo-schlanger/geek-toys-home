import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SITE_URL, photoAlt } from './seo'
import { SeoHead } from '@/components/SeoHead'
import { EMAIL, STORE_PHONES } from '@/data/contacts'
import { COMPANY } from './company'
import indexHtml from '../../index.html?raw'
import sitemapXml from '../../public/sitemap.xml?raw'
import robotsTxt from '../../public/robots.txt?raw'

// geeketoys.com.br is legacy and only redirects here; a canonical on a host
// that redirects points search engines at a URL that never serves the page.
const LEGACY = /https?:\/\/(www\.)?geeketoys\.com\.br|www\.geekpoptoys/

describe('canonical domain', () => {
  it('is geekpoptoys.com.br, without www', () => {
    expect(SITE_URL).toBe('https://geekpoptoys.com.br')
  })

  it('index.html: canonical, og and twitter use the main domain', () => {
    const html = indexHtml
    expect(html).toContain('<link rel="canonical" href="https://geekpoptoys.com.br/" />')
    expect(html).toContain('<meta property="og:url" content="https://geekpoptoys.com.br/" />')
    expect(html).toContain('<meta property="og:image" content="https://geekpoptoys.com.br/og-image.png" />')
    expect(html).not.toMatch(LEGACY)
  })

  it('sitemap and robots use the main domain', () => {
    const sitemap = sitemapXml
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    expect(locs).toEqual(
      ['/', '/links', '/galeria', '/termos', '/privacidade'].map((p) => `${SITE_URL}${p}`)
    )
    expect(robotsTxt).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`)
  })

  it.each(['/', '/links', '/galeria', '/termos', '/privacidade'])('SeoHead on %s', (path) => {
    render(<SeoHead title="t" description="d" path={path} />)
    const url = `${SITE_URL}${path}`
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute('href', url)
    expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute('content', url)
    expect(document.head.querySelector('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${SITE_URL}/og-image.png`
    )
  })
})

describe('JSON-LD', () => {
  const html = indexHtml
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => JSON.parse(m[1])
  )
  const graph = blocks.flatMap((b) => b['@graph'] ?? [b])
  const byType = (t: string) => graph.find((n) => n['@type'] === t)

  it('has Organization, Store and WebSite linked by @id on the main domain', () => {
    const org = byType('Organization')
    const store = byType('Store')
    const site = byType('WebSite')
    expect(org['@id']).toBe(`${SITE_URL}/#organization`)
    expect(store['@id']).toBe(`${SITE_URL}/#store`)
    expect(store.parentOrganization['@id']).toBe(org['@id'])
    expect(site.publisher['@id']).toBe(org['@id'])
    for (const node of [org, store, site]) expect(node.url).toBe(`${SITE_URL}/`)
  })

  it('matches the business data the site shows', () => {
    const store = byType('Store')
    const org = byType('Organization')
    // Source of truth: the store's Google Business Profile (Leo, 06/11/2026).
    const phone = '+55-21-98546-4666'
    expect(STORE_PHONES.some((p) => p.e164 === '5521985464666')).toBe(true)
    expect(store.telephone).toBe(phone)
    expect(org.contactPoint[0].telephone).toBe(phone)
    expect(store.geo).toEqual({ '@type': 'GeoCoordinates', latitude: -22.9652592, longitude: -43.1800191 })
    expect(indexHtml).toContain('<meta name="geo.position" content="-22.9652592;-43.1800191" />')
    expect(store.openingHoursSpecification).toEqual([
      expect.objectContaining({ dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '19:00' }),
      expect.objectContaining({ dayOfWeek: 'Saturday', opens: '09:00', closes: '16:00' }),
    ])
    expect(org.legalName).toBe(COMPANY.legalName)
    expect(org.taxID).toBe(COMPANY.cnpj)
    expect(store.email).toBe(EMAIL)
    expect(org.email).toBe(COMPANY.email)
    expect(store.address).toMatchObject({ postalCode: '22011-001', addressRegion: 'RJ' })
    expect(store.address.streetAddress).toContain('Barata Ribeiro, 181')
    expect(org.sameAs).toContain('https://www.instagram.com/geeketoys/')
  })
})

describe('photoAlt', () => {
  it('uses the caption, or album and position', () => {
    expect(photoAlt('K-pop Night', '  Fila do photocard  ', 0)).toBe('Fila do photocard')
    expect(photoAlt('K-pop Night', null, 2)).toBe('K-pop Night na GeekPop & Toys, foto 3')
  })
})
