import type { Eixo, ModeloMultimodalAnalise, ModeloMultimodalScores } from "./types";

const NOMES: Record<Eixo, string> = {
  controle: "controle",
  retracao: "retração",
  dependencia: "dependência",
  expansao: "expansão",
  rigidez: "rigidez",
};

export function gerarAnalisePorLimiares(
  scores: ModeloMultimodalScores,
  dominante: Eixo,
  secundario: Eixo,
  confianca: number
): ModeloMultimodalAnalise {
  const d = dominante;
  const s = secundario;
  const high = (e: Eixo) => scores[e] >= 68;
  const mid = (e: Eixo) => scores[e] >= 48 && scores[e] < 68;

  let emocional = `O eixo mais marcante hoje é **${NOMES[d]}** (${scores[d]}%), com **${NOMES[s]}** como segundo vetor (${scores[s]}%). `;
  if (high(d)) {
    emocional += `Isto sugere um padrão emocional intenso nessa dimensão — não é “bom ou ruim”, é sinal de onde o sistema coloca mais energia de regulação. `;
  } else if (mid(d)) {
    emocional += `Os níveis são moderados: há presença clara do eixo, mas com espaço para contexto e variação ao longo do tempo. `;
  } else {
    emocional += `Os valores estão mais contidos; o perfil tende a ser mais equilibrado nesta escala, com nuances no eixo secundário. `;
  }
  if (confianca >= 0.72) {
    emocional += "A leitura combinada (imagem + questionário) está **coerente** — o que o corpo sugere e o que você relata caminham na mesma direção.";
  } else if (confianca >= 0.48) {
    emocional += "Há **concordância parcial** entre imagem e questionário: vale explorar em que contextos cada fonte “puxa” mais.";
  } else {
    emocional += "Há **divergência** entre as duas fontes; o resultado integra ambas sem forçar um único extremo — útil como mapa de exploracao, não como rótulo fechado.";
  }

  let comportamental = "";
  if (scores.controle >= 62 || scores.rigidez >= 62) {
    comportamental +=
      "No comportamento, tende a haver organização, antecipação e gestão de incerteza — com custo possível de rigidez ou autocrítica quando a carga sobe. ";
  }
  if (scores.retracao >= 58) {
    comportamental +=
      "Pode aparecer proteção (recuar, adiar exposição ou conflito) como estratégia de segurança — eficaz no curto prazo e exigente no longo. ";
  }
  if (scores.expansao >= 58) {
    comportamental +=
      "Há recursos de expansão (ocupar espaço, movimento, expressão) — potencial de integração quando acolhidos com consistência. ";
  }
  if (!comportamental.trim()) {
    comportamental =
      "O perfil comportamental sugere flexibilidade relativa entre eixos; o autoconhecimento prático pode focar em hábitos pequenos e repetíveis, mais do que em ‘mudança grande’ de uma vez.";
  }

  let relacional = "";
  if (scores.dependencia >= 58) {
    relacional +=
      "Em vínculos, pode surgir sensibilidade a aprovação, evitar tensão ou dizer ‘sim’ além do conforto — útil observar limites e negociação de proximidade. ";
  }
  if (scores.controle >= 58 && scores.dependencia < 55) {
    relacional +=
      "Também pode haver postura mais ‘autossuficiente’ na relação — convida a integrar pedido de ajuda e vulnerabilidade sem perder direção. ";
  }
  if (!relacional.trim()) {
    relacional =
      "Nas relações, o padrão tende a ser mais contextual; o melhor próximo passo costuma ser comunicação clara sobre necessidades — sem suposição de leitura automática do outro.";
  }

  return {
    emocional: emocional.replace(/\*\*/g, ""),
    comportamental: comportamental.trim(),
    relacional: relacional.trim(),
  };
}
