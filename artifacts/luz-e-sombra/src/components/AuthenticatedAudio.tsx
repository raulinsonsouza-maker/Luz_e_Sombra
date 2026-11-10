import { useEffect, useRef, useState } from "react";
import { apiFetchGet } from "@/lib/auth";
import { ChevronLeft, Loader2, MicOff, Minus, Pause, Play, Plus, Settings } from "lucide-react";

type Props = {
  apiPath: string;
  className?: string;
};

/** Passos da barra: 1.00 → 2.00 */
const PASSO = 0.25;
const MIN_VEL = 1;
const MAX_VEL = 2;

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatVelocidade(v: number) {
  return `${v.toFixed(2)}x`;
}

function encaixarVelocidade(v: number) {
  const n = Math.round(v / PASSO) * PASSO;
  return Math.min(MAX_VEL, Math.max(MIN_VEL, Number(n.toFixed(2))));
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
  const [velocidade, setVelocidade] = useState(1);
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

  function mudarVelocidade(prox: number) {
    setVelocidade(encaixarVelocidade(prox));
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0;
  const progressoVel = ((velocidade - MIN_VEL) / (MAX_VEL - MIN_VEL)) * 100;

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
          aria-label={`Velocidade: ${formatVelocidade(velocidade)}`}
          aria-expanded={menuAberto}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {menuAberto && (
        <div
          className="absolute left-3 right-3 z-20 mt-1.5 rounded-xl px-3 pt-2.5 pb-3 shadow-2xl"
          style={{
            top: "100%",
            background: "rgba(18,12,8,0.96)",
            border: "1px solid rgba(247,242,236,0.14)",
            backdropFilter: "blur(14px)",
          }}
          role="dialog"
          aria-label="Velocidade da reprodução"
        >
          <div className="relative flex items-center justify-center mb-2 pb-2" style={{ borderBottom: "1px solid rgba(247,242,236,0.12)" }}>
            <button
              type="button"
              onClick={() => setMenuAberto(false)}
              className="absolute left-0 p-0.5 rounded-lg"
              style={{ color: "rgba(247,242,236,0.85)" }}
              aria-label="Voltar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <p className="text-xs font-medium" style={{ color: "#f7f2ec" }}>
              Velocidade da reprodução
            </p>
          </div>

          <p className="text-center text-xl font-semibold tabular-nums leading-none mb-3" style={{ color: "#f7f2ec" }}>
            {formatVelocidade(velocidade)}
          </p>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => mudarVelocidade(velocidade - PASSO)}
              disabled={velocidade <= MIN_VEL}
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "rgba(247,242,236,0.1)",
                color: "#f7f2ec",
                opacity: velocidade <= MIN_VEL ? 0.35 : 1,
              }}
              aria-label="Diminuir velocidade"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <input
              type="range"
              min={MIN_VEL}
              max={MAX_VEL}
              step={PASSO}
              value={velocidade}
              onChange={(e) => mudarVelocidade(Number(e.target.value))}
              className="flex-1 h-1 rounded-full appearance-none cursor-pointer audio-speed-slider"
              style={{
                background: `linear-gradient(to right, #f7f2ec ${progressoVel}%, rgba(247,242,236,0.22) ${progressoVel}%)`,
              }}
              aria-label="Ajustar velocidade"
            />

            <button
              type="button"
              onClick={() => mudarVelocidade(velocidade + PASSO)}
              disabled={velocidade >= MAX_VEL}
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "rgba(247,242,236,0.1)",
                color: "#f7f2ec",
                opacity: velocidade >= MAX_VEL ? 0.35 : 1,
              }}
              aria-label="Aumentar velocidade"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
