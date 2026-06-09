import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Lock } from "lucide-react";
import { LP_GATE_SECONDS, LP_VIDEO_ID, VSL_UNLOCK_KEY } from "@/lib/lpConfig";

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLElement | string,
        config: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  getCurrentTime(): number;
  getPlayerState(): number;
  destroy(): void;
}

let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[src*="youtube.com/iframe_api"]');
    if (existing) {
      const check = setInterval(() => {
        if (window.YT?.Player) {
          clearInterval(check);
          resolve();
        }
      }, 100);
      return;
    }

    window.onYouTubeIframeAPIReady = () => resolve();
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });

  return apiLoadPromise;
}

function isUnlockedStored(): boolean {
  try {
    return sessionStorage.getItem(VSL_UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

function persistUnlock() {
  try {
    sessionStorage.setItem(VSL_UNLOCK_KEY, "1");
  } catch {
    /* ignore */
  }
}

interface Props {
  videoId?: string;
  gateSeconds?: number;
  onUnlocked?: () => void;
  onVideoStart?: () => void;
  className?: string;
  lockedLabel?: string;
  progressLabel?: (remainingSeconds: number) => string;
  unlockedLabel?: string;
}

export default function YouTubeGatedPlayer({
  videoId = LP_VIDEO_ID,
  gateSeconds = LP_GATE_SECONDS,
  onUnlocked,
  onVideoStart,
  className = "",
  lockedLabel = "Assista o vídeo para desbloquear a oferta",
  progressLabel = (remaining) =>
    remaining > 0 ? `Assista mais ${remaining}s para ver a oferta` : "Desbloqueando...",
  unlockedLabel = "Oferta desbloqueada — role para ver os detalhes",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);
  const unlockedRef = useRef(isUnlockedStored());

  const [apiReady, setApiReady] = useState(false);
  const [apiFailed, setApiFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [unlocked, setUnlocked] = useState(unlockedRef.current);
  const [fallbackSeconds, setFallbackSeconds] = useState(0);
  const [showFallbackBtn, setShowFallbackBtn] = useState(false);

  const doUnlock = useCallback(() => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    persistUnlock();
    setUnlocked(true);
    onUnlocked?.();
  }, [onUnlocked]);

  useEffect(() => {
    if (unlockedRef.current) {
      onUnlocked?.();
    }
  }, [onUnlocked]);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi()
      .then(() => {
        if (!cancelled) setApiReady(true);
      })
      .catch(() => {
        if (!cancelled) setApiFailed(true);
      });

    const timeout = setTimeout(() => {
      if (!apiReady && !window.YT?.Player) setApiFailed(true);
    }, 8000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [apiReady]);

  useEffect(() => {
    if (!apiReady || !containerRef.current || apiFailed) return;

    new window.YT!.Player(containerRef.current, {
      videoId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
      },
      events: {
        onReady: (event) => {
          playerRef.current = event.target;
        },
        onStateChange: (event) => {
          const YT = window.YT!;
          if (event.data === YT.PlayerState.PLAYING) {
            setPlaying(true);
            if (!startedRef.current) {
              startedRef.current = true;
              onVideoStart?.();
            }
          } else if (
            event.data === YT.PlayerState.PAUSED ||
            event.data === YT.PlayerState.ENDED
          ) {
            setPlaying(false);
          }
        },
      },
    });

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [apiReady, apiFailed, videoId, onVideoStart]);

  useEffect(() => {
    if (unlocked || apiFailed) return;

    pollRef.current = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        const time = p.getCurrentTime();
        setElapsed(Math.floor(time));
        if (time >= gateSeconds) doUnlock();
      } catch {
        /* ignore */
      }
    }, 1000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [unlocked, apiFailed, gateSeconds, doUnlock]);

  useEffect(() => {
    if (!apiFailed || unlocked) return;
    const t = setInterval(() => {
      setFallbackSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, [apiFailed, unlocked]);

  useEffect(() => {
    if (apiFailed && fallbackSeconds >= 25) setShowFallbackBtn(true);
  }, [apiFailed, fallbackSeconds]);

  const remaining = Math.max(0, gateSeconds - elapsed);
  const progressPct = unlocked ? 100 : Math.min(100, (elapsed / gateSeconds) * 100);

  if (apiFailed && !unlocked) {
    return (
      <div className={`relative ${className}`}>
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Vídeo de apresentação"
          />
        </div>
        {showFallbackBtn && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={doUnlock}
              className="text-sm underline transition-opacity hover:opacity-80"
              style={{ color: "rgba(200,165,107,0.7)" }}
            >
              Já assisti ao vídeo
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className="aspect-video w-full rounded-xl overflow-hidden bg-black relative"
        style={{ boxShadow: "0 12px 48px rgba(0,0,0,0.5)" }}
      >
        {!playing && !unlocked && apiReady && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
            style={{ background: "rgba(0,0,0,0.35)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ background: "rgba(200,165,107,0.25)", border: "2px solid rgba(200,165,107,0.5)" }}
            >
              <Play size={28} style={{ color: "#c8a56b", marginLeft: 3 }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "rgba(247,242,236,0.85)" }}>
              Clique para assistir
            </p>
          </div>
        )}
        <div ref={containerRef} className="w-full h-full" />
      </div>

      {!unlocked && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Lock size={14} style={{ color: "rgba(200,165,107,0.6)" }} />
              <span className="text-xs" style={{ color: "rgba(247,242,236,0.5)" }}>
                {playing
                  ? progressLabel(remaining)
                  : lockedLabel}
              </span>
            </div>
            <span className="text-xs font-mono" style={{ color: "rgba(200,165,107,0.5)" }}>
              {Math.min(elapsed, gateSeconds)}/{gateSeconds}s
            </span>
          </div>
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: "rgba(200,165,107,0.15)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progressPct}%`,
                background: "linear-gradient(90deg, #9c7742, #c8a56b)",
              }}
            />
          </div>
        </div>
      )}

      {unlocked && (
        <p className="mt-3 text-xs text-center font-medium" style={{ color: "#c8a56b" }}>
          {unlockedLabel}
        </p>
      )}
    </div>
  );
}
