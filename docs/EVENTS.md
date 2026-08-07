# Eventos no site institucional — operação

> **Última atualização:** 7 de Agosto de 2026  
> **Repo:** `geek-toys-home` (geeketoys.com.br / www)  
> **Pedido Laura (04–07/08/2026):** evento 6/set 14h–18h, R$ 20, WhatsApp loja, loja em foco, fotos na **galeria geral**

---

## 1. O que o site faz

| Necessidade | Solução |
| --- | --- |
| Anúncio no topo | `EventAnnouncementBanner` (dismissível) |
| Infos do evento | Seção `#evento` (`EventSection`) |
| Reserva de ingresso | Formulário `#ingressos` → WhatsApp da loja |
| Fotos | **Galeria geral** `#galeria` (`GallerySection`) — lightbox, **sem download** |
| Produtos | `#produtos` + API `api.geeketoys.com.br` |
| Contatos | Loja `(11) 91466-2881` primeiro; gerência `(21) 98546-4666` |

**Loja online** (`shop.geeketoys.com.br`): banner, card, `/evento`, reserva — ver `clube-geek-toys/docs/EVENTS.md`. Fotos **não** ficam na loja; link aponta para `#galeria` do home.

Site **estático** (Vercel). Reservas vão para WhatsApp; não há backend de ingresso.

---

## 2. Arquitetura

```
src/data/event.ts              ← evento ativo (data, preço, textos, WhatsApp)
src/data/contacts.ts           ← telefones oficiais
src/components/
  EventAnnouncementBanner.tsx
  EventSection.tsx             ← infos + destaques
  EventTicketForm.tsx          ← reserva → wa.me
  GallerySection.tsx           ← galeria geral (loja + fotos do evento)
  ProductsSection.tsx          ← vitrine API
  PromoSection.tsx
public/eventos/<slug>/         ← JPGs (ex.: evento-01.jpg … evento-35.jpg)
```

Fluxo:

1. `ACTIVE_EVENT.enabled === true` → banner + seção evento + nav.
2. Cliente reserva → `wa.me` com mensagem montada.
3. Fotos: arquivos em `public/eventos/kpop-night/` referenciados em `GallerySection` (padrão `evento-NN.jpg`).
4. Sem seção `#fotos-evento` e sem botões de baixar.

---

## 3. Checklist operacional

### Antes do evento

- [x] Data/hora/local/preço em `src/data/event.ts` (6/set 14h–18h, R$ 20)
- [x] WhatsApp `(11) 91466-2881`
- [x] `enabled: true` e reserva ativa
- [x] Deploy home (Vercel em push `main`)

### Fotos

- [x] 35 fotos Laura (07/08/2026) em `public/eventos/kpop-night/evento-01…35.jpg`
- [x] Integradas na galeria geral (`GallerySection`)
- [ ] Após o dia do evento: substituir/adicionar fotos finais e redeploy

### Encerrar

- [ ] `enabled: false` ou trocar `ACTIVE_EVENT` pelo próximo evento

---

## 4. Contatos

| Prioridade | Número | Uso |
| --- | --- | --- |
| 1º | (11) 91466-2881 | WhatsApp loja (atendentes) |
| 2º | (21) 98546-4666 | Gerência |

Shopee e Mercado Livre **não** aparecem no site.

---

## 5. Deploy

Sem GitHub Actions. Push em `main` → Vercel (`www.geeketoys.com.br`; apex redireciona).

```bash
npm run build   # local
# produção: push main
```

---

## 6. Arquivos

| Arquivo | Papel |
| --- | --- |
| `src/data/event.ts` | Config evento |
| `src/data/contacts.ts` | Telefones |
| `src/components/GallerySection.tsx` | Galeria geral + fotos |
| `src/components/EventSection.tsx` | Infos |
| `src/components/EventTicketForm.tsx` | Reserva |
| `src/pages/Index.tsx` | Composição da home |
