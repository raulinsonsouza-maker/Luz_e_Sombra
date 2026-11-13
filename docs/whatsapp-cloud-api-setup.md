# WhatsApp Cloud API — Portal Iluminando

## MCP no Cursor

Entrada já adicionada em `~/.cursor/mcp.json`:

- alias: `whatsapp_business_tools`
- url: `https://mcp.facebook.com/whatsapp_business_tools`

Reabra o Cursor (ou Personalizar → MCP), autentique com a conta Meta admin e teste: *"liste as empresas do WhatsApp"* (`whatsapp_biz_businesses`).

Se o OAuth falhar (servidor não reconhece Cursor), configure tudo no Business Manager e use `whatsapp_biz_system_user_token` via Claude/Codex, ou o painel Usuários do sistema.

## Checklist Meta (obrigatório antes de produção)

1. Business Manager com função MANAGE
2. App com produto WhatsApp (Cloud API) + admin no app
3. Aceitar ToS da Cloud API
4. WABA ligada ao app
5. Número oficial registrado
6. Forma de pagamento no BM
7. System User token permanente com `whatsapp_business_messaging` + `whatsapp_business_management`
8. Anotar: `phone_number_id`, WABA ID, App Secret
9. Templates abaixo aprovados (pt_BR)
10. Webhook: `https://portaliluminando.com.br/api/webhooks/whatsapp` + verify token = `WHATSAPP_VERIFY_TOKEN`

## Variáveis no `.env` da VPS

```env
WHATSAPP_ENABLED=true
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_APP_SECRET=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_API_VERSION=v21.0
```

Remova qualquer `KOMMO_*`.

## Templates Fase 1 (Utility, pt_BR)

Crie no BM / MCP com estes nomes exatos (o código usa estes IDs):

### `portal_boas_vindas`

Corpo:

```
Oi, {{1}}!

Seu cadastro na Jornada Da Sombra à Luz está confirmado.

Falta só concluir o pagamento para liberar o acesso completo ao Portal Iluminando.

👇 Finalize seu acesso:
{{2}}
```

Variáveis: 1=primeiro nome, 2=URL checkout

### `portal_pix_pendente`

```
Oi, {{1}}!

Seu cadastro está confirmado — falta só o pagamento para liberar o acesso.

PIX ou cartão: aprovação na hora.

👇 Concluir pagamento:
{{2}}
```

### `portal_lembrete_2h`

```
{{1}}, tudo bem?

Sua vaga na Jornada Da Sombra à Luz ainda está reservada.

Se já pagou, pode ignorar. Se ainda não, garanta seu acesso:

{{2}}
```

### `portal_lembrete_24h`

```
Oi, {{1}}!

Último lembrete: sua vaga no Portal Iluminando ainda está disponível.

👇 Finalizar agora:
{{2}}
```

### `portal_acesso_liberado`

```
{{1}}, pagamento confirmado!

Seu acesso ao Portal Iluminando está LIBERADO.

Entre com o e-mail {{2}} e a senha que você criou.

👇 Acessar:
{{3}}
```

Variáveis: 1=nome, 2=email, 3=URL login

## Templates Fase 2 (Marketing, pt_BR)

### `portal_aviso_curso`

```
Oi, {{1}}!

Novo curso no Portal Iluminando: {{2}}

{{3}}
```

### `portal_aviso_comunidade`

```
Oi, {{1}}!

Novidade na comunidade: {{2}}

{{3}}
```

### `portal_aviso_dia`

```
Oi, {{1}}!

{{2}}

{{3}}
```

Botão/CTA opcional com link do portal. Opt-out: usuário responde `parar` (webhook marca `whatsapp_opt_out`).

## Teste

1. Número de teste na Meta → enviar `portal_boas_vindas`
2. Conferir webhook GET challenge
3. Ativar `WHATSAPP_ENABLED=true` na VPS e reiniciar API
