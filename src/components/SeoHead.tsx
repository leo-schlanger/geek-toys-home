import { useEffect } from 'react'

const SITE = 'https://geeketoys.com.br'
const DEFAULT_IMAGE = `${SITE}/og-image.png`

export interface SeoHeadProps {
  title: string
  description: string
  /** Route path, used for canonical and og:url. */
  path: string
  image?: string
  noIndex?: boolean
}

/**
 * Per-page meta.
 *
 * Without it every route inherited the home's canonical, telling search engines
 * that /galeria and /privacidade are the same page as the root. Runs on the
 * Google executa JS, e os crawlers de rede social continuam lendo o HTML
 * static shell, which describes the home — acceptable, since what gets shared
 * from the institutional site is the root.
 */
export function SeoHead({ title, description, path, image, noIndex = false }: SeoHeadProps) {
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
  }, [title, description, path, image, noIndex])

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
