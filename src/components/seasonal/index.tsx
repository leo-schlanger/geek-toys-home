/**
 * Seasonal themes: one entry point for the site. Each season lives in its own
 * folder and gates itself by date; outside the window its slots render null.
 */
export {
  NatalBannerSlot,
  NatalFooterSlot,
  NatalHeaderSlot,
  NatalHeroSlot,
  NatalNonoHatSlot,
  NONO_HAT_ROOM,
  useNatalActive,
  type NonoHatPose,
} from "./natal";
