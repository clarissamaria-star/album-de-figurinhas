# Paginas do Album

Documento de referencia para a aba Figurinhas.

## Comportamento

Ao clicar na aba `Figurinhas`, o usuario entra no album que esta preenchendo.

A navegacao tem:

- pagina 0 como capa;
- paginas 1 a 16 como miolo;
- slider inferior;
- botao anterior;
- botao proximo;
- animacao de folha virando ao avancar ou voltar;
- contador de pagina: `Pagina N de 16`;
- contador de progresso: `1/141`.

## Regra de Intervalos

Cada pagina do miolo mostra 9 posicoes.

| Pagina | Intervalo |
|---:|---|
| 0 | Capa |
| 1 | 1-9 de 141 |
| 2 | 10-18 de 141 |
| 3 | 19-27 de 141 |
| 4 | 28-36 de 141 |
| 5 | 37-45 de 141 |
| 6 | 46-54 de 141 |
| 7 | 55-63 de 141 |
| 8 | 64-72 de 141 |
| 9 | 73-81 de 141 |
| 10 | 82-90 de 141 |
| 11 | 91-99 de 141 |
| 12 | 100-108 de 141 |
| 13 | 109-117 de 141 |
| 14 | 118-126 de 141 |
| 15 | 127-135 de 141 |
| 16 | 136-141 de 141 |

## Temas Implementados

| Pagina | Tema visual |
|---:|---|
| 0 | Capa do album |
| 1 | Copa 2026 |
| 2 | Tatu do Bem |
| 3 | Spaceman |
| 4 | Soccer Strike |
| 5 | Ronaldinho Streetball |
| 6 | JetX |
| 7 | Gates of Olympus |
| 8 | Football X |
| 9 | Duck Hunters |
| 10 | Big Bass Bonanza |
| 11 | Brasil |
| 12 | Mundo |
| 13 | Ouro |
| 14 | Diamantes |
| 15 | Finais |
| 16 | Completar Album |

## Dados no Codigo

No `app/app.js`:

- `currentPage`: pagina atual.
- `pageSlider`: slider de navegacao.
- `prevPage` e `nextPage`: botoes de navegacao.
- `stickers`: lista de figurinhas.
- `pageThemes`: tema visual e provedor de cada pagina.
- `renderAlbumPage()`: renderiza capa ou pagina do miolo.
- `setAlbumPage(page)`: troca de pagina com limite entre 0 e 16.
- `playPageTurn(page)`: dispara a animacao de virar folha.

## Animacao de Livro

A camada `#pageTurn` fica sobre a pagina atual e aparece apenas durante a troca.

Classes usadas:

- `.turn-forward`: folha vira da direita para a esquerda.
- `.turn-backward`: folha vira da esquerda para a direita.

A animacao e visual, sem alterar a regra de paginacao. O conteudo real da pagina continua sendo renderizado por `renderAlbumPage()`.

## Estados de Figurinha

- `owned: true`: figurinha conquistada, aparece preenchida.
- `owned: false`: figurinha ainda bloqueada, aparece cinza.

## Integracao com Backend

O backend deve substituir a lista simulada por dados reais no bootstrap:

```json
{
  "totalStickers": 141,
  "ownedStickerIds": ["B-005"],
  "stickers": [
    {
      "id": "B-005",
      "name": "Guadalajara",
      "rarity": "Bronze",
      "status": "claimed"
    }
  ]
}
```
