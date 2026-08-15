import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { ACTIVE_EVENT, isEventVisible } from "@/data/event";
import { ThemeToggle } from "./ThemeToggle";
import { ProductSearch } from "./ProductSearch";

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
  highlight?: boolean;
}

/** Ordem: produtos e evento no topo da navegação. */
const baseLinks: NavLink[] = [
  { label: "Início", href: "#inicio" },
  { label: "Produtos", href: "#produtos", highlight: true },
  { label: "Promoções", href: "#promocoes" },
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Galeria", href: "/galeria" },
  { label: "Rádio", href: "#radio" },
  { label: "Localização", href: "#localizacao" },
  { label: "Contato", href: "#contato" },
  { label: "Loja", href: "https://shop.geeketoys.com.br", external: true },
  { label: "Clube", href: "https://club.geeketoys.com.br/assinar", external: true },
];

function buildNavLinks(): NavLink[] {
  if (!isEventVisible(ACTIVE_EVENT)) return baseLinks;
  // Início · Produtos · Evento · Promoções · resto…
  return [
    baseLinks[0],
    baseLinks[1],
    { label: "Evento", href: "#evento", highlight: true },
    ...baseLinks.slice(2),
  ];
}

/**
 * Rota interna usa <Link> (navegação SPA). Âncora e link externo seguem como
 * <a>: âncora depende do comportamento nativo de rolagem, e externo abre fora.
 */
function NavItem({
  link,
  href,
  className,
  onClick,
}: {
  link: NavLink;
  href: string;
  className: string;
  onClick?: () => void;
}) {
  if (!link.external && href.startsWith("/") && !href.includes("#")) {
    return (
      <Link to={href} className={className} onClick={onClick}>
        {link.label}
      </Link>
    );
  }
  return (
    <a
      href={href}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={className}
      onClick={onClick}
    >
      {link.label}
    </a>
  );
}

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navLinks = buildNavLinks();
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  /**
   * Fora da home, uma âncora precisa apontar para a home antes da seção: em
   * /galeria, `#inicio` só rolaria a própria galeria e o clique não saía do
   * lugar.
   */
  const resolveHref = (href: string) => (href.startsWith("#") && !onHome ? `/${href}` : href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-border" : "bg-transparent"
      }`}
      style={{ top: "var(--event-banner-h, 0px)" }}
    >
      <div className="container flex items-center justify-between gap-4 h-16 md:h-20">
        <a href="#inicio" className="flex shrink-0 items-center">
          <img
            src="/logo.jpg"
            alt="GeekPop & Toys"
            className="h-14 md:h-16 rounded-lg shadow-sm ring-1 ring-border"
          />
        </a>

        {/* Desktop */}
        <ul className="hidden xl:flex items-center gap-4 2xl:gap-6">
          {navLinks.map((link) => (
            <li key={link.href + link.label}>
              <NavItem
                link={link}
                href={resolveHref(link.href)}
                className={`whitespace-nowrap text-sm font-medium transition-colors ${
                  link.external
                    ? "px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
                    : link.highlight
                      ? "text-primary font-semibold hover:text-primary/80"
                      : "text-foreground/80 hover:text-primary"
                }`}
              />
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-1">
          <ProductSearch collapsible collapsedClassName="hidden sm:block" className="hidden sm:block" />
          <ThemeToggle compact />
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="xl:hidden text-foreground"
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="xl:hidden glass border-t border-border">
          <div className="px-4 pt-4">
            <ProductSearch />
          </div>
          <ul className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <li key={link.href + link.label}>
                <NavItem
                  link={link}
                  href={resolveHref(link.href)}
                  onClick={() => setOpen(false)}
                  className={`block font-medium transition-colors ${
                    link.external
                      ? "text-center py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                      : link.highlight
                        ? "text-primary font-semibold"
                        : "text-foreground/80 hover:text-primary"
                  }`}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
