# Documentação Técnica — Álbum de Figurinhas Copa 2026
## Engenharia Reversa do Produto de Referência (7K Bet)

> **Para:** Desenvolvedor responsável pela implementação  
> **Elaborado por:** Equipe Sabiá Gaming  
> **Data:** 2026-05-28  
> **Método:** Análise de tráfego HTTP/WebSocket via Chrome DevTools (HAR)  
> **Status:** Referência de arquitetura — não contém credenciais de terceiros

---

## 1. Visão Geral do Produto

O Álbum de Figurinhas é uma funcionalidade de **gamificação e retenção** integrada à plataforma de apostas. O usuário coleciona figurinhas digitais completando missões, fazendo check-in diário e abrindo pacotinhos.

### 1.1 Funcionalidades principais

| Feature | Descrição |
|---------|-----------|
| **Check-in diário** | Usuário faz login todo dia e recebe 1 figurinha aleatória |
| **Missões** | Metas de apostas que concedem pacotinhos de figurinhas |
| **Pacotinhos** | Animação de abertura que revela figurinhas sorteadas |
| **Coleção** | Grade com 141 figurinhas em 4 raridades |
| **Marcos de progresso** | Recompensas Diamante em 20/40/60/80/100% do álbum |

### 1.2 Arquitetura geral

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (React/Vite)               │
│                                                     │
│  Modal do Álbum                                     │
│  ├── Aba Missões   → dados do Smartico (WebSocket)  │
│  ├── Aba Check-in  → API própria + timer local      │
│  └── Aba Figurinhas → API própria                   │
└────────────┬──────────────────┬────────────────────-┘
             │                  │
    ┌────────▼──────┐  ┌────────▼──────────────┐
    │  API Própria  │  │  Smartico (WebSocket)  │
    │  /api/album/* │  │  wss://api3.s.         │
    │               │  │  cactusgaming.net/...  │
    └───────────────┘  └───────────────────────┘
```

---

## 2. API Própria — Endpoints Mapeados

### 2.1 `GET /api/album/bootstrap`

**Endpoint principal.** Chamado na abertura do modal e a cada **60 segundos** (polling).

**Query params:** `?_={timestamp}` (cache-bust)

**Response completa:**

```json
{
  "ok": true,
  "bootstrap": {
    "totalStickers": 141,
    "stickers": [ ...ver seção 4... ],
    "missions": [],
    "missionType": "sportbook",
    "campaignStartsAt": "2026-05-27T00:00:00+00:00",
    "checkIn": {
      "enabled": true,
      "timezone": "America/Sao_Paulo",
      "preserveProgressOnMissedDay": true,
      "totalDays": 16,
      "claimedCount": 1,
      "canClaimDaily": false,
      "lastClaimedAt": "2026-05-28T18:14:25Z",
      "completionRewardAvailable": false,
      "completionRewardClaimed": false,
      "completionReward": {
        "title": "Prêmio final",
        "description": "Complete os 15 check-ins para liberar o prêmio final.",
        "rewards": [{ "type": "bonus", "bonusId": "bonus_checkin_completion" }]
      },
      "days": [ ...ver seção 3... ]
    },
    "session": {
      "ownedStickerIds": ["B-005"],
      "openedMissionPacks": 1
    },
    "featuredSection": {
      "progressPercent": 0.71,
      "featuredColor": "#4EE2EC",
      "cards": [
        { "id": "fr-3",  "threshold": 20,  "label": "Primeira conquista", "status": "locked" },
        { "id": "fr-6",  "threshold": 40,  "label": "Em ritmo",           "status": "locked" },
        { "id": "fr-9",  "threshold": 60,  "label": "Acelerando",         "status": "locked" },
        { "id": "fr-12", "threshold": 80,  "label": "Quase lá",           "status": "locked" },
        { "id": "fr-15", "threshold": 100, "label": "Álbum completo",     "status": "locked" }
      ]
    },
    "pendingPacksCount": 0,
    "openedPacksCount": 1,
    "ownedCount": 1,
    "ownedNonFeaturedCount": 1,
    "totalNonFeatured": 113
  }
}
```

---

### 2.2 `POST /api/album/checkin`

> **Endpoint inferido** — não capturado (check-in já realizado no momento da análise)

**Comportamento esperado:** Registra o check-in do dia e sorteia 1 figurinha aleatória pela raridade configurada no dia.

**Request body esperado:**
```json
{}
```

**Response esperada:**
```json
{
  "ok": true,
  "sticker": {
    "id": "B-005",
    "name": "Guadalajara",
    "rarity": "Bronze",
    "rarityColor": "#cd7f32",
    "imageUrl": "https://cdn.../public"
  }
}
```

---

### 2.3 `POST /api/album/open-pack`

> **Endpoint inferido** — não capturado diretamente

**Comportamento:** Abre um pacotinho pendente e retorna as figurinhas sorteadas.

**Request body esperado:**
```json
{ "source": "pack" }
```

**Response esperada:**
```json
{
  "ok": true,
  "stickers": [
    { "id": "S-043", "name": "Bandeira Estados Unidos", "rarity": "Prata", "isNew": true },
    { "id": "B-003", "name": "Cidade do México",        "rarity": "Bronze","isNew": false }
  ]
}
```

**Sources observadas:** `"pack"` (manual) | `"smartico"` (via missão)

---

### 2.4 `POST /api/rewards/list`

Lista recompensas disponíveis (freespins, bônus) — separado do álbum.

**Request:**
```json
{ "status": "available", "type": "", "page": 1, "perPage": 8 }
```

**Response:**
```json
{
  "ok": true,
  "data": {
    "rewards": [{
      "id": 112875254,
      "type": "freespins",
      "playerDesc": "Rodadas Grátis",
      "gameName": "Tigre da Sorte",
      "status": "available",
      "amount": "5.00",
      "quantity": 10,
      "expiresAt": "2026-05-29T18:17:20Z"
    }],
    "pagination": { "currentPage": 1, "total": 1, "perPage": 8 }
  }
}
```

---

### 2.5 `POST /api/wallet/refresh`

Atualiza saldo da carteira. Chamado após check-in/recompensas.

---

### 2.6 `GET /api/version`

Retorna build ID atual.
```json
{ "buildId": "509eb48b2189" }
```

---

## 3. Check-in — Lógica Completa

### 3.1 Schema de um dia

```typescript
interface CheckInDay {
  day: number;                    // 1 a 16
  label: string;                  // "Check-in 1"
  title: string;                  // "Figurinhas bônus"
  imageUrl: string;               // URL da imagem do card
  status: "claimed" | "available" | "locked";
  rewards: [{
    type: "randomSticker";
    rarity: "bronze" | "prata" | "ouro" | "diamante";
    quantity: number;             // sempre 1
  }]
}
```

### 3.2 Raridade por dia (16 dias observados)

| Dia | Raridade | Dia | Raridade |
|-----|---------|-----|---------|
| 1   | Bronze  | 9   | Bronze  |
| 2   | Bronze  | 10  | Prata   |
| 3   | Prata   | 11  | Ouro    |
| 4   | Bronze  | 12  | Bronze  |
| 5   | Prata   | 13  | Prata   |
| 6   | Ouro    | 14  | Ouro    |
| 7   | Bronze  | 15  | Bônus Especial |
| 8   | Prata   | 16  | Bônus Especial |

### 3.3 Regras de negócio

- `canClaimDaily: false` → botão desabilitado "Já feito hoje"
- `canClaimDaily: true`  → botão ativo "Fazer check-in"
- `preserveProgressOnMissedDay: true` → dias perdidos ficam disponíveis
- Timer reseta à **meia-noite fuso `America/Sao_Paulo`**
- Recompensa final ao completar **15 check-ins** (não 16)

### 3.4 Estados do botão

```
Estado               | Texto do botão        | Estilo
---------------------------------------------------------
canClaimDaily: true  | "Fazer check-in"      | Verde ativo
canClaimDaily: false | "Já feito hoje"       | Cinza desabilitado + timer
```

---

## 4. Figurinhas — Catálogo Completo (141 itens)

### 4.1 Distribuição por raridade

| Raridade | Qtd | Cor (frontend) | Cor (API) | Prefixo |
|----------|-----|---------------|-----------|---------|
| Bronze   | 16  | `#E0A878`     | `#cd7f32` | `B-xxx` |
| Prata    | 89  | `#D5DCE0`     | `#c0c0c0` | `S-xxx` |
| Ouro     | 8   | `#F5C84B`     | `#ffd700` | `G-xxx` |
| Diamante | 5   | `#B8E0F0`     | `#4EE2EC` | `D-xxx` |

> **Nota:** O frontend usa cores ligeiramente diferentes da API. Usar as do frontend para consistência visual.

### 4.2 Schema de uma figurinha

```typescript
interface Sticker {
  id: string;              // "B-005"
  name: string;            // "Guadalajara"
  description?: string;   // "Cidade-sede da Copa" (opcional)
  rarity: "Bronze" | "Prata" | "Ouro" | "Diamante";
  rarityColor: string;     // cor hex da raridade
  imageUrl?: string;       // presente apenas quando status = "claimed"
  status: "unowned" | "claimed";
  claimedAt?: string;      // ISO 8601, presente quando claimed
}
```

### 4.3 Bronze — Cidades-sede Copa 2026 (B-001 a B-016)

```
B-001  Atlanta          B-009  Miami
B-002  Boston           B-010  Monterrey
B-003  Cidade do México B-011  Filadélfia
B-004  Dallas           B-012  São Francisco
B-005  Guadalajara      B-013  Seattle
B-006  Houston          B-014  Toronto
B-007  Kansas City      B-015  Vancouver
B-008  Los Angeles      B-016  New York
```

### 4.4 Prata — Bandeiras e Uniformes (S-001 a S-089)

```
S-001  Uniforme África do Sul      S-046  Uniforme Gana
S-002  Bandeira África do Sul      S-047  Bandeira Haiti
S-003  Bandeira Arábia Saudita     S-048  Uniforme Haiti
S-004  Uniforme Arábia Saudita     S-049  Bandeira Holanda
S-005  Bandeira Argélia            S-050  Uniforme Holanda
S-006  Uniforme Argélia            S-051  Bandeira Irã
S-007  Bandeira Austrália          S-052  Uniforme Irã
S-008  Uniforme Austrália          S-053  Bandeira Iraque
S-009  Bandeira Áustria            S-054  Uniforme Iraque
S-010  Uniforme Áustria            S-055  Bandeira Japão
S-011  Bandeira Bélgica            S-056  Uniforme Japão
S-012  Uniforme Bélgica            S-057  Bandeira Jordânia
S-013  Bandeira Bósnia             S-058  Uniforme Jordânia
S-014  Uniforme Bósnia             S-059  Bandeira Marrocos
S-015  Bandeira Cabo Verde         S-060  Uniforme Marrocos
S-016  Uniforme Cabo Verde         S-061  Bandeira México
S-017  Uniforme Campeão 1          S-062  Uniforme México
S-018  Uniforme Campeão 2          S-063  Bandeira Noruega
S-019  Uniforme Campeão 3          S-064  Uniforme Noruega
S-020  Uniforme Campeão 4          S-065  Bandeira Nova Zelândia
S-021  Uniforme Campeão 5          S-066  Uniforme Nova Zelândia
S-022  Uniforme Campeão 6          S-067  Bandeira Panamá
S-023  Bandeira Canadá             S-068  Uniforme Panamá
S-024  Uniforme Canadá             S-069  Bandeira Paraguai
S-025  Bandeira Catar              S-070  Uniforme Paraguai
S-026  Uniforme Catar              S-071  Bandeira Portugal
S-027  Bandeira Colômbia           S-072  Uniforme Portugal
S-028  Uniforme Colômbia           S-073  Bandeira RD Congo
S-029  Bandeira Coreia do Sul      S-074  Uniforme RD Congo
S-030  Uniforme Coreia do Sul      S-075  Bandeira República Tcheca
S-031  Bandeira Costa do Marfim    S-076  Uniforme República Tcheca
S-032  Uniforme Costa do Marfim    S-077  Bandeira Senegal
S-033  Bandeira Croácia            S-078  Uniforme Senegal
S-034  Uniforme Croácia            S-079  Bandeira Suécia
S-035  Bandeira Curaçao            S-080  Uniforme Suécia
S-036  Uniforme Curaçao            S-081  Bandeira Suíça
S-037  Bandeira Egito              S-082  Uniforme Suíça
S-038  Uniforme Egito              S-083  Bandeira Tunísia
S-039  Bandeira Equador            S-084  Uniforme Tunísia
S-040  Uniforme Equador            S-085  Bandeira Turquia
S-041  Bandeira Escócia            S-086  Uniforme Turquia
S-042  Uniforme Escócia            S-087  Bandeira Uzbequistão
S-043  Bandeira Estados Unidos     S-088  Uniforme Uzbequistão
S-044  Uniforme Estados Unidos     S-089  Uniforme Inglaterra
S-045  Bandeira Gana
```

### 4.5 Ouro — Seleções de destaque (G-001 a G-008)

```
G-001  Bandeira Alemanha      G-005  Bandeira França
G-002  Bandeira Argentina     G-006  Bandeira Inglaterra
G-003  Bandeira Brasil        G-007  Bandeira Uruguai
G-004  Bandeira Espanha       G-008  [Figurinha de marca — adaptar]
```

### 4.6 Diamante — Marcos de progresso (D-001 a D-005)

Desbloqueadas ao atingir 20/40/60/80/100% do álbum.
```
D-001  Diamante 1 (20%)
D-002  Diamante 2 (40%)
D-003  Diamante 3 (60%)
D-004  Diamante 4 (80%)
D-005  Diamante 5 (100%)
```

---

## 5. Integração Smartico (Gamificação)

### 5.1 O que é o Smartico

Plataforma de gamificação SaaS (anteriormente CactusGaming) que gerencia:
- Missões e achievements
- Níveis de usuário
- Torneios
- Loja de itens
- Notificações em tempo real

### 5.2 Conexão WebSocket

```
URL: wss://api3.s.cactusgaming.net/websocket/services
     ?master
     &domain={seu-dominio}
     &version=1.3.411
```

### 5.3 Inicialização do SDK no frontend

```html
<!-- 1. Definir variáveis globais ANTES de carregar o script -->
<script>
  window._smartico_user_id   = "{userId}";       // ID do usuário na plataforma
  window._smartico_user_hash = "{hmacHash}";     // Gerado no backend (ver 5.4)
  window._smartico_language  = "pt-br";
</script>

<!-- 2. Carregar o script CDN do Smartico -->
<script src="https://statics.ct-bt.com/init2.js?v={buildVersion}&n={date}" async defer></script>
```

```javascript
// 3. Aguardar SDK disponível (timeout: 15s)
function waitForSmartino() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const interval = setInterval(() => {
      if (window._smartico) {
        clearInterval(interval);
        resolve(window._smartico);
      }
      if (++attempts >= 15) {
        clearInterval(interval);
        reject(new Error('Smartico SDK timeout'));
      }
    }, 1000);
  });
}

// 4. Verificar identificação do usuário
const sdk = await waitForSmartino();
await sdk.checkSuccessfullyIdentify(); // retorna true quando autenticado
```

### 5.4 Geração do Hash (backend)

O hash é um **HMAC** gerado no backend para autenticar o usuário no Smartico:

```
hash = HMAC-MD5(secret_key, userId + ":" + expiry_timestamp)
formato enviado: "{hash}:{expiry_timestamp}"
```

> **Importante:** A secret key é fornecida pelo Smartico no painel de configuração. Nunca expor no frontend.

### 5.5 Protocolo de comandos WebSocket

#### Fluxo de inicialização (ordem exata observada)

```
CLIENTE → SERVIDOR

[cid:3]  Identificação inicial
{
  "cid": 3,
  "ts": 1779994155982,
  "uuid": "{uuid-v4}",
  "label_name": "{sua-api-key-smartico}",
  "label_key": "{sua-api-key-smartico}",
  "brand_key": "{sua-brand-key}",
  "simulation_mode": false,
  "device_id": "{device-fingerprint}"
}

SERVIDOR → CLIENTE

[cid:4]  Settings da plataforma
{
  "settings": {
    "GAMIFICATION_UI_MAIN": "https://libs.smartico.ai/gf/Achievements3.html",
    "GF_TOURNAMENT_LOBBY_NEW_UI": "true",
    "GF_NEW_LOBBY_FOR_MINI_GAMES": "true",
    "FCM_CLIENT_CONFIG": "{...firebase config para push notifications...}"
  }
}

CLIENTE → SERVIDOR

[cid:5]  Autenticação do usuário
{
  "cid": 5,
  "ext_user_id": "{userId}",
  "hash": "{hmacHash}:{expiry}",
  "visitor_id": "{fingerprint}",
  "ua": "{userAgent}",
  "page": "{currentPage}"
}

SERVIDOR → CLIENTE

[cid:6]  Dados do usuário autenticado
{
  "user_id": 215541515,          // ID interno do Smartico
  "ext_user_id": "{tenantId}:{userId}",
  "public_username": "CLARISSA",
  "props": {
    "ach_points_balance": 0,
    "ach_points_ever": 0,
    "ach_diamonds_balance": 0,
    "ach_gems_balance": 0,
    "ach_level_current_id": 747,
    "ach_level_current": "Bronze 1",
    "user_country": "BR",
    "core_wallet_currency": "BRL"
  }
}
```

#### Comandos de carregamento de dados

| cid enviado | cid recebido | Dados retornados |
|-------------|-------------|-----------------|
| `502` | `503` | Achievements / Missões |
| `509` | `510` | Itens da loja |
| `517` | `518` | Torneios |
| `513` | `514` | Log/inbox do usuário |
| `500` | `501` | Níveis disponíveis |
| `600` | `601` | Bônus ativos do usuário |
| `700` | `701` | Templates de UI (SAW, spin-wheel) |
| `800` | `801` | Itens adicionais |
| `902` | `903` | Templates de overlay |
| `527` | `528` | Saldo de pontos/gemas/diamantes |
| `523` | `524` | Seções customizadas (HTML) |
| `13`  | `14`  | Traduções por idioma |

#### Heartbeat (keep-alive)

```
SERVIDOR → CLIENTE  [cid:1]  ping (a cada ~30s)
CLIENTE  → SERVIDOR [cid:2]  pong (resposta imediata)
```

### 5.6 Schema de uma Missão (Achievement)

```typescript
interface Achievement {
  ach_id: number;                  // ID único da missão
  ach_status_id: number;           // 1=ativa, 2=disponível, etc.
  ach_type_id: number;             // tipo da missão
  ach_public_meta: {
    name: string;                  // "Evento esportivo"
    description: string;           // "Complete R$50 em apostas..."
    reward: string;                // "01 PACOTE" ou "1000 Moedas"
    cta_text: string;              // "Aceitar missão"
    cta_action: string;            // URL de destino (jogo específico)
    image_url: string;             // Imagem da missão
    position: number;              // Ordem de exibição
    hide_if_expired: boolean;
    requiresOptin: boolean;        // Usuário precisa aceitar antes
  };
  achievementTasks: [{
    task_id: number;
    task_public_meta: { name: string };
    executionCount: number;        // Meta total (ex: 100 = R$100 apostados)
    userProgress: number;          // Progresso atual do usuário
    isCompleted: boolean;
    points_reward: number;
  }];
  isCompleted: boolean;
  progress: number;                // 0 a 1
  isLocked: boolean;
  isExpired: boolean;
  requiresOptin: boolean;
  isOptedIn: boolean;
  start_date: string | null;
  end_date: string | null;
}
```

### 5.7 Feature Flags

Controlam features em tempo real via polling (sem redeploy):

```
GET https://feature-flag-api.plataformizacao.net/v1/feature-flags/{platform}/{flagName}

Response:
{
  "key": "feStickerBook7k",
  "value": true,
  "version": "2026-05-28T18:48:23Z",
  "lastSyncAt": "2026-05-28T18:48:23Z",
  "lastSource": "polling"
}
```

| Flag observada | Significado |
|---------------|-------------|
| `feStickerBook7k` | Liga/desliga o álbum inteiro |
| `feFtdD1` | First Time Deposit flow D1 |
| `feFtdD17k` | First Time Deposit flow específico |

---

## 6. Frontend — Arquitetura de Estado

### 6.1 Views do modal

```typescript
type View =
  | { kind: "tab"; tab: "missions" | "stickers" | "terms" }
  | { kind: "pack-opening"; source: "pack" | "smartico" }
  | { kind: "terms" }
```

### 6.2 Fases do pacotinho (state machine)

```
closed ──► lobby ──► tearing ──► open ──► summary
  │           │          │          │         │
Fechado   Pronto    Rasgando    Revelando  Resumo
          pra       (animação)  figurinhas  total
          abrir
```

```typescript
type PackPhase = "closed" | "lobby" | "tearing" | "open" | "summary";

interface PackState {
  phase: PackPhase;
  items: Sticker[];        // figurinhas sorteadas
  packCount: number;       // quantos pacotes restam
  startedWithCount: number;// figurinhas antes de abrir
  source: "pack" | "smartico";
}
```

### 6.3 Estado inicial do álbum

```typescript
const initialState = {
  view: { kind: "tab", tab: "missions" },
  ownedStickerIds: [],
  openedMissionPacks: 0,
  checkIn: { ...checkInDefaults },
  pack: {
    phase: "closed",
    items: [],
    packCount: 0,
    startedWithCount: 0,
    source: "pack"
  }
};
```

---

## 7. Design System — Tokens Visuais

### 7.1 Cores principais

```css
/* Fundos */
--bg-primary:    #131820;   /* fundo geral da plataforma */
--bg-sidebar:    #171a2c;   /* fundo sidebar */
--bg-panel:      #1e2235;   /* painéis e cards */
--bg-panel-2:    #242743;   /* cards secundários */

/* Tipografia */
--color-text:    #f8f8fb;   /* texto principal */
--color-muted:   #aeb6d2;   /* texto secundário */

/* Accent da plataforma */
--color-accent:  #a1cd3d;   /* verde da sidebar (7K) */
                             /* adaptar para Sabiá Gaming */

/* Raridades (frontend) */
--color-bronze:  #E0A878;
--color-prata:   #D5DCE0;
--color-ouro:    #F5C84B;
--color-diamante:#B8E0F0;

/* Destaque diamante */
--featured-color: #4EE2EC;
```

### 7.2 Tipografia

```css
font-family: 'Montserrat', sans-serif;
/* Pesos usados: 400 (normal), 600 (semibold), 700 (bold) */
/* Fontes pré-carregadas via <link rel="preload"> para performance */
```

### 7.3 Layout do modal

```
Largura:  430px (mobile-first)
Altura:   100dvh em mobile, adaptável em desktop
Border-radius: 22px
Overflow: hidden
```

### 7.4 Tabs

```
Altura:       50px
Grid:         3 colunas iguais
Ativa:        cor accent + borda inferior 2px
Inativa:      cor muted
Fonte:        13px / 900 weight / uppercase / letter-spacing 1.3px
```

---

## 8. Textos PT-BR Oficiais

```javascript
// Check-in
{
  title:                "Check-in Diário",
  trigger_title:        "Faça seu check-in diário",
  trigger_subtitle:     "Acumule moedas e ganhe prêmios",
  trigger_cta:          "Fazer check-in",
  trigger_cta_done:     "Check-in diário realizado",
  trigger_subtitle_done:"Volte amanhã pra continuar sua sequência",
  day:                  "Dia {{day}}",
  bonus_label:          "Após {{days}} dias consecutivos",
  claim_title:          "Parabéns! Resgate suas {{amount}} moedas.",
  success_title:        "Check-in concluído!",
  success_message:      "Você ganhou {{amount}} moedas.",
  preparing_title:      "Preparando seu check-in...",
}

// Álbum
{
  title:                "Álbum",
  coming_soon_toast:    "Em breve disponível!",
  checkin_error:        "Erro ao fazer check-in",
  prize_claimed:        "Prêmio resgatado com sucesso!",
  claim_featured_error: "Erro ao resgatar figurinha",
}

// Missões (hero)
{
  heading:    "Missões álbum de figurinhas",
  subheading: "Conclua missões, receba cartas, preencha o seu álbum de figurinhas e ganhe diversos prêmios e recompensas."
}

// Progresso Diamante
{
  20:  "Primeira conquista",
  40:  "Em ritmo",
  60:  "Acelerando",
  80:  "Quase lá",
  100: "Álbum completo"
}
```

---

## 9. Fluxo Completo — Como o Usuário Ganha Figurinhas

```
┌─────────────────────────────────────────────────────────────────┐
│  1. CHECK-IN DIÁRIO                                             │
│     Usuário acessa o site → clica "Fazer check-in"              │
│     POST /api/album/checkin → retorna 1 figurinha aleatória     │
│     Timer reseta à meia-noite (America/Sao_Paulo)               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  2. MISSÕES (via Smartico)                                      │
│     Smartico monitora ações: apostas, depósitos, jogos          │
│     Ao completar meta → achievement marcado como completo       │
│     Backend da plataforma recebe webhook do Smartico            │
│     Pacotinho adicionado em pendingPacksCount                   │
│     POST /api/album/open-pack → sorteia figurinhas              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  3. MARCOS DE PROGRESSO (Diamantes)                             │
│     A cada X% do álbum completo → figurinha Diamante desbloqueada│
│     Thresholds: 20% / 40% / 60% / 80% / 100%                   │
│     GET /api/album/bootstrap retorna status dos marcos          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Checklist de Implementação

### Backend

- [ ] Endpoint `GET /api/album/bootstrap` — resposta completa conforme seção 2.1
- [ ] Endpoint `POST /api/album/checkin` — validar timezone BR, prevenir duplo claim
- [ ] Endpoint `POST /api/album/open-pack` — sortear com probabilidades por raridade
- [ ] Lógica de sorteio aleatório por raridade (configurável)
- [ ] Controle de `pendingPacksCount` e `openedPacksCount`
- [ ] Webhook receptor do Smartico (missão completa → adicionar pacotinho)
- [ ] Geração do HMAC hash para autenticação no Smartico
- [ ] Polling do bootstrap a cada 60s (ou WebSocket próprio)

### Smartico (configurar no painel deles)

- [ ] Criar achievements/missões com `cta_action` apontando para jogos da plataforma
- [ ] Definir rewards: `type: "randomSticker"` com raridade e quantidade
- [ ] Configurar webhook para notificar backend quando missão for completada
- [ ] Configurar feature flag `feStickerBook{sua-marca}` para liga/desliga
- [ ] Definir idioma padrão: `pt-br`

### Frontend

- [ ] Modal com 3 abas: Missões / Check-in / Figurinhas
- [ ] Hero com mascote próprio e texto da campanha
- [ ] Seção de Diamantes com 5 marcos de progresso
- [ ] Lista de missões Smartico (consumir via WebSocket)
- [ ] Check-in com timer regressivo até meia-noite BRT
- [ ] Grade de 141 figurinhas com filtro por raridade
- [ ] Animação de abertura de pacotinho (5 fases)
- [ ] Polling do bootstrap a cada 60s
- [ ] Inicialização do Smartico SDK

---

## 11. Observações Finais

1. **Imagens das figurinhas:** No produto de referência, as imagens ficam em um CDN próprio (`cdn.vera.bet.br`). Para o nosso projeto, precisamos criar ou contratar as artes e hospedar em CDN próprio.

2. **Sorteio de figurinhas:** A lógica de sorteio (probabilidade por raridade) é serverside. Sugestão: Bronze 60%, Prata 30%, Ouro 8%, Diamante 2%.

3. **Smartico vs. implementação própria:** Se não usar o Smartico, as missões precisam ser implementadas do zero. O Smartico já tem a infraestrutura de achievements, níveis e WebSocket pronta — recomendado para acelerar.

4. **Polling de 60s:** O `bootstrap` é chamado a cada 60 segundos para atualizar o estado (pacotinhos ganhos via missão, etc.). Alternativa mais eficiente: WebSocket próprio.

5. **SEO e PWA:** O produto de referência usa `manifest.json` e meta tags para instalação como PWA (Progressive Web App) com `apple-mobile-web-app-capable`.
