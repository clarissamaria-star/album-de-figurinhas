# Album de Figurinhas

Projeto limpo do album de figurinhas da Sabia Gaming.

## Estado Atual

O app implementa:

- Tela base de plataforma com sidebar.
- Botao "Album de Figurinhas" no menu.
- Popup do album com abas: Missoes, Check-in e Figurinhas.
- Missao "Evento esportivo" com popup de detalhe.
- Botao "Desafio Aceito!" apontando para `/esportes`.
- Check-in com 16 dias.
- Album de figurinhas paginado:
  - pagina 0: capa;
  - paginas 1 a 16: miolo do album;
  - 9 figurinhas por pagina;
  - contador `1/141`;
  - barra de progresso;
  - slider e botoes anterior/proximo.

## Estrutura

```text
app/
  index.html
  styles.css
  app.js
  assets/
    logo.svg
    banner-album.svg
    mascote.svg
  README.md
docs/
  ALBUM-PAGES.md
  LOGICA-ALBUM.md
  SECURITY-CLEANUP.md
  SMARTICO-SETUP.md
```

## Como abrir

Abra `app/index.html` no navegador.

## Regra de Seguranca

Nao versionar nem manter nesta pasta:

- HAR de sites terceiros.
- ZIP ou pasta baixada por saveweb/copiador de site.
- Scripts de analytics ou tags de terceiros sem revisao.
- Credenciais, chaves de acesso ou dados de sessao.
- Imagens, fontes ou logos de outra marca.

Use somente assets proprios em `app/assets/`.
