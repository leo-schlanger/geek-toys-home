import { X } from "lucide-react";
import { StarShape } from "./art";
import "./natal.css";

// Canonical shop domain for this strip (the global SHOP_URL stays on the legacy host).
const NATAL_SHOP_URL = "https://shop.geekpoptoys.com.br/";

/**
 * Christmas strip below the other top notices. Fixed height (h-10, one line at
 * any width) so the fallback and the measured offset are the same number.
 * No price, no promotion: just the greeting and the way to the shop.
 */
const NatalBanner = ({ onClose }: { onClose: () => void }) => (
  <div className="gp-natal-banner h-10 text-white">
    <div className="container relative flex h-full items-center justify-center gap-2 pr-10 md:pr-12">
      <svg viewBox="0 0 24 24" className="gp-natal-star hidden h-4 w-4 shrink-0 sm:block" aria-hidden="true">
        <StarShape />
      </svg>
      <p className="flex min-w-0 items-center gap-2 whitespace-nowrap text-[13px] leading-none sm:text-sm">
        <span className="font-heading font-bold text-[#FF7AB8]">Feliz Natal geek! 🎄</span>
        <span className="hidden truncate md:inline">Presentes de K-pop e colecionáveis na loja online</span>
        <a
          href={NATAL_SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 font-semibold text-[#FFCC00] underline underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00] rounded-sm"
        >
          <span className="md:hidden">Presentes na loja</span>
          <span className="hidden md:inline">Ver a loja</span>
        </a>
      </p>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-0 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCC00]"
        aria-label="Fechar mensagem de Natal"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  </div>
);

export default NatalBanner;
