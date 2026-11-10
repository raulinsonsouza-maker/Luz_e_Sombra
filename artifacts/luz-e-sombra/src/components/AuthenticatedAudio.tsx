import { useEffect, useRef, useState } from "react";
import { apiFetchGet } from "@/lib/auth";
import { Loader2, MicOff, Pause, Play } from "lucide-react";

type Props = {
  apiPath: string;
  className?: string;
};

const VELOCIDADES = [1, 1.25, 1.5, 2] as const;

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function rotuloVelocidade(v: number) {
  return v === 1 ? "1x" : `${v}x`;
}

export function AuthenticatedAudio({ apiPath, className = "" }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [velocidade, setVelocidade] = useState<(typeof VELOCIDADES)[number]>(1);

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
      className={`rounded-2xl px-3.5 py-3 ${className}`}
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
            <div className="flex items-center gap-1">
              {VELOCIDADES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVelocidade(v)}
                  className="min-w-[2rem] px-1.5 py-0.5 rounded-md text-[10px] font-semibold tabular-nums"
                  style={
                    velocidade === v
                      ? { background: "rgba(200,165,107,0.28)", color: "#f0e0c0", border: "1px solid rgba(200,165,107,0.45)" }
                      : { background: "transparent", color: "rgba(247,242,236,0.4)", border: "1px solid transparent" }
                  }
                  aria-label={`Velocidade ${rotuloVelocidade(v)}`}
                  aria-pressed={velocidade === v}
                >
                  {rotuloVelocidade(v)}
                </button>
              ))}
            </div>
            <span className="text-[10px] tabular-nums" style={{ color: "rgba(247,242,236,0.45)" }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
