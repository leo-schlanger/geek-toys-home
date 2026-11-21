import type { QueryClient } from '@tanstack/react-query'
import { bootDataReady, hasBootAnswer, hasBootData } from './boot-data'
import { fetchShopPromo } from './shop-api'
import { SHOP_PROMO_QUERY_KEY } from '@/hooks/useShopPromo'
import { ACTIVE_EVENT_QUERY_KEY, activeEventQueryFn } from '@/hooks/useActiveEvent'

/**
 * Waits up to `capMs` for boot.js's answers and puts the ones that arrived in
 * the query cache, so the promo and event strips are there on first paint
 * instead of pushing the hero down. Never waits on the network itself: a
 * missing answer is left to the strips' own query.
 */
export async function primeFirstScreen(client: QueryClient, capMs = 400): Promise<void> {
  if (!hasBootData()) return
  await bootDataReady(capMs)
  const jobs: Promise<void>[] = []
  if (hasBootAnswer('/promo'))
    jobs.push(client.prefetchQuery({ queryKey: SHOP_PROMO_QUERY_KEY, queryFn: fetchShopPromo }))
  if (hasBootAnswer('/events/active'))
    jobs.push(client.prefetchQuery({ queryKey: ACTIVE_EVENT_QUERY_KEY, queryFn: activeEventQueryFn }))
  await Promise.all(jobs)
}
