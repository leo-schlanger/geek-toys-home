import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SITE_URL, photoAlt } from './seo'
import { SeoHead } from '@/components/SeoHead'
import { EMAIL, PRIMARY_WHATSAPP } from '@/data/contacts'
import { COMPANY } from './company'
import indexHtml from '../../index.html?raw'
import sitemapXml from '../../public/sitemap.xml?raw'
import robotsTxt from '../../public/robots.txt?raw'

// The apex answers with a redirect to www; a canonical on the apex points
// search engines at a URL that never serves the page.
const APEX = /https?:\/\/geeketoys\.com\.br/

describe('canonical domain', () => {
  it('is www', () => {
    expect(SITE_URL).toBe('https://www.geeketoys.com.br')
  })

  it('index.html: canonical, og and twitter use www', () => {
    const html = indexHtml
    expect(html).toContain('<link rel="canonical" href="https://www.geeketoys.com.br/" />')
    expect(html).toContain('<meta property="og:url" content="https://www.geeketoys.com.br/" />')
    expect(html).toContain('<meta property="og:image" content="https://www.geeketoys.com.br/og-image.png" />')
    expect(html).not.toMatch(APEX)
  })

  it('sitemap and robots use www', () => {
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

  it('has Organization, Store and WebSite linked by @id on www', () => {
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
    const phone = `+${PRIMARY_WHATSAPP.e164.slice(0, 2)}-${PRIMARY_WHATSAPP.e164.slice(2, 4)}-${PRIMARY_WHATSAPP.e164.slice(4, 9)}-${PRIMARY_WHATSAPP.e164.slice(9)}`
    expect(store.telephone).toBe(phone)
    expect(org.contactPoint[0].telephone).toBe(phone)
    expect(org.legalName).toBe(COMPANY.legalName)
    expect(org.taxID).toBe(COMPANY.cnpj)
    expect(store.email).toBe(EMAIL)
    expect(org.email).toBe(COMPANY.email)
    expect(store.address).toMatchObject({ postalCode: '22011-001', addressRegion: 'RJ' })
    expect(store.address.streetAddress).toContain('Barata Ribeiro, 181')
    expect(org.sameAs).toContain('https://www.instagram.com/geeketoys/')
    expect(store.openingHoursSpecification).toHaveLength(2)
  })
})

describe('photoAlt', () => {
  it('uses the caption, or album and position', () => {
    expect(photoAlt('K-pop Night', '  Fila do photocard  ', 0)).toBe('Fila do photocard')
    expect(photoAlt('K-pop Night', null, 2)).toBe('K-pop Night na GeekPop & Toys, foto 3')
  })
})
