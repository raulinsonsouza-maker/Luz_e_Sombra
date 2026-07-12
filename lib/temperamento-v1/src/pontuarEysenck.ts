import type { Dimensao, TemperamentoCodigo, TipoPerfil } from "./types";
import { TEMPERAMENTOS } from "./types";
import { ITENS_EYSENCK, type ItemTemperamento, type RespostaSimNao } from "./itens";

export interface ScoresEysenck {
  scoreE: number;
  scoreN: number;
  temperamentos_percentuais: Record<TemperamentoCodigo, number>;
  temperamentos_brutos: Record<TemperamentoCodigo, number>;
  primario: TemperamentoCodigo;
  secundario: TemperamentoCodigo;
  tipo: TipoPerfil;
  empateProximo: boolean;
  dimensoes: Record<Dimensao, { bruto: number; normalizado: number }>;
}

const CENTROS: Record<TemperamentoCodigo, { e: number; n: number }> = {
  COLERICO: { e: 75, n: 75 },
  SANGUINEO: { e: 75, n: 25 },
  MELANCOLICO: { e: 25, n: 75 },
  FLEUMATICO: { e: 25, n: 25 },
};

function pontuaItem(item: ItemTemperamento, resposta: RespostaSimNao): number {
  if (item.direcao === "positiva") return resposta === "sim" ? 1 : 0;
  return resposta === "nao" ? 1 : 0;
}

function scoreEixo(itens: readonly ItemTemperamento[], answers: Record<string, RespostaSimNao>): number {
  if (itens.length === 0) return 50;
  const soma = itens.reduce((s, item) => s + pontuaItem(item, answers[item.id]!), 0);
  return Math.round((soma / itens.length) * 1000) / 10;
}

function quadrantePrimario(scoreE: number, scoreN: number): TemperamentoCodigo {
  const altoE = scoreE >= 50;
  const altoN = scoreN >= 50;
  if (altoE && altoN) return "COLERICO";
  if (altoE && !altoN) return "SANGUINEO";
  if (!altoE && altoN) return "MELANCOLICO";
  return "FLEUMATICO";
}

function distancia(e1: number, n1: number, e2: number, n2: number): number {
  return Math.sqrt((e1 - e2) ** 2 + (n1 - n2) ** 2);
}

function percentuaisPorDistancia(
  scoreE: number,
  scoreN: number,
): Record<TemperamentoCodigo, number> {
  const dists = TEMPERAMENTOS.map((t) => {
    const c = CENTROS[t];
    const d = distancia(scoreE, scoreN, c.e, c.n);
    return { t, d: Math.max(d, 1) };
  });
  const inv = dists.map(({ t, d }) => ({ t, w: 1 / d }));
  const total = inv.reduce((s, x) => s + x.w, 0);
  const pct = {} as Record<TemperamentoCodigo, number>;
  for (const { t, w } of inv) {
    pct[t] = Math.round((w / total) * 1000) / 10;
  }
  const sum = TEMPERAMENTOS.reduce((s, t) => s + pct[t]!, 0);
  const diff = Math.round((100 - sum) * 10) / 10;
  let maior: TemperamentoCodigo = quadrantePrimario(scoreE, scoreN);
  let maiorV = -1;
  for (const t of TEMPERAMENTOS) {
    if (pct[t]! > maiorV) {
      maiorV = pct[t]!;
      maior = t;
    }
  }
  pct[maior] = Math.round((pct[maior]! + diff) * 10) / 10;
  return pct;
}

function ordenarPct(pct: Record<TemperamentoCodigo, number>): [TemperamentoCodigo, number][] {
  return [...TEMPERAMENTOS]
    .map((t) => [t, pct[t]!] as [TemperamentoCodigo, number])
    .sort((a, b) => b[1] - a[1]);
}

function classificarTipo(
  scoreE: number,
  scoreN: number,
  pct: Record<TemperamentoCodigo, number>,
  primario: TemperamentoCodigo,
  secundario: TemperamentoCodigo,
): TipoPerfil {
  const ord = ordenarPct(pct);
  const pv = ord[0]![1];
  const sv = ord[1]![1];
  const distCentroE = Math.abs(scoreE - 50);
  const distCentroN = Math.abs(scoreN - 50);

  if (pv > 55 && pv - sv > 20) return "ATIPICO";
  if (distCentroE > 22 && distCentroN > 22) return "DOMINANTE";
  if (pv - sv < 12 || (distCentroE <= 12 && distCentroN > 12) || (distCentroN <= 12 && distCentroE > 12)) {
    return primario !== secundario ? "DUPLO" : "MISTO";
  }
  if (scoreE >= 42 && scoreE <= 58 && scoreN >= 42 && scoreN <= 58) return "MISTO";
  return "MISTO";
}

function secundarioDeQuadrante(
  scoreE: number,
  scoreN: number,
  primario: TemperamentoCodigo,
  pct: Record<TemperamentoCodigo, number>,
): TemperamentoCodigo {
  const ord = ordenarPct(pct);
  const sec = ord.find(([t]) => t !== primario);
  if (sec) return sec[0];

  const vizinhos: Record<TemperamentoCodigo, TemperamentoCodigo[]> = {
    COLERICO: ["SANGUINEO", "MELANCOLICO"],
    SANGUINEO: ["COLERICO", "FLEUMATICO"],
    MELANCOLICO: ["COLERICO", "FLEUMATICO"],
    FLEUMATICO: ["SANGUINEO", "MELANCOLICO"],
  };
  const distE = Math.abs(scoreE - 50);
  const distN = Math.abs(scoreN - 50);
  const viz = vizinhos[primario];
  if (distE <= 12 && distN > 12) {
    return scoreE >= 50 ? viz.find((v) => CENTROS[v].e >= 50) ?? viz[0]! : viz.find((v) => CENTROS[v].e < 50) ?? viz[0]!;
  }
  if (distN <= 12 && distE > 12) {
    return scoreN >= 50 ? viz.find((v) => CENTROS[v].n >= 50) ?? viz[1]! : viz.find((v) => CENTROS[v].n < 50) ?? viz[1]!;
  }
  return ord[1]![0];
}

function dimensoesFromEysenck(scoreE: number, scoreN: number): Record<Dimensao, { bruto: number; normalizado: number }> {
  const e = scoreE / 100;
  const n = scoreN / 100;
  const est = n;
  const pro = 1 - n;
  const dom = Math.min(1, e * 0.7 + (scoreE >= 60 ? 0.2 : 0));
  const mk = (norm: number) => ({
    bruto: Math.round(norm * 100),
    normalizado: Math.round(norm * 1000) / 1000,
  });
  return {
    ENG: mk(e),
    SOC: mk(e),
    DOM: mk(dom),
    EST: mk(est),
    PRO: mk(pro),
  };
}

export function pontuarEysenck(answers: Record<string, RespostaSimNao>): ScoresEysenck {
  const itensE = ITENS_EYSENCK.filter((i) => i.eixo === "E");
  const itensN = ITENS_EYSENCK.filter((i) => i.eixo === "N");
  const scoreE = scoreEixo(itensE, answers);
  const scoreN = scoreEixo(itensN, answers);

  const primario = quadrantePrimario(scoreE, scoreN);
  const temperamentos_percentuais = percentuaisPorDistancia(scoreE, scoreN);
  const secundario = secundarioDeQuadrante(scoreE, scoreN, primario, temperamentos_percentuais);
  const tipo = classificarTipo(scoreE, scoreN, temperamentos_percentuais, primario, secundario);

  const ord = ordenarPct(temperamentos_percentuais);
  const empateProximo = ord[0]![1] - ord[1]![1] < 12;

  const temperamentos_brutos = {} as Record<TemperamentoCodigo, number>;
  for (const t of TEMPERAMENTOS) {
    temperamentos_brutos[t] = Math.round(temperamentos_percentuais[t]!);
  }

  return {
    scoreE,
    scoreN,
    temperamentos_percentuais,
    temperamentos_brutos,
    primario,
    secundario,
    tipo,
    empateProximo,
    dimensoes: dimensoesFromEysenck(scoreE, scoreN),
  };
}
