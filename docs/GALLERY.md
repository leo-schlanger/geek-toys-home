# Galeria

A galeria deixou de ser lista fixa no código: as fotos vivem no banco da API e
são editadas no painel administrativo, organizadas em **pastas** (álbuns).

## Onde cada coisa mora

| Peça | Onde |
| --- | --- |
| Tabelas `gallery_albums` / `gallery_photos` | repo `clube-geek-toys`, migration 019 |
| Upload e CRUD | aba **Galeria** em `adm.geeketoys.com.br` |
| Arquivos | volume `/uploads/gallery/:albumId` na VPS |
| API pública | `GET /gallery` e `GET /gallery/:slug` |
| Página do site | `/galeria` e `/galeria/:slug` (`src/pages/Gallery.tsx`) |
| Bloco na home | `#galeria` (`src/components/GallerySection.tsx`) |

## Como o site lê

`GallerySection` busca os álbuns publicados e mostra os cards, com link para a
página completa. **Se a API não responder**, ele cai nas fotos estáticas do
bundle — a seção nunca aparece vazia por causa de uma indisponibilidade.

A página `/galeria` lista as pastas; `/galeria/:slug` abre a pasta com lightbox
(setas, Esc, clique fora). Segue **sem download**: `onContextMenu` bloqueado e
`draggable={false}`, mesma regra de antes.

## Como a admin usa

1. Painel → aba **Galeria**
2. **Criar pasta** com nome (ex.: `Evento 6/9`) e data opcional
3. Abrir a pasta → **Enviar fotos** (aceita seleção múltipla; 4K é redimensionada)
4. Estrela numa foto define a **capa**; sem escolha, a capa é a primeira foto
5. **Esconder** tira do site sem apagar nada

Apagar uma pasta apaga as fotos dela do disco também — a confirmação avisa.

## Importação de 15/08/2026

As 41 fotos que estavam fixas no código foram enviadas para o banco:

| Álbum | Fotos | Origem |
| --- | --- | --- |
| Loja GeekPop & Toys | 6 | `src/assets/gallery-*.jpg` |
| GeekPop Night — K-pop | 35 | `public/eventos/kpop-night/` |

Os arquivos originais continuam no repo, servindo de fallback. Não remova antes
de confirmar que os álbuns seguem publicados.

## Privacidade

As fotos são de eventos abertos e da loja física e podem conter pessoas
identificáveis. A Política de Privacidade explica o uso e o canal de remoção
(`contato@geeketoys.com.br`), atendida sem exigir justificativa.
