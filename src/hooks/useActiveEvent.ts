import { useQuery } from '@tanstack/react-query'
import { fetchActiveEvent } from '@/lib/shop-api'
import { FALLBACK_EVENT, isEventVisible, type EventConfig } from '@/data/event'

/** Chave compartilhada — banner, navbar, hero e seção do evento leem o mesmo cache. */
export const ACTIVE_EVENT_QUERY_KEY = ['events', 'active'] as const

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
    queryFn: fetchActiveEvent,
    placeholderData: FALLBACK_EVENT,
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
