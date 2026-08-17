import { useState } from 'react'
import { UserRound, IdCard, Package, ChevronDown } from 'lucide-react'
import { CLUB_URL, SHOP_URL } from '@/lib/shop-api'
import { cn } from '@/lib/utils'

/**
 * "My profile" in the institutional site's navigation.
 *
 * This site **has no login**. It is static, and a customer's JWT lives in the
 * localStorage of `club.*` and `shop.*`, which is per origin — so from here
 * there is no way to know whether anyone is signed in, or who. Hence no name,
 * avatar or state: the menu is an honest redirect to where the profile
 * actually exists.
 *
 * Two destinations, because these are two separate records:
 *
 * | Audience      | Where the profile lives                     |
 * | ------------- | ------------------------------------------- |
 * | Club member   | `club.geeketoys.com.br/membro`              |
 * | Shop customer | `shop.geeketoys.com.br/minhas-compras`      |
 *
 * A single link would force picking one audience and leaving the other without
 * a route. Signed-out visitors do not hit a dead end: each destination
 * redirects to its own login and returns afterwards.
 */

interface ProfileTarget {
  label: string
  description: string
  href: string
  Icon: typeof IdCard
}

const TARGETS: ProfileTarget[] = [
  {
    label: 'Área do Membro',
    description: 'Carteirinha, assinatura e os 15% de desconto',
    href: `${CLUB_URL}/membro`,
    Icon: IdCard,
  },
  {
    label: 'Minhas Compras',
    description: 'Pedidos, rastreio e avaliações da loja',
    href: `${SHOP_URL}/minhas-compras`,
    Icon: Package,
  },
]

interface ProfileMenuProps {
  className?: string
  /**
   * Open list with no button, as used in the mobile menu.
   *
   * Below `xl` the dropdown is not used: the panel is 288px and, anchored
   * right on a 390px screen, it runs off the left edge. At those widths
   * "my profile" lives inside the hamburger with the rest of the
   * navigation, which is where people look for it.
   */
  inline?: boolean
  /** Chamado ao escolher um destino (fecha o menu mobile). */
  onNavigate?: () => void
}

export function ProfileMenu({ className, inline = false, onNavigate }: ProfileMenuProps) {
  const [open, setOpen] = useState(false)

  if (inline) {
    return (
      <div className={cn('space-y-2', className)}>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Meu Perfil
        </p>
        {TARGETS.map((t) => (
          <ProfileLink key={t.href} target={t} onSelect={onNavigate} />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn('relative', className)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Meu Perfil"
        title="Meu Perfil"
        className="flex items-center gap-1.5 rounded-full p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:px-3"
      >
        <UserRound className="h-4 w-4 shrink-0" aria-hidden />
        <span className="hidden text-sm font-medium lg:inline">Meu Perfil</span>
        <ChevronDown
          className={cn('hidden h-3.5 w-3.5 transition-transform lg:inline', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open && (
        <>
          {/* Clique fora fecha. Fica atrás do painel (z menor). */}
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            aria-label="Meu Perfil"
            className="absolute right-0 z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lg"
          >
            {TARGETS.map((t) => (
              <ProfileLink key={t.href} target={t} onSelect={() => setOpen(false)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ProfileLink({
  target,
  onSelect,
}: {
  target: ProfileTarget
  onSelect?: () => void
}) {
  const { label, description, href, Icon } = target
  return (
    <a
      href={href}
      role="menuitem"
      onClick={onSelect}
      className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="block text-xs text-muted-foreground">{description}</span>
      </span>
    </a>
  )
}
