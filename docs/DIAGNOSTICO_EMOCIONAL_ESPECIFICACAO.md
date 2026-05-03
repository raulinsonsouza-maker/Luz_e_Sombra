# Diagnóstico Emocional — Especificação técnica e funcional

Documento para alinhar produto, backend e frontend. O app **hoje** expõe um **resumo derivado** no dossiê “Quem sou eu” (Fase 1: idade + traço + Roda da Vida). O fluxo **completo de 30 perguntas** (passado/presente) descrito nas secções 2–6 **ainda não** foi implementado como UI dedicada.

**Modelo implementado em paralelo:** o **multimodal por 5 eixos e 20 perguntas** está descrito e versionado em [`MODELO_MULTIMODAL_EIXOS.md`](./MODELO_MULTIMODAL_EIXOS.md) (rota `/diagnostico-eixos`, pacote `@workspace/traco-eixos-multimodal`, campo `resultado.modeloMultimodal` na API). Os dois desenhos (30 vs 20) convivem até decisão de produto de unificação.

**Prioridade de produto:** este módulo **não é isolado** — deve ser planejado e implementado **em conjunto com a análise de traços** (`tracoAnalysis.ts` e fluxo de fotos), para **aumentar a assertividade** da leitura de traços. O questionário captura **histórico subjetivo, vínculo, controle e consciência**; a análise visual captura **marcadores posturais e de expressão**. Juntos reduzem ambiguidade quando uma fonte sozinha seria frágil (poucas fotos, iluminação ruim, ou respostas “do momento”).

---

## 1. Visão geral

| Campo | Valor |
|--------|--------|
| **Módulo** | Diagnóstico Emocional |
| **Objetivo** | Perfil emocional personalizado: padrões (passado + presente), consciência, evolução, linguagem interpretativa (não só números). |
| **Integração com traços** | **Obrigatória no desenho final:** alimentar e calibrar a **análise de traços** com sinais declarativos estáveis, melhorando ranking de estruturas, textos de interpretação e confiança da análise. |
| **Fonte de verdade (15+ / 30 itens)** | Especificado nas secções 4–5; **UI de 30 itens** ainda pendente. Para traço + questionário **já operacional**, ver `MODELO_MULTIMODAL_EIXOS.md` (20 itens). |

### 1.1 Integração técnica com análise de traços (assertividade)

| Aspecto | Traços (fotos) | Diagnóstico emocional (30 itens) |
|---------|----------------|-----------------------------------|
| Natureza do dado | Observável, instantâneo, dependente de qualidade de imagem | Declarativo, passado + presente + consciência |
| Risco | Empate entre estruturas; ruído de pose/ângulo | Viés de autopercepção ou desejo social |
| Papel na fusão | Base biométrica/visão | **Prior** ou **peso** nas decisões empatadas; ajuste fino de linguagem (ex.: quando “retenção” no questionário alinha com padrão oral/rígido na foto) |

**Entregáveis de integração (para dev):**

1. **Contrato de dados:** após persistir o resultado do diagnóstico, expor ao pipeline de traços um resumo versionado (ex.: percentuais por padrão interno mapeável a famílias de estrutura, tag de evolução, `mediaConsciencia`). *O mapeamento exato traço ↔ padrão emocional interno deve ser definido em tabela de configuração versionada, não hardcoded em copy.*
2. **Momento na jornada:** fluxo recomendado — **diagnóstico emocional antes ou logo após cadastro de fotos**, para que a análise de traços possa consumir o JSON na mesma sessão ou na próxima reanálise.
3. **API / servidor:** implementado em `POST /api/traco/analisar` com corpo opcional `diagnosticoEmocional` — biblioteca `@workspace/traco-diagnostico-fusion` (`aplicarFusaoTracoDiagnostico`). Persiste `estruturas` já **fusionadas**, `estruturasSomenteFotos`, `sinteseIntegradaFotosQuestionario`, `fusaoDiagnosticoEmocional` (alinhamento, assertividade, sinais). Sem o questionário, o comportamento permanece só-fotos (regressão zero).
4. **UX:** na tela de resultado do traço, mencionar quando a leitura foi **refinada com o diagnóstico** (transparência sem expor nomes internos das perguntas).

**O que não fazer:** substituir a análise visual pelo questionário; tratar o conjunto como diagnóstico clínico.

---

## 2. Fluxo do usuário (15+)

1. Introdução (copy + CTA “Começar”).
2. Questionário: **1 pergunta por tela**, barra **n/30**, opcional “~3 min”.
3. Processamento (cliente ou servidor; hoje recomendado: **calcular no cliente** e enviar JSON validado ao backend).
4. Resultado: blocos 1–5 (ver secção 6 do produto) + tag de evolução.

**Regras de UX**

- Todas as respostas obrigatórias antes de concluir.
- **Não** exibir nomes dos padrões internos durante o questionário.
- Resposta em **um toque** por subpergunta (passado / presente / consciência).
- Armazenar respostas + resultado + `criadoEm` para histórico e **reavaliação após X dias** (configurável, ex.: 90).

---

## 3. Estrutura das perguntas (15+)

### 3.1 Perguntas 1–25 (duas respostas cada)

- **Passado (antes):** escala A–E → valores 1–5 (Nunca … Extremamente).
- **Presente (hoje):** escala A–E → valores 1–5 (Não é mais assim … Muito forte ainda).

Textos exatos das perguntas: ver constante `PERGUNTAS_EMOCIONAIS` no engine.

### 3.2 Perguntas 26–30 (uma resposta cada)

- Escala consciência A–E → 1–5 (Nada … Muito).

---

## 4. Mapeamento interno (não mostrar ao usuário)

| Padrão interno | IDs das perguntas |
|----------------|-------------------|
| vínculo | 1, 4, 8, 12, 16 |
| controle | 2, 5, 13, 18, 22 |
| estratégia | 3, 6, 10, 14, 20 |
| retenção | 7, 9, 11, 17, 21 |
| desconexão | 15, 19, 23, 24, 25 |

---

## 5. Lógica de processamento (15+) — resumo

A implementar no cliente/serviço do questionário (ex.: `computeDiagnosticoEmocional15Plus()`); a **fusão com traço** já está no servidor (secção 7.2.1):

1. Para cada padrão `g`, `S_pass(g)` = soma das respostas **passado** nas perguntas do grupo (máx. 25).  
   `S_pres(g)` = soma das respostas **presente** (máx. 25).
2. `raw(g) = 0.6 * (S_pass/25) + 0.4 * (S_pres/25)` → valor em [0, 1].
3. **Consciência:** `mediaConsciencia` = média das respostas 26–30 (1–5).  
   **Fator de compressão:** mais consciência **suaviza** dispersão entre padrões (efeito “reduz impacto” de picos isolados sem inventar dados).
4. **Percentuais:** normalizar `adjusted` para somar **100%** (arredondamento com correção no maior padrão).
5. **Níveis** “baixo / médio / alto” (atual e evolução): derivados do padrão dominante e da média de consciência (ver tipos exportados).
6. **Tag:** 🔴 Inconsciente / 🟡 Em processo / 🟢 Integrado — regras no engine (ajustáveis com produto).

Textos dos blocos 1–5 são **gerados** a partir dos dois padrões mais altos e da tag (templates), não copy fixa única para todos.

---

## 6. Faixas etárias (produto)

| Faixa | Input | Saída esperada (nomenclatura) |
|-------|--------|--------------------------------|
| 4–7 | Responsável | “Tendências comportamentais observadas” — **não** “diagnóstico”. |
| 8–11 | Criança + opcional responsável | Padrões leves; evitar “infância” distante. |
| 12–14 | Autoavaliação | Peso maior no **presente** no cálculo (parametrizável). |
| 15+ | Modelo completo | Este documento + engine atual. |

**Recomendações de idade (produto):** mínimo com validade ~8 anos (limitado); autoavaliação “plena” ~12+; modelo completo passado+presente **15+** (implementado no engine).

---

## 7. Implementação técnica — checklist

### 7.1 Banco de dados (pendente)

- Tabela sugerida: `diagnostico_emocional`  
  - `id`, `usuario_id`, `versao_modelo` (ex.: `15plus_v1`), `faixa` (`4-7` | …), `respostas` (JSONB), `resultado` (JSONB), `criado_em`.  
- Índice `(usuario_id, criado_em desc)` para histórico e regra “reavaliar após X dias”.

### 7.2 API — diagnóstico persistido (pendente)

- `POST /api/diagnostico-emocional` — body: `{ faixa, respostas }` → valida → persiste → retorna resultado.  
- `GET /api/diagnostico-emocional/ultimo` — último resultado do usuário.  
- Opcional: `GET /api/diagnostico-emocional/historico`.

### 7.2.1 API — fusão com traço (**implementado**)

**Rota:** `POST /api/traco/analisar` (autenticado), além de `resultado` e `pessoaId`, aceita opcional:

```json
{
  "resultado": { "estruturas": { ... }, "estruturaPrincipal": "oral", "estruturaSecundaria": "rigido", "confiancaAnalise": 72, "...": "..." },
  "pessoaId": null,
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

- `padroesPct`: cinco chaves, **soma 100** (tolerância ±2,5 no servidor).  
- `mediaConsciencia`: 1 a 5.  
- `tagEvolucao`: `inconsciente` | `em_processo` | `integrado` (opcional).

**Resposta persistida em `analise_traco.resultado`:** percentuais em `estruturas` = **fusão**; cópia só-fotos em `estruturasSomenteFotos`; texto curto em `sinteseIntegradaFotosQuestionario`; objeto `fusaoDiagnosticoEmocional` com `alinhamentoFotosFormulario`, `assertividadeLeitura`, `pesoFormulario`, `sinaisConvergentes`, `entradaDiagnostico`, `versaoMatriz`.

**Frontend:** `TracodeCaraterPage` envia `diagnosticoEmocional` quando existir o JSON em `localStorage` sob a chave `luz_diagnostico_emocional_fusao` (útil para testes até o fluxo de 30 perguntas gravar o payload automaticamente).

### 7.3 Frontend (pendente)

- Rotas: `/diagnostico-emocional`, `/diagnostico-emocional/resultado` (ou query `?step=`).  
- Componentes: `Intro`, `Questionario`, `Processando`, `Resultado`.  
- Integração: link na **Jornada** e/ou **Quem sou eu**; após concluir, opcionalmente **substituir ou complementar** o bloco Fase 1 do dossiê com link “Ver diagnóstico completo”.  
- **Traços:** ao concluir ou atualizar o diagnóstico, disparar **reprocessamento opcional** da última análise de traços (ou marcar `pendenteEnriquecimento`) para aplicar `mergeTracoComDiagnosticoEmocional` (ver secção 1.1).

### 7.4 LGPD e menores

- Faixa 4–7: consentimento do responsável, linguagem e **retention** de dados conforme política.  
- Não usar rótulos clínicos fortes nas faixas infantis.

---

## 8. Alinhamento com o código atual

| Item | Estado |
|------|--------|
| `QuemSouEuPage` — bloco “Diagnóstico Emocional (Fase 1)” | Heurístico (idade + traço + roda); **não** substitui o questionário de 30. |
| `tracoAnalysis.ts` | Motor de traço **só pelas fotos** no cliente; o servidor **refina** percentuais quando recebe `diagnosticoEmocional`. |
| `@workspace/traco-diagnostico-fusion` | Matriz versionada `fusao_v1` + `aplicarFusaoTracoDiagnostico` + validação Zod. |
| `POST /api/traco/analisar` | Aplica fusão quando `diagnosticoEmocional` está presente e válido. |
| Motor do questionário 15+ (a criar) | Deve produzir `padroesPct` + `mediaConsciencia` + `tagEvolucao` no formato da secção 7.2.1 para alimentar `POST /traco/analisar`. |
| Persistência / fluxo 30 telas | **A implementar** conforme checklist acima. |

---

## 9. Próximos passos sugeridos (ordem)

1. ~~Fusão servidor~~ — **feito** (`traco-diagnostico-fusion` + `POST /traco/analisar`). Próximo: testes automatizados e calibragem clínica da matriz (`VERSAO_MATRIZ`).  
2. Migrar schema + rotas + persistência do diagnóstico (30 itens) e preencher `diagnosticoEmocional` a partir do engine, sem `localStorage`.  
3. Implementar UI 15+ e **reanalisar traço** automaticamente ao concluir o questionário.  
4. Parametrizar `REAVALIACAO_DIAS`.  
5. Adicionar variantes 12–14 (pesos) e depois 8–11 / 4–7 (conteúdos + escalas separados).

---

*Última atualização: gerado para handoff de desenvolvimento.*
