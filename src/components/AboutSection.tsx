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
              <strong className="text-foreground">Há 15 anos no mercado geek</strong>, a GeekPop &amp; Toys nasceu em Copacabana e construiu sua história como referência em colecionáveis no Brasil — inclusive como pioneira na chegada do Funko Pop ao país, abrindo caminho para milhares de colecionadores.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Hoje nosso foco principal é o K-pop e a cultura pop</strong>: photocards, merch de grupos, álbuns, lightsticks e o que está bombando na cena. Mantemos também colecionáveis e produtos geek, com eventos como a GeekPop Night e uma curadoria pensada para fãs.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              <strong className="text-foreground">Vendemos online com envio pelos Correios para todo o Brasil</strong> e atendemos na loja física em Copacabana. No Clube GeekPop você ganha 15% de desconto em qualquer produto. Visite a gente ou compre pela loja online!
            </p>

            <div className="grid gap-4">
              {[
                { icon: MapPin, text: "R. Barata Ribeiro, 181 - loja J - Copacabana, RJ" },
                { icon: Phone, text: "(21) 98546-4666" },
                { icon: Clock, text: "Seg a Sex: 09h às 19h | Sáb: 09h às 16h" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm">
                  <Icon size={18} className="text-primary shrink-0" />
                  <span className="text-foreground/80">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-border hover-glow-primary">
            <img
              src={storePhoto}
              alt="Loja GeekPop & Toys em Copacabana"
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
