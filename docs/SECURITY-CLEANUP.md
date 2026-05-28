# Limpeza de Seguranca

Limpeza feita para manter o projeto independente e sem materiais de terceiros.

## Removido

- Arquivos `.har` capturados.
- ZIP e pasta de site baixado.
- Documento local com detalhes de referencia sensiveis.
- Assets baixados de outra marca.
- Scripts de rastreamento, tags de marketing, CDN e chamadas externas de outra operacao.

## Mantido

- Template proprio em HTML, CSS e JavaScript.
- Assets placeholder proprios em SVG.
- Documentacao neutra de integracao.

## Checklist antes de publicar

- Rodar busca por nomes de marcas externas.
- Rodar busca por marcas externas, scripts de rastreamento e credenciais.
- Conferir se `app/assets/` tem apenas materiais autorizados.
- Conferir se nenhum endpoint aponta para dominio de terceiros indevidos.
