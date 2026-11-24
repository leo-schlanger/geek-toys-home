/**
 * Data the build puts in a page's HTML (vite.config.ts, prerenderBodies), read
 * by the first render so it matches the prerendered body: the promo hint and
 * the gallery album. In the browser it comes from <script type="application/json"
 * id="...">; in the build-time renderer, from `ssrPageData`.
 */
export const ssrPageData: Record<string, unknown> = {}

export function readPageData<T>(id: string): T | null {
  try {
    if (id in ssrPageData || typeof document === 'undefined') return (ssrPageData[id] as T) ?? null
    const raw = document.getElementById(id)?.textContent
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

/** Safe inside <script>: JSON.stringify does not escape "</". */
export function pageDataScript(id: string, value: unknown): string {
  return `<script type="application/json" id="${id}">${JSON.stringify(value).replace(/</g, '\\u003c')}</script>`
}
