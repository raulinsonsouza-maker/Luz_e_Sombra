# Traço de Caráter — pontuação e percentuais

## O que os percentuais significam

Os percentuais exibidos no mapa são a **distribuição relativa** entre os cinco padrões (Esquizóide, Oral, Psicopata, Masoquista, Rígido). Somam 100%.

Eles **não** significam:

- porcentagem da personalidade da pessoa;
- precisão psicológica ou “taxa de acerto”;
- diagnóstico clínico.

## Como a pontuação é composta

1. **Diagnóstico emocional** (questionário): respostas mapeiam pontos para cada traço.
2. **Fotos** (quando há): o motor de imagem estima contribuições por marcadores corporais/faciais.
3. **Fusão**: diagnóstico e fotos são combinados em `EstruturasPct` (ver `@workspace/traco-diagnostico-fusion` e `@workspace/traco-imagem-engine`).

A jornada narrativa (`comporJornadaTraco`) lê esses percentuais e monta o texto a partir de `PerfilTraco` + `CombinacaoTrio`. A aparência corporal **não** é usada para inferir psicologia na prosa da jornada.

## Top 3

- **Principal**: maior percentual.
- **Secundário**: segundo maior.
- **Terciário**: terceiro maior.

Empates: a ordenação estável do ranking define a ordem; a prosa trata o resultado como interpretativo, não causal.

## Resultados próximos

Diferenças pequenas entre o 2º e o 3º (ou entre o 1º e o 2º) devem ser lidas como **composição**, não como hierarquia rígida. A etapa 7 deixa isso explícito.

## Questionários incompletos

Respostas faltantes reduzem a confiança da fusão; o produto deve orientar a completar o diagnóstico antes de gerar a análise. Não inventar percentuais.

## Versão narrativa

O campo `versaoNarrativa` (ex.: `traco_narrativa_v8`) indica o pacote de textos. Resultados salvos antigos podem mostrar um aviso e ainda assim renderizar a prosa atual via `comporJornadaTraco` ao vivo.
