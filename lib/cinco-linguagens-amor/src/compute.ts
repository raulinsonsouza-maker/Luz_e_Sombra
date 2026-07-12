import {
  CODIGOS_EXPRESSAR,
  CODIGOS_RECEBER,
  PARES_EXPRESSAR,
  PARES_RECEBER,
  paresDesempatePara,
} from "./perguntas/index.js";
import { montarNarrativaV3 } from "./narrativa/blocos.js";
import { montarDimensaoPerfil, normalizarDistribuicao } from "./scoring/ranking.js";
import { calcularMetricas } from "./scoring/qualidade.js";
import { mesclarPontuacoes, pontuarBloco } from "./scoring/pontuar.js";
import type {
  AvaliacaoDesempate,
  EntradaLinguagensAmor,
  LadoEscolha,
  LinguagemAmor,
  ResultadoLinguagensAmorComputado,
} from "./types.js";

const TOTAL_CORE = CODIGOS_RECEBER.length;

function paresDesempateUsados(answers: Record<string, LadoEscolha>): ReturnType<typeof paresDesempatePara> {
  const ids = Object.keys(answers).filter((k) => k.startsWith("D"));
  if (ids.length === 0) return [];
  const receber = montarDimensaoPerfil(pontuarBloco(PARES_RECEBER, answers), TOTAL_CORE);
  return paresDesempatePara(receber.principal, receber.secundaria).filter((p) => answers[p.id] !== undefined);
}

function temExpressar(answers: Record<string, LadoEscolha>): boolean {
  return CODIGOS_EXPRESSAR.every((id) => answers[id] !== undefined);
}

export function avaliarNecessidadeDesempate(
  answers: Record<string, LadoEscolha>,
): AvaliacaoDesempate | null {
  const faltam = CODIGOS_RECEBER.some((id) => answers[id] === undefined);
  if (faltam) return null;

  const receber = montarDimensaoPerfil(pontuarBloco(PARES_RECEBER, answers), TOTAL_CORE);
  const gap = (receber.ranking[0]?.pontos ?? 0) - (receber.ranking[1]?.pontos ?? 0);
  const spread =
    (receber.ranking[0]?.pontos ?? 0) - (receber.ranking[4]?.pontos ?? 0);
  const necessario = gap <= 1 || spread < 4;

  if (!necessario) return null;

  return {
    necessario: true,
    linguagemA: receber.principal,
    linguagemB: receber.secundaria,
    gap,
    confianca: gap <= 1 ? 55 : 65,
  };
}

export function computarLinguagensAmor(entrada: EntradaLinguagensAmor): ResultadoLinguagensAmorComputado {
  const { answers } = entrada;

  const pontCore = pontuarBloco(PARES_RECEBER, answers);
  const paresDesempate = paresDesempateUsados(answers);
  const pontDesempate = paresDesempate.length > 0 ? pontuarBloco(paresDesempate, answers) : null;
  const pontReceber = pontDesempate ? mesclarPontuacoes(pontCore, pontDesempate) : pontCore;

  const totalReceber = TOTAL_CORE + (pontDesempate ? paresDesempate.length : 0);
  const receber = montarDimensaoPerfil(pontReceber, totalReceber);

  const expressarCompleto = temExpressar(answers);
  let expressar = receber;
  if (expressarCompleto) {
    const pontExp = pontuarBloco(PARES_EXPRESSAR, answers);
    expressar = montarDimensaoPerfil(pontExp, PARES_EXPRESSAR.length);
  }

  const sumR = Object.values(pontReceber).reduce((a, b) => a + b, 0);
  if (sumR !== totalReceber) {
    throw new Error(`Pontuação receber inconsistente: ${sumR}, esperado ${totalReceber}`);
  }

  const metricas = calcularMetricas({
    receber,
    expressar,
    paresReceber: [...PARES_RECEBER, ...paresDesempate],
    paresExpressar: expressarCompleto ? PARES_EXPRESSAR : [],
    answers,
    tempoTotalSegundos: entrada.metadata?.tempo_total_segundos,
    desempateUsado: paresDesempate.length > 0,
  });

  const { desalinhamento, ...narrativa } = montarNarrativaV3({
    receber,
    expressar,
    metricas,
    expressarCompleto,
  });

  const distribuicao = normalizarDistribuicao(receber.ranking);

  return {
    versao: "linguagens_amor_v3",
    receber,
    expressar,
    expressarCompleto,
    desalinhamento,
    metricas,
    narrativa,
    distribuicao,
    perfilEquilibrado: metricas.perfilEquilibradoReceber,
    principal: receber.principal,
    secundaria: receber.secundaria,
    pontuacoes: receber.pontuacoes,
    ranking: distribuicao,
  };
}

export function paresDesempateParaPerfil(
  langA: LinguagemAmor,
  langB: LinguagemAmor,
) {
  return paresDesempatePara(langA, langB);
}
