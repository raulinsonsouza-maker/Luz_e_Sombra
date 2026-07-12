# Disparos Kommo — Funil de vendas (modelo híbrido)

Pipeline **Funil de vendas** (`14098755`). Boas-vindas no **DP**; PIX/lembretes/acesso no **Portal**.

## Etapas e IDs

| Etapa Kommo | ID | Papel no Portal |
|-------------|-----|-----------------|
| Etapa de leads de entrada | `108834247` | Cadastro + **DP boas-vindas** (criado nesta etapa) |
| Contato inicial | `108834251` | Pagamento pendente → PIX (Talks API) |
| Em contato | `108834255` | (opcional, manual) |
| Fechado - ganho | `142` | Pagamento confirmado → acesso (Talks API) |
| Fechado - perdido | `143` | Revogação de acesso |

Link: https://leticiabemvideos.kommo.com/settings/pipeline/leads/14098755

## Painel Kommo

### Etapa de leads de entrada — MANTER gatilho (só widget WPP)

- **PI - Boas-vindas** — *Quando criado nesta etapa* (leads que entram pelo WhatsApp)
- Cadastros do **Portal via API** criam em **Contato inicial** e disparam boas-vindas pelo **Salesbot** (API não aceita etapa de entrada)

### Demais etapas — sem gatilhos de bot

Portal + cron enviam PIX, lembretes e acesso.

## Variáveis VPS

```env
KOMMO_PIPELINE_ID=14098755
KOMMO_STATUS_NOVO_CADASTRO=108834247
KOMMO_STATUS_PAGAMENTO_PENDENTE=108834251
KOMMO_STATUS_PAGO=142
KOMMO_STATUS_PERDIDO=143
KOMMO_WELCOME_VIA_DP=true
KOMMO_WELCOME_DP_DELAY_MS=12000
KOMMO_USE_TALKS_API=true
```

## Fluxo

```
Cadastro → entrada (108834247) → DP: boas-vindas → aguarda 12s
         → Contato inicial (108834251) → PIX (Talks API)
Pagamento → Fechado ganho (142) → acesso (Talks API)
```
