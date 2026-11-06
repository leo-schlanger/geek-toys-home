// Nono, the GeekPop mascot: one place for the artwork and its alt text.
import wave320 from "@/assets/nono/nono-acenando-320.webp";
import wave640 from "@/assets/nono/nono-acenando-640.webp";
import wave960 from "@/assets/nono/nono-acenando-960.webp";
import heart160 from "@/assets/nono/nono-coracao-160.webp";
import heart320 from "@/assets/nono/nono-coracao-320.webp";
import cool160 from "@/assets/nono/nono-oculos-160.webp";
import cool320 from "@/assets/nono/nono-oculos-320.webp";

export interface NonoPose {
  src: string;
  srcSet: string;
  /** Intrinsic size of the largest file, for the aspect ratio. */
  width: number;
  height: number;
  alt: string;
}

export const NONO_WAVE: NonoPose = {
  src: wave640,
  srcSet: `${wave320} 320w, ${wave640} 640w, ${wave960} 960w`,
  width: 960,
  height: 996,
  alt: "Nono, o tigre branco mascote da GeekPop, de moletom preto da GeekPop, piscando e acenando com a patinha rosa",
};

export const NONO_HEART: NonoPose = {
  src: heart320,
  srcSet: `${heart160} 160w, ${heart320} 320w`,
  width: 320,
  height: 322,
  alt: "Nono, o tigre da GeekPop, sorrindo de olhos fechados e abraçando um coração rosa",
};

export const NONO_COOL: NonoPose = {
  src: cool320,
  srcSet: `${cool160} 160w, ${cool320} 320w`,
  width: 320,
  height: 281,
  alt: "Nono, o tigre da GeekPop, de óculos escuros e cara de estiloso",
};
