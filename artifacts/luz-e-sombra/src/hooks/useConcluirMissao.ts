import { useState, useCallback } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/auth";
import type { MissaoDiaria } from "@/components/MissaoDiariaCard";

export interface LevelUpInfo {
  nivel: number;
  nomeNivel: string;
}

interface ProgressoMissoes {
  xp: number;
  nivel: number;
  nomeNivel: string;
  missoes: MissaoDiaria[];
}

export function useConcluirMissao(
  setProgresso: React.Dispatch<React.SetStateAction<ProgressoMissoes | null>>,
  onLevelUp?: (info: LevelUpInfo) => void,
) {
  const [concluindo, setConcluindo] = useState<number | null>(null);

  const concluirMissao = useCallback(
    async (id: number) => {
      if (concluindo !== null) return;
      setConcluindo(id);
      try {
        const res = await apiFetch(`/gamificacao/missoes/${id}/concluir`, { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          setProgresso((prev) =>
            prev
              ? {
                  ...prev,
                  xp: data.totalXp,
                  nivel: data.nivel,
                  nomeNivel: data.nomeNivel,
                  missoes: prev.missoes.map((m) => (m.id === id ? { ...m, concluida: true } : m)),
                }
              : prev,
          );
          if (data.leveledUp) {
            onLevelUp?.({ nivel: data.nivel, nomeNivel: data.nomeNivel });
          } else {
            toast.success(`+${data.xpGanho} XP`);
          }
        } else {
          const err = await res.json().catch(() => ({}));
          toast.error((err as { error?: string }).error ?? "Não foi possível concluir a missão");
        }
      } catch {
        toast.error("Erro de conexão. Tente novamente.");
      } finally {
        setConcluindo(null);
      }
    },
    [concluindo, setProgresso, onLevelUp],
  );

  return { concluirMissao, concluindo };
}
