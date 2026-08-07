/**
 * Cliente leve da API da loja (api.geeketoys.com.br).
 * Usado na home institucional para vitrine de produtos.
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
} = {}): Promise<ProductListResponse> {
  const qs = new URLSearchParams()
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.featured) qs.set('featured', 'true')
  if (params.category) qs.set('category', params.category)
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
