# Diagnóstico Emocional — Especificação técnica e funcional (handoff)

Documento único para produto, design e desenvolvimento: **sem ruído**, fluxo fechado, contratos e pendências explícitos.

**Relação com o restante do produto**

- O app **hoje** pode enviar um resumo opcional `diagnosticoEmocional` em `POST /traco/analisar` (fusão com traços) — ver secção [11](#11-implementação-técnica--checklist).
- O fluxo de **20 reflexões (eixos)** foi **removido da aplicação**; o Traço de Caráter usa **fotos** e, em opcional, o **Diagnóstico Emocional (30 itens)** descrito neste documento. O pacote `traco-eixos-multimodal` mantém utilitários usados na análise por imagem no cliente.

**Prioridade de produto:** o diagnóstico **não substitui** a análise por fotos; **refina** leituras ambíguas e enriquece linguagem quando integrado ao traço.

---

## 1. Visão geral do módulo

| Campo | Valor |
|--------|--------|
| **Nome** | Diagnóstico Emocional |
| **Objetivo** | Identificar padrões emocionais estruturais (**passado**), estado atual (**presente**) e **nível de consciência / evolução**, gerando um **perfil emocional personalizado** com texto interpretativo (não só números). |
| **Público-alvo do modelo completo** | **15+** (faixas menores: ver secção [10](#10-faixas-etárias-produto)). |
| **Princípio de UX** | Perguntas **sem** identificação de traço ou de “padrão interno” para o utilizador; categorias só no motor e relatórios técnicos. |

---

## 2. Fluxo do utilizador

1. **Tela de introdução** — copy + CTA.
2. **Questionário** — 1 pergunta por ecrã; duas escalas (passado + presente) nos itens 1–25; uma escala (consciência) nos itens 26–30.
3. **Processamento automático** — cálculo determinístico + validação; persistência (meta: servidor).
4. **Tela de resultado** — blocos interpretativos + tag de evolução.

---

## 3. Tela 1 — Introdução

**Texto sugerido**

> Este diagnóstico vai te ajudar a entender seus padrões emocionais e seu momento atual.  
> Leva menos de 3 minutos para responder.

**CTA:** `Começar`

**Notas de implementação**

- Tempo “menos de 3 minutos” na intro é **estimativa**; pode ser substituído por “cerca de X minutos” conforme métricas reais após testes.
- Opcional: indicar **progresso global** só a partir do questionário (ex.: não mostrar “0/30” na intro).

---

## 4. Tela 2 — Questionário

### 4.1 Formato

- **Uma pergunta por ecrã.**
- **Barra de progresso:** `n / N` (hoje **N = 30**; ver secção [9](#9-quantidade-de-perguntas--extensibilidade)).
- Opcional: tempo estimado restante.

### 4.2 Estrutura de resposta

#### Itens 1–25 — duas respostas obrigatórias por ecrã

**1) Passado (antes)**

Pergunta auxiliar (label fixo):

> Como isso era na sua vida (principalmente no passado ou infância)?

| Opção | Valor numérico |
|--------|----------------|
| A) Nunca | 1 |
| B) Pouco | 2 |
| C) Moderado | 3 |
| D) Muito | 4 |
| E) Extremamente | 5 |

**2) Presente (hoje)**

Pergunta auxiliar:

> Como isso está na sua vida hoje?

| Opção | Valor |
|--------|--------|
| A) Não é mais assim | 1 |
| B) Raramente | 2 |
| C) Às vezes | 3 |
| D) Frequentemente | 4 |
| E) Muito forte ainda | 5 |

**Interação:** um toque por escala; **ambas** as escalas obrigatórias antes de “Seguinte”.

---

#### Itens 26–30 — bloco “Consciência” (uma resposta por ecrã)

Pergunta auxiliar:

> Sobre seu nível de consciência emocional hoje:

| Opção | Valor |
|--------|--------|
| A) Nada | 1 |
| B) Pouco | 2 |
| C) Médio | 3 |
| D) Bastante | 4 |
| E) Muito | 5 |

---

### 4.3 Banco canónico de perguntas (sem identificação de padrão na UI)

**Localização no código (meta):** constante única `PERGUNTAS_EMOCIONAIS` (ou equivalente) versionada (`diagnostico_emocional_v1`).

**Linguagem:** as frases abaixo estão na primeira pessoa com flexão feminina (“sozinha”, “sobrecarregada”…). Na implementação, **prevê variantes** (masculino / neutro) ou formulário inclusivo acordado com produto — não bloquear I18n.

#### Itens 1–25 (duas respostas cada)

| # | Enunciado |
|---|-----------|
| 1 | Eu sentia falta de atenção e afeto na infância |
| 2 | Eu tenho dificuldade de demonstrar vulnerabilidade |
| 3 | Eu gosto de ter controle das situações |
| 4 | Eu me sinto sozinha mesmo acompanhada |
| 5 | Eu me cobro para fazer tudo certo |
| 6 | Eu tenho dificuldade de confiar totalmente nas pessoas |
| 7 | Eu seguro o que sinto |
| 8 | Eu me sinto carente em alguns momentos |
| 9 | Eu tenho dificuldade de dizer “não” |
| 10 | Eu observo as pessoas antes de me abrir emocionalmente |
| 11 | Eu me sinto sobrecarregada com frequência |
| 12 | Eu tenho medo de ser deixada ou esquecida |
| 13 | Eu controlo minhas emoções |
| 14 | Eu evito depender dos outros |
| 15 | Eu me fecho emocionalmente em algumas situações |
| 16 | Eu busco validação emocional das pessoas |
| 17 | Eu tolero mais do que gostaria nas relações |
| 18 | Eu preciso me sentir segura para me entregar |
| 19 | Eu me sinto desconectada em alguns momentos |
| 20 | Eu assumo liderança naturalmente |
| 21 | Eu acumulo emoções ao invés de expressar |
| 22 | Eu tenho dificuldade de relaxar |
| 23 | Eu prefiro me isolar em alguns momentos |
| 24 | Eu sinto dificuldade de confiar na vida ou no mundo |
| 25 | Eu sinto que preciso provar meu valor |

#### Itens 26–30 (uma resposta cada — consciência)

| # | Enunciado |
|---|-----------|
| 26 | Eu tenho consciência dos meus padrões emocionais |
| 27 | Eu já trabalhei minhas dores emocionais |
| 28 | Eu percebo quando estou repetindo um padrão |
| 29 | Eu evoluí emocionalmente nos últimos anos |
| 30 | Hoje eu me sinto mais equilibrada emocionalmente |

---

### 4.4 Nota de qualidade — paralelismo passado / presente

Alguns enunciados misturam **tempo verbal** ou **âncora temporal** (“na infância”, “hoje implícito”). O formato **passado vs presente** funciona melhor quando o **miolo da frase é temporalmente neutro**, e as duas subperguntas fazem o trabalho de situar no tempo.

**Recomendações para redação final (conteúdo):**

- **Item 1:** considerar versão neutra no miolo, ex.: *“Falta de atenção e afeto nas relações quando era mais nova/moreu”* ou dois stems versionados — evitar que “presente” fique subordinado a “infância” no mesmo enunciado.
- Itens **2–30:** rever em copy review se a mesma frase soa natural nas duas escalas; onde não soar, usar **stem neutro** + gloss opcional curto.

Isto **não bloqueia** o desenvolvimento do motor nem do JSON; versiona-se o texto (`versaoConteudo`).

---

## 5. Mapeamento interno (não mostrar ao utilizador)

Cada pergunta **1–25** está associada a **um** dos cinco padrões internos abaixo (só motor / analytics).

| Padrão interno | IDs das perguntas |
|----------------|-------------------|
| **Vínculo** | 1, 4, 8, 12, 16 |
| **Controle** | 2, 5, 13, 18, 22 |
| **Estratégia** | 3, 6, 10, 14, 20 |
| **Retenção** | 7, 9, 11, 17, 21 |
| **Desconexão** | 15, 19, 23, 24, 25 |

**Invariante para a versão v1:** 5 perguntas × 5 padrões = **25** itens de dupla escala. Qualquer alteração no número de itens por grupo implica **nova versão** do modelo e recalibração dos pesos e textos.

---

## 6. Lógica de processamento

### 6.1 Conversão

- Todas as opções **A–E** → **1–5** como na secção [4.2](#42-estrutura-de-resposta).

### 6.2 Cálculo (resumo algorítmico)

Para cada padrão interno `g`:

1. **S_pass(g)** — soma das respostas **Passado** nas perguntas do grupo. Máximo teórico: **25** (5 itens × 5).
2. **S_pres(g)** — soma das respostas **Presente** no mesmo grupo. Máximo: **25**.
3. **Combinação temporal** (pesos de produto para 15+):

   `raw(g) = 0.60 × (S_pass(g) / 25) + 0.40 × (S_pres(g) / 25)` → valor em **[0, 1]**.

4. **Consciência:** `mediaConsciencia = média(itens 26–30)` → **[1, 5]**.
5. **Fator de ajuste (consciência):** alta consciência **suaviza** picos / dispersão entre padrões (reduz “impacto negativo” de ativação crua sem apagar sinais); baixa consciência **mantém** ativação mais próxima do raw. Detalhe matemático parametrizável no motor (`VERSAO_MODELO`).

6. **Percentuais por padrão:** normalizar os valores ajustados para **soma = 100%** (percentagens 0–100, com regra de empate e correção de arredondamento no maior padrão).

7. **Níveis textuais:** derivar **nível atual** (baixo / médio / alto) e **nível de evolução** (baixo / médio / alto) a partir do padrão dominante, subdominante e `mediaConsciencia` (regras no motor, ajustáveis).

8. **Tag de evolução** (automática):

   | Tag | Significado operacional (resumo) |
   |-----|-----------------------------------|
   | Inconsciente | Pouca consciência declarada + padrões crus elevados |
   | Em processo | Consciência média ou padrão misto com tendência de trabalho |
   | Integrado | Consciência mais alta e/ou presente mais regulado vs passado |

   Valores canónicos sugeridos na API: `inconsciente` | `em_processo` | `integrado` (slug); UI: 🔴 / 🟡 / 🟢.

### 6.3 Saída numérica mínima (contrato)

- `padroesPct`: cinco percentuais **0–100**, **soma 100** (tolerância de implementação a definir, ex. ±2,5 pts).
- `mediaConsciencia`: **1–5**.
- `tagEvolucao`: enum acima.
- Opcional: `nivelAtualDominante`, `nivelEvolucao`, `versaoModelo`, `versaoConteudo`.

---

## 7. Tela 3 — Resultado (blocos de copy)

Os textos são **gerados por templates** a partir dos dois padrões mais altos, da tag e dos níveis — **não** há um único parágrafo fixo para todos os utilizadores. Exemplos de **tom** (referência de produto):

**Bloco 1 — Perfil emocional (exemplo)**  
> Seu perfil emocional mostra uma predominância de padrões ligados a controle, conexão e adaptação emocional.

**Bloco 2 — Momento atual (exemplo)**  
> Você já desenvolveu consciência sobre seus padrões e está em processo de evolução emocional. Hoje, você reage com mais percepção, mas ainda pode ativar emoções em situações específicas.

**Bloco 3 — Ponto de atenção (exemplo)**  
> Em alguns momentos, você pode: controlar o que sente; se adaptar além do necessário; segurar emoções importantes.

**Bloco 4 — Próximo passo (exemplo)**  
> Seu próximo nível está em: aprofundar sua conexão emocional; permitir sentir com mais liberdade; expressar com mais autenticidade.

**Bloco 5 — Tag de evolução**  
Exibir a tag 🔴 / 🟡 / 🟢 com microcopy alinhada às definições do motor.

---

## 8. Observações para desenvolvimento

- Todas as perguntas **obrigatórias** antes de concluir.
- **Não** mostrar nomes de padrões internos nem o mapeamento ID → padrão na UI do questionário.
- Resposta **rápida** (clique único por escala).
- Interface **leve** (poucos elementos por ecrã, acessível, contraste seguro).
- **Persistir** respostas brutas + resultado + `criadoEm` + `versaoModelo` / `versaoConteudo` para histórico e evolução.
- **Reavaliação** após **X dias** (`REAVALIACAO_DIAS`, configurável; sugestão inicial: 90).

---

## 9. Quantidade de perguntas — extensibilidade

**Versão actual (v1):** **30** itens (25 com dupla escala + 5 consciência), com **25** itens distribuídos **5×5** pelos padrões internos.

**Para “o melhor resultado” sem número fixo à força:**

| Critério | Orientação |
|----------|--------------|
| **Equilíbrio estatístico** | Manter o **mesmo número de itens por padrão** em cada versão (ex.: sempre 5 por padrão, ou passar a 6 por padrão em v2 = 30 itens dupla + consciência). |
| **Mínimo viável** | Abaixo de **3 itens por padrão**, a variância sobe; exige recalibração forte e disclaimers de confiança. |
| **Extensão** | Novas perguntas devem: (1) ser atribuídas a **um** padrão; (2) passar copy review de paralelismo; (3) incrementar `versaoConteudo` ou `versaoModelo`. |
| **Consciência** | O bloco 26–30 pode ganhar **+N** itens noutra versão; `mediaConsciencia` passa a média normalizada sobre o novo total. |

**Resumo:** o número **não é dogma**; o que é obrigatório é **versionar**, **equilibrar por padrão** e **recalibrar** o motor e templates sempre que o banco mudar.

---

## 10. Faixas etárias (produto)

| Faixa | Input | Saída esperada (nomenclatura) |
|-------|--------|-------------------------------|
| 4–7 | Responsável | “Tendências comportamentais observadas” — **não** “diagnóstico”. |
| 8–11 | Criança + opcional responsável | Padrões leves; evitar “infância” distante de forma inadequada. |
| 12–14 | Autoavaliação | Peso maior no **presente** (parametrizável). |
| 15+ | Modelo completo | Este documento + motor completo passado/presente/consciência. |

---

## 11. Implementação técnica — checklist

### 11.1 Base de dados (pendente / a confirmar)

- Tabela sugerida: `diagnostico_emocional`  
  - `id`, `usuario_id`, `versao_modelo`, `versao_conteudo`, `faixa`, `respostas` (JSONB), `resultado` (JSONB), `criado_em`.  
- Índice `(usuario_id, criado_em DESC)` para histórico e regra “reavaliar após X dias”.

### 11.2 API — diagnóstico persistido (pendente)

- `POST /api/diagnostico-emocional` — body: `{ faixa, respostas }` → valida → persiste → retorna resultado.  
- `GET /api/diagnostico-emocional/ultimo` — último resultado do utilizador.  
- Opcional: `GET /api/diagnostico-emocional/historico`.

### 11.3 API — fusão com traço (**já implementada**)

**Rota:** `POST /api/traco/analisar` (autenticado), corpo opcional:

```json
{
  "diagnosticoEmocional": {
    "padroesPct": {
      "vinculo": 22,
      "controle": 18,
      "estrategia": 20,
      "retencao": 24,
      "desconexao": 16
    },
    "mediaConsciencia": 3.5,
    "tagEvolucao": "em_processo"
  }
}
```

- Chaves de `padroesPct`: alinhadas ao contrato do pacote `@workspace/traco-diagnostico-fusion` (**sem acento** em `estrategia`, `retencao`, `desconexao` onde o código assim o exige — validar contra Zod do servidor).

**Frontend (estado actual de testes):** `TracodeCaraterPage` pode ler JSON em `localStorage` (`luz_diagnostico_emocional_fusao`) até o fluxo de 30 perguntas gravar o payload automaticamente.

### 11.4 Frontend (pendente)

- Rotas sugeridas: `/diagnostico-emocional`, steps internos ou query `?step=`.  
- Componentes: `Intro`, `Questionario`, `Processando`, `Resultado`.  
- Integração: **Jornada**, **Quem sou eu**, eventual deep link pós-login.  
- Após concluir: opcional **reprocessar** última análise de traço com o novo JSON.

### 11.5 LGPD e menores

- Faixas infantis: consentimento do responsável, linguagem adequada, política de retention.  
- Evitar rótulos clínicos fortes em menores.

---

## 12. Alinhamento com o código actual

| Item | Estado |
|------|--------|
| `QuemSouEuPage` — bloco “Diagnóstico Emocional (Fase 1)” | Heurístico; **não** substitui este questionário. |
| `POST /traco/analisar` + `diagnosticoEmocional` | **Implementado** (fusão). |
| `@workspace/traco-diagnostico-fusion` | Matriz versionada + validação. |
| Motor `computeDiagnosticoEmocional*` + UI 30 telas + persistência dedicada | **A implementar** conforme checklist. |
| `MODELO_MULTIMODAL_EIXOS.md` | Fluxo **20** perguntas + fotos — paralelo até decisão de produto. |

---

## 13. Próximos passos sugeridos (ordem)

1. **Copy review** dos itens 1–25 (paralelismo passado/presente + variantes de género).  
2. **Motor** `compute…` + testes unitários (somas, pesos 0,6/0,4, normalização, tag).  
3. **Persistência** + rotas REST + remoção gradual da dependência de `localStorage` para fusão.  
4. **UI** intro → questionário → processamento → resultado.  
5. Parametrizar `REAVALIACAO_DIAS` e métricas de tempo na intro.  
6. **Documento opcional separado:** fórmula fechada do fator de consciência (pseudo-código) — se o equipa pedir, extrair da implementação para `docs/DIAGNOSTICO_EMOCIONAL_ALGORITMO.md`.

---

## 14. Resumo executivo

| Entrega | Incluído |
|---------|----------|
| Diagnóstico emocional escalável | Sim — com versionamento de conteúdo e modelo. |
| Passado + presente | Sim — itens 1–25. |
| Leitura de evolução / consciência | Sim — itens 26–30 + tag. |
| Resultado interpretativo | Sim — templates, não só números. |
| Integração com traço | Sim — contrato já existente na API. |

---

*Última atualização: especificação alinhada ao handoff funcional + técnico (fluxo 30 perguntas, banco canónico e extensibilidade).*
