import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Share2 } from "lucide-react";
import { dataPorExtenso, fraseDoDia } from "@/lib/frasesAno";
import { compartilharFrase } from "@/lib/compartilharFrase";
import { imagemDoDia } from "@/lib/imagemDoDia";
import { toast } from "sonner";
import LogoPortal from "@/components/LogoPortal";

function tamanhoReflexao(texto: string) {
  if (texto.length > 320) return "1.15rem";
  if (texto.length > 220) return "1.35rem";
  if (texto.length > 140) return "1.6rem";
  return "1.8rem";
}

export default function ReflexaoPage() {
  const [, navigate] = useLocation();
  const hoje = fraseDoDia();
  const data = dataPorExtenso();
  const fundo = imagemDoDia();
  const [enviando, setEnviando] = useState(false);

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

  return (
    <div className="min-h-screen pb-28 journey-forest-bg">
      <div className="max-w-lg mx-auto px-4 pt-3 flex flex-col" style={{ minHeight: "calc(100vh - 7rem)" }}>
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-3 inline-flex items-center gap-2 text-xs tracking-wider uppercase self-start"
          style={{ color: "rgba(247,242,236,0.85)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Início
        </button>
        <div className="relative flex-1 overflow-hidden rounded-3xl min-h-[420px]">
          <img src={fundo} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(18,12,8,0.42) 0%, rgba(18,12,8,0.58) 46%, rgba(18,12,8,0.78) 100%)" }}
          />
          <div className="relative flex h-full min-h-[420px] flex-col items-center text-center px-8 pt-10 pb-8">
            <div className="flex flex-col items-center">
            <LogoPortal className="w-[15.5rem] h-auto" />
            </div>

            <div className="flex flex-1 w-full flex-col items-center justify-center">
              <p className="text-[11px] tracking-[0.28em] uppercase" style={{ color: "#c8a56b" }}>
                {data}
              </p>
              <p
                className="font-tan-mon-cheri text-xl leading-snug max-w-[16.5rem] mt-4"
                style={{ color: "#f7f2ec" }}
              >
                {hoje.frase}
              </p>
              <div className="my-5 h-px w-10" style={{ background: "rgba(200,165,107,0.85)" }} />
              <p
                className="font-tan-mon-cheri max-w-[18rem] leading-snug"
                style={{ color: "#f7f2ec", fontSize: tamanhoReflexao(hoje.reflexao) }}
              >
                {hoje.reflexao}
              </p>
            </div>

            <p className="mt-8 text-[11px] tracking-[0.22em] uppercase" style={{ color: "#c8a56b" }}>
              portaliluminando.com.br
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void compartilhar()}
          disabled={enviando}
          className="mt-4 w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
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
  );
}
