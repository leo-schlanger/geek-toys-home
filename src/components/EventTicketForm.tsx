import { useState } from "react";
import { MessageCircle, Ticket } from "lucide-react";
import { toast } from "sonner";
import {
  ACTIVE_EVENT,
  buildReservationWhatsAppUrl,
  type EventConfig,
} from "@/data/event";

type Props = {
  event?: EventConfig;
};

const EventTicketForm = ({ event = ACTIVE_EVENT }: Props) => {
  /** `null` = sem teto de quantidade; o clamp abaixo vira só o mínimo de 1. */
  const max = event.ticketReservation.maxPerReservation;
  const clampQuantity = (value: number) =>
    max == null ? Math.max(value, 1) : Math.min(Math.max(value, 1), max);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    quantity: 1,
    notes: "",
  });

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

  const unit = event.ticketReservation.priceBRL;
  const total =
    unit == null ? null : unit * clampQuantity(form.quantity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = clampQuantity(Number(form.quantity) || 1);
    const url = buildReservationWhatsAppUrl({
      event,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      quantity: qty,
      notes: form.notes,
    });
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Abrindo WhatsApp com sua reserva…");
    setForm({ name: "", phone: "", email: "", quantity: 1, notes: "" });
  };

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
            Preencha os dados e envie pelo WhatsApp da loja para confirmar a reserva.
            {unit != null && (
              <>
                {" "}
                Valor:{" "}
                <span className="font-semibold text-foreground">
                  {event.ticketReservation.currencyLabel ?? "R$"}{" "}
                  {unit.toFixed(2).replace(".", ",")}
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
          <span className="text-sm font-medium">Nome completo</span>
          <input
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Como no documento"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-sm font-medium">Telefone / WhatsApp</span>
          <input
            type="tel"
            required
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="(21) 99999-9999"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-sm font-medium">E-mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="voce@email.com"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1.5">
          <span className="text-sm font-medium">Quantidade de ingressos</span>
          <input
            type="number"
            required
            min={1}
            {...(max == null ? {} : { max })}
            value={form.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                quantity: clampQuantity(Number(e.target.value) || 1),
              })
            }
            className="bg-background border border-border rounded-lg px-4 py-3 text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {max != null && (
            <span className="text-xs text-muted-foreground">Máximo {max} por reserva</span>
          )}
        </label>

        <div className="flex flex-col justify-end gap-1.5">
          <span className="text-sm font-medium">Total estimado</span>
          <div className="rounded-lg border border-accent/40 bg-accent/15 px-4 py-3 font-heading font-bold text-lg text-foreground">
            {total == null
              ? "A combinar"
              : `${event.ticketReservation.currencyLabel ?? "R$"} ${total
                  .toFixed(2)
                  .replace(".", ",")}`}
          </div>
        </div>

        <label className="flex min-w-0 flex-col gap-1.5 sm:col-span-2">
          <span className="text-sm font-medium">Observações (opcional)</span>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            placeholder="Ex.: nome dos acompanhantes, preferência de horário…"
          />
        </label>

        <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#20ba5a] transition-all shadow-md shadow-[#25D366]/25"
          >
            <MessageCircle className="h-5 w-5" />
            Enviar reserva no WhatsApp
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
