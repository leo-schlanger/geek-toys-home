import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LocationSection from './LocationSection'

// jsdom has no IntersectionObserver; the section only uses it to fade in.
vi.stubGlobal(
  'IntersectionObserver',
  class {
    observe() {}
    disconnect() {}
  }
)

describe('LocationSection', () => {
  it('has one small Nono with his line beside the store details, away from the map', () => {
    const { container } = render(<LocationSection />)
    expect(screen.getAllByAltText(/Nono/)).toHaveLength(1)
    expect(screen.getByText('Tô te esperando aqui em Copacabana!')).toBeInTheDocument()
    expect(container.querySelector('iframe')?.parentElement?.querySelector('[data-nono-speech]')).toBeNull()
  })
})
