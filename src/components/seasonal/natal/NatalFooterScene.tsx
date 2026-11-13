import { GiftShape, GP, HollyShape, PineShape, SnowGround } from "./art";
import "./natal.css";

/**
 * Footer: lights along the top edge, holly in the top corners, snowy ground
 * with pines and gifts in the bottom-left corner (the WhatsApp button owns the
 * bottom-right). Everything is pinned to edges in px, never to % of the
 * footer height: that lands on text when the columns wrap. The right holly
 * keeps clear of the fixed social column (md+).
 */
const NatalFooterScene = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
    <div className="gp-natal-lights top-0" data-natal-deco="footer-lights" />
    <svg viewBox="0 0 48 32" className="absolute left-1 top-4 w-12 -rotate-12 md:left-4 md:w-16" data-natal-deco="holly-left">
      <HollyShape />
    </svg>
    <svg viewBox="0 0 48 32" className="absolute right-1 top-4 w-12 rotate-12 -scale-x-100 md:right-20 md:w-16" data-natal-deco="holly-right">
      <HollyShape />
    </svg>
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-5 w-full md:h-7" data-natal-deco="footer-ground">
      <SnowGround />
    </svg>
    <div className="absolute bottom-1 left-1 flex items-end md:left-6" data-natal-deco="footer-pines">
      <svg viewBox="0 -4 60 94" className="w-7 md:w-10">
        <PineShape lights star />
      </svg>
      <svg viewBox="0 -4 60 94" className="-ml-1 w-5 md:w-7">
        <PineShape fill={GP.pinheiroEsc} />
      </svg>
      <svg viewBox="0 0 48 48" className="-ml-1 w-5 md:w-6">
        <GiftShape />
      </svg>
    </div>
  </div>
);

export default NatalFooterScene;
