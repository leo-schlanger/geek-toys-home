import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProfileMenu } from './ProfileMenu'

/**
 * O que estes testes protegem: os dois destinos.
 *
 * O site institucional não tem login, então "Meu Perfil" é só encaminhamento —
 * e encaminhamento errado leva a pessoa para uma tela onde a conta dela não
 * existe. Membro do Clube e cliente da loja são cadastros distintos, em
 * subdomínios distintos.
 */

const MEMBRO = 'https://club.geeketoys.com.br/membro'
const COMPRAS = 'https://shop.geeketoys.com.br/minhas-compras'

describe('ProfileMenu — botão + dropdown', () => {
  it('começa fechado', () => {
    render(<ProfileMenu />)
    expect(screen.getByRole('button', { name: 'Meu Perfil' })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('abre com os dois destinos, cada um no seu subdomínio', () => {
    render(<ProfileMenu />)
    fireEvent.click(screen.getByRole('button', { name: 'Meu Perfil' }))

    expect(screen.getByRole('menu', { name: 'Meu Perfil' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Área do Membro/ })).toHaveAttribute('href', MEMBRO)
    expect(screen.getByRole('menuitem', { name: /Minhas Compras/ })).toHaveAttribute('href', COMPRAS)
  })

  it('explica qual é qual — os rótulos sozinhos não separam os dois públicos', () => {
    render(<ProfileMenu />)
    fireEvent.click(screen.getByRole('button', { name: 'Meu Perfil' }))

    expect(screen.getByText(/Carteirinha, assinatura/)).toBeInTheDocument()
    expect(screen.getByText(/Pedidos, rastreio/)).toBeInTheDocument()
  })

  it('fecha ao clicar de novo no botão', () => {
    render(<ProfileMenu />)
    const botao = screen.getByRole('button', { name: 'Meu Perfil' })

    fireEvent.click(botao)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    fireEvent.click(botao)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('fecha ao escolher um destino, para o painel não ficar aberto na volta', () => {
    render(<ProfileMenu />)
    fireEvent.click(screen.getByRole('button', { name: 'Meu Perfil' }))
    fireEvent.click(screen.getByRole('menuitem', { name: /Minhas Compras/ }))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})

describe('ProfileMenu — modo inline (menu mobile)', () => {
  it('mostra os destinos direto, sem exigir um segundo clique', () => {
    render(<ProfileMenu inline />)

    expect(screen.queryByRole('button', { name: 'Meu Perfil' })).not.toBeInTheDocument()
    expect(screen.getByText('Meu Perfil')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Área do Membro/ })).toHaveAttribute('href', MEMBRO)
    expect(screen.getByRole('menuitem', { name: /Minhas Compras/ })).toHaveAttribute('href', COMPRAS)
  })

  it('avisa o pai ao escolher, para o menu mobile fechar junto', () => {
    const onNavigate = vi.fn()
    render(<ProfileMenu inline onNavigate={onNavigate} />)

    fireEvent.click(screen.getByRole('menuitem', { name: /Área do Membro/ }))
    expect(onNavigate).toHaveBeenCalledTimes(1)
  })
})
