import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { NONO_COOL, NONO_STANDING } from "@/lib/nono";

// The season is read once at import: re-import per case.
async function load(search: string, now: string) {
  vi.resetModules();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(now));
  window.history.replaceState(null, "", `/${search}`);
  return (await import("./NonoFigure")).NonoFigure;
}

const CLS = "w-16 md:w-20 h-auto shrink-0 drop-shadow-md";

describe("NonoFigure", { timeout: 30000 }, () => {
  afterEach(() => {
    vi.useRealTimers();
    window.history.replaceState(null, "", "/");
  });

  it("outside Christmas is the plain image, exactly as before", async () => {
    const NonoFigure = await load("", "2027-01-05T12:00:00Z");
    const { container } = render(
      <NonoFigure pose={NONO_STANDING} hat="standing" className={CLS} seasonClassName="block w-16" sizes="80px" />,
    );
    const img = container.firstElementChild as HTMLImageElement;
    expect(img.tagName).toBe("IMG");
    expect(img.className).toBe(CLS);
    expect(img.alt).toBe(NONO_STANDING.alt);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("?season=off wins inside the window", async () => {
    const NonoFigure = await load("?season=off", "2026-12-10T12:00:00Z");
    const { container } = render(<NonoFigure pose={NONO_COOL} hat="cool" className="w-48" seasonClassName="block w-48" />);
    expect(container.firstElementChild?.tagName).toBe("IMG");
  });

  it("during Christmas wears the hat, keeps the size classes and reserves head room", async () => {
    const NonoFigure = await load("", "2026-12-10T12:00:00Z");
    const { container } = render(
      <NonoFigure pose={NONO_COOL} hat="cool" hatRoom className="w-48" seasonClassName="block mx-auto w-48 nono-bob" />,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toBe("block mx-auto w-48 nono-bob");
    expect(wrapper.style.paddingTop).toBe("9%");
    expect(screen.getByAltText(/óculos escuros.*gorro de Papai Noel/)).toBeInTheDocument();
    await waitFor(() => expect(container.querySelector('svg[data-pose="cool"]')).not.toBeNull(), { timeout: 15000 });
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
