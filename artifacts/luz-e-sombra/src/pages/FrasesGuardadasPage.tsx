import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Bookmark, Loader2, Trash2 } from "lucide-react";
import MobileTopBar from "@/components/MobileTopBar";
import PageIntroHeader from "@/components/PageIntroHeader";
import { listarFrasesGuardadas, removerFraseGuardada, type FraseGuardadaItem } from "@/lib/frasesGuardadas";
import { toast } from "sonner";

function formatarQuando(iso: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
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
          eyebrow="Para revisitar com carinho"
          titulo="Suas pequenas reservas de luz."
          subtitulo="Palavras que encontraram um lugar em você. Volte a elas sempre que precisar."
          className="mb-6"
          hiddenOnMobile
        />

        <div className="md:hidden mb-6">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.55)" }}>
            Para revisitar com carinho
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
          <div className="space-y-3">
            {itens.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl p-4"
                style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.16)" }}
              >
                <p className="text-[10px] font-semibold tracking-[0.16em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.55)" }}>
                  Dia {item.dia}
                  {item.guardadaEm ? ` · ${formatarQuando(item.guardadaEm)}` : ""}
                </p>
                <p className="font-tan-mon-cheri text-lg leading-snug mb-3" style={{ color: "#f7f2ec" }}>
                  {item.frase}
                </p>
                {item.reflexao && (
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(247,242,236,0.58)" }}>
                    {item.reflexao}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/reflexao")}
                    className="flex-1 py-2.5 rounded-xl text-xs font-semibold"
                    style={{ background: "rgba(200,165,107,0.14)", color: "#e8d5b0", border: "1px solid rgba(200,165,107,0.28)" }}
                  >
                    Abrir reflexão de hoje
                  </button>
                  <button
                    type="button"
                    onClick={() => void remover(item.dia)}
                    disabled={removendo === item.dia}
                    className="px-3 py-2.5 rounded-xl"
                    style={{ border: "1px solid rgba(200,165,107,0.28)", color: "rgba(247,242,236,0.7)", opacity: removendo === item.dia ? 0.6 : 1 }}
                    title="Remover"
                  >
                    {removendo === item.dia
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
