import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  Layers,
  Target,
  Heart,
  FlaskConical,
} from "lucide-react";
import {
  LpModulesSection,
  LpHowItWorksSection,
  LpOfferSection,
  LpFaqSection,
  LpFinalCtaSection,
} from "@/components/lp/LpOfferSections";
import LpCheckoutSection from "@/components/checkout/LpCheckoutSection";
import LogoPortal from "@/components/LogoPortal";
import { captureUtmsFromUrl } from "@/lib/utm";
import { trackLpEvent } from "@/lib/lpAnalytics";
import {
  LP_PORTAL_NAME,
  LP_JOURNEY_NAME,
  LP_CTA_PRIMARY,
  LP_CTA_LOGIN,
  LP_HERO,
  formatLpPrice,
  LP_PRICE,
} from "@/lib/lpConfig";

const HERO_ANALYSES = [
  { icon: Layers, label: "Traço de Caráter" },
  { icon: FlaskConical, label: "Temperamento" },
  { icon: Heart, label: "Linguagens do Amor" },
  { icon: Target, label: "Roda da Vida" },
];

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { status, user } = useAuth();
  const trackedView = useRef(false);
  const [scrolled, setScrolled] = useState(false);
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") navigate(user?.isAdmin ? "/admin" : "/dashboard");
  }, [status, user, navigate]);

  useEffect(() => {
    captureUtmsFromUrl();
    if (trackedView.current) return;
    trackedView.current = true;
    trackLpEvent("lp_view", "control");
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("checkout") || params.get("token");
      if (token) setCheckoutToken(token);
      const pending = sessionStorage.getItem("pending_checkout_token");
      if (!token && pending) setCheckoutToken(pending);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const goLogin = () => navigate("/login");

  return (
    <div>
      {/* ── Header ───────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,8,6,0.97)" : "rgba(15,12,9,0.75)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${scrolled ? "rgba(200,165,107,0.18)" : "rgba(200,165,107,0.08)"}`,
          boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.35)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-[4.25rem] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 min-w-0 text-left group"
          >
            <LogoPortal className="h-10 sm:h-11 w-auto" />
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={goLogin}
              className="px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:bg-white/5"
              style={{
                border: "1px solid rgba(200,165,107,0.35)",
                color: "rgba(200,165,107,0.9)",
              }}
            >
              {LP_CTA_LOGIN}
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(165deg, #0a0806 0%, #0f0c09 45%, #1a1208 100%)",
          minHeight: "min(92vh, 900px)",
        }}
      >
        {/* Background layers */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(200,165,107,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,165,107,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-25%",
            right: "-15%",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,165,107,0.14) 0%, transparent 62%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-30%",
            left: "-20%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(156,119,66,0.1) 0%, transparent 65%)",
          }}
        />

        <div className="max-w-6xl mx-auto px-5 py-14 sm:py-20 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Copy */}
            <div className="text-center lg:text-left">
              <h1
                className="font-tan-mon-cheri mb-5"
                style={{ fontSize: "clamp(2.75rem, 7vw, 4.5rem)", lineHeight: 1.05, color: "#f7f2ec" }}
              >
                {LP_HERO.headlineLine1}
                <br />
                {LP_HERO.headlineLine2}{" "}
                <span
                  style={{
                    color: "#c8a56b",
                    textShadow: "0 0 60px rgba(200,165,107,0.25)",
                  }}
                >
                  {LP_HERO.headlineAccent}
                </span>
              </h1>

              <p
                className="mb-8 max-w-xl mx-auto lg:mx-0 text-base sm:text-lg leading-relaxed"
                style={{ color: "rgba(247,242,236,0.62)" }}
              >
                {LP_HERO.subline}
              </p>

              <ul className="space-y-3 mb-9 max-w-md mx-auto lg:mx-0 text-left">
                {LP_HERO.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(200,165,107,0.15)" }}
                    >
                      <Check size={11} strokeWidth={3} style={{ color: "#c8a56b" }} />
                    </div>
                    <span className="text-sm" style={{ color: "rgba(247,242,236,0.7)" }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  type="button"
                  onClick={goCheckout}
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 45%, #ddb87a 55%, #9c7742 100%)",
                    backgroundSize: "200% 100%",
                    color: "#fff",
                    boxShadow: "0 12px 48px rgba(200,165,107,0.4)",
                  }}
                >
                  {LP_CTA_PRIMARY}
                  <ArrowRight size={18} />
                </button>
                <a
                  href="#jornada"
                  className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-semibold text-sm transition-all hover:bg-white/5"
                  style={{
                    border: "1px solid rgba(200,165,107,0.3)",
                    color: "rgba(200,165,107,0.9)",
                    textDecoration: "none",
                  }}
                >
                  Ver as 9 análises
                </a>
              </div>
            </div>

            {/* Visual card — desktop only */}
            <div className="relative max-w-md mx-auto lg:max-w-none w-full hidden lg:block">
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-40 pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(200,165,107,0.25), transparent)" }}
              />
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, rgba(30,24,18,0.95) 0%, rgba(18,14,10,0.98) 100%)",
                  border: "1px solid rgba(200,165,107,0.22)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{ borderBottom: "1px solid rgba(200,165,107,0.1)", background: "rgba(200,165,107,0.04)" }}
                >
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.55)" }}>
                      O que você compra
                    </p>
                    <p className="font-tan-mon-cheri text-lg" style={{ color: "#f7f2ec" }}>
                      {LP_JOURNEY_NAME}
                    </p>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(200,165,107,0.12)", color: "#c8a56b", border: "1px solid rgba(200,165,107,0.2)" }}
                  >
                    9 análises
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {HERO_ANALYSES.map(({ icon: Icon, label }, i) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(200,165,107,0.08)",
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                        style={{ background: "rgba(200,165,107,0.12)", color: "#c8a56b" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <Icon size={16} style={{ color: "rgba(200,165,107,0.6)" }} />
                      <span className="text-sm font-medium" style={{ color: "rgba(247,242,236,0.8)" }}>
                        {label}
                      </span>
                    </div>
                  ))}
                  <p className="text-center text-xs pt-1" style={{ color: "rgba(247,242,236,0.3)" }}>
                    + numerologia, trilha gamificada, comunidade e síntese final
                  </p>
                </div>

                <div
                  className="px-6 py-5 flex items-center justify-between gap-4"
                  style={{ borderTop: "1px solid rgba(200,165,107,0.1)", background: "rgba(0,0,0,0.2)" }}
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(247,242,236,0.35)" }}>
                      Investimento único
                    </p>
                    <p className="font-tan-mon-cheri text-2xl" style={{ color: "#c8a56b" }}>
                      {formatLpPrice(LP_PRICE)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={goCheckout}
                    className="px-5 py-3 rounded-xl text-sm font-bold shrink-0 transition-all hover:scale-[1.02]"
                    style={{
                      background: "linear-gradient(135deg, #9c7742, #c8a56b)",
                      color: "#fff",
                      boxShadow: "0 6px 20px rgba(200,165,107,0.3)",
                    }}
                  >
                    Garantir acesso
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 px-5" style={{ background: "#faf8f4" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#9c7742" }}>
            Um portal. Diferentes caminhos
          </p>
          <h2
            className="font-tan-mon-cheri mb-5"
            style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", color: "#2f251b", lineHeight: 1.3 }}
          >
            Uma descoberta: você.
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(47,37,27,0.6)" }}>
            Você já tentou se entender, mas sente que ainda existem peças que não se encaixam?
            Por que certos comportamentos se repetem? O que realmente motiva suas escolhas?
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(47,37,27,0.6)" }}>
            O {LP_PORTAL_NAME} reúne ferramentas de autoconhecimento em uma experiência integrada
            para ajudar você a encontrar essas respostas.
          </p>
        </div>
      </section>

      <div id="jornada">
        <LpModulesSection theme="dark" variant="control" />
      </div>

      <section className="py-14 sm:py-16 px-5" style={{ background: "#1e1812" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.28em] uppercase mb-3" style={{ color: "rgba(200,165,107,0.6)" }}>
              Depois das primeiras descobertas
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", color: "#f7f2ec" }}>
              O autoconhecimento não termina no resultado.
            </h2>
            <p className="text-sm mt-3" style={{ color: "rgba(247,242,236,0.5)" }}>
              A transformação acontece na experiência.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Sua reflexão diária", desc: "Um convite para desenvolver consciência e levar o autoconhecimento para o cotidiano." },
              { title: "Meu Espaço", desc: "Um ambiente pessoal para registrar emoções, pensamentos e percepções sobre sua jornada." },
              { title: "Missões e descobertas", desc: "Uma experiência guiada, com etapas e desafios que incentivam você a continuar avançando." },
              { title: "Comunidade", desc: "Um espaço para compartilhar experiências e caminhar ao lado de quem também busca autoconhecimento." },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="p-5 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}
              >
                <h3 className="font-tan-mon-cheri text-lg mb-2" style={{ color: "#f7f2ec" }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="como-funciona">
        <LpHowItWorksSection theme="light" variant="control" />
      </div>

      <LpOfferSection onCheckout={goCheckout} variant="control" />
      <LpCheckoutSection checkoutToken={checkoutToken} onTokenChange={setCheckoutToken} />
      <LpFaqSection variant="control" />
      <LpFinalCtaSection onCheckout={goCheckout} variant="control" />

      <footer
        className="py-8 px-5 text-center"
        style={{ background: "#0a0805", borderTop: "1px solid rgba(200,165,107,0.08)" }}
      >
        <LogoPortal className="h-10 w-auto mx-auto" />
      </footer>
    </div>
  );
}
