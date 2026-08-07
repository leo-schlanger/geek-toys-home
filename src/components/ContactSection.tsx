import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle, Phone } from "lucide-react";
import {
  STORE_PHONES,
  primaryWhatsAppUrl,
  waMeUrl,
} from "@/data/contacts";

const ContactSection = () => {
  const ref = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      `Olá! Contato pelo site geeketoys.com.br`,
      ``,
      `Nome: ${form.name}`,
      `E-mail: ${form.email}`,
      ``,
      form.message,
    ].join("\n");
    window.open(primaryWhatsAppUrl(text), "_blank", "noopener,noreferrer");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contato" ref={ref} className="section-fade-in py-20 md:py-28 bg-secondary/40">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
          Entre em Contato
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          Fale com a equipe da loja todos os dias pelo WhatsApp — as atendentes respondem as
          perguntas.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            <input
              type="email"
              placeholder="E-mail"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
            />
            <textarea
              placeholder="Mensagem"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all resize-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition-all"
            >
              <Send size={18} />
              Enviar no WhatsApp
            </button>
          </form>

          <div className="flex flex-col justify-center gap-4">
            {STORE_PHONES.map((phone) => (
              <a
                key={phone.id}
                href={waMeUrl(phone.e164)}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start gap-4 rounded-xl border p-5 transition-all ${
                  phone.primary
                    ? "border-[#25D366]/50 bg-[#25D366]/10 hover:bg-[#25D366]/15"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {phone.primary ? (
                  <MessageCircle className="h-6 w-6 text-[#25D366] shrink-0 mt-0.5" />
                ) : (
                  <Phone className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-heading font-semibold text-foreground">
                    {phone.label}
                    {phone.primary && (
                      <span className="ml-2 text-[10px] uppercase font-bold text-[#25D366]">
                        Principal
                      </span>
                    )}
                  </p>
                  <p className="text-lg font-bold text-foreground mt-0.5">{phone.display}</p>
                  {phone.note && (
                    <p className="text-xs text-muted-foreground mt-1">{phone.note}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
