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

| Zona                  | Classe           | Abaixo de 1280px      |
| --------------------- | ---------------- | --------------------- |
| Lista de links        | `hidden xl:flex` | some, vira hambúrguer |
| Busca                 | `hidden sm:block` | some abaixo de 640px |
| **Meu Perfil**        | `hidden xl:block` | some, vai pro hambúrguer |
| Tema                  | (sem breakpoint) | **continua visível**  |

Só o tema fica sempre à mão. Perfil e busca recolhem porque o painel deles não
cabe ancorado à direita numa tela estreita — sai cortado pela borda.

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

| Modo     | Onde                    | Comportamento                    |
| -------- | ----------------------- | -------------------------------- |
| padrão   | grupo direita, só `xl+` | botão + dropdown de 288px        |
| `inline` | menu mobile, abaixo de `xl` | lista aberta, sem botão      |

O `inline` existe por dois motivos: dentro de um painel já expandido um segundo
nível de clique só atrapalha, e — o que decidiu a questão — **o dropdown de
288px não cabe numa tela de 390px** ancorado à direita. A primeira versão
deixava o botão visível no celular e o painel saía cortado pela borda esquerda.
O `w-[min(18rem,calc(100vw-2rem))]` é o cinto de segurança para isso não voltar.

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

## Menu mobile aberto

O painel do hambúrguer tem `overflow-y-auto` e teto de
`calc(100vh - var(--event-banner-h) - 4rem)`: banner mais barra comem ~156px de
uma tela de 844px, e a lista passa disso. Sem isso o último item ficava cortado
pela borda, sem jeito de alcançá-lo.

A ordem dentro do painel é **busca → Meu Perfil → links → CTAs**. "Meu Perfil"
vem antes dos links porque quem abre o menu já sendo cliente vem atrás da
própria conta.

Enquanto o menu está aberto, a `Navbar` marca `document.body` com
`data-nav-open="true"`, e `index.css` esconde o `[data-floating-whatsapp]`.
O botão do WhatsApp é `fixed bottom-5 right-5 z-50` e ficava por cima dos
últimos itens da lista. O atributo no body existe porque o `WhatsAppFloat` é
irmão da Navbar em `Index.tsx` — não alcança aquele estado por props, e criar
um contexto só para isso não se paga.

**Ao acrescentar outro elemento flutuante**, dê a ele o mesmo tratamento: ou
some com o menu aberto, ou fica fora da área do painel.

## Alvos de toque

Varredura de 16/08/2026 a 360/390/414/768/1024/1440px. Os **controles isolados
de ícone** ficam em 44x44 (Apple HIG); WCAG 2.5.8 AA exige 24x24 como piso.

| Controle                    | Antes | Agora |
| --------------------------- | ----- | ----- |
| Hambúrguer do menu          | 24x24 | 44x44 |
| Fechar anúncio (banner)     | 28x28 | 44x44 |
| Perfil / tema / busca       | 32x32 | 40x40 |

Feito **só com padding** — o ícone renderiza no mesmo tamanho; o que cresceu é
a área que aceita o dedo. O hambúrguer leva `-mr-2` para o padding extra não
empurrar a linha.

**Link de texto inline não entra nessa conta.** Os links da navbar medem 17px
de altura porque isso é o line-height da fonte; a WCAG isenta explicitamente
link dentro de bloco de texto. Não os infle.

## O que a varredura considera falso positivo

A seção Rádio acusa elementos "vazando" 95–168px do pai. São `div`/`img`
decorativos com `pointer-events-none` (glows e o fundo do card), que
transbordam de propósito e ficam contidos por um ancestral. A prova de que não
é problema: **não há rolagem horizontal em nenhuma largura testada**. Use isso
como critério antes de "consertar" um vazamento.

## Ao acrescentar um item na navegação

1. Link interno usa `<Link>`; âncora e externo seguem como `<a>` (ver `NavItem`).
2. Fora da home, âncora precisa virar `/#secao` — é o que `resolveHref` faz.
3. Item com painel/dropdown recolhe para dentro do hambúrguer no celular — um
   painel ancorado à direita não cabe em tela estreita. Só controle de um
   clique só (como o tema) fica sempre visível.
4. Meça no celular de verdade (360px), não só no desktop. Foi o que faltou no
   caso do banner.
5. Controle isolado de ícone nasce com 44x44 de área tocável, via padding.
