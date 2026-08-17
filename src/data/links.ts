/**
 * Bio-link page (/links) — the single destination for the Instagram bio.
 *
 * Everything shown on that page comes from here, so changing what the bio
 * points at is one edit in one file. Order matters: it is the order on screen,
 * and the first two entries are what most visitors tap.
 *
 * `highlight` promotes an entry to the big card at the top. Keep at most one or
 * two — the point of the page is a short, scannable list, and every extra link
 * costs attention from the ones that sell.
 */

import { primaryWhatsAppUrl } from './contacts'
import { ACTIVE_EVENT, formatEventDateRange, isEventVisible } from './event'

export type LinkIcon =
  | 'shop'
  | 'club'
  | 'whatsapp'
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'radio'
  | 'gallery'
  | 'event'
  | 'location'

export interface BioLink {
  id: string
  label: string
  description?: string
  href: string
  icon: LinkIcon
  /** Renders as the large featured card. */
  highlight?: boolean
  /** Internal routes stay in the SPA; everything else opens in a new tab. */
  internal?: boolean
}

/** Links that never change with a campaign. */
const STATIC_LINKS: BioLink[] = [
  {
    id: 'shop',
    label: 'Loja online',
    description: 'Photocards, álbuns e colecionáveis — envio para todo o Brasil',
    href: 'https://shop.geekpoptoys.com.br',
    icon: 'shop',
    highlight: true,
  },
  {
    id: 'whatsapp',
    label: 'Falar no WhatsApp',
    description: 'Dúvidas, reservas e encomendas',
    href: primaryWhatsAppUrl('Olá! Vim pelo link da bio 👋'),
    icon: 'whatsapp',
    highlight: true,
  },
  {
    id: 'club',
    label: 'Clube GeekPop & Toys',
    description: '15% de desconto em qualquer produto',
    href: 'https://club.geeketoys.com.br/assinar',
    icon: 'club',
  },
  {
    id: 'radio',
    label: 'Rádio GeekPop',
    description: 'K-pop e cultura pop tocando agora',
    href: 'https://radio.geeketoys.com.br',
    icon: 'radio',
  },
  {
    id: 'gallery',
    label: 'Galeria de fotos',
    description: 'Eventos e bastidores da loja',
    href: '/galeria',
    icon: 'gallery',
    internal: true,
  },
  {
    id: 'location',
    label: 'Como chegar na loja',
    description: 'Rua Barata Ribeiro, 181 — Copacabana, RJ',
    href: 'https://maps.google.com/?q=Rua+Barata+Ribeiro,+181,+Copacabana,+Rio+de+Janeiro',
    icon: 'location',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/geeketoys/',
    icon: 'instagram',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@geeketoys',
    icon: 'tiktok',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/geeketoyscolection/',
    icon: 'facebook',
  },
]

/**
 * Full list, with the active event pinned to the top when there is one.
 *
 * Reuses `isEventVisible` so the event disappears from the bio on the same date
 * it disappears from the site — a dead event link is worse than no link.
 */
export function getBioLinks(): BioLink[] {
  if (!isEventVisible()) return STATIC_LINKS

  const event: BioLink = {
    id: 'event',
    label: ACTIVE_EVENT.shortTitle,
    description: formatEventDateRange(ACTIVE_EVENT.startsAt, ACTIVE_EVENT.endsAt),
    href: 'https://shop.geekpoptoys.com.br/evento',
    icon: 'event',
    highlight: true,
  }
  return [event, ...STATIC_LINKS]
}
