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
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          O que você encontra aqui
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map(({ icon: Icon, title }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-xl p-6 md:p-8 text-center hover-glow-primary transition-all group"
            >
              <Icon
                size={40}
                className="mx-auto mb-4 text-accent group-hover:text-primary transition-colors"
              />
              <h3 className="font-heading font-semibold text-sm md:text-base text-foreground">
                {title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
