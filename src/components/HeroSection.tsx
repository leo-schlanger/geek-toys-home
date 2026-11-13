import { Crown, MessageCircle, ShoppingBag, Tag, Ticket, CalendarCheck } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { SocialIcon } from "./SocialIcon";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import { primaryWhatsAppUrl } from "@/data/contacts";
import { NONO_LINES, NONO_STANDING } from "@/lib/nono";
import { NonoSpeech } from "./NonoSpeech";
import { NatalHeroSlot } from "./seasonal";

import { CLUB_URL, SHOP_URL } from "@/lib/shop-api";

/** Same figures as the club: MEMBER_DISCOUNT_PERCENT (10) and
 *  MEMBER_TICKET_DISCOUNT_PERCENT (50) in clube-geek-toys. No price here. */
const CLUB_PERKS = [
  { icon: Tag, text: "10% de desconto em qualquer produto" },
  { icon: Ticket, text: "Meia-entrada nos eventos da GeekPop" },
  { icon: CalendarCheck, text: "Plano anual: paga uma vez, vale o ano todo" },
];

/** Redes sociais oficiais — sem Shopee / Mercado Livre (pedido Laura). */
const socials = [
  { label: "Facebook", href: "https://www.facebook.com/geeketoyscolection/", icon: "fb" },
  { label: "Instagram", href: "https://www.instagram.com/geeketoys/", icon: "ig" },
  { label: "TikTok", href: "https://www.tiktok.com/@geeketoys", icon: "tt" },
  { label: "WhatsApp", href: primaryWhatsAppUrl(), icon: "wa" },
];

const HeroSection = () => {
  const { visible: eventOn } = useActiveEvent();

  return (
    <section
      id="inicio"
      className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "calc(var(--top-banners-h, 0px) + var(--natal-hero-gap, 0px))" }}
    >
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover opacity-25"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/10" />
      </div>
      <NatalHeroSlot />

      <div className="container relative z-10 pt-20 pb-10 md:pb-12">
        <div className="flex flex-col items-center text-center lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center lg:text-left">
          <div className="min-w-0 flex flex-col items-center lg:items-start w-full">
            {/* Hidden on phones: the navbar already shows the logo, and the club
                call-out has to fit the first screen. */}
            <div className="hidden sm:block mb-6 lg:mb-8 animate-fade-up w-full sm:max-w-[180px] lg:max-w-[300px]">
              <img
                src="/logo3d.jpg"
                alt="Logo da GeekPop & Toys"
                width={1080}
                height={1080}
                className="w-full h-auto drop-shadow-2xl rounded-2xl ring-4 ring-primary/15"
              />
            </div>
            {/* The page's only <h1>: the home had none, and it is the phrase
                people search for. */}
            <h1
              className="font-heading text-[1.65rem] md:text-4xl lg:text-5xl font-bold text-foreground mb-2 md:mb-4 animate-fade-up leading-tight"
              style={{ animationDelay: "0.1s" }}
            >
              Loja de K-pop no Rio de Janeiro
            </h1>
            <p
              className="text-sm md:text-lg text-muted-foreground animate-fade-up max-w-lg leading-relaxed"
              style={{ animationDelay: "0.15s" }}
            >
              Photocards, merch e cultura pop em Copacabana. Há 15 anos no mercado geek; hoje o
              foco é K-pop. Compre online com frete pelos Correios, entre no Clube e venha aos eventos.
            </p>
          </div>

          <div className="min-w-0 flex flex-col items-center lg:items-start w-full mt-4 lg:mt-0">
            {/* Club call-out (Norberto, 07/11/2026). Nono sits here, so no price
                anywhere in this block (CONANDA 163/2014). */}
            <section
              data-club-callout
              aria-labelledby="hero-club-title"
              className="w-full max-w-lg rounded-3xl border-2 border-primary bg-card/95 p-4 md:p-6 text-left shadow-xl shadow-primary/15 animate-fade-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex items-end gap-2">
                <a
                  href="#nono"
                  aria-label="Conheça o Nono, o tigre mascote da GeekPop"
                  className="shrink-0 w-[60px] md:w-24 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <img
                    src={NONO_STANDING.src}
                    srcSet={NONO_STANDING.srcSet}
                    sizes="(min-width: 768px) 96px, 60px"
                    width={NONO_STANDING.width}
                    height={NONO_STANDING.height}
                    alt={NONO_STANDING.alt}
                    decoding="async"
                    className="w-full h-auto drop-shadow-lg nono-wave"
                  />
                </a>
                <NonoSpeech tail="left" className="mb-3 ml-2 min-w-0">
                  {NONO_LINES.club}
                </NonoSpeech>
              </div>

              <h2
                id="hero-club-title"
                className="mt-3 font-heading text-xl md:text-3xl font-bold leading-tight text-foreground"
              >
                Associe-se e tenha vantagens incríveis
              </h2>
              <ul className="mt-2 md:mt-3 space-y-1 md:space-y-1.5 text-sm md:text-base text-foreground">
                {CLUB_PERKS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-2">
                    <Icon aria-hidden="true" className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-primary" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              {/* Dark text on the pink: white on it is 3.7:1, below AA. */}
              <a
                href={`${CLUB_URL}/assinar`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 md:mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base md:text-lg font-bold text-accent-foreground shadow-lg shadow-primary/30 transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Crown aria-hidden="true" size={20} />
                Quero ser membro
              </a>
            </section>

            <div
              className="mt-3 grid grid-cols-2 gap-2 w-full max-w-lg animate-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              <a
                href="#produtos"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 border-2 border-primary/40 text-foreground bg-card px-3 py-2.5 rounded-full font-bold text-sm md:text-base hover:border-primary hover:bg-primary/5 transition-all"
              >
                <ShoppingBag aria-hidden="true" size={18} />
                Ver produtos
              </a>
              <a
                href={SHOP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 border-2 border-primary/40 text-foreground bg-card px-3 py-2.5 rounded-full font-bold text-sm md:text-base hover:border-primary hover:bg-primary/5 transition-all"
              >
                Abrir loja online
              </a>
              {eventOn && (
                <a
                  href="#ingressos"
                  className="col-span-2 inline-flex min-h-[44px] items-center justify-center gap-2 border-2 border-primary/40 text-foreground bg-card px-3 py-2.5 rounded-full font-bold text-sm md:text-base hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Ticket aria-hidden="true" size={18} />
                  Ingresso do evento
                </a>
              )}
            </div>

            <a
              href={primaryWhatsAppUrl("Olá! Vim pelo site geeketoys.com.br 👋")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors animate-fade-up"
              style={{ animationDelay: "0.35s" }}
            >
              <MessageCircle aria-hidden="true" size={18} className="text-[#25D366]" />
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
