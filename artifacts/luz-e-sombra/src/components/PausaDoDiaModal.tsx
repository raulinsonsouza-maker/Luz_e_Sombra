import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import {
  MOODS_PAUSA,
  dateKeyPercepcao,
  lerPercepcao,
  salvarPercepcao,
} from "@/lib/percepcoes";

type Props = {
  open: boolean;
  onClose: () => void;
  prompt?: string;
  onSaved?: () => void;
};

export function PausaDoDiaModal({ open, onClose, prompt, onSaved }: Props) {
  const [mood, setMood] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const atual = lerPercepcao(dateKeyPercepcao());
    setMood(atual?.mood ?? null);
    setText(atual?.text ?? "");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function guardar() {
    setSaving(true);
    try {
      salvarPercepcao({ mood, text });
      toast.success("Seu momento foi guardado com carinho.");
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pausa-titulo"
    >
      <button
        type="button"
        className="absolute inset-0"
        style={{ background: "rgba(10,8,5,0.72)", backdropFilter: "blur(6px)" }}
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-5 sm:p-6 shadow-2xl"
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
          Sua pausa do dia
        </p>
        <h2
          id="pausa-titulo"
          className="font-tan-mon-cheri text-2xl sm:text-[1.65rem] leading-tight mb-2 pr-8"
          style={{ color: "#f7f2ec" }}
        >
          Como está o seu mundo por dentro?
        </h2>
        <p className="text-sm mb-5" style={{ color: "rgba(247,242,236,0.55)" }}>
          Todos os sentimentos têm lugar aqui.
        </p>

        {prompt ? (
          <div
            className="rounded-2xl px-3.5 py-3 mb-4 text-sm leading-relaxed"
            style={{
              background: "rgba(200,165,107,0.08)",
              border: "1px solid rgba(200,165,107,0.2)",
              color: "rgba(247,242,236,0.78)",
            }}
          >
            {prompt}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Como você se sente">
          {MOODS_PAUSA.map((m) => {
            const selected = mood === m;
            return (
              <button
                key={m}
                type="button"
                data-mood={m}
                aria-pressed={selected}
                onClick={() => setMood(selected ? null : m)}
                className="px-3.5 py-2 rounded-full text-xs font-semibold transition-all"
                style={
                  selected
                    ? {
                        background: "linear-gradient(135deg, #c8a56b, #9c7742)",
                        color: "#1a1208",
                        border: "1px solid transparent",
                      }
                    : {
                        background: "transparent",
                        color: "rgba(247,242,236,0.72)",
                        border: "1px solid rgba(200,165,107,0.35)",
                      }
                }
              >
                {m}
              </button>
            );
          })}
        </div>

        <label
          htmlFor="pausa-texto"
          className="block text-sm font-medium mb-2"
          style={{ color: "rgba(247,242,236,0.78)" }}
        >
          O que você gostaria de acolher hoje?
        </label>
        <textarea
          id="pausa-texto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={3000}
          rows={5}
          placeholder="Este espaço é seu. Escreva sem se cobrar…"
          className="w-full rounded-2xl px-3.5 py-3 text-sm leading-relaxed resize-y mb-5 outline-none"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(200,165,107,0.22)",
            color: "#f7f2ec",
          }}
        />

        <button
          type="button"
          onClick={guardar}
          disabled={saving}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #c8a56b, #9c7742)",
            color: "#1a1208",
          }}
        >
          <Check className="w-4 h-4" />
          Guardar meu momento
        </button>

        <p className="text-[11px] text-center mt-4" style={{ color: "rgba(247,242,236,0.35)" }}>
          Seu registro fica apenas neste navegador, neste dispositivo.
        </p>
      </div>
    </div>
  );
}
