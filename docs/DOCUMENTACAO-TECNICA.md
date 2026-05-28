# Documentacao Tecnica - Album de Figurinhas

Documento neutro para desenvolvedores que vao implementar o album da Sabia Gaming.

Este arquivo nao deve conter nomes, dominios, chaves, flags, pixels, scripts, CDN ou credenciais de outra operacao.

## Visao Geral

O album e uma funcionalidade de gamificacao e retencao. O usuario coleciona figurinhas digitais ao cumprir missoes, fazer check-in diario e abrir pacotes.

## Funcionalidades

| Feature | Descricao |
|---|---|
| Missoes | Metas que concedem pacotes ou recompensas |
| Check-in diario | Lista de 16 dias com recompensa diaria |
| Pacotes | Itens pendentes que o usuario abre para receber figurinhas |
| Album | Capa + 16 paginas de figurinhas |
| Progresso | Contador de figurinhas e marcos de progresso |

## Arquitetura

```text
Frontend
  -> popup do album
  -> abas: missoes, check-in, figurinhas
  -> detalhe de missao
  -> album paginado

Backend
  -> /api/album/bootstrap
  -> /api/album/checkin
  -> /api/album/packs/open
  -> integracao Smartico
  -> auditoria e antifraude

Smartico
  -> campanhas
  -> missoes
  -> recompensas
  -> webhooks/eventos
```

## Endpoints Sugeridos

### `GET /api/album/bootstrap`

Retorna o estado inteiro do album.

```json
{
  "ok": true,
  "album": {
    "campaignId": "album_2026",
    "totalStickers": 141,
    "ownedCount": 1,
    "pendingPacksCount": 0,
    "openedPacksCount": 1,
    "progress": 0,
    "missions": [],
    "checkin": {
      "enabled": true,
      "totalDays": 16,
      "claimedCount": 1,
      "canClaimDaily": false
    },
    "stickers": []
  }
}
```

### `POST /api/album/checkin`

Resgata o check-in diario quando disponivel.

Validacoes:

- usuario autenticado;
- campanha ativa;
- check-in disponivel no dia;
- idempotencia por usuario e data.

### `POST /api/album/packs/open`

Abre um pacote pendente.

Validacoes:

- usuario autenticado;
- pacote pertence ao usuario;
- pacote ainda nao aberto;
- sorteio registrado em auditoria.

## Check-in

O check-in deve ser exibido como lista de cards, nao como texto simples.

Cada card possui:

- arte do pacote/figurinha;
- titulo `Check-in N`;
- recompensa;
- raridade;
- quantidade;
- status.

Status:

- `claimed`: ja resgatado;
- `available`: disponivel para resgatar;
- `locked`: bloqueado.

## Album Paginado

Regras:

- pagina 0: capa;
- paginas 1 a 16: miolo;
- 9 posicoes por pagina;
- total visual: 141 figurinhas;
- navegacao por slider e botoes.

Intervalos:

| Pagina | Intervalo |
|---:|---|
| 1 | 1-9 |
| 2 | 10-18 |
| 3 | 19-27 |
| 4 | 28-36 |
| 5 | 37-45 |
| 6 | 46-54 |
| 7 | 55-63 |
| 8 | 64-72 |
| 9 | 73-81 |
| 10 | 82-90 |
| 11 | 91-99 |
| 12 | 100-108 |
| 13 | 109-117 |
| 14 | 118-126 |
| 15 | 127-135 |
| 16 | 136-141 |

## Missao Evento Esportivo

Texto:

```text
Aposte R$ 10,00 ou mais em qualquer evento esportivo.
Apos sua aposta encerrar, voce recebera a recompensa.
```

Campos:

| Campo | Valor |
|---|---|
| Recompensa | Um pacote de figurinhas |
| Progresso | Disponivel agora |
| Andamento | 0% |
| Status | Em andamento |
| Acao | Desafio Aceito |

Destino:

```text
/esportes
```

## Smartico

A Smartico deve receber apenas eventos validados pelo backend.

Eventos sugeridos:

- `album_daily_checkin`
- `sports_bet_placed`
- `album_pack_granted`
- `album_pack_opened`
- `album_sticker_claimed`
- `album_completed`

Detalhes da integracao ficam em `docs/SMARTICO-SETUP.md`.

## Seguranca

- Nao expor secrets no frontend.
- Nao conceder premio direto pelo navegador.
- Validar origem de chamadas externas.
- Usar idempotencia para recompensas.
- Registrar auditoria para pacotes, sorteios e premios.
- Hospedar imagens e scripts em infraestrutura propria/autorizada.
