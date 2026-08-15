import { useEffect } from 'react'

const SITE = 'https://geeketoys.com.br'
const DEFAULT_IMAGE = `${SITE}/og-image.png`

export interface SeoHeadProps {
  title: string
  description: string
  /** Caminho da rota, para canonical e og:url. */
  path: string
  image?: string
  noIndex?: boolean
}

/**
 * Meta por página.
 *
 * Sem isto toda rota herdava o canonical da home, o que declara ao buscador que
 * /galeria e /privacidade são a mesma página que a raiz. Roda no cliente: o
 * Google executa JS, e os crawlers de rede social continuam lendo o HTML
 * estático (que descreve a home — aceitável, já que o que se compartilha do
 * site institucional é a raiz).
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
