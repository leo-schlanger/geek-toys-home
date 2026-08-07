/**
 * Contatos oficiais da loja GeekPop & Toys.
 * Loja (atendentes) primeiro; Norberto como secundário.
 */

export type ContactPhone = {
  id: string
  label: string
  /** E.164 sem + (ex.: 5511914662881) */
  e164: string
  display: string
  /** Destacar como principal na UI */
  primary?: boolean
  note?: string
}

export const STORE_PHONES: ContactPhone[] = [
  {
    id: 'loja',
    label: 'WhatsApp da loja',
    e164: '5511914662881',
    display: '(11) 91466-2881',
    primary: true,
    note: 'Atendimento diário — equipe da loja',
  },
  {
    id: 'norberto',
    label: 'WhatsApp (Norberto)',
    e164: '5521985464666',
    display: '(21) 98546-4666',
    note: 'Contato da gerência',
  },
]

/** Número principal (atendentes) — CTAs, reservas, float */
export const PRIMARY_WHATSAPP = STORE_PHONES[0]

export const EMAIL = 'geeketoys@gmail.com'

export function waMeUrl(e164: string, text?: string): string {
  const base = `https://wa.me/${e164}`
  if (!text?.trim()) return base
  return `${base}?text=${encodeURIComponent(text)}`
}

export function primaryWhatsAppUrl(text?: string): string {
  return waMeUrl(PRIMARY_WHATSAPP.e164, text)
}
