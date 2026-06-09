import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Lock } from "lucide-react";
import YouTubeGatedPlayer from "@/components/YouTubeGatedPlayer";
import {
  LpModulesSection,
  LpHowItWorksSection,
  LpTestimonialsSection,
  LpOfferSection,
  LpFaqSection,
  LpFinalCtaSection,
} from "@/components/lp/LpOfferSections";
import { VSL_UNLOCK_KEY, VSL_COPY } from "@/lib/lpConfig";
import { trackLpEvent } from "@/lib/lpAnalytics";

function readUnlocked(): boolean {
  try {
    return sessionStorage.getItem(VSL_UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

export default function VslLandingPage() {
  const [, navigate] = useLocation();
  const { status } = useAuth();
  const [unlocked, setUnlocked] = useState(readUnlocked);
  const trackedView = useRef(false);
  const trackedUnlock = useRef(false);

  useEffect(() => {
    if (status === "authenticated") navigate("/dashboard");
  }, [status, navigate]);

  useEffect(() => {
    if (trackedView.current) return;
    trackedView.current = true;
    trackLpEvent("lp_view", "vsl");
  }, []);

  const handleUnlocked = useCallback(() => {
    setUnlocked(true);
    if (!trackedUnlock.current) {
      trackedUnlock.current = true;
      trackLpEvent("vsl_unlock", "vsl");
    }
  }, []);

  const handleVideoStart = useCallback(() => {
    trackLpEvent("vsl_video_start", "vsl");
  }, []);

  const goCheckout = useCallback(() => {
    navigate("/checkout?from=vsl");
  }, [navigate]);

  return (
    <div style={{ background: "#0f0c09", minHeight: "100vh" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 h-14 flex items-center"
        style={{
          background: "rgba(15,12,9,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(200,165,107,0.12)",
        }}
      >
        <div className="max-w-3xl mx-auto px-5 w-full flex items-center justify-between">
          <span className="font-tan-mon-cheri text-base" style={{ color: "#f7f2ec" }}>
            Da Sombra à Luz
          </span>
          {unlocked && (
            <button
              type="button"
              onClick={goCheckout}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                background: "linear-gradient(135deg, #9c7742, #c8a56b)",
                color: "#fff",
              }}
            >
              {VSL_COPY.navCta}
            </button>
          )}
        </div>
      </nav>

      {/* Hero + Video */}
      <section className="px-5 pt-10 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p
              className="text-xs font-bold tracking-[0.3em] uppercase mb-4"
              style={{ color: "rgba(200,165,107,0.6)" }}
            >
              {VSL_COPY.eyebrow}
            </p>
            <h1
              className="font-tan-mon-cheri mb-4"
              style={{
                fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
                color: "#f7f2ec",
                lineHeight: 1.15,
              }}
            >
              {VSL_COPY.headline}
            </h1>
            <p
              className="text-sm leading-relaxed max-w-lg mx-auto"
              style={{ color: "rgba(247,242,236,0.55)" }}
            >
              {VSL_COPY.subheadline}
            </p>
          </div>

          <YouTubeGatedPlayer
            onUnlocked={handleUnlocked}
            onVideoStart={handleVideoStart}
            lockedLabel={VSL_COPY.playerLocked}
            progressLabel={(remaining) => VSL_COPY.playerProgress(remaining)}
            unlockedLabel={VSL_COPY.unlockHint}
          />
        </div>
      </section>

      {/* Gated content */}
      <div className="relative">
        {!unlocked && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-16 px-5"
            style={{
              background: "linear-gradient(to bottom, rgba(15,12,9,0.3) 0%, rgba(15,12,9,0.92) 30%, rgba(15,12,9,0.98) 60%)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div
              className="max-w-md text-center p-8 rounded-2xl"
              style={{
                background: "rgba(30,24,18,0.9)",
                border: "1px solid rgba(200,165,107,0.25)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(200,165,107,0.12)", border: "1px solid rgba(200,165,107,0.3)" }}
              >
                <Lock size={20} style={{ color: "#c8a56b" }} />
              </div>
              <h2 className="font-tan-mon-cheri text-xl mb-2" style={{ color: "#f7f2ec" }}>
                {VSL_COPY.gateTitle}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>
                {VSL_COPY.gateDesc}
              </p>
            </div>
          </div>
        )}

        <div
          className="transition-all duration-700"
          style={{
            filter: unlocked ? "none" : "blur(4px)",
            pointerEvents: unlocked ? "auto" : "none",
            userSelect: unlocked ? "auto" : "none",
          }}
        >
          <LpModulesSection theme="dark" variant="vsl" />
          <LpHowItWorksSection theme="light" variant="vsl" />
          <LpTestimonialsSection variant="vsl" />
          <LpOfferSection onCheckout={goCheckout} variant="vsl" />
          <LpFaqSection variant="vsl" />
          <LpFinalCtaSection onCheckout={goCheckout} variant="vsl" />
        </div>
      </div>

      <footer
        className="py-6 px-5 text-center"
        style={{ background: "#0a0805", borderTop: "1px solid rgba(200,165,107,0.08)" }}
      >
        <p className="text-xs" style={{ color: "rgba(247,242,236,0.2)" }}>
          Da Sombra à Luz · A partir de R$ 47/mês
        </p>
      </footer>
    </div>
  );
}
