import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import {
  ArrowRight, Circle, Sun, BookOpen, TrendingUp,
  Star, Compass, Heart, Brain, Layers,
} from "lucide-react";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "authenticated") navigate("/dashboard");
  }, [status]);

  const handleCTA = () => navigate("/login");

  return (
    <div style={{ background: "#0f0c09", color: "#f7f2ec", fontFamily: "system-ui, sans-serif" }}>

      {/* ── TOP NAV ──────────────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(15,12,9,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(200,165,107,0.12)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 1, height: 28, background: "linear-gradient(to bottom, transparent, #c8a56b, transparent)" }} />
            <span className="font-tan-mon-cheri" style={{ fontSize: "1.1rem", color: "#f7f2ec", letterSpacing: "0.03em" }}>
              Da Sombra à Luz
            </span>
          </div>
          <button
            onClick={handleCTA}
            style={{
              padding: "8px 24px", borderRadius: 8,
              background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 100%)",
              color: "#fff", fontWeight: 600, fontSize: "0.85rem",
              letterSpacing: "0.05em", border: "none", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(200,165,107,0.25)",
            }}
          >
            Acessar Sistema
          </button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Background orbs */}
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,165,107,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-15%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(156,119,66,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "40%", left: "50%", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,165,107,0.04) 0%, transparent 60%)", transform: "translateX(-50%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ maxWidth: 820 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <div style={{ width: 32, height: 1, background: "#c8a56b" }} />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,165,107,0.7)" }}>
                Plataforma de Autoconhecimento
              </span>
            </div>

            <h1 className="font-tan-mon-cheri" style={{
              fontSize: "clamp(3.5rem, 8vw, 7rem)", lineHeight: 1.05,
              marginBottom: 28, color: "#f7f2ec",
              textShadow: "0 0 80px rgba(200,165,107,0.1)",
            }}>
              Da Sombra<br />
              <span style={{ color: "#c8a56b" }}>à Luz</span>
            </h1>

            <p style={{
              fontSize: "clamp(1.1rem, 2vw, 1.35rem)", lineHeight: 1.75,
              color: "rgba(247,242,236,0.6)", maxWidth: 580, marginBottom: 48,
            }}>
              Uma jornada estruturada de autoconhecimento profundo — com ferramentas que revelam quem você é, o que bloqueia seu crescimento e onde está seu maior potencial.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
              <button
                onClick={handleCTA}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "18px 40px", borderRadius: 12,
                  background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 50%, #9c7742 100%)",
                  color: "#fff", fontWeight: 700, fontSize: "1rem",
                  letterSpacing: "0.05em", border: "none", cursor: "pointer",
                  boxShadow: "0 8px 40px rgba(200,165,107,0.35)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
              >
                Começar Minha Jornada
                <ArrowRight size={18} />
              </button>
              <a
                href="#modulos"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "18px 32px", borderRadius: 12,
                  border: "1px solid rgba(200,165,107,0.25)",
                  color: "rgba(200,165,107,0.75)", fontSize: "0.95rem",
                  fontWeight: 500, cursor: "pointer", textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.6)"; (e.currentTarget as HTMLElement).style.color = "#c8a56b"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.25)"; (e.currentTarget as HTMLElement).style.color = "rgba(200,165,107,0.75)"; }}
              >
                Conhecer os módulos
              </a>
            </div>

            {/* Social proof strip */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 32, marginTop: 64, paddingTop: 40, borderTop: "1px solid rgba(200,165,107,0.1)" }}>
              {[
                { numero: "12", label: "Áreas da vida mapeadas" },
                { numero: "33", label: "Números analisados em profundidade" },
                { numero: "360°", label: "Visão do seu momento atual" },
              ].map(({ numero, label }) => (
                <div key={label}>
                  <p className="font-tan-mon-cheri" style={{ fontSize: "2rem", color: "#c8a56b", lineHeight: 1 }}>{numero}</p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(247,242,236,0.4)", marginTop: 4, letterSpacing: "0.05em" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, transparent, #0f0c09)", pointerEvents: "none" }} />
      </section>

      {/* ── MANIFESTO ────────────────────────────────────────────────── */}
      <section style={{ background: "#0d0a07", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 64 }}>
            {[
              { title: "Você sente que vive no piloto automático?", desc: "Os dias passam, as obrigações se acumulam, e a sensação de que existe algo mais — algo seu — vai ficando para depois." },
              { title: "Sabe que pode mais, mas não sabe por onde começar?", desc: "Há clareza de que algo precisa mudar, mas sem um mapa, a jornada parece grande demais para começar hoje." },
              { title: "Repete os mesmos padrões e não entende por quê?", desc: "Relações, trabalho, finanças — os mesmos ciclos se repetem. Como se houvesse um código que ninguém te ensinou a ler." },
            ].map(({ title, desc }) => (
              <div key={title} style={{
                padding: 32, borderRadius: 20,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(200,165,107,0.1)",
              }}>
                <div style={{ width: 32, height: 2, background: "linear-gradient(90deg, #c8a56b, transparent)", marginBottom: 20 }} />
                <h3 className="font-tan-mon-cheri" style={{ fontSize: "1.2rem", color: "#f7f2ec", marginBottom: 12, lineHeight: 1.4 }}>{title}</h3>
                <p style={{ fontSize: "0.9rem", color: "rgba(247,242,236,0.45)", lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Divider statement */}
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, marginBottom: 32 }}>
              <div style={{ flex: 1, maxWidth: 120, height: 1, background: "linear-gradient(90deg, transparent, rgba(200,165,107,0.4))" }} />
              <Sun size={20} style={{ color: "#c8a56b", opacity: 0.7 }} />
              <div style={{ flex: 1, maxWidth: 120, height: 1, background: "linear-gradient(90deg, rgba(200,165,107,0.4), transparent)" }} />
            </div>
            <p className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#f7f2ec", maxWidth: 680, margin: "0 auto", lineHeight: 1.5 }}>
              O autoconhecimento não é luxo.<br />
              <span style={{ color: "#c8a56b" }}>É o caminho mais curto para uma vida que faz sentido.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ── MÓDULOS ──────────────────────────────────────────────────── */}
      <section id="modulos" style={{ padding: "100px 24px", background: "#0f0c09" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 64 }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,165,107,0.6)", marginBottom: 16 }}>
              Os Módulos
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f7f2ec", marginBottom: 16, lineHeight: 1.2 }}>
              Três ferramentas.<br />Uma jornada completa.
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(247,242,236,0.45)", maxWidth: 480, lineHeight: 1.8 }}>
              Cada módulo ilumina uma dimensão diferente de quem você é. Juntos, criam um mapa completo da sua vida interior e exterior.
            </p>
          </div>

          {/* Module 1 — Roda da Vida */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24, marginBottom: 24,
          }}>
            <div style={{
              gridColumn: "span 2",
              padding: "48px", borderRadius: 24,
              background: "linear-gradient(135deg, rgba(200,165,107,0.08) 0%, rgba(156,119,66,0.04) 100%)",
              border: "1px solid rgba(200,165,107,0.2)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,165,107,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(200,165,107,0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(200,165,107,0.2)" }}>
                  <Circle size={20} style={{ color: "#c8a56b" }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,165,107,0.5)", marginBottom: 2 }}>Módulo 01</p>
                  <p className="font-tan-mon-cheri" style={{ fontSize: "1.3rem", color: "#f7f2ec" }}>Roda da Vida</p>
                </div>
              </div>

              <h3 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.5rem, 2.5vw, 2rem)", color: "#f7f2ec", marginBottom: 16, lineHeight: 1.3 }}>
                Um raio-x honesto das 12 dimensões da sua vida
              </h3>
              <p style={{ fontSize: "0.95rem", color: "rgba(247,242,236,0.5)", lineHeight: 1.85, marginBottom: 32, maxWidth: 540 }}>
                A Roda da Vida mapeia com precisão onde você está hoje em cada área essencial da existência. Mais do que um simples diagnóstico: cada área vem com perguntas de reflexão profunda, âncoras comportamentais e uma interpretação personalizada baseada na sua pontuação.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                {[
                  { icon: Heart, label: "Plenitude e Felicidade" },
                  { icon: Star, label: "Espiritualidade" },
                  { icon: Brain, label: "Equilíbrio Emocional" },
                  { icon: TrendingUp, label: "Realização e Propósito" },
                  { icon: Compass, label: "Desenvolvimento Amoroso" },
                  { icon: Layers, label: "+ 7 outras áreas essenciais" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.12)" }}>
                    <Icon size={14} style={{ color: "#c8a56b", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.78rem", color: "rgba(247,242,236,0.6)", lineHeight: 1.3 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modules 2 & 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>

            {/* Module 2 — Numerologia */}
            <div style={{
              padding: 40, borderRadius: 24,
              background: "linear-gradient(135deg, rgba(156,119,66,0.07) 0%, rgba(200,165,107,0.03) 100%)",
              border: "1px solid rgba(200,165,107,0.15)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", bottom: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,165,107,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(200,165,107,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(200,165,107,0.18)" }}>
                  <BookOpen size={18} style={{ color: "#c8a56b" }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,165,107,0.5)", marginBottom: 2 }}>Módulo 02</p>
                  <p className="font-tan-mon-cheri" style={{ fontSize: "1.1rem", color: "#f7f2ec" }}>Numerologia</p>
                </div>
              </div>

              <h3 className="font-tan-mon-cheri" style={{ fontSize: "1.4rem", color: "#f7f2ec", marginBottom: 12, lineHeight: 1.35 }}>
                Os códigos ocultos da sua data de nascimento
              </h3>
              <p style={{ fontSize: "0.88rem", color: "rgba(247,242,236,0.45)", lineHeight: 1.85, marginBottom: 24 }}>
                A numerologia revela sua missão de vida, seus talentos naturais e os desafios que moldam sua jornada. A análise vai dos arquétipos permanentes ao mapa energético mês a mês para 2025 e 2026.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Número de vida com análise profunda",
                  "Ano pessoal e universal",
                  "Mapa mensal com profundidade e reflexão",
                  "Números mestres 11, 22 e 33 preservados",
                ].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#c8a56b", marginTop: 7, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.82rem", color: "rgba(247,242,236,0.55)", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Module 3 — Histórico */}
            <div style={{
              padding: 40, borderRadius: 24,
              background: "linear-gradient(135deg, rgba(200,165,107,0.05) 0%, rgba(156,119,66,0.03) 100%)",
              border: "1px solid rgba(200,165,107,0.15)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: -30, left: -30, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,165,107,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(200,165,107,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(200,165,107,0.18)" }}>
                  <TrendingUp size={18} style={{ color: "#c8a56b" }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,165,107,0.5)", marginBottom: 2 }}>Módulo 03</p>
                  <p className="font-tan-mon-cheri" style={{ fontSize: "1.1rem", color: "#f7f2ec" }}>Histórico de Evolução</p>
                </div>
              </div>

              <h3 className="font-tan-mon-cheri" style={{ fontSize: "1.4rem", color: "#f7f2ec", marginBottom: 12, lineHeight: 1.35 }}>
                Acompanhe sua transformação ao longo do tempo
              </h3>
              <p style={{ fontSize: "0.88rem", color: "rgba(247,242,236,0.45)", lineHeight: 1.85, marginBottom: 24 }}>
                Cada avaliação é um registro fiel de um momento da sua vida. O histórico revela sua trajetória real, área por área, com gráficos que tornam visível o que mudou — e o que ainda pede atenção.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Linha do tempo de todas as avaliações",
                  "Gráfico de evolução da média geral",
                  "Comparativo por área entre datas",
                  "Identifica padrões e recorrências",
                ].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#c8a56b", marginTop: 7, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.82rem", color: "rgba(247,242,236,0.55)", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ─────────────────────────────────────────────── */}
      <section style={{ background: "#0d0a07", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,165,107,0.6)", marginBottom: 16 }}>
              Como Funciona
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f7f2ec", lineHeight: 1.2 }}>
              Simples. Profundo. Transformador.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 40, position: "relative" }}>
            {[
              {
                step: "01",
                title: "Crie seu perfil",
                desc: "Informe seu nome e data de nascimento. Esses dados alimentam automaticamente todas as análises numerológicas e personalizam sua jornada.",
              },
              {
                step: "02",
                title: "Faça sua avaliação",
                desc: "Responda honestamente às 12 áreas da Roda da Vida, guiado por perguntas de reflexão profunda e âncoras comportamentais concretas.",
              },
              {
                step: "03",
                title: "Receba sua análise",
                desc: "Acesse um diagnóstico completo: radar visual, interpretação personalizada por área com próximos passos, e evolução ao longo do tempo.",
              },
            ].map(({ step, title, desc }, i) => (
              <div key={step} style={{ position: "relative" }}>
                {i < 2 && (
                  <div style={{
                    display: "none",
                    position: "absolute", top: 28, left: "calc(100% + 0px)", width: "40px", height: 1,
                    background: "linear-gradient(90deg, rgba(200,165,107,0.4), transparent)",
                  }} className="step-arrow" />
                )}
                <div style={{ display: "flex", gap: 20 }}>
                  <div style={{ flexShrink: 0 }}>
                    <p className="font-tan-mon-cheri" style={{ fontSize: "3rem", color: "rgba(200,165,107,0.15)", lineHeight: 1 }}>{step}</p>
                  </div>
                  <div>
                    <h3 className="font-tan-mon-cheri" style={{ fontSize: "1.25rem", color: "#f7f2ec", marginBottom: 12, marginTop: 4 }}>{title}</h3>
                    <p style={{ fontSize: "0.88rem", color: "rgba(247,242,236,0.45)", lineHeight: 1.85 }}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE SECTION ─────────────────────────────────────────────── */}
      <section style={{
        padding: "100px 24px",
        background: "linear-gradient(135deg, #1a1208 0%, #0f0c09 50%, #140f07 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,165,107,0.05) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 40 }}>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(200,165,107,0.3))" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#c8a56b", opacity: 0.6 }} />
            <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(200,165,107,0.3), transparent)" }} />
          </div>

          <blockquote className="font-tan-mon-cheri" style={{
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)", lineHeight: 1.6,
            color: "rgba(247,242,236,0.85)", fontStyle: "italic", marginBottom: 32,
          }}>
            "A maior viagem que você pode fazer é a viagem para dentro de si mesmo. É lá que estão todas as respostas que você procurou fora."
          </blockquote>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 24, height: 1, background: "rgba(200,165,107,0.4)" }} />
            <p style={{ fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,165,107,0.5)" }}>Da Sombra à Luz</p>
            <div style={{ width: 24, height: 1, background: "rgba(200,165,107,0.4)" }} />
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS ─────────────────────────────────────────────── */}
      <section style={{ background: "#0f0c09", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {[
              { num: "48", unit: "", label: "interpretações únicas", desc: "Cada área recebe análise específica para cada nível de pontuação. Nada genérico, tudo personalizado." },
              { num: "12", unit: "", label: "dimensões da vida", desc: "Da espiritualidade às finanças, do amor próprio às relações — uma visão verdadeiramente completa." },
              { num: "100%", unit: "", label: "foco em clareza", desc: "Sem jargão, sem esoterismo vago. Interpretações diretas, humanas e acionáveis." },
              { num: "1", unit: "x", label: "passo de cada vez", desc: "A plataforma te guia com calma — sem sobrecarga, sem julgamento, no seu ritmo." },
            ].map(({ num, label, desc }) => (
              <div key={label} style={{
                padding: 32, borderRadius: 20,
                background: "rgba(255,255,255,0.015)",
                border: "1px solid rgba(200,165,107,0.1)",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(200,165,107,0.3)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(200,165,107,0.1)")}
              >
                <p className="font-tan-mon-cheri" style={{ fontSize: "2.8rem", color: "#c8a56b", lineHeight: 1, marginBottom: 4 }}>{num}</p>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,165,107,0.6)", marginBottom: 12 }}>{label}</p>
                <p style={{ fontSize: "0.85rem", color: "rgba(247,242,236,0.4)", lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section style={{
        padding: "120px 24px",
        background: "linear-gradient(160deg, #1e1812 0%, #2f251b 50%, #1a1208 100%)",
        position: "relative", overflow: "hidden",
        textAlign: "center",
      }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 900, height: 600, background: "radial-gradient(ellipse, rgba(200,165,107,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,165,107,0.6)", marginBottom: 24 }}>
            Comece Agora
          </p>
          <h2 className="font-tan-mon-cheri" style={{
            fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "#f7f2ec",
            lineHeight: 1.15, marginBottom: 24,
          }}>
            Sua jornada começa<br />
            <span style={{ color: "#c8a56b" }}>com uma escolha</span>
          </h2>
          <p style={{ fontSize: "1.05rem", color: "rgba(247,242,236,0.5)", lineHeight: 1.8, marginBottom: 48, maxWidth: 480, margin: "0 auto 48px" }}>
            Cada avaliação que você faz é um ato de coragem e de amor próprio. A clareza que você busca está a uma jornada de distância.
          </p>

          <button
            onClick={handleCTA}
            style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              padding: "20px 52px", borderRadius: 14,
              background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 50%, #9c7742 100%)",
              color: "#fff", fontWeight: 700, fontSize: "1.05rem",
              letterSpacing: "0.06em", border: "none", cursor: "pointer",
              boxShadow: "0 12px 50px rgba(200,165,107,0.35)",
              transition: "all 0.25s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(200,165,107,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 12px 50px rgba(200,165,107,0.35)"; }}
          >
            Acessar o Sistema
            <ArrowRight size={20} />
          </button>

          <p style={{ fontSize: "0.75rem", color: "rgba(247,242,236,0.25)", marginTop: 20, letterSpacing: "0.08em" }}>
            Acesso imediato · Plataforma completa · Sem compromisso
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer style={{
        background: "#0a0805",
        borderTop: "1px solid rgba(200,165,107,0.08)",
        padding: "32px 24px",
        textAlign: "center",
      }}>
        <p className="font-tan-mon-cheri" style={{ fontSize: "1rem", color: "rgba(200,165,107,0.4)", marginBottom: 8 }}>
          Da Sombra à Luz
        </p>
        <p style={{ fontSize: "0.72rem", color: "rgba(247,242,236,0.2)", letterSpacing: "0.15em" }}>
          PLATAFORMA DE AUTOCONHECIMENTO
        </p>
      </footer>

    </div>
  );
}
