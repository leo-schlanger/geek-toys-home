import { describe, it, expect } from 'vitest'
import appTsx from './App.tsx?raw'
import vercelJson from '../vercel.json'
import indexHtml from '../index.html?raw'
import { render } from './entry-server'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppProviders, AppRoutes } from './App'
import { preloadRoute } from './routes'
import { firstPaintScript, NATAL_STRIP_H, PROMO_DISMISS_PREFIX } from './lib/first-paint'
import { NATAL_BANNER_DISMISS_KEY, NATAL_WINDOW } from './components/seasonal/natal/isNatalActive'
import { NATAL_BANNER_H } from './components/seasonal/natal'
import {
  ROUTES_SEO,
  albumSeo,
  injectBody,
  renderAlbumFallbackHead,
  renderNotFoundHead,
  renderRouteHead,
  albumCrumbs,
} from './lib/seo-routes'

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
      expect(r.destination).toBe('/galeria/_album.html')
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

describe('first paint matches the mounted app (promo and Natal strips)', () => {
  const hint = { enabled: true, bannerEnabled: true, percent: 7, bannerText: 'No site é 7% mais barato' }

  it('the home body reserves the promo strip from the build hint', async () => {
    const html = await render('/', { 'promo-hint': hint })
    expect(html).toMatch(/data-promo-reserve="true" data-percent="7"/)
    expect(html).toContain('No site é 7% mais barato')
  })

  it('no hint (API down at build) → no reserve', async () => {
    expect(await render('/')).not.toContain('data-promo-reserve')
  })

  it('the inline script uses the same window, keys and height as the components', () => {
    const js = firstPaintScript()
    expect(js).toContain(String(Date.parse(NATAL_WINDOW.start)))
    expect(js).toContain(String(Date.parse(NATAL_WINDOW.end)))
    expect(js).toContain(JSON.stringify(NATAL_BANNER_DISMISS_KEY))
    expect(js).toContain(JSON.stringify(PROMO_DISMISS_PREFIX))
    expect(NATAL_STRIP_H).toBe(NATAL_BANNER_H)
    expect(js).toContain(JSON.stringify(NATAL_STRIP_H))
    expect(js).toContain('--promo-banner-h')
    expect(js).toContain('--natal-banner-h')
  })
})

describe('gallery albums (family: every album the build knows + one it does not)', () => {
  const albums = [
    { slug: 'loja', name: 'Loja GeekPop & Toys', description: 'Nossa loja', photos: [], coverUrl: null },
    { slug: 'noite', name: 'Noite K-pop', description: null, photos: [], coverUrl: null },
  ]

  it.each(albums)('$slug: body shows the album <h1>, head has its own canonical', async (album) => {
    const html = await render(`/galeria/${album.slug}`, { 'album-data': album })
    expect(html).toMatch(new RegExp(`<h1[^>]*>${album.name.replace(/&/g, '&amp;')}</h1>`))
    expect(html).not.toContain('Nossos eventos e a loja presencial')
    const head = renderRouteHead(indexHtml, albumSeo(album), albumCrumbs(album))
    expect(head).toContain(`<link rel="canonical" href="https://geekpoptoys.com.br/galeria/${album.slug}" />`)
  })

  it('an album the build does not know renders its loading state, not the index', async () => {
    const html = await render('/galeria/novo')
    expect(html).not.toContain('<h1')
    expect(html).toContain('animate-pulse')
  })

  it('the generic album shell has no canonical nor breadcrumb of /galeria', () => {
    const galleryShell = renderRouteHead(indexHtml, ROUTES_SEO.find((r) => r.path === '/galeria')!)
    const html = renderAlbumFallbackHead(galleryShell)
    expect(html).not.toContain('rel="canonical"')
    expect(html).not.toContain('og:url')
    expect(html).not.toContain('data-seo="breadcrumb"')
  })
})

describe('server 404 wins over the router (dist/404.html)', () => {
  it.each(['/Termos', '/termos', '/GALERIA', '/'])('%s with notFound renders NotFound', async (url) => {
    await preloadRoute(url, true)
    const html = renderToString(
      <AppProviders>
        <StaticRouter location={url}>
          <AppRoutes notFound />
        </StaticRouter>
      </AppProviders>
    )
    expect(html).toContain('Página não encontrada')
    expect(html).not.toContain('Termos de Uso')
  })
})
