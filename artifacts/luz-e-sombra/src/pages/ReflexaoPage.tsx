import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Share2 } from "lucide-react";
import { dataPorExtenso, fraseDoDia } from "@/lib/frasesAno";
import { compartilharFrase } from "@/lib/compartilharFrase";
import { toast } from "sonner";

const FUNDO = "/images/peao.jpeg";

export default function ReflexaoPage() {
  const [, navigate] = useLocation();
  const hoje = fraseDoDia();
  const [enviando, setEnviando] = useState(false);

  async function compartilhar() {
    setEnviando(true);
    try {
      const modo = await compartilharFrase(hoje.frase);
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
      <div className="max-w-lg mx-auto px-4 pt-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-4 inline-flex items-center gap-2 text-xs tracking-wider uppercase"
          style={{ color: "rgba(200,165,107,0.75)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Início
        </button>

        <div className="relative overflow-hidden rounded-3xl min-h-[420px] mb-5">
          <img src={FUNDO} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "rgba(18,12,8,0.55)" }} />
          <div className="relative flex min-h-[420px] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
            <p className="text-[11px] tracking-[0.22em] uppercase" style={{ color: "#c8a56b" }}>
              {dataPorExtenso()}
            </p>
            <p className="font-tan-mon-cheri text-2xl leading-snug" style={{ color: "#f7f2ec" }}>
              {hoje.frase}
            </p>
          </div>
        </div>

        <p className="text-[11px] tracking-[0.22em] uppercase mb-3" style={{ color: "rgba(155,120,220,0.85)" }}>
          Sua reflexão de hoje
        </p>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(247,242,236,0.78)" }}>
          {hoje.reflexao}
        </p>

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
        <p className="text-xs text-center mt-3 leading-relaxed" style={{ color: "rgba(247,242,236,0.4)" }}>
          Stories ou WhatsApp, com o link do Portal Iluminando.
        </p>
      </div>
    </div>
  );
}
