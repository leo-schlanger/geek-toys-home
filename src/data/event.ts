/**
 * Configuração do evento ativo no site institucional.
 *
 * Como atualizar (Laura / operação):
 * 1. Edite este arquivo com data, local, texto e preço.
 * 2. Coloque as fotos em `public/eventos/<slug>/` e liste os nomes em `photos`.
 * 3. `enabled: false` esconde banner + seções (sem deploy de lógica extra).
 * 4. Após o evento: deixe `ticketReservation.enabled: false` e `photos` com as fotos finais.
 *
 * Detalhes: docs/EVENTS.md
 */

export type EventPhoto = {
  /** Nome do arquivo em public/eventos/<slug>/ */
  file: string;
  /** Legenda opcional (ex.: "Grupo A — mesa 3") */
  caption?: string;
  /** Texto alternativo acessível */
  alt?: string;
};

export type EventConfig = {
  /** Identificador estável (localStorage do banner, âncoras) */
  id: string;
  /** Pasta em public/eventos/{slug}/ */
  slug: string;
  /** Liga/desliga banner + seções de evento no site */
  enabled: boolean;
  title: string;
  /** Subtítulo curto pro banner e hero do bloco */
  shortTitle: string;
  /** Texto do banner no topo (uma linha) */
  bannerText: string;
  /** ISO date da data/hora do evento (exibição formatada em pt-BR) */
  startsAt: string;
  endsAt?: string;
  location: {
    name: string;
    address: string;
    mapsUrl?: string;
  };
  description: string[];
  highlights: string[];
  /** Ex.: "Entrada liberada para membros do Clube" */
  memberPerk?: string;
  ticketReservation: {
    enabled: boolean;
    /** Preço unitário em BRL; null = gratuito / a combinar */
    priceBRL: number | null;
    currencyLabel?: string;
    maxPerReservation: number;
    whatsappNumber: string;
    /** Instruções extras abaixo do formulário */
    notes?: string;
  };
  photos: EventPhoto[];
  /** CTA secundário no banner (âncora ou URL) */
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
};

/**
 * ⚠️ Conteúdo placeholder — substituir pelos dados reais do evento da loja.
 * Fotos: adicione arquivos em public/eventos/kpop-night/ e liste em `photos`.
 */
export const ACTIVE_EVENT: EventConfig = {
  id: "kpop-night-2026",
  slug: "kpop-night",
  enabled: true,
  title: "GeekPop Night — Encontro K-pop & Collectibles",
  shortTitle: "GeekPop Night",
  bannerText:
    "🎉 GeekPop Night chegando! Reserve seu ingresso online e baixe as fotos do evento.",
  startsAt: "2026-09-20T15:00:00-03:00",
  endsAt: "2026-09-20T21:00:00-03:00",
  location: {
    name: "GeekPop & Toys — Copacabana",
    address: "R. Barata Ribeiro, 181 — loja J, Copacabana, Rio de Janeiro — RJ",
    mapsUrl: "https://maps.google.com/?q=R.+Barata+Ribeiro,+181+Copacabana+Rio+de+Janeiro",
  },
  description: [
    "Um encontro especial na loja para fãs de K-pop, colecionáveis e cultura pop. Música ambiente, ambiente temático, lançamentos e muita interação com a equipe GeekPop.",
    "Membros do Clube GeekPop & Toys têm entrada gratuita nos eventos participantes — apresente a carteirinha digital ou o CPF na porta.",
  ],
  highlights: [
    "Ambiente temático e playlist K-pop",
    "Espaço para fotos e meet com a loja",
    "Lançamentos e destaques de merch",
    "Fotos oficiais disponíveis para download no site",
  ],
  memberPerk: "Membros do Clube: entrada gratuita (eventos participantes).",
  ticketReservation: {
    enabled: true,
    priceBRL: 26,
    currencyLabel: "R$",
    maxPerReservation: 6,
    whatsappNumber: "5521985464666",
    notes:
      "A reserva é enviada pelo WhatsApp da loja para confirmação. Pagamento e retirada de ingresso conforme orientação da equipe.",
  },
  // Liste os arquivos em public/eventos/kpop-night/ (ex.: "mesa-01.jpg")
  // Enquanto vazio, a seção de fotos mostra estado "em breve / após o evento".
  photos: [],
  ctaPrimary: { label: "Reservar ingresso", href: "#ingressos" },
  ctaSecondary: { label: "Ver evento", href: "#evento" },
};

export function isEventVisible(event: EventConfig = ACTIVE_EVENT): boolean {
  return event.enabled;
}

export function formatEventDateRange(
  startsAt: string,
  endsAt?: string,
  locale = "pt-BR"
): string {
  const start = new Date(startsAt);
  const end = endsAt ? new Date(endsAt) : null;

  const dateFmt = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timeFmt = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const datePart = dateFmt.format(start);
  const startTime = timeFmt.format(start);
  if (!end) return `${datePart} · ${startTime}`;
  return `${datePart} · ${startTime} – ${timeFmt.format(end)}`;
}

export function photoPublicUrl(event: EventConfig, file: string): string {
  return `/eventos/${event.slug}/${encodeURIComponent(file)}`;
}

export function buildReservationWhatsAppUrl(params: {
  event: EventConfig;
  name: string;
  phone: string;
  email: string;
  quantity: number;
  notes?: string;
}): string {
  const { event, name, phone, email, quantity, notes } = params;
  const price =
    event.ticketReservation.priceBRL == null
      ? "a combinar / cortesia"
      : `${event.ticketReservation.currencyLabel ?? "R$"} ${event.ticketReservation.priceBRL
          .toFixed(2)
          .replace(".", ",")}`;

  const total =
    event.ticketReservation.priceBRL == null
      ? "—"
      : `${event.ticketReservation.currencyLabel ?? "R$"} ${(
          event.ticketReservation.priceBRL * quantity
        )
          .toFixed(2)
          .replace(".", ",")}`;

  const lines = [
    `Olá! Quero *reservar ingresso(s)* para o evento:`,
    `*${event.title}*`,
    ``,
    `👤 Nome: ${name}`,
    `📱 Telefone: ${phone}`,
    `✉️ E-mail: ${email}`,
    `🎫 Quantidade: ${quantity}`,
    `💵 Valor unitário: ${price}`,
    `💰 Total estimado: ${total}`,
  ];
  if (notes?.trim()) {
    lines.push(``, `📝 Observações: ${notes.trim()}`);
  }
  lines.push(``, `Aguardo confirmação da reserva. Obrigado(a)!`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${event.ticketReservation.whatsappNumber}?text=${text}`;
}
