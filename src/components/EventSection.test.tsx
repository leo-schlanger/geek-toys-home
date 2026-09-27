import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { FALLBACK_EVENT, type EventConfig } from '@/data/event'
import EventSection from './EventSection'

/**
 * The event block shows every flyer the admin uploaded and, under them,
 * "Reservar ingresso" plus the buttons she added (the dance-competition
 * sign-up form, first). A link that is not http(s) never becomes an `href`.
 */

const state = vi.hoisted(() => ({ event: null as unknown as EventConfig }))

vi.mock('@/hooks/useActiveEvent', () => ({
  useActiveEvent: () => ({ event: state.event, visible: true }),
}))
vi.mock('./EventTicketForm', () => ({ default: () => <div data-testid="ticket-form" /> }))

class NoopObserver {
  observe() {}
  disconnect() {}
}
vi.stubGlobal('IntersectionObserver', NoopObserver)

describe('EventSection — flyers and links', () => {
  it('shows the banner, the extra flyers, and the buttons under them', () => {
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

    const art = screen.getByRole('region', { name: 'Divulgação' })
    expect(within(art).getAllByRole('img').map((img) => img.getAttribute('src'))).toEqual([
      'https://api.example/uploads/events/e/banner-1.jpg',
      'https://api.example/uploads/events/e/flyer-1.jpg',
    ])
    expect(within(art).getByRole('link', { name: /Reservar ingresso/ })).toHaveAttribute(
      'href',
      '#ingressos'
    )
    const signUp = within(art).getByRole('link', { name: /Inscrição da competição/ })
    expect(signUp).toHaveAttribute('href', 'https://forms.gle/abc')
    expect(signUp).toHaveAttribute('target', '_blank')
    expect(within(art).queryByRole('link', { name: /Mal/ })).not.toBeInTheDocument()
  })

  it('draws no art block when the payload has neither (older API)', () => {
    const { flyers: _f, links: _l, ...older } = FALLBACK_EVENT
    state.event = { ...older, bannerImageUrl: null } as EventConfig
    render(<EventSection />)
    expect(screen.queryByRole('region', { name: 'Divulgação' })).not.toBeInTheDocument()
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
