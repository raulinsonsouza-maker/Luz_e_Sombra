import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/auth";

export type StatusModuloJornada = "done" | "active" | "locked";

export interface ModuloJornadaResumo {
  slug: string;
  status: StatusModuloJornada;
  analiseConcluida: boolean;
  hubHref: string;
}

export function useJornadaModulo(slug: string, enabled = true) {
  const [modulo, setModulo] = useState<ModuloJornadaResumo | null>(null);
  const [carregando, setCarregando] = useState(enabled);

  useEffect(() => {
    if (!enabled) return;
    let cancelado = false;
    setCarregando(true);
    apiFetch("/modulos-jornada")
      .then((r) => (r.ok ? r.json() : []))
      .then((lista: ModuloJornadaResumo[]) => {
        if (cancelado) return;
        const row = Array.isArray(lista) ? lista.find((m) => m.slug === slug) : undefined;
        setModulo(row ?? null);
      })
      .catch(() => {
        if (!cancelado) setModulo(null);
      })
      .finally(() => {
        if (!cancelado) setCarregando(false);
      });
    return () => {
      cancelado = true;
    };
  }, [slug, enabled]);

  return { modulo, carregando, bloqueado: modulo?.status === "locked" };
}
