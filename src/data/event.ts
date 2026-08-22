/**
 * Tipos e fallback do evento em cartaz.
 *
 * A fonte de verdade é o banco da loja (`GET /events/active`), editado na aba
 * **Eventos** do admin — antes disto o mesmo evento vivia hardcoded aqui, na
 * loja e na API, e trocar de evento era deploy em dois repos.
 *
 * `FALLBACK_EVENT` cobre só o primeiro paint (e a API fora do ar): editá-lo
 * **não** muda o que o site mostra. Use `useActiveEvent()` nos componentes.
 *
 * Fotos do evento vão para a galeria geral (`#galeria`), não para cá.
 * Detalhes: docs/EVENTS.md
 */

export type EventStatus = 'draft' | 'published' | 'archived'

export type EventConfig = {
  /** Id estável — chave do localStorage do banner e âncora das seções. */
  id: string
  slug: string
  /** Só `published` aparece no site. */
  status: EventStatus
  title: string
  /** Subtítulo curto do banner e do bloco. */
  shortTitle: string
  /**
   * Uma linha. Deliberadamente curto: o banner é `fixed` e come o topo do
   * celular. A 390px cada linha custa ~31px, e uma versão de 85 caracteres
   * quebrava em três linhas — um terço da primeira dobra.
   */
  bannerText: string
  /** Flyer enviado pelo admin. `null` = só texto. */
  bannerImageUrl: string | null
  /** ISO datetime; exibido formatado em pt-BR. */
  startsAt: string
  endsAt: string | null
  location: {
    name: string
    address: string
    mapsUrl: string | null
  }
  description: string[]
  highlights: string[]
  memberPerk: string | null
  ticketReservation: {
    enabled: boolean
    priceBRL: number | null
    currencyLabel: string
    /** `null` = sem teto (o servidor ainda barra pedidos absurdos). */
    maxPerReservation: number | null
    whatsappNumber: string
    notes: string | null
  }
  /** Centavos — o que o servidor cobra. `priceBRL` é a vitrine. */
  priceCents: number | null
}

/**
 * Espelha a linha semeada pela migration 029 da API.
 * Só aparece enquanto `/events/active` não responde.
 */
export const FALLBACK_EVENT: EventConfig = {
  id: 'kpop-night-2026-09-06',
  slug: 'kpop-night',
  status: 'published',
  title: 'Photocard Trading + Dança Livre de K-pop',
  shortTitle: 'Photocard Trading',
  bannerText: '🎉 Photocard Trading + Dança Livre · domingo 20/set, 14h–18h · Entrada R$ 20',
  bannerImageUrl: null,
  startsAt: '2026-09-20T14:00:00-03:00',
  endsAt: '2026-09-20T18:00:00-03:00',
  location: {
    name: 'Mar Palace Copacabana Hotel',
    address: 'Avenida Nossa Senhora de Copacabana, 552 — Copacabana, Rio de Janeiro — RJ',
    mapsUrl:
      'https://maps.google.com/?q=Mar+Palace+Copacabana+Hotel,+Avenida+Nossa+Senhora+de+Copacabana,+552,+Copacabana,+Rio+de+Janeiro',
  },
  description: [
    'Um dia inteiro no Mar Palace Copacabana Hotel para trocar photocards, dançar e celebrar o K-pop. Troque, dance e faça amizades — todos os fãs reunidos em um dia incrível.',
    'Entrada: R$ 20 por pessoa, com lanches grátis. Criança de colo e criança com deficiência (PCD) não pagam. Membros do Clube GeekPop & Toys têm 50% de desconto (R$ 10) — apresente a carteirinha digital ou o CPF na porta.',
  ],
  highlights: [
    'Domingo, 20 de setembro · 14h às 18h',
    'Mar Palace Copacabana Hotel — novo local!',
    'Photocard trading + dança livre de K-pop',
    'Lanches grátis',
    'Entrada R$ 20 por pessoa',
    'Criança de colo e criança PCD: entrada gratuita',
  ],
  memberPerk:
    'Membros do Clube: 50% de desconto na entrada (R$ 10). Criança de colo e PCD: isentos.',
  ticketReservation: {
    enabled: true,
    priceBRL: 20,
    currencyLabel: 'R$',
    maxPerReservation: null,
    // WhatsApp da loja (atendentes) — (11) 91466-2881
    whatsappNumber: '5511914662881',
    notes:
      'Entrada R$ 20/pessoa (membros do Clube: R$ 10). Criança de colo e criança com deficiência não pagam. Cada pessoa recebe um ingresso nominal com QR Code próprio, liberado assim que a equipe confirmar o pagamento.',
  },
  priceCents: 2000,
}

/** Rascunho e arquivado não aparecem no site. */
export function isEventVisible(event: EventConfig | null | undefined): boolean {
  return event?.status === 'published'
}

export function formatEventDateRange(
  startsAt: string,
  endsAt?: string | null,
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
