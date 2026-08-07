import { MessageCircle, ShoppingBag, Sparkles, Ticket } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { SocialIcon } from "./SocialIcon";
import { ACTIVE_EVENT, isEventVisible } from "@/data/event";
import { primaryWhatsAppUrl } from "@/data/contacts";

const SHOP_URL = "https://shop.geeketoys.com.br";
const CLUB_URL = "https://club.geeketoys.com.br";

/** Redes sociais oficiais — sem Shopee / Mercado Livre (pedido Laura). */
const socials = [
  { label: "Facebook", href: "https://www.facebook.com/geeketoyscolection/", icon: "fb" },
  { label: "Instagram", href: "https://www.instagram.com/geeketoys/", icon: "ig" },
  { label: "TikTok", href: "https://www.tiktok.com/@geeketoys", icon: "tt" },
  { label: "WhatsApp", href: primaryWhatsAppUrl(), icon: "wa" },
];

const HeroSection = () => {
  const eventOn = isEventVisible(ACTIVE_EVENT);

  return (
    <section
      id="inicio"
      className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "var(--event-banner-h, 0px)" }}
    >
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="GeekPop & Toys Collection store"
          className="w-full h-full object-cover opacity-25"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/10" />
      </div>

      <div className="container relative z-10 pt-20 pb-12">
        <div className="flex flex-col items-center text-center lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:text-left">
          <div className="mb-8 lg:mb-0 animate-fade-up flex justify-center lg:justify-center">
            <img
              src="/logo3d.jpg"
              alt="GeekPop & Toys Official Logo"
              className="w-full max-w-[280px] lg:max-w-[340px] h-auto drop-shadow-2xl rounded-2xl ring-4 ring-primary/15"
            />
          </div>
          <div className="flex flex-col items-center lg:items-start w-full">
            <p
              className="text-lg md:text-xl text-muted-foreground mb-6 animate-fade-up max-w-lg leading-relaxed"
              style={{ animationDelay: "0.15s" }}
            >
              Há 15 anos trazendo o melhor do universo geek para o Brasil —{" "}
              <span className="text-foreground font-semibold">Pioneiros do Funko Pop no país!</span>{" "}
              Compre na loja online, entre no Clube e participe dos nossos eventos.
            </p>

            <div
              className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto animate-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              <a
                href="#produtos"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-full font-bold text-sm md:text-base hover:brightness-110 transition-all shadow-lg shadow-primary/25"
              >
                <ShoppingBag size={20} />
                Ver produtos
              </a>
              <a
                href={SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary/40 text-foreground bg-card px-6 py-3.5 rounded-full font-bold text-sm md:text-base hover:border-primary hover:bg-primary/5 transition-all"
              >
                Abrir loja online
              </a>
              <a
                href={`${CLUB_URL}/assinar`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-3.5 rounded-full font-bold text-sm md:text-base hover:brightness-105 transition-all shadow-md shadow-accent/30"
              >
                <Sparkles size={20} />
                Assinar o Clube
              </a>
              {eventOn && (
                <a
                  href="#ingressos"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary bg-card px-6 py-3.5 rounded-full font-bold text-sm md:text-base hover:bg-primary/5 transition-all"
                >
                  <Ticket size={20} />
                  Ingresso do evento
                </a>
              )}
            </div>

            <a
              href={primaryWhatsAppUrl("Olá! Vim pelo site geeketoys.com.br 👋")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-[#25D366] transition-colors animate-fade-up"
              style={{ animationDelay: "0.35s" }}
            >
              <MessageCircle size={18} className="text-[#25D366]" />
              Fale conosco no WhatsApp da loja
            </a>
          </div>
        </div>
      </div>

      <div className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
        {socials.map((s) => (
          <a
            key={s.icon}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-primary hover:border-primary hover:shadow-md hover:shadow-primary/20 transition-all"
            aria-label={s.label}
          >
            <SocialIcon type={s.icon} />
          </a>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
