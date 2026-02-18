import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const images = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

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

  return (
    <>
      <section id="galeria" ref={ref} className="section-fade-in py-20 md:py-28 bg-card/30">
        <div className="container">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
            Nossa Loja
          </h2>
          <p className="text-muted-foreground text-center mb-12">
            Conheça nosso espaço e alguns dos nossos produtos
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightbox(src)}
                className="group rounded-xl overflow-hidden border border-border hover-glow-primary cursor-pointer"
              >
                <img
                  src={src}
                  alt={`Galeria ${i + 1}`}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-background/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
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
          />
        </div>
      )}
    </>
  );
};

export default GallerySection;
