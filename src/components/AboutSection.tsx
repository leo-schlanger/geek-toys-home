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
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Há 15 anos no mercado geek</strong>, a Geek & Toys é pioneira e referência no segmento de colecionáveis no Brasil. Fomos a empresa responsável por <strong className="text-foreground">introduzir o Funko Pop no país</strong>, abrindo caminho para milhares de colecionadores brasileiros.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Atuamos como <strong className="text-foreground">atacadistas e varejistas</strong>, sempre oferecendo o melhor mix de produtos na distribuição. De action figures a colecionáveis exclusivos, trabalhamos com marcas renomadas como Marvel, DC, Star Wars, anime e muito mais.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              <strong className="text-foreground">Vendemos online para todo o Brasil</strong>, levando a cultura geek a cada canto do país. Uma empresa sempre na vanguarda, que visa o futuro e acompanha as tendências do universo nerd e geek. Visite nossa loja física em Copacabana ou compre pelo nosso site!
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
