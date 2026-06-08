import {
  normalizarPercentuaisInteiros,
  type PadraoEmocional,
  PADROES_EMOCIONAIS,
} from "@workspace/traco-diagnostico-fusion";
import { INDICES_LIBIDINAL_REICH, INDICES_POR_PADRAO } from "./perguntas";
import { z } from "zod";

export const VERSAO_DIAGNOSTICO30 = "diagnostico30_v1";

const respostas25Schema = z.array(z.number().int().min(1).max(5)).length(25);
const respostas5Schema = z.array(z.number().int().min(1).max(5)).length(5);

export const entradaDiagnostico30Schema = z.object({
  passado: respostas25Schema,
  presente: respostas25Schema,
  consciencia: respostas5Schema,
});

export type EntradaDiagnostico30 = z.infer<typeof entradaDiagnostico30Schema>;

export interface Diagnostico30Computado {
  versao: typeof VERSAO_DIAGNOSTICO30;
  /** Payload aceito por `diagnosticoEmocionalFusaoSchema` / `POST /traco/analisar`. */
  diagnosticoEmocional: {
    versao: typeof VERSAO_DIAGNOSTICO30;
    padroesPct: Record<PadraoEmocional, number>;
    mediaConsciencia: number;
    tagEvolucao: "inconsciente" | "em_processo" | "integrado";
  };
}

function mean(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function somaGrupo(arr: number[], indices: readonly number[]): number {
  let s = 0;
  for (const i of indices) s += arr[i] ?? 0;
  return s;
}

/**
 * A partir das 25 duplas + 5 consciência:
 * - raw por grupo = 0,6 * média(passado/5) + 0,4 * média(presente/5) no grupo (equivalente a somas/25 com pesos do doc)
 * - compressão com média de consciência (mais consciência → menos dispersão entre padrões)
 * - percentuais inteiras somando 100
 */
export function computarDiagnostico30(entrada: EntradaDiagnostico30): Diagnostico30Computado {
  const parsed = entradaDiagnostico30Schema.parse(entrada);
  const { passado, presente, consciencia } = parsed;

  const raw: Record<PadraoEmocional, number> = {} as Record<PadraoEmocional, number>;
  for (const p of PADROES_EMOCIONAIS) {
    const idx = INDICES_POR_PADRAO[p];
    const sp = somaGrupo(passado, idx);
    const sc = somaGrupo(presente, idx);
    raw[p] = 0.6 * (sp / 25) + 0.4 * (sc / 25);
  }

  const mediaConsciencia = Math.round(mean(consciencia) * 100) / 100;

  /** Mais consciência → puxa proporções para o centro (menos “pico” único). */
  const shrink = Math.min(1, Math.max(0.55, 1 - 0.14 * ((mediaConsciencia - 1) / 4)));
  const m = mean(PADROES_EMOCIONAIS.map((p) => raw[p]));
  const adjusted: Record<PadraoEmocional, number> = {} as Record<PadraoEmocional, number>;
  for (const p of PADROES_EMOCIONAIS) {
    adjusted[p] = Math.max(0.02, m + (raw[p] - m) * shrink);
  }

  const meanPresente = (indices: readonly number[]) =>
    indices.reduce((s, i) => s + (presente[i] ?? 0), 0) / indices.length;

  const libPrazer = meanPresente(INDICES_LIBIDINAL_REICH.prazerBloqueado);
  const libRendicao = meanPresente(INDICES_LIBIDINAL_REICH.rendicaoBloqueada);
  const libDissoc = meanPresente(INDICES_LIBIDINAL_REICH.dissociacaoSomática);

  if (libPrazer >= 3.2) {
    adjusted.retencao *= 1.08;
    adjusted.controle *= 1.03;
  }
  if (libRendicao >= 3.2) {
    adjusted.controle *= 1.1;
    adjusted.retencao *= 1.04;
  }
  if (libDissoc >= 3.2) {
    adjusted.desconexao *= 1.12;
  }

  const padroesPct = normalizarPercentuaisInteiros(adjusted);

  const sorted = [...PADROES_EMOCIONAIS].sort((a, b) => padroesPct[b] - padroesPct[a]);
  const top = padroesPct[sorted[0]!];
  const second = padroesPct[sorted[1]!];

  let tagEvolucao: "inconsciente" | "em_processo" | "integrado";
  if (mediaConsciencia >= 4 && top <= 34 && top - second <= 14) {
    tagEvolucao = "integrado";
  } else if (mediaConsciencia >= 3.6 && top - second <= 10) {
    tagEvolucao = "integrado";
  } else if (mediaConsciencia <= 2.25 && top >= 30) {
    tagEvolucao = "inconsciente";
  } else if (mediaConsciencia <= 2.5 && top >= 28 && top - second >= 6) {
    tagEvolucao = "inconsciente";
  } else {
    tagEvolucao = "em_processo";
  }

  return {
    versao: VERSAO_DIAGNOSTICO30,
    diagnosticoEmocional: {
      versao: VERSAO_DIAGNOSTICO30,
      padroesPct,
      mediaConsciencia,
      tagEvolucao,
    },
  };
}
