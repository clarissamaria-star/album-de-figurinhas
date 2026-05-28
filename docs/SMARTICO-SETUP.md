# Estrutura de Configuracao Smartico

Este documento serve para orientar a configuracao da Smartico da nossa operacao para o album de figurinhas.

Importante: nao copiar credenciais, labels, scripts, pixels, endpoints ou dominios de outra operacao. Tudo abaixo deve ser preenchido com dados da nossa conta Smartico e do nosso backend.

## Objetivo

Usar a Smartico como motor de gamificacao para:

- Missoes do album.
- Progresso de usuario.
- Entrega de pacotes de figurinhas.
- Recompensas por metas.
- Segmentacao de campanhas.
- Eventos enviados pelo nosso site/backend.

O nosso sistema continua responsavel por:

- Login e sessao do usuario.
- Carteira/saldo.
- Album, figurinhas e pacotes.
- Validacao final de premios.
- Registro antifraude.
- Auditoria interna.

## Arquitetura Recomendada

```text
Frontend do Album
  -> carrega estado do album via nosso backend
  -> mostra missoes recebidas da Smartico ou espelhadas pelo backend
  -> dispara eventos simples de UI quando necessario

Nosso Backend
  -> identifica usuario logado
  -> envia eventos server-side para Smartico
  -> recebe webhooks/callbacks da Smartico
  -> concede pacotes, figurinhas e recompensas
  -> salva auditoria

Smartico
  -> recebe eventos
  -> calcula elegibilidade
  -> controla missoes/campanhas
  -> emite conclusoes e recompensas
```

## Variaveis de Ambiente

Criar um arquivo de ambiente apenas no servidor, nunca no repositorio.

```env
SMARTICO_ENABLED=true
SMARTICO_LABEL_KEY=preencher_com_nossa_label
SMARTICO_BRAND_KEY=preencher_com_nossa_brand
SMARTICO_API_KEY=preencher_com_nossa_api_key
SMARTICO_API_SECRET=preencher_com_nosso_secret
SMARTICO_WEBHOOK_SECRET=preencher_com_nosso_secret_de_webhook
SMARTICO_API_BASE_URL=preencher_com_url_oficial_da_nossa_conta
SMARTICO_SCRIPT_URL=preencher_com_url_oficial_do_sdk_se_necessario
```

Regras:

- Nao colocar estes valores em HTML.
- Nao expor secret no frontend.
- Frontend pode receber apenas identificadores publicos permitidos pela Smartico.
- Backend deve validar toda recompensa antes de conceder.

## Identidade do Usuario

A Smartico precisa receber sempre o mesmo identificador interno do usuario.

Campos recomendados:

```json
{
  "userId": "id_interno_do_usuario",
  "emailHash": "hash_opcional",
  "createdAt": "2026-05-28T00:00:00-03:00",
  "currency": "BRL",
  "country": "BR"
}
```

Nao enviar:

- Senha.
- Documento completo.
- Dados bancarios.
- Cookies de sessao.
- Tokens internos.

## Eventos Principais

Estes eventos devem ser padronizados entre frontend, backend e Smartico.

### Cadastro/Login

```json
{
  "event": "user_login",
  "userId": "123",
  "timestamp": "2026-05-28T16:00:00-03:00"
}
```

### Deposito Confirmado

```json
{
  "event": "deposit_confirmed",
  "userId": "123",
  "amount": 50.0,
  "currency": "BRL",
  "transactionId": "deposito_abc"
}
```

### Aposta Esportiva Confirmada

```json
{
  "event": "sports_bet_placed",
  "userId": "123",
  "amount": 20.0,
  "ticketId": "ticket_abc",
  "sport": "football"
}
```

### Aposta de Cassino Confirmada

```json
{
  "event": "casino_bet_placed",
  "userId": "123",
  "amount": 10.0,
  "gameId": "game_abc",
  "provider": "provedor"
}
```

### Check-in Diario

```json
{
  "event": "album_daily_checkin",
  "userId": "123",
  "day": 1,
  "campaignId": "album_2026"
}
```

### Pacote Aberto

```json
{
  "event": "album_pack_opened",
  "userId": "123",
  "packId": "pack_abc",
  "campaignId": "album_2026",
  "stickersGranted": ["B-001", "S-010"]
}
```

### Figurinha Recebida

```json
{
  "event": "album_sticker_claimed",
  "userId": "123",
  "stickerId": "B-001",
  "rarity": "bronze",
  "campaignId": "album_2026"
}
```

### Album Completo

```json
{
  "event": "album_completed",
  "userId": "123",
  "campaignId": "album_2026",
  "totalStickers": 141
}
```

## Missoes Sugeridas

As missoes devem ser configuradas na Smartico com regras claras e recompensas retornando para o nosso backend.

| Missao | Evento base | Condicao | Recompensa |
|---|---|---:|---|
| Check-in diario | `album_daily_checkin` | 1 vez por dia | 1 pacote |
| Primeiro deposito | `deposit_confirmed` | deposito aprovado | 1 pacote |
| Evento esportivo | `sports_bet_placed` | aposta minima definida | 1 pacote |
| Cassino semanal | `casino_bet_placed` | volume acumulado | 1 pacote |
| Completar raridade | `album_sticker_claimed` | todos da raridade | premio definido |
| Completar album | `album_completed` | 100% do album | premio final |

## Recompensas

Tipos de recompensa que nosso backend deve entender:

```json
{
  "rewardType": "album_pack",
  "quantity": 1,
  "campaignId": "album_2026",
  "reason": "mission_completed"
}
```

Outros tipos possiveis:

- `album_pack`
- `free_spin`
- `bonus_balance`
- `cashback`
- `manual_reward`

Toda recompensa precisa ter:

- ID unico.
- Usuario.
- Origem.
- Data.
- Status.
- Auditoria.

## Fluxo de Concessao de Pacote

```text
1. Usuario realiza acao.
2. Nosso backend valida a acao.
3. Nosso backend envia evento para Smartico.
4. Smartico calcula missao.
5. Smartico chama webhook do nosso backend ou disponibiliza recompensa via API.
6. Nosso backend valida assinatura/origem.
7. Nosso backend cria pacote pendente para o usuario.
8. Frontend atualiza contador de pacotes.
9. Usuario abre pacote.
10. Backend sorteia figurinhas e salva resultado.
```

## Webhook de Recompensa

Endpoint nosso sugerido:

```text
POST /api/smartico/webhooks/reward
```

Payload esperado:

```json
{
  "eventId": "evt_abc",
  "type": "mission_reward_granted",
  "userId": "123",
  "campaignId": "album_2026",
  "reward": {
    "rewardType": "album_pack",
    "quantity": 1
  },
  "createdAt": "2026-05-28T16:00:00-03:00"
}
```

Validacoes obrigatorias:

- Assinatura do webhook.
- Idempotencia por `eventId`.
- Usuario existente.
- Campanha ativa.
- Recompensa permitida.
- Limites antifraude.

## Estado do Album no Nosso Backend

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

## Painel Smartico: Checklist de Configuracao

1. Criar campanha do album.
2. Definir periodo da campanha.
3. Definir segmentos elegiveis.
4. Criar missoes.
5. Mapear eventos de entrada.
6. Criar recompensas.
7. Configurar webhook para nosso backend.
8. Configurar assinatura/secret do webhook.
9. Testar eventos em ambiente de homologacao.
10. Testar idempotencia.
11. Testar usuario que nao deve ser elegivel.
12. Testar premio duplicado.
13. Testar desligamento emergencial.

## Frontend

O frontend nao deve depender diretamente da Smartico para conceder premio.

Permitido no frontend:

- Mostrar missoes.
- Mostrar progresso.
- Abrir modal de campanha.
- Chamar nosso backend.

Evitar no frontend:

- Secrets.
- Credenciais privadas.
- Concessao direta de premio.
- Scripts de outra operacao.
- Endpoints de terceiros sem revisao.

## Backend

Criar modulos separados:

```text
album/
  album.service
  sticker.service
  pack.service
  mission.service

smartico/
  smartico.client
  smartico.events
  smartico.webhooks
  smartico.signature
```

Responsabilidades:

- `smartico.client`: enviar eventos para Smartico.
- `smartico.events`: padronizar nomes e payloads.
- `smartico.webhooks`: receber eventos de recompensa.
- `smartico.signature`: validar origem.
- `mission.service`: traduzir progresso para UI.
- `pack.service`: criar e abrir pacotes.
- `sticker.service`: sortear e salvar figurinhas.

## Auditoria

Salvar log interno para cada evento relevante:

```json
{
  "id": "audit_abc",
  "userId": "123",
  "source": "smartico",
  "eventType": "mission_reward_granted",
  "externalEventId": "evt_abc",
  "status": "processed",
  "createdAt": "2026-05-28T16:00:00-03:00"
}
```

Status sugeridos:

- `received`
- `validated`
- `processed`
- `ignored_duplicate`
- `rejected`
- `failed`

## Desligamento Emergencial

Ter uma flag para desligar a integracao sem publicar novo codigo:

```env
SMARTICO_ENABLED=false
```

Quando desligado:

- Nao enviar novos eventos.
- Continuar mostrando estado salvo do album.
- Continuar permitindo leitura do album.
- Bloquear novas recompensas externas.
- Manter logs de tentativas rejeitadas.

## Pendencias Para Quem Configurar

- Confirmar nomes oficiais dos eventos no painel Smartico.
- Confirmar metodo oficial de assinatura de webhooks.
- Confirmar limite de taxa da API.
- Confirmar formato de usuario esperado.
- Confirmar se missoes serao lidas direto da Smartico ou espelhadas no nosso backend.
- Confirmar se recompensas chegam por webhook, API polling ou ambos.
- Confirmar regras antifraude antes da campanha ir ao ar.
