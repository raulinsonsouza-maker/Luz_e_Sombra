import { ANOS_UNIVERSAIS } from "@/lib/numerologia-data";
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
  dia: BlocoMomento;
  mes: BlocoMomento;
  coletivo: MomentoColetivo;
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

  return {
    dataLabel: dataDiaMes(data),
    dia: blocoDe(numeros.hoje, DIAS_PESSOAIS),
    mes: blocoDe(numeros.periodo, MESES_PESSOAIS),
    coletivo: {
      ...blocoDe(nColetivo, DIAS_COLETIVOS),
      anoUniversal: analiseAno
        ? { n: anoUniv.reduzido, tema: analiseAno.temaGeral }
        : undefined,
    },
  };
}

/** Compat: parágrafo único (legado). Preferir `momentoNumerologico`. */
export function momentoDoDia(dataNascimento: string, data: Date = new Date()): string | null {
  const m = momentoNumerologico(dataNascimento, data);
  if (!m) return null;
  return [m.dia.descricao, m.mes.descricao, m.coletivo.descricao].join(" ");
}
