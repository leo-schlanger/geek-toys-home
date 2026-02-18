import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";

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
    // Form submission placeholder
    alert("Mensagem enviada! Entraremos em contato em breve.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contato" ref={ref} className="section-fade-in py-20 md:py-28 bg-card/30">
      <div className="container">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Entre em Contato
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nome"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <input
              type="email"
              placeholder="E-mail"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <textarea
              placeholder="Mensagem"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="bg-card border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition-all"
            >
              <Send size={18} />
              Enviar
            </button>
          </form>

          <div className="flex flex-col items-center justify-center text-center gap-6">
            <p className="text-muted-foreground text-lg">
              Prefere WhatsApp? Clique aqui!
            </p>
            <a
              href="https://wa.me/5521985464666"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-cta text-cta-foreground px-8 py-4 rounded-lg font-semibold text-lg hover:brightness-110 transition-all"
            >
              <MessageCircle size={24} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
