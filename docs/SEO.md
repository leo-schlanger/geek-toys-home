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
| corpo pré-renderizado por rota + `dist/404.html` | `prerenderBodies` em `vite.config.ts` (renderiza `src/entry-server.tsx`) |
| sitemap (com `lastmod` por `git log`) | gerado no build pelo mesmo plugin (`buildSitemap`) |
| robots | `public/robots.txt` (`Sitemap:`) |
| JSON-LD (`@id`, `url`, `logo`, sameAs da loja) | `index.html` (`@graph`) |

`src/lib/seo.test.tsx` trava isso: reprova se o `index.html` citar
`geeketoys.com.br`/`www.geeketoys.com.br`/`www.geekpoptoys.com.br` como URL, se o
sitemap ou o robots mudarem de domínio, ou se o `SeoHead` gerar canonical fora
de `geekpoptoys.com.br`.

**Links de navegação (21/11/2026, decisão do Leo):** loja e clube abrem em
`shop.geekpoptoys.com.br` e `club.geekpoptoys.com.br` (`SHOP_URL`/`CLUB_URL` em
`src/lib/shop-api.ts`; `src/lib/nav-hosts.test.ts` reprova URL `*.geeketoys` fora de
`api.*`/`radio.*`). Quem estava logado ou tinha carrinho no host antigo entra uma vez
deslogado e com o carrinho vazio: sessão e carrinho vivem no `localStorage`, que é por
origem. As chamadas da API, a rádio e o e-mail `contato@geeketoys.com.br` continuam no
legado.

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

Até 21/11 o HTML bruto de **todas** as rotas, em todos
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
- Álbuns `/galeria/:slug` não estão no sitemap (vêm da API).

## Corpo pré-renderizado e 404 real (24/11/2026)

- O build renderiza o corpo de cada rota de `ROUTES_SEO` (`renderToString` de
  `src/entry-server.tsx`, num build SSR dentro do plugin) para o `<div id="root"
  data-route>` de cada shell: robôs sem JS leem o `<h1>` e o texto. Dados da API
  (produtos, evento, galeria, rádio) não entram: saem no estado de carregamento.
- **Sem hidratação**: o 1.º render do cliente depende do browser (evento em
  `localStorage`, pista da promo, Natal, `?season=`), por isso o `main.tsx` usa
  `createRoot`, que troca esse HTML num só commit. Antes carrega o chunk da página
  (`preloadRoute`, `src/routes.ts` + `src/lib/lazy-page.tsx`) para não pintar o
  fallback vazio do `Suspense`. CLS medido igual ao anterior (390/1280/1440).
- `vercel.json` já não tem o rewrite SPA: a Vercel serve o ficheiro da rota e o resto
  cai no `dist/404.html` com **status 404** (noindex, sem canonical nem og:url, corpo
  = `NotFound`). Só `/galeria/:slug` tem rewrite para `/galeria/index.html`.
- Rota nova no `App.tsx`: também em `src/routes.ts` (`pageFor`) e, se for dinâmica,
  rewrite no `vercel.json`. `src/entry-server.test.tsx` lê os `<Route path>` e reprova
  rota sem corpo, rota dinâmica sem rewrite e qualquer catch-all no `vercel.json`.

## Desempenho (21/11/2026)

- Fontes self-hosted (`src/assets/fonts/`, OFL) com preload das latin: o CSS do Google
  bloqueava a pintura (~480 ms) e a troca de fonte dava ~0,009 de CLS.
- Faixa de promo acima do hero: entrava ~1,3 s depois e empurrava o hero (CLS 0,09). O
  build grava `/promo` como pista (`#promo-hint`) e o `ShopPromoBanner` reserva a altura,
  invisível, até a API responder; a pista não é oferta nem entra nos preços. `public/boot.js`
  adianta `/promo` e `/events/active`, e a app reutiliza esses pedidos sem esperar por eles.
  Não segurar o primeiro render à espera da API (tentativa de 21/11: LCP 2,66 → 4,16 s).
  A faixa de evento ainda pode empurrar o hero na primeira visita quando houver evento ativo.
- Hero em WebP 768/1280/1920 com `fetchpriority=high` e preload (mesmo `srcset`) só no
  `index.html` da raiz; logo 3D em `<picture media>` (o telemóvel não o descarrega);
  logo da navbar/rodapé em WebP 192 px com dimensões.
- Fotos de produto pedem a miniatura `.thumb.webp` da API (`src/lib/product-thumb.ts`,
  mesma convenção da loja) com recuo para o original no `onError`.
- Rotas secundárias em `lazy()`.
