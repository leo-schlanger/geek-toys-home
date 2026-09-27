import { beforeEach, describe, it, expect, vi } from 'vitest'
import { act, render, screen, within } from '@testing-library/react'
import { FALLBACK_EVENT, type EventConfig } from '@/data/event'
import EventSection from './EventSection'

/**
 * The event block shows every flyer the admin uploaded and, under them,
 * "Reservar ingresso" plus the buttons she added (the dance-competition
 * sign-up form, first). A link that is not http(s) never becomes an `href`.
 */

const state = vi.hoisted(() => ({ event: null as unknown as EventConfig, visible: true }))

vi.mock('@/hooks/useActiveEvent', () => ({
  useActiveEvent: () => ({ event: state.event, visible: state.visible }),
}))
vi.mock('./EventTicketForm', () => ({ default: () => <div data-testid="ticket-form" /> }))

// Records what is observed and lets a test report it on screen.
const observed: Element[] = []
let reportVisible: ((el: Element) => void) | null = null
class FakeObserver {
  constructor(private cb: (entries: { isIntersecting: boolean; target: Element }[]) => void) {
    reportVisible = (el) => this.cb([{ isIntersecting: true, target: el }])
  }
  observe(el: Element) {
    observed.push(el)
  }
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', FakeObserver)

describe('EventSection — fade-in', () => {
  // The event arrives after mount (the bundled fallback is a past event, so
  // the first render is empty). The observer used to be set up only at mount,
  // with nothing to watch, and the section stayed at opacity 0 for everyone.
  it('fades in when the event shows up after the first render', () => {
    observed.length = 0
    state.event = FALLBACK_EVENT
    state.visible = false
    const { rerender, container } = render(<EventSection />)
    expect(container.querySelector('#evento')).toBeNull()

    state.visible = true
    rerender(<EventSection />)
    const section = container.querySelector('#evento')!
    expect(observed).toContain(section)

    act(() => reportVisible?.(section))
    expect(section).toHaveClass('visible')
  })
})

describe('EventSection — flyers and links', () => {
  beforeEach(() => {
    state.visible = true
  })

  it('opens with date, time, place and price, then the cover', () => {
    state.event = {
      ...FALLBACK_EVENT,
      bannerImageUrl: 'https://api.example/uploads/events/e/banner-1.jpg',
      flyers: [{ url: 'https://api.example/uploads/events/e/flyer-1.jpg' }],
      links: [
        { label: 'Inscrição da competição', url: 'https://forms.gle/abc' },
        { label: 'Mal', url: 'javascript:alert(1)' },
      ],
    }
    render(<EventSection />)

    const hero = screen.getByRole('region', { name: FALLBACK_EVENT.title })
    expect(within(hero).getByText('Domingo, 20 de setembro de 2026')).toBeInTheDocument()
    expect(within(hero).getByText('14h às 18h')).toBeInTheDocument()
    expect(within(hero).getByText('R$ 20 por pessoa')).toBeInTheDocument()
    expect(within(hero).getByText('Membros do Clube: R$ 10')).toBeInTheDocument()
    // Both posters side by side, in the first block.
    expect(within(hero).getAllByRole('img').map((img) => img.getAttribute('src'))).toEqual([
      'https://api.example/uploads/events/e/banner-1.jpg',
      'https://api.example/uploads/events/e/flyer-1.jpg',
    ])
    expect(within(hero).getByRole('link', { name: /Reservar ingresso/ })).toHaveAttribute(
      'href',
      '#ingressos'
    )

    const signUp = within(hero).getByRole('link', { name: /Inscrição da competição/ })
    expect(signUp).toHaveAttribute('href', 'https://forms.gle/abc')
    expect(signUp).toHaveAttribute('target', '_blank')
    expect(screen.queryByRole('link', { name: /Mal/ })).not.toBeInTheDocument()
  })

  it('draws no art when the payload has neither (older API)', () => {
    const { flyers: _f, links: _l, ...older } = FALLBACK_EVENT
    state.event = { ...older, bannerImageUrl: null } as EventConfig
    render(<EventSection />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})

describe('EventSection — past events', () => {
  it('hides the bundled fallback, which is always a past event', async () => {
    const { isEventVisible } = await vi.importActual<typeof import('@/data/event')>('@/data/event')
    expect(isEventVisible(FALLBACK_EVENT, Date.parse('2026-09-26T21:00:00-03:00'))).toBe(false)
    expect(isEventVisible(FALLBACK_EVENT, Date.parse('2026-09-20T15:00:00-03:00'))).toBe(true)
    expect(
      isEventVisible({ ...FALLBACK_EVENT, endsAt: null }, Date.parse(FALLBACK_EVENT.startsAt) + 25 * 3600_000)
    ).toBe(false)
  })
})

describe('formatEventDateRange', () => {
  it('shows Rio time whatever the visitor time zone', async () => {
    const { formatEventDateRange } = await vi.importActual<typeof import('@/data/event')>('@/data/event')
    const label = formatEventDateRange('2026-10-11T17:00:00.000Z', '2026-10-11T21:00:00.000Z')
    expect(label).toContain('14:00')
    expect(label).toContain('18:00')
    expect(formatEventDateRange('2026-10-12T01:30:00.000Z')).toMatch(/11 de outubro/)
  })
})
