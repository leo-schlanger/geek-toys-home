# GeekPop & Toys — Site Institucional

Site público da loja **GeekPop & Toys**, em `geeketoys.com.br`. É a vitrine institucional: apresenta a loja, o evento ativo, a galeria, a rádio e encaminha para onde as coisas acontecem de verdade — a loja online e o clube.

> **Stack**: React 19 + Vite | TypeScript | Tailwind + shadcn/ui | React Query | Vercel

---

## O que este site é (e o que não é)

**É** um site estático servido pela Vercel. Não tem banco, não tem sessão e **não tem login**.

**Não é** a loja nem o clube. Aqueles são o [projeto irmão](https://github.com/leo-schlanger/clube-geek-toys), que roda numa VPS própria:

| Este repo | Projeto irmão (`clube-geek-toys`) |
| --- | --- |
| `geeketoys.com.br` — institucional | `shop.geekpoptoys.com.br` — loja e-commerce |
| Vercel, estático | VPS, Docker + Postgres |
| Sem cadastro | Cadastro, pedidos, pagamento, admin |

A consequência prática aparece no `ProfileMenu`: como o JWT do cliente vive no `localStorage` de `club.*` e `shop.*`, que é por origem, **daqui não há como saber se alguém está logado**. O menu não mostra nome nem avatar; ele é um encaminhamento honesto para onde o perfil existe.

---

## Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Home: produtos, evento, quem somos, galeria, rádio, promoções, contato |
| `/links` | Página de bio para redes sociais (foco Instagram) — substitui o Linktree |
| `/galeria` e `/galeria/:slug` | Álbuns de fotos de eventos e da loja |
| `/termos` e `/privacidade` | Documentos legais |

> Todas dependem do rewrite de SPA em `vercel.json`. Sem ele, só `/` responde e o resto dá 404 — foi assim que `/galeria`, `/termos` e `/privacidade` ficaram quebrados por um período, com o `sitemap.xml` anunciando as três ao Google.

---

## Integrações

Este site não tem backend próprio. Ele consome:

- **API da loja** (`api.geeketoys.com.br`) via `src/lib/shop-api.ts` — produtos na vitrine e álbuns da galeria
- **AzuraCast** (`radio.geeketoys.com.br`) via `src/hooks/useNowPlaying.ts` — "agora tocando", pelo endpoint estático cacheado
- **WhatsApp** — reserva de ingresso e contato, sem formulário no servidor

Se a API não responder, a galeria cai para as fotos que vêm no bundle em vez de aparecer vazia.

---

## Onde mexer no conteúdo

A operação do dia a dia é editar dados, não componentes:

| Arquivo | O que controla |
| --- | --- |
| `src/data/event.ts` | Evento ativo: data, local, preço, texto do banner. `enabled: false` esconde tudo |
| `src/data/links.ts` | Links da página `/links` — é o que a bio do Instagram aponta |
| `src/data/contacts.ts` | Telefones de WhatsApp e e-mail |

O `event.ts` tem uma cópia no projeto irmão (`src/data/event.ts`). **Ao mudar a campanha, edite os dois**, ou a mesma promoção aparece com frases diferentes em cada domínio.

---

## Setup Local

```bash
npm install
npm run dev        # Vite em modo desenvolvimento
```

```bash
npm run build      # Build de produção
npm run preview    # Preview do build
npm run lint       # ESLint
npm test           # Vitest
```

> Há 2 erros de lint pré-existentes em `src/components/ui/` (boilerplate shadcn com interface vazia). Não são regressão; ficam registrados aqui para não serem confundidos com quebra nova.

---

## Deploy

Push em `main` dispara deploy automático na Vercel. O apex `geeketoys.com.br` redireciona para `www`, e `geekpoptoys.com.br` é um espelho completo.

`vercel.json` faz o rewrite de SPA — sem ele, deep link quebra.

---

## SEO

- Meta por página via `SeoHead`, com canonical próprio por rota
- `public/sitemap.xml` lista as rotas públicas; mantenha em dia ao criar página nova
- `public/robots.txt` aponta os sitemaps deste site e da loja

---

## Convenções

- Comentários de código em **inglês**; texto de interface e mensagens de erro em **português**, que é o idioma de quem usa
- Commits em inglês técnico, imperativo (`fix: ...`, `feat: ...`), sem `Co-Authored-By`

---

## Contato

**GeekPop & Toys** — Rua Barata Ribeiro, 181, Loja J — Copacabana, Rio de Janeiro, RJ

- Site: [geeketoys.com.br](https://geeketoys.com.br) · [links](https://geeketoys.com.br/links)
- Instagram: [@geeketoys](https://instagram.com/geeketoys)
- WhatsApp: [(11) 91466-2881](https://wa.me/5511914662881)

---

## Licença

Repositório **proprietário**. Publicado para fins de portfólio e referência técnica. Todos os direitos reservados a GeekPop & Toys.
