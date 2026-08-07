import { useEffect, useRef } from "react";
import { ShoppingBag, Sparkles, Ticket, ArrowRight } from "lucide-react";
import { ACTIVE_EVENT, isEventVisible } from "@/data/event";

const SHOP_URL = "https://shop.geeketoys.com.br";
const CLUB_URL = "https://club.geeketoys.com.br";

/**
 * Cross-promote Clube, Loja online e Evento — pilares do ecossistema GeekPop.
 */
const ChannelsSection = () => {
  const ref = useRef<HTMLElement>(null);
  const eventOn = isEventVisible(ACTIVE_EVENT);

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

  const cards = [
    {
      id: "loja",
      icon: ShoppingBag,
      title: "Loja Online",
      desc: "Compre colecionáveis, K-pop e merch com entrega. Membros do Clube têm 15% OFF no checkout.",
      cta: "Ir para a loja",
      href: SHOP_URL,
      external: true,
      tone: "primary" as const,
    },
    {
      id: "clube",
      icon: Sparkles,
      title: "Clube GeekPop",
      desc: "Plano anual com 15% em qualquer produto, brinde especial e entrada em eventos participantes.",
      cta: "Assinar o clube",
      href: `${CLUB_URL}/assinar`,
      external: true,
      tone: "accent" as const,
    },
    ...(eventOn
      ? [
          {
            id: "evento",
            icon: Ticket,
            title: ACTIVE_EVENT.shortTitle,
            desc: "Reserve seu ingresso online e confira as fotos na galeria do site.",
            cta: "Reservar ingresso",
            href: "#ingressos",
            external: false,
            tone: "primary" as const,
          },
        ]
      : []),
  ];

  return (
    <section
      id="canais"
      ref={ref}
      className="section-fade-in py-16 md:py-24 bg-secondary/50"
    >
      <div className="container">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Clube, loja e eventos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tudo o universo GeekPop em um só lugar — compre online, entre no clube de
            vantagens e participe dos nossos encontros.
          </p>
        </div>

        <div
          className={`grid gap-5 ${
            cards.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 max-w-3xl mx-auto"
          }`}
        >
          {cards.map(({ id, icon: Icon, title, desc, cta, href, external, tone }) => (
            <div
              key={id}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover-glow-primary transition-all"
            >
              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                  tone === "accent"
                    ? "bg-accent/25 text-accent-foreground"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">{desc}</p>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all ${
                  tone === "accent"
                    ? "bg-accent text-accent-foreground hover:brightness-105"
                    : "bg-primary text-primary-foreground hover:brightness-110"
                }`}
              >
                {cta}
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChannelsSection;
