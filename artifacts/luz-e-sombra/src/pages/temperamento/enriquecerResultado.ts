import {
  extrairPerguntaCrescimento,
  montarNarrativaV3,
  type RelatorioSecao,
} from "@workspace/temperamento-v1";
import type { Dimensao, TemperamentoCodigo, TipoPerfil } from "@workspace/temperamento-v1";

export type ResultadoTemperamentoUi = Record<string, unknown> & {
  versaoNarrativa?: string;
  perfil?: {
    tipo?: TipoPerfil;
    primario?: TemperamentoCodigo;
    secundario?: TemperamentoCodigo;
    arquetipo?: string;
    frase_sintese?: string;
  };
  scores?: {
    dimensoes?: Record<Dimensao, { bruto: number; normalizado: number }>;
    temperamentos_percentuais?: Record<TemperamentoCodigo, number>;
  };
  confiabilidade?: number;
  empateProximo?: boolean;
  sinteseHumana?: string;
  portraitIdentidade?: string;
  noDiaADia?: string;
  seuDom?: string;
  pontoCego?: string;
  comboNarrativa?: string;
  tracosMarcantes?: string[];
  passoPratico?: string;
  dimensoesLegiveis?: { dimensao: Dimensao; label: string; pct: number; insight?: string }[];
  perguntaCrescimento?: string;
  insightsDimensao?: string[];
  combo?: { forca: string; tensao: string; contexto: string };
  relatorioInterno?: {
    titulo?: string;
    secoes?: RelatorioSecao[];
  };
};

function secao(
  rel: ResultadoTemperamentoUi["relatorioInterno"],
  id: string,
): RelatorioSecao | undefined {
  return rel?.secoes?.find((s) => s.id === id);
}

function normFromScores(raw: ResultadoTemperamentoUi): Record<Dimensao, number> | undefined {
  if (!raw.scores?.dimensoes) return undefined;
  return {
    ENG: raw.scores.dimensoes.ENG?.normalizado ?? 0,
    SOC: raw.scores.dimensoes.SOC?.normalizado ?? 0,
    DOM: raw.scores.dimensoes.DOM?.normalizado ?? 0,
    EST: raw.scores.dimensoes.EST?.normalizado ?? 0,
    PRO: raw.scores.dimensoes.PRO?.normalizado ?? 0,
  };
}

export function enriquecerResultadoTemperamento(raw: ResultadoTemperamentoUi): ResultadoTemperamentoUi {
  if (raw.versaoNarrativa === "temperamento_v3" && raw.portraitIdentidade) {
    return raw;
  }

  const perfil = raw.perfil;
  const primario = perfil?.primario;
  const secundario = perfil?.secundario;
  const pct = raw.scores?.temperamentos_percentuais;
  const norm = normFromScores(raw);

  if (primario && secundario && pct && norm && perfil?.tipo && perfil.frase_sintese) {
    const narrativa = montarNarrativaV3({
      tipo: perfil.tipo,
      primario,
      secundario,
      temperamentos_percentuais: pct,
      norm,
      empateProximo: Boolean(raw.empateProximo),
      frase_sintese: perfil.frase_sintese,
    });
    return { ...raw, ...narrativa };
  }

  const passo = secao(raw.relatorioInterno, "passo");
  const passoTexto = passo?.paragrafos[0] ?? "";

  return {
    ...raw,
    perguntaCrescimento: raw.perguntaCrescimento ?? extrairPerguntaCrescimento(passoTexto),
  };
}

export function textoSecao(raw: ResultadoTemperamentoUi, id: string): string | undefined {
  return secao(raw.relatorioInterno, id)?.paragrafos.join("\n\n");
}
