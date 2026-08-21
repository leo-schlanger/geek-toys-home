import { describe, it, expect, beforeEach, vi } from 'vitest'
import { applyTheme, readStoredTheme, storeTheme } from './theme'

function mockSystemDark(dark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: dark,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
  )
}

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('falls back to "system" when nothing is stored, or the value is junk', () => {
    expect(readStoredTheme()).toBe('system')
    localStorage.setItem('geekpop-theme', 'roxo')
    expect(readStoredTheme()).toBe('system')
  })

  it('stores and reads back the preference', () => {
    storeTheme('dark')
    expect(readStoredTheme()).toBe('dark')
  })

  it('adds the dark class on an explicit choice', () => {
    mockSystemDark(false)
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    applyTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('in "system", follows the OS preference', () => {
    mockSystemDark(true)
    applyTheme('system')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    mockSystemDark(false)
    applyTheme('system')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
