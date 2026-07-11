import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  LpModulesSection,
  LpHowItWorksSection,
  LpOfferSection,
  LpFaqSection,
  LpFinalCtaSection,
} from "@/components/lp/LpOfferSections";
import SignupModal from "@/components/funnel/SignupModal";
import { captureUtmsFromUrl } from "@/lib/utm";
import { trackLpEvent } from "@/lib/lpAnalytics";
import {
  LP_PORTAL_NAME,
  LP_JOURNEY_NAME,
  LP_JOURNEY_TAGLINE,
  LP_CTA_NAV,
} from "@/lib/lpConfig";

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { status } = useAuth();
  const trackedView = useRef(false);
  const [signupOpen, setSignupOpen] = useState(false);

  useEffect(() => {
    if (status === "authenticated") navigate("/dashboard");
  }, [status, navigate]);

  useEffect(() => {
    captureUtmsFromUrl();
    if (trackedView.current) return;
    trackedView.current = true;
    trackLpEvent("lp_view", "control");
  }, []);

  const goCheckout = () => setSignupOpen(true);
  const goLogin = () => navigate("/login");

  return (
    <div>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 h-16 flex items-center"
        style={{
          background: "rgba(15,12,9,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(200,165,107,0.12)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-px h-7"
              style={{ background: "linear-gradient(to bottom, transparent, #c8a56b, transparent)" }}
            />
            <span className="font-tan-mon-cheri text-lg" style={{ color: "#f7f2ec", letterSpacing: "0.03em" }}>
              {LP_PORTAL_NAME}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goLogin}
              className="hidden sm:inline text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: "rgba(200,165,107,0.7)" }}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={goCheckout}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #9c7742, #c8a56b)",
                color: "#fff",
                letterSpacing: "0.04em",
                boxShadow: "0 4px 14px rgba(200,165,107,0.25)",
              }}
            >
              {LP_CTA_NAV}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-16 sm:py-20" style={{ background: "#0f0c09" }}>
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-20%",
            right: "-8%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,165,107,0.1) 0%, transparent 65%)",
          }}
        />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <p
            className="text-xs font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: "rgba(200,165,107,0.65)" }}
          >
            {LP_PORTAL_NAME}
          </p>
          <h1
            className="font-tan-mon-cheri mb-5"
            style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1.1, color: "#f7f2ec" }}
          >
            {LP_JOURNEY_NAME}
          </h1>
          <p
            className="mb-8 max-w-xl mx-auto"
            style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", lineHeight: 1.75, color: "rgba(247,242,236,0.6)" }}
          >
            {LP_JOURNEY_TAGLINE}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <button
              type="button"
              onClick={goCheckout}
              className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-base transition-all hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 50%, #9c7742 100%)",
                color: "#fff",
                boxShadow: "0 8px 40px rgba(200,165,107,0.35)",
              }}
            >
              Começar minha jornada
              <ArrowRight size={18} />
            </button>
            <a
              href="#jornada"
              className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-medium text-base transition-all"
              style={{
                border: "1px solid rgba(200,165,107,0.28)",
                color: "rgba(200,165,107,0.8)",
                textDecoration: "none",
              }}
            >
              Ver as 9 análises
            </a>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-6" style={{ borderTop: "1px solid rgba(200,165,107,0.12)" }}>
            {[
              { n: "9", label: "análises na trilha" },
              { n: "12", label: "áreas da vida" },
              { n: "1", label: "jornada guiada" },
            ].map(({ n, label }) => (
              <div key={label}>
                <p className="font-tan-mon-cheri text-xl sm:text-2xl" style={{ color: "#c8a56b", lineHeight: 1 }}>
                  {n}
                </p>
                <p className="text-[10px] sm:text-xs mt-1 leading-snug" style={{ color: "rgba(247,242,236,0.4)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problema → solução */}
      <section className="py-14 sm:py-16 px-5" style={{ background: "#faf8f4" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "#9c7742" }}>
              Você se reconhece?
            </p>
            <h2
              className="font-tan-mon-cheri"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", color: "#2f251b", lineHeight: 1.3 }}
            >
              Repete os mesmos padrões — e ainda não tem um mapa claro de quem você é.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Vive no automático", desc: "Os dias se repetem e a sensação de que falta algo não sai." },
              { title: "Sabe que pode mais", desc: "Existe propósito e clareza — mas por onde começar de verdade?" },
              { title: "Quer sair da sombra", desc: "Relações, trabalho, escolhas: os mesmos ciclos voltam sem explicação." },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="p-5 rounded-2xl"
                style={{ background: "#fff", border: "1px solid rgba(200,165,107,0.18)" }}
              >
                <h3 className="font-tan-mon-cheri text-lg mb-2" style={{ color: "#2f251b" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(47,37,27,0.6)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-sm max-w-lg mx-auto" style={{ color: "rgba(47,37,27,0.55)" }}>
            A <strong>{LP_JOURNEY_NAME}</strong> conecta 9 análises numa trilha — para você entender padrões e agir com consciência.
          </p>
        </div>
      </section>

      {/* Etapas da jornada */}
      <div id="jornada">
        <LpModulesSection theme="dark" variant="control" />
      </div>

      <LpHowItWorksSection theme="light" variant="control" />

      <LpOfferSection onCheckout={goCheckout} variant="control" />
      <LpFaqSection variant="control" />
      <LpFinalCtaSection onCheckout={goCheckout} variant="control" />

      <footer
        className="py-8 px-5 text-center"
        style={{ background: "#0a0805", borderTop: "1px solid rgba(200,165,107,0.08)" }}
      >
        <p className="font-tan-mon-cheri mb-1" style={{ fontSize: "1rem", color: "rgba(200,165,107,0.5)" }}>
          {LP_PORTAL_NAME}
        </p>
        <p className="text-xs tracking-wide" style={{ color: "rgba(247,242,236,0.25)" }}>
          {LP_JOURNEY_NAME}
        </p>
      </footer>

      <SignupModal open={signupOpen} onClose={() => setSignupOpen(false)} variant="control" />
    </div>
  );
}
