import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import {
  brazilDateToIso,
  formatBrazilDate,
  isValidBrazilDate,
  isoToBrazilDate,
} from "@/lib/dataNascimento";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved?: (dataNascimento: string) => void;
};

export function DataNascimentoModal({ open, onClose, onSaved }: Props) {
  const { user, updateUser } = useAuth();
  const [data, setData] = useState(isoToBrazilDate(user?.dataNascimento));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setData(isoToBrazilDate(user?.dataNascimento));
  }, [open, user?.dataNascimento]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function salvar() {
    if (!data.trim()) {
      toast.error("Informe a data de nascimento.");
      return;
    }
    if (!isValidBrazilDate(data)) {
      toast.error("Data inválida. Use DD/MM/AAAA.");
      return;
    }
    const iso = brazilDateToIso(data);
    if (iso === (user?.dataNascimento ?? "")) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      const res = await apiFetch("/usuarios/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataNascimento: iso }),
      });
      const body = await res.json();
      if (!res.ok) {
        toast.error(body.error || "Não foi possível salvar a data.");
        return;
      }
      updateUser(body);
      toast.success("Data atualizada. A análise usa o novo valor.");
      onSaved?.(iso);
      onClose();
    } catch {
      toast.error("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="data-nasc-titulo"
    >
      <button
        type="button"
        className="absolute inset-0"
        style={{ background: "rgba(10,8,5,0.72)", backdropFilter: "blur(6px)" }}
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md rounded-3xl p-5 sm:p-6 shadow-2xl"
        style={{
          background: "linear-gradient(165deg, #1e1812 0%, #2a2118 55%, #1a140e 100%)",
          border: "1px solid rgba(200,165,107,0.28)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ color: "rgba(247,242,236,0.55)", background: "rgba(255,255,255,0.04)" }}
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <p
          className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3 pr-10"
          style={{ color: "#c8a56b" }}
        >
          Perfil
        </p>
        <h2
          id="data-nasc-titulo"
          className="font-tan-mon-cheri text-2xl leading-tight mb-2 pr-8"
          style={{ color: "#f7f2ec" }}
        >
          Data de nascimento
        </h2>
        <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(247,242,236,0.58)" }}>
          Ao alterar esta data, o mapa numerológico e os ciclos (ano, mês e dia pessoal)
          são recalculados com o novo valor. Use a data correta do seu perfil.
        </p>

        <label className="block mb-5">
          <span className="text-xs font-semibold mb-2 block" style={{ color: "rgba(200,165,107,0.7)" }}>
            Nova data
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={data}
            onChange={(e) => setData(formatBrazilDate(e.target.value))}
            maxLength={10}
            placeholder="DD/MM/AAAA"
            className="w-full rounded-xl px-3.5 py-3 text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(200,165,107,0.22)",
              color: "#f7f2ec",
            }}
          />
        </label>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl py-3 text-sm font-medium"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(247,242,236,0.7)",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => void salvar()}
            disabled={saving}
            className="flex-1 rounded-xl py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: "#c8a56b", color: "#130f09" }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
