import { GiftShape, GP, PineShape, SnowflakeShape, SnowGround, StarShape } from "./art";
import "./natal.css";

/**
 * Behind the home hero (z-0, under the content): snowy ground along the bottom
 * padding, pines and gifts in the bottom corners and a few flakes in the top
 * corners on wide screens, and a short snowfall in the side gutters only.
 * The right group stays clear of the WhatsApp button (fixed, bottom-right).
 * Pinned to edges in px: % positions ended up on titles in other widths (OQD).
 */
const NatalHeroScene = () => (
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
    <div className="gp-natal-snow" data-natal-deco="snow">
      <i />
    </div>

    <svg viewBox="0 0 24 24" className="gp-natal-star absolute right-6 top-[calc(var(--top-banners-h,0px)+104px)] hidden w-7 2xl:block" data-natal-deco="star">
      <StarShape />
    </svg>
    <svg viewBox="0 0 24 24" className="absolute left-4 top-[calc(var(--top-banners-h,0px)+112px)] hidden w-6 opacity-70 2xl:block" data-natal-deco="flake-left">
      <SnowflakeShape stroke={GP.neveSombra} />
    </svg>

    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-6 w-full md:h-9" data-natal-deco="hero-ground">
      <SnowGround />
    </svg>
    <div className="absolute bottom-2 left-0 hidden items-end lg:flex" data-natal-deco="hero-pines-left">
      <svg viewBox="0 -4 60 94" className="w-12">
        <PineShape lights star />
      </svg>
      <svg viewBox="0 -4 60 94" className="-ml-2 w-8">
        <PineShape fill={GP.pinheiroEsc} />
      </svg>
      <svg viewBox="0 0 48 48" className="-ml-1 w-7">
        <GiftShape />
      </svg>
    </div>
    <div className="absolute bottom-2 right-24 hidden items-end lg:flex" data-natal-deco="hero-pines-right">
      <svg viewBox="0 0 48 48" className="-mr-1 w-7">
        <GiftShape box={GP.amarelo} ribbon={GP.rosa} />
      </svg>
      <svg viewBox="0 -4 60 94" className="w-8">
        <PineShape fill={GP.pinheiroEsc} />
      </svg>
      <svg viewBox="0 -4 60 94" className="-ml-2 w-12">
        <PineShape lights star />
      </svg>
    </div>
  </div>
);

export default NatalHeroScene;
