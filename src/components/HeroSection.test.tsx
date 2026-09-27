import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// The home had no <h1> at all; this is the one it has now.
vi.mock('@/hooks/useActiveEvent', () => ({ useActiveEvent: () => ({ visible: false }) }))

import HeroSection from './HeroSection'

describe('HeroSection', () => {
  it('carries the page heading', () => {
    render(<HeroSection />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Loja de K-pop no Rio de Janeiro' })
    ).toBeInTheDocument()
    expect(screen.getByAltText('Logo da GeekPop & Toys')).toBeInTheDocument()
  })
})
