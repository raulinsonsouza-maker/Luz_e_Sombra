import type { EstruturaTraco, MarcadoresAgregados, MarcadoresFoto } from "./types.js";

export const VERSAO_EIXOS_REICH = "eixos_v2";

export interface EixosReich {
  indiceExpansao: number;
  indiceRetracao: number;
  indiceContencao: number;
  indiceCompressao: number;
  indiceFragmentacao: number;
}

/** Couraça segmental Reich/Lowen (tensão 0–1 por região). */
export interface SegmentosReich {
  ocular: number;
  oral: number;
  cervical: number;
  toracico: number;
  diafragmatico: number;
  abdominal: number;
  pelvico: number;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function band(v: number | null, min: number, max: number): number {
  if (v === null || !Number.isFinite(v)) return 0;
  if (max <= min) return 0;
  return clamp01((v - min) / (max - min));
}

/** Proxies Reich/Lowen a partir de marcadores agregados (corpo + rosto opcional). */
export function calcularEixosReich(
  ag: MarcadoresAgregados,
  rosto?: MarcadoresFoto | null
): EixosReich {
  const shr = ag.shrMedio;
  const symm = ag.simetriaMedia;
  const def = ag.definicaoMedia;
  const lean = ag.inclinacaoMedia;
  const chest = ag.projecaoPeitoMedia;
  const cran = ag.projecaoCranianaMedia;
  const ombros = ag.ombrosAdiantadosMedio;
  const colapso = ag.colapsoToracicoMedio;
  const wsr = ag.wsrMedio;
  const ulr = ag.ulrMedio;
  const dens = ag.densidadeMedia;

  const proxyChestExpansion = clamp01(
    (chest !== null && chest > 0 ? band(chest, 0.02, 0.08) : 0) * 0.5 +
      (shr !== null && shr > 1.08 ? band(shr, 1.08, 1.42) : 0) * 0.5
  );

  const indiceExpansao = clamp01(
    0.35 * proxyChestExpansion +
      0.35 * (lean !== null && lean > 0.03 ? band(lean, 0.03, 0.14) : 0) +
      0.3 * (ulr !== null && ulr > 1.12 ? band(ulr, 1.12, 1.35) : 0)
  );

  const indiceRetracao = clamp01(
    0.3 * (ombros !== null ? band(ombros, 0.04, 0.14) : 0) +
      0.35 * (colapso !== null ? band(colapso, 0.42, 0.72) : 0) +
      0.35 * (cran !== null ? band(cran, 0.04, 0.18) : 0)
  );

  const omrEquilibrado =
    shr !== null && shr >= 0.92 && shr <= 1.25
      ? 1
      : shr !== null && shr >= 0.88 && shr <= 1.32
        ? 0.65
        : 0;

  const indiceContencao = clamp01(
    0.3 * (symm !== null && symm > 0.86 ? band(symm, 0.86, 0.97) : 0) +
      0.25 * (def !== null && def > 0.2 ? band(def, 0.2, 0.45) : 0) +
      0.25 * omrEquilibrado +
      0.2 * (1 - indiceExpansao) * (symm !== null && symm > 0.82 ? 1 : 0.5)
  );

  const indiceCompressao = clamp01(
    0.3 * (ombros !== null && ombros > 0.04 ? band(ombros, 0.04, 0.12) : 0) +
      0.25 * (wsr !== null && wsr > 1.0 ? band(wsr, 1.0, 1.15) : 0) +
      0.25 * (shr !== null && shr >= 0.88 && shr <= 1.08 ? 0.75 : shr !== null && shr <= 1.12 ? 0.4 : 0) +
      0.2 * (symm !== null && symm > 0.78 && symm < 0.93 ? 0.55 : 0.15)
  );

  const indiceFragmentacao = clamp01(
    0.4 * (symm !== null && symm < 0.85 ? 1 - symm : 0) +
      0.3 * (dens !== null && dens < 0.14 ? band(0.14 - dens, 0, 0.12) : 0) +
      0.3 *
        (shr !== null && shr > 0.92 && shr < 1.05 && dens !== null && dens < 0.16 ? 0.55 : 0)
  );

  if (rosto?.poseDetectada) {
    const faceSymm = rosto.simetriaFacial ?? rosto.simetria;
    const faceTension = rosto.tensaoMandibula ?? 0;
    if (faceSymm !== null && faceSymm < 0.76) {
      return {
        indiceExpansao,
        indiceRetracao: clamp01(indiceRetracao + 0.08),
        indiceContencao: clamp01(indiceContencao + (faceSymm > 0.9 ? 0.12 : 0)),
        indiceCompressao: clamp01(indiceCompressao + faceTension * 0.1),
        indiceFragmentacao: clamp01(indiceFragmentacao + (1 - faceSymm) * 0.15),
      };
    }
    if (faceSymm !== null && faceSymm > 0.9) {
      return {
        indiceExpansao,
        indiceRetracao,
        indiceContencao: clamp01(indiceContencao + 0.1),
        indiceCompressao: clamp01(indiceCompressao + faceTension * 0.08),
        indiceFragmentacao,
      };
    }
  }

  return {
    indiceExpansao,
    indiceRetracao,
    indiceContencao,
    indiceCompressao,
    indiceFragmentacao,
  };
}

export function calcularSegmentosReich(
  ag: MarcadoresAgregados,
  eixos: EixosReich,
  rosto?: MarcadoresFoto | null
): SegmentosReich {
  const faceSymm = rosto?.simetriaFacial ?? rosto?.simetria ?? null;
  const faceTension = rosto?.tensaoMandibula ?? 0;
  const cervicalRig = rosto?.rigidezCervical ?? 0;

  return {
    ocular: clamp01(
      eixos.indiceFragmentacao * 0.55 +
        (faceSymm !== null && faceSymm < 0.76 ? (1 - faceSymm) * 0.45 : 0)
    ),
    oral: clamp01(eixos.indiceRetracao * 0.55 + faceTension * 0.45),
    cervical: clamp01(
      (ag.ombrosAdiantadosMedio !== null ? band(ag.ombrosAdiantadosMedio, 0.04, 0.12) : 0) * 0.55 +
        eixos.indiceRetracao * 0.25 +
        cervicalRig * 0.2
    ),
    toracico: clamp01(
      (ag.colapsoToracicoMedio !== null ? band(ag.colapsoToracicoMedio, 0.35, 0.65) : 0) * 0.45 +
        eixos.indiceExpansao * 0.35 +
        eixos.indiceContencao * 0.2
    ),
    diafragmatico: clamp01(
      eixos.indiceCompressao * 0.55 +
        (ag.wsrMedio !== null && ag.wsrMedio > 1.02 ? band(ag.wsrMedio, 1.02, 1.12) : 0) * 0.45
    ),
    abdominal: clamp01(eixos.indiceCompressao * 0.65),
    pelvico: clamp01(
      eixos.indiceCompressao * 0.4 +
        (ag.shrMedio !== null && ag.shrMedio < 0.9 ? band(0.9 - ag.shrMedio, 0, 0.12) : 0) * 0.35 +
        (ag.ulrMedio !== null && ag.ulrMedio < 0.88 ? 0.25 : 0)
    ),
  };
}

/** Logits base a partir da matriz eixo → estrutura (eixos_v2). */
export function eixosParaLogitsBase(eixos: EixosReich): Record<EstruturaTraco, number> {
  const { indiceExpansao, indiceRetracao, indiceContencao, indiceCompressao, indiceFragmentacao } =
    eixos;

  return {
    psicopata: indiceExpansao * 2.4 + indiceContencao * 0.35,
    oral: indiceRetracao * 2.2 + (1 - indiceContencao) * 0.4,
    rigido: indiceContencao * 2.5 + indiceExpansao * 0.15,
    masoquista: indiceCompressao * 2.3 + indiceRetracao * 0.35,
    esquizoide: indiceFragmentacao * 2.4,
  };
}

export interface AjustesReichContext {
  ag: MarcadoresAgregados;
  eixos: EixosReich;
}

/** Regras Reich/Lowen sobre logits (evidências auditáveis). */
export function aplicarAjustesReich(
  logits: Record<EstruturaTraco, number>,
  ctx: AjustesReichContext
): Array<{ estrutura: EstruturaTraco; peso: number; descricao: string }> {
  const { ag, eixos } = ctx;
  const ev: Array<{ estrutura: EstruturaTraco; peso: number; descricao: string }> = [];
  const push = (e: EstruturaTraco, peso: number, descricao: string) => {
    logits[e] += peso;
    ev.push({ estrutura: e, peso, descricao });
  };

  const symm = ag.simetriaMedia;
  const ombros = ag.ombrosAdiantadosMedio;
  const lean = ag.inclinacaoMedia;
  const shr = ag.shrMedio;
  const colapso = ag.colapsoToracicoMedio;

  if (eixos.indiceContencao > 0.6) {
    push("psicopata", -1.4, `Contenção organizada alta (${eixos.indiceContencao.toFixed(2)}) — teto psicopata.`);
    push("rigido", 1.0, "Couraça rígida funcional reforça Rígido.");
  } else if (
    symm !== null &&
    symm > 0.86 &&
    ombros !== null &&
    ombros > 0.05 &&
    eixos.indiceExpansao < 0.35
  ) {
    push("psicopata", -1.0, "Simetria + ombros recolhidos sem expansão — não é dominância fálica.");
    push("rigido", 0.75, "Contenção postural favorece Rígido.");
    push("masoquista", 0.45, "Ombros recolhidos com organização → compressão masoquista.");
  }

  if (eixos.indiceRetracao > 0.55 && eixos.indiceContencao < 0.45) {
    push("oral", 0.9, `Colapso/retração real (${eixos.indiceRetracao.toFixed(2)}) sem contenção rígida.`);
  } else if (eixos.indiceRetracao > 0.45 && eixos.indiceContencao >= 0.45) {
    push("oral", -0.7, "Retração com contenção — leitura Oral atenuada (couraça rígida).");
    push("rigido", 0.5, "Retração contida reforça organização rígida.");
  }

  if (eixos.indiceContencao > 0.5 && symm !== null && symm > 0.86) {
    push("rigido", 0.85, `Índice contenção ${eixos.indiceContencao.toFixed(2)} + simetria ${symm.toFixed(2)}.`);
  }

  if (eixos.indiceCompressao > 0.45) {
    push("masoquista", 1.1, `Compressão dorsal/cintura (${eixos.indiceCompressao.toFixed(2)}) — masoquista sem OMR baixo.`);
    if (symm !== null && symm > 0.88) {
      push("masoquista", 0.35, "Simetria moderada não exclui compressão masoquista.");
    }
  }

  if (colapso !== null && colapso > 0.45) {
    push("psicopata", -0.55, `Colapso torácico (${colapso.toFixed(2)}) contradiz expansão psicopata.`);
  }

  if (shr !== null && shr > 1.38 && eixos.indiceExpansao < 0.4) {
    push("psicopata", -0.8, `OMR alto (${shr.toFixed(2)}) sem expansão postural — proporção, não dominância.`);
  } else if (shr !== null && shr > 1.38 && eixos.indiceExpansao >= 0.45) {
    push("psicopata", 0.9, `OMR alto com expansão confirmada (${eixos.indiceExpansao.toFixed(2)}).`);
  }

  if (lean !== null && lean > 0.04 && eixos.indiceExpansao < 0.35) {
    push("psicopata", -0.5, "Inclinação anterior sem índice de expansão — leitura cautelosa.");
  }

  if (eixos.indiceFragmentacao > 0.5) {
    push("esquizoide", 0.7, `Fragmentação/assimetria (${eixos.indiceFragmentacao.toFixed(2)}).`);
  }

  if (symm !== null && symm > 0.92) {
    push("esquizoide", -0.35, "Simetria alta reduz leitura esquizóide.");
  }

  return ev;
}
