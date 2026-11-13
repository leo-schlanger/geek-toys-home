export type NonoHatPose = "standing" | "heart" | "cool";

/**
 * Head room the hat needs above each artwork, as padding-top in % of the
 * image width (CSS % padding is width-based). Kept out of the lazy chunk so
 * the space exists from the first paint: no layout shift when the hat loads.
 */
export const NONO_HAT_ROOM: Record<NonoHatPose, number> = {
  standing: 10,
  heart: 9,
  cool: 9,
};
