/**
 * Bio-link page (/links) — the single destination for the Instagram bio.
 *
 * Everything shown on that page comes from here, so changing what the bio
 * points at is one edit in one file. Order matters: it is the order on screen,
 * and the first entries are what most visitors tap.
 *
 * The list is deliberately short. Rádio, galeria e Facebook saíram em 19/08 a
 * pedido da loja: eram destinos que quase ninguém tocava e empurravam para
 * baixo os que vendem. Entrar no grupo do WhatsApp virou o primeiro link —
 * é o único que transforma uma visita em audiência recorrente, e a página
 * inteira existe para essa conversão.
 *
 * `highlight` promotes an entry to the big card at the top. Keep at most one or
 * two — the point of the page is a short, scannable list, and every extra link
 * costs attention from the ones that sell.
 */

import { primaryWhatsAppUrl } from './contacts'
import { FALLBACK_EVENT, formatEventDateRange, isEventVisible, type EventConfig } from './event'

export type LinkIcon =
  | 'shop'
  | 'club'
  | 'whatsapp'
  | 'whatsapp-group'
  | 'instagram'
  | 'tiktok'
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
    id: 'whatsapp-group',
    label: 'Entrar no grupo do WhatsApp',
    description: 'Novidades, chegadas e avisos em primeira mão',
    href: 'https://chat.whatsapp.com/DeqhPV5NOWS3YsFxImCaK6?s=sw&p=a&mlu=4',
    icon: 'whatsapp-group',
    highlight: true,
  },
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
]

/**
 * Full list, with the active event pinned right below the WhatsApp group.
 *
 * Reuses `isEventVisible` so the event disappears from the bio on the same date
 * it disappears from the site — a dead event link is worse than no link.
 *
 * The group stays first even during a campaign: the event sells one afternoon,
 * the group is who the loja can reach on every afternoon after it.
 */
export function getBioLinks(active: EventConfig = FALLBACK_EVENT): BioLink[] {
  if (!isEventVisible(active)) return STATIC_LINKS

  const event: BioLink = {
    id: 'event',
    label: active.shortTitle,
    description: formatEventDateRange(active.startsAt, active.endsAt),
    href: 'https://shop.geekpoptoys.com.br/evento',
    icon: 'event',
    highlight: true,
  }
  const [group, ...rest] = STATIC_LINKS
  return [group, event, ...rest]
}
