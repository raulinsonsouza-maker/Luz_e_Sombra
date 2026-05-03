# Modelo multimodal por eixos (imagem + questionário)

Este documento descreve o modelo **operacional** implementado no monorepo: cinco eixos, vinte perguntas, fusão com pesos explícitos e métrica de confiança **sem** colapsar scores quando há divergência.

---

## 1. Pacote

- **`@workspace/traco-eixos-multimodal`** (`lib/traco-eixos-multimodal/`)
  - `questionario20.ts` — textos, itens invertidos, médias por eixo, normalização 0–100.
  - `imagemParaEixos.ts` — `imagem_eixos_v1`: proxies a partir de `MetricasResumo` (silhueta/postura).
  - `fusaoEixos.ts` — blend linear; `confianca` e deltas são **metadados** (não multiplicam o score final).
  - `textoPorLimiares.ts` — `analise.emocional` / `comportamental` / `relacional`.
  - `pipeline.ts` — `executarModeloMultimodal`.
  - `schemas.ts` — Zod (`metricasResumo`, `questionario20`).

---

## 2. Eixos

`controle` · `retracao` · `dependencia` · `expansao` · `rigidez`

---

## 3. Questionário (20 itens, escala 1–5)

Textos e índices: ver `PERGUNTAS_EIXOS_20` no código.

Mapeamento (médias em escala normalizada 0–1 antes de ×100):

| Eixo | Perguntas (1-based) | Notas |
|------|---------------------|--------|
| controle | 8, 11, 12, 17 | — |
| retracao | 3, 4, 5, 20 | — |
| dependencia | 15, 16, 18 | — |
| expansao | 7, 14, 19 | invertidas |
| rigidez | 2, 9, 10, 13 | — |

Invertida: contribuição usa `6 - valor` antes de normalizar.

---

## 4. Imagem (`metricas_resumo_v1`)

O cliente (`tracoAnalysis.ts`) envia **`metricasResumo`** no `resultado`: uma entrada por foto medida + `agregado` (médias de `shr`, `whr`, `symm`, `forwardLean`, `edgeDensityBody`, `chestExpansionProxy`, `pernasMedio`, etc.).

**Limitação:** não há `jaw_tension` nem `gaze_focus` reais; `imagem_eixos_v1` usa **proxies** derivados desses números. Evolução futura: `imagem_eixos_v2` com landmarks (ex. face mesh).

---

## 5. Fusão

- Padrão: **60%** imagem, **40%** questionário (normalizados para somarem 1 se o cliente enviar outros pesos).
- `score_eixo = pesoImagem * scoreImagem + pesoQuestionario * scoreQuestionario` (0–100 por eixo).
- `confianca` ∈ [0,1]: combinação de `1 - média(delta)` e similaridade do cosseno entre os dois vetores de eixos.
- `consistencia`: `alta` | `media` | `baixa` (limiares no código).

---

## 6. API

**`POST /api/traco/analisar`**

- Corpo opcional: `questionario20`: `number[20]` ou `{ respostas: number[] }`.
- O `resultado` **deve** incluir `metricasResumo` (gerado pelo cliente após `analyzeTracoDeCarater`) quando `questionario20` é enviado.
- Resposta persistida: `resultado.modeloMultimodal` (objeto retornado por `executarModeloMultimodal`).

**Compatibilidade:** se `questionario20` for válido, a API **não** aplica a fusão legada `diagnosticoEmocional` (5 padrões) sobre `estruturas`, para evitar dupla alteração. Sem `questionario20`, o comportamento da fusão legada mantém-se.

---

## 7. Frontend

- **`/traco-de-carater`** redireciona para **`/diagnostico-eixos`** se ainda não existirem 20 respostas válidas em `localStorage` — o questionário é **obrigatório** e é o **passo 1** da análise de traço; as fotos são o **passo 2**.
- Rota **`/diagnostico-eixos`**: uma pergunta por ecrã; ao responder a **última** pergunta, grava `luz_questionario_20_respostas` e navega automaticamente para `/traco-de-carater`.
- Ao gravar a análise com sucesso, o cliente remove a chave do `localStorage` (próxima visita ao traço volta a exigir o questionário).

---

## 8. Relação com a spec de 30 perguntas

O documento `DIAGNOSTICO_EMOCIONAL_ESPECIFICACAO.md` descreve um modelo **mais longo** (30 itens, passado/presente). O **modelo de eixos de 20 itens** é a fonte de verdade **implementada** para multimodal + API; o modelo de 30 permanece como referência de produto até eventual convergência ou substituição explícita.
