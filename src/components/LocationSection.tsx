import { useEffect, useRef } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const LocationSection = () => {
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
    <section id="localizacao" ref={ref} className="section-fade-in py-20 md:py-28">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Onde Estamos
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-xl overflow-hidden border border-border h-80 md:h-full min-h-[320px]">
            <iframe
              title="Localização Geek & Toys"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.0!2d-43.1789!3d-22.9656!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sR.+Barata+Ribeiro%2C+181+-+Copacabana%2C+Rio+de+Janeiro+-+RJ!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="bg-card border border-border rounded-xl p-8 flex flex-col justify-center gap-6">
            {[
              {
                icon: MapPin,
                label: "Endereço",
                text: "R. Barata Ribeiro, 181 - loja J - Copacabana, Rio de Janeiro - RJ, 22011-001, Brasil",
              },
              {
                icon: Phone,
                label: "WhatsApp",
                text: "(21) 98546-4666",
                href: "https://wa.me/5521985464666",
              },
              {
                icon: Mail,
                label: "E-mail",
                text: "geeketoys@gmail.com",
                href: "mailto:geeketoys@gmail.com",
              },
              {
                icon: Clock,
                label: "Horário",
                text: "Seg a Sex: 09h às 19h | Sáb: 09h às 16h",
              },
            ].map(({ icon: Icon, label, text, href }) => (
              <div key={label} className="flex gap-4">
                <Icon size={20} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-heading font-semibold text-sm text-foreground">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground text-sm hover:text-primary transition-colors"
                    >
                      {text}
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm">{text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
