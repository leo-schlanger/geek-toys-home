import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

// The home had no <h1> at all; this is the one it has now.
vi.mock('@/hooks/useActiveEvent', () => ({ useActiveEvent: () => ({ visible: false }) }))

import HeroSection from './HeroSection'

const callout = () =>
  screen.getByRole('region', { name: 'Associe-se e tenha vantagens incríveis' })

describe('HeroSection', () => {
  it('carries the page heading', () => {
    render(<HeroSection />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Loja de K-pop no Rio de Janeiro' })
    ).toBeInTheDocument()
    expect(screen.getByAltText('Logo da GeekPop & Toys')).toBeInTheDocument()
  })

  it('opens with the club call-out as an h2, not a second h1', () => {
    render(<HeroSection />)
    expect(
      within(callout()).getByRole('heading', { level: 2, name: 'Associe-se e tenha vantagens incríveis' })
    ).toBeInTheDocument()
  })

  it('lists the club perks with the same figures as the club', () => {
    render(<HeroSection />)
    const items = within(callout()).getAllByRole('listitem').map((li) => li.textContent)
    expect(items).toEqual([
      '10% de desconto em qualquer produto',
      'Meia-entrada nos eventos da GeekPop',
      'Plano anual: paga uma vez, vale o ano todo',
    ])
  })

  it('sends "Quero ser membro" to the club sign-up page', () => {
    render(<HeroSection />)
    const cta = within(callout()).getByRole('link', { name: 'Quero ser membro' })
    expect(cta).toHaveAttribute('href', 'https://club.geeketoys.com.br/assinar')
    expect(cta).toHaveAttribute('target', '_blank')
  })

  it('keeps the shop links, now secondary', () => {
    render(<HeroSection />)
    expect(screen.getByRole('link', { name: 'Ver produtos' })).toHaveAttribute('href', '#produtos')
    expect(screen.getByRole('link', { name: 'Abrir loja online' })).toHaveAttribute(
      'href',
      'https://shop.geeketoys.com.br'
    )
    expect(screen.queryByRole('link', { name: /Assinar o Clube/ })).not.toBeInTheDocument()
  })

  // Nono stands next to the club offer: no price there (CONANDA 163/2014).
  it('puts the one Nono in the call-out, with a speech bubble and no price', () => {
    const { container } = render(<HeroSection />)
    expect(container.querySelectorAll('img[alt^="Nono"]')).toHaveLength(1)
    const box = callout()
    expect(within(box).getByRole('link', { name: /Conheça o Nono/ })).toHaveAttribute('href', '#nono')
    expect(within(box).getByText('Vem fazer parte do Clube comigo!')).toBeInTheDocument()
    expect(box.textContent).not.toMatch(/R\$|\d+,\d{2}/)
  })
})
