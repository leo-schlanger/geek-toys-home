import { SocialIcon } from "./SocialIcon";

const footerLinks = [
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Galeria", href: "#galeria" },
  { label: "Produtos", href: "#produtos" },
  { label: "Contato", href: "#contato" },
];

const Footer = () => (
  <footer className="bg-footer py-12 border-t border-border">
    <div className="container text-center">
      <a href="#inicio" className="font-heading text-2xl font-bold text-primary text-glow-primary">
        Geek & Toys
      </a>

      <nav className="flex flex-wrap justify-center gap-6 mt-6 mb-8">
        {footerLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex justify-center gap-4 mb-8">
        {[
          { href: "https://www.facebook.com/geeketoyscolection/", label: "Facebook", icon: "fb" },
          { href: "https://www.instagram.com/geeketoys/", label: "Instagram", icon: "ig" },
          { href: "https://www.tiktok.com/@geeketoys", label: "TikTok", icon: "tt" },
          { href: "https://shopee.com.br/geeketoys", label: "Shopee", icon: "sh" },
        ].map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
            aria-label={s.label}
          >
            <SocialIcon type={s.icon} className="w-5 h-5" />
          </a>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        © 2026 Geek & Toys Collection — Todos os direitos reservados
      </p>
      <p className="text-xs text-muted-foreground/60 mt-1">
        Copacabana, Rio de Janeiro - RJ
      </p>
    </div>
  </footer>
);

export default Footer;
