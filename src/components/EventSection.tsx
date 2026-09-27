import { useEffect, useRef, type ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ExternalLink,
  Gift,
  MapPin,
  Sparkles,
  Ticket,
} from "lucide-react";
import {
  eventArt,
  eventLinks,
  formatEventDay,
  formatEventTime,
  formatPriceShort,
  ticketPriceBRL,
  type EventConfig,
} from "@/data/event";
import { useActiveEvent } from "@/hooks/useActiveEvent";
import EventTicketForm from "./EventTicketForm";

const PRIMARY_BUTTON =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:brightness-110";
const OUTLINE_BUTTON =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-primary/40 bg-background px-6 text-base font-semibold text-primary transition-all hover:bg-primary/10";

/**
 * The event on the institutional site, laid out like a ticketing page: the
 * first screen answers what, when, where and how much, with the reserve
 * button. The flyers used to come first and pushed all of that below ~1000px
 * of images on a phone.
 */
const EventSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { event, visible } = useActiveEvent();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  const [cover, ...moreArt] = eventArt(event);
  const links = eventLinks(event);
  const canReserve = event.ticketReservation.enabled;
  const subtitle =
    event.shortTitle.trim() !== event.title.trim() ? event.shortTitle.trim() : "";

  return (
    <section
      id="evento"
      ref={ref}
      className="section-fade-in py-20 md:py-28 bg-secondary/40 scroll-mt-28"
    >
      <div className="container max-w-6xl">
        <div
          aria-labelledby="evento-titulo"
          role="region"
          className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-12"
        >
          <div className="order-1 space-y-6 lg:order-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Próximo evento
              </span>
              <span
                className={
                  canReserve
                    ? "rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
                    : "rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
                }
              >
                {canReserve ? "Ingressos à venda" : "Reservas encerradas"}
              </span>
            </div>

            <div className="space-y-2">
              <h2
                id="evento-titulo"
                className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl"
              >
                {event.title}
              </h2>
              {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
            </div>

            <EventFacts event={event} />

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {canReserve && (
                <a href="#ingressos" className={PRIMARY_BUTTON}>
                  <Ticket className="h-5 w-5" />
                  Reservar ingresso
                </a>
              )}
              {links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={OUTLINE_BUTTON}
                >
                  <ExternalLink className="h-4 w-4" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {cover && (
            <div className="order-2 lg:order-1">
              <Artwork url={cover} alt={`Cartaz: ${event.title}`} />
            </div>
          )}
        </div>

        {(event.description.length > 0 || event.highlights.length > 0) && (
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <h3 className="font-heading text-2xl font-bold text-foreground">Sobre o evento</h3>
              {event.description.map((para) => (
                <p key={para.slice(0, 24)} className="leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
            </div>
            <aside className="space-y-4">
              {event.highlights.length > 0 && (
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <h4 className="mb-4 font-heading text-lg font-bold">O que vai rolar</h4>
                  <ul className="space-y-3">
                    {event.highlights.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-snug text-foreground">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Check className="h-3 w-3 text-primary" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {event.memberPerk && (
                <div className="flex gap-3 rounded-2xl border border-accent/50 bg-accent/10 p-5">
                  <Gift className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" />
                  <p className="text-sm font-medium text-foreground">{event.memberPerk}</p>
                </div>
              )}
            </aside>
          </div>
        )}

        {moreArt.length > 0 && (
          <div className="mt-16">
            <h3 className="font-heading text-2xl font-bold text-foreground">Mais sobre o evento</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Toque na imagem para ver em tamanho cheio.
            </p>
            <div
              className={
                moreArt.length === 1
                  ? "mx-auto mt-6 max-w-xl"
                  : "mt-6 grid items-start gap-6 sm:grid-cols-2"
              }
            >
              {moreArt.map((url, i) => (
                <Artwork key={url} url={url} alt={`Divulgação ${i + 2}: ${event.title}`} />
              ))}
            </div>
            {links.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                {links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={PRIMARY_BUTTON}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-16">
          <EventTicketForm event={event} />
        </div>
      </div>
    </section>
  );
};

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="mt-0.5 text-foreground">{children}</div>
      </div>
    </li>
  );
}

/** The four answers a visitor looks for first, one per row. */
function EventFacts({ event }: { event: EventConfig }) {
  const price = event.ticketReservation.priceBRL;
  const currency = event.ticketReservation.currencyLabel;
  const memberPrice = price ? ticketPriceBRL(event, "member") : null;

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <Fact icon={<CalendarDays className="h-5 w-5" />} label="Quando">
        <p className="font-semibold">{formatEventDay(event.startsAt)}</p>
        <p className="text-sm text-muted-foreground">
          {formatEventTime(event.startsAt, event.endsAt)}
        </p>
      </Fact>
      {(event.location.name || event.location.address) && (
        <Fact icon={<MapPin className="h-5 w-5" />} label="Local">
          {event.location.name && <p className="font-semibold">{event.location.name}</p>}
          {event.location.address && (
            <p className="text-sm text-muted-foreground">{event.location.address}</p>
          )}
          {event.location.mapsUrl && (
            <a
              href={event.location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Ver no mapa <ArrowRight className="h-3.5 w-3.5" />
            </a>
          )}
        </Fact>
      )}
      {price != null && (
        <Fact icon={<Ticket className="h-5 w-5" />} label="Entrada">
          <p className="font-semibold">
            {price === 0 ? "Gratuita" : `${formatPriceShort(price, currency)} por pessoa`}
          </p>
          {memberPrice != null && (
            <p className="text-sm text-muted-foreground">
              Membros do Clube: {formatPriceShort(memberPrice, currency)}
            </p>
          )}
        </Fact>
      )}
    </ul>
  );
}

/** Flyer text is small on a phone: a tap opens it full size. */
function Artwork({ url, alt }: { url: string; alt: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block overflow-hidden rounded-3xl border border-border bg-card shadow-lg transition-shadow hover:shadow-xl"
    >
      <img src={url} alt={alt} loading="lazy" className="h-auto w-full" />
    </a>
  );
}

export default EventSection;
