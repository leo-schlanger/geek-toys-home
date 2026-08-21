import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProfileMenu } from './ProfileMenu'

/**
 * What these protect: the two destinations.
 *
 * The institutional site has no login, so "my profile" is only a redirect —
 * and the wrong redirect lands someone on a screen where their account does
 * not exist. Club members and shop customers are separate records on separate
 * subdomains.
 */

const MEMBRO = 'https://club.geeketoys.com.br/membro'
const COMPRAS = 'https://shop.geeketoys.com.br/minhas-compras'

describe('ProfileMenu — button and dropdown', () => {
  it('starts closed', () => {
    render(<ProfileMenu />)
    expect(screen.getByRole('button', { name: 'Meu Perfil' })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens with both destinations, each on its own subdomain', () => {
    render(<ProfileMenu />)
    fireEvent.click(screen.getByRole('button', { name: 'Meu Perfil' }))

    expect(screen.getByRole('menu', { name: 'Meu Perfil' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Área do Membro/ })).toHaveAttribute('href', MEMBRO)
    expect(screen.getByRole('menuitem', { name: /Minhas Compras/ })).toHaveAttribute('href', COMPRAS)
  })

  it('explains which is which: the labels alone do not separate the two audiences', () => {
    render(<ProfileMenu />)
    fireEvent.click(screen.getByRole('button', { name: 'Meu Perfil' }))

    expect(screen.getByText(/Carteirinha, assinatura/)).toBeInTheDocument()
    expect(screen.getByText(/Pedidos, rastreio/)).toBeInTheDocument()
  })

  it('closes when the button is clicked again', () => {
    render(<ProfileMenu />)
    const botao = screen.getByRole('button', { name: 'Meu Perfil' })

    fireEvent.click(botao)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    fireEvent.click(botao)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on choosing a destination, so the panel is not open on return', () => {
    render(<ProfileMenu />)
    fireEvent.click(screen.getByRole('button', { name: 'Meu Perfil' }))
    fireEvent.click(screen.getByRole('menuitem', { name: /Minhas Compras/ }))

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})

describe('ProfileMenu — modo inline (menu mobile)', () => {
  it('shows the destinations directly, with no second click', () => {
    render(<ProfileMenu inline />)

    expect(screen.queryByRole('button', { name: 'Meu Perfil' })).not.toBeInTheDocument()
    expect(screen.getByText('Meu Perfil')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /Área do Membro/ })).toHaveAttribute('href', MEMBRO)
    expect(screen.getByRole('menuitem', { name: /Minhas Compras/ })).toHaveAttribute('href', COMPRAS)
  })

  it('notifies the parent on choosing, so the mobile menu closes too', () => {
    const onNavigate = vi.fn()
    render(<ProfileMenu inline onNavigate={onNavigate} />)

    fireEvent.click(screen.getByRole('menuitem', { name: /Área do Membro/ }))
    expect(onNavigate).toHaveBeenCalledTimes(1)
  })
})
