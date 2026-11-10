import { useEffect, useRef, useState, type ReactNode } from "react";

const MOTION_SRC = "/motion/Motion.mp4";
const STORAGE_KEY = "luz_motion_intro_v3";
const FADE_MS = 520;
const MAX_MS = 16000;

function jaExibidoNestaSessao(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function marcarExibido() {
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode */
  }
}

export default function MotionIntro({ children }: { children: ReactNode }) {
  const [ativo, setAtivo] = useState(() => !jaExibidoNestaSessao());
  const [sumindo, setSumindo] = useState(false);
  const encerrado = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  function encerrar() {
    if (encerrado.current) return;
    encerrado.current = true;
    marcarExibido();
    setSumindo(true);
    window.setTimeout(() => setAtivo(false), FADE_MS);
  }

  useEffect(() => {
    if (!ativo) return;

    const video = videoRef.current;
    const limite = window.setTimeout(encerrar, MAX_MS);

    async function iniciar() {
      if (!video) return;
      video.muted = false;
      try {
        await video.play();
      } catch {
        video.muted = true;
        try {
          await video.play();
        } catch {
          encerrar();
        }
      }
    }

    void iniciar();
    return () => window.clearTimeout(limite);
  }, [ativo]);

  return (
    <>
      {children}
      {ativo ? (
        <div
          role="dialog"
          aria-label="Abertura Portal Iluminando"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: "#0c0906",
            opacity: sumindo ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease`,
            pointerEvents: sumindo ? "none" : "auto",
          }}
        >
          <video
            ref={videoRef}
            src={MOTION_SRC}
            className="h-full w-full object-cover"
            playsInline
            preload="auto"
            onEnded={encerrar}
            onError={encerrar}
          />
          <button
            type="button"
            onClick={encerrar}
            className="absolute bottom-8 right-6 rounded-full px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase"
            style={{
              background: "rgba(247,242,236,0.12)",
              color: "rgba(247,242,236,0.88)",
              border: "1px solid rgba(247,242,236,0.22)",
              backdropFilter: "blur(8px)",
            }}
          >
            Pular
          </button>
        </div>
      ) : null}
    </>
  );
}
