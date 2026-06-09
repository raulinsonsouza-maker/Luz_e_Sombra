import { z } from "zod";
import { normalizarObjetoTextos } from "@workspace/copy-voz";

/** Estruturas biomecânicas (mesmas chaves que `tracoAnalysis` / API). */
export const ESTRUTURAS_TRACO = [
  "esquizoide",
  "oral",
  "psicopata",
  "masoquista",
  "rigido",
] as const;
export type EstruturaTraco = (typeof ESTRUTURAS_TRACO)[number];

export const PADROES_EMOCIONAIS = [
  "vinculo",
  "controle",
  "estrategia",
  "retencao",
  "desconexao",
] as const;
export type PadraoEmocional = (typeof PADROES_EMOCIONAIS)[number];

/** Peso do formulário em relação às fotos (0–1). Mais consciência → um pouco mais peso no declarado. */
const ALPHA_BASE = 0.26;
const ALPHA_CONSCIENCIA = 0.22; // somado ao base conforme média 1–5
const ALPHA_MAX = 0.52;
const ALPHA_MAX_FOTOS_FRACAS = 0.62;

/**
 * Matriz padrão emocional → leitura esperada nas estruturas de traço (linhas somam 1).
 * Versionada para auditoria; alterar `VERSAO_MATRIZ` ao calibrar com clínica/produto.
 */
export const VERSAO_MATRIZ = "fusao_v2";

/** Reich/Lowen: controle→Rígido; vínculo menos Oral-puro; retenção→Masoquista. */
const MATRIZ_PADRAO_ESTRUTURA: Record<PadraoEmocional, Record<EstruturaTraco, number>> = {
  vinculo: { esquizoide: 0.18, oral: 0.35, psicopata: 0.08, masoquista: 0.14, rigido: 0.25 },
  controle: { esquizoide: 0.05, oral: 0.08, psicopata: 0.22, masoquista: 0.1, rigido: 0.55 },
  estrategia: { esquizoide: 0.1, oral: 0.15, psicopata: 0.35, masoquista: 0.08, rigido: 0.32 },
  retencao: { esquizoide: 0.08, oral: 0.18, psicopata: 0.1, masoquista: 0.35, rigido: 0.29 },
  desconexao: { esquizoide: 0.42, oral: 0.08, psicopata: 0.1, masoquista: 0.2, rigido: 0.2 },
};

const NOMES_ESTRUTURA: Record<EstruturaTraco, string> = {
  esquizoide: "Esquizóide",
  oral: "Oral",
  psicopata: "Psicopata",
  masoquista: "Masoquista",
  rigido: "Rígido",
};

const NOMES_PADRAO: Record<PadraoEmocional, string> = {
  vinculo: "vínculo e acolhimento",
  controle: "controle e organização interna",
  estrategia: "estratégia e adaptação",
  retencao: "retenção e acúmulo emocional",
  desconexao: "desconexão e proteção",
};

export const diagnosticoEmocionalFusaoSchema = z
  .object({
    versao: z.string().max(32).optional(),
    padroesPct: z.object({
      vinculo: z.number(),
      controle: z.number(),
      estrategia: z.number(),
      retencao: z.number(),
      desconexao: z.number(),
    }),
    mediaConsciencia: z.number().min(1).max(5),
    tagEvolucao: z.enum(["inconsciente", "em_processo", "integrado"]).optional(),
  })
  .superRefine((val, ctx) => {
    const s =
      val.padroesPct.vinculo +
      val.padroesPct.controle +
      val.padroesPct.estrategia +
      val.padroesPct.retencao +
      val.padroesPct.desconexao;
    if (Math.abs(s - 100) > 2.5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "padroesPct deve somar 100 (tolerância ±2.5).",
      });
    }
  });

export type DiagnosticoEmocionalFusaoInput = z.infer<typeof diagnosticoEmocionalFusaoSchema>;

export interface FusaoDiagnosticoEmocionalMetadata {
  versaoMatriz: string;
  /** 0–100: quanto o perfil declarado no formulário converge com a leitura só pelas fotos. */
  alinhamentoFotosFormulario: number;
  /** 0–100: confiança composta (dispersão + alinhamento + consciência). */
  assertividadeLeitura: number;
  /** Peso do formulário usado na fusão (0–1). */
  pesoFormulario: number;
  padroesEmocionaisNormalizados: Record<PadraoEmocional, number>;
  vetorFormularioEstruturas: Record<EstruturaTraco, number>;
  sinaisConvergentes: string[];
  /** Texto curto para exibir no topo do resultado (não substitui textos longos da análise visual). */
  sinteseIntegrada: string;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

function sumRecord<T extends string>(r: Record<T, number>): number {
  let s = 0;
  for (const k of Object.keys(r) as T[]) s += r[k];
  return s;
}

/** Normaliza percentuais para soma 100 (inteiros, método do maior resto). */
export function normalizarPercentuaisInteiros<T extends string>(raw: Record<T, number>): Record<T, number> {
  const keys = Object.keys(raw) as T[];
  const total = keys.reduce((a, k) => a + Math.max(0, raw[k]), 0);
  if (total <= 0) {
    const eq = Math.floor(100 / keys.length);
    const out = {} as Record<T, number>;
    let rem = 100 - eq * keys.length;
    for (let i = 0; i < keys.length; i++) {
      out[keys[i]] = eq + (i < rem ? 1 : 0);
    }
    return out;
  }
  const scaled = keys.map((k) => ({ k, v: (100 * Math.max(0, raw[k])) / total }));
  const floors = scaled.map(({ k, v }) => ({ k, f: Math.floor(v), r: v - Math.floor(v) }));
  let s = floors.reduce((a, x) => a + x.f, 0);
  let diff = 100 - s;
  floors.sort((a, b) => b.r - a.r);
  const out = {} as Record<T, number>;
  for (const x of floors) out[x.k] = x.f;
  for (let i = 0; i < diff; i++) {
    out[floors[i % floors.length].k] += 1;
  }
  return out;
}

function toProportions<T extends string>(pct: Record<T, number>): Record<T, number> {
  const s = sumRecord(pct);
  if (s <= 0) return pct;
  const out = {} as Record<T, number>;
  for (const k of Object.keys(pct) as T[]) out[k] = pct[k] / s;
  return out;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na <= 0 || nb <= 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function inferTopPadroes(p: Record<PadraoEmocional, number>): [PadraoEmocional, PadraoEmocional] {
  const sorted = (Object.entries(p) as [PadraoEmocional, number][]).sort((a, b) => b[1] - a[1]);
  return [sorted[0][0], sorted[1][0]];
}

function inferTopEstruturas(e: Record<EstruturaTraco, number>): [EstruturaTraco, EstruturaTraco] {
  const sorted = (Object.entries(e) as [EstruturaTraco, number][]).sort((a, b) => b[1] - a[1]);
  return [sorted[0][0], sorted[1][0]];
}

function vetorFormularioParaEstruturas(
  padroesPct: Record<PadraoEmocional, number>
): Record<EstruturaTraco, number> {
  const p = toProportions(padroesPct);
  const out = {} as Record<EstruturaTraco, number>;
  for (const e of ESTRUTURAS_TRACO) {
    let acc = 0;
    for (const pad of PADROES_EMOCIONAIS) acc += p[pad] * MATRIZ_PADRAO_ESTRUTURA[pad][e];
    out[e] = acc;
  }
  return out;
}

function principalSecundariaDePct(estruturas: Record<EstruturaTraco, number>): {
  estruturaPrincipal: EstruturaTraco;
  estruturaSecundaria: EstruturaTraco;
} {
  const sorted = (Object.entries(estruturas) as [EstruturaTraco, number][]).sort((a, b) => b[1] - a[1]);
  return {
    estruturaPrincipal: sorted[0][0],
    estruturaSecundaria: sorted[1][0],
  };
}

export interface AplicarFusaoResult {
  estruturasFusionadas: Record<EstruturaTraco, number>;
  estruturaPrincipal: EstruturaTraco;
  estruturaSecundaria: EstruturaTraco;
  metadata: FusaoDiagnosticoEmocionalMetadata;
  /** Nova confiancaAnalise sugerida (0–100), sem ultrapassar 100. */
  confiancaAnaliseAjustada: number;
}

/**
 * Combina percentuais das **fotos** com o perfil declarado no **formulário** (padrões emocionais internos já agregados).
 * Produz percentuais finais, principal/secundária recalculados e metadados de assertividade para a API persistir.
 */
export interface FusaoTracoOpcoes {
  /** Variância entre fotos (0–1+), ex. metadata.featureSummary.varianciaEntreFotos */
  varianciaEntreFotos?: number;
  /** Índice contenção Reich (0–1) das fotos — reforça peso do formulário em controle. */
  indiceContencaoFotos?: number;
}

export function aplicarFusaoTracoDiagnostico(
  estruturasSomenteFotos: Record<EstruturaTraco, number>,
  diagnostico: DiagnosticoEmocionalFusaoInput,
  confiancaAnaliseFotos: number,
  opcoes?: FusaoTracoOpcoes
): AplicarFusaoResult {
  const parsed = diagnosticoEmocionalFusaoSchema.parse(diagnostico);
  const padNorm = normalizarPercentuaisInteiros(parsed.padroesPct);
  const padProp = toProportions(padNorm);

  const vFoto = toProportions(estruturasSomenteFotos);
  const vFormVec = vetorFormularioParaEstruturas(padNorm);
  const vForm = toProportions(
    normalizarPercentuaisInteiros(
      Object.fromEntries(ESTRUTURAS_TRACO.map((e) => [e, vFormVec[e] * 100])) as Record<EstruturaTraco, number>
    )
  );

  const mc = parsed.mediaConsciencia;
  const variancia = opcoes?.varianciaEntreFotos ?? 0;
  const fotosFracas = confiancaAnaliseFotos < 55 || variancia > 0.15;
  const alphaMax = fotosFracas ? ALPHA_MAX_FOTOS_FRACAS : ALPHA_MAX;

  let alpha = ALPHA_BASE + ((mc - 1) / 4) * ALPHA_CONSCIENCIA;
  if (parsed.tagEvolucao === "integrado") alpha += 0.04;
  if (fotosFracas) alpha += 0.06;

  const fotoArr = ESTRUTURAS_TRACO.map((e) => vFoto[e]);
  const formArr = ESTRUTURAS_TRACO.map((e) => vForm[e]);
  const alinhamento = Math.round(100 * cosineSimilarity(fotoArr, formArr));

  if (alinhamento < 65) {
    alpha = Math.min(alpha, 0.3);
  }

  const contencao = opcoes?.indiceContencaoFotos ?? 0;
  const padControle = padProp.controle ?? 0;
  if (contencao > 0.5 && padControle > 0.18) {
    alpha = Math.min(alphaMax, alpha + 0.04);
  }

  alpha = clamp(alpha, ALPHA_BASE, alphaMax);

  const fusedProp = {} as Record<EstruturaTraco, number>;
  for (const e of ESTRUTURAS_TRACO) {
    fusedProp[e] = (1 - alpha) * vFoto[e] + alpha * vForm[e];
  }

  const principalFoto = ESTRUTURAS_TRACO.reduce(
    (best, e) => (vFoto[e] > vFoto[best] ? e : best),
    ESTRUTURAS_TRACO[0]
  );
  const principalForm = ESTRUTURAS_TRACO.reduce(
    (best, e) => (vForm[e] > vForm[best] ? e : best),
    ESTRUTURAS_TRACO[0]
  );
  const gapFotoPrincipal = vFoto[principalFoto] - vFoto[ESTRUTURAS_TRACO.filter((e) => e !== principalFoto).sort((a, b) => vFoto[b] - vFoto[a])[0]!];
  const divergenciaPrincipal = principalFoto !== principalForm && gapFotoPrincipal > 0.15;

  // Sharpening só com alta convergência e sem divergência fotos/formulário.
  if (alinhamento >= 82 && !divergenciaPrincipal) {
    const top = ESTRUTURAS_TRACO.reduce((best, e) => (fusedProp[e] > fusedProp[best] ? e : best), ESTRUTURAS_TRACO[0]);
    const factor = 1.06;
    fusedProp[top] *= factor;
    const s = sumRecord(fusedProp);
    for (const e of ESTRUTURAS_TRACO) fusedProp[e] /= s;
  }

  const estruturasFusionadas = normalizarPercentuaisInteiros(
    Object.fromEntries(ESTRUTURAS_TRACO.map((e) => [e, fusedProp[e] * 100])) as Record<EstruturaTraco, number>
  );

  const { estruturaPrincipal, estruturaSecundaria } = principalSecundariaDePct(estruturasFusionadas);

  const [p1, p2] = inferTopPadroes(padProp);
  const [e1, e2] = inferTopEstruturas(estruturasFusionadas);

  const sinaisConvergentes: string[] = [];
  if (alinhamento >= 75) {
    sinaisConvergentes.push(
      "O que aparece nas imagens e o que você declarou no questionário apontam na mesma direção."
    );
  } else if (alinhamento >= 55) {
    sinaisConvergentes.push(
      "Há concordância parcial entre fotos e formulário; a fusão equilibra as duas fontes."
    );
  } else {
    sinaisConvergentes.push(
      "Fotos e formulário divergem em parte. O resultado integra ambas em uma leitura só sua."
    );
  }
  if (estruturasFusionadas[e1] - estruturasFusionadas[e2] >= 12) {
    sinaisConvergentes.push(
      `Predominância clara de ${NOMES_ESTRUTURA[e1]} após integração (${estruturasFusionadas[e1]}%).`
    );
  }

  const sinteseIntegrada =
    `Leitura integrada (fotos + questionário): predominam ${NOMES_ESTRUTURA[e1]} e ${NOMES_ESTRUTURA[e2]}, ` +
    `com padrões emocionais marcantes em ${NOMES_PADRAO[p1]} e ${NOMES_PADRAO[p2]}. ` +
    `Alinhamento fotos/formulário: ${alinhamento}%.`;

  const gapPrimSec = estruturasFusionadas[e1] - estruturasFusionadas[e2];
  const assertividadeLeitura = Math.round(
    clamp(
      0.36 * clamp(confiancaAnaliseFotos, 0, 100) +
        0.44 * alinhamento +
        0.2 * Math.min(100, gapPrimSec * 5),
      0,
      100
    )
  );

  const confiancaAnaliseAjustada = Math.round(
    clamp(confiancaAnaliseFotos + (alinhamento >= 70 ? 6 : alinhamento >= 55 ? 3 : 0), 0, 100)
  );

  const metadata: FusaoDiagnosticoEmocionalMetadata = {
    versaoMatriz: VERSAO_MATRIZ,
    alinhamentoFotosFormulario: alinhamento,
    assertividadeLeitura,
    pesoFormulario: alpha,
    padroesEmocionaisNormalizados: padProp,
    vetorFormularioEstruturas: Object.fromEntries(ESTRUTURAS_TRACO.map((e) => [e, Math.round(vForm[e] * 1000) / 10])) as Record<
      EstruturaTraco,
      number
    >,
    sinaisConvergentes,
    sinteseIntegrada,
  };

  return normalizarObjetoTextos({
    estruturasFusionadas,
    estruturaPrincipal,
    estruturaSecundaria,
    metadata,
    confiancaAnaliseAjustada,
  });
}
