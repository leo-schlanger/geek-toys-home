import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render as rtlRender, cleanup, fireEvent, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EventAnnouncementBanner from './EventAnnouncementBanner'
import { FALLBACK_EVENT, isEventVisible } from '@/data/event'

// O evento passou a vir da API. `placeholderData` entrega o fallback embutido
// no primeiro render, então o banner continua medindo a altura sem esperar rede
// — só o provider do react-query passou a ser obrigatório.
vi.mock('@/lib/shop-api', () => ({
  fetchActiveEvent: vi.fn(async () => FALLBACK_EVENT),
}))

function render(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  })
  return rtlRender(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

/**
 * The bug this test pins:
 *
 * The banner's height was **guessed** — 44px above 768px, 72px below — and
 * written into `--event-banner-h`, which is how far the Navbar shifts down.
 * The banner text comes from `data/event.ts` and grew: at 390px it wrapped to
 * 111px, and the 39px difference sat over the Navbar, which has the lower
 * z-index.
 *
 * Measured consequence: the mobile menu button became **untappable**, taps
 * landing on the banner instead. Site navigation was unreachable on narrow
 * screens.
 *
 * Any return to a fixed number here fails.
 */

const VAR = '--event-banner-h'

/** jsdom devolve 0 em todo getBoundingClientRect; simula um banner de N px. */
function comAlturaDe(px: number) {
  return vi
    .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
    .mockReturnValue({ height: px, width: 390, top: 0, left: 0, right: 390, bottom: px, x: 0, y: 0, toJSON: () => ({}) } as DOMRect)
}

function varAtual() {
  return document.documentElement.style.getPropertyValue(VAR)
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.style.removeProperty(VAR)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('EventAnnouncementBanner — altura publicada na var CSS', () => {
  it('the event must be active, or this file tests nothing', () => {
    // Explicit guard: if the event were disabled, the test below would pass
    // vacuously and the regression could return unnoticed.
    expect(isEventVisible(FALLBACK_EVENT)).toBe(true)
  })

  it('publishes the MEASURED height, not a fixed per-breakpoint number', () => {
    comAlturaDe(111)
    render(<EventAnnouncementBanner />)

    // 72px was the old hard-coded value for narrow screens.
    expect(varAtual()).toBe('111px')
    expect(varAtual()).not.toBe('72px')
  })

  it('tracks a different height: the value does not come from the breakpoint', () => {
    comAlturaDe(49)
    render(<EventAnnouncementBanner />)

    // 44px was the old hard-coded value for desktop.
    expect(varAtual()).toBe('49px')
    expect(varAtual()).not.toBe('44px')
  })

  it('rounds up: half a pixel short re-exposes the Navbar', () => {
    comAlturaDe(62.4)
    render(<EventAnnouncementBanner />)

    expect(varAtual()).toBe('63px')
  })

  it('zera a var quando o visitante fecha o banner', () => {
    comAlturaDe(111)
    render(<EventAnnouncementBanner />)
    expect(varAtual()).toBe('111px')

    fireEvent.click(screen.getByRole('button', { name: /fechar|dispensar/i }))

    expect(varAtual()).toBe('0px')
  })
})
