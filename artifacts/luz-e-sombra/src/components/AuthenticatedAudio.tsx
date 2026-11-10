import { useEffect, useRef, useState } from "react";
import { apiFetchGet } from "@/lib/auth";
import { Gauge, Loader2, MicOff, Minus, Pause, Play, Plus, Settings, X } from "lucide-react";

type Props = {
  apiPath: string;
  className?: string;
};

const VELOCIDADES = [1, 1.25, 1.5, 2] as const;
type Velocidade = (typeof VELOCIDADES)[number];

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatVelocidade(v: number) {
  return `${v.toFixed(2).replace(/\.?0+$/, "").replace(/(\.\d)0$/, "$1")}x`;
}

function rotuloPreset(v: Velocidade) {
  if (v === 1) return "1,0";
  if (v === 1.25) return "1,25";
  if (v === 1.5) return "1,5";
  return "2,0";
}

function velocidadeMaisProxima(valor: number): Velocidade {
  let melhor: Velocidade = 1;
  let dist = Infinity;
  for (const v of VELOCIDADES) {
    const d = Math.abs(v - valor);
    if (d < dist) {
      dist = d;
      melhor = v;
    }
  }
  return melhor;
}

export function AuthenticatedAudio({ apiPath, className = "" }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [velocidade, setVelocidade] = useState<Velocidade>(1);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    (async () => {
      setLoading(true);
      setFailed(false);
      setBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      try {
        const res = await apiFetchGet(apiPath);
        if (!res.ok) throw new Error("not ok");
        const blob = await res.blob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [apiPath]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setCurrent(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onEnded = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnded);
    };
  }, [blobUrl]);

  useEffect(() => {
    const el = audioRef.current;
    if (el) el.playbackRate = velocidade;
  }, [velocidade, blobUrl]);

  useEffect(() => {
    if (!menuAberto) return;
    function onPointer(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuAberto(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuAberto(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuAberto]);

  async function togglePlay() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    try {
      el.playbackRate = velocidade;
      await el.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  function seek(pct: number) {
    const el = audioRef.current;
    if (!el || !duration) return;
    el.currentTime = Math.max(0, Math.min(duration, (pct / 100) * duration));
  }

  function alterarVelocidade(proximo: number) {
    setVelocidade(velocidadeMaisProxima(Math.max(1, Math.min(2, proximo))));
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0;
  const idxAtual = VELOCIDADES.indexOf(velocidade);

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-[64px] rounded-2xl ${className}`} style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.18)" }}>
        <Loader2 className="w-5 h-5 animate-spin opacity-50" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  if (failed || !blobUrl) {
    return (
      <div className={`flex items-center justify-center gap-2 min-h-[64px] rounded-2xl text-xs ${className}`} style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.18)", color: "rgba(247,242,236,0.4)" }}>
        <MicOff className="w-4 h-4" style={{ color: "#c8a56b" }} />
        Áudio indisponível
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className={`relative rounded-2xl px-3.5 py-3 ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(200,165,107,0.12) 0%, rgba(26,18,10,0.55) 100%)",
        border: "1px solid rgba(200,165,107,0.28)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <audio ref={audioRef} src={blobUrl} preload="metadata" />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => void togglePlay()}
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95"
          style={{
            background: "linear-gradient(135deg, #c8a56b, #9c7742)",
            color: "#1a1208",
            boxShadow: "0 6px 18px rgba(200,165,107,0.28)",
          }}
          aria-label={playing ? "Pausar" : "Reproduzir"}
        >
          {playing ? <Pause className="w-5 h-5" fill="currentColor" /> : <Play className="w-5 h-5 ml-0.5" fill="currentColor" />}
        </button>

        <div className="flex-1 min-w-0">
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #c8a56b ${progress}%, rgba(200,165,107,0.18) ${progress}%)`,
              accentColor: "#c8a56b",
            }}
            aria-label="Progresso do áudio"
          />
          <div className="flex items-center justify-between mt-1.5 gap-2">
            <span className="text-[10px] tabular-nums" style={{ color: "rgba(247,242,236,0.45)" }}>
              {formatTime(current)}
            </span>
            <span className="text-[10px] tabular-nums" style={{ color: "rgba(247,242,236,0.45)" }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMenuAberto((v) => !v)}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: menuAberto ? "rgba(200,165,107,0.22)" : "rgba(247,242,236,0.06)",
            border: menuAberto ? "1px solid rgba(200,165,107,0.45)" : "1px solid rgba(247,242,236,0.12)",
            color: menuAberto ? "#e8d5b0" : "rgba(247,242,236,0.78)",
          }}
          aria-label="Configurações de reprodução"
          aria-expanded={menuAberto}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {menuAberto && (
        <div
          className="absolute right-2 left-2 sm:left-auto z-20 mt-2 sm:w-72 rounded-2xl p-3.5 shadow-2xl"
          style={{
            top: "100%",
            background: "rgba(18,12,8,0.96)",
            border: "1px solid rgba(200,165,107,0.28)",
            backdropFilter: "blur(12px)",
          }}
          role="dialog"
          aria-label="Velocidade da reprodução"
        >
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 min-w-0">
              <Gauge className="w-4 h-4 shrink-0" style={{ color: "#c8a56b" }} />
              <p className="text-sm font-medium truncate" style={{ color: "#f7f2ec" }}>
                Velocidade da reprodução
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMenuAberto(false)}
              className="p-1 rounded-lg shrink-0"
              style={{ color: "rgba(247,242,236,0.55)" }}
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-2xl font-semibold tabular-nums mb-3" style={{ color: "#f7f2ec" }}>
            {formatVelocidade(velocidade)}
          </p>

          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => alterarVelocidade(VELOCIDADES[Math.max(0, idxAtual - 1)] ?? 1)}
              disabled={idxAtual <= 0}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(247,242,236,0.08)",
                color: "#f7f2ec",
                opacity: idxAtual <= 0 ? 0.35 : 1,
              }}
              aria-label="Diminuir velocidade"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="range"
              min={0}
              max={VELOCIDADES.length - 1}
              step={1}
              value={idxAtual}
              onChange={(e) => setVelocidade(VELOCIDADES[Number(e.target.value)] ?? 1)}
              className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #c8a56b ${(idxAtual / (VELOCIDADES.length - 1)) * 100}%, rgba(247,242,236,0.16) ${(idxAtual / (VELOCIDADES.length - 1)) * 100}%)`,
                accentColor: "#c8a56b",
              }}
              aria-label="Ajustar velocidade"
            />
            <button
              type="button"
              onClick={() => alterarVelocidade(VELOCIDADES[Math.min(VELOCIDADES.length - 1, idxAtual + 1)] ?? 2)}
              disabled={idxAtual >= VELOCIDADES.length - 1}
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(247,242,236,0.08)",
                color: "#f7f2ec",
                opacity: idxAtual >= VELOCIDADES.length - 1 ? 0.35 : 1,
              }}
              aria-label="Aumentar velocidade"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {VELOCIDADES.map((v) => {
              const ativo = velocidade === v;
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setVelocidade(v);
                    setMenuAberto(false);
                  }}
                  className="rounded-full px-1 py-2 text-center"
                  style={
                    ativo
                      ? {
                          background: "rgba(200,165,107,0.28)",
                          border: "1px solid rgba(200,165,107,0.5)",
                          color: "#f7f2ec",
                        }
                      : {
                          background: "rgba(247,242,236,0.06)",
                          border: "1px solid rgba(247,242,236,0.1)",
                          color: "rgba(247,242,236,0.7)",
                        }
                  }
                  aria-pressed={ativo}
                >
                  <span className="block text-xs font-semibold tabular-nums leading-none">{rotuloPreset(v)}</span>
                  {v === 1 ? (
                    <span className="block text-[9px] mt-1 leading-none" style={{ color: ativo ? "rgba(247,242,236,0.75)" : "rgba(247,242,236,0.4)" }}>
                      Normal
                    </span>
                  ) : (
                    <span className="block text-[9px] mt-1 leading-none opacity-0">.</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
