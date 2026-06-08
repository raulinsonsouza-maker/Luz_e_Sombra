import { perguntasPorDimensao, type ItemPergunta } from "./perguntas";
import type { Dimensao, TemperamentoCodigo, TipoPerfil, QualityFlag, StatusResultado } from "./types";
import { TEMPERAMENTOS, DIMENSOES } from "./types";
import { desvioPadrao, proporcaoRespostas3, calcularAlertas, calcularConfiabilidade } from "./qualidade";
import {
  montarRelatorioInterno,
  montarNarrativaV3,
  arquetipoFrasePorTemperamento,
} from "./interpretacao";
import type { RelatorioInterno, NarrativaTemperamentoV3 } from "./interpretacao";
import type { EntradaTemperamento } from "./schemas";

const SOMA_PESOS_DIMENSAO = 3 * 1.2 + 5 * 1.0; // 8.6
const MIN_BRUTO = 1 * SOMA_PESOS_DIMENSAO;
const MAX_BRUTO = 5 * SOMA_PESOS_DIMENSAO;

const MATRIZ: Record<TemperamentoCodigo, Record<Dimensao, number>> = {
  COLERICO: { ENG: 0.3, SOC: 0.15, DOM: 0.35, EST: -0.1, PRO: 0.1 },
  SANGUINEO: { ENG: 0.3, SOC: 0.4, DOM: 0.1, EST: -0.1, PRO: -0.1 },
  MELANCOLICO: { ENG: -0.1, SOC: -0.1, DOM: 0.1, EST: 0.2, PRO: 0.4 },
  FLEUMATICO: { ENG: -0.2, SOC: -0.1, DOM: -0.1, EST: 0.4, PRO: 0.2 },
};

function valorUsado(resposta: number, item: ItemPergunta): number {
  const r = item.reversa ? 6 - resposta : resposta;
  return r;
}

function calcularScoreBrutoDimensao(
  dim: Dimensao,
  respostas: Record<string, number>,
): number {
  let total = 0;
  for (const p of perguntasPorDimensao(dim)) {
    total += valorUsado(respostas[p.codigo]!, p) * p.peso;
  }
  return total;
}

function normalizarDimensao(scoreBruto: number): number {
  const n = (scoreBruto - MIN_BRUTO) / (MAX_BRUTO - MIN_BRUTO);
  return Math.min(1, Math.max(0, n));
}

function projetarTemperamentos(norm: Record<Dimensao, number>): Record<TemperamentoCodigo, number> {
  const out = {} as Record<TemperamentoCodigo, number>;
  for (const t of TEMPERAMENTOS) {
    let s = 0;
    for (const d of DIMENSOES) {
      s += norm[d] * MATRIZ[t][d];
    }
    out[t] = s;
  }
  return out;
}

function normalizarTemperamentosPercentuais(
  scoresBrutos: Record<TemperamentoCodigo, number>,
): Record<TemperamentoCodigo, number> {
  const zerados = {} as Record<TemperamentoCodigo, number>;
  for (const t of TEMPERAMENTOS) {
    zerados[t] = Math.max(0, scoresBrutos[t]!);
  }
  const total = TEMPERAMENTOS.reduce((s, t) => s + zerados[t]!, 0);
  if (total === 0) {
    const u = 25.0;
    return {
      COLERICO: u,
      SANGUINEO: u,
      MELANCOLICO: u,
      FLEUMATICO: u,
    };
  }

  const pct = {} as Record<TemperamentoCodigo, number>;
  for (const t of TEMPERAMENTOS) {
    pct[t] = Math.round((zerados[t]! / total) * 1000) / 10;
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

function qualityFlagFromIVR_ITC(ivrLow: boolean, itcHigh: boolean): QualityFlag {
  if (ivrLow) return "LOW_VARIANCE";
  if (itcHigh) return "HIGH_CENTRAL_TENDENCY";
  return "OK";
}

export interface ResultadoTemperamentoComputado {
  status: StatusResultado;
  quality_flag: QualityFlag;
  alertas: import("./qualidade").AlertaQualidade[];
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
  const valores = DIMENSOES.flatMap((d) =>
    perguntasPorDimensao(d).map((p) => answers[p.codigo]!),
  );

  const dp = desvioPadrao(valores);
  const prop3 = proporcaoRespostas3(valores);
  const ivrLow = dp < 0.5;
  const itcHigh = prop3 > 0.7;
  const quality_flag = qualityFlagFromIVR_ITC(ivrLow, itcHigh);
  const status: StatusResultado =
    quality_flag === "OK" ? "success" : "low_quality";

  const dimensoes = {} as Record<Dimensao, { bruto: number; normalizado: number }>;
  for (const d of DIMENSOES) {
    const bruto = calcularScoreBrutoDimensao(d, answers);
    dimensoes[d] = { bruto, normalizado: normalizarDimensao(bruto) };
  }

  const norm = {} as Record<Dimensao, number>;
  for (const d of DIMENSOES) norm[d] = dimensoes[d]!.normalizado;

  const temperamentos_brutos = projetarTemperamentos(norm);
  const temperamentos_percentuais = normalizarTemperamentosPercentuais(temperamentos_brutos);
  const { tipo, primario, secundario } = classificarPerfil(temperamentos_percentuais);

  const ord = ordenarPercentuais(temperamentos_percentuais);
  const empateProximo = ord[0]![1] - ord[1]![1] < 2;

  const alertas = calcularAlertas(valores, metadata.tempo_total_segundos, norm);
  const confiabilidade = calcularConfiabilidade(valores, metadata.tempo_total_segundos);

  const { arquetipo, frase_sintese } = arquetipoFrasePorTemperamento(primario);

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
