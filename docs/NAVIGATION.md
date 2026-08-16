# Navegação — GeekPop & Toys Home

> Atualizado em 16 de Agosto de 2026.
> Cobre a `Navbar`, o `ProfileMenu` ("Meu Perfil") e a regra de altura do banner
> de evento — que já derrubou o menu mobile inteiro uma vez.

---

## Anatomia da barra

```
┌──────────────────────────────────────────────────────────────────────┐
│ EventAnnouncementBanner        fixed · top-0 · z-[60]                 │
├──────────────────────────────────────────────────────────────────────┤
│ Navbar   fixed · z-50 · top: var(--event-banner-h)                    │
│                                                                       │
│  [logo]   Início Produtos … Loja Clube      [busca] [perfil] [tema]   │
│           └──── hidden xl:flex ────┘        └── sempre visível ──┘    │
└──────────────────────────────────────────────────────────────────────┘
```

Duas zonas com comportamentos diferentes:

| Zona            | Classe          | Abaixo de 1280px           |
| --------------- | --------------- | -------------------------- |
| Lista de links  | `hidden xl:flex` | some, vira hambúrguer      |
| Grupo da direita | (sem breakpoint) | **continua visível**       |

O grupo da direita é onde entra o que alguém precisa alcançar **sem abrir menu
nenhum**: busca de produto, perfil e tema.

---

## `ProfileMenu` — "Meu Perfil"

### Por que não mostra quem está logado

Este site **não tem login**. É estático, servido do Vercel a partir do apex
(`geeketoys.com.br`), e o JWT de quem já é cliente vive no `localStorage` de
`club.geeketoys.com.br` e `shop.geeketoys.com.br` — que é **por origem**. Daqui
não há como ler, nem como saber se alguém está autenticado.

Por isso o menu não tem nome, avatar nem estado. Ele é **encaminhamento
honesto**, não sessão. Qualquer tentativa de mostrar "Olá, Fulano" aqui exigiria
SSO por cookie de domínio-pai — decisão de arquitetura, não ajuste de UI.

### Por que dois destinos e não um

São dois cadastros distintos, em subdomínios distintos:

| Público         | Destino                                | O que a pessoa encontra              |
| --------------- | -------------------------------------- | ------------------------------------ |
| Membro do Clube | `club.geeketoys.com.br/membro`         | Carteirinha, assinatura, 15%         |
| Cliente da loja | `shop.geeketoys.com.br/minhas-compras` | Pedidos, rastreio, avaliações        |

Um link só obrigaria a escolher um público e deixar o outro sem caminho. As
descrições sob cada rótulo existem porque "Área do Membro" e "Minhas Compras",
sozinhos, não separam os dois públicos para quem é leigo.

### Deslogado não cai em beco

Verificado no `clube-geek-toys`:

| Destino            | Deslogado vai para                  |
| ------------------ | ----------------------------------- |
| `/membro`          | `/login` (ProtectedRoute)           |
| `/minhas-compras`  | `/entrar?next=/minhas-compras`      |

O segundo é melhor: volta para a página pedida depois de autenticar.

### Dois modos

| Modo             | Onde         | Comportamento                                    |
| ---------------- | ------------ | ------------------------------------------------ |
| padrão           | grupo direita | botão + dropdown; rótulo aparece a partir de `lg` |
| `inline`         | menu mobile   | lista aberta, sem botão                          |

O `inline` existe porque, dentro de um painel já expandido, um segundo nível de
clique só atrapalha.

---

## ⚠️ Altura do banner de evento — leia antes de mexer

`--event-banner-h` é o quanto a `Navbar` desce por causa do
`EventAnnouncementBanner`, que é `fixed` com z-index **maior** que a nav.

**Essa altura tem que ser medida, nunca chutada.**

### O que aconteceu em 16/08/2026

O código publicava dois números fixos:

```ts
mq.matches ? "44px" : "72px"   // ❌ não faça isso
```

O `bannerText` vem de `data/event.ts` e é conteúdo editável. Ele cresceu, e a
390px passou a quebrar em três linhas:

| Largura | Altura real | Var dizia | Sobra por cima da nav |
| ------- | ----------- | --------- | --------------------- |
| 360px   | 111px       | 72px      | **39px**              |
| 390px   | 111px       | 72px      | **39px**              |
| 768px   | 62px        | 44px      | 18px                  |

Consequência medida no navegador: a 360–390px o **hambúrguer do menu mobile
ficava sob o banner e não podia ser tocado**. `document.elementFromPoint` no
centro do botão devolvia o banner. A navegação inteira do site ficou
inacessível em telas estreitas — e ninguém notou, porque no desktop tudo
funcionava.

### Como está agora

Um `ResizeObserver` no elemento publica a altura real, arredondada para cima
(meio pixel a menos já reexpõe a nav). Pega também quebra por rotação, zoom e
fonte que carrega tarde — casos que um `matchMedia` por largura não enxerga.

Coberto por `src/components/EventAnnouncementBanner.test.tsx`, que reprova
qualquer volta a valor por breakpoint. `src/test/setup.ts` traz um stub de
`ResizeObserver`, que o jsdom não implementa.

---

## Ao acrescentar um item na navegação

1. Link interno usa `<Link>`; âncora e externo seguem como `<a>` (ver `NavItem`).
2. Fora da home, âncora precisa virar `/#secao` — é o que `resolveHref` faz.
3. Se o item precisa ser alcançável no celular **sem abrir o hambúrguer**, ele
   vai no grupo da direita, não na lista de links.
4. Meça no celular de verdade (360px), não só no desktop. Foi o que faltou no
   caso do banner.
