# SEO do site institucional

## Domínio canônico: `https://www.geeketoys.com.br` (06/11/2026)

O apex `geeketoys.com.br` não serve a página: a Vercel responde com redirect
para `www`. Até 06/11/2026 o canonical, o `og:url`, o sitemap, o `Sitemap:` do
robots e o JSON-LD apontavam para o apex — ou seja, para uma URL que só
redireciona. Agora tudo usa `www`:

| Onde | Fonte |
|---|---|
| canonical / og / twitter da home (HTML estático) | `index.html` |
| canonical / og por rota (`/links`, `/galeria`, `/termos`, `/privacidade`, álbuns) | `SeoHead` → `SITE_URL` em `src/lib/seo.ts` |
| sitemap | `public/sitemap.xml` |
| robots | `public/robots.txt` (`Sitemap:`) |
| JSON-LD | `index.html` (`@graph`) |

`src/lib/seo.test.tsx` trava isso: reprova se o `index.html` voltar a citar o
apex, se o sitemap ou o robots mudarem de domínio, ou se o `SeoHead` gerar
canonical fora de `www`.

`geekpoptoys.com.br` e `www.geekpoptoys.com.br` servem o mesmo build (200) e
declaram o canonical para `www.geeketoys.com.br` — é espelho, não concorrente.

### Redirect do apex

Hoje é **307** (temporário). O certo é **308** (permanente), para os buscadores
transferirem o sinal. Muda no painel da Vercel: projeto **geek-toys-home** →
**Settings → Domains** → `geeketoys.com.br` → **Edit** → *Redirect to*
`www.geeketoys.com.br` com **308 Permanent Redirect** → **Save**. Conferir:
`curl -sI https://geeketoys.com.br/ | head -1` → `HTTP/2 308`.

## JSON-LD

Um bloco com `@graph`: `Organization` (`/#organization`, dados legais de
`src/lib/company.ts`), `Store` (`/#store`, a loja física: telefone principal de
`src/data/contacts.ts`, e-mail exibido no site, endereço, horário e geo) e
`WebSite` (`/#website`). Store e WebSite apontam para a Organization pelo `@id`.
O teste confere telefone, e-mail, CNPJ e razão social contra essas fontes —
mudou um contato, mude o `index.html` junto.

Geo: `-22.9635, -43.1778`, o trecho da Rua Barata Ribeiro do CEP 22011-001 no
OpenStreetMap (Nominatim, 06/11/2026). O valor anterior (`-22.9711, -43.1822`)
caía cerca de 900 m ao sul.

## Alt das imagens

Fotos fixas da loja (`GallerySection`) têm alt que descreve o que aparece.
Fotos da API usam a legenda; sem legenda, `photoAlt()` monta
"<álbum> na GeekPop & Toys, foto N". Capa de álbum: "Capa do álbum <nome>".
