import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { dataDiaMes, dataPorExtenso } from "@/lib/frasesAno";
import { buscarConteudoDia, type ConteudoDia } from "@/lib/conteudoDia";
import { momentoNumerologico, type MomentoNumerologico } from "@/lib/momentoDoDia";
import { coresSobreFoto, detectarTomLogo, srcLogo, type TomLogo } from "@/lib/tomLogoPorFundo";
import { temPercepcaoHoje } from "@/lib/percepcoes";
import { pedirLuz } from "@/lib/pedirLuz";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { useNotificacoesCount } from "@/hooks/useNotificacoesCount";
import { LuzIcon } from "@/components/LuzIcon";
import { PausaDoDiaModal } from "@/components/PausaDoDiaModal";
import {
  ChevronRight,
  Map,
  FileText,
  Leaf,
  Bookmark,
  User,
} from "lucide-react";

interface Progresso {
  luzes: number;
  conviteConcluido: boolean;
  momentoLuzHoje?: boolean;
  pausaLuzHoje?: boolean;
  jornada: {
    traco: boolean;
    temperamento?: boolean;
    roda: boolean;
    numerologia: boolean;
    linguagensAmor?: boolean;
    dossie?: boolean;
  };
}

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

const QUICK_ACTIONS = [
  { label: "Frases guardadas", sub: "Palavras para levar com você", icon: Bookmark, href: "/frases-guardadas" },
  { label: "Meu perfil", sub: "Dados e preferências", icon: User, href: "/perfil" },
] as const;

export default function HomePage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [progresso, setProgresso] = useState<Progresso | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [concluindoConvite, setConcluindoConvite] = useState(false);
  const [avisoLuz, setAvisoLuz] = useState(false);
  const [tomLogo, setTomLogo] = useState<TomLogo>("claro");
  const [conteudo, setConteudo] = useState<ConteudoDia | null>(null);
  const [abaMomento, setAbaMomento] = useState<"dia" | "mes" | "coletivo">("dia");
  const [pausaAberta, setPausaAberta] = useState(false);
  const [temPausaHoje, setTemPausaHoje] = useState(() => temPercepcaoHoje());
  const [abasMomentoVistas, setAbasMomentoVistas] = useState<Set<"dia" | "mes" | "coletivo">>(
    () => new Set(["dia"]),
  );
  const [pedindoLuzMomento, setPedindoLuzMomento] = useState(false);
  const { count: notiCount } = useNotificacoesCount();
  const hoje = conteudo;
  const fundo = conteudo?.imagemUrl ?? "";
  const cores = coresSobreFoto(tomLogo);
  const fotoClara = tomLogo === "ouro";

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/login");
      return;
    }
    if (status === "loading") return;
    buscarDados();
  }, [status, user]);

  useEffect(() => {
    let ativo = true;
    void buscarConteudoDia().then((c) => {
      if (ativo) setConteudo(c);
    });
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!fundo) return;
    let ativo = true;
    void detectarTomLogo(fundo).then((tom) => {
      if (ativo) setTomLogo(tom);
    });
    return () => {
      ativo = false;
    };
  }, [fundo]);

  async function buscarDados() {
    try {
      const resProg = await apiFetch("/gamificacao/progresso");
      if (resProg.ok) setProgresso(await resProg.json());
    } catch {
      /* noop */
    }
    setCarregando(false);
  }

  useEffect(() => {
    if (!avisoLuz) return;
    const timer = window.setTimeout(() => setAvisoLuz(false), 2600);
    return () => window.clearTimeout(timer);
  }, [avisoLuz]);

  const primeiroNome = (user?.nome || "").split(" ")[0] || "Usuário";
  const momento = user?.dataNascimento ? momentoNumerologico(user.dataNascimento) : null;

  async function concluirConvite() {
    if (progresso?.conviteConcluido || concluindoConvite) return;
    setConcluindoConvite(true);
    try {
      const res = await apiFetch("/gamificacao/convite/concluir", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok || typeof data.luzes === "number") {
        setProgresso((atual) =>
          atual
            ? { ...atual, conviteConcluido: true, luzes: data.luzes ?? atual.luzes + 1 }
            : atual,
        );
        setAvisoLuz(true);
      } else {
        toast.error("Não foi possível marcar o convite.");
      }
    } catch {
      toast.error("Não foi possível marcar o convite.");
    }
    setConcluindoConvite(false);
  }

  function onAbaMomento(aba: "dia" | "mes" | "coletivo") {
    setAbaMomento(aba);
    setAbasMomentoVistas((prev) => {
      if (prev.has(aba)) return prev;
      const next = new Set(prev);
      next.add(aba);
      return next;
    });
  }

  async function receberLuzMomento() {
    if (abasMomentoVistas.size < 3 || progresso?.momentoLuzHoje || pedindoLuzMomento) return;
    setPedindoLuzMomento(true);
    const result = await pedirLuz("momento");
    if (result.ok) {
      setProgresso((atual) =>
        atual
          ? {
              ...atual,
              luzes: result.luzes,
              momentoLuzHoje: true,
            }
          : atual,
      );
      if (result.nova) setAvisoLuz(true);
    }
    setPedindoLuzMomento(false);
  }

  const etapasInicianteConcluidas = progresso
    ? [
        progresso.jornada.numerologia,
        progresso.jornada.traco,
        progresso.jornada.temperamento === true,
        progresso.jornada.linguagensAmor === true,
        progresso.jornada.roda,
        progresso.jornada.dossie === true,
      ].filter(Boolean).length
    : 0;

  const TOTAL_ETAPAS_INICIANTE = 6;

  return (
    <div className="min-h-screen pb-28 journey-forest-bg">
      {avisoLuz && (
        <div className="pointer-events-none fixed inset-x-0 top-16 z-50 flex justify-center px-6" aria-live="polite">
          <p
            className="luz-aviso rounded-full px-5 py-3 text-sm font-semibold"
            style={{
              background: "#1f1710",
              color: "#f7f2ec",
              border: "1px solid rgba(200,165,107,0.5)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
            }}
          >
            +1 Luz
          </p>
        </div>
      )}
      <div className="max-w-lg mx-auto">
        <div className="relative overflow-hidden" style={{ minHeight: 460 }}>
          {fundo ? (
            <img src={fundo} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0" style={{ background: "#1e1812" }} />
          )}
          <div className="absolute inset-0" style={{ background: cores.velatura }} />
          <div className="relative flex min-h-[460px] flex-col px-6 pt-5 pb-8">
            <button
              type="button"
              onClick={() => navigate("/notificacoes")}
              className="absolute top-4 right-4 md:hidden flex items-center justify-center w-9 h-9 rounded-full"
              style={{
                background: fotoClara ? "rgba(247,242,236,0.55)" : "rgba(18,12,8,0.35)",
                border: fotoClara ? "1px solid rgba(95,74,47,0.25)" : "1px solid rgba(247,242,236,0.2)",
              }}
              title="Notificações"
            >
              <Bell className="w-4 h-4" style={{ color: fotoClara ? "#5f4a2f" : "#f7f2ec" }} />
              {notiCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold px-0.5"
                  style={{ background: "#c8a56b", color: "#130f09" }}
                >
                  {notiCount > 99 ? "99+" : notiCount}
                </span>
              )}
            </button>

            <div className="pr-12 md:pr-0">
              <img
                src={srcLogo(tomLogo)}
                alt="Portal Iluminando"
                className="h-auto w-[7.25rem] mb-4"
              />
              <p
                className="text-[11px] font-semibold tracking-[0.22em] uppercase"
                style={{ color: cores.destaque, textShadow: fotoClara ? "0 1px 0 rgba(255,255,255,0.55)" : "0 1px 8px rgba(0,0,0,0.35)" }}
              >
                {dataPorExtenso()}
              </p>
              <p className="text-xs tracking-[0.16em] uppercase mt-3" style={{ color: cores.apoio }}>
                {saudacao()},
              </p>
              <h1 className="font-tan-mon-cheri text-4xl leading-none mt-1" style={{ color: cores.titulo }}>
                {primeiroNome}
              </h1>
            </div>

            <div className="mt-auto flex flex-col items-center text-center pt-8">
              <p className="font-tan-mon-cheri text-2xl leading-snug max-w-[18rem]" style={{ color: "#f7f2ec", textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}>
                {hoje?.frase ?? ""}
              </p>
              <button
                type="button"
                onClick={() => navigate("/reflexao")}
                className="mt-5 rounded-full px-6 py-2.5 text-sm font-semibold"
                style={{ background: "rgba(247,242,236,0.92)", color: "#1a1208" }}
              >
                Refletir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4">

        {/* Dossiê integrado — passo 6 da jornada */}
        {etapasInicianteConcluidas >= 4 && progresso?.jornada.dossie !== true && (
          <button
            type="button"
            onClick={() => navigate("/jornada/dossie")}
            className="w-full rounded-3xl p-5 mb-4 text-left transition-all active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, rgba(93,185,122,0.08) 0%, rgba(200,165,107,0.06) 100%)",
              border: "1px solid rgba(93,185,122,0.22)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(93,185,122,0.12)" }}
              >
                <FileText className="w-5 h-5" style={{ color: "#5db97a" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold mb-1" style={{ color: "#f7f2ec" }}>
                  Dossiê de Vida — 6º passo
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
                  {etapasInicianteConcluidas >= 5
                    ? "Fase Iniciante quase completa. Abra o dossiê para ver o cruzamento de todas as análises."
                    : `${etapasInicianteConcluidas} análises prontas. Continue a jornada para desbloquear a síntese integrada.`}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 shrink-0 mt-1" style={{ color: "rgba(93,185,122,0.6)" }} />
            </div>
          </button>
        )}

        <div
          className="rounded-3xl p-5 mb-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(200,165,107,0.16)",
          }}
        >
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#5db97a" }}>
            Convite do dia
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(247,242,236,0.78)" }}>
            {hoje?.convite ?? ""}
          </p>
          <button
            type="button"
            onClick={() => void concluirConvite()}
            disabled={carregando || concluindoConvite || progresso?.conviteConcluido}
            className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2"
            style={{
              background: progresso?.conviteConcluido ? "rgba(93,185,122,0.16)" : "linear-gradient(135deg, #c8a56b, #9c7742)",
              color: progresso?.conviteConcluido ? "#5db97a" : "#1a1208",
            }}
          >
            <LuzIcon acesa={!!progresso?.conviteConcluido} className="w-5 h-5 shrink-0" />
            {progresso?.conviteConcluido ? "Luz recebida" : "Concluir meu convite"}
          </button>
        </div>

        <div
          className="rounded-3xl p-5 mb-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(200,165,107,0.16)",
          }}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-sm font-semibold" style={{ color: "#c8a56b" }}>
              Meu espaço
            </p>
            <button
              type="button"
              onClick={() => navigate("/acompanhamento")}
              className="text-xs font-semibold flex items-center gap-0.5"
              style={{ color: "rgba(200,165,107,0.7)" }}
            >
              Ver minhas percepções
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setPausaAberta(true)}
            className="w-full rounded-2xl p-3.5 text-left flex items-center gap-3 transition-all active:scale-[0.99]"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(200,165,107,0.14)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(200,165,107,0.1)" }}
            >
              <Leaf className="w-5 h-5" style={{ color: "#c8a56b" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "#f7f2ec" }}>
                {temPausaHoje ? "Seu momento foi guardado" : "Um espaço para se reconhecer."}
              </p>
              <p className="text-xs leading-relaxed mt-0.5" style={{ color: "rgba(247,242,236,0.45)" }}>
                {temPausaHoje
                  ? "Sua percepção de hoje está aqui. Você pode voltar a ela quando quiser."
                  : "Como você está se sentindo hoje? Reserve um instante para se escutar, acolher o que está presente e perceber o que acontece dentro de você."}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "rgba(200,165,107,0.4)" }} />
          </button>
        </div>

        <div
          className="rounded-3xl p-5 mb-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(200,165,107,0.16)",
          }}
        >
          <p className="text-sm font-semibold mb-3" style={{ color: "#c8a56b" }}>
            Seu momento: {momento?.dataLabel ?? dataDiaMes()}
          </p>
          {momento ? (
            <MomentoAbas
              momento={momento}
              aba={abaMomento}
              onAba={onAbaMomento}
              abasCompletas={abasMomentoVistas.size >= 3}
              luzRecebida={!!progresso?.momentoLuzHoje}
              pedindoLuz={pedindoLuzMomento}
              onReceberLuz={() => void receberLuzMomento()}
            />
          ) : (
            <div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(247,242,236,0.78)" }}>
                Para ver o seu momento de hoje, complete a data de nascimento no perfil.
              </p>
              <button
                type="button"
                onClick={() => navigate("/perfil")}
                className="text-sm font-semibold"
                style={{ color: "#c8a56b" }}
              >
                Completar perfil
              </button>
            </div>
          )}
        </div>

        {/* Explorar */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: "rgba(200,165,107,0.5)" }}>
            Continuar
          </p>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ label, sub, icon: Icon, href }) => (
              <button
                key={href}
                onClick={() => navigate(href)}
                className="rounded-2xl p-3 sm:p-4 text-left transition-all active:scale-95"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(200,165,107,0.1)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                  style={{ background: "rgba(200,165,107,0.08)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "#c8a56b" }} />
                </div>
                <p className="text-sm font-semibold leading-tight" style={{ color: "#f7f2ec" }}>
                  {label}
                </p>
                <p className="text-[11px] mt-0.5 leading-snug" style={{ color: "rgba(247,242,236,0.35)" }}>
                  {sub}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Sua Jornada */}
        {progresso && (
          <button
            onClick={() => navigate("/jornada")}
            className="w-full rounded-2xl p-4 mb-4 flex items-center gap-4 transition-all"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(200,165,107,0.1)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(200,165,107,0.08)" }}
            >
              <Map className="w-5 h-5" style={{ color: "#c8a56b" }} />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold" style={{ color: "#f7f2ec" }}>
                Sua Jornada
              </p>
              <p className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
                {etapasInicianteConcluidas} de {TOTAL_ETAPAS_INICIANTE} etapas concluídas
              </p>
            </div>
            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "rgba(200,165,107,0.35)" }} />
          </button>
        )}
      </div>

      <PausaDoDiaModal
        open={pausaAberta}
        onClose={() => setPausaAberta(false)}
        onSaved={() => setTemPausaHoje(true)}
      />
    </div>
  );
}

const ABAS_MOMENTO: { id: "dia" | "mes" | "coletivo"; label: string }[] = [
  { id: "dia", label: "Dia pessoal" },
  { id: "mes", label: "Mês pessoal" },
  { id: "coletivo", label: "Momento coletivo" },
];

function MomentoAbas({
  momento,
  aba,
  onAba,
  abasCompletas,
  luzRecebida,
  pedindoLuz,
  onReceberLuz,
}: {
  momento: MomentoNumerologico;
  aba: "dia" | "mes" | "coletivo";
  onAba: (a: "dia" | "mes" | "coletivo") => void;
  abasCompletas: boolean;
  luzRecebida: boolean;
  pedindoLuz: boolean;
  onReceberLuz: () => void;
}) {
  const bloco =
    aba === "dia" ? momento.dia : aba === "mes" ? momento.mes : momento.coletivo;
  const acoes = bloco.acoes.slice(0, 3);
  const luzLiberada = abasCompletas && !luzRecebida;

  return (
    <div>
      <div
        className="flex gap-1 p-1 rounded-2xl mb-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,165,107,0.12)" }}
        role="tablist"
        aria-label="Seu momento"
      >
        {ABAS_MOMENTO.map((item) => {
          const ativa = aba === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={ativa}
              onClick={() => onAba(item.id)}
              className="flex-1 py-2 px-1.5 rounded-xl text-[11px] sm:text-xs font-semibold transition-all leading-tight"
              style={
                ativa
                  ? {
                      background: "linear-gradient(135deg, #c8a56b, #9c7742)",
                      color: "#1a1208",
                    }
                  : { color: "rgba(247,242,236,0.45)" }
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-semibold text-lg"
          style={{
            background: "linear-gradient(135deg, rgba(200,165,107,0.28), rgba(156,119,66,0.18))",
            color: "#c8a56b",
            border: "1px solid rgba(200,165,107,0.35)",
          }}
          aria-hidden
        >
          {bloco.n}
        </div>
        <div className="min-w-0 pt-0.5">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: "#c8a56b" }}>
              {bloco.energia}
            </p>
            {(bloco.n === 11 || bloco.n === 22 || bloco.n === 33) && (
              <span
                className="text-[10px] font-semibold tracking-[0.12em] uppercase px-1.5 py-0.5 rounded-full"
                style={{
                  background: "rgba(200,165,107,0.18)",
                  color: "#c8a56b",
                  border: "1px solid rgba(200,165,107,0.35)",
                }}
              >
                Especial
              </span>
            )}
          </div>
          <p className="text-sm font-semibold leading-snug" style={{ color: "#f7f2ec" }}>
            {bloco.titulo}
          </p>
        </div>
      </div>

      <p className="text-sm leading-relaxed mb-2" style={{ color: "rgba(247,242,236,0.78)" }}>
        {bloco.descricao}
      </p>

      <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(247,242,236,0.68)" }}>
        {bloco.profundidade}
      </p>

      <div className="space-y-3 mb-4">
        <div
          className="rounded-2xl px-3.5 py-3"
          style={{
            background: "rgba(200,165,107,0.07)",
            border: "1px solid rgba(200,165,107,0.16)",
          }}
        >
          <p
            className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-1.5"
            style={{ color: "#c8a56b" }}
          >
            O que fazer
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.78)" }}>
            {bloco.clima}
          </p>
        </div>
        <div
          className="rounded-2xl px-3.5 py-3"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(200,165,107,0.12)",
          }}
        >
          <p
            className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-1.5"
            style={{ color: "rgba(200,165,107,0.8)" }}
          >
            Pontos de atenção
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.72)" }}>
            {bloco.sombra}
          </p>
        </div>
      </div>

      {bloco.palavrasChave.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {bloco.palavrasChave.map((palavra) => (
            <span
              key={palavra}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(200,165,107,0.1)",
                color: "rgba(200,165,107,0.85)",
                border: "1px solid rgba(200,165,107,0.2)",
              }}
            >
              {palavra}
            </span>
          ))}
        </div>
      )}

      <div
        className="rounded-2xl px-3.5 py-3.5 mb-4"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(200,165,107,0.14)",
        }}
      >
        <p
          className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-2"
          style={{ color: "#c8a56b" }}
        >
          Para refletir
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.78)" }}>
          {bloco.reflexao.replace(/^["“]|["”]$/g, "")}
        </p>
      </div>

      {acoes.length > 0 && (
        <div className="mb-4">
          <p
            className="text-[11px] font-semibold tracking-[0.14em] uppercase mb-2.5"
            style={{ color: "#c8a56b" }}
          >
            Convites do dia
          </p>
          <ul className="space-y-2">
            {acoes.map((acao, i) => (
              <li
                key={acao}
                className="rounded-2xl px-3.5 py-3 flex gap-3"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(200,165,107,0.12)",
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold"
                  style={{
                    background: "rgba(200,165,107,0.14)",
                    color: "#c8a56b",
                  }}
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed pt-0.5" style={{ color: "rgba(247,242,236,0.75)" }}>
                  {acao}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={onReceberLuz}
        disabled={!luzLiberada || pedindoLuz}
        className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        style={
          luzRecebida
            ? {
                background: "rgba(93,185,122,0.16)",
                color: "#5db97a",
              }
            : luzLiberada
              ? {
                  background: "linear-gradient(135deg, #c8a56b, #9c7742)",
                  color: "#1a1208",
                }
              : {
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(247,242,236,0.35)",
                  border: "1px solid rgba(247,242,236,0.1)",
                }
        }
      >
        <LuzIcon
          acesa={luzRecebida || luzLiberada}
          className="w-5 h-5 shrink-0"
        />
        {luzRecebida
          ? "Luz recebida"
          : luzLiberada
            ? "Receber minha luz"
            : "Abra as 3 abas para liberar a luz"}
      </button>
    </div>
  );
}
