import { normalizarObjetoTextos } from "@workspace/copy-voz";
import {
  extrairPerguntaCrescimento,
  sanitizarTituloTemperamentoLegado,
  type RelatorioSecao,
} from "@workspace/temperamento-v1";
import type { Dimensao, TemperamentoCodigo, TipoPerfil } from "@workspace/temperamento-v1";

export type ResultadoTemperamentoUi = Record<string, unknown> & {
  versaoNarrativa?: string;
  versao?: string;
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
    scoreE?: number;
    scoreN?: number;
    estabilidadeEmocional?: number;
  };
  confiabilidade?: number;
  empateProximo?: boolean;
  sinteseHumana?: string;
  portraitIdentidade?: string;
  seuDom?: string;
  pontoCego?: string;
  comboNarrativa?: string;
  tracosMarcantes?: string[];
  passoPratico?: string;
  dimensoesLegiveis?: { dimensao: Dimensao; label: string; pct: number; insight?: string }[];
  perguntaCrescimento?: string;
  insightsDimensao?: string[];
  combo?: { forca: string; tensao: string; contexto: string };
  analiseAprofundada?: RelatorioSecao[];
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

export function enriquecerResultadoTemperamento(raw: ResultadoTemperamentoUi): ResultadoTemperamentoUi {
  const perfil = raw.perfil;
  const primario = perfil?.primario;
  const secundario = perfil?.secundario;

  let base = raw;

  if (primario && secundario && perfil?.tipo) {
    const tituloCorreto = sanitizarTituloTemperamentoLegado(
      perfil.arquetipo,
      primario,
      secundario,
      perfil.tipo,
    );
    if (tituloCorreto !== perfil.arquetipo || raw.relatorioInterno?.titulo !== tituloCorreto) {
      base = {
        ...base,
        perfil: { ...perfil, arquetipo: tituloCorreto },
        relatorioInterno: base.relatorioInterno
          ? { ...base.relatorioInterno, titulo: tituloCorreto }
          : base.relatorioInterno,
      };
    }
  }

  const passo = secao(base.relatorioInterno, "passo");
  const passoTexto = passo?.paragrafos[0] ?? "";

  return normalizarObjetoTextos({
    ...base,
    perguntaCrescimento: base.perguntaCrescimento ?? extrairPerguntaCrescimento(passoTexto),
  });
}

export function textoSecao(raw: ResultadoTemperamentoUi, id: string): string | undefined {
  const daAnalise = raw.analiseAprofundada?.find((s) => s.id === id);
  if (daAnalise) return daAnalise.paragrafos.join("\n\n");
  return secao(raw.relatorioInterno, id)?.paragrafos.join("\n\n");
}

export function isResultadoLegado(raw: ResultadoTemperamentoUi): boolean {
  return raw.versaoNarrativa !== "temperamento_v4" && !raw.analiseAprofundada?.length;
}
