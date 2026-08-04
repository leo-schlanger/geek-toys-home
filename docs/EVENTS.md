# Eventos no site institucional — planejamento e operação

> **Última atualização:** 4 de Agosto de 2026  
> **Repo:** `geek-toys-home` (geeketoys.com.br)  
> **Pedido:** Laura (04/08/2026) — anúncio no topo, infos do evento, fotos com download, reserva de ingresso online

---

## 1. Pedido da Laura (resumo)

| Necessidade | Solução no site |
| --- | --- |
| Anúncio em cima da entrada do site | Banner fixo no topo (`EventAnnouncementBanner`), dispensável |
| Parte com informações do evento | Seção `#evento` (`EventSection`) |
| Fotos + download (evitar mandar foto por pessoa) | Seção `#fotos-evento` com lightbox + baixar 1 / baixar todas |
| Reservar ingresso online (pelo cliente) | Formulário `#ingressos` → WhatsApp da loja com dados da reserva |

**Também na loja online** (`shop.geeketoys.com.br`): mesmo fluxo no repo `clube-geek-toys` — ver `clube-geek-toys/docs/EVENTS.md` (banner em todas as páginas shop, card na home, rota `/evento`).

Sem backend novo: o site continua **estático**. Reservas vão para o WhatsApp da loja; fotos ficam em `public/eventos/`.

---

## 2. Arquitetura

```
src/data/event.ts                 ← fonte de verdade do evento ativo
src/components/
  EventAnnouncementBanner.tsx     ← topo do site
  EventSection.tsx                ← infos + highlights + link reserva
  EventPhotosSection.tsx          ← galeria + download
  EventTicketForm.tsx             ← formulário de reserva
public/eventos/<slug>/            ← JPGs/WebP do evento
  .gitkeep
```

Fluxo:

1. `ACTIVE_EVENT.enabled === true` → banner + seções + link na Navbar.
2. Cliente preenche reserva → abre `wa.me` com mensagem montada.
3. Após o evento, equipe sobe fotos em `public/eventos/<slug>/`, lista em `photos[]`, redeploy.
4. Cliente baixa a própria foto no site (sem DM individual).

---

## 3. Checklist operacional (Laura / loja)

### Antes do evento

- [ ] Preencher título, data, horário, endereço em `src/data/event.ts`
- [ ] Ajustar preço do ingresso (`ticketReservation.priceBRL`) ou `null` se gratuito
- [ ] Revisar textos do banner e da descrição
- [ ] Confirmar número WhatsApp (`ticketReservation.whatsappNumber`)
- [ ] `enabled: true` e `ticketReservation.enabled: true`
- [ ] Deploy do site

### Durante / após o evento (fotos)

- [ ] Exportar fotos (ideal WebP ou JPG ≤ 1920px de largura)
- [ ] Nomear de forma legível: `grupo-bts-01.jpg`, `mesa-skz-02.jpg`
- [ ] Copiar para `public/eventos/<slug>/`
- [ ] Listar em `ACTIVE_EVENT.photos` com `file` + `caption` opcional
- [ ] Deploy
- [ ] (Opcional) desligar reserva: `ticketReservation.enabled: false`
- [ ] Avisar no Instagram/WhatsApp: “fotos no site geeketoys.com.br#fotos-evento”

### Encerrar o evento

- [ ] `enabled: false` **ou** trocar o objeto `ACTIVE_EVENT` pelo próximo evento
- [ ] Manter pasta de fotos se quiser arquivo histórico (pode criar `/eventos/arquivo/...` no futuro)

---

## 4. UX implementada

### Banner

- Fixo no topo (`z-[60]`), cor primary/accent da marca
- CTAs: Reservar ingresso · Ver evento
- Fechar (X) grava dismiss em `localStorage` por `event.id` (não reaparece na mesma sessão de browser)

### Informações

- Data formatada pt-BR, local com link Maps
- Lista de highlights
- Benefício de membro do Clube (se configurado)

### Fotos

- Grid responsivo + lightbox
- Botão **Baixar** por foto (download com nome do arquivo)
- **Baixar todas** (sequencial; browsers podem pedir permissão de múltiplos downloads)
- Estado vazio amigável se `photos.length === 0`

### Reserva de ingresso

Campos: nome, telefone, e-mail, quantidade (1…max), observações  
Submit → WhatsApp com mensagem estruturada (evento, qtd, total estimado)

---

## 5. Roadmap (próximas iterações)

| Prioridade | Item | Notas |
| --- | --- | --- |
| MEDIO | CMS / painel admin para Laura editar sem dev | Hoje é editar `event.ts` + deploy |
| MEDIO | Upload de fotos pelo admin (clube API + volume) | Hoje é commit/SCP em `public/eventos` |
| BAIXO | ZIP “baixar todas” (JSZip) | Hoje baixa arquivo a arquivo |
| BAIXO | Histórico de eventos passados | Página `/eventos` listando slugs |
| FUTURO | Pagamento de ingresso no Stripe | Integração com clube-geek-toys |

---

## 6. Relação com o Clube

- Membros do **Clube GeekPop & Toys** (`club.geeketoys.com.br`) têm benefício de entrada em eventos participantes (texto no contrato e no site).
- A reserva online no home **não** valida carteirinha automaticamente; confirmação continua manual na loja / WhatsApp.
- Evolução natural: API no clube + flag `member_free_entry` na reserva.

---

## 7. Referência de código

| Arquivo | Papel |
| --- | --- |
| `src/data/event.ts` | Config + helpers de data/WhatsApp/URL de foto |
| `src/components/EventAnnouncementBanner.tsx` | Banner topo |
| `src/components/EventSection.tsx` | Bloco de informações |
| `src/components/EventPhotosSection.tsx` | Galeria + download |
| `src/components/EventTicketForm.tsx` | Formulário de reserva |
| `src/pages/Index.tsx` | Composição na home |
| `src/components/Navbar.tsx` | Link “Evento” condicional |
)
