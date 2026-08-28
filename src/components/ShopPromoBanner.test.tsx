import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render as rtlRender, cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ShopPromoBanner from './ShopPromoBanner'
import type { ShopPromo } from '@/lib/shop-api'

const PROMO_ON: ShopPromo = {
  enabled: true,
  percent: 5,
  bannerEnabled: true,
  bannerText: 'No site é 5% mais barato que na loja física — preços já com desconto.',
}

let current: ShopPromo = PROMO_ON

vi.mock('@/lib/shop-api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/shop-api')>()
  return {
    ...actual,
    fetchShopPromo: vi.fn(async () => current),
  }
})

function render(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false } },
  })
  return rtlRender(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)
}

/**
 * O que este arquivo trava:
 *
 * O aviso é o **segundo** banner fixo do topo. O do evento publica a própria
 * altura em `--event-banner-h`, e a Navbar se desloca pela soma das duas. Se
 * este aqui escrevesse na variável do evento, ou chutasse um número em vez de
 * medir, a sobra cairia por cima da Navbar — que tem z-index menor — e foi
 * exatamente assim que o botão do menu mobile já ficou impossível de tocar.
 */

const VAR = '--promo-banner-h'
const EVENT_VAR = '--event-banner-h'

/** jsdom devolve 0 em todo getBoundingClientRect; simula um aviso de N px. */
function comAlturaDe(px: number) {
  return vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    height: px,
    width: 390,
    top: 0,
    left: 0,
    right: 390,
    bottom: px,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect)
}

function varAtual(name = VAR) {
  return document.documentElement.style.getPropertyValue(name)
}

beforeEach(() => {
  current = PROMO_ON
  localStorage.clear()
  document.documentElement.style.removeProperty(VAR)
  document.documentElement.style.removeProperty(EVENT_VAR)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('ShopPromoBanner', () => {
  it('mostra o texto que veio do admin', async () => {
    comAlturaDe(48)
    render(<ShopPromoBanner />)
    expect(await screen.findByText(PROMO_ON.bannerText)).toBeInTheDocument()
  })

  // `placeholderData` é "sem promoção" — o aviso só aparece quando a API
  // responde, então a altura só existe depois disso.
  it('publica a altura MEDIDA, e na sua própria var', async () => {
    comAlturaDe(111)
    render(<ShopPromoBanner />)
    await screen.findByText(PROMO_ON.bannerText)

    expect(varAtual()).toBe('111px')
    // A var do evento é de outro componente: escrever nela apagaria a altura
    // dele e a Navbar subiria por cima do anúncio.
    expect(varAtual(EVENT_VAR)).toBe('')
  })

  it('arredonda para cima: meio pixel a menos reexpõe a Navbar', async () => {
    comAlturaDe(62.4)
    render(<ShopPromoBanner />)
    await screen.findByText(PROMO_ON.bannerText)

    expect(varAtual()).toBe('63px')
  })

  it('zera a var quando o visitante fecha o aviso', async () => {
    comAlturaDe(48)
    render(<ShopPromoBanner />)
    await screen.findByText(PROMO_ON.bannerText)
    expect(varAtual()).toBe('48px')

    fireEvent.click(screen.getByRole('button', { name: /fechar/i }))

    expect(varAtual()).toBe('0px')
    expect(screen.queryByText(PROMO_ON.bannerText)).not.toBeInTheDocument()
  })

  // A dispensa é por percentual: quem fechou "5% mais barato" precisa ver
  // "20% mais barato" na campanha seguinte.
  it('a dispensa vale só para aquele percentual', async () => {
    localStorage.setItem('shop-promo-banner-dismissed:5', '1')
    comAlturaDe(48)

    const { unmount } = render(<ShopPromoBanner />)
    // Espera a resposta chegar: antes dela o aviso estaria escondido de
    // qualquer jeito, e o teste passaria sem provar nada.
    await waitFor(() => expect(varAtual()).toBe('0px'))
    expect(screen.queryByText(PROMO_ON.bannerText)).not.toBeInTheDocument()
    unmount()
    cleanup()

    current = { ...PROMO_ON, percent: 20, bannerText: 'No site é 20% mais barato.' }
    render(<ShopPromoBanner />)
    expect(await screen.findByText('No site é 20% mais barato.')).toBeInTheDocument()
  })

  it('não ocupa espaço quando não há promoção', async () => {
    current = { enabled: false, percent: 0, bannerEnabled: false, bannerText: '' }
    comAlturaDe(48)
    render(<ShopPromoBanner />)

    await waitFor(() => expect(varAtual()).toBe('0px'))
  })
})
