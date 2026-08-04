import { useEffect, useRef } from "react";
import { Gamepad2, Baby, Smartphone, Shirt, Music, Dice5 } from "lucide-react";

const categories = [
  { icon: Gamepad2, title: "Colecionáveis & Action Figures" },
  { icon: Baby, title: "Brinquedos" },
  { icon: Smartphone, title: "Eletrodomésticos" },
  { icon: Shirt, title: "Camisetas Geek" },
  { icon: Music, title: "K-POP" },
  { icon: Dice5, title: "Jogos & Diversão" },
];

const ProductsSection = () => {
  const ref = useRef<HTMLElement>(null);

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

  return (
    <section id="produtos" ref={ref} className="section-fade-in py-20 md:py-28">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
          O que você encontra aqui
        </h2>
        <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
          Na loja física e em{" "}
          <a
            href="https://shop.geeketoys.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-semibold hover:underline"
          >
            shop.geeketoys.com.br
          </a>
          . Membros do Clube têm 15% de desconto.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map(({ icon: Icon, title }) => (
            <a
              key={title}
              href="https://shop.geeketoys.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card border border-border rounded-xl p-6 md:p-8 text-center shadow-sm hover-glow-primary transition-all group block"
            >
              <Icon
                size={40}
                className="mx-auto mb-4 text-primary group-hover:text-accent transition-colors"
              />
              <h3 className="font-heading font-semibold text-sm md:text-base text-foreground">
                {title}
              </h3>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://shop.geeketoys.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold hover:brightness-110 transition-all"
          >
            Abrir loja online
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
