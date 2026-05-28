# App do Album

Implementacao frontend estatica do album de figurinhas.

## Arquivos

- `index.html`: estrutura da plataforma, popup do album, popup de missao e miolo do album.
- `styles.css`: visual da plataforma, modais, check-in, missoes e paginas do album.
- `app.js`: troca de abas, abertura dos modais, dados simulados, check-in e paginacao das figurinhas.
- `assets/`: logo, banner e mascote placeholders proprios.

## Fluxo Implementado

```text
Sidebar
  -> Album de Figurinhas
      -> Popup Album Figurinhas 2026
          -> Aba Missoes
              -> Evento esportivo
                  -> Popup de detalhe
                  -> Desafio Aceito! (/esportes)
          -> Aba Check-in
              -> lista de 16 cards de recompensa diaria
          -> Aba Figurinhas
              -> capa + paginas 1 a 16
```

## Album Paginado

O album usa:

- pagina `0`: capa;
- paginas `1..16`: conteudo;
- `9` figurinhas por pagina;
- total visual de `141` figurinhas;
- uma figurinha inicial marcada como conquistada;
- contador de progresso no topo;
- slider e setas de navegacao.

Os dados das figurinhas e temas das paginas ficam em `app.js`:

- `bronzeNames`
- `silverNames`
- `goldNames`
- `diamondNames`
- `pageThemes`

## Integracao Futura

Substituir os dados simulados por resposta do backend:

```text
GET /api/album/bootstrap
```

O backend deve retornar:

- total de figurinhas;
- figurinhas conquistadas;
- pacotes pendentes;
- check-in;
- missoes;
- progresso geral.

## Marca

Troque os arquivos em `assets/` pelos materiais finais da Sabia Gaming, mantendo os mesmos nomes quando possivel.
