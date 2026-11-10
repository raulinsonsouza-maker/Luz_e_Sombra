import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Bookmark, Loader2, Trash2, X } from "lucide-react";
import MobileTopBar from "@/components/MobileTopBar";
import PageIntroHeader from "@/components/PageIntroHeader";
import { listarFrasesGuardadas, removerFraseGuardada, type FraseGuardadaItem } from "@/lib/frasesGuardadas";
import { TOTAL_IMAGENS_DIA, pathImagemDia } from "@/lib/imagemDoDia";
import { toast } from "sonner";

function capaDaFrase(dia: number): string {
  if (TOTAL_IMAGENS_DIA < 1) return "/images/peao.jpeg";
  const indice = ((Math.max(1, dia) - 1) % TOTAL_IMAGENS_DIA) + 1;
  return pathImagemDia(indice);
}

function tituloCurto(frase: string): string {
  const limpa = frase.trim();
  if (limpa.length <= 72) return limpa;
  const corte = limpa.slice(0, 72);
  const ultimoEspaco = corte.lastIndexOf(" ");
  return `${(ultimoEspaco > 40 ? corte.slice(0, ultimoEspaco) : corte).trim()}…`;
}

function formatarQuando(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "short",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default function FrasesGuardadasPage() {
  const [, navigate] = useLocation();
  const [itens, setItens] = useState<FraseGuardadaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [removendo, setRemovendo] = useState<number | null>(null);
  const [aberta, setAberta] = useState<FraseGuardadaItem | null>(null);

  async function carregar() {
    setCarregando(true);
    try {
      setItens(await listarFrasesGuardadas());
    } catch {
      toast.error("Não foi possível carregar as frases guardadas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    void carregar();
  }, []);

  async function remover(dia: number) {
    setRemovendo(dia);
    try {
      await removerFraseGuardada(dia);
      setItens((atual) => atual.filter((item) => item.dia !== dia));
      if (aberta?.dia === dia) setAberta(null);
      toast.success("Frase removida das guardadas.");
    } catch {
      toast.error("Não foi possível remover a frase.");
    } finally {
      setRemovendo(null);
    }
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}>
      <MobileTopBar titulo="Frases guardadas" voltar="/perfil" />
      <div className="max-w-lg mx-auto px-4 pt-6">
        <PageIntroHeader
          eyebrow="Para revisitar"
          titulo="Suas pequenas reservas de luz."
          subtitulo="Palavras que encontraram um lugar em você. Volte a elas sempre que precisar."
          className="mb-6"
          hiddenOnMobile
        />

        <div className="md:hidden mb-6">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.55)" }}>
            Para revisitar
          </p>
          <h1 className="font-tan-mon-cheri text-2xl mb-2" style={{ color: "#f7f2ec" }}>
            Suas pequenas reservas de luz.
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
            Palavras que encontraram um lugar em você. Volte a elas sempre que precisar.
          </p>
        </div>

        {carregando ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#c8a56b" }} />
          </div>
        ) : itens.length === 0 ? (
          <div
            className="rounded-3xl p-6 text-center"
            style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.16)" }}
          >
            <Bookmark className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(200,165,107,0.55)" }} />
            <h2 className="font-tan-mon-cheri text-xl mb-2" style={{ color: "#f7f2ec" }}>
              Uma luz pode ficar com você.
            </h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(247,242,236,0.55)" }}>
              Toque em Guardar esta frase na reflexão do dia para encontrá-la aqui.
            </p>
            <button
              type="button"
              onClick={() => navigate("/reflexao")}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
            >
              Ir à reflexão de hoje
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {itens.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAberta(item)}
                className="rounded-2xl overflow-hidden text-left transition-transform active:scale-[0.98]"
                style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.16)" }}
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={capaDaFrase(item.dia)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/peao.jpeg";
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(18,12,8,0.08) 0%, rgba(18,12,8,0.35) 45%, rgba(18,12,8,0.92) 100%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-[9px] font-semibold tracking-[0.14em] uppercase mb-1.5" style={{ color: "rgba(200,165,107,0.8)" }}>
                      Dia {item.dia}
                      {item.guardadaEm ? ` · ${formatarQuando(item.guardadaEm)}` : ""}
                    </p>
                    <p className="font-tan-mon-cheri text-[0.95rem] leading-snug line-clamp-3" style={{ color: "#f7f2ec" }}>
                      {tituloCurto(item.frase)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {aberta && (
        <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            type="button"
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.72)" }}
            aria-label="Fechar"
            onClick={() => setAberta(null)}
          />
          <div
            className="relative w-full sm:max-w-md max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl"
            style={{ background: "#1a1510", border: "1px solid rgba(200,165,107,0.22)" }}
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={capaDaFrase(aberta.dia)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/peao.jpeg";
                }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(180deg, rgba(18,12,8,0.15), rgba(26,21,16,0.95))" }}
              />
              <button
                type="button"
                onClick={() => setAberta(null)}
                className="absolute top-3 right-3 p-2 rounded-full"
                style={{ background: "rgba(18,12,8,0.45)", color: "#f7f2ec" }}
                aria-label="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 pt-3">
              <p className="text-[10px] font-semibold tracking-[0.16em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.65)" }}>
                Dia {aberta.dia}
                {aberta.guardadaEm ? ` · ${formatarQuando(aberta.guardadaEm)}` : ""}
              </p>
              <h2 className="font-tan-mon-cheri text-2xl leading-snug mb-3" style={{ color: "#f7f2ec" }}>
                {aberta.frase}
              </h2>
              {aberta.reflexao && (
                <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(247,242,236,0.58)" }}>
                  {aberta.reflexao}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/reflexao")}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold"
                  style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
                >
                  Reflexão de hoje
                </button>
                <button
                  type="button"
                  onClick={() => void remover(aberta.dia)}
                  disabled={removendo === aberta.dia}
                  className="px-3 py-2.5 rounded-xl"
                  style={{ border: "1px solid rgba(200,165,107,0.28)", color: "rgba(247,242,236,0.7)", opacity: removendo === aberta.dia ? 0.6 : 1 }}
                  title="Remover"
                >
                  {removendo === aberta.dia
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
