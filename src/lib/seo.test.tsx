import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SITE_URL, photoAlt } from './seo'
import { SeoHead } from '@/components/SeoHead'
import { EMAIL, STORE_PHONES } from '@/data/contacts'
import { COMPANY } from './company'
import indexHtml from '../../index.html?raw'
import robotsTxt from '../../public/robots.txt?raw'
import appTsx from '../App.tsx?raw'
import { ROUTES_SEO, HOME_SEO, buildSitemap, renderRouteHead, routeUrl, breadcrumbJsonLd } from './seo-routes'

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
    const locs = [...buildSitemap({}).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
    expect(locs).toEqual(['/', '/links', '/galeria', '/termos', '/privacidade'].map(routeUrl))
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

// Every fixed <Route path> of App.tsx (dynamic and catch-all excluded): a new
// route that is not in ROUTES_SEO would ship with the home's head and canonical.
const appRoutes = [...appTsx.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').matchAll(/<Route path="([^"]+)"/g)]
  .map((m) => m[1])
  .filter((p) => p !== '*' && !p.includes(':'))

describe('per-route head (family: every fixed route of App.tsx)', () => {
  it('ROUTES_SEO lists exactly the fixed routes of App.tsx', () => {
    expect(appRoutes.length).toBeGreaterThanOrEqual(5)
    expect(ROUTES_SEO.map((r) => r.path).sort()).toEqual([...appRoutes].sort())
  })

  it('titles and descriptions are unique and within search-snippet length', () => {
    const titles = ROUTES_SEO.map((r) => r.title)
    const descs = ROUTES_SEO.map((r) => r.description)
    expect(new Set(titles).size).toBe(titles.length)
    expect(new Set(descs).size).toBe(descs.length)
    for (const r of ROUTES_SEO) {
      expect(r.title.length, r.title).toBeLessThanOrEqual(70)
      expect(r.title).toContain('GeekPop & Toys')
      expect(r.description.length, r.description).toBeGreaterThanOrEqual(70)
      expect(r.description.length, r.description).toBeLessThanOrEqual(160)
    }
  })

  it('index.html carries the home head from ROUTES_SEO', () => {
    const amp = (t: string) => t.replace(/&/g, '&amp;')
    expect(indexHtml).toContain(`<title>${amp(HOME_SEO.title)}</title>`)
    expect(indexHtml).toContain(`<meta name="description" content="${HOME_SEO.description}" />`)
    expect(indexHtml).toContain(`<meta property="og:title" content="${amp(HOME_SEO.title)}" />`)
    expect(indexHtml).not.toContain('fonts.googleapis.com')
  })

  it.each(ROUTES_SEO.filter((r) => r.path !== '/'))('shell of $path has its own head and breadcrumb', (route) => {
    const html = renderRouteHead(indexHtml, route)
    const url = routeUrl(route.path)
    const doc = new DOMParser().parseFromString(html, 'text/html')
    expect(doc.title).toBe(route.title)
    expect(doc.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(doc.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(url)
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(route.description)
    expect(doc.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(url)
    expect(doc.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(route.title)
    expect(doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content')).toBe(route.description)
    const ld = JSON.parse(doc.querySelector('script[data-seo="breadcrumb"]')!.textContent!)
    expect(ld.itemListElement.map((i: { item: string }) => i.item)).toEqual([`${SITE_URL}/`, url])
    // The org/store graph stays in every shell.
    expect(html).toContain('"@id": "https://geekpoptoys.com.br/#store"')
  })

  it('renderRouteHead fails loudly when index.html loses a tag', () => {
    expect(() => renderRouteHead(indexHtml.replace(/<link rel="canonical"[^>]*>/, ''), ROUTES_SEO[1])).toThrow(/canonical/)
  })

  it('sitemap: lastmod only when known', () => {
    const xml = buildSitemap({ '/links': '2026-11-21T10:00:00-03:00' })
    expect(xml).toContain('<loc>https://geekpoptoys.com.br/links</loc>\n    <lastmod>2026-11-21T10:00:00-03:00</lastmod>')
    expect(xml.match(/<lastmod>/g)).toHaveLength(1)
  })

  it('SeoHead writes the breadcrumb, and removes it on a route without one', () => {
    const crumbs = [{ name: 'Galeria', path: '/galeria' }]
    const { rerender } = render(<SeoHead title="t" description="d" path="/galeria" crumbs={crumbs} />)
    const el = () => document.head.querySelectorAll('script[data-seo="breadcrumb"]')
    expect(el()).toHaveLength(1)
    expect(JSON.parse(el()[0].textContent!)).toEqual(breadcrumbJsonLd(crumbs))
    rerender(<SeoHead title="t" description="d" path="/" />)
    expect(el()).toHaveLength(0)
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
