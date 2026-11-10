import { useEffect, useRef, useState } from "react";
import { apiFetchGet } from "@/lib/auth";
import { Check, Loader2, MicOff, Pause, Play, Settings } from "lucide-react";

type Props = {
  apiPath: string;
  className?: string;
};

const VELOCIDADES = [
  { valor: 1, rotulo: "Normal" },
  { valor: 1.25, rotulo: "1.25x" },
  { valor: 1.5, rotulo: "1.5x" },
  { valor: 2, rotulo: "2x" },
] as const;

type Velocidade = (typeof VELOCIDADES)[number]["valor"];

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
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

  const progress = duration > 0 ? (current / duration) * 100 : 0;
  const rotuloAtual = VELOCIDADES.find((v) => v.valor === velocidade)?.rotulo ?? "Normal";

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
          aria-label={`Velocidade: ${rotuloAtual}`}
          aria-expanded={menuAberto}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {menuAberto && (
        <div
          className="absolute right-2 z-20 mt-1.5 w-40 rounded-xl py-1.5 shadow-xl overflow-hidden"
          style={{
            top: "100%",
            background: "rgba(18,12,8,0.97)",
            border: "1px solid rgba(200,165,107,0.28)",
          }}
          role="menu"
          aria-label="Velocidade"
        >
          <p className="px-3 pt-1 pb-1.5 text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: "rgba(200,165,107,0.7)" }}>
            Velocidade
          </p>
          {VELOCIDADES.map((item) => {
            const ativo = velocidade === item.valor;
            return (
              <button
                key={item.valor}
                type="button"
                role="menuitemradio"
                aria-checked={ativo}
                onClick={() => {
                  setVelocidade(item.valor);
                  setMenuAberto(false);
                }}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm"
                style={{
                  color: ativo ? "#f7f2ec" : "rgba(247,242,236,0.72)",
                  background: ativo ? "rgba(200,165,107,0.14)" : "transparent",
                }}
              >
                <span>{item.rotulo}</span>
                {ativo ? <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "#c8a56b" }} /> : <span className="w-3.5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
