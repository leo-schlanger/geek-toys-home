/**
 * Active event on the institutional site.
 *
 * To update:
 * 1. Edit this file with the date, venue, copy and price.
 * 2. Coloque as fotos em `public/eventos/<slug>/` e liste os nomes em `photos`.
 * 3. `enabled: false` hides the banner and sections.
 * 4. After the event: set `ticketReservation.enabled: false` and fill `photos`.
 *
 * Detalhes: docs/EVENTS.md
 */

export type EventPhoto = {
  /** Nome do arquivo em public/eventos/<slug>/ */
  file: string
  /** Legenda opcional (ex.: "Grupo A — mesa 3") */
  caption?: string
  /** Accessible alt text. */
  alt?: string
}

export type EventConfig = {
  /** Stable id, used by the banner's localStorage key and anchors. */
  id: string
  /** Pasta em public/eventos/{slug}/ */
  slug: string
  /** Toggles the banner and event sections. */
  enabled: boolean
  title: string
  /** Short subtitle for the banner and the block's hero. */
  shortTitle: string
  /** Top banner text, one line. */
  bannerText: string
  /** ISO datetime; displayed formatted in pt-BR. */
  startsAt: string
  endsAt?: string
  location: {
    name: string
    address: string
    mapsUrl?: string
  }
  description: string[]
  highlights: string[]
  /** e.g. "free entry for club members" */
  memberPerk?: string
  ticketReservation: {
    enabled: boolean
    /** Unit price in BRL; null means free or to be arranged. */
    priceBRL: number | null
    currencyLabel?: string
    /**
     * Teto por reserva. `null` = sem teto — ficou 6 até 21/08/2026, quando uma
     * família bateu no limite. Mantenha igual ao clube-geek-toys/src/data/event.ts.
     */
    maxPerReservation: number | null
    whatsappNumber: string
    /** Extra instructions below the form. */
    notes?: string
  }
  photos: EventPhoto[]
  /** Secondary banner CTA: an anchor or a URL. */
  ctaPrimary: { label: string; href: string }
  ctaSecondary?: { label: string; href: string }
}

/**
 * Evento ativo — 6 de setembro de 2026 (domingo), 14h–18h.
 * Fotos: Laura envia depois → public/eventos/kpop-night/
 */
export const ACTIVE_EVENT: EventConfig = {
  id: 'kpop-night-2026-09-06',
  slug: 'kpop-night',
  enabled: true,
  title: 'GeekPop Night — Encontro K-pop & Collectibles',
  shortTitle: 'GeekPop Night',
  /**
   * Deliberately short: the banner is `fixed` and eats the top of a phone
   * screen. At 390px each line costs ~31px, and the previous 85-character
   * version wrapped to three lines and 111px — a third of the first fold.
   */
  bannerText: '🎉 GeekPop Night · domingo 6/set, 14h–18h · Ingresso R$ 20',
  startsAt: '2026-09-06T14:00:00-03:00',
  endsAt: '2026-09-06T18:00:00-03:00',
  location: {
    name: 'Copacabana Mar Hotel',
    address:
      'Rua Ministro Viveiros de Castro, 115 — Copacabana, Rio de Janeiro — RJ',
    mapsUrl:
      'https://maps.google.com/?q=Copacabana+Mar+Hotel,+Rua+Ministro+Viveiros+de+Castro,+115+Copacabana+Rio+de+Janeiro',
  },
  description: [
    'Um encontro especial no Copacabana Mar Hotel para fãs de K-pop, colecionáveis e cultura pop. Música ambiente, ambiente temático, lançamentos e muita interação com a equipe GeekPop.',
    'Ingresso: R$ 20 por pessoa. Criança de colo e criança com deficiência (PCD) não pagam. Membros do Clube GeekPop & Toys têm entrada gratuita nos eventos participantes — apresente a carteirinha digital ou o CPF na porta.',
  ],
  highlights: [
    'Domingo, 6 de setembro · 14h às 18h',
    'Ingresso R$ 20 por pessoa',
    'Criança de colo e criança PCD: entrada gratuita',
    'Ambiente temático, playlist K-pop e espaço para fotos',
    'Fotos na galeria do site (geeketoys.com.br#galeria)',
  ],
  memberPerk:
    'Membros do Clube: entrada gratuita (eventos participantes). Criança de colo e PCD: isentos.',
  ticketReservation: {
    enabled: true,
    priceBRL: 20,
    currencyLabel: 'R$',
    maxPerReservation: null,
    // WhatsApp da loja (atendentes) — (11) 91466-2881
    whatsappNumber: '5511914662881',
    notes:
      'Ingresso R$ 20/pessoa. Criança de colo e criança com deficiência não pagam — informe na observação. A reserva é enviada pelo WhatsApp da loja para confirmação. Pagamento e retirada conforme orientação da equipe.',
  },
  // Event photos go into the general gallery, not a download section.
  photos: [],
  ctaPrimary: { label: 'Reservar ingresso', href: '#ingressos' },
  ctaSecondary: { label: 'Ver evento', href: '#evento' },
}

export function isEventVisible(event: EventConfig = ACTIVE_EVENT): boolean {
  return event.enabled
}

export function formatEventDateRange(
  startsAt: string,
  endsAt?: string,
  locale = 'pt-BR'
): string {
  const start = new Date(startsAt)
  const end = endsAt ? new Date(endsAt) : null

  const dateFmt = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const timeFmt = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })

  const datePart = dateFmt.format(start)
  const startTime = timeFmt.format(start)
  if (!end) return `${datePart} · ${startTime}`
  return `${datePart} · ${startTime} – ${timeFmt.format(end)}`
}

export function photoPublicUrl(event: EventConfig, file: string): string {
  return `/eventos/${event.slug}/${encodeURIComponent(file)}`
}

export function buildReservationWhatsAppUrl(params: {
  event: EventConfig
  name: string
  phone: string
  email: string
  quantity: number
  notes?: string
}): string {
  const { event, name, phone, email, quantity, notes } = params
  const price =
    event.ticketReservation.priceBRL == null
      ? 'a combinar / cortesia'
      : `${event.ticketReservation.currencyLabel ?? 'R$'} ${event.ticketReservation.priceBRL
          .toFixed(2)
          .replace('.', ',')}`

  const total =
    event.ticketReservation.priceBRL == null
      ? '—'
      : `${event.ticketReservation.currencyLabel ?? 'R$'} ${(
          event.ticketReservation.priceBRL * quantity
        )
          .toFixed(2)
          .replace('.', ',')}`

  const lines = [
    `Olá! Quero *reservar ingresso(s)* para o evento:`,
    `*${event.title}*`,
    ``,
    `👤 Nome: ${name}`,
    `📱 Telefone: ${phone}`,
    `✉️ E-mail: ${email}`,
    `🎫 Quantidade: ${quantity}`,
    `💵 Valor unitário: ${price}`,
    `💰 Total estimado: ${total}`,
  ]
  if (notes?.trim()) {
    lines.push(``, `📝 Observações: ${notes.trim()}`)
  }
  lines.push(``, `Aguardo confirmação da reserva. Obrigado(a)!`)

  const text = encodeURIComponent(lines.join('\n'))
  return `https://wa.me/${event.ticketReservation.whatsappNumber}?text=${text}`
}
