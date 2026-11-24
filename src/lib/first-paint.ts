/**
 * Inline script the build puts right after the home's prerendered body
 * (vite.config.ts). It runs before the first paint and publishes the heights
 * of the fixed strips the app will mount (promo, Natal), so the hero and its
 * <h1> start where they end up instead of jumping ~130 px down when the
 * bundle arrives late. Same rules as the components: ShopPromoBanner reserves
 * the build's promo hint unless that percent was dismissed; NatalBannerSlot
 * shows in the window (or `?season=`) unless dismissed.
 *
 * No `@/` imports: vite.config.ts loads this file before aliases exist.
 */
import {
  NATAL_BANNER_DISMISS_KEY,
  NATAL_WINDOW,
} from '../components/seasonal/natal/isNatalActive'

/** Same values as ShopPromoBanner (storage key) and NatalBannerSlot (height). */
export const PROMO_DISMISS_PREFIX = 'shop-promo-banner-dismissed:'
export const NATAL_STRIP_H = '40px'

export function firstPaintScript(): string {
  const start = Date.parse(NATAL_WINDOW.start)
  const end = Date.parse(NATAL_WINDOW.end)
  return `<script>(function(){try{
var r=document.documentElement,st=r.style,get=function(k){try{return localStorage.getItem(k)}catch(e){return null}};
var q=new URLSearchParams(location.search).get("season"),t=Date.now();
if(q==="natal"||(q!=="off"&&t>=${start}&&t<${end})){r.dataset.season="natal";if(get(${JSON.stringify(NATAL_BANNER_DISMISS_KEY)})!=="1")st.setProperty("--natal-banner-h",${JSON.stringify(NATAL_STRIP_H)})}
var p=document.querySelector("[data-promo-reserve]");
if(p){if(get(${JSON.stringify(PROMO_DISMISS_PREFIX)}+p.getAttribute("data-percent"))==="1")p.remove();else st.setProperty("--promo-banner-h",Math.ceil(p.getBoundingClientRect().height)+"px")}
}catch(e){}})()</script>`
}
