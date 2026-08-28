import { useEffect, useRef, useState } from "react";
import { Tag, X } from "lucide-react";
import { useShopPromo } from "@/hooks/useShopPromo";
import { SHOP_URL } from "@/lib/shop-api";

const STORAGE_PREFIX = "shop-promo-banner-dismissed:";

function storageKey(percent: number) {
  return `${STORAGE_PREFIX}${percent}`;
}

function isDismissed(percent: number): boolean {
  try {
    return localStorage.getItem(storageKey(percent)) === "1";
  } catch {
    return false;
  }
}

/**
 * O aviso do desconto do site, abaixo do anúncio do evento.
 *
 * Mesma faixa fixa do topo, mas com altura própria (`--promo-banner-h`), somada
 * à do evento em `--top-banners-h`. Dois banners escrevendo a mesma variável se
 * apagariam; medir cada um e somar no CSS deixa cada componente dono do seu
 * pedaço, e o do evento não precisou ser mexido.
 *
 * A altura é **medida**, não estimada, pela mesma razão do banner do evento: o
 * texto vem do admin e quebra em telas estreitas, e o que sobrar da estimativa
 * cai por cima da Navbar, que tem z-index menor — foi assim que o botão do menu
 * mobile já ficou impossível de tocar.
 *
 * A dispensa é **por percentual**: quem fechou "5% mais barato" precisa ver
 * "20% mais barato" na campanha seguinte. Mesma chave de armazenamento da loja,
 * mas os domínios são distintos, então cada um guarda a sua.
 */
const ShopPromoBanner = () => {
  const { promo } = useShopPromo();
  const [dismissedPercent, setDismissedPercent] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const visible =
    promo.enabled &&
    promo.bannerEnabled &&
    promo.bannerText.trim().length > 0 &&
    dismissedPercent !== promo.percent &&
    !isDismissed(promo.percent);

  useEffect(() => {
    const root = document.documentElement;
    if (!visible) {
      root.style.setProperty("--promo-banner-h", "0px");
      return;
    }
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      root.style.setProperty(
        "--promo-banner-h",
        `${Math.ceil(el.getBoundingClientRect().height)}px`,
      );
    };
    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty("--promo-banner-h", "0px");
    };
  }, [visible, promo.bannerText]);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(storageKey(promo.percent), "1");
    } catch {
      /* ignore */
    }
    setDismissedPercent(promo.percent);
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Aviso de promoção da loja"
      className="fixed left-0 right-0 z-[59] border-b border-accent/40 bg-accent/15 text-foreground backdrop-blur"
      style={{ top: "var(--event-banner-h, 0px)" }}
    >
      <div className="container relative flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 pr-10 text-center md:pr-12">
        <Tag className="hidden h-4 w-4 shrink-0 text-primary sm:inline" aria-hidden />
        <p className="text-sm font-medium leading-snug">{promo.bannerText}</p>
        <a
          href={SHOP_URL}
          className="text-xs font-semibold text-primary underline-offset-2 hover:underline md:text-sm"
        >
          Ir para a loja
        </a>

        <button
          type="button"
          onClick={dismiss}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-3 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Fechar aviso de promoção"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ShopPromoBanner;
