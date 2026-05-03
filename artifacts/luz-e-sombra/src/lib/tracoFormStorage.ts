import {
  entradaDiagnostico30Schema,
  computarDiagnostico30,
  type EntradaDiagnostico30,
} from "@workspace/traco-diagnostico-emocional";
import { diagnosticoEmocionalFusaoSchema } from "@workspace/traco-diagnostico-fusion";

/** Chaves antigas (uma só por browser) — migradas para `eu` na primeira leitura. */
export const LEGACY_STORAGE_Q20 = "luz_questionario_20_respostas";
export const LEGACY_STORAGE_DIAGNOSTICO_30 = "luz_diagnostico_emocional_30_v1";
export const LEGACY_STORAGE_DIAGNOSTICO_FUSAO = "luz_diagnostico_emocional_fusao";

export function storageSuffixForPessoa(pessoaId: number | null): "eu" | `p${number}` {
  return pessoaId === null ? "eu" : `p${pessoaId}`;
}

export function storageKeyQuestionario20(pessoaId: number | null): string {
  return `luz_questionario_20_respostas_${storageSuffixForPessoa(pessoaId)}`;
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

function parseQ20Array(raw: string): number[] | undefined {
  const a = JSON.parse(raw) as unknown;
  if (!Array.isArray(a) || a.length !== 20) return undefined;
  const ok = a.every((x) => typeof x === "number" && Number.isInteger(x) && x >= 1 && x <= 5);
  return ok ? (a as number[]) : undefined;
}

export function readQuestionario20Respostas(pessoaId: number | null): number[] | undefined {
  try {
    const key = storageKeyQuestionario20(pessoaId);
    const raw = localStorage.getItem(key);
    if (raw?.trim()) {
      const v = parseQ20Array(raw);
      if (v) return v;
    }
    if (pessoaId === null) {
      const leg = localStorage.getItem(LEGACY_STORAGE_Q20);
      if (leg?.trim()) {
        const v = parseQ20Array(leg);
        if (v) {
          try {
            localStorage.setItem(key, JSON.stringify(v));
            localStorage.removeItem(LEGACY_STORAGE_Q20);
          } catch {
            /* ignore */
          }
          return v;
        }
      }
    }
  } catch {
    /* ignore */
  }
  return undefined;
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
