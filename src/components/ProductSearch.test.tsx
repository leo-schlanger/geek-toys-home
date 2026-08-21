import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProductSearch } from './ProductSearch'

vi.mock('@/lib/shop-api', () => ({
  SHOP_URL: 'https://shop.geeketoys.com.br',
  fetchProducts: vi.fn(),
}))

import { fetchProducts } from '@/lib/shop-api'

const mockedFetch = vi.mocked(fetchProducts)

const product = {
  id: 'p1',
  name: 'Álbum BTS Proof',
  slug: 'album-bts-proof',
  description: null,
  price: 199.9,
  compareAtPrice: null,
  categoryId: null,
  categoryName: null,
  images: ['https://cdn.test/bts.jpg'],
  stock: 3,
  featured: false,
}

describe('ProductSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('does not query the API with fewer than 2 characters', async () => {
    render(<ProductSearch />)
    fireEvent.change(screen.getByLabelText(/Buscar produtos/i), { target: { value: 'b' } })
    await new Promise((r) => setTimeout(r, 400))
    expect(mockedFetch).not.toHaveBeenCalled()
  })

  it('shows the products it finds', async () => {
    mockedFetch.mockResolvedValue({ products: [product], total: 1, page: 1, limit: 6 })
    render(<ProductSearch />)

    fireEvent.change(screen.getByLabelText(/Buscar produtos/i), { target: { value: 'bts' } })

    await waitFor(() => expect(screen.getByText('Álbum BTS Proof')).toBeInTheDocument(), {
      timeout: 3000,
    })
    // O link leva direto para o produto na loja.
    expect(screen.getByRole('link', { name: /Álbum BTS Proof/ })).toHaveAttribute(
      'href',
      'https://shop.geeketoys.com.br/produto/album-bts-proof'
    )
  })

  it('says so when nothing matches', async () => {
    mockedFetch.mockResolvedValue({ products: [], total: 0, page: 1, limit: 6 })
    render(<ProductSearch />)

    fireEvent.change(screen.getByLabelText(/Buscar produtos/i), { target: { value: 'xyz' } })

    await waitFor(() => expect(screen.getByText(/Nada encontrado/i)).toBeInTheDocument(), {
      timeout: 3000,
    })
  })

  it('survives an API error without breaking the page', async () => {
    mockedFetch.mockRejectedValue(new Error('offline'))
    render(<ProductSearch />)

    fireEvent.change(screen.getByLabelText(/Buscar produtos/i), { target: { value: 'bts' } })

    await waitFor(() => expect(screen.getByText(/Nada encontrado/i)).toBeInTheDocument(), {
      timeout: 3000,
    })
  })
})
