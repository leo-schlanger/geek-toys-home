/**
 * CPF do comprador, exigido pela Pagar.me para emitir o PIX do ingresso.
 * Mesma regra da loja (`validateCPF` em `clube-geek-toys/src/lib/utils.ts`):
 * conferir aqui evita que a cliente descubra o erro só depois do envio.
 */

export function isValidCPF(value: string): boolean {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  const digit = (length: number) => {
    let sum = 0;
    for (let i = 0; i < length; i++) sum += Number(cpf[i]) * (length + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return digit(9) === Number(cpf[9]) && digit(10) === Number(cpf[10]);
}

/** Máscara de digitação: só dígitos, formatado quando os 11 chegam. */
export function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits.length === 11
    ? digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    : digits;
}
