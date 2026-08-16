import { useEffect, useRef, useState } from "react";
import { CalendarHeart, Ticket, X } from "lucide-react";
import { ACTIVE_EVENT, isEventVisible } from "@/data/event";

const STORAGE_PREFIX = "event-banner-dismissed:";

function storageKey(eventId: string) {
  return `${STORAGE_PREFIX}${eventId}`;
}

function readBannerVisible(eventId: string): boolean {
  if (!isEventVisible(ACTIVE_EVENT)) return false;
  try {
    return localStorage.getItem(storageKey(eventId)) !== "1";
  } catch {
    return true;
  }
}

/**
 * Banner fixo no topo do site. Deslocamento da Navbar via CSS var --event-banner-h.
 *
 * A altura e **medida**, nao estimada. Ate 16/08/2026 eram dois numeros fixos
 * (44px acima de 768px, 72px abaixo). O texto do banner vem de `data/event.ts`
 * e cresceu: a 390px ele quebrava em 111px, a var continuava dizendo 72px, e os
 * 39px de sobra ficavam por cima da Navbar — que tem z-index menor. O resultado
 * era o **hamburguer do menu mobile intocavel no celular**: o clique caia no
 * banner. Como o texto e conteudo editavel, qualquer numero fixo aqui volta a
 * errar na proxima vez que a Laura mudar a frase.
 */
const EventAnnouncementBanner = () => {
  const event = ACTIVE_EVENT;
  const [visible, setVisible] = useState(() => readBannerVisible(event.id));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!visible || !isEventVisible(event)) {
      root.style.setProperty("--event-banner-h", "0px");
      return;
    }
    const el = ref.current;
    if (!el) return;

    const apply = () => {
      root.style.setProperty("--event-banner-h", `${Math.ceil(el.getBoundingClientRect().height)}px`);
    };
    apply();

    // Pega quebra de linha por rotacao, zoom, fonte tardia ou texto novo —
    // casos que um matchMedia por largura nao enxerga.
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty("--event-banner-h", "0px");
    };
  }, [visible, event]);

  if (!visible || !isEventVisible(event)) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(storageKey(event.id), "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Anúncio do evento"
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground shadow-md border-b border-primary/40"
    >
      <div className="container flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 py-2.5 pr-10 md:pr-12 relative text-center md:text-left">
        <p className="text-sm md:text-[15px] font-semibold leading-snug flex items-center gap-2">
          <CalendarHeart className="hidden sm:inline h-4 w-4 shrink-0 opacity-90" aria-hidden />
          <span>{event.bannerText}</span>
        </p>

        <div className="flex items-center gap-2 shrink-0">
          {event.ctaSecondary && (
            <a
              href={event.ctaSecondary.href}
              className="text-xs md:text-sm font-medium underline-offset-2 hover:underline opacity-95"
            >
              {event.ctaSecondary.label}
            </a>
          )}
          <a
            href={event.ctaPrimary.href}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs md:text-sm font-bold hover:brightness-105 transition-all shadow-sm"
          >
            <Ticket className="h-3.5 w-3.5" aria-hidden />
            {event.ctaPrimary.label}
          </a>
        </div>

        <button
          type="button"
          onClick={dismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-white/15 transition-colors"
          aria-label="Fechar anúncio"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default EventAnnouncementBanner;
