import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

const navLinks: NavLink[] = [
  { label: "Início", href: "#inicio" },
  { label: "Quem Somos", href: "#quem-somos" },
  { label: "Galeria", href: "#galeria" },
  { label: "Produtos", href: "#produtos" },
  { label: "Localização", href: "#localizacao" },
  { label: "Contato", href: "#contato" },
  { label: "Clube", href: "https://club.geeketoys.com.br", external: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass border-b border-border" : "bg-transparent"
        }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <a href="#inicio" className="flex items-center">
          <img src="/logo.jpg" alt="Geek & Toys" className="h-14 md:h-16 rounded" />
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`text-sm font-medium transition-colors ${
                  link.external
                    ? "px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90"
                    : "text-foreground/80 hover:text-primary"
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground"
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-border">
          <ul className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`block font-medium transition-colors ${
                    link.external
                      ? "text-center py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                      : "text-foreground/80 hover:text-primary"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
