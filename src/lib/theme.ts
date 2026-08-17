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

/** Applies the class Tailwind expects (darkMode: 'class'). */
export function applyTheme(theme: Theme): void {
  const dark = theme === 'dark' || (theme === 'system' && systemPrefersDark())
  document.documentElement.classList.toggle('dark', dark)
}

/**
 * Called before React mounts so the page never flashes the wrong theme. Also
 * subscribes to system theme changes while the preference is "system".
 */
export function initTheme(): void {
  applyTheme(readStoredTheme())
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (readStoredTheme() === 'system') applyTheme('system')
  })
}
