import { useMemo, useState } from "react";
import { Loader2, MessageCircle, Plus, Ticket, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  FALLBACK_EVENT,
  buildReservationWhatsAppUrl,
  formatBRL,
  ticketPriceBRL,
  TICKET_KIND_LABEL,
  type EventConfig,
  type TicketKind,
} from "@/data/event";
import { createReservation, type ReservationPix } from "@/lib/shop-api";

type Props = {
  event?: EventConfig;
};

type Attendee = { name: string; kind: TicketKind };

const FIELD_CLASS =
  "bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40";

/**
 * Reserva de ingresso.
 *
 * Um ingresso **por pessoa**, nominal. O formulário grava na API da loja e
 * devolve o código + o PIX; o WhatsApp virou fallback para quando a API não
 * responde.
 *
 * Antes de 23/08/2026 este formulário só montava uma mensagem de WhatsApp:
 * a reserva não existia em lugar nenhum, o cliente não recebia PIX e a admin
 * não era avisada. Uma reserva de 2 ingressos chegou como mensagem solta e não
 * havia como cobrar nem confirmar.
 */
const EventTicketForm = ({ event = FALLBACK_EVENT }: Props) => {
  const [buyer, setBuyer] = useState({ name: "", phone: "", email: "", notes: "" });
  const [attendees, setAttendees] = useState<Attendee[]>([{ name: "", kind: "full" }]);
  const [submitting, setSubmitting] = useState(false);
  /** Enquanto o primeiro nome não for editado, ele segue quem está reservando. */
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [result, setResult] = useState<{
    code: string;
    ticketsUrl: string;
    pix: ReservationPix | null;
  } | null>(null);

  const max = event.ticketReservation.maxPerReservation;
  const unit = event.ticketReservation.priceBRL;
  const currency = event.ticketReservation.currencyLabel ?? "R$";

  const total = useMemo(
    () => attendees.reduce((sum, a) => sum + ticketPriceBRL(event, a.kind), 0),
    [attendees, event],
  );

  if (!event.ticketReservation.enabled) {
    return (
      <div
        id="ingressos"
        className="rounded-2xl border border-border bg-card p-6 md:p-8 text-center shadow-sm"
      >
        <Ticket className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
        <h3 className="font-heading text-xl font-bold mb-2">Reservas encerradas</h3>
        <p className="text-muted-foreground text-sm">
          As reservas online para este evento não estão disponíveis no momento.
          Fale conosco no WhatsApp se tiver dúvidas.
        </p>
      </div>
    );
  }

  const setQuantity = (next: number) => {
    const target = Math.max(1, max == null ? next : Math.min(next, max));
    setAttendees((current) => {
      if (target === current.length) return current;
      if (target < current.length) return current.slice(0, target);
      return [
        ...current,
        ...Array.from({ length: target - current.length }, () => ({
          name: "",
          kind: "full" as TicketKind,
        })),
      ];
    });
  };

  const updateAttendee = (index: number, patch: Partial<Attendee>) => {
    if (index === 0 && patch.name !== undefined) setFirstNameTouched(true);
    setAttendees((current) =>
      current.map((a, i) => (i === index ? { ...a, ...patch } : a)),
    );
  };

  const openWhatsApp = (
    reservationCode: string | null,
    ticketsUrl: string | null,
  ) => {
    const url = buildReservationWhatsAppUrl({
      event,
      name: buyer.name.trim(),
      phone: buyer.phone.trim(),
      email: buyer.email.trim(),
      attendees: attendees.map((a) => ({ name: a.name.trim(), kind: a.kind })),
      notes: buyer.notes,
      reservationCode,
      ticketsUrl,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const filled = attendees.map((a) => ({ name: a.name.trim(), kind: a.kind }));
    const missing = filled.findIndex((a) => a.name.length < 2);
    if (missing >= 0) {
      toast.error(`Informe o nome da pessoa ${missing + 1}.`);
      return;
    }

    setSubmitting(true);
    try {
      const created = await createReservation(event.id, {
        buyerName: buyer.name.trim(),
        buyerEmail: buyer.email.trim(),
        buyerPhone: buyer.phone.trim(),
        notes: buyer.notes.trim() || undefined,
        attendees: filled,
      });

      if (created.ok) {
        setResult({
          code: created.reservation.code,
          ticketsUrl: created.ticketsUrl,
          pix: created.reservation.pix ?? null,
        });
        // Sem PIX (evento gratuito ou chave não configurada): o WhatsApp volta
        // a ser o caminho do pagamento.
        if (!created.reservation.pix) {
          openWhatsApp(created.reservation.code, created.ticketsUrl);
        }
        toast.success(
          created.reservation.pix
            ? "Reserva registrada! Pague o PIX para liberar os ingressos."
            : "Reserva registrada! Confirme o pagamento pelo WhatsApp.",
        );
      } else {
        // A reserva não gravou, mas a venda não pode morrer aqui: o WhatsApp
        // ainda leva o pedido inteiro para a equipe lançar à mão.
        openWhatsApp(null, null);
        toast.warning(`${created.error} Enviamos sua reserva pelo WhatsApp.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div
        id="ingressos"
        className="rounded-2xl border border-primary/30 bg-card p-6 md:p-8 shadow-sm"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-heading text-xl md:text-2xl font-bold">
              Reserva registrada!
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Código{" "}
              <span className="font-mono font-bold text-foreground">
                {result.code}
              </span>
              . Guarde o link abaixo: é onde o PIX e seus ingressos aparecem.
            </p>
          </div>
        </div>

        {result.pix ? (
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed">
            Falta <strong>pagar o PIX</strong> para liberar os ingressos. Abra a
            página abaixo: lá estão o QR Code e o código copia-e-cola. Também
            enviamos tudo para{" "}
            <strong className="text-foreground">{buyer.email.trim()}</strong>.
          </div>
        ) : (
          <div className="rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm leading-relaxed">
            Os ingressos ficam <strong>aguardando confirmação</strong> até a
            equipe conferir o pagamento pelo WhatsApp. Depois disso, cada pessoa
            ganha um QR Code próprio — e ele vale uma única entrada.
          </div>
        )}

        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <a
            href={result.ticketsUrl}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-md"
          >
            <Ticket className="h-5 w-5" />
            {result.pix ? "Pagar e ver meus ingressos" : "Ver meus ingressos"}
          </a>
          <button
            type="button"
            onClick={() => openWhatsApp(result.code, result.ticketsUrl)}
            className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3.5 rounded-xl font-semibold hover:bg-muted transition-all"
          >
            <MessageCircle className="h-5 w-5" />
            Falar no WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="ingressos"
      className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm border-glow-primary"
    >
      <div className="flex items-start gap-3 mb-6">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
          <Ticket className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-heading text-xl md:text-2xl font-bold text-foreground">
            Reserve seu ingresso online
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Um ingresso nominal por pessoa, com QR Code de entrada. O pagamento
            é por PIX, na hora.
            {unit != null && (
              <>
                {" "}
                Valor:{" "}
                <span className="font-semibold text-foreground">
                  {formatBRL(unit, currency)}
                </span>{" "}
                por pessoa.
              </>
            )}
          </p>
        </div>
      </div>

      {/*
        `min-w-0` nos <label>: item de grid nasce com `min-width:auto`, e o
        <input> tem largura intrínseca própria — a 360px isso empurrava os
        campos 6px para fora da trilha, desalinhando da margem da seção.
      */}
      <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
        <label className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium">Nome de quem está reservando</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={buyer.name}
            onChange={(e) => {
              const name = e.target.value;
              setBuyer((b) => ({ ...b, name }));
              // O primeiro ingresso costuma ser de quem reserva; ainda dá para trocar.
              if (!firstNameTouched) {
                setAttendees((current) =>
                  current.map((a, i) => (i === 0 ? { ...a, name } : a)),
                );
              }
            }}
            className={FIELD_CLASS}
            placeholder="Como no documento"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-sm font-medium">Telefone / WhatsApp</span>
          <input
            type="tel"
            required
            autoComplete="tel"
            value={buyer.phone}
            onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
            className={FIELD_CLASS}
            placeholder="(21) 99999-9999"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-sm font-medium">E-mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={buyer.email}
            onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
            className={FIELD_CLASS}
            placeholder="voce@email.com"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-sm font-medium">Quantas pessoas</span>
          <input
            type="number"
            required
            min={1}
            {...(max == null ? {} : { max })}
            value={attendees.length}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            className={FIELD_CLASS}
          />
          {max != null && (
            <span className="text-xs text-muted-foreground">
              Máximo {max} por reserva
            </span>
          )}
        </label>

        <div className="flex flex-col justify-end gap-1.5">
          <span className="text-sm font-medium">Total estimado</span>
          <div className="rounded-lg border border-accent/40 bg-accent/15 px-4 py-3 font-heading font-bold text-lg text-foreground">
            {unit == null ? "A combinar" : formatBRL(total, currency)}
          </div>
        </div>

        <div className="sm:col-span-2 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">Quem vai entrar</span>
            <span className="text-xs text-muted-foreground">
              O nome fica impresso no ingresso
            </span>
          </div>

          {attendees.map((attendee, index) => (
            <div
              key={index}
              className="grid gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"
            >
              <input
                type="text"
                required
                aria-label={`Nome da pessoa ${index + 1}`}
                value={attendee.name}
                onChange={(e) => updateAttendee(index, { name: e.target.value })}
                className={FIELD_CLASS}
                placeholder={`Nome da pessoa ${index + 1}`}
              />
              <select
                aria-label={`Tipo de ingresso da pessoa ${index + 1}`}
                className={`${FIELD_CLASS} sm:w-56`}
                value={attendee.kind}
                onChange={(e) =>
                  updateAttendee(index, { kind: e.target.value as TicketKind })
                }
              >
                {(Object.keys(TICKET_KIND_LABEL) as TicketKind[]).map((kind) => (
                  <option key={kind} value={kind}>
                    {TICKET_KIND_LABEL[kind]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-label={`Remover pessoa ${index + 1}`}
                disabled={attendees.length === 1}
                onClick={() =>
                  setAttendees((current) => current.filter((_, i) => i !== index))
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            disabled={max != null && attendees.length >= max}
            onClick={() => setQuantity(attendees.length + 1)}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-40 disabled:pointer-events-none"
          >
            <Plus className="h-4 w-4" />
            Adicionar pessoa
          </button>
        </div>

        <label className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium">Observações (opcional)</span>
          <textarea
            rows={3}
            value={buyer.notes}
            onChange={(e) => setBuyer({ ...buyer, notes: e.target.value })}
            className={`${FIELD_CLASS} resize-none`}
            placeholder="Ex.: chegamos mais tarde, criança de colo…"
          />
        </label>

        <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Ticket className="h-5 w-5" />
            )}
            {submitting ? "Registrando…" : "Reservar e pagar com PIX"}
          </button>
          {event.ticketReservation.notes && (
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              {event.ticketReservation.notes}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default EventTicketForm;
