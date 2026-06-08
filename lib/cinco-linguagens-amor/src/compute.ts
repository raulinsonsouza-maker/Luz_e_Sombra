import { PARES_EXPRESSAR, PARES_RECEBER } from "./perguntas/index.js";
import { montarNarrativaV2 } from "./narrativa/gerar.js";
import { montarDimensaoPerfil } from "./scoring/ranking.js";
import { pontuarBloco } from "./scoring/pontuar.js";
import { calcularMetricas } from "./scoring/qualidade.js";
import type { EntradaLinguagensAmor, ResultadoLinguagensAmorComputado } from "./types.js";

const TOTAL_BLOCO = 15;

export function computarLinguagensAmor(entrada: EntradaLinguagensAmor): ResultadoLinguagensAmorComputado {
  const pontuacoesReceber = pontuarBloco(PARES_RECEBER, entrada.answers);
  const pontuacoesExpressar = pontuarBloco(PARES_EXPRESSAR, entrada.answers);

  const sumR = Object.values(pontuacoesReceber).reduce((a, b) => a + b, 0);
  const sumE = Object.values(pontuacoesExpressar).reduce((a, b) => a + b, 0);
  if (sumR !== TOTAL_BLOCO || sumE !== TOTAL_BLOCO) {
    throw new Error(`Pontuação interna inconsistente: receber=${sumR}, expressar=${sumE}, esperado ${TOTAL_BLOCO} cada`);
  }

  const receber = montarDimensaoPerfil(pontuacoesReceber, TOTAL_BLOCO);
  const expressar = montarDimensaoPerfil(pontuacoesExpressar, TOTAL_BLOCO);
  const metricas = calcularMetricas(
    receber,
    expressar,
    PARES_RECEBER,
    PARES_EXPRESSAR,
    entrada.answers,
    entrada.metadata?.tempo_total_segundos,
  );

  return montarNarrativaV2({ receber, expressar, metricas });
}
