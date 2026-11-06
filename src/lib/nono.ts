// Nono, the GeekPop mascot: one place for the artwork and its alt text.
// The sitting pose (nono-acenando-*.webp) is no longer used on the home.
import standing320 from "@/assets/nono/nono-de-pe-320.webp";
import standing640 from "@/assets/nono/nono-de-pe-640.webp";
import standing960 from "@/assets/nono/nono-de-pe-960.webp";
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

/** Main pose on the home: standing, streetwear, waving. */
export const NONO_STANDING: NonoPose = {
  src: standing640,
  srcSet: `${standing320} 320w, ${standing640} 640w, ${standing960} 960w`,
  width: 960,
  height: 1183,
  alt: "Nono, o tigre branco mascote da GeekPop, de pé com moletom preto da GeekPop, calça cargo e tênis, piscando e acenando com a patinha rosa",
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

/**
 * What Nono says in his speech bubbles. Plain HTML text, so it is indexable;
 * edit here. Keep it short and never about prices (CONANDA 163/2014: no
 * advertising aimed at children through a mascot).
 */
export const NONO_LINES = {
  section: "Oi! Eu sou o Nono. Vem me dar um oi na loja!",
  location: "Tô te esperando aqui em Copacabana!",
  notFound: "Ops! Essa página se perdeu… bora voltar?",
} as const;
