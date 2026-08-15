import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'
import { applyTheme, readStoredTheme, storeTheme, type Theme } from '@/lib/theme'

const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Claro', Icon: Sun },
  { value: 'dark', label: 'Escuro', Icon: Moon },
  { value: 'system', label: 'Sistema', Icon: Monitor },
]

interface ThemeToggleProps {
  className?: string
  /** Um botão só, que cicla entre os modos. Usado onde não sobra espaço. */
  compact?: boolean
}

export function ThemeToggle({ className, compact = false }: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === 'undefined' ? 'system' : readStoredTheme()
  )

  useEffect(() => {
    storeTheme(theme)
    applyTheme(theme)
  }, [theme])

  if (compact) {
    const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2]
    const next = OPTIONS[(OPTIONS.indexOf(current) + 1) % OPTIONS.length]
    const Icon = current.Icon
    return (
      <button
        type="button"
        onClick={() => setTheme(next.value)}
        aria-label={`Tema: ${current.label}. Mudar para ${next.label}`}
        title={`Tema: ${current.label}`}
        className={cn(
          'rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
          className
        )}
      >
        <Icon className="h-4 w-4" />
      </button>
    )
  }

  return (
    <div
      className={cn('inline-flex items-center rounded-full border border-border p-0.5', className)}
      role="radiogroup"
      aria-label="Tema"
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          onClick={() => setTheme(value)}
          className={cn(
            'rounded-full p-1.5 transition-colors',
            theme === value
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
