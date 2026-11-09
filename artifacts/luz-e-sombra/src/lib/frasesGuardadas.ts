import { apiFetch } from "@/lib/auth";
import type { FraseDia } from "@/lib/frasesAno";

export type FraseGuardadaItem = {
  id: number;
  usuarioId: number;
  dia: number;
  frase: string;
  reflexao: string;
  convite: string;
  guardadaEm: string;
};

export async function listarFrasesGuardadas(): Promise<FraseGuardadaItem[]> {
  const res = await apiFetch("/frases-guardadas");
  if (!res.ok) throw new Error("Não foi possível carregar as frases guardadas.");
  return res.json();
}

export async function statusFraseGuardada(dia: number): Promise<boolean> {
  const res = await apiFetch(`/frases-guardadas/${dia}`);
  if (!res.ok) return false;
  const data = await res.json() as { guardada?: boolean };
  return data.guardada === true;
}

export async function guardarFrase(item: FraseDia): Promise<FraseGuardadaItem> {
  const res = await apiFetch("/frases-guardadas", {
    method: "POST",
    body: JSON.stringify({
      dia: item.dia,
      frase: item.frase,
      reflexao: item.reflexao,
      convite: item.convite,
    }),
  });
  if (!res.ok) throw new Error("Não foi possível guardar a frase.");
  const data = await res.json() as { item: FraseGuardadaItem };
  return data.item;
}

export async function removerFraseGuardada(dia: number): Promise<void> {
  const res = await apiFetch(`/frases-guardadas/${dia}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Não foi possível remover a frase.");
}

export async function alternarFraseGuardada(item: FraseDia, jaGuardada: boolean): Promise<boolean> {
  if (jaGuardada) {
    await removerFraseGuardada(item.dia);
    return false;
  }
  await guardarFrase(item);
  return true;
}
