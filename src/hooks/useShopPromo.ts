import { useQuery } from '@tanstack/react-query'
import { fetchShopPromo, PROMO_OFF, type ShopPromo } from '@/lib/shop-api'

/** Chave compartilhada — o aviso e os preços dos produtos leem o mesmo cache. */
export const SHOP_PROMO_QUERY_KEY = ['shop', 'promo'] as const

/**
 * A promoção do canal online, vinda da API da loja.
 *
 * Ao contrário do evento, o `placeholderData` aqui é "sem promoção", não o
 * valor provável: anunciar um desconto que não existe é um preço que a loja não
 * honra, enquanto não anunciar por um instante só deixa de valorizar. A loja
 * refaz a conta do pedido de qualquer jeito.
 */
export function useShopPromo(): { promo: ShopPromo; loading: boolean } {
  const { data, isLoading } = useQuery<ShopPromo>({
    queryKey: SHOP_PROMO_QUERY_KEY,
    queryFn: fetchShopPromo,
    placeholderData: PROMO_OFF,
    staleTime: 1000 * 60 * 5,
  })

  return { promo: data ?? PROMO_OFF, loading: isLoading }
}
