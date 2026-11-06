import { useEffect, useRef } from "react";
import { Heart, MapPin } from "lucide-react";
import { NONO_COOL, NONO_HEART, NONO_WAVE } from "@/lib/nono";

const extras = [
  { pose: NONO_HEART, caption: "Distribuindo amor" },
  { pose: NONO_COOL, caption: "Estilo K-pop" },
];

const NonoSection = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("visible");
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="nono"
      ref={ref}
      aria-labelledby="nono-title"
      className="section-fade-in relative overflow-hidden py-20 md:py-28 bg-secondary/40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="container relative">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12">
          <div className="min-w-0 order-2 md:order-1">
            <p className="mb-3 inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent-foreground">
              Conheça o nosso mascote!
            </p>
            <h2
              id="nono-title"
              className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2"
            >
              Conheça o <span className="text-primary">Nono</span>, o tigre da GeekPop
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full mb-6" />

            <p className="text-lg text-foreground/90 leading-relaxed mb-4">
              Sempre com a GeekPop, espalhando <strong className="text-primary">K-pop</strong>,{" "}
              <strong className="text-foreground">diversão</strong> e muito{" "}
              <strong className="text-primary">amor</strong>!
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              O Nono é um tigrinho branco de moletom da GeekPop que vive na nossa loja em
              Copacabana. Ele recebe cada fã com um aceno, ajuda a escolher photocards e não perde
              um evento. Passe na loja para dar um oi para ele!
            </p>

            <ul className="mb-8 grid grid-cols-2 gap-4 max-w-sm">
              {extras.map(({ pose, caption }) => (
                <li
                  key={caption}
                  className="min-w-0 flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm"
                >
                  <img
                    src={pose.src}
                    srcSet={pose.srcSet}
                    sizes="(min-width: 768px) 140px, 40vw"
                    width={pose.width}
                    height={pose.height}
                    alt={pose.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-24 w-auto md:h-28 nono-bob"
                  />
                  <span className="text-xs font-semibold text-foreground/80 text-center">
                    {caption}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="#localizacao"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-full font-bold text-sm md:text-base hover:brightness-110 transition-all shadow-lg shadow-primary/25"
            >
              <MapPin size={20} aria-hidden="true" />
              Vem conhecer o Nono de pertinho
              <Heart size={16} className="fill-current" aria-hidden="true" />
            </a>
          </div>

          <div className="min-w-0 order-1 md:order-2 flex justify-center">
            <img
              src={NONO_WAVE.src}
              srcSet={NONO_WAVE.srcSet}
              sizes="(min-width: 1024px) 440px, (min-width: 768px) 40vw, 72vw"
              width={NONO_WAVE.width}
              height={NONO_WAVE.height}
              alt={NONO_WAVE.alt}
              loading="lazy"
              decoding="async"
              className="w-[72vw] max-w-[300px] md:w-full md:max-w-[440px] h-auto drop-shadow-xl nono-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NonoSection;
