/**
 * Lightweight client for the shop API, used by the institutional home to
 * display products.
 */

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
