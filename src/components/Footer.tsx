import { SocialIcon } from "./SocialIcon";
import { primaryWhatsAppUrl, STORE_PHONES, waMeUrl } from "@/data/contacts";

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const footerLinks: FooterLink[] = [
  { label: "Loja Online", href: "https://shop.geeketoys.com.br", external: true },
  { label: "Clube GeekPop", href: "https://club.geeketoys.com.br/assinar", external: true },
  { label: "Produtos", href: "#produtos" },
  { label: "Evento", href: "#evento" },
  { label: "Promoções", href: "#promocoes" },
  { label: "Ingressos", href: "#ingressos" },
  { label: "Fotos do evento", href: "#fotos-evento" },
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Galeria", href: "#galeria" },
  { label: "Contato", href: "#contato" },
  { label: "Termos de Uso", href: "/termos" },
  { label: "Privacidade", href: "/privacidade" },
];

const Footer = () => (
  <footer className="bg-footer py-12 border-t border-border">
    <div className="container text-center">
      <a href="#inicio" className="inline-block hover:opacity-90 transition-opacity">
        <img
          src="/logo.jpg"
          alt="GeekPop & Toys"
          className="h-24 mx-auto rounded-lg shadow-md shadow-primary/15 ring-2 ring-primary/10"
        />
      </a>

      <nav className="flex flex-wrap justify-center gap-6 mt-6 mb-6">
        {footerLinks.map((link) => (
          <a
            key={link.href + link.label}
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`text-sm transition-colors ${
              link.external
                ? "text-primary hover:text-primary/80 font-medium"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <p className="text-sm text-muted-foreground mb-4 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {STORE_PHONES.map((p) => (
          <a
            key={p.id}
            href={waMeUrl(p.e164)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            {p.display}
          </a>
        ))}
      </p>

      <div className="flex justify-center gap-4 mb-8">
        {[
          { href: "https://www.facebook.com/geeketoyscolection/", label: "Facebook", icon: "fb" },
          { href: "https://www.instagram.com/geeketoys/", label: "Instagram", icon: "ig" },
          { href: "https://www.tiktok.com/@geeketoys", label: "TikTok", icon: "tt" },
          { href: primaryWhatsAppUrl(), label: "WhatsApp", icon: "wa" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-card border border-border shadow-sm flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:shadow-md hover:shadow-primary/15 transition-all"
            aria-label={s.label}
          >
            <SocialIcon type={s.icon} className="w-5 h-5" />
          </a>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        © 2026 GeekPop & Toys Collection — Todos os direitos reservados
      </p>
      <p className="text-xs text-muted-foreground/60 mt-1">
        Copacabana, Rio de Janeiro - RJ
      </p>
    </div>
  </footer>
);

export default Footer;
