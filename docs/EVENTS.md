# Eventos no site institucional — operação

> **Última atualização:** 28 de Setembro de 2026  
> **Repo:** `geek-toys-home` (geeketoys.com.br / www)  
> **Evento em cartaz:** 11/out 14h–18h, Mar Palace Copacabana Hotel, entrada R$ 20 (membro R$ 10), WhatsApp loja, fotos na **galeria geral**  
> **Pagamento:** PIX da Pagar.me, que **confirma sozinho** e libera os ingressos (desde 28/09/2026)  
> **Quem edita:** a admin, na aba **Eventos** do painel da loja — **não** é mais um arquivo deste repo.

---

## 1. O que o site faz

| Necessidade | Solução |
| --- | --- |
| Anúncio no topo | `EventAnnouncementBanner` (dismissível) |
| Infos do evento | Seção `#evento` (`EventSection`) |
| Reserva de ingresso | Formulário `#ingressos` → **grava na API** e leva ao PIX |
| Fotos | **Galeria** em `/galeria` (pastas no painel; ver [`GALLERY.md`](GALLERY.md)) — lightbox, **sem download** |
| Produtos | `#produtos` + API `api.geeketoys.com.br` |
| Contatos | Loja `(11) 91466-2881` primeiro; gerência `(21) 98546-4666` |

**Loja online** (`shop.geeketoys.com.br`): banner, card, `/evento`, reserva — ver `clube-geek-toys/docs/EVENTS.md`. Fotos **não** ficam na loja; link aponta para `#galeria` do home.

Site **estático** (Vercel), mas a reserva **não é mais estática**: o formulário
faz `POST /events/:id/reservations` na API da loja, exatamente como `shop.*`. As
duas vitrines caem na mesma tabela `event_reservations`.

> **Corrigido em 23/08/2026.** Até esta data o formulário daqui só montava uma
> mensagem de `wa.me`: a reserva não existia no banco, o cliente nunca via o
> PIX e a admin não era notificada. Uma reserva de 2 ingressos chegou como
> mensagem solta no WhatsApp e não havia como cobrar nem confirmar — foi
> lançada à mão depois. O WhatsApp continua existindo, mas como **fallback**
> de quando a API não responde.

---

## 2. Arquitetura

```
src/hooks/useActiveEvent.ts    ← evento vivo, de GET /events/active
src/data/event.ts              ← tipos + FALLBACK (só primeiro paint; editar NÃO muda o site)
src/lib/category-icons.ts      ← ícone por categoria (mesma tabela da loja)
src/data/contacts.ts           ← telefones oficiais
src/components/
  EventAnnouncementBanner.tsx
  EventSection.tsx             ← infos + destaques
  EventTicketForm.tsx          ← reserva → POST na API (wa.me é fallback)
  GallerySection.tsx           ← bloco da home (álbuns da API, fallback estático)
  pages/Gallery.tsx            ← página /galeria e /galeria/:slug
  ProductsSection.tsx          ← vitrine API
  PromoSection.tsx
public/eventos/<slug>/         ← JPGs (ex.: evento-01.jpg … evento-35.jpg)
```

Fluxo:

1. `GET https://api.geeketoys.com.br/events/active` → o evento publicado no
   painel da loja. `status === 'published'` → banner + seção evento + nav.
   Falha de rede cai no `FALLBACK_EVENT` embutido — o site nunca fica sem evento
   por causa de um timeout.
2. Cliente reserva → `POST /events/:id/reservations` com **um nome por
   pessoa** (o ingresso é nominal) e o **CPF de quem paga** — a Pagar.me não
   emite o PIX sem ele (`src/lib/cpf.ts` confere antes de enviar; reserva só de
   isentos não pede). A API devolve o código da reserva, os ingressos e o
   **PIX**; o site manda a pessoa para `shop.geeketoys.com.br/ingressos/<código>`,
   onde o QR e o copia-e-cola já são renderizados e a página **espera o
   pagamento**: quando o PIX cai, os ingressos aparecem ali e chegam por e-mail,
   sem ninguém da loja confirmar. O código vale 24 h.
   Se a API não responder, aí sim cai no `wa.me` com o pedido inteiro montado.
   Se ela **recusar** (CPF inválido, reservas fechadas), o site mostra o erro e
   a cliente corrige — mandar para o WhatsApp uma reserva que o servidor
   recusou só empurrava o problema para a equipe.
3. Fotos: arquivos em `public/eventos/kpop-night/` referenciados em `GallerySection` (padrão `evento-NN.jpg`).
4. Sem seção `#fotos-evento` e sem botões de baixar.

---

## 3. Checklist operacional

### Antes do evento

- [x] Data/hora/local/preço na aba **Eventos** do painel da loja (11/out 14h–18h, Mar Palace, R$ 20)
- [x] WhatsApp `(11) 91466-2881`
- [x] Status **Publicado** e reserva ativa
- [x] Sem deploy: o site lê da API (cache de 1 min)

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
| `src/data/event.ts` | Tipos + fallback (a config vive no banco da loja) |
| `src/hooks/useActiveEvent.ts` | Evento vivo, de `GET /events/active` |
| `src/lib/category-icons.ts` | Ícone por categoria — antes era uma nota musical fixa em **todas** |
| `src/data/contacts.ts` | Telefones |
| `src/components/GallerySection.tsx` | Bloco da home; lê os álbuns da API |
| `src/pages/Gallery.tsx` | Página própria da galeria, com pastas |
| `src/components/EventSection.tsx` | Infos |
| `src/components/EventTicketForm.tsx` | Reserva |
| `src/pages/Index.tsx` | Composição da home |
