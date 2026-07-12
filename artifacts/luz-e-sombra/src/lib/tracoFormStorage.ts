import {
  entradaDiagnostico30Schema,
  computarDiagnostico30,
  type EntradaDiagnostico30,
} from "@workspace/traco-diagnostico-emocional";
import { diagnosticoEmocionalFusaoSchema } from "@workspace/traco-diagnostico-fusion";
import { getStoredUser } from "@/lib/auth";

export const LEGACY_STORAGE_DIAGNOSTICO_30 = "luz_diagnostico_emocional_30_v1";
const DIAG_PREFIX = "luz_diagnostico_emocional_30_v1";
const LINGUAGENS_DRAFT_PREFIX = "luz_linguagens_amor_v3_draft";

/** Remove resíduos do antigo questionário de 20 (evita confusão com o diagnóstico de 30). */
export function purgeQuestionario20Storage(): void {
  try {
    const legacy = "luz_questionario_20_respostas";
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) keys.push(k);
    }
    for (const k of keys) {
      if (k === legacy || k.startsWith(`${legacy}_`)) localStorage.removeItem(k);
    }
  } catch {
    /* ignore */
  }
}

/** Remove dados locais do Traço (diagnóstico por pessoa) — chamar no logout. */
export function clearTracoSessionStorage(): void {
  try {
    purgeQuestionario20Storage();
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) keys.push(k);
    }
    for (const k of keys) {
      if (
        k === LEGACY_STORAGE_DIAGNOSTICO_30 ||
        k.startsWith(`${DIAG_PREFIX}_`) ||
        k === LINGUAGENS_DRAFT_PREFIX ||
        k.startsWith(`${LINGUAGENS_DRAFT_PREFIX}_`)
      ) {
        localStorage.removeItem(k);
      }
    }
  } catch {
    /* ignore */
  }
}

export function storageSuffixForPessoa(pessoaId: number | null): "eu" | `p${number}` {
  return pessoaId === null ? "eu" : `p${pessoaId}`;
}

function resolveUserId(userId?: number | null): number | null {
  if (userId !== undefined && userId !== null) return userId;
  return getStoredUser()?.id ?? null;
}

export function storageKeyDiagnostico30(pessoaId: number | null, userId?: number | null): string {
  const suffix = storageSuffixForPessoa(pessoaId);
  const uid = resolveUserId(userId);
  if (uid != null) return `${DIAG_PREFIX}_u${uid}_${suffix}`;
  return `${DIAG_PREFIX}_${suffix}`;
}

export function storageKeyLinguagensAmorDraft(pessoaId: number | null, userId?: number | null): string {
  const suffix = storageSuffixForPessoa(pessoaId);
  const uid = resolveUserId(userId);
  if (uid != null) return `${LINGUAGENS_DRAFT_PREFIX}_u${uid}_${suffix}`;
  return pessoaId === null ? LINGUAGENS_DRAFT_PREFIX : `${LINGUAGENS_DRAFT_PREFIX}_${pessoaId}`;
}

/** Remove rascunhos locais de uma pessoa (diagnóstico + linguagens). */
export function clearPessoaLocalStorage(pessoaId: number, userId?: number | null): void {
  try {
    localStorage.removeItem(storageKeyDiagnostico30(pessoaId, userId));
    localStorage.removeItem(storageKeyLinguagensAmorDraft(pessoaId, userId));
    localStorage.removeItem(`${LINGUAGENS_DRAFT_PREFIX}_${pessoaId}`);
  } catch {
    /* ignore */
  }
}

/** Chave legada sem userId (pré-isolamento por conta). */
function legacyStorageKeyDiagnostico30(pessoaId: number | null): string {
  return `${DIAG_PREFIX}_${storageSuffixForPessoa(pessoaId)}`;
}

/** Migra chave antiga para formato com userId, se existir. */
function migrateDiagnosticoKeyIfNeeded(pessoaId: number | null, userId: number): string {
  const newKey = storageKeyDiagnostico30(pessoaId, userId);
  if (localStorage.getItem(newKey)?.trim()) return newKey;

  const oldKey = legacyStorageKeyDiagnostico30(pessoaId);
  const oldRaw = localStorage.getItem(oldKey);
  if (oldRaw?.trim()) {
    try {
      localStorage.setItem(newKey, oldRaw);
      localStorage.removeItem(oldKey);
      return newKey;
    } catch {
      return oldKey;
    }
  }

  if (pessoaId === null) {
    const leg = localStorage.getItem(LEGACY_STORAGE_DIAGNOSTICO_30);
    if (leg?.trim()) {
      try {
        localStorage.setItem(newKey, leg);
        localStorage.removeItem(LEGACY_STORAGE_DIAGNOSTICO_30);
        return newKey;
      } catch {
        return LEGACY_STORAGE_DIAGNOSTICO_30;
      }
    }
  }

  return newKey;
}

function resolveStorageKey(pessoaId: number | null): string {
  const uid = resolveUserId();
  if (uid != null) return migrateDiagnosticoKeyIfNeeded(pessoaId, uid);
  return legacyStorageKeyDiagnostico30(pessoaId);
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

/** Respostas brutas guardadas no localStorage (por conta + pessoa). */
export function readDiagnostico30RespostasEntrada(pessoaId: number | null): EntradaDiagnostico30 | null {
  try {
    const key = resolveStorageKey(pessoaId);
    const raw = localStorage.getItem(key);
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
    const key = resolveStorageKey(pessoaId);
    const raw = localStorage.getItem(key);
    if (!raw?.trim()) return undefined;
    return parseDiagnostico30StoredJson(raw);
  } catch {
    return undefined;
  }
}
