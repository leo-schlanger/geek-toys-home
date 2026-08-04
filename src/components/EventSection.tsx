import { useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Gift,
  ArrowRight,
  Ticket,
} from "lucide-react";
import {
  ACTIVE_EVENT,
  formatEventDateRange,
  isEventVisible,
} from "@/data/event";
import EventTicketForm from "./EventTicketForm";

const EventSection = () => {
  const ref = useRef<HTMLElement>(null);
  const event = ACTIVE_EVENT;

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

  if (!isEventVisible(event)) return null;

  const dateLabel = formatEventDateRange(event.startsAt, event.endsAt);

  return (
    <section
      id="evento"
      ref={ref}
      className="section-fade-in py-20 md:py-28 bg-secondary/40 scroll-mt-28"
    >
      <div className="container max-w-5xl">
        <div className="text-center mb-10 md:mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wide mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Evento
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            {event.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tudo o que você precisa saber — e como garantir sua vaga online.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 md:gap-8 mb-10">
          <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex gap-3 rounded-xl bg-secondary/80 p-4">
                <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Data e horário
                  </p>
                  <p className="text-sm font-medium text-foreground capitalize leading-snug mt-0.5">
                    {dateLabel}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl bg-secondary/80 p-4">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Local
                  </p>
                  <p className="text-sm font-medium text-foreground mt-0.5">
                    {event.location.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {event.location.address}
                  </p>
                  {event.location.mapsUrl && (
                    <a
                      href={event.location.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-1.5 hover:underline"
                    >
                      Ver no mapa <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {event.description.map((para) => (
                <p key={para.slice(0, 24)} className="text-muted-foreground leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {event.memberPerk && (
              <div className="flex gap-3 rounded-xl border border-accent/50 bg-accent/10 p-4">
                <Gift className="h-5 w-5 text-accent-foreground shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-foreground">{event.memberPerk}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-heading text-lg font-bold">Destaques</h3>
            </div>
            <ul className="space-y-3">
              {event.highlights.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm text-muted-foreground leading-snug"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0"
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#ingressos"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-3 font-semibold hover:brightness-110 transition-all"
            >
              <Ticket className="h-4 w-4" />
              Quero reservar
            </a>
            <a
              href="#fotos-evento"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-all"
            >
              Ver fotos do evento
            </a>
          </div>
        </div>

        <EventTicketForm event={event} />
      </div>
    </section>
  );
};

export default EventSection;
