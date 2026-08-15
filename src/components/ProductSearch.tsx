import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { fetchProducts, SHOP_URL, type ShopProduct } from '@/lib/shop-api'
import { cn } from '@/lib/utils'

/**
 * Busca de produtos no site institucional.
 *
 * Consulta a API da loja e mostra as primeiras correspondências; clicar leva
 * direto para o produto na loja. Buscar aqui e cair na loja evita que a pessoa
 * tenha que navegar duas vezes.
 */
export function ProductSearch({ className }: { className?: string }) {
  const [term, setTerm] = useState('')
  const [results, setResults] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  // Espera a digitação parar antes de consultar a API.
  useEffect(() => {
    const query = term.trim()
    if (query.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      let active = true
      fetchProducts({ search: query, limit: 6 })
        .then((data) => {
          if (active) setResults(data.products)
        })
        .catch(() => {
          if (active) setResults([])
        })
        .finally(() => {
          if (active) setLoading(false)
        })
      return () => {
        active = false
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [term])

  useEffect(() => {
    if (!open) return
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  function goToShop() {
    const query = term.trim()
    window.location.href = query
      ? `${SHOP_URL}/?search=${encodeURIComponent(query)}`
      : SHOP_URL
  }

  return (
    <div ref={boxRef} className={cn('relative', className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          goToShop()
        }}
      >
        <label htmlFor="product-search" className="sr-only">
          Buscar produtos
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          id="product-search"
          type="search"
          value={term}
          placeholder="Buscar produtos…"
          onChange={(e) => {
            setTerm(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
        />
        {term && (
          <button
            type="button"
            onClick={() => {
              setTerm('')
              setResults([])
            }}
            aria-label="Limpar busca"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {open && term.trim().length >= 2 && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          {loading ? (
            <p className="flex items-center justify-center gap-2 px-3 py-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Buscando…
            </p>
          ) : results.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              Nada encontrado para "{term.trim()}".
            </p>
          ) : (
            <>
              <ul className="max-h-80 overflow-y-auto">
                {results.map((product) => (
                  <li key={product.id}>
                    <a
                      href={`${SHOP_URL}/produto/${product.slug}`}
                      className="flex items-center gap-3 border-b border-border px-3 py-2 transition-colors last:border-0 hover:bg-muted/50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                        {product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {product.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {product.price.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={goToShop}
                className="w-full bg-muted/40 px-3 py-2 text-center text-xs font-medium text-primary hover:bg-muted"
              >
                Ver todos os resultados na loja
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
