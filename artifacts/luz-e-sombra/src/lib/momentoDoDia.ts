import { ANOS_PESSOAIS, ANOS_UNIVERSAIS } from "@/lib/numerologia-data";
import { DIAS_COLETIVOS } from "@/lib/numerologia/diasColetivos";
import { DIAS_PESSOAIS } from "@/lib/numerologia/diasPessoais";
import { MESES_PESSOAIS } from "@/lib/numerologia/mesesPessoais";
import type { EnergiaNumerologica } from "@/lib/numerologia/energiaNumerologica";
import { energiaDeBase } from "@/lib/numerologia/energiaNumerologica";
import {
  calcularAnoUniversal,
  calcularDiaPessoal,
  calcularDiaUniversal,
} from "@/lib/numerologia-utils";
import { dataDiaMes } from "@/lib/frasesAno";

export type BlocoMomento = EnergiaNumerologica & {
  n: number;
};

export type MomentoColetivo = BlocoMomento & {
  anoUniversal?: { n: number; tema: string };
};

export type MomentoNumerologico = {
  dataLabel: string;
  /** Ano pessoal vigente (preserva mestres). */
  anoPessoal: { n: number; titulo?: string };
  /** Mês pessoal (número). */
  mesPessoalN: number;
  dia: BlocoMomento;
  mes: BlocoMomento;
  coletivo: MomentoColetivo;
  /** Rótulos de contexto para a UI. */
  contextoDia: string;
  contextoMes: string;
  contextoColetivo: string;
};

function blocoDe(
  n: number,
  base: Record<number, EnergiaNumerologica>,
): BlocoMomento {
  return { n, ...energiaDeBase(base, n) };
}

/** Momento tipado para as três abas da Home. */
export function momentoNumerologico(
  dataNascimento: string,
  data: Date = new Date(),
): MomentoNumerologico | null {
  const numeros = calcularDiaPessoal(dataNascimento, data);
  if (!numeros) return null;

  const nColetivo = calcularDiaUniversal(data);
  const anoUniv = calcularAnoUniversal(data.getFullYear());
  const analiseAno = ANOS_UNIVERSAIS[anoUniv.reduzido];
  const anoPessoalInfo = ANOS_PESSOAIS[numeros.ciclo];

  const dia = blocoDe(numeros.hoje, DIAS_PESSOAIS);
  const mes = blocoDe(numeros.periodo, MESES_PESSOAIS);
  const coletivoBase = blocoDe(nColetivo, DIAS_COLETIVOS);

  return {
    dataLabel: dataDiaMes(data),
    anoPessoal: {
      n: numeros.ciclo,
      titulo: anoPessoalInfo?.titulo,
    },
    mesPessoalN: numeros.periodo,
    dia,
    mes,
    coletivo: {
      ...coletivoBase,
      anoUniversal: analiseAno
        ? { n: anoUniv.reduzido, tema: analiseAno.temaGeral }
        : undefined,
    },
    contextoDia: `Dia ${numeros.hoje} · mês pessoal ${numeros.periodo} · ano pessoal ${numeros.ciclo}`,
    contextoMes: `Mês pessoal ${numeros.periodo} · ano pessoal ${numeros.ciclo}`,
    contextoColetivo: analiseAno
      ? `Dia universal ${nColetivo} · ano universal ${anoUniv.reduzido}`
      : `Dia universal ${nColetivo}`,
  };
}

/** Compat: parágrafo único (legado). Preferir `momentoNumerologico`. */
export function momentoDoDia(dataNascimento: string, data: Date = new Date()): string | null {
  const m = momentoNumerologico(dataNascimento, data);
  if (!m) return null;
  return [m.dia.descricao, m.mes.descricao, m.coletivo.descricao].join(" ");
}
