import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Percent, Sparkles, Tag, ArrowRight, ImageOff } from "lucide-react";
import {
  CLUB_URL,
  SHOP_URL,
  fetchProducts,
  formatBRL,
  isOnSale,
  productUrl,
} from "@/lib/shop-api";
import { ACTIVE_EVENT, isEventVisible } from "@/data/event";

/**
 * Novidades + Sale/promoção (pedido Laura, estilo iBox).
 */
const PromoSection = () => {
  const ref = useRef<HTMLElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["home-promo-products"],
    queryFn: () => fetchProducts({ limit: 24 }),
    staleTime: 60_000,
  });

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

  const all = data?.products ?? [];
  const onSale = all.filter(isOnSale).slice(0, 8);
  const novidades = all.filter((p) => !isOnSale(p)).slice(0, 8);
  const eventOn = isEventVisible(ACTIVE_EVENT);

  return (
    <section
      id="promocoes"
      ref={ref}
      className="section-fade-in py-16 md:py-24 bg-secondary/40 scroll-mt-28"
    >
      <div className="container">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/30 text-accent-foreground px-3 py-1 text-xs font-bold uppercase tracking-wide mb-3">
            <Tag className="h-3.5 w-3.5" />
            Novidades &amp; promoções
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Sale e destaques
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ofertas da loja, vantagens do Clube e o que está bombando agora.
          </p>
        </div>

        {/* Cards de campanha */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <a
            href={`${CLUB_URL}/assinar`}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/30 via-card to-card p-6 shadow-sm hover-glow-primary transition-all group"
          >
            <Percent className="h-8 w-8 text-accent-foreground mb-3" />
            <h3 className="font-heading text-xl font-bold text-foreground mb-1">
              15% OFF no Clube
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Assine o Clube GeekPop e ganhe 15% em qualquer produto da loja online
              e física.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:underline">
              Quero o desconto <ArrowRight className="h-4 w-4" />
            </span>
          </a>

          {eventOn && (
            <a
              href="#evento"
              className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-card p-6 shadow-sm hover-glow-primary transition-all group"
            >
              <Sparkles className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading text-xl font-bold text-foreground mb-1">
                {ACTIVE_EVENT.shortTitle}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                6 de setembro · 14h–18h · Ingresso R${" "}
                {ACTIVE_EVENT.ticketReservation.priceBRL ?? "—"}. Criança de colo e
                PCD não pagam.
              </p>
              <span className="inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:underline">
                Reservar ingresso <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          )}

          <a
            href={SHOP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm hover-glow-primary transition-all group md:col-span-2 lg:col-span-1"
          >
            <Tag className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-heading text-xl font-bold text-foreground mb-1">
              Vitrine online
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Photocards, Funko, pelúcias e mais — compre direto em
              shop.geeketoys.com.br.
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:underline">
              Ver catálogo <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        </div>

        {/* Sale products (quando houver compareAtPrice) */}
        {onSale.length > 0 && (
          <div className="mb-12">
            <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Percent className="h-5 w-5 text-destructive" />
              Sale!
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {onSale.map((p) => (
                <a
                  key={p.id}
                  href={productUrl(p.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover-glow-primary transition-all group"
                >
                  <div className="aspect-square bg-secondary/50 relative">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ImageOff className="h-8 w-8 opacity-50" />
                      </div>
                    )}
                    <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
                      Promo
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-semibold">{p.name}</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-bold">{formatBRL(p.price)}</span>
                      {p.compareAtPrice != null && (
                        <span className="text-xs line-through text-muted-foreground">
                          {formatBRL(p.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Novidades */}
        <div>
          <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Novidades
          </h3>
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-card animate-pulse" />
              ))}
            </div>
          )}
          {!isLoading && novidades.length === 0 && (
            <p className="text-muted-foreground text-center py-6">
              Em breve mais novidades — acompanhe o Instagram{" "}
              <a
                href="https://www.instagram.com/geeketoys/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-semibold hover:underline"
              >
                @geeketoys
              </a>
              .
            </p>
          )}
          {novidades.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {novidades.slice(0, 8).map((p) => (
                <a
                  key={p.id}
                  href={productUrl(p.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover-glow-primary transition-all group"
                >
                  <div className="aspect-square bg-secondary/50 relative">
                    {p.images?.[0] ? (
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ImageOff className="h-8 w-8 opacity-50" />
                      </div>
                    )}
                    <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                      Novo
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-semibold group-hover:text-primary transition-colors">
                      {p.name}
                    </p>
                    <p className="mt-1 font-bold">{formatBRL(p.price)}</p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
