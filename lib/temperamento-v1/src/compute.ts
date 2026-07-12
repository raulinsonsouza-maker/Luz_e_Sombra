import { TOTAL_ITENS } from "./itens";
import type { Dimensao, TemperamentoCodigo, TipoPerfil, QualityFlag, StatusResultado } from "./types";
import type { AlertaQualidade } from "./qualidade";
import { calcularAlertasV3, calcularConfiabilidadeV3 } from "./qualidadeV3";
import { pontuarEysenck } from "./pontuarEysenck";
import {
  arquetipoFrasePorTemperamento,
  tituloPerfilTemperamento,
  montarRelatorioInterno,
} from "./interpretacao";
import type { RelatorioInterno } from "./interpretacao";
import { montarNarrativaV4, type NarrativaTemperamentoV4 } from "./narrativaV4";
import type { EntradaTemperamento } from "./schemas";

function qualityFlagFromAlertas(alertas: AlertaQualidade[]): QualityFlag {
  if (alertas.includes("HIGH_VARIANCE")) return "HIGH_CENTRAL_TENDENCY";
  if (alertas.includes("EXTREME_PROFILE")) return "LOW_VARIANCE";
  return "OK";
}

export interface ResultadoTemperamentoComputado {
  status: StatusResultado;
  quality_flag: QualityFlag;
  alertas: AlertaQualidade[];
  confiabilidade: number;
  empateProximo: boolean;
  scores: {
    dimensoes: Record<Dimensao, { bruto: number; normalizado: number }>;
    temperamentos_brutos: Record<TemperamentoCodigo, number>;
    temperamentos_percentuais: Record<TemperamentoCodigo, number>;
    scoreE: number;
    scoreN: number;
    estabilidadeEmocional: number;
  };
  perfil: {
    tipo: TipoPerfil;
    primario: TemperamentoCodigo;
    secundario: TemperamentoCodigo;
    arquetipo: string;
    frase_sintese: string;
  };
  relatorio_vars: Record<string, string | number>;
  relatorioInterno: RelatorioInterno;
  versaoNarrativa: "temperamento_v4";
  sinteseHumana: string;
  portraitIdentidade: string;
  seuDom: string;
  pontoCego: string;
  comboNarrativa?: string;
  tracosMarcantes: string[];
  passoPratico: string;
  dimensoesLegiveis: NarrativaTemperamentoV4["dimensoesLegiveis"];
  perguntaCrescimento: string;
  insightsDimensao: string[];
  combo?: NarrativaTemperamentoV4["combo"];
  analiseAprofundada: NarrativaTemperamentoV4["analiseAprofundada"];
}

export function computarTemperamento(entrada: EntradaTemperamento): ResultadoTemperamentoComputado {
  const { answers, metadata } = entrada;

  const eysenck = pontuarEysenck(answers);
  const {
    scoreE,
    scoreN,
    primario,
    secundario,
    tipo,
    empateProximo,
    dimensoes,
    temperamentos_brutos,
    temperamentos_percentuais,
  } = eysenck;

  const answered = Object.keys(answers).length;
  if (answered !== TOTAL_ITENS) {
    throw new Error(`Respostas incompletas: ${answered} de ${TOTAL_ITENS}`);
  }

  const alertas = calcularAlertasV3(answers, scoreE, scoreN, metadata.tempo_total_segundos);
  const quality_flag = qualityFlagFromAlertas(alertas);
  const status: StatusResultado = quality_flag === "OK" ? "success" : "low_quality";
  const confiabilidade = calcularConfiabilidadeV3(answers, scoreE, scoreN, metadata.tempo_total_segundos);

  const norm = {} as Record<Dimensao, number>;
  for (const d of Object.keys(dimensoes) as Dimensao[]) {
    norm[d] = dimensoes[d]!.normalizado;
  }

  const estabilidadeEmocional = Math.round(100 - scoreN);
  const { frase_sintese } = arquetipoFrasePorTemperamento(primario);
  const arquetipo = tituloPerfilTemperamento(primario, secundario, tipo);

  const relatorio_vars: Record<string, string | number> = {
    primario,
    secundario,
    perc_primario: temperamentos_percentuais[primario]!,
    perc_secundario: temperamentos_percentuais[secundario]!,
    tipo_perfil: tipo,
    score_E: scoreE,
    score_N: scoreN,
    estabilidade_emocional: estabilidadeEmocional,
    score_ENG: norm.ENG,
    score_SOC: norm.SOC,
    score_DOM: norm.DOM,
    score_EST: norm.EST,
    score_PRO: norm.PRO,
    quality_flag,
    arquetipo,
    frase_sintese,
  };

  const relatorioInterno = montarRelatorioInterno({
    tipo,
    primario,
    secundario,
    temperamentos_percentuais,
    norm,
    empateProximo,
    arquetipo,
    frase_sintese,
  });

  const narrativa = montarNarrativaV4({
    tipo,
    primario,
    secundario,
    temperamentos_percentuais,
    norm,
    empateProximo,
    frase_sintese,
    scoreE,
    scoreN,
  });

  return {
    status,
    quality_flag,
    alertas,
    confiabilidade,
    empateProximo,
    scores: {
      dimensoes,
      temperamentos_brutos,
      temperamentos_percentuais,
      scoreE,
      scoreN,
      estabilidadeEmocional,
    },
    perfil: {
      tipo,
      primario,
      secundario,
      arquetipo,
      frase_sintese,
    },
    relatorio_vars,
    relatorioInterno,
    versaoNarrativa: narrativa.versaoNarrativa,
    sinteseHumana: narrativa.sinteseHumana,
    portraitIdentidade: narrativa.portraitIdentidade,
    seuDom: narrativa.seuDom,
    pontoCego: narrativa.pontoCego,
    comboNarrativa: narrativa.comboNarrativa,
    tracosMarcantes: narrativa.tracosMarcantes,
    passoPratico: narrativa.passoPratico,
    dimensoesLegiveis: narrativa.dimensoesLegiveis,
    perguntaCrescimento: narrativa.perguntaCrescimento,
    insightsDimensao: narrativa.insightsDimensao,
    combo: narrativa.combo,
    analiseAprofundada: narrativa.analiseAprofundada,
  };
}
