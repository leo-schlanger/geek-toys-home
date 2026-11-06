import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import NonoSection from './NonoSection'

describe('NonoSection', () => {
  it('introduces Nono with a heading the hero can link to', () => {
    const { container } = render(<NonoSection />)
    const heading = screen.getByRole('heading', { level: 2, name: /Conheça o Nono\s*, o tigre da GeekPop/ })
    expect(heading).toBeInTheDocument()
    expect(container.querySelector('section#nono')).toHaveAttribute('aria-labelledby', heading.id)
    expect(screen.getByText(/espalhando/)).toHaveTextContent(
      'Sempre com a GeekPop, espalhando K-pop, diversão e muito amor!'
    )
  })

  it('shows the three poses as responsive WebP with descriptive alt text', () => {
    render(<NonoSection />)
    const imgs = screen.getAllByRole('img')
    expect(imgs).toHaveLength(3)
    for (const img of imgs) {
      expect(img.getAttribute('alt')).toMatch(/Nono/)
      expect(img.getAttribute('srcset')).toMatch(/\.webp \d+w/)
      expect(img).toHaveAttribute('width')
      expect(img).toHaveAttribute('height')
      expect(img).toHaveAttribute('loading', 'lazy')
    }
  })

  it('has Nono standing with his speech bubble', () => {
    render(<NonoSection />)
    expect(screen.getByAltText(/Nono.*de pé/)).toHaveAttribute('srcset', expect.stringMatching(/nono-de-pe-960/))
    expect(screen.getByText('Oi! Eu sou o Nono. Vem me dar um oi na loja!')).toBeInTheDocument()
  })

  it('sends the visitor to the store location', () => {
    render(<NonoSection />)
    expect(screen.getByRole('link', { name: /Vem conhecer o Nono de pertinho/ })).toHaveAttribute(
      'href',
      '#localizacao'
    )
  })
})
