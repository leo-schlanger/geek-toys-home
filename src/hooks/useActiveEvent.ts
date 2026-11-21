import { useQuery } from '@tanstack/react-query'
import { fetchActiveEvent } from '@/lib/shop-api'
import { FALLBACK_EVENT, isEventVisible, type EventConfig } from '@/data/event'

/** Chave compartilhada — banner, navbar, hero e seção do evento leem o mesmo cache. */
export const ACTIVE_EVENT_QUERY_KEY = ['events', 'active'] as const

const CACHE_KEY = 'active-event:v1'

/**
 * The last event the API returned. Painted while the next answer is on its
 * way: the bundled fallback is always a past event, which now hides itself,
 * so without this a slow phone saw no event until `/events/active` answered.
 * A cached event that has since ended hides itself the same way.
 */
function readCachedEvent(): EventConfig | undefined {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return undefined
    const event = JSON.parse(raw) as EventConfig
    return event && typeof event.id === 'string' && Array.isArray(event.description)
      ? event
      : undefined
  } catch {
    return undefined
  }
}

function writeCachedEvent(event: EventConfig | null) {
  try {
    // Never cache the bundled fallback: it is what a failed call returns.
    if (event && event !== FALLBACK_EVENT) localStorage.setItem(CACHE_KEY, JSON.stringify(event))
    else if (event === null) localStorage.removeItem(CACHE_KEY)
  } catch {
    // Private mode or blocked storage: the fallback still covers first paint.
  }
}

/**
 * O evento em cartaz, vindo da API da loja.
 *
 * `placeholderData` é o evento embutido no bundle: o banner aparece no primeiro
 * paint em vez de piscar, e a resposta da API substitui em seguida.
 */
export function useActiveEvent(): {
  event: EventConfig
  visible: boolean
  isPlaceholder: boolean
} {
  const { data, isPlaceholderData } = useQuery<EventConfig | null>({
    queryKey: ACTIVE_EVENT_QUERY_KEY,
    queryFn: async () => {
      const event = await fetchActiveEvent()
      writeCachedEvent(event)
      return event
    },
    placeholderData: () => readCachedEvent() ?? FALLBACK_EVENT,
    staleTime: 1000 * 60 * 5,
  })

  // `event` nunca é nulo, para quem renderiza não precisar de guarda; quem diz
  // se há algo em cartaz é `visible`. `data === null` = a admin arquivou tudo.
  return {
    event: data ?? FALLBACK_EVENT,
    visible: data != null && isEventVisible(data),
    isPlaceholder: isPlaceholderData,
  }
}
