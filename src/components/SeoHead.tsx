import { useEffect } from 'react'
import { SITE_URL as SITE } from '@/lib/seo'
import { breadcrumbJsonLd, type Crumb } from '@/lib/seo-routes'

const DEFAULT_IMAGE = `${SITE}/og-image.png`

export interface SeoHeadProps {
  title: string
  description: string
  /** Route path, used for canonical and og:url. */
  path: string
  image?: string
  noIndex?: boolean
  /** Trail after «Início» (BreadcrumbList); empty or absent = none, as on the home. */
  crumbs?: Crumb[]
}

/**
 * Per-page meta.
 *
 * Without it every route inherited the home's canonical, telling search engines
 * that /galeria and /privacidade are the same page as the root. Google runs
 * the JS; the static shells written at build time (vite.config.ts) carry the
 * same head for the fixed routes, so crawlers that do not run JS agree.
 */
export function SeoHead({ title, description, path, image, noIndex = false, crumbs }: SeoHeadProps) {
  const crumbsKey = JSON.stringify(crumbs ?? [])

  useEffect(() => {
    const url = `${SITE}${path.startsWith('/') ? path : `/${path}`}`
    const img = image || DEFAULT_IMAGE

    document.title = title

    setMeta('name', 'description', description)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    setLink('canonical', url)

    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', img)
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', img)
    setBreadcrumb(JSON.parse(crumbsKey) as Crumb[])
  }, [title, description, path, image, noIndex, crumbsKey])

  return null
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** The shells ship the same script (data-seo="breadcrumb"); keep it in step on client navigation. */
function setBreadcrumb(crumbs: Crumb[]) {
  let el = document.head.querySelector<HTMLScriptElement>('script[data-seo="breadcrumb"]')
  if (!crumbs.length) {
    el?.remove()
    return
  }
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.dataset.seo = 'breadcrumb'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(breadcrumbJsonLd(crumbs))
}
