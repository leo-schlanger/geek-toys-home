/**
 * Lightweight client for the shop API, used by the institutional home to
 * display products.
 */

import { FALLBACK_EVENT, type EventConfig } from '@/data/event'

const API_BASE = 'https://api.geeketoys.com.br'
export const SHOP_URL = 'https://shop.geeketoys.com.br'
export const CLUB_URL = 'https://club.geeketoys.com.br'

export type ShopProduct = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compareAtPrice: number | null
  categoryId: string | null
  categoryName: string | null
  images: string[]
  stock: number
  featured: boolean
  createdAt?: string
}

export type ShopCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  /** Chave do ícone escolhido no admin — ver `src/lib/category-icons.ts`. */
  icon: string | null
  active: boolean
  sortOrder: number
}

type ProductListResponse = {
  products: ShopProduct[]
  total: number
  page: number
  limit: number
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

export async function fetchProducts(params: {
  limit?: number
  featured?: boolean
  category?: string
  search?: string
} = {}): Promise<ProductListResponse> {
  const qs = new URLSearchParams()
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.featured) qs.set('featured', 'true')
  if (params.category) qs.set('category', params.category)
  if (params.search) qs.set('search', params.search)
  const q = qs.toString()
  const data = await getJson<ProductListResponse>(`/products${q ? `?${q}` : ''}`)
  // Extra guard against seed products (API also filters; keep home resilient)
  const products = (data.products ?? []).filter(
    (p) => !p.name.toLowerCase().startsWith('checkup')
  )
  return { ...data, products, total: products.length }
}

export async function fetchCategories(): Promise<ShopCategory[]> {
  const cats = await getJson<ShopCategory[]>('/products/categories')
  // Extra guard: hide QA/seed categories if API ever returns them
  return cats.filter(
    (c) =>
      c.active &&
      !c.slug.toLowerCase().startsWith('checkup') &&
      !c.name.toLowerCase().startsWith('checkup')
  )
}

export function productUrl(slug: string): string {
  return `${SHOP_URL}/produto/${encodeURIComponent(slug)}`
}

export function categoryUrl(slug: string): string {
  return `${SHOP_URL}/categoria/${encodeURIComponent(slug)}`
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function isOnSale(p: ShopProduct): boolean {
  return p.compareAtPrice != null && p.compareAtPrice > p.price
}


// ─── Promoção do canal online ────────────────────────────────────────────────

/** Espelha `ShopPromo` da loja (`GET /promo`). */
export type ShopPromo = {
  enabled: boolean
  /** Pontos percentuais, 0–90. */
  percent: number
  bannerEnabled: boolean
  bannerText: string
}

export const PROMO_OFF: ShopPromo = {
  enabled: false,
  percent: 0,
  bannerEnabled: false,
  bannerText: '',
}

/**
 * A promoção do site, configurada no admin da loja.
 *
 * Cai para "sem promoção" em vez de estourar: o institucional é uma vitrine, e
 * ficar sem o aviso é muito melhor do que a página não carregar. Quem cobra é a
 * loja, que refaz o preço do pedido do zero.
 */
export async function fetchShopPromo(): Promise<ShopPromo> {
  try {
    return await getJson<ShopPromo>('/promo')
  } catch {
    return PROMO_OFF
  }
}

/**
 * O preço de tabela reescrito como preço do site.
 *
 * O institucional mostra os mesmos produtos da loja; se ele anunciar o preço
 * cheio enquanto a loja cobra 5% menos, a vitrine mente sobre o próprio preço.
 * Retorna `null` quando não há promoção, para quem chama manter o que já
 * desenhava.
 */
export function applyShopPromo(
  listPrice: number,
  promo: ShopPromo | null | undefined
): { price: number; listPrice: number; percent: number } | null {
  if (!promo?.enabled || !(promo.percent > 0)) return null
  if (!Number.isFinite(listPrice) || listPrice <= 0) return null
  const percent = Math.min(90, promo.percent)
  return {
    price: Math.round(listPrice * (1 - percent / 100) * 100) / 100,
    listPrice: Math.round(listPrice * 100) / 100,
    percent,
  }
}

/** `5` continua `5`, `7.5` vira `7,5` — sem `,0` em número inteiro. */
export function formatPercent(percent: number): string {
  return Number.isInteger(percent) ? String(percent) : String(percent).replace('.', ',')
}


// ─── Galeria ─────────────────────────────────────────────────────────────────

export type GalleryPhoto = {
  id: string
  albumId: string
  url: string
  caption: string | null
  sortOrder: number
}

export type GalleryAlbum = {
  id: string
  name: string
  slug: string
  description: string | null
  coverUrl: string | null
  /** YYYY-MM-DD when the album belongs to an event. */
  eventDate: string | null
  photoCount: number
  photos?: GalleryPhoto[]
}

/** Published albums, in the order set in the admin. */
export async function fetchGalleryAlbums(): Promise<GalleryAlbum[]> {
  const data = await getJson<{ albums: GalleryAlbum[] }>('/gallery')
  return data.albums ?? []
}

export async function fetchGalleryAlbum(slug: string): Promise<GalleryAlbum | null> {
  try {
    return await getJson<GalleryAlbum>(`/gallery/${encodeURIComponent(slug)}`)
  } catch {
    return null
  }
}


// ─── Evento em cartaz ────────────────────────────────────────────────────────

/**
 * O evento vem da API (aba **Eventos** do admin), não mais de um arquivo neste
 * repo.
 *
 * `null` = nada em cartaz (a admin arquivou tudo), e precisa chegar como `null`
 * — devolver o fallback aqui ressuscitaria no site o evento que ela tirou do
 * ar. O fallback cobre só a falha de rede: aí o site mantém a campanha em vez
 * de sumir com o banner por causa de um timeout.
 */
export async function fetchActiveEvent(): Promise<EventConfig | null> {
  try {
    const data = await getJson<{ event: EventConfig | null }>('/events/active')
    return data.event ?? null
  } catch {
    return FALLBACK_EVENT
  }
}


// ─── Reserva de ingresso ─────────────────────────────────────────────────────

/**
 * PIX da reserva. `emvCode` é o copia-e-cola e o conteúdo do QR.
 * Espelha `ReservationPix` da loja.
 */
export type ReservationPix = {
  emvCode: string
  pixKey: string
  merchantName: string
  amount: number
  txId: string
}

export type CreatedReservation = {
  code: string
  quantity: number
  totalCents: number
  pix: ReservationPix | null
}

export type CreateReservationResult =
  | { ok: true; reservation: CreatedReservation; ticketsUrl: string }
  | { ok: false; error: string }

/** Página pública dos ingressos da compra — é onde o PIX é exibido. */
export function reservationTicketsUrl(code: string): string {
  return `${SHOP_URL}/ingressos/${encodeURIComponent(code)}`
}

/**
 * Registra a reserva na API da loja.
 *
 * Até 23/08/2026 o formulário deste site só abria o WhatsApp: nada era
 * gravado, ninguém recebia PIX e a admin não era notificada — reservas
 * chegavam como mensagem solta e se perdiam. O cadastro é o mesmo que a loja
 * usa, então as duas vitrines caem na mesma tabela.
 *
 * Nunca lança: o formulário precisa poder cair no WhatsApp se a API falhar.
 */
export async function createReservation(
  eventId: string,
  input: {
    buyerName: string
    buyerEmail: string
    buyerPhone: string
    notes?: string
    attendees: { name: string; kind: string }[]
  }
): Promise<CreateReservationResult> {
  try {
    const res = await fetch(
      `${API_BASE}/events/${encodeURIComponent(eventId)}/reservations`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(input),
      }
    )
    const data = (await res.json().catch(() => null)) as
      | { reservation?: CreatedReservation; ticketsUrl?: string; error?: string }
      | null

    if (!res.ok || !data?.reservation) {
      return { ok: false, error: data?.error || 'Não foi possível registrar a reserva.' }
    }
    return {
      ok: true,
      reservation: data.reservation,
      // A API monta o link no domínio espelho (`shop.geekpoptoys.com.br`, ver
      // SHOP_CANONICAL_URL). Os dois atendem, mas trocar de marca no meio do
      // pagamento assusta — quem saiu de geeketoys.com.br continua nele.
      ticketsUrl: reservationTicketsUrl(data.reservation.code),
    }
  } catch {
    return { ok: false, error: 'Não foi possível falar com o servidor.' }
  }
}
