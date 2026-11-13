import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { NATAL_BANNER_DISMISS_KEY } from "./isNatalActive";

// The gate reads the clock and the URL once, at import: re-import per case.
async function loadGate(search: string, now: string) {
  vi.resetModules();
  vi.setSystemTime(new Date(now));
  window.history.replaceState(null, "", `/${search}`);
  return import("./index");
}

const root = document.documentElement;

// The strip chunk is lazy: under a full parallel run it can take seconds to load.
describe("Natal gate", { timeout: 30000 }, () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    localStorage.clear();
    root.style.removeProperty("--natal-banner-h");
    delete root.dataset.season;
  });
  afterEach(() => {
    vi.useRealTimers();
    window.history.replaceState(null, "", "/");
  });

  it("shows the strip inside the window and reserves its 40 px before the chunk loads", async () => {
    const { NatalBannerSlot } = await loadGate("", "2026-12-01T12:00:00Z");
    render(<NatalBannerSlot />);
    const region = screen.getByRole("region", { name: "Mensagem de Natal" });
    expect(region.style.height).toBe("40px");
    expect(root.style.getPropertyValue("--natal-banner-h")).toBe("40px");
    expect(root.dataset.season).toBe("natal");
  });

  it("renders nothing outside the window", async () => {
    const { NatalBannerSlot, NatalFooterSlot } = await loadGate("", "2026-12-27T03:00:00Z");
    const { container } = render(
      <>
        <NatalBannerSlot />
        <NatalFooterSlot />
      </>,
    );
    expect(container.innerHTML).toBe("");
    expect(root.dataset.season).toBeUndefined();
  });

  it("obeys ?season=off and ?season=natal", async () => {
    let gate = await loadGate("?season=off", "2026-12-01T12:00:00Z");
    const off = render(<gate.NatalBannerSlot />);
    expect(off.container.innerHTML).toBe("");
    off.unmount();

    gate = await loadGate("?season=natal", "2027-02-01T12:00:00Z");
    render(<gate.NatalBannerSlot />);
    expect(screen.getByRole("region", { name: "Mensagem de Natal" })).toBeInTheDocument();
  });

  it("closes, remembers it and releases the offset", async () => {
    const { NatalBannerSlot } = await loadGate("", "2026-12-01T12:00:00Z");
    const view = render(<NatalBannerSlot />);
    const close = await screen.findByRole("button", { name: "Fechar mensagem de Natal" }, { timeout: 15000 });
    await act(async () => {
      fireEvent.click(close);
    });
    expect(screen.queryByRole("region", { name: "Mensagem de Natal" })).toBeNull();
    expect(localStorage.getItem(NATAL_BANNER_DISMISS_KEY)).toBe("1");
    expect(root.style.getPropertyValue("--natal-banner-h")).toBe("0px");
    view.unmount();

    render(<NatalBannerSlot />);
    expect(screen.queryByRole("region", { name: "Mensagem de Natal" })).toBeNull();
  });

  it("strip copy has no price or promotion", async () => {
    const { NatalBannerSlot } = await loadGate("", "2026-12-01T12:00:00Z");
    render(<NatalBannerSlot />);
    const region = screen.getByRole("region", { name: "Mensagem de Natal" });
    await screen.findByRole("button", { name: "Fechar mensagem de Natal" }, { timeout: 15000 });
    expect(region.textContent).toContain("Feliz Natal geek!");
    expect(region.textContent).not.toMatch(/R\$|%|desconto|grátis|frete|promo/i);
  });
});
