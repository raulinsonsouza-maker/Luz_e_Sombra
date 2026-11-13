# WhatsApp Cloud API — Portal Iluminando (Letícia Fase 1)

## Checklist Meta

1. Business Manager com função MANAGE
2. App com produto WhatsApp (Cloud API) + admin no app
3. WABA ligada ao app + número oficial
4. System User token com `whatsapp_business_messaging` + `whatsapp_business_management`
5. Templates Fase 1 **APPROVED** (pt_BR) — nomes na tabela abaixo
6. Webhook: `https://portaliluminando.com.br/api/webhooks/whatsapp` + `WHATSAPP_VERIFY_TOKEN`

## Variáveis no `.env` da VPS

```env
WHATSAPP_ENABLED=true
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_APP_SECRET=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_API_VERSION=v21.0
# Opcional — order_details / Payments BR (chave estática de exibição)
WHATSAPP_PIX_MERCHANT_NAME=Portal Iluminando
WHATSAPP_PIX_KEY=
WHATSAPP_PIX_KEY_TYPE=EVP
```

Remova qualquer `KOMMO_*`. A cobrança continua 100% no Mercado Pago; o WhatsApp só notifica.

## Templates Fase 1 (em uso no código)

| Evento | Template (nome Meta) | Categoria | Botões | Gatilho |
|---|---|---|---|---|
| Cadastro sem pagamento | `portal_cadastro_iniciado` | MARKETING | URL Concluir pagamento + QR Pare | register em `funnel.ts` |
| Checkout 2h | `portal_checkout_2h` | MARKETING | URL Concluir pagamento + QR Pare | cron `reminders.ts` |
| Checkout 24h | `portal_checkout_24h` | MARKETING | URL Concluir pagamento + QR Pare | mesmo cron |
| PIX gerado não pago | `portal_pix_aguardando` | UTILITY | URL Pagar no Portal + QR Ja paguei | `payments/mp.ts` pending + `mpPaymentId` |
| Pagamento + acesso | `portal_acesso_ativado` | UTILITY | URL Acessar Portal | `activateMpPurchase.ts` |
| Nova post comunidade | `portal_comunidade_aviso` | MARKETING | URL Ler publicacao + QR Parar posts | create post em `comunidade.ts` (só opt-in) |

Aliases: nomes ideais (`portal_lembrete_2h`, `portal_lembrete_24h`, `portal_pix_pendente`, `portal_comunidade_nova_postagem`) ficaram órfãos na WABA (conteúdo antigo; System User não consegue DELETE). Código aponta para os nomes da tabela.

### Textos (sem acentos; links só nos botões)

**portal_cadastro_iniciado**

```
Oi, {{1}}! Recebemos seu cadastro para a Jornada Da Sombra a Luz, do Portal Iluminando. Para concluir sua inscricao e liberar seu acesso, finalize o pagamento pelo botao abaixo. Sua jornada esta a um passo de comecar!
```

**portal_checkout_2h**

```
Oi, {{1}}! Sua inscricao na Jornada Da Sombra a Luz ainda nao foi concluida. Se deseja iniciar sua jornada de autoconhecimento no Portal Iluminando, voce pode retomar seu cadastro pelo botao abaixo.
```

**portal_checkout_24h**

```
Oi, {{1}}! Passando para lembrar que sua inscricao no Portal Iluminando continua pendente. Se ainda deseja iniciar sua Jornada Da Sombra a Luz, voce pode concluir seu pagamento pelo botao abaixo.
```

**portal_pix_aguardando** — `{{1}}` nome, `{{2}}` nº pedido MP

```
Oi, {{1}}! O pagamento via PIX do pedido {{2}} ainda esta pendente. Assim que a confirmacao for recebida, seu acesso ao Portal Iluminando sera ativado.
```

Após o template: tenta `order_details` com `pix_dynamic_code` (copia-e-cola do MP). Se a WABA não tiver Payments BR, envia o código em texto. `PAYMENT_REQUEST` no template ainda não é aceito nesta conta (`tipo inesperado`).

**portal_acesso_ativado** — `{{1}}` nome, `{{2}}` nº pedido MP

```
Oi, {{1}}! Seu pagamento do pedido {{2}} foi confirmado e seu acesso ao Portal Iluminando esta ativo. Sua Jornada Da Sombra a Luz ja esta disponivel. Que bom ter voce por aqui. Seja bem-vindo(a) a essa jornada de autoconhecimento!
```

**portal_comunidade_aviso** — `{{1}}` nome, `{{2}}` título (#id)

```
Oi, {{1}}! Uma nova publicacao foi compartilhada na Comunidade do Portal Iluminando: {{2}}. Sua jornada continua em cada nova descoberta.
```

## Regras de negócio

1. Compra `status=paid` sai do cron; `closeWhatsAppRemindersOnPaid` no activate.
2. Com `waPixPendingSentAt`, cron não envia 2h/24h nessa compra.
3. Cadastro = `portal_cadastro_iniciado` (não é boas-vindas de membro).
4. Dedup via colunas `wa_*` em `compras_mp`.
5. Opt-out global: `whatsapp_opt_out` (texto/botão `Pare` / `parar`).
6. Comunidade: só quem tem `whatsapp_comunidade_opt_in=true`; `Parar posts` / `parar comunidade` desliga só a comunidade.

## Fase 2 (só documentar — após APPROVED da Fase 1)

Implementar gatilhos depois:

### `portal_pagamento_nao_aprovado` (UTILITY)

Texto Letícia: avisar falha/recusa de pagamento e botão para tentar de novo no checkout.

### `portal_comunidade_resposta` (MARKETING)

Aviso quando alguém responde/comenta (opt-in comunidade).

### `portal_acesso_expira` (UTILITY)

Lembrete de renovação antes de `acessoAte`.

## Webhook inbound

- `Pare` / `parar` / `stop` → `whatsapp_opt_out=true`
- `Parar posts` / `parar comunidade` → `whatsapp_comunidade_opt_in=false`
- `Ja paguei` → marca lembretes 2h/24h como enviados na compra pending (anti-spam)

## Teste

1. Aguardar Meta APPROVED nos 6 templates da tabela
2. Número de teste → cadastro funnel → mensagem cadastro
3. Gerar PIX no checkout → template + código copia-e-cola
4. Pagar → `portal_acesso_ativado`
5. Admin cria post → só usuários com opt-in comunidade
