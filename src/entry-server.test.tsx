import { describe, it, expect } from 'vitest'
import appTsx from './App.tsx?raw'
import vercelJson from '../vercel.json'
import indexHtml from '../index.html?raw'
import { render } from './entry-server'
import { ROUTES_SEO, injectBody, renderNotFoundHead } from './lib/seo-routes'

// Every <Route path> of App.tsx, comments excluded.
const appRoutes = [...appTsx.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').matchAll(/<Route path="([^"]+)"/g)].map(
  (m) => m[1]
)

describe('prerendered body (family: every fixed route + the 404)', () => {
  it.each(ROUTES_SEO.map((r) => r.path))('%s renders its page with an <h1>, not the 404', async (path) => {
    const html = await render(path)
    expect(html).toContain('<h1')
    expect(html).not.toContain('Página não encontrada')
  })

  it.each(['/__pagina-inexistente__', '/evento', '/termos/x', '/galeria/a/b'])('%s renders NotFound', async (path) => {
    expect(await render(path)).toContain('Página não encontrada')
  })

  it('a gallery album route renders the gallery, not the 404', async () => {
    expect(appRoutes).toContain('/galeria/:slug')
    expect(await render('/galeria/um-album')).not.toContain('Página não encontrada')
  })
})

describe('real 404 on Vercel (vercel.json)', () => {
  it('has no SPA catch-all: unknown paths fall to dist/404.html', () => {
    const rewrites = (vercelJson as { rewrites?: { source: string; destination: string }[] }).rewrites ?? []
    for (const r of rewrites) {
      expect(r.source).toMatch(/^\/galeria\/:slug\/?$/)
      expect(r.destination).toBe('/galeria/index.html')
    }
  })

  it('every dynamic route of App.tsx has a rewrite to its shell', () => {
    const dynamic = appRoutes.filter((p) => p.includes(':'))
    const sources = ((vercelJson as { rewrites?: { source: string }[] }).rewrites ?? []).map((r) => r.source)
    for (const p of dynamic) expect(sources).toContain(p)
  })
})

describe('404 shell', () => {
  it('is noindex, without canonical nor og:url', () => {
    const html = renderNotFoundHead(indexHtml)
    expect(html).toContain('<meta name="robots" content="noindex, nofollow" />')
    expect(html).not.toContain('rel="canonical"')
    expect(html).not.toContain('og:url')
    expect(html).toContain('<title>Página não encontrada | GeekPop &amp; Toys</title>')
  })

  it('injectBody fills the empty #root and marks the route', () => {
    const out = injectBody(indexHtml, '/404', '<main>x</main>')
    expect(out).toContain('<div id="root" data-route="/404"><main>x</main></div>')
    expect(() => injectBody(out, '/404', 'y')).toThrow(/no empty #root/)
  })
})
