import type { TemperamentoCodigo } from "@workspace/temperamento-v1";
import type { EstruturaTraco } from "@workspace/traco-narrativa";
import type { LinguagemAmor } from "@workspace/cinco-linguagens-amor";
import type { LinguagensCruzadas, TemperamentoCruzado, TracoCruzado } from "./tipos";

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" ? (v as Record<string, unknown>) : null;
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

/** Extrai temperamento do GET /temperamento/ultimo. */
export function parseTemperamentoCruzado(row: { resultado?: unknown } | null): TemperamentoCruzado | null {
  const r = asRecord(row?.resultado);
  if (!r) return null;
  const perfil = asRecord(r.perfil);
  const primario = perfil?.primario as TemperamentoCodigo | undefined;
  if (!primario) return null;
  const analise = Array.isArray(r.analiseAprofundada)
    ? (r.analiseAprofundada as { id: string; paragrafos?: string[] }[])
    : [];
  const secRel = analise.find((s) => s.id === "relacoes");
  const secTrab = analise.find((s) => s.id === "trabalho");
  return {
    primario,
    secundario: (perfil?.secundario as TemperamentoCodigo | undefined) ?? undefined,
    pontoCego: asString(r.pontoCego),
    trechoRelacoes: asString(secRel?.paragrafos?.[0]),
    trechoTrabalho: asString(secTrab?.paragrafos?.[0]),
  };
}

/** Extrai linguagens do GET /linguagens-amor/ultimo. */
export function parseLinguagensCruzadas(row: { resultado?: unknown } | null): LinguagensCruzadas | null {
  const r = asRecord(row?.resultado);
  if (!r) return null;
  const receber = asRecord(r.receber);
  const expressar = asRecord(r.expressar);
  const principal = asString(receber?.principal) ?? asString(r.principal);
  if (!principal) return null;
  const narr = asRecord(r.narrativa);
  const cenas = narr?.cenas;
  const cena = Array.isArray(cenas)
    ? asString(cenas[0])
    : asString(cenas);
  const desal = asRecord(r.desalinhamento);
  return {
    receberPrincipal: principal as LinguagemAmor | string,
    receberSecundaria: asString(receber?.secundaria),
    expressarPrincipal: (asString(expressar?.principal) ?? principal) as LinguagemAmor | string,
    expressarSecundaria: asString(expressar?.secundaria),
    desalinhamento:
      desal && typeof desal.ativo === "boolean"
        ? { ativo: desal.ativo, texto: asString(desal.texto) ?? "" }
        : undefined,
    cena,
  };
}

/** Extrai traço do GET /traco/analise (campo resultado). */
export function parseTracoCruzado(row: { resultado?: unknown } | null): TracoCruzado | null {
  const r = asRecord(row?.resultado);
  if (!r) return null;
  const principal = r.estruturaPrincipal as EstruturaTraco | undefined;
  if (!principal) return null;
  const din = asRecord(r.dinamicaFuncional);
  return {
    estruturaPrincipal: principal,
    estruturaSecundaria: r.estruturaSecundaria as EstruturaTraco | undefined,
    sinteseHumana: asString(r.sinteseHumana),
    dinamicaFuncional: din
      ? {
          trabalho: asString(din.trabalho),
          relacoes: asString(din.relacoes),
          estresse: asString(din.estresse),
          decisoes: asString(din.decisoes),
          energia: asString(din.energia),
          sombra: asString(din.sombra),
        }
      : undefined,
  };
}
