# Fotos de eventos

Coloque as fotos de cada evento em uma subpasta com o **mesmo `slug`** definido em `src/data/event.ts`.

Exemplo (evento atual):

```
public/eventos/kpop-night/
  mesa-01.jpg
  grupo-bts-02.jpg
```

Depois liste em `ACTIVE_EVENT.photos`:

```ts
photos: [
  { file: "mesa-01.jpg", caption: "Mesa 1" },
  { file: "grupo-bts-02.jpg", caption: "Grupo BTS" },
]
```

**Dicas**
- Preferir JPG ou WebP, largura ≤ 1920px
- Nomes sem espaços (use hífen)
- Após adicionar arquivos e atualizar `event.ts`, faça o deploy do site

Ver também: `docs/EVENTS.md`
