import type { NonoHatPose } from "./nonoHat";

/**
 * Where the hat sits on each Nono artwork, in % of the image box (and rotation
 * around the brim), so it stays put at any width or DPR. Fitted by eye on each
 * file: ears peek out on the sides, eyes and glasses stay clear.
 */
const FIT: Record<NonoHatPose, { left: number; top: number; width: number; rotate: number }> = {
  standing: { left: 24, top: -7, width: 46, rotate: -10 },
  heart: { left: 22, top: -7, width: 60, rotate: -8 },
  cool: { left: 20, top: -8, width: 62, rotate: -8 },
};

/** Santa hat drawn in code: brand raspberry-red, snow-white brim and pompom. */
const NatalNonoHat = ({ pose }: { pose: NonoHatPose }) => {
  const f = FIT[pose];
  return (
    <svg
      viewBox="0 0 100 72"
      aria-hidden="true"
      data-natal-deco="nono-hat"
      data-pose={pose}
      className="pointer-events-none absolute overflow-visible"
      style={{
        left: `${f.left}%`,
        top: `${f.top}%`,
        width: `${f.width}%`,
        transform: `rotate(${f.rotate}deg)`,
        transformOrigin: "50% 85%",
      }}
    >
      <path
        d="M12 58C15 32 36 10 60 8C79 7 91 19 93 36L94 46C89 38 81 32 74 32C80 40 84 49 86 58Z"
        fill="#E3245F"
        stroke="#2A1A22"
        strokeWidth={2.4}
        strokeLinejoin="round"
      />
      <path d="M40 16C56 9 76 11 86 22C89 27 91 32 92 38C86 32 80 30 74 32C68 22 56 16 40 16Z" fill="#B3164A" opacity={0.5} />
      <path d="M24 44C28 32 36 24 46 19" stroke="#fff" strokeOpacity={0.35} strokeWidth={3} fill="none" strokeLinecap="round" />
      <circle cx={93} cy={48} r={9} fill="#fff" stroke="#2A1A22" strokeWidth={2.4} />
      <circle cx={90.5} cy={45} r={3.2} fill="#E3E9F0" />
      <rect x={4} y={53} width={88} height={17} rx={8.5} fill="#fff" stroke="#2A1A22" strokeWidth={2.4} />
      <path d="M10 65Q48 70 86 65" stroke="#D5DDE7" strokeWidth={3} fill="none" strokeLinecap="round" />
    </svg>
  );
};

export default NatalNonoHat;
