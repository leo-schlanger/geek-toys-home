import { describe, it, expect } from "vitest";
import { isValidCPF, maskCPF } from "./cpf";

describe("isValidCPF", () => {
  it("aceita CPF válido, com ou sem máscara", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true);
    expect(isValidCPF("52998224725")).toBe(true);
  });

  it("recusa dígito verificador errado, repetição e tamanho errado", () => {
    expect(isValidCPF("529.982.247-24")).toBe(false);
    expect(isValidCPF("111.111.111-11")).toBe(false);
    expect(isValidCPF("5299822472")).toBe(false);
    expect(isValidCPF("")).toBe(false);
  });
});

describe("maskCPF", () => {
  it("formata só quando os 11 dígitos chegam", () => {
    expect(maskCPF("529982")).toBe("529982");
    expect(maskCPF("52998224725")).toBe("529.982.247-25");
    expect(maskCPF("529.982.247-2599")).toBe("529.982.247-25");
  });
});
