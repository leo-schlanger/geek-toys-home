# SEO do site institucional

## Domínio canônico: `https://geekpoptoys.com.br` (06/11/2026)

O domínio principal é **geekpoptoys.com.br, sem www** (decisão do Leo,
06/11/2026). `geeketoys.com.br` é legado **mas continua no ar e em uso**: não se
redireciona para o novo. O SEO resolve-se só pelo canonical — todas as páginas,
em qualquer host, declaram `https://geekpoptoys.com.br`:

| Onde | Fonte |
|---|---|
| canonical / og / twitter da home (HTML estático) | `index.html` |
| canonical / og por rota (`/links`, `/galeria`, `/termos`, `/privacidade`, álbuns) | `SeoHead` → `SITE_URL` em `src/lib/seo.ts` |
| title/description de cada rota fixa (fonte única) | `src/lib/seo-routes.ts` (`ROUTES_SEO`) |
| head estático por rota (`dist/<rota>/index.html`) | plugin `seoShells` em `vite.config.ts` |
| sitemap (com `lastmod` por `git log`) | gerado no build pelo mesmo plugin (`buildSitemap`) |
| robots | `public/robots.txt` (`Sitemap:`) |
| JSON-LD (`@id`, `url`, `logo`, sameAs da loja) | `index.html` (`@graph`) |

`src/lib/seo.test.tsx` trava isso: reprova se o `index.html` citar
`geeketoys.com.br`/`www.geeketoys.com.br`/`www.geekpoptoys.com.br` como URL, se o
sitemap ou o robots mudarem de domínio, ou se o `SeoHead` gerar canonical fora
de `geekpoptoys.com.br`.

**Só o SEO mudou de host.** Os links e chamadas do site (loja `shop.geeketoys`,
clube, API, ingressos, rádio) ficam como estão: trocar o host de uma chamada
pode quebrar sessão (o JWT da loja/clube vive no `localStorage`, que é por
origem), CORS ou e-mail. O e-mail `contato@geeketoys.com.br` também fica.

### Domínios na Vercel (projeto geek-toys-home, estado em 06/11/2026)

| Domínio | Configuração |
|---|---|
| `geekpoptoys.com.br` | serve o site (200) |
| `www.geekpoptoys.com.br` | serve o site (200) — sem redirect, de propósito |
| `geeketoys.com.br` | 307 → `www.geeketoys.com.br` (legado, não mexer) |
| `www.geeketoys.com.br` | serve o site (200) (legado, não mexer) |

Não crie redirect dos domínios legados para o novo: o Leo pediu para mantê-los
(«vai ser usado»). Configuração gravada em
`~/.cache/nono/vercel-domains-antes.json` (fora do repo).

## JSON-LD

Um bloco com `@graph`: `Organization` (`/#organization`, dados legais de
`src/lib/company.ts`), `Store` (`/#store`, a loja física: telefone, geo e horário do Perfil da Empresa no
Google, e-mail exibido no site e endereço) e
`WebSite` (`/#website`). Store e WebSite apontam para a Organization pelo `@id`.
O teste confere telefone, e-mail, CNPJ e razão social contra essas fontes —
mudou um contato, mude o `index.html` junto.

Fonte da verdade do telefone, geo e horário: o **Perfil da Empresa no Google**
(Leo, 06/11/2026) — telefone +55 21 98546-4666 (o (11) 91466-2881 segue como
WhatsApp de atendimento no site), pino `-22.9652592, -43.1800191`, Seg–Sex
09:00–19:00 e Sáb 09:00–16:00. O teste trava esses valores.

## Alt das imagens

Fotos fixas da loja (`GallerySection`) têm alt que descreve o que aparece.
Fotos da API usam a legenda; sem legenda, `photoAlt()` monta
"<álbum> na GeekPop & Toys, foto N". Capa de álbum: "Capa do álbum <nome>".

## Head estático por rota (21/11/2026)

O site é SPA sem prerender. Até 21/11 o HTML bruto de **todas** as rotas, em todos
os hosts, trazia title, description e canonical da home; só o JS (`SeoHead`) os
trocava. O plugin `seoShells` (`vite.config.ts`) agora escreve no build um
`dist/<rota>/index.html` para cada rota fixa de `ROUTES_SEO`, com o head próprio
(title, description, canonical, og, twitter e `BreadcrumbList`). O corpo continua
SPA. A Vercel serve o ficheiro antes do rewrite (`vercel.json` não mudou).

- Rota fixa nova no `App.tsx` → entra em `ROUTES_SEO`; `seo.test.tsx` lê os
  `<Route path>` e reprova se faltar (também tamanho e unicidade de title/description).
- `index.html` (home) tem de repetir `HOME_SEO` (teste).
- `lastmod`: último commit dos ficheiros da rota (`sources`); num clone raso a data do
  commit de fronteira é descartada e a rota fica sem `lastmod` (nunca a data do build).
- BreadcrumbList só nas sub-rotas e nos álbuns (`SeoHead` com `crumbs`), nunca no `index.html`.
- Rota inexistente continua a responder 200 com o head da home (soft-404; o `NotFound` põe
  `noindex` via JS). Corrigir exige mexer no `vercel.json`: decisão do Leo.
- Álbuns `/galeria/:slug` não estão no sitemap (vêm da API).

## Desempenho (21/11/2026)

- Fontes self-hosted (`src/assets/fonts/`, OFL) com preload das latin: o CSS do Google
  bloqueava a pintura (~480 ms) e a troca de fonte dava ~0,009 de CLS.
- Faixas acima do hero (promo `/promo`, evento `/events/active`): `public/boot.js` pede-as
  na home antes do bundle e o `main.tsx` (`primeFirstScreen`) espera até 400 ms para pintar
  já com elas. Antes a faixa de promo entrava ~1,3 s depois e empurrava o hero (CLS 0,09).
- Hero em WebP 768/1280/1920 com `fetchpriority=high` e preload (mesmo `srcset`) só no
  `index.html` da raiz; logo 3D em `<picture media>` (o telemóvel não o descarrega);
  logo da navbar/rodapé em WebP 192 px com dimensões.
- Fotos de produto pedem a miniatura `.thumb.webp` da API (`src/lib/product-thumb.ts`,
  mesma convenção da loja) com recuo para o original no `onError`.
- Rotas secundárias em `lazy()`.
