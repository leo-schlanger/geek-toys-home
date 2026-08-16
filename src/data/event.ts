/**
 * Configuração do evento ativo no site institucional.
 *
 * Como atualizar (Laura / operação):
 * 1. Edite este arquivo com data, local, texto e preço.
 * 2. Coloque as fotos em `public/eventos/<slug>/` e liste os nomes em `photos`.
 * 3. `enabled: false` esconde banner + seções (sem deploy de lógica extra).
 * 4. Após o evento: deixe `ticketReservation.enabled: false` e `photos` com as fotos finais.
 *
 * Detalhes: docs/EVENTS.md
 */

export type EventPhoto = {
  /** Nome do arquivo em public/eventos/<slug>/ */
  file: string
  /** Legenda opcional (ex.: "Grupo A — mesa 3") */
  caption?: string
  /** Texto alternativo acessível */
  alt?: string
}

export type EventConfig = {
  /** Identificador estável (localStorage do banner, âncoras) */
  id: string
  /** Pasta em public/eventos/{slug}/ */
  slug: string
  /** Liga/desliga banner + seções de evento no site */
  enabled: boolean
  title: string
  /** Subtítulo curto pro banner e hero do bloco */
  shortTitle: string
  /** Texto do banner no topo (uma linha) */
  bannerText: string
  /** ISO date da data/hora do evento (exibição formatada em pt-BR) */
  startsAt: string
  endsAt?: string
  location: {
    name: string
    address: string
    mapsUrl?: string
  }
  description: string[]
  highlights: string[]
  /** Ex.: "Entrada liberada para membros do Clube" */
  memberPerk?: string
  ticketReservation: {
    enabled: boolean
    /** Preço unitário em BRL; null = gratuito / a combinar */
    priceBRL: number | null
    currencyLabel?: string
    maxPerReservation: number
    whatsappNumber: string
    /** Instruções extras abaixo do formulário */
    notes?: string
  }
  photos: EventPhoto[]
  /** CTA secundário no banner (âncora ou URL) */
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
   * Curto de propósito: o banner é `fixed` e come o topo da tela no celular.
   * A 390px, cada linha custa ~31px. A versão longa anterior (85 caracteres)
   * quebrava em 3 linhas e ocupava 111px — um terço da primeira dobra.
   * "reserve já" saiu porque o botão "Reservar ingresso" está ao lado.
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
    maxPerReservation: 6,
    // WhatsApp da loja (atendentes) — (11) 91466-2881
    whatsappNumber: '5511914662881',
    notes:
      'Ingresso R$ 20/pessoa. Criança de colo e criança com deficiência não pagam — informe na observação. A reserva é enviada pelo WhatsApp da loja para confirmação. Pagamento e retirada conforme orientação da equipe.',
  },
  // Fotos da Laura ficam na galeria geral (GallerySection), não em seção de download.
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
