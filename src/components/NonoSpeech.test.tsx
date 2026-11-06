import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NonoSpeech } from './NonoSpeech'
import { NONO_LINES } from '@/lib/nono'

describe('NonoSpeech', () => {
  it('renders the line as real text, with a decorative tail', () => {
    const { container } = render(<NonoSpeech tail="bottom">Oi, eu sou o Nono!</NonoSpeech>)
    expect(screen.getByText('Oi, eu sou o Nono!').tagName).toBe('P')
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('bottom-0')
  })
})

describe('NONO_LINES', () => {
  // A mascot must not push prices or deals (CONANDA 163/2014).
  it.each(Object.entries(NONO_LINES))('%s is short and never about price', (_key, line) => {
    expect(line.length).toBeLessThanOrEqual(60)
    expect(line).not.toMatch(/R\$|%|\bpreç|\bdesconto|\bpromo|\boferta|\bcompr/i)
  })
})
