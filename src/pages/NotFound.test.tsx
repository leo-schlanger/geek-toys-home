import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from './NotFound'

describe('NotFound', () => {
  it('shows Nono and a way back home, in Portuguese', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <MemoryRouter initialEntries={['/nada-aqui']}>
        <NotFound />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument()
    expect(screen.getByAltText(/Nono.*óculos escuros/)).toBeInTheDocument()
    expect(screen.getByText(/Essa página se perdeu/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Voltar para o início/ })).toHaveAttribute('href', '/')
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow')
  })
})
