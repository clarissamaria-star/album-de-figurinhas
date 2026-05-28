# Template de Album de Figurinhas

Este template recria a experiencia do album em codigo proprio, separado em:

- `index.html`: estrutura dos elementos.
- `styles.css`: visual do modal, abas, hero, metas, missoes, check-in e figurinhas.
- `app.js`: troca de abas e renderizacao dos dados de exemplo.
- `assets/logo.svg`: troque pela logo da sua empresa mantendo o mesmo nome, ou altere o `src`.
- `assets/banner-album.svg`: troque pelo banner da campanha mantendo o mesmo nome.

## Arvore de Componentes

```text
album-modal
  album-header
  tabs
  hero
  tab-panel#missions
    rarity-section
      milestones
      progress-row
    missions-section
      mission-card
  tab-panel#checkin
    checkin-grid
  tab-panel#stickers
    filter-pills
    sticker-grid
```

## Dados Para Integrar

Use um endpoint de bootstrap no seu sistema retornando algo nesse formato:

```json
{
  "totalStickers": 141,
  "ownedCount": 1,
  "progress": 0,
  "pendingPacksCount": 0,
  "missions": [
    {
      "id": "sports-event",
      "title": "Evento esportivo",
      "rewardLabel": "01 pacote",
      "completed": false
    }
  ],
  "checkin": {
    "totalDays": 16,
    "claimedCount": 1,
    "canClaimDaily": false
  },
  "stickers": [
    {
      "id": "B-001",
      "name": "Cidade sede",
      "rarity": "Bronze",
      "status": "claimed"
    }
  ]
}
```

## Cores Principais

Troque as variaveis no topo do `styles.css` para sua marca:

```css
:root {
  --bg: #080a16;
  --panel: #171a31;
  --panel-2: #242743;
  --accent: #e4ff15;
  --accent-2: #38d7b4;
  --orange: #e86f1f;
}
```

## Trocar Marca e Banners

O HTML ja aponta para estes arquivos:

```html
<img src="assets/logo.svg" alt="Sabiá Gaming">
<section class="hero" style="--hero-banner: url('assets/banner-album.svg')">
```

Para colocar a marca real, substitua:

- `assets/logo.svg`
- `assets/banner-album.svg`

Se o banner for `.png` ou `.webp`, altere apenas o caminho em `--hero-banner`.

## Regras de UI

- `data-tab` no botao precisa bater com o `id` do `.tab-panel`.
- `.is-active` mostra a aba/painel atual.
- `.is-owned` mostra figurinha conquistada.
- `.is-claimed` destaca dia de check-in coletado.
- O progresso visual fica em `.progress-track span` usando `width: N%`.
