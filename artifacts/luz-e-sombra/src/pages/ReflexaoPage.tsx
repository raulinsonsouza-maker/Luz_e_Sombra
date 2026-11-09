import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import MobileTopBar from "@/components/MobileTopBar";
import { dataCurta, fraseDoDia } from "@/lib/frasesAno";
import { compartilharFrase } from "@/lib/compartilharFrase";
import { imagemDoDia } from "@/lib/imagemDoDia";
import { alternarFraseGuardada, statusFraseGuardada } from "@/lib/frasesGuardadas";
import { coresSobreFoto, detectarTomLogo, srcLogo, type TomLogo } from "@/lib/tomLogoPorFundo";
import { toast } from "sonner";

function tamanhoFrase(texto: string) {
  if (texto.length > 140) return "1.55rem";
  if (texto.length > 100) return "1.7rem";
  if (texto.length > 70) return "1.85rem";
  return "2rem";
}

function tamanhoReflexao(texto: string) {
  if (texto.length > 320) return "0.95rem";
  if (texto.length > 220) return "1.05rem";
  if (texto.length > 140) return "1.15rem";
  return "1.25rem";
}

export default function ReflexaoPage() {
  const [, navigate] = useLocation();
  const hoje = fraseDoDia();
  const data = dataCurta();
  const fundo = imagemDoDia();
  const [enviando, setEnviando] = useState(false);
  const [tomLogo, setTomLogo] = useState<TomLogo>("claro");
  const [guardada, setGuardada] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const cores = coresSobreFoto(tomLogo);
  const fotoClara = tomLogo === "ouro";

  useEffect(() => {
    let ativo = true;
    void detectarTomLogo(fundo).then((tom) => {
      if (ativo) setTomLogo(tom);
    });
    return () => {
      ativo = false;
    };
  }, [fundo]);

  useEffect(() => {
    let ativo = true;
    void statusFraseGuardada(hoje.dia).then((ok) => {
      if (ativo) setGuardada(ok);
    });
    return () => {
      ativo = false;
    };
  }, [hoje.dia]);

  async function compartilhar() {
    setEnviando(true);
    try {
      const modo = await compartilharFrase(hoje.reflexao, data, fundo, hoje.frase);
      if (modo === "whatsapp") {
        toast.success("Texto copiado. O WhatsApp abriu com o link do portal.");
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      toast.error("Não foi possível abrir o compartilhamento.");
    } finally {
      setEnviando(false);
    }
  }

  async function alternarGuardar() {
    if (salvando) return;
    setSalvando(true);
    try {
      const proximo = await alternarFraseGuardada(hoje, guardada);
      setGuardada(proximo);
      toast.success(proximo
        ? "Uma luz guardada para quando precisar."
        : "Frase removida das guardadas.");
    } catch {
      toast.error("Não foi possível atualizar as frases guardadas.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen pb-28 journey-forest-bg">
      <MobileTopBar titulo="Reflexão" voltar="/dashboard" />
      <div className="max-w-lg mx-auto px-4 pt-4 flex flex-col" style={{ minHeight: "calc(100vh - 7rem)" }}>
        <div className="relative flex-1 overflow-hidden rounded-3xl min-h-[420px]">
          <img src={fundo} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: cores.velatura }} />
          <div className="relative flex h-full min-h-[420px] flex-col items-center text-center px-7 pt-8 pb-6">
            <div className="flex flex-1 w-full flex-col items-center justify-center">
              <p
                className="text-[12px] tracking-[0.18em] uppercase font-semibold"
                style={{
                  color: cores.destaque,
                  textShadow: fotoClara ? "0 1px 0 rgba(255,255,255,0.55)" : "0 1px 8px rgba(0,0,0,0.35)",
                }}
              >
                {data}
              </p>
              <p
                className="font-tan-mon-cheri leading-snug max-w-[17.5rem] mt-5"
                style={{
                  color: fotoClara ? cores.titulo : "#f7f2ec",
                  fontSize: tamanhoFrase(hoje.frase),
                  textShadow: fotoClara ? "none" : "0 2px 14px rgba(0,0,0,0.4)",
                }}
              >
                {hoje.frase}
              </p>
              <div
                className="my-5 h-px w-10"
                style={{ background: fotoClara ? "rgba(95,74,47,0.55)" : "rgba(200,165,107,0.85)" }}
              />
              <p
                className="font-tan-mon-cheri max-w-[18.5rem] leading-relaxed"
                style={{
                  color: fotoClara ? cores.apoio : "rgba(247,242,236,0.92)",
                  fontSize: tamanhoReflexao(hoje.reflexao),
                }}
              >
                {hoje.reflexao}
              </p>
            </div>

            <div className="mt-6 flex flex-col items-center gap-1.5">
              <p
                className="text-[10px] font-semibold tracking-[0.28em] uppercase"
                style={{ color: "#e8d5b0", textShadow: "0 1px 10px rgba(0,0,0,0.45)" }}
              >
                Letícia Galloni
              </p>
              <img
                src={srcLogo("claro")}
                alt="Portal Iluminando"
                className="h-auto w-[6.5rem] opacity-95"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={() => void alternarGuardar()}
            disabled={salvando}
            aria-pressed={guardada}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{
              background: guardada ? "rgba(200,165,107,0.16)" : "transparent",
              border: "1px solid rgba(200,165,107,0.45)",
              color: "#e8d5b0",
              opacity: salvando ? 0.7 : 1,
            }}
          >
            {guardada ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {guardada ? "Frase guardada" : "Guardar esta frase"}
          </button>
          <button
            type="button"
            onClick={() => void compartilhar()}
            disabled={enviando}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #c8a56b, #9c7742)",
              color: "#1a1208",
              opacity: enviando ? 0.7 : 1,
            }}
          >
            <Share2 className="w-4 h-4" />
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  );
}
