import { describe, expect, it } from "vitest";
import { isNatalActive, NATAL_WINDOW, parseSeasonOverride, resolveNatal } from "./isNatalActive";

describe("isNatalActive", () => {
  it("is off before 13 Nov 00:00 UTC", () => {
    expect(isNatalActive(new Date("2026-11-12T23:59:59.999Z"))).toBe(false);
  });

  it("is on from the first instant of the window", () => {
    expect(isNatalActive(new Date("2026-11-13T00:00:00Z"))).toBe(true);
    expect(isNatalActive(new Date("2026-12-24T23:00:00-03:00"))).toBe(true);
  });

  it("keeps the whole of 26 Dec in Rio", () => {
    expect(isNatalActive(new Date("2026-12-26T23:59:59-03:00"))).toBe(true);
    expect(isNatalActive(new Date("2026-12-27T02:59:59.999Z"))).toBe(true);
  });

  it("turns off at 27 Dec 00:00 in Rio (03:00 UTC)", () => {
    expect(isNatalActive(new Date("2026-12-27T00:00:00-03:00"))).toBe(false);
    expect(isNatalActive(new Date("2026-12-27T03:00:00Z"))).toBe(false);
    expect(isNatalActive(new Date("2027-12-01T12:00:00Z"))).toBe(false);
  });

  it("is off with an invalid date", () => {
    expect(isNatalActive(new Date("nope"))).toBe(false);
    expect(isNatalActive(new Date("2026-12-01T12:00:00Z"), { ...NATAL_WINDOW, start: "nope" })).toBe(false);
  });
});

describe("season override", () => {
  const outside = new Date("2027-01-10T12:00:00Z");
  const inside = new Date("2026-12-01T12:00:00Z");

  it("reads only natal or off", () => {
    expect(parseSeasonOverride("?season=natal")).toBe("natal");
    expect(parseSeasonOverride("?a=1&season=off")).toBe("off");
    expect(parseSeasonOverride("?season=halloween")).toBeNull();
    expect(parseSeasonOverride("")).toBeNull();
  });

  it("forces the theme on or off, otherwise follows the date", () => {
    expect(resolveNatal(outside, "?season=natal")).toBe(true);
    expect(resolveNatal(inside, "?season=off")).toBe(false);
    expect(resolveNatal(inside, "")).toBe(true);
    expect(resolveNatal(outside, "?season=xmas")).toBe(false);
  });
});
