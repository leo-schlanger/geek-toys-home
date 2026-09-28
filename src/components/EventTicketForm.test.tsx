import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

const { createReservationMock, toastMock } = vi.hoisted(() => ({
  createReservationMock: vi.fn(),
  toastMock: { success: vi.fn(), error: vi.fn(), warning: vi.fn() },
}));

vi.mock("@/lib/shop-api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/shop-api")>();
  return { ...actual, createReservation: createReservationMock };
});
vi.mock("sonner", () => ({ toast: toastMock }));

import EventTicketForm from "./EventTicketForm";

const openMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("open", openMock);
});

const PIX = {
  emvCode: "00020126...6304ABCD",
  pixKey: "geekpopee@gmail.com",
  merchantName: "GEEKPOP E TOYS",
  amount: 20,
  txId: "CGTTEST",
  provider: "pagarme" as const,
};

function fillBuyer() {
  fireEvent.change(screen.getByLabelText(/Nome de quem está reservando/i), {
    target: { value: "Ana Souza" },
  });
  fireEvent.change(screen.getByLabelText(/Telefone/i), {
    target: { value: "21999999999" },
  });
  fireEvent.change(screen.getByLabelText(/E-mail/i), {
    target: { value: "ana@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/CPF de quem paga/i), {
    target: { value: "529.982.247-25" },
  });
}

function setQuantity(n: number) {
  fireEvent.change(screen.getByLabelText(/Quantas pessoas/i), {
    target: { value: String(n) },
  });
}

function submit() {
  fireEvent.click(screen.getByRole("button", { name: /Reservar e pagar/i }));
}

describe("EventTicketForm", () => {
  /**
   * A regressão que motivou o teste: o formulário só abria o `wa.me`. A reserva
   * não existia no banco, a cliente nunca via o PIX e a admin não era avisada.
   */
  it("registra a reserva na API em vez de só abrir o WhatsApp", async () => {
    createReservationMock.mockResolvedValue({
      ok: true,
      reservation: { code: "R-AAAA-BBBB", quantity: 1, totalCents: 2000, pix: PIX },
      ticketsUrl: "https://shop.geeketoys.com.br/ingressos/R-AAAA-BBBB",
    });
    render(<EventTicketForm />);

    fillBuyer();
    submit();

    await waitFor(() => expect(createReservationMock).toHaveBeenCalledTimes(1));
    const [, payload] = createReservationMock.mock.calls[0];
    expect(payload.buyerEmail).toBe("ana@example.com");
    // Só dígitos: a API normaliza, mas a operadora não aceita máscara.
    expect(payload.buyerDocument).toBe("52998224725");
    // Um ingresso por pessoa: é o nome que torna o ingresso nominal.
    expect(payload.attendees).toEqual([{ name: "Ana Souza", kind: "full" }]);

    // Com PIX na mão, o WhatsApp deixa de ser o caminho do pagamento.
    expect(openMock).not.toHaveBeenCalled();
    expect(await screen.findByText(/R-AAAA-BBBB/)).toBeInTheDocument();
  });

  it("leva ao link onde o PIX é exibido", async () => {
    createReservationMock.mockResolvedValue({
      ok: true,
      reservation: { code: "R-AAAA-BBBB", quantity: 1, totalCents: 2000, pix: PIX },
      ticketsUrl: "https://shop.geeketoys.com.br/ingressos/R-AAAA-BBBB",
    });
    render(<EventTicketForm />);

    fillBuyer();
    submit();

    const link = await screen.findByRole("link", {
      name: /Pagar e ver meus ingressos/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "https://shop.geeketoys.com.br/ingressos/R-AAAA-BBBB",
    );
  });

  it("cai no WhatsApp quando a API falha — a venda não pode morrer aqui", async () => {
    createReservationMock.mockResolvedValue({
      ok: false,
      error: "API fora do ar.",
      retryable: true,
    });
    render(<EventTicketForm />);

    fillBuyer();
    submit();

    await waitFor(() => expect(openMock).toHaveBeenCalledTimes(1));
    const url = decodeURIComponent(openMock.mock.calls[0][0] as string);
    expect(url).toContain("wa.me/");
    expect(url).toContain("Ana Souza");
    expect(toastMock.warning).toHaveBeenCalled();
  });

  it("cobra por tipo de ingresso: inteira, membro (50%) e isento", () => {
    render(<EventTicketForm />);

    setQuantity(3);
    fireEvent.change(screen.getByLabelText("Tipo de ingresso da pessoa 2"), {
      target: { value: "member" },
    });
    fireEvent.change(screen.getByLabelText("Tipo de ingresso da pessoa 3"), {
      target: { value: "free" },
    });

    // 20 + 10 + 0
    expect(screen.getByText("R$ 30,00")).toBeInTheDocument();
  });

  it("diz que a confirmação do PIX é automática", async () => {
    createReservationMock.mockResolvedValue({
      ok: true,
      reservation: { code: "R-AAAA-BBBB", quantity: 1, totalCents: 2000, pix: PIX },
      ticketsUrl: "https://shop.geeketoys.com.br/ingressos/R-AAAA-BBBB",
    });
    render(<EventTicketForm />);

    fillBuyer();
    submit();

    expect(await screen.findByText(/automática/)).toBeInTheDocument();
  });

  it("recusa CPF inválido antes de chamar a API", () => {
    const { container } = render(<EventTicketForm />);

    fillBuyer();
    fireEvent.change(screen.getByLabelText(/CPF de quem paga/i), {
      target: { value: "111.111.111-11" },
    });
    fireEvent.submit(container.querySelector("form")!);

    expect(createReservationMock).not.toHaveBeenCalled();
    expect(toastMock.error).toHaveBeenCalledWith(expect.stringMatching(/CPF válido/));
  });

  it("recusa do servidor mostra o erro e não abre o WhatsApp", async () => {
    createReservationMock.mockResolvedValue({
      ok: false,
      error: "Informe um CPF válido para pagar com PIX.",
      retryable: false,
    });
    render(<EventTicketForm />);

    fillBuyer();
    submit();

    await waitFor(() =>
      expect(toastMock.error).toHaveBeenCalledWith("Informe um CPF válido para pagar com PIX."),
    );
    expect(openMock).not.toHaveBeenCalled();
  });

  it("reserva só de isentos não pede CPF", () => {
    render(<EventTicketForm />);

    fireEvent.change(screen.getByLabelText("Tipo de ingresso da pessoa 1"), {
      target: { value: "free" },
    });

    expect(screen.queryByLabelText(/CPF de quem paga/i)).not.toBeInTheDocument();
  });

  it("exige o nome de cada pessoa antes de enviar", () => {
    const { container } = render(<EventTicketForm />);

    setQuantity(2);
    fillBuyer();
    // `fireEvent.submit` no <form>: o `required` do próprio navegador já barra
    // o clique, e o que se quer provar aqui é o guard em JS por trás dele —
    // um nome vazio nunca pode virar um ingresso sem dono.
    fireEvent.submit(container.querySelector("form")!);

    expect(createReservationMock).not.toHaveBeenCalled();
    expect(toastMock.error).toHaveBeenCalledWith("Informe o nome da pessoa 2.");
  });
});
