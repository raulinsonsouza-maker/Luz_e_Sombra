import { CheckCircle2, Circle, Loader2 } from "lucide-react";

export interface MissaoDiaria {
  id: number;
  titulo: string;
  xpRecompensa: number;
  concluida: boolean;
}

interface Props {
  missao: MissaoDiaria;
  concluindo?: boolean;
  onConcluir: (id: number) => void;
  compact?: boolean;
}

export default function MissaoDiariaCard({ missao, concluindo = false, onConcluir, compact }: Props) {
  const done = missao.concluida;
  const loading = concluindo && !done;

  const content = (
    <>
      {done ? (
        <CheckCircle2
          className={`${compact ? "w-5 h-5" : "w-6 h-6"} shrink-0`}
          style={{ color: "#5db97a" }}
        />
      ) : loading ? (
        <Loader2
          className={`${compact ? "w-5 h-5" : "w-6 h-6"} shrink-0 animate-spin`}
          style={{ color: "#c8a56b" }}
        />
      ) : (
        <Circle
          className={`${compact ? "w-5 h-5" : "w-6 h-6"} shrink-0`}
          style={{ color: "rgba(200,165,107,0.3)" }}
        />
      )}
      <div className="flex-1 min-w-0">
        <p
          className={`${compact ? "text-sm" : "text-sm font-medium"} leading-snug`}
          style={{
            color: done ? "rgba(247,242,236,0.45)" : "#f7f2ec",
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {missao.titulo}
        </p>
        {!done && !compact && (
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>
            Toque para concluir
          </p>
        )}
      </div>
      <span
        className={`text-xs font-bold shrink-0 px-2.5 py-1 rounded-lg ${compact ? "text-[11px]" : ""}`}
        style={{
          background: done ? "transparent" : "linear-gradient(135deg, rgba(200,165,107,0.2), rgba(156,119,66,0.15))",
          color: done ? "rgba(93,185,122,0.7)" : "#c8a56b",
        }}
      >
        +{missao.xpRecompensa} XP
      </span>
    </>
  );

  if (done) {
    return (
      <div
        className={`rounded-2xl flex items-center gap-3 ${compact ? "px-4 py-3" : "p-4"}`}
        style={{
          background: "rgba(93,185,122,0.06)",
          border: "1px solid rgba(93,185,122,0.2)",
        }}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onConcluir(missao.id)}
      disabled={loading}
      className={`w-full rounded-2xl flex items-center gap-3 transition-all text-left active:scale-[0.99] disabled:opacity-70 ${compact ? "px-4 py-3" : "p-4"}`}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(200,165,107,0.1)",
        cursor: loading ? "wait" : "pointer",
      }}
    >
      {content}
    </button>
  );
}
