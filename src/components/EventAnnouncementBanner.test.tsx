import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import EventAnnouncementBanner from './EventAnnouncementBanner'
import { ACTIVE_EVENT, isEventVisible } from '@/data/event'

/**
 * O bug que este teste tranca (encontrado em 16/08/2026):
 *
 * A altura do banner era **chutada** — `44px` acima de 768px, `72px` abaixo —
 * e escrita na var `--event-banner-h`, que é o quanto a Navbar desce. O texto
 * do banner vem de `data/event.ts` e cresceu: a 390px ele passou a quebrar em
 * **111px**. Os 39px de diferença ficavam por cima da Navbar, que tem z-index
 * menor que o banner.
 *
 * Consequência real, medida no navegador: **o hambúrguer do menu mobile ficou
 * intocável no celular** — o toque caía no banner. A navegação inteira do site
 * ficava inacessível em telas estreitas.
 *
 * Qualquer volta a um número fixo aqui reprova.
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
  it('o evento precisa estar ativo, senão este arquivo não testa nada', () => {
    // Guarda explícita: se alguém desligar o evento, o teste abaixo passaria
    // por vacuidade e a regressão voltaria sem aviso.
    expect(isEventVisible(ACTIVE_EVENT)).toBe(true)
  })

  it('publica a altura MEDIDA, não um número fixo por breakpoint', () => {
    comAlturaDe(111)
    render(<EventAnnouncementBanner />)

    // 72px era o valor fixo do código antigo para telas estreitas.
    expect(varAtual()).toBe('111px')
    expect(varAtual()).not.toBe('72px')
  })

  it('acompanha uma altura diferente — o valor não vem do breakpoint', () => {
    comAlturaDe(49)
    render(<EventAnnouncementBanner />)

    // 44px era o valor fixo do código antigo para desktop.
    expect(varAtual()).toBe('49px')
    expect(varAtual()).not.toBe('44px')
  })

  it('arredonda para cima — meio pixel a menos reexpõe a Navbar', () => {
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
