/**
 * Seasonal theme gate: Natal (13 Nov – 26 Dec, Rio).
 * Outside the window every slot renders null and the lazy chunks (art, CSS)
 * are never requested. `?season=natal|off` forces it, for qa only.
 * To remove: delete this folder and the Natal lines in ../index.tsx, the
 * slots in Index, Navbar, HeroSection and Footer, and `--natal-banner-h`
 * in index.css.
 */
import { lazy, Suspense, useLayoutEffect, useState } from "react";
import { NATAL_BANNER_DISMISS_KEY, NATAL_WINDOW, resolveNatal } from "./isNatalActive";

const Banner = lazy(() => import("./NatalBanner"));
const HeaderLights = lazy(() => import("./NatalHeaderLights"));
const HeroScene = lazy(() => import("./NatalHeroScene"));
const FooterScene = lazy(() => import("./NatalFooterScene"));

function readActive(): boolean {
  if (typeof window === "undefined") return false;
  return resolveNatal(new Date(), window.location.search);
}

// Read once per page load: SPA navigation keeps the same answer.
const ACTIVE_AT_LOAD = readActive();

if (ACTIVE_AT_LOAD && typeof document !== "undefined") {
  const root = document.documentElement;
  root.dataset.season = "natal";
  // A tab left open past the window drops the marker (slots stay until reload).
  const msLeft = Date.parse(NATAL_WINDOW.end) - Date.now();
  if (msLeft > 0 && msLeft < 2 ** 31 - 1) {
    window.setTimeout(() => {
      if (root.dataset.season === "natal") delete root.dataset.season;
    }, msLeft);
  }
}

export function useNatalActive(): boolean {
  const [active] = useState(ACTIVE_AT_LOAD);
  return active;
}

function isDismissed(): boolean {
  try {
    return localStorage.getItem(NATAL_BANNER_DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

/** Strip height (h-10). Same number for the fallback and the page offset. */
export const NATAL_BANNER_H = "40px";

/**
 * Christmas strip, fixed below the event and promo notices. Publishes
 * --natal-banner-h (summed into --top-banners-h) while it shows, so the
 * Navbar and the hero move down before the chunk arrives: no layout shift.
 */
export function NatalBannerSlot() {
  const active = useNatalActive();
  const [open, setOpen] = useState(() => !isDismissed());
  const show = active && open;

  useLayoutEffect(() => {
    if (!show) return;
    const root = document.documentElement;
    root.style.setProperty("--natal-banner-h", NATAL_BANNER_H);
    return () => {
      root.style.setProperty("--natal-banner-h", "0px");
    };
  }, [show]);

  if (!show) return null;

  const close = () => {
    try {
      localStorage.setItem(NATAL_BANNER_DISMISS_KEY, "1");
    } catch {
      /* private mode: closes for this view only */
    }
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label="Mensagem de Natal"
      data-natal-banner
      className="fixed left-0 right-0 z-[58]"
      style={{ top: "calc(var(--event-banner-h, 0px) + var(--promo-banner-h, 0px))", height: NATAL_BANNER_H }}
    >
      <Suspense fallback={<div className="h-10 bg-[#181825]" />}>
        <Banner onClose={close} />
      </Suspense>
    </div>
  );
}

function lazySlot(Component: React.ComponentType) {
  return function Slot() {
    const active = useNatalActive();
    if (!active) return null;
    return (
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    );
  };
}

/** Lights under the Navbar. The Navbar is `fixed`, so it is the anchor. */
export const NatalHeaderSlot = lazySlot(HeaderLights);
/** Scene behind the home hero. Parent must be `relative`. */
export const NatalHeroSlot = lazySlot(HeroScene);
/** Scene in the Footer. Parent must be `relative`. */
export const NatalFooterSlot = lazySlot(FooterScene);
