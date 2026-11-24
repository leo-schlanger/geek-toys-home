import { lazyPage, preloadPage } from "./lib/lazy-page";

// Secondary routes load on demand: the home ships without their code.
export const TermsOfUse = lazyPage(() => import("./pages/TermsOfUse"));
export const PrivacyPolicy = lazyPage(() => import("./pages/PrivacyPolicy"));
export const Gallery = lazyPage(() => import("./pages/Gallery"));
export const Links = lazyPage(() => import("./pages/Links"));
export const NotFound = lazyPage(() => import("./pages/NotFound"));

/** Page a pathname renders, as in <AppRoutes>; null for the home (not lazy). */
function pageFor(pathname: string) {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/") return null;
  if (p === "/termos") return TermsOfUse;
  if (p === "/privacidade") return PrivacyPolicy;
  if (p === "/galeria" || /^\/galeria\/[^/]+$/.test(p)) return Gallery;
  if (p === "/links") return Links;
  return NotFound;
}

/**
 * Loads the chunk of the page at `pathname` before the first render, so the
 * prerendered HTML stays on screen instead of a blank Suspense fallback.
 */
export function preloadRoute(pathname: string): Promise<void> {
  const page = pageFor(pathname);
  return page ? preloadPage(page) : Promise.resolve();
}
