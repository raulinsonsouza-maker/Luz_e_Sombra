# Salesbots Kommo — Funil de vendas

Guia dos Salesbots de WhatsApp. **Produção usa o pipeline Funil de vendas** (`14098755`) — ver [`DISPAROS.md`](./DISPAROS.md) para o modelo híbrido atual (DP boas-vindas + Talks API no Portal).

**Canal:** WhatsApp Lite (`amocrm_whatsapp`) — mensagens só em **texto** (sem botões). Links vão inline no corpo; o WhatsApp deixa a URL clicável.

---

## Arquivos JSON (importar na Kommo)

| Arquivo | Nome no painel | Quando dispara |
|---------|----------------|----------------|
| `pi-boas-vindas.json` | PI - Boas-vindas | **DP** — criado na etapa de entrada |
| `pi-pix-pendente.json` | PI - PIX pendente | *(legado — Portal envia via Talks API)* |
| `pi-pix-lembrete-2h.json` | PI - PIX lembrete 2h | *(legado — cron Portal)* |
| `pi-pix-lembrete-24h.json` | PI - PIX lembrete 24h | *(legado — cron Portal)* |
| `pi-acesso-liberado.json` | PI - Acesso liberado | *(legado — Portal envia via Talks API)* |

---

## Pipeline Funil de vendas (produção)

| Etapa | ID Kommo | Disparo |
|-------|----------|---------|
| Etapa de leads de entrada | `108834247` | **PI - Boas-vindas** (DP, criado nesta etapa) |
| Contato inicial | `108834251` | PIX via **Talks API** (Portal) |
| Fechado - ganho | `142` | Acesso via **Talks API** (Portal) |
| Fechado - perdido | `143` | Revogação (Portal) |

Link do pipeline: https://leticiabemvideos.kommo.com/settings/pipeline/leads/14098755

> O pipeline **Portal Iluminando** (`14099787`) não é mais usado em produção.

---

## Placeholders (campos preenchidos pelo Portal)

| Campo | ID | Placeholder | Uso |
|-------|-----|-------------|-----|
| CHECKOUT_URL | `1350222` | `{{lead.cf.1350222}}` | Link checkout personalizado |
| LOGIN_URL | `1350224` | `{{lead.cf.1350224}}` | Link de login |
| EMAIL_CADASTRO | `1350226` | `{{lead.cf.1350226}}` | E-mail do cadastro |
| Nome | — | `{{contact.name}}` | Primeiro nome |

O Portal preenche esses campos automaticamente em cada cadastro e pagamento.

---

## Passo 1 — Importar Salesbots

1. Acesse **Configurações → Ferramentas de comunicação → Salesbots**
2. **Criar → Importar** (ou abra um bot existente → **Ver código-fonte**)
3. Cole o conteúdo de cada JSON desta pasta
4. Salve com o **nome exato** da tabela acima
5. Repita para os 5 arquivos

**Se já existirem bots antigos** com os mesmos nomes, edite o código-fonte de cada um e substitua pelo JSON novo (ou apague e reimporte).

---

## Passo 2 — Configurar disparos

**Guia detalhado com screenshot:** [`DISPAROS.md`](DISPAROS.md)

Resumo:

1. **Novo cadastro** — remover gatilho PI - Boas-vindas do DP (Portal API dispara)
2. **Pagamento pendente** — 3 gatilhos com delay **0h / 2h / 24h**
3. **Pago** — remover gatilho PI - Acesso liberado do DP (Portal API dispara)
4. Clicar **Salvar**

O Portal move o lead para *Pagamento pendente* automaticamente após o cadastro.

---

## Passo 3 — Regras anti-duplicata

- **Novo cadastro:** só API (boas-vindas) — sem bot no DP
- **Pago:** só API (acesso liberado) — sem bot no DP
- **Pagamento pendente:** só DP (PIX + lembretes) — sem API para esses 3
- O Portal **não reenvia** boas-vindas se o telefone já tem lead no Kommo
- O Portal **não reenvia** acesso se o pagamento já foi sincronizado

---

## Copys (referência)

### PI - Boas-vindas
```
Oi, {{contact.name}}! ✨

Que alegria te receber na Jornada Da Sombra à Luz 💜

Seu cadastro no Portal Iluminando já está confirmado. Falta só um passinho: concluir o pagamento para liberar sua trilha de autoconhecimento.

Também enviamos tudo por e-mail, tá bem?

👇 Finalize por aqui:
{{lead.cf.1350222}}
```

### PI - PIX pendente
```
Oi, {{contact.name}}! 💛

Vi que seu pagamento ainda não foi confirmado — e estou aqui pra te ajudar!

Assim que o PIX ou cartão for aprovado, seu acesso ao Portal Iluminando é liberado na hora ✨

👇 Seu link de pagamento:
{{lead.cf.1350222}}
```

### PI - PIX lembrete 2h
```
{{contact.name}}, tudo bem? 🌸

Só passando pra lembrar com carinho: sua jornada ainda está te esperando.

Se você já pagou, pode ignorar — a confirmação às vezes demora alguns minutinhos 💜

👇 Link do seu checkout:
{{lead.cf.1350222}}
```

### PI - PIX lembrete 24h
```
Oi, {{contact.name}}! 💫

Sua vaga na Jornada Da Sombra à Luz ainda está reservada pra você.

Não deixa esse momento de cuidado com você passar — é só um passinho 🌙

👇 Acesse seu checkout:
{{lead.cf.1350222}}
```

### PI - Acesso liberado
```
{{contact.name}}, pagamento confirmado! 🎉✨

Seu acesso ao Portal Iluminando está LIBERADO — que momento lindo!

Entre com o e-mail {{lead.cf.1350226}} e a senha que você criou. Lá dentro você encontra sua jornada completa de autoconhecimento, no seu ritmo 💜

👇 Acesse sua conta:
{{lead.cf.1350224}}
```

---

## Validação

1. `node scripts/kommo-salesbots/kommo-salesbots-verify.mjs` — 5 bots OK
2. Cadastro teste com **telefone novo** → 1 boas-vindas com link de checkout preenchido
3. Mover lead para **Pagamento pendente** → testar lembretes PIX (se DP funcionar)
4. Simular pagamento Cakto → 1 acesso liberado com e-mail e link de login

Não repetir testes com o mesmo número sem limpar o lead no Kommo.

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Link vazio na mensagem | Verificar campo CHECKOUT_URL no lead; cadastro deve passar pelo Portal |
| Mensagem duplicada | Remover bots do DP em Novo/Pago; conferir `KOMMO_TRIGGER_BOTS` |
| WPP não envia | Telefone do contato deve estar vinculado ao WhatsApp Lite no painel |
| Placeholder não resolve | Usar `{{lead.cf.1350222}}` (ID numérico), não o nome do campo |
| Botões não aparecem | Normal no WhatsApp Lite — use só texto com link inline |

---

## Formato técnico

JSON Salesbot Kommo: chave `"0"`, `handler: "show"`, `type: "text"`, `action: stop` no final.

Documentação: https://developers.kommo.com/docs/salesbot-dp
