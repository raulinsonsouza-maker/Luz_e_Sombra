import { useEffect, useRef, useState, type ReactNode } from "react";
import { isInAppBrowser, safeSessionStorage } from "@/lib/safeStorage";

const MOTION_SRC = "/motion/Motion.mp4";
const STORAGE_KEY = "luz_motion_intro_v3";
const FADE_MS = 520;
const MAX_MS = 16000;

/** Rotas públicas: sem vídeo de abertura. */
const ROTAS_PUBLICAS = [
  "/",
  "/vsl",
  "/checkout",
  "/login",
  "/acesso-pos-compra",
  "/esqueci-senha",
  "/redefinir-senha",
  "/admin/login",
  "/sobre-o-portal",
  "/metodologia",
  "/jornada-da-sombra-a-luz",
  "/como-funciona",
  "/contato",
  "/planos",
  "/analises",
  "/blog",
  "/autoconhecimento",
  "/padroes-de-comportamento",
  "/desenvolvimento-pessoal",
  "/inteligencia-emocional",
  "/autoconhecimento-e-relacionamentos",
  "/guia",
  "/glossario",
  "/perguntas-frequentes",
];

const ROTAS_PUBLICAS_PREFIX = ["/analises/", "/blog/", "/esqueci-senha", "/redefinir-senha"];

function pathAtual(): string {
  try {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    let path = window.location.pathname;
    if (base && base !== "/" && path.startsWith(base)) {
      path = path.slice(base.length) || "/";
    }
    return path.split("?")[0].replace(/\/$/, "") || "/";
  } catch {
    return "/";
  }
}

function isRotaPublica(path: string): boolean {
  if (ROTAS_PUBLICAS.includes(path)) return true;
  return ROTAS_PUBLICAS_PREFIX.some((p) => path.startsWith(p));
}

function jaExibidoNestaSessao(): boolean {
  try {
    return safeSessionStorage().getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function marcarExibido() {
  try {
    safeSessionStorage().setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode / Instagram WebView */
  }
}

export default function MotionIntro({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => pathAtual());
  const podeExibir = !isRotaPublica(path) && !jaExibidoNestaSessao();
  const [ativo, setAtivo] = useState(podeExibir);
  const [sumindo, setSumindo] = useState(false);
  const encerrado = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const sync = () => setPath(pathAtual());
    window.addEventListener("popstate", sync);

    // WebViews (Instagram) às vezes travam history.* como read-only.
    if (isInAppBrowser()) {
      return () => window.removeEventListener("popstate", sync);
    }

    let origPush: History["pushState"] | null = null;
    let origReplace: History["replaceState"] | null = null;
    try {
      origPush = history.pushState.bind(history);
      origReplace = history.replaceState.bind(history);
      history.pushState = (...args) => {
        origPush!(...args);
        sync();
      };
      history.replaceState = (...args) => {
        origReplace!(...args);
        sync();
      };
    } catch {
      origPush = null;
      origReplace = null;
    }

    return () => {
      window.removeEventListener("popstate", sync);
      try {
        if (origPush) history.pushState = origPush;
        if (origReplace) history.replaceState = origReplace;
      } catch {
        /* ignore */
      }
    };
  }, []);

  useEffect(() => {
    if (isRotaPublica(path)) {
      setAtivo(false);
      return;
    }
    if (!jaExibidoNestaSessao()) {
      encerrado.current = false;
      setSumindo(false);
      setAtivo(true);
    }
  }, [path]);

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
              background: "linear-gradient(135deg, #c8a56b, #9c7742)",
              color: "#1a1208",
              border: "1px solid rgba(240,209,145,0.45)",
              boxShadow: "0 8px 22px rgba(0,0,0,0.35)",
            }}
          >
            Pular
          </button>
        </div>
      ) : null}
    </>
  );
}
