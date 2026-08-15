export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'geekpop-theme'

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function readStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
}

export function storeTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme)
}

/** Aplica a classe que o Tailwind usa (darkMode: 'class'). */
export function applyTheme(theme: Theme): void {
  const dark = theme === 'dark' || (theme === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)
}

/**
 * Chamado antes do React montar, para a página não piscar no tema errado.
 * Também assina a troca do tema do sistema enquanto o usuário está em "system".
 */
export function initTheme(): void {
  applyTheme(readStoredTheme())
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (readStoredTheme() === 'system') applyTheme('system')
  })
}
