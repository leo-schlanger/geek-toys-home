import { useEffect, useRef } from "react";
import { MapPin, Phone, Clock } from "lucide-react";
import storePhoto from "@/assets/store-photo.jpg";

const AboutSection = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="quem-somos" ref={ref} className="section-fade-in py-20 md:py-28">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
          Quem Somos
        </h2>
        <div className="w-20 h-1 bg-primary rounded-full mb-12" />

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-muted-foreground leading-relaxed mb-8">
              A Geek & Toys é uma loja especializada no universo geek, localizada no coração de Copacabana, Rio de Janeiro. Trabalhamos com brinquedos, colecionáveis, action figures, Funko Pops, eletrodomésticos e tudo que o mundo nerd e geek tem de melhor. Nossa missão é trazer alegria e nostalgia para nossos clientes, oferecendo produtos de qualidade com o atendimento que só uma loja de bairro pode ter.
            </p>

            <div className="grid gap-4">
              {[
                { icon: MapPin, text: "R. Barata Ribeiro, 181 - loja J - Copacabana, RJ" },
                { icon: Phone, text: "(21) 98546-4666" },
                { icon: Clock, text: "Seg a Sex: 09h às 19h | Sáb: 09h às 16h" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <Icon size={18} className="text-accent shrink-0" />
                  <span className="text-foreground/80">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-border hover-glow-primary">
            <img
              src={storePhoto}
              alt="Loja Geek & Toys em Copacabana"
              className="w-full h-80 object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
