import { apiFetch } from "@/lib/auth";

export type TipoLuzCliente = "momento" | "pausa";

export type PedirLuzResultado =
  | { ok: true; luzes: number; nova: true }
  | { ok: true; luzes: number; nova: false }
  | { ok: false };

/** Pede +1 Luz no servidor (uma vez por tipo/dia). */
export async function pedirLuz(tipo: TipoLuzCliente): Promise<PedirLuzResultado> {
  try {
    const res = await apiFetch(`/gamificacao/luz/${tipo}`, { method: "POST" });
    const data = (await res.json().catch(() => ({}))) as {
      luzes?: number;
      already?: boolean;
      success?: boolean;
    };
    if (typeof data.luzes !== "number") return { ok: false };
    if (res.ok && data.success) {
      return { ok: true, luzes: data.luzes, nova: true };
    }
    if (data.already || res.status === 400) {
      return { ok: true, luzes: data.luzes, nova: false };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}
