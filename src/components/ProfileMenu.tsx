import { useState } from 'react'
import { UserRound, IdCard, Package, ChevronDown } from 'lucide-react'
import { CLUB_URL, SHOP_URL } from '@/lib/shop-api'
import { cn } from '@/lib/utils'

/**
 * "Meu Perfil" na navegação do site institucional.
 *
 * Este site **não tem login**. Ele é estático, servido do Vercel a partir do
 * apex, e o JWT de quem já é cliente vive no `localStorage` de `club.*` e
 * `shop.*` — que é por origem, então daqui não dá para saber se alguém está
 * logado nem quem é. Por isso o menu não mostra nome, avatar nem estado: ele é
 * um encaminhamento honesto para onde o perfil realmente existe.
 *
 * São dois destinos porque são dois cadastros distintos:
 *
 * | Público            | Onde mora o perfil                          |
 * | ------------------ | ------------------------------------------- |
 * | Membro do Clube    | `club.geeketoys.com.br/membro`              |
 * | Cliente da loja    | `shop.geeketoys.com.br/minhas-compras`      |
 *
 * Um link só obrigaria a escolher um público e deixar o outro sem caminho.
 * Quem chega deslogado não cai em beco: `/membro` redireciona para o login do
 * clube e `/minhas-compras` para `/entrar?next=/minhas-compras`, que volta para
 * a página pedida depois de autenticar.
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
   * Lista aberta, sem botão — para o menu mobile, onde já existe um painel
   * expandido e um segundo nível de clique só atrapalharia.
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
            className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-lg"
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
