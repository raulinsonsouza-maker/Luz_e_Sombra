import {
  entradaDiagnostico30Schema,
  computarDiagnostico30,
  type EntradaDiagnostico30,
} from "@workspace/traco-diagnostico-emocional";
import { diagnosticoEmocionalFusaoSchema } from "@workspace/traco-diagnostico-fusion";

export const LEGACY_STORAGE_DIAGNOSTICO_30 = "luz_diagnostico_emocional_30_v1";
export const LEGACY_STORAGE_DIAGNOSTICO_FUSAO = "luz_diagnostico_emocional_fusao";

/** Remove resíduos do antigo questionário de 20 (evita confusão com o diagnóstico de 30). */
export function purgeQuestionario20Storage(): void {
  try {
    const legacy = "luz_questionario_20_respostas";
    for (const k of Object.keys(localStorage)) {
      if (k === legacy || k.startsWith(`${legacy}_`)) localStorage.removeItem(k);
    }
  } catch {
    /* ignore */
  }
}

export function storageSuffixForPessoa(pessoaId: number | null): "eu" | `p${number}` {
  return pessoaId === null ? "eu" : `p${pessoaId}`;
}

export function storageKeyDiagnostico30(pessoaId: number | null): string {
  return `luz_diagnostico_emocional_30_v1_${storageSuffixForPessoa(pessoaId)}`;
}

export function storageKeyDiagnosticoFusao(pessoaId: number | null): string {
  return `luz_diagnostico_emocional_fusao_${storageSuffixForPessoa(pessoaId)}`;
}

/** Query para ancorar formulários e análise à mesma pessoa (`null` = Eu). */
export function tracoQueryPessoa(pessoaId: number | null): string {
  return pessoaId === null ? "" : `?pessoaId=${pessoaId}`;
}

/**
 * `useSearch()` do wouter devolve a parte após `?` (sem `?` inicial).
 */
export function parsePessoaIdFromSearch(search: string): number | null {
  const s = (search ?? "").trim();
  if (!s) return null;
  const p = new URLSearchParams(s).get("pessoaId");
  if (p === null || p === "" || p.toLowerCase() === "eu") return null;
  const n = Number(p);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

/** Respostas brutas guardadas no localStorage (por pessoa). */
export function readDiagnostico30RespostasEntrada(pessoaId: number | null): EntradaDiagnostico30 | null {
  try {
    const key = storageKeyDiagnostico30(pessoaId);
    let raw = localStorage.getItem(key);
    if (!raw?.trim() && pessoaId === null) {
      const leg = localStorage.getItem(LEGACY_STORAGE_DIAGNOSTICO_30);
      if (leg?.trim()) {
        try {
          localStorage.setItem(key, leg);
          localStorage.removeItem(LEGACY_STORAGE_DIAGNOSTICO_30);
          raw = localStorage.getItem(key);
        } catch {
          /* ignore */
        }
      }
    }
    if (!raw?.trim()) return null;
    const o = JSON.parse(raw) as { respostas?: unknown };
    const r = entradaDiagnostico30Schema.safeParse(o.respostas);
    return r.success ? r.data : null;
  } catch {
    return null;
  }
}

export function isDiagnostico30RespostasCompletas(e: EntradaDiagnostico30): boolean {
  const ok = (a: number[], lo: number, hi: number) =>
    a.length > 0 && a.every((x) => typeof x === "number" && Number.isInteger(x) && x >= lo && x <= hi);
  return (
    ok(e.passado, 1, 5) &&
    ok(e.presente, 1, 5) &&
    ok(e.consciencia, 1, 5) &&
    e.passado.length === 25 &&
    e.presente.length === 25 &&
    e.consciencia.length === 5
  );
}

function parseDiagnostico30StoredJson(raw: string): Record<string, unknown> | undefined {
  const o = JSON.parse(raw) as { resultado?: unknown; respostas?: unknown };
  if (o?.resultado) {
    const v = diagnosticoEmocionalFusaoSchema.safeParse(o.resultado);
    if (v.success) return v.data as unknown as Record<string, unknown>;
  }
  const ent = entradaDiagnostico30Schema.safeParse(o.respostas ?? o);
  if (!ent.success) return undefined;
  return computarDiagnostico30(ent.data).diagnosticoEmocional as unknown as Record<string, unknown>;
}

export function readDiagnosticoEmocional30Fusao(pessoaId: number | null): Record<string, unknown> | undefined {
  try {
    const key = storageKeyDiagnostico30(pessoaId);
    let raw = localStorage.getItem(key);
    if (!raw?.trim() && pessoaId === null) {
      const leg = localStorage.getItem(LEGACY_STORAGE_DIAGNOSTICO_30);
      if (leg?.trim()) {
        try {
          localStorage.setItem(key, leg);
          localStorage.removeItem(LEGACY_STORAGE_DIAGNOSTICO_30);
          raw = localStorage.getItem(key);
        } catch {
          /* ignore */
        }
      }
    }
    if (!raw?.trim()) return undefined;
    return parseDiagnostico30StoredJson(raw);
  } catch {
    return undefined;
  }
}

export function readOptionalDiagnosticoFusao(pessoaId: number | null): Record<string, unknown> | undefined {
  try {
    const key = storageKeyDiagnosticoFusao(pessoaId);
    let raw = localStorage.getItem(key);
    if (!raw?.trim() && pessoaId === null) {
      const leg = localStorage.getItem(LEGACY_STORAGE_DIAGNOSTICO_FUSAO);
      if (leg?.trim()) {
        try {
          localStorage.setItem(key, leg);
          localStorage.removeItem(LEGACY_STORAGE_DIAGNOSTICO_FUSAO);
          raw = localStorage.getItem(key);
        } catch {
          /* ignore */
        }
      }
    }
    if (!raw?.trim()) return undefined;
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return parsed as Record<string, unknown>;
  } catch {
    /* ignore */
  }
  return undefined;
}
