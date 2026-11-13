/**
 * Christmas pieces drawn in code for GeekPop & Toys: brand pink and yellow
 * lead, pine green only as a supporting detail, snow white. No purple.
 */
export const GP = {
  rosa: "#EE2B8C",
  rosaEsc: "#B81D6A",
  amarelo: "#FFCC00",
  amareloEsc: "#D9A400",
  pinheiro: "#1F7A4D",
  pinheiroEsc: "#145C39",
  neve: "#FFFFFF",
  neveSombra: "#E3E9F0",
  tronco: "#6B4A33",
} as const;

/** Pine in a 60×90 box: three tiers with snow, optional bulbs and star. */
export function PineShape({
  fill = GP.pinheiro,
  lights = false,
  star = false,
}: {
  fill?: string;
  lights?: boolean;
  star?: boolean;
}) {
  const bulbs = [GP.rosa, GP.amarelo, GP.neve];
  return (
    <g strokeLinejoin="round">
      <rect x={26} y={76} width={8} height={14} rx={1.5} fill={GP.tronco} />
      <path d="M30 34 52 66Q53 70 48 70H12Q7 70 8 66Z" fill={fill} />
      <path d="M30 20 47 46Q48 50 44 50H16Q12 50 13 46Z" fill={fill} />
      <path d="M30 6 42 28Q43 31 40 31H20Q17 31 18 28Z" fill={fill} />
      <g fill={GP.neve}>
        <path d="M13 70h35q5 0 4-3.5-4 3.5-8 1.5-4 3-8 0-4 3-8 0-4 3-8 0-4 2-7-1Q8 70 13 70Z" />
        <path d="M16 50h28q4 0 3-3-3 3-6 1-3 2.5-6 0-3 2.5-6 0-3 2.5-6 0-3 2-6-1Q12 50 16 50Z" />
        <path d="M20 31h20q3 0 2-2.5-2 2-4.5.6-2.5 2-5 0-2.5 2-5 0-2.5 1.6-4.5-.6Q17 31 20 31Z" />
      </g>
      {lights &&
        [
          [20, 44], [34, 41], [41, 45], [26, 25], [35, 26], [16, 64], [27, 60], [39, 62], [47, 65], [31, 52],
        ].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.2} fill={bulbs[i % bulbs.length]} />)}
      {star && (
        <path
          d="M30 -3l2.6 5.2 5.8.9-4.2 4.1 1 5.7L30 10.2l-5.2 2.7 1-5.7-4.2-4.1 5.8-.9Z"
          fill={GP.amarelo}
          stroke={GP.amareloEsc}
          strokeWidth={0.8}
        />
      )}
    </g>
  );
}

/** Five-point star in a 24×24 box. */
export function StarShape({ fill = GP.amarelo, stroke = GP.amareloEsc }: { fill?: string; stroke?: string }) {
  return (
    <path
      d="M12 1.5l3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.3l-6.2 3.3L7 13.7 2 8.8l6.9-1Z"
      fill={fill}
      stroke={stroke}
      strokeWidth={1}
      strokeLinejoin="round"
    />
  );
}

/** Six-arm snowflake in a 24×24 box (stroke only). */
export function SnowflakeShape({ stroke = GP.neve, width = 1.6 }: { stroke?: string; width?: number }) {
  return (
    <g stroke={stroke} strokeWidth={width} strokeLinecap="round" fill="none">
      {[0, 60, 120].map((r) => (
        <g key={r} transform={`rotate(${r} 12 12)`}>
          <path d="M12 2v20" />
          <path d="M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" />
        </g>
      ))}
    </g>
  );
}

/** Gift box in a 48×48 box with ribbon and bow. */
export function GiftShape({ box = GP.rosa, ribbon = GP.amarelo }: { box?: string; ribbon?: string }) {
  return (
    <g strokeLinejoin="round">
      <rect x={6} y={22} width={36} height={24} rx={2.5} fill={box} />
      <rect x={21} y={22} width={6} height={24} fill={ribbon} />
      <rect x={6} y={22} width={36} height={4} fill="#000" opacity={0.12} />
      <rect x={3} y={15} width={42} height={9} rx={2} fill={box} />
      <rect x={21} y={15} width={6} height={9} fill={ribbon} />
      <path d="M24 15c-3-7-12-9-12-3 0 3 6 4 12 3Zm0 0c3-7 12-9 12-3 0 3-6 4-12 3Z" fill={ribbon} stroke={GP.amareloEsc} strokeWidth={1} />
    </g>
  );
}

/** Holly sprig (two leaves, three berries in brand pink) in a 48×32 box. */
export function HollyShape() {
  return (
    <g>
      <path d="M24 16C18 6 8 4 2 8c3 1 3 4 1 6 3 0 5 2 4 5 3-2 6-1 7 2 1-3 4-4 7-3-1-1 0-2 3-2Z" fill={GP.pinheiro} />
      <path d="M24 16c6-10 16-12 22-8-3 1-3 4-1 6-3 0-5 2-4 5-3-2-6-1-7 2-1-3-4-4-7-3 1-1 0-2-3-2Z" fill={GP.pinheiroEsc} />
      <circle cx={21} cy={18} r={4} fill={GP.rosa} />
      <circle cx={27.5} cy={18.5} r={4} fill={GP.rosaEsc} />
      <circle cx={24} cy={23.5} r={4} fill={GP.rosa} />
      <circle cx={20} cy={16.6} r={1.1} fill="#fff" opacity={0.7} />
    </g>
  );
}

/** Snowy ground in a 1440×60 box (stretched). */
export function SnowGround() {
  return (
    <>
      <path d="M0 26C200 10 420 16 640 28S1080 44 1280 26 1420 18 1440 20V60H0Z" fill={GP.neveSombra} />
      <path d="M0 38C220 24 440 30 660 40S1100 52 1300 38 1420 32 1440 34V60H0Z" fill={GP.neve} />
    </>
  );
}
