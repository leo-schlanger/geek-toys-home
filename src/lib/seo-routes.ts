/**
 * Head of every fixed route: one source for the pages (SeoHead), the static
 * shells written at build time (vite.config.ts) and the sitemap.
 *
 * No `@/` imports here: vite.config.ts loads this file before aliases exist.
 */
import { SITE_URL } from './seo'

export interface RouteSeo {
  path: string
  title: string
  description: string
  /** Last crumb of the BreadcrumbList; the home has none. */
  crumb?: string
  /** Files whose last commit dates the page (sitemap lastmod). */
  sources: string[]
  changefreq: 'weekly' | 'monthly' | 'yearly'
  priority: string
}

export const HOME_SEO: RouteSeo = {
  path: '/',
  title: 'Loja de K-pop e Geek no Rio de Janeiro | GeekPop & Toys',
  description:
    'Loja de K-pop e geek em Copacabana, Rio de Janeiro: photocards, álbuns, merch, anime e colecionáveis. Compre online com envio para todo o Brasil.',
  sources: ['index.html', 'src/pages/Index.tsx', 'src/components'],
  changefreq: 'weekly',
  priority: '1.0',
}

export const LINKS_SEO: RouteSeo = {
  path: '/links',
  title: 'Links da GeekPop & Toys | Loja de K-pop em Copacabana',
  description:
    'Loja online, Clube GeekPop com 10% de desconto, grupo do WhatsApp e redes sociais da GeekPop & Toys, loja de K-pop e geek em Copacabana, RJ.',
  crumb: 'Links',
  sources: ['src/pages/Links.tsx', 'src/data/links.ts'],
  changefreq: 'monthly',
  priority: '0.8',
}

export const GALLERY_SEO: RouteSeo = {
  path: '/galeria',
  title: 'Galeria: eventos de K-pop em Copacabana | GeekPop & Toys',
  description:
    'Fotos dos eventos de K-pop e da loja física da GeekPop & Toys em Copacabana, Rio de Janeiro. Veja os álbuns e baixe as suas fotos.',
  crumb: 'Galeria',
  sources: ['src/pages/Gallery.tsx'],
  changefreq: 'weekly',
  priority: '0.7',
}

export const TERMS_SEO: RouteSeo = {
  path: '/termos',
  title: 'Termos de Uso | GeekPop & Toys',
  description:
    'Termos de uso do site, da loja online e dos serviços da GeekPop & Toys, loja de K-pop e geek em Copacabana, Rio de Janeiro.',
  crumb: 'Termos de Uso',
  sources: ['src/pages/TermsOfUse.tsx'],
  changefreq: 'yearly',
  priority: '0.3',
}

export const PRIVACY_SEO: RouteSeo = {
  path: '/privacidade',
  title: 'Política de Privacidade (LGPD) | GeekPop & Toys',
  description:
    'Como a GeekPop & Toys coleta, usa e protege os seus dados pessoais no site e na loja online, conforme a LGPD.',
  crumb: 'Política de Privacidade',
  sources: ['src/pages/PrivacyPolicy.tsx'],
  changefreq: 'yearly',
  priority: '0.3',
}

export const ROUTES_SEO: RouteSeo[] = [HOME_SEO, LINKS_SEO, GALLERY_SEO, TERMS_SEO, PRIVACY_SEO]

export function routeUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

export interface Crumb {
  name: string
  path: string
}

export function breadcrumbJsonLd(crumbs: Crumb[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Início', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: routeUrl(c.path),
    })),
  }
}

export function routeCrumbs(route: RouteSeo): Crumb[] {
  return route.crumb ? [{ name: route.crumb, path: route.path }] : []
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Safe inside <script>: JSON.stringify does not escape "</". */
const jsonForScript = (v: unknown) => JSON.stringify(v).replace(/</g, '\\u003c')

/**
 * The built index.html with the head of `route`: title, description,
 * canonical, og/twitter and the breadcrumb. Throws when a tag is missing, so
 * a change to index.html cannot silently ship shells with the home's head.
 */
export function renderRouteHead(html: string, route: RouteSeo, crumbs: Crumb[] = routeCrumbs(route)): string {
  const url = routeUrl(route.path)
  const swaps: [RegExp, string][] = [
    [/<title>[^<]*<\/title>/, `<title>${esc(route.title)}</title>`],
    [/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(route.description)}" />`],
    [/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`],
    [/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(route.title)}" />`],
    [/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(route.description)}" />`],
    [/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`],
    [/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(route.title)}" />`],
    [/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(route.description)}" />`],
  ]
  let out = html
  for (const [re, tag] of swaps) {
    if (!re.test(out)) throw new Error(`renderRouteHead(${route.path}): missing ${re}`)
    // Function replacer: "$" in the text is not a pattern.
    out = out.replace(re, () => tag)
  }
  if (crumbs.length) {
    const ld = `<script type="application/ld+json" data-seo="breadcrumb">${jsonForScript(breadcrumbJsonLd(crumbs))}</script>`
    out = out.replace('</head>', () => `    ${ld}\n  </head>`)
  }
  return out
}

/** Gallery album as the page and the build describe it (Gallery.tsx, vite.config.ts). */
export interface AlbumLike {
  slug: string
  name: string
  description?: string | null
}

export function albumSeo(album: AlbumLike): RouteSeo {
  return {
    path: `/galeria/${album.slug}`,
    title: `${album.name} — Galeria GeekPop & Toys`,
    description: album.description || `Fotos de ${album.name} na GeekPop & Toys, loja de K-pop em Copacabana.`,
    sources: [],
    changefreq: 'weekly',
    priority: '0.6',
  }
}

export function albumCrumbs(album: AlbumLike): Crumb[] {
  return [
    { name: 'Galeria', path: '/galeria' },
    { name: album.name, path: `/galeria/${album.slug}` },
  ]
}

/**
 * Generic album shell (albums created after the build): the gallery's head
 * without canonical nor og:url, which would claim /galeria; the page sets
 * them once the album loads.
 */
export function renderAlbumFallbackHead(html: string): string {
  const swaps: [RegExp, string][] = [
    [/\s*<link rel="canonical" href="[^"]*" \/>/, ''],
    [/\s*<meta property="og:url" content="[^"]*" \/>/, ''],
    [/\s*<script type="application\/ld\+json" data-seo="breadcrumb">[\s\S]*?<\/script>/, ''],
  ]
  let out = html
  for (const [re, tag] of swaps) {
    if (!re.test(out)) throw new Error(`renderAlbumFallbackHead: missing ${re}`)
    out = out.replace(re, () => tag)
  }
  return out
}

export const NOT_FOUND_TITLE = 'Página não encontrada | GeekPop & Toys'

/**
 * Head of dist/404.html (served with status 404): noindex, and no canonical
 * nor og:url, which would claim the home's address for every unknown path.
 */
export function renderNotFoundHead(html: string): string {
  const swaps: [RegExp, string][] = [
    [/<title>[^<]*<\/title>/, `<title>${esc(NOT_FOUND_TITLE)}</title>`],
    [/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="noindex, nofollow" />'],
    [/\s*<link rel="canonical" href="[^"]*" \/>/, ''],
    [/\s*<meta property="og:url" content="[^"]*" \/>/, ''],
  ]
  let out = html
  for (const [re, tag] of swaps) {
    if (!re.test(out)) throw new Error(`renderNotFoundHead: missing ${re}`)
    out = out.replace(re, () => tag)
  }
  return out
}

/** Puts the prerendered body of `route` into the shell's empty #root. */
export function injectBody(html: string, route: string, body: string): string {
  const empty = '<div id="root"></div>'
  if (!html.includes(empty)) throw new Error(`injectBody(${route}): no empty #root`)
  return html.replace(empty, () => `<div id="root" data-route="${esc(route)}">${body}</div>`)
}

/** Sitemap of the fixed routes; a route without a known date has no lastmod. */
export function buildSitemap(lastmod: Record<string, string | undefined>, extraPaths: string[] = []): string {
  const extra = extraPaths.map((path) => ({ path, changefreq: 'monthly', priority: '0.5' }))
  const urls = [...ROUTES_SEO, ...extra].map((r) => {
    const mod = lastmod[r.path]
    return [
      '  <url>',
      `    <loc>${routeUrl(r.path)}</loc>`,
      ...(mod ? [`    <lastmod>${mod}</lastmod>`] : []),
      `    <changefreq>${r.changefreq}</changefreq>`,
      `    <priority>${r.priority}</priority>`,
      '  </url>',
    ].join('\n')
  })
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- Generated at build time from src/lib/seo-routes.ts. The shop catalogue has its own',
    '     sitemap: https://shop.geekpoptoys.com.br/sitemap-products.xml -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

/** SeoHead props of a fixed route. */
export function seoProps(route: RouteSeo) {
  return { title: route.title, description: route.description, path: route.path, crumbs: routeCrumbs(route) }
}
