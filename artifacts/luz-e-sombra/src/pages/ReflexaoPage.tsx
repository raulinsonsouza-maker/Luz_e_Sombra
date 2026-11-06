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
      const modo = await compartilharFrase(hoje.reflexao);
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
        <div className="relative flex-1 overflow-hidden rounded-3xl min-h-[420px]">
          <img src={FUNDO} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(18,12,8,0.35) 0%, rgba(18,12,8,0.62) 55%, rgba(18,12,8,0.78) 100%)" }} />
          <div className="relative flex h-full min-h-[420px] flex-col px-5 py-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-xs tracking-wider uppercase self-start"
              style={{ color: "rgba(247,242,236,0.85)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              Início
            </button>
            <div className="flex flex-1 flex-col items-center justify-center text-center px-2 py-8">
              <p className="text-[11px] tracking-[0.22em] uppercase mb-4" style={{ color: "#c8a56b" }}>
                {dataPorExtenso()}
              </p>
              <p className="font-tan-mon-cheri text-xl leading-snug" style={{ color: "#f7f2ec" }}>
                {hoje.reflexao}
              </p>
            </div>
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
