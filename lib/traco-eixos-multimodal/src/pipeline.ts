import type { MetricasResumo, ModeloMultimodalOutput } from "./types";
import { metricasResumoParaScores100, VERSAO_IMAGEM_EIXOS } from "./imagemParaEixos";
import { questionarioParaScores100 } from "./questionario20";
import { consistenciaLabel, dominanteSecundario, fusaoEixosMultimodal } from "./fusaoEixos";
import { gerarAnalisePorLimiares } from "./textoPorLimiares";
import { metricasResumoSchema, questionario20RespostasSchema } from "./schemas";

export const VERSAO_MODELO_MULTIMODAL = "multimodal_eixos_v1";

export interface ExecutarModeloMultimodalInput {
  metricasResumo: MetricasResumo;
  respostas20: number[];
  pesoImagem?: number;
  pesoQuestionario?: number;
}

export function executarModeloMultimodal(input: ExecutarModeloMultimodalInput): ModeloMultimodalOutput {
  const mr = metricasResumoSchema.parse(input.metricasResumo);
  const r20 = questionario20RespostasSchema.parse(input.respostas20);

  const scoresImagem = metricasResumoParaScores100(mr);
  const scoresQuestionario = questionarioParaScores100(r20);

  const fusao = fusaoEixosMultimodal({
    imagem: scoresImagem,
    questionario: scoresQuestionario,
    pesoImagem: input.pesoImagem,
    pesoQuestionario: input.pesoQuestionario,
  });

  const { dominante, secundario } = dominanteSecundario(fusao.scores);
  const consistencia = consistenciaLabel(fusao.confianca);
  const analise = gerarAnalisePorLimiares(fusao.scores, dominante, secundario, fusao.confianca);

  return {
    versaoModelo: `${VERSAO_MODELO_MULTIMODAL}+${VERSAO_IMAGEM_EIXOS}`,
    scores: fusao.scores,
    scoresImagem,
    scoresQuestionario,
    dominante,
    secundario,
    confianca: Math.round(fusao.confianca * 1000) / 1000,
    consistencia,
    deltasPorEixo: fusao.deltasPorEixo,
    analise,
    pesoImagem: fusao.pesoImagem,
    pesoQuestionario: fusao.pesoQuestionario,
  };
}
