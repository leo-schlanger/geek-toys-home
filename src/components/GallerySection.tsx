import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

/** Fotos fixas da loja (assets no bundle). */
const STORE_IMAGES = [
  { src: gallery1, alt: "GeekPop & Toys — loja 1" },
  { src: gallery2, alt: "GeekPop & Toys — loja 2" },
  { src: gallery3, alt: "GeekPop & Toys — loja 3" },
  { src: gallery4, alt: "GeekPop & Toys — loja 4" },
  { src: gallery5, alt: "GeekPop & Toys — loja 5" },
  { src: gallery6, alt: "GeekPop & Toys — loja 6" },
];

/**
 * Fotos enviadas pela Laura (07/08/2026) — em public/eventos/kpop-night/.
 * Entram na galeria geral do site (não em seção separada de evento).
 */
const EVENT_GALLERY_IMAGES = Array.from({ length: 35 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    src: `/eventos/kpop-night/evento-${n}.jpg`,
    alt: `GeekPop & Toys — foto ${i + 1}`,
  };
});

const images = [...STORE_IMAGES, ...EVENT_GALLERY_IMAGES];

const GallerySection = () => {
  const ref = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  return (
    <>
      <section
        id="galeria"
        ref={ref}
        className="section-fade-in py-20 md:py-28 bg-secondary/40 scroll-mt-28"
      >
        <div className="container">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
            Galeria
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Nossa loja, produtos e momentos GeekPop — toque para ampliar.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setLightbox(img.src)}
                className="group rounded-xl overflow-hidden border border-border shadow-sm hover-glow-primary cursor-pointer text-left"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-foreground"
            aria-label="Fechar"
          >
            <X size={32} />
          </button>
          <img
            src={lightbox}
            alt="Foto ampliada"
            className="max-w-full max-h-[85vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default GallerySection;
