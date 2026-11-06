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

function pontuaItem(item: ItemTemperamento, resposta: RespostaSimNao): number {
  if (item.direcao === "positiva") return resposta === "sim" ? 1 : 0;
  return resposta === "nao" ? 1 : 0;
}

const DESEMPATE: TemperamentoCodigo[] = ["SANGUINEO", "FLEUMATICO", "MELANCOLICO", "COLERICO"];

function pontosPorAlvo(answers: Record<string, RespostaSimNao>): Record<TemperamentoCodigo, number> {
  const pontos = { COLERICO: 0, SANGUINEO: 0, MELANCOLICO: 0, FLEUMATICO: 0 } as Record<TemperamentoCodigo, number>;
  for (const item of ITENS_EYSENCK) {
    if (pontuaItem(item, answers[item.id]!) === 1) pontos[item.alvo] += 1;
  }
  return pontos;
}

function ordenarPorPontos(pontos: Record<TemperamentoCodigo, number>): TemperamentoCodigo[] {
  return [...TEMPERAMENTOS].sort((a, b) => {
    const diff = pontos[b]! - pontos[a]!;
    if (diff !== 0) return diff;
    return DESEMPATE.indexOf(a) - DESEMPATE.indexOf(b);
  });
}

function percentuaisPorPontos(
  pontos: Record<TemperamentoCodigo, number>,
): Record<TemperamentoCodigo, number> {
  const total = TEMPERAMENTOS.reduce((s, t) => s + pontos[t]!, 0);
  const pct = {} as Record<TemperamentoCodigo, number>;
  if (total === 0) {
    for (const t of TEMPERAMENTOS) pct[t] = 25;
    return pct;
  }
  for (const t of TEMPERAMENTOS) {
    pct[t] = Math.round((pontos[t]! / total) * 1000) / 10;
  }
  const sum = TEMPERAMENTOS.reduce((s, t) => s + pct[t]!, 0);
  const diff = Math.round((100 - sum) * 10) / 10;
  const maior = ordenarPorPontos(pontos)[0]!;
  pct[maior] = Math.round((pct[maior]! + diff) * 10) / 10;
  return pct;
}

function classificarTipo(
  pontos: Record<TemperamentoCodigo, number>,
  primario: TemperamentoCodigo,
  secundario: TemperamentoCodigo,
): TipoPerfil {
  const pv = pontos[primario]!;
  const sv = pontos[secundario]!;
  if (pv >= 3 && pv - sv >= 2) return "DOMINANTE";
  if (pv - sv <= 1 && primario !== secundario) return "DUPLO";
  if (pv <= 2) return "MISTO";
  return "MISTO";
}

function dimensoesFromPontos(
  pontos: Record<TemperamentoCodigo, number>,
): Record<Dimensao, { bruto: number; normalizado: number }> {
  const mk = (norm: number) => ({
    bruto: Math.round(norm * 100),
    normalizado: Math.round(norm * 1000) / 1000,
  });
  const social = pontos.SANGUINEO / 4;
  const comando = pontos.COLERICO / 4;
  const fundo = pontos.MELANCOLICO / 4;
  return {
    ENG: mk((social + comando) / 2),
    SOC: mk(social),
    DOM: mk(comando),
    EST: mk(fundo),
    PRO: mk(fundo),
  };
}

export function pontuarEysenck(answers: Record<string, RespostaSimNao>): ScoresEysenck {
  const pontos = pontosPorAlvo(answers);
  const ordem = ordenarPorPontos(pontos);
  const primario = ordem[0]!;
  const secundario = ordem[1]!;
  const temperamentos_percentuais = percentuaisPorPontos(pontos);
  const tipo = classificarTipo(pontos, primario, secundario);
  const empateProximo = pontos[primario]! - pontos[secundario]! <= 1;
  const scoreE = Math.round(((pontos.SANGUINEO + pontos.COLERICO) / 8) * 100);
  const scoreN = Math.round((pontos.MELANCOLICO / 4) * 100);

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
    dimensoes: dimensoesFromPontos(pontos),
  };
}
