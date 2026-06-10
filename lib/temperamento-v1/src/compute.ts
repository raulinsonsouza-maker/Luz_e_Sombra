import { PARES_FORCADOS, TOTAL_PARES } from "./pares";
import type { Dimensao, TemperamentoCodigo, TipoPerfil, QualityFlag, StatusResultado } from "./types";
import { TEMPERAMENTOS } from "./types";
import type { AlertaQualidade } from "./qualidade";
import { calcularAlertasV2, calcularConfiabilidadeV2 } from "./qualidadeV2";
import { pontuarPares, dimensoesFromVotos } from "./pontuar";
import {
  montarRelatorioInterno,
  montarNarrativaV3,
  arquetipoFrasePorTemperamento,
  tituloPerfilTemperamento,
} from "./interpretacao";
import type { RelatorioInterno, NarrativaTemperamentoV3 } from "./interpretacao";
import type { EntradaTemperamento } from "./schemas";

function normalizarTemperamentosPercentuais(
  votos: Record<TemperamentoCodigo, number>,
): Record<TemperamentoCodigo, number> {
  const total = TEMPERAMENTOS.reduce((s, t) => s + votos[t]!, 0);
  if (total === 0) {
    return { COLERICO: 25, SANGUINEO: 25, MELANCOLICO: 25, FLEUMATICO: 25 };
  }
  const pct = {} as Record<TemperamentoCodigo, number>;
  for (const t of TEMPERAMENTOS) {
    pct[t] = Math.round((votos[t]! / total) * 1000) / 10;
  }
  const sumPct = TEMPERAMENTOS.reduce((s, t) => s + pct[t]!, 0);
  const diff = Math.round((100 - sumPct) * 10) / 10;
  let maiorT: TemperamentoCodigo = "COLERICO";
  let maiorV = -1;
  for (const t of TEMPERAMENTOS) {
    if (pct[t]! > maiorV) {
      maiorV = pct[t]!;
      maiorT = t;
    }
  }
  pct[maiorT] = Math.round((pct[maiorT]! + diff) * 10) / 10;
  return pct;
}

function ordenarPercentuais(
  pct: Record<TemperamentoCodigo, number>,
): [TemperamentoCodigo, number][] {
  return [...TEMPERAMENTOS]
    .map((t) => [t, pct[t]!] as [TemperamentoCodigo, number])
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return TEMPERAMENTOS.indexOf(a[0]) - TEMPERAMENTOS.indexOf(b[0]);
    });
}

function classificarPerfil(
  pct: Record<TemperamentoCodigo, number>,
): { tipo: TipoPerfil; primario: TemperamentoCodigo; secundario: TemperamentoCodigo } {
  const ord = ordenarPercentuais(pct);
  const prim = ord[0]!;
  const sec = ord[1]!;
  const pv = prim[1];
  const sv = sec[1];

  let tipo: TipoPerfil;
  if (pv > 70) tipo = "ATIPICO";
  else if (pv > 50) tipo = "DOMINANTE";
  else if (pv > 35 && sv > 25) tipo = "DUPLO";
  else tipo = "MISTO";

  return { tipo, primario: prim[0], secundario: sec[0] };
}

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
  versaoNarrativa: "temperamento_v3";
  sinteseHumana: string;
  portraitIdentidade: string;
  noDiaADia: string;
  seuDom: string;
  pontoCego: string;
  comboNarrativa?: string;
  tracosMarcantes: string[];
  passoPratico: string;
  dimensoesLegiveis: NarrativaTemperamentoV3["dimensoesLegiveis"];
  perguntaCrescimento: string;
  insightsDimensao: string[];
  combo?: NarrativaTemperamentoV3["combo"];
}

export function computarTemperamento(entrada: EntradaTemperamento): ResultadoTemperamentoComputado {
  const { answers, metadata } = entrada;

  const votos = pontuarPares(PARES_FORCADOS, answers);
  const sumVotos = TEMPERAMENTOS.reduce((s, t) => s + votos[t]!, 0);
  if (sumVotos !== TOTAL_PARES) {
    throw new Error(`Pontuação interna inconsistente: ${sumVotos} votos, esperado ${TOTAL_PARES}`);
  }

  const alertas = calcularAlertasV2(PARES_FORCADOS, answers, votos, metadata.tempo_total_segundos);
  const quality_flag = qualityFlagFromAlertas(alertas);
  const status: StatusResultado = quality_flag === "OK" ? "success" : "low_quality";
  const confiabilidade = calcularConfiabilidadeV2(
    PARES_FORCADOS,
    answers,
    votos,
    metadata.tempo_total_segundos,
  );

  const dimensoes = dimensoesFromVotos(votos, TOTAL_PARES);
  const norm = {} as Record<Dimensao, number>;
  for (const d of Object.keys(dimensoes) as Dimensao[]) {
    norm[d] = dimensoes[d]!.normalizado;
  }

  const temperamentos_brutos = { ...votos };
  const temperamentos_percentuais = normalizarTemperamentosPercentuais(votos);
  const { tipo, primario, secundario } = classificarPerfil(temperamentos_percentuais);

  const ord = ordenarPercentuais(temperamentos_percentuais);
  const empateProximo = ord[0]![1] - ord[1]![1] < 2;

  const { frase_sintese } = arquetipoFrasePorTemperamento(primario);
  const arquetipo = tituloPerfilTemperamento(primario, secundario, tipo);

  const relatorio_vars: Record<string, string | number> = {
    primario,
    secundario,
    perc_primario: temperamentos_percentuais[primario]!,
    perc_secundario: temperamentos_percentuais[secundario]!,
    tipo_perfil: tipo,
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

  const narrativa = montarNarrativaV3({
    tipo,
    primario,
    secundario,
    temperamentos_percentuais,
    norm,
    empateProximo,
    frase_sintese,
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
    noDiaADia: narrativa.noDiaADia,
    seuDom: narrativa.seuDom,
    pontoCego: narrativa.pontoCego,
    comboNarrativa: narrativa.comboNarrativa,
    tracosMarcantes: narrativa.tracosMarcantes,
    passoPratico: narrativa.passoPratico,
    dimensoesLegiveis: narrativa.dimensoesLegiveis,
    perguntaCrescimento: narrativa.perguntaCrescimento,
    insightsDimensao: narrativa.insightsDimensao,
    combo: narrativa.combo,
  };
}
