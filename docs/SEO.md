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
| sitemap | `public/sitemap.xml` |
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
