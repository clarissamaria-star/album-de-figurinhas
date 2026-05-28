# Logica do Album de Figurinhas

Documento neutro de arquitetura para orientar a implementacao do album.

Nao inclui credenciais, chaves privadas ou dados de sessao.

## Estrutura Geral

```text
Frontend do Album
  -> abre popup do album
  -> mostra abas de missoes, check-in e figurinhas
  -> abre detalhe da missao
  -> chama nosso backend para estado e acoes

Nosso Backend
  -> retorna bootstrap do album
  -> controla pacotes pendentes
  -> sorteia figurinhas
  -> salva progresso do usuario
  -> integra com Smartico

Smartico
  -> controla campanhas e missoes
  -> recebe eventos validados pelo backend
  -> informa recompensas conquistadas
```

## Fluxo Visual Principal

```text
1. Usuario acessa a plataforma.
2. Clica em "Album de Figurinhas" no menu.
3. Abre popup "Album Figurinhas 2026".
4. Aba inicial: Missoes.
5. Usuario clica em "Evento esportivo".
6. Abre popup de detalhe da missao.
7. Botao "Desafio Aceito!" envia para /esportes.
```

## Popup do Album

Secoes:

- Cabecalho com titulo e botao fechar.
- Abas: Missoes, Check-in, Figurinhas.
- Banner de campanha.
- Marcos de progresso de diamantes: 20%, 40%, 60%, 80%, 100%.
- Barra de progresso geral.
- Lista de missoes.

## Missao: Evento Esportivo

Texto exibido:

```text
Evento esportivo
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
| Acao | Desafio Aceito! |

Destino do botao:

```text
/esportes
```

## Bootstrap do Album

Endpoint sugerido:

```text
GET /api/album/bootstrap
```

Resposta sugerida:

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
    "missions": [
      {
        "id": "sports-event",
        "title": "Evento esportivo",
        "description": "Aposte R$ 10,00 ou mais em qualquer evento esportivo.",
        "rewardLabel": "Um pacote de figurinhas",
        "progressLabel": "Disponivel agora",
        "progressPercent": 0,
        "status": "Em andamento",
        "actionUrl": "/esportes"
      }
    ],
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

## Figurinhas

Raridades sugeridas:

| Raridade | Quantidade | Prefixo |
|---|---:|---|
| Bronze | 16 | B |
| Prata | 89 | S |
| Ouro | 8 | G |
| Diamante | 5 | D |

Status:

- `unowned`
- `claimed`

## Check-in Diario

Regras sugeridas:

- 16 dias de campanha.
- 1 check-in por dia.
- Recompensa padrao: 1 pacote ou 1 figurinha aleatoria.
- Progresso preservado se o usuario perder um dia, se essa for a regra comercial.

Status por dia:

- `claimed`
- `available`
- `locked`

## Pacotes

Fluxo:

```text
1. Missao concluida gera pacote pendente.
2. Usuario abre pacote.
3. Backend sorteia figurinhas.
4. Backend salva resultado.
5. Frontend atualiza album.
```

## Regras de Seguranca

- Nao conceder premio direto pelo frontend.
- Nao confiar em evento disparado apenas pelo navegador.
- Validar aposta/deposito no backend antes de enviar evento para Smartico.
- Validar assinatura de chamadas recebidas.
- Usar idempotencia para evitar premio duplicado.
- Manter auditoria de toda recompensa.
