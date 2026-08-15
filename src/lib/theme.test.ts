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

  it('cai em "system" quando não há preferência salva ou o valor é lixo', () => {
    expect(readStoredTheme()).toBe('system')
    localStorage.setItem('geekpop-theme', 'roxo')
    expect(readStoredTheme()).toBe('system')
  })

  it('guarda e relê a preferência', () => {
    storeTheme('dark')
    expect(readStoredTheme()).toBe('dark')
  })

  it('liga a classe dark no escolha explícita', () => {
    mockSystemDark(false)
    applyTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    applyTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('em "system", segue a preferência do sistema', () => {
    mockSystemDark(true)
    applyTheme('system')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    mockSystemDark(false)
    applyTheme('system')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
