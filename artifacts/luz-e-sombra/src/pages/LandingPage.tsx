import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { ArrowRight, Circle, Sun, BookOpen, TrendingUp, Star, Compass, Heart, Brain, Layers } from "lucide-react";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "authenticated") navigate("/dashboard");
  }, [status]);

  const handleCTA = () => navigate("/login");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 h-16 flex items-center"
        style={{ background: "rgba(15,12,9,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(200,165,107,0.12)" }}>
        <div className="max-w-6xl mx-auto px-5 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-px h-7" style={{ background: "linear-gradient(to bottom, transparent, #c8a56b, transparent)" }} />
            <span className="font-tan-mon-cheri text-lg" style={{ color: "#f7f2ec", letterSpacing: "0.03em" }}>
              Da Sombra à Luz
            </span>
          </div>
          <button onClick={handleCTA}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #9c7742, #c8a56b)", color: "#fff", letterSpacing: "0.04em", boxShadow: "0 4px 14px rgba(200,165,107,0.25)" }}>
            Entrar
          </button>
        </div>
      </nav>

      {/* ── HERO — dark ─────────────────────────────────────────── */}
      <section className="relative flex items-center overflow-hidden" style={{ minHeight: "100vh", background: "#0f0c09" }}>
        {/* Background orbs */}
        <div className="absolute pointer-events-none" style={{ top: "-20%", right: "-8%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,165,107,0.13) 0%, transparent 65%)" }} />
        <div className="absolute pointer-events-none" style={{ bottom: "-15%", left: "-8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(156,119,66,0.09) 0%, transparent 65%)" }} />

        <div className="max-w-6xl mx-auto px-5 py-20 w-full relative z-10">
          <div className="max-w-3xl">
            {/* Kicker */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8" style={{ background: "#c8a56b" }} />
              <span className="text-xs font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(200,165,107,0.7)" }}>
                Plataforma de Autoconhecimento
              </span>
            </div>

            {/* Title */}
            <h1 className="font-tan-mon-cheri mb-7" style={{ fontSize: "clamp(3.2rem, 8vw, 6.5rem)", lineHeight: 1.05, color: "#f7f2ec" }}>
              Da Sombra<br />
              <span style={{ color: "#c8a56b" }}>à Luz</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-10 max-w-xl" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.85, color: "rgba(247,242,236,0.65)" }}>
              Você sabe que existe uma versão mais plena de você. Aqui você para, olha fundo e entende — com clareza, sem julgamento — quem você realmente é.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-16">
              <button onClick={handleCTA}
                className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 50%, #9c7742 100%)", color: "#fff", letterSpacing: "0.04em", boxShadow: "0 8px 40px rgba(200,165,107,0.35)" }}>
                Começar Agora
                <ArrowRight size={18} />
              </button>
              <a href="#modulos"
                className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-medium text-base transition-all"
                style={{ border: "1px solid rgba(200,165,107,0.28)", color: "rgba(200,165,107,0.8)", textDecoration: "none" }}>
                Ver como funciona
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8" style={{ borderTop: "1px solid rgba(200,165,107,0.12)" }}>
              {[
                { n: "12", label: "Áreas da vida mapeadas" },
                { n: "48", label: "Interpretações únicas" },
                { n: "360°", label: "Visão do seu momento atual" },
              ].map(({ n, label }) => (
                <div key={label}>
                  <p className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", color: "#c8a56b", lineHeight: 1 }}>{n}</p>
                  <p className="text-xs mt-1.5 leading-snug" style={{ color: "rgba(247,242,236,0.4)", letterSpacing: "0.04em" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fade to light */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #faf8f4)" }} />
      </section>

      {/* ── MANIFESTO — light ───────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-5" style={{ background: "#faf8f4" }}>
        <div className="max-w-6xl mx-auto">

          {/* Section header */}
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "#9c7742" }}>
              Você se reconhece?
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#2f251b", lineHeight: 1.25 }}>
              Existe algo fora do lugar.<br />
              <span style={{ color: "#9c7742" }}>Mas você ainda não sabe exatamente o quê.</span>
            </h2>
          </div>

          {/* Pain point cards */}
          <div className="grid sm:grid-cols-3 gap-5 mb-14">
            {[
              { title: "Vive no automático", desc: "Os dias se repetem. Obrigações, rotina, responsabilidades. Em algum momento você parou e se perguntou: isso é tudo?" },
              { title: "Sabe que pode mais", desc: "Há uma voz clara dentro de você que diz que existe mais. Mais propósito, mais alegria, mais presença. Mas por onde começar?" },
              { title: "Repete os mesmos padrões", desc: "Relações, trabalho, escolhas financeiras — os mesmos ciclos aparecem. Como se houvesse um código que ninguém te ensinou a ler." },
            ].map(({ title, desc }) => (
              <div key={title} className="p-7 rounded-2xl"
                style={{ background: "#fff", border: "1px solid rgba(200,165,107,0.2)", boxShadow: "0 4px 24px rgba(156,119,66,0.08)" }}>
                <div className="w-8 h-0.5 mb-5" style={{ background: "linear-gradient(90deg, #c8a56b, transparent)" }} />
                <h3 className="font-tan-mon-cheri text-xl mb-3" style={{ color: "#2f251b" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(47,37,27,0.6)" }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Statement */}
          <div className="text-center py-10 px-5 rounded-3xl"
            style={{ background: "linear-gradient(135deg, rgba(200,165,107,0.1), rgba(156,119,66,0.07))", border: "1px solid rgba(200,165,107,0.25)" }}>
            <p className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", color: "#2f251b", lineHeight: 1.55 }}>
              O autoconhecimento não é luxo.<br />
              <span style={{ color: "#9c7742" }}>É o caminho mais curto para uma vida que faz sentido.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── MÓDULOS — dark ──────────────────────────────────────── */}
      <section id="modulos" className="py-20 sm:py-28 px-5" style={{ background: "#0f0c09" }}>
        <div className="max-w-6xl mx-auto">

          <div className="mb-14">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(200,165,107,0.6)" }}>
              Os Módulos
            </p>
            <h2 className="font-tan-mon-cheri mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f7f2ec", lineHeight: 1.2 }}>
              Três ferramentas.<br />Uma jornada completa.
            </h2>
            <p className="text-sm leading-relaxed max-w-md" style={{ color: "rgba(247,242,236,0.45)" }}>
              Cada módulo ilumina uma dimensão diferente de quem você é. Juntos, criam um mapa completo da sua vida interior e exterior.
            </p>
          </div>

          {/* Module 1 — wide */}
          <div className="rounded-2xl p-7 sm:p-12 mb-5 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(200,165,107,0.09), rgba(156,119,66,0.04))", border: "1px solid rgba(200,165,107,0.22)" }}>
            <div className="absolute pointer-events-none" style={{ top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,165,107,0.09), transparent 70%)" }} />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(200,165,107,0.12)", border: "1px solid rgba(200,165,107,0.22)" }}>
                <Circle size={18} style={{ color: "#c8a56b" }} />
              </div>
              <div>
                <p className="text-xs tracking-[0.3em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.5)" }}>Módulo 01</p>
                <p className="font-tan-mon-cheri text-lg" style={{ color: "#f7f2ec" }}>Roda da Vida</p>
              </div>
            </div>

            <h3 className="font-tan-mon-cheri mb-3" style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)", color: "#f7f2ec", lineHeight: 1.3 }}>
              Um raio-x honesto de todas as áreas da sua vida
            </h3>
            <p className="text-sm leading-relaxed mb-8 max-w-xl" style={{ color: "rgba(247,242,236,0.5)" }}>
              Veja exatamente onde está sua energia — e onde você está se sabotando sem perceber. 12 áreas com perguntas de reflexão profunda, âncoras comportamentais e interpretação personalizada baseada na sua pontuação real.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: Heart, label: "Plenitude e Felicidade" },
                { icon: Star, label: "Espiritualidade" },
                { icon: Brain, label: "Equilíbrio Emocional" },
                { icon: TrendingUp, label: "Realização e Propósito" },
                { icon: Compass, label: "Desenvolvimento Amoroso" },
                { icon: Layers, label: "+ 7 outras áreas essenciais" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl"
                  style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.12)" }}>
                  <Icon size={13} style={{ color: "#c8a56b", flexShrink: 0 }} />
                  <span className="text-xs leading-snug" style={{ color: "rgba(247,242,236,0.6)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modules 2 & 3 */}
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Module 2 */}
            <div className="rounded-2xl p-7 sm:p-10 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(156,119,66,0.07), rgba(200,165,107,0.03))", border: "1px solid rgba(200,165,107,0.15)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.18)" }}>
                  <BookOpen size={17} style={{ color: "#c8a56b" }} />
                </div>
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.5)" }}>Módulo 02</p>
                  <p className="font-tan-mon-cheri text-base" style={{ color: "#f7f2ec" }}>Numerologia</p>
                </div>
              </div>
              <h3 className="font-tan-mon-cheri text-xl mb-3" style={{ color: "#f7f2ec", lineHeight: 1.35 }}>
                Os códigos da sua data de nascimento
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(247,242,236,0.45)" }}>
                Sua missão, seus talentos e os padrões que moldam suas escolhas — escritos no dia em que você nasceu. Análise do número de vida, ano pessoal e mapa mensal detalhado.
              </p>
              <ul className="space-y-2.5">
                {["Número de vida com análise profunda", "Ano pessoal e universal", "Mapa mensal com reflexão e ações", "Números mestres 11, 22 e 33 preservados"].map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#c8a56b" }} />
                    <span className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Module 3 */}
            <div className="rounded-2xl p-7 sm:p-10 relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(200,165,107,0.05), rgba(156,119,66,0.03))", border: "1px solid rgba(200,165,107,0.15)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.18)" }}>
                  <TrendingUp size={17} style={{ color: "#c8a56b" }} />
                </div>
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.5)" }}>Módulo 03</p>
                  <p className="font-tan-mon-cheri text-base" style={{ color: "#f7f2ec" }}>Histórico de Evolução</p>
                </div>
              </div>
              <h3 className="font-tan-mon-cheri text-xl mb-3" style={{ color: "#f7f2ec", lineHeight: 1.35 }}>
                Acompanhe sua transformação ao longo do tempo
              </h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(247,242,236,0.45)" }}>
                Cada avaliação é um registro fiel do seu momento. O histórico revela o que mudou — e o que ainda pede atenção — área por área, ao longo do tempo.
              </p>
              <ul className="space-y-2.5">
                {["Linha do tempo de todas as avaliações", "Comparativo por área entre datas", "Identificação de padrões e recorrências", "Visão clara do seu progresso real"].map(item => (
                  <li key={item} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#c8a56b" }} />
                    <span className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA — light ────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-5" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "#9c7742" }}>
              Como Funciona
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#2f251b", lineHeight: 1.2 }}>
              Simples. Profundo. Transformador.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-10 sm:gap-6">
            {[
              { step: "01", title: "Crie seu perfil", desc: "Nome e data de nascimento. Em menos de um minuto você está dentro — e o sistema já começa a personalizar sua experiência." },
              { step: "02", title: "Avalie sua vida", desc: "12 áreas, perguntas de reflexão profunda. Seja completamente honesto — não existe certo ou errado, apenas o que você genuinamente sente." },
              { step: "03", title: "Receba clareza", desc: "Um diagnóstico completo, visual e personalizado. Mais análise numerológica, histórico de evolução e próximos passos concretos." },
            ].map(({ step, title, desc }, i) => (
              <div key={step} className="flex gap-5">
                <div className="flex-shrink-0">
                  <p className="font-tan-mon-cheri" style={{ fontSize: "3.5rem", color: "rgba(200,165,107,0.18)", lineHeight: 1 }}>{step}</p>
                </div>
                <div className="pt-1">
                  {i < 2 && (
                    <div className="hidden sm:block absolute" />
                  )}
                  <h3 className="font-tan-mon-cheri text-xl mb-2.5" style={{ color: "#2f251b" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(47,37,27,0.55)" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE — dark ────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1208 0%, #0f0c09 50%, #140f07 100%)" }}>
        <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,165,107,0.06), transparent 65%)" }} />
        <div className="max-w-2xl mx-auto text-center relative">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(200,165,107,0.3))" }} />
            <Sun size={18} style={{ color: "#c8a56b", opacity: 0.7 }} />
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(200,165,107,0.3), transparent)" }} />
          </div>
          <blockquote className="font-tan-mon-cheri italic mb-8"
            style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", lineHeight: 1.65, color: "rgba(247,242,236,0.85)" }}>
            "A maior jornada que você pode fazer é a jornada para dentro de si mesmo. É lá que estão todas as respostas que você procurou fora."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-px" style={{ background: "rgba(200,165,107,0.4)" }} />
            <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>Da Sombra à Luz</p>
            <div className="w-6 h-px" style={{ background: "rgba(200,165,107,0.4)" }} />
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS — light ─────────────────────────────────── */}
      <section className="py-20 sm:py-28 px-5" style={{ background: "#faf8f4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "#9c7742" }}>
              Por que é diferente
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#2f251b", lineHeight: 1.2 }}>
              Feito para gerar clareza real.
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              { num: "48", label: "interpretações únicas", desc: "Cada área, em cada nível de pontuação, recebe uma análise exclusiva. Nada genérico." },
              { num: "12", label: "dimensões da vida", desc: "Da espiritualidade às finanças, do amor próprio às relações — uma visão completa." },
              { num: "100%", label: "foco em clareza", desc: "Sem jargão, sem esoterismo vago. Interpretações diretas, humanas e acionáveis." },
              { num: "1", label: "passo de cada vez", desc: "A plataforma te guia com calma — sem sobrecarga, sem julgamento, no seu ritmo." },
            ].map(({ num, label, desc }) => (
              <div key={label} className="p-6 rounded-2xl"
                style={{ background: "#fff", border: "1px solid rgba(200,165,107,0.18)", boxShadow: "0 4px 20px rgba(156,119,66,0.07)" }}>
                <p className="font-tan-mon-cheri mb-1" style={{ fontSize: "2.4rem", color: "#c8a56b", lineHeight: 1 }}>{num}</p>
                <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: "rgba(156,119,66,0.7)" }}>{label}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(47,37,27,0.5)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA — dark ────────────────────────────────────── */}
      <section className="py-20 sm:py-32 px-5 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1e1812 0%, #2f251b 50%, #1a1208 100%)" }}>
        <div className="absolute pointer-events-none" style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 900, height: 600, background: "radial-gradient(ellipse, rgba(200,165,107,0.09), transparent 65%)" }} />
        <div className="max-w-xl mx-auto relative">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-6" style={{ color: "rgba(200,165,107,0.6)" }}>
            Comece Agora
          </p>
          <h2 className="font-tan-mon-cheri mb-6" style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", color: "#f7f2ec", lineHeight: 1.15 }}>
            Sua jornada começa<br />
            <span style={{ color: "#c8a56b" }}>com uma escolha</span>
          </h2>
          <p className="text-base leading-relaxed mb-10" style={{ color: "rgba(247,242,236,0.5)" }}>
            Cada avaliação que você faz é um ato de coragem. A clareza que você busca está mais próxima do que você imagina.
          </p>
          <button onClick={handleCTA}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 rounded-2xl font-bold text-base transition-all hover:-translate-y-1"
            style={{ background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 50%, #9c7742 100%)", color: "#fff", letterSpacing: "0.05em", boxShadow: "0 12px 50px rgba(200,165,107,0.35)", fontSize: "1.05rem" }}>
            Acessar o Sistema
            <ArrowRight size={20} />
          </button>
          <p className="text-xs mt-5" style={{ color: "rgba(247,242,236,0.2)", letterSpacing: "0.08em" }}>
            Acesso imediato · Plataforma completa · Sem compromisso
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="py-8 px-5 text-center" style={{ background: "#0a0805", borderTop: "1px solid rgba(200,165,107,0.08)" }}>
        <p className="font-tan-mon-cheri mb-1.5" style={{ fontSize: "1rem", color: "rgba(200,165,107,0.4)" }}>
          Da Sombra à Luz
        </p>
        <p className="text-xs tracking-[0.15em]" style={{ color: "rgba(247,242,236,0.18)" }}>
          PLATAFORMA DE AUTOCONHECIMENTO
        </p>
      </footer>

    </div>
  );
}
