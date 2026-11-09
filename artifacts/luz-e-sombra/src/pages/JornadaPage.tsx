import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import MobileTopBar from "@/components/MobileTopBar";
import PageIntroHeader from "@/components/PageIntroHeader";
import {
  CheckCircle2,
  Lock,
  ChevronRight,
  Layers,
  FlaskConical,
  Heart,
  Target,
  Sparkles,
  Hash,
  FileText,
} from "lucide-react";

interface ModuloApi {
  slug: string;
  tituloIntro: string;
  descricaoIntro: string;
  ordem: number;
  hubHref: string;
  status: "done" | "active" | "locked";
  analiseConcluida: boolean;
  minicursoConcluido: boolean;
}

const LUZES_POR_SLUG: Record<string, number> = {
  traco: 100,
  temperamento: 60,
  "linguagens-amor": 60,
  roda: 50,
  numerologia: 40,
  dossie: 80,
};

const COPY_MODULO: Record<
  string,
  { titulo: string; tagline: string; descricao: string }
> = {
  numerologia: {
    titulo: "Numerologia",
    tagline: "Conheça o significado dos seus números.",
    descricao:
      "Descubra o que sua data de nascimento revela por meio da numerologia. Explore os números relacionados à sua vida, expressão e ciclos, e conheça os significados simbólicos presentes no seu mapa numerológico.",
  },
  traco: {
    titulo: "Traço de Caráter",
    tagline: "Descubra como suas experiências influenciam quem você é.",
    descricao:
      "Conheça os cinco traços de caráter e entenda como as experiências vividas durante seu desenvolvimento podem influenciar sua maneira de pensar, sentir, reagir e se relacionar com o mundo. Realize sua análise e descubra quais traços aparecem com mais força em você.",
  },
  temperamento: {
    titulo: "Temperamento",
    tagline: "Entenda seu jeito natural de reagir ao mundo.",
    descricao:
      "Descubra quais dos quatro temperamentos aparecem com mais força em você. Compreenda como suas características influenciam suas reações, emoções, decisões e a maneira como interage com outras pessoas.",
  },
  "linguagens-amor": {
    titulo: "5 Linguagens do Amor",
    tagline: "Descubra como você expressa e recebe amor.",
    descricao:
      "Entenda quais formas de demonstração de afeto têm mais significado para você. Descubra como costuma demonstrar afeto, o que faz você se sentir amado e como essas diferenças podem influenciar seus relacionamentos.",
  },
  roda: {
    titulo: "Roda da Vida",
    tagline: "Descubra como estão as diferentes áreas da sua vida.",
    descricao:
      "Olhe para sua vida como um todo e perceba quais áreas estão em equilíbrio, quais precisam de mais atenção e onde você deseja construir mudanças. Avalie seu momento atual e reconheça os pontos que podem receber mais cuidado.",
  },
  dossie: {
    titulo: "Dossiê de Vida",
    tagline: "Conecte suas descobertas e enxergue o todo.",
    descricao:
      "Reúna os resultados das análises realizadas nesta primeira etapa e descubra como diferentes aspectos de quem você é se relacionam. Compreenda melhor seus padrões, reconheça suas potencialidades e identifique o que merece sua atenção neste momento da vida.",
  },
};

function iconePorSlug(slug: string) {
  switch (slug) {
    case "traco":
      return Layers;
    case "temperamento":
      return FlaskConical;
    case "linguagens-amor":
      return Heart;
    case "roda":
      return Target;
    case "numerologia":
      return Hash;
    case "dossie":
      return FileText;
    default:
      return Layers;
  }
}

export default function JornadaPage() {
  const [, navigate] = useLocation();
  const { status } = useAuth();
  const [modulos, setModulos] = useState<ModuloApi[]>([]);
  const [carregando, setCarregando] = useState(true);

  const buscarTudo = useCallback(async () => {
    setCarregando(true);
    try {
      const rMod = await apiFetch("/modulos-jornada");
      if (rMod.ok) setModulos(await rMod.json());
    } catch {
      /* ignore */
    }
    setCarregando(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/login");
      return;
    }
    if (status === "loading") return;
    void buscarTudo();
  }, [status, navigate, buscarTudo]);

  const inicianteOrdenado = [...modulos].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="min-h-screen pb-28 journey-forest-bg">
      <MobileTopBar titulo="Sua jornada" />
      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="mb-8">
          <PageIntroHeader
            eyebrow="Sua jornada de autoconhecimento"
            titulo="Da Sombra à Luz."
            subtitulo="O caminho para descobrir quem você é."
          />
          <p className="text-sm leading-relaxed mt-4" style={{ color: "rgba(247,242,236,0.55)" }}>
            Cada descoberta ilumina uma parte da sua história e ajuda você a compreender melhor quem é,
            como funciona e o que pode transformar.
          </p>
        </div>

        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" style={{ color: "#c8a56b" }} />
            <h2 className="text-sm font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.65)" }}>
              Análises
            </h2>
          </div>

          <div className="relative">
            <div
              className="absolute left-8 top-8 bottom-8 w-px"
              style={{
                background: "linear-gradient(to bottom, rgba(200,165,107,0.35), rgba(200,165,107,0.05))",
              }}
            />

            <div className="space-y-4">
              {carregando ? (
                <p className="text-sm pl-20" style={{ color: "rgba(247,242,236,0.35)" }}>
                  A carregar…
                </p>
              ) : (
                inicianteOrdenado.map((mod, idx) => {
                  const s = mod.status;
                  const Icon = iconePorSlug(mod.slug);
                  const num = String(idx + 1).padStart(2, "0");
                  const luzes = LUZES_POR_SLUG[mod.slug] ?? 40;
                  const copy = COPY_MODULO[mod.slug];
                  const titulo = copy?.titulo ?? mod.tituloIntro;
                  const tagline = copy?.tagline ?? "Introdução e análise";
                  const descricao = copy?.descricao ?? mod.descricaoIntro;

                  return (
                    <div key={mod.slug} className="relative flex gap-4">
                      <div className="relative z-10 shrink-0">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
                          style={{
                            background:
                              s === "done"
                                ? "linear-gradient(135deg, #c8a56b, #9c7742)"
                                : s === "active"
                                  ? "rgba(200,165,107,0.1)"
                                  : "rgba(255,255,255,0.03)",
                            border:
                              s === "done"
                                ? "2px solid #c8a56b"
                                : s === "active"
                                  ? "2px solid rgba(200,165,107,0.6)"
                                  : "2px solid rgba(255,255,255,0.06)",
                            boxShadow: s === "active" ? "0 0 22px rgba(200,165,107,0.22)" : "none",
                          }}
                        >
                          {s === "done" ? (
                            <CheckCircle2 className="w-6 h-6" style={{ color: "#1e1812" }} />
                          ) : s === "locked" ? (
                            <Lock className="w-5 h-5" style={{ color: "rgba(247,242,236,0.2)" }} />
                          ) : (
                            <Icon className="w-5 h-5" style={{ color: "#c8a56b" }} />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 pb-4">
                        <div
                          className="rounded-2xl p-4 transition-all"
                          style={{
                            background:
                              s === "done"
                                ? "linear-gradient(135deg, rgba(200,165,107,0.16), rgba(64,44,28,0.28))"
                                : s === "active"
                                  ? "linear-gradient(135deg, rgba(200,165,107,0.22), rgba(60,42,28,0.3))"
                                  : "rgba(255,255,255,0.02)",
                            border:
                              s === "done"
                                ? "1px solid rgba(200,165,107,0.2)"
                                : s === "active"
                                  ? "1px solid rgba(200,165,107,0.3)"
                                  : "1px solid rgba(255,255,255,0.04)",
                          }}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap min-w-0">
                              <span
                                className="text-[10px] font-bold tracking-widest"
                                style={{
                                  color: s === "locked" ? "rgba(247,242,236,0.2)" : "rgba(200,165,107,0.6)",
                                }}
                              >
                                {num}
                              </span>
                              {s === "done" && (
                                <span
                                  className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase"
                                  style={{ background: "rgba(93,185,122,0.15)", color: "#5db97a" }}
                                >
                                  Concluído
                                </span>
                              )}
                              {s === "locked" && (
                                <span
                                  className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase"
                                  style={{
                                    background: "rgba(255,255,255,0.04)",
                                    color: "rgba(247,242,236,0.2)",
                                  }}
                                >
                                  Bloqueado
                                </span>
                              )}
                              {s === "active" && (
                                <span
                                  className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase"
                                  style={{ background: "rgba(200,165,107,0.15)", color: "#c8a56b" }}
                                >
                                  Em andamento
                                </span>
                              )}
                            </div>
                            {s !== "locked" && (
                              <button
                                type="button"
                                onClick={() => navigate(mod.hubHref)}
                                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                                style={{
                                  background:
                                    s === "done" ? "rgba(200,165,107,0.1)" : "linear-gradient(135deg, #c8a56b, #9c7742)",
                                  color: s === "done" ? "#c8a56b" : "#1a1208",
                                  border: s === "done" ? "1px solid rgba(200,165,107,0.3)" : "none",
                                }}
                              >
                                Abrir
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <h3
                            className="font-semibold text-sm mb-1"
                            style={{ color: s === "locked" ? "rgba(247,242,236,0.25)" : "#f7f2ec" }}
                          >
                            {num} · {titulo}
                          </h3>
                          <p
                            className="text-sm leading-snug mb-2"
                            style={{
                              color: s === "locked" ? "rgba(247,242,236,0.2)" : "rgba(247,242,236,0.72)",
                            }}
                          >
                            {s === "locked" ? "Complete a análise do passo anterior." : tagline}
                          </p>
                          {s !== "locked" && (
                            <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(247,242,236,0.45)" }}>
                              {descricao}
                            </p>
                          )}
                          {s !== "locked" && (
                            <p className="text-[11px] font-medium" style={{ color: "rgba(200,165,107,0.55)" }}>
                              +{luzes} Luzes (análise)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
