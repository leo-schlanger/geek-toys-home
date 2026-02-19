import { MessageCircle } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import storePhoto from "@/assets/store-photo.jpg";
import logoOfficial from "@/assets/logo-official.svg";
import { SocialIcon } from "./SocialIcon";

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/geeketoyscolection/", icon: "fb" },
  { label: "Instagram", href: "https://www.instagram.com/geeketoys/", icon: "ig" },
  { label: "TikTok", href: "https://www.tiktok.com/@geeketoys", icon: "tt" },
  { label: "Shopee", href: "https://shopee.com.br/geeketoys", icon: "sh" },
];

const HeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Geek & Toys Collection store"
          className="w-full h-full object-cover opacity-30"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="container relative z-10 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-3xl">
            <div className="mb-6 animate-fade-up">
              <img
                src={logoOfficial}
                alt="Geek & Toys Official Logo"
                className="w-full max-w-[500px] h-auto drop-shadow-2xl"
              />
            </div>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-up" style={{ animationDelay: "0.15s" }}>
              Há 15 anos trazendo o melhor do universo geek para o Brasil — Pioneiros do Funko Pop no país! Atacado e varejo para todo o Brasil.
            </p>
            <a
              href="https://wa.me/5521985464666"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-cta text-cta-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:brightness-110 transition-all animate-fade-up"
              style={{ animationDelay: "0.3s" }}
            >
              <MessageCircle size={22} />
              Fale Conosco no WhatsApp
            </a>
          </div>

          <div className="hidden lg:block animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative rounded-xl overflow-hidden border border-border/50">
                <img
                  src={storePhoto}
                  alt="Vista da loja física Geek & Toys"
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating social icons */}
      <div className="hidden md:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
        {socials.map((s) => (
          <a
            key={s.icon}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-accent hover:border-glow-accent hover:text-primary transition-all"
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
