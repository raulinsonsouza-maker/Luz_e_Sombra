import { ArrowRight, Check, Shield } from "lucide-react";
import {
  LP_MODULES,
  LP_TESTIMONIALS,
  LP_FAQ,
  LP_INCLUDED_ITEMS,
  LP_GUARANTEE_DAYS,
  LP_CTA_PRIMARY,
  formatLpPrice,
  LP_PRICE,
  LP_PRICE_INSTALLMENTS,
  LP_PRICE_INSTALLMENT_VALUE,
  LP_PRICE_ORIGINAL,
  LP_PRICE_PERIOD,
  formatLpPriceLabel,
  getLpSections,
  type LpSectionVariant,
} from "@/lib/lpConfig";

interface SectionProps {
  variant?: LpSectionVariant;
}

interface CtaProps {
  onCheckout: () => void;
  label?: string;
  fullWidth?: boolean;
}

export function LpCtaButton({ onCheckout, label = LP_CTA_PRIMARY, fullWidth }: CtaProps) {
  return (
    <button
      type="button"
      onClick={onCheckout}
      className={`inline-flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-base transition-all hover:-translate-y-0.5 ${fullWidth ? "w-full" : ""}`}
      style={{
        background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 50%, #9c7742 100%)",
        color: "#fff",
        letterSpacing: "0.05em",
        boxShadow: "0 12px 50px rgba(200,165,107,0.35)",
      }}
    >
      {label}
      <ArrowRight size={20} />
    </button>
  );
}

export function LpModulesSection({ theme = "dark", variant = "control" }: SectionProps & { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const copy = getLpSections(variant).modules;

  return (
    <section className="py-16 sm:py-20 px-5" style={{ background: isDark ? "#0f0c09" : "#faf8f4" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: isDark ? "rgba(200,165,107,0.6)" : "#9c7742" }}
          >
            {copy.eyebrow}
          </p>
          <h2
            className="font-tan-mon-cheri"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: isDark ? "#f7f2ec" : "#2f251b",
              lineHeight: 1.2,
            }}
          >
            {copy.title}{" "}
            {copy.titleAccent && (
              <span style={{ color: isDark ? "#c8a56b" : "#9c7742" }}>{copy.titleAccent}</span>
            )}
          </h2>
          {copy.subtitle && (
            <p className="text-sm mt-4 max-w-xl mx-auto leading-relaxed" style={{ color: isDark ? "rgba(247,242,236,0.45)" : "rgba(47,37,27,0.55)" }}>
              {copy.subtitle}
            </p>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LP_MODULES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-5 rounded-2xl"
              style={{
                background: isDark ? "rgba(200,165,107,0.06)" : "#fff",
                border: `1px solid ${isDark ? "rgba(200,165,107,0.15)" : "rgba(200,165,107,0.2)"}`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(200,165,107,0.12)",
                    border: "1px solid rgba(200,165,107,0.2)",
                  }}
                >
                  <Icon size={16} style={{ color: "#c8a56b" }} />
                </div>
                <h3
                  className="font-tan-mon-cheri text-base"
                  style={{ color: isDark ? "#f7f2ec" : "#2f251b" }}
                >
                  {title}
                </h3>
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: isDark ? "rgba(247,242,236,0.45)" : "rgba(47,37,27,0.55)" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LpHowItWorksSection({ theme = "light", variant = "control" }: SectionProps & { theme?: "dark" | "light" }) {
  const isDark = theme === "dark";
  const copy = getLpSections(variant).howItWorks;

  return (
    <section className="py-16 sm:py-20 px-5" style={{ background: isDark ? "#1e1812" : "#fff" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="text-xs font-bold tracking-[0.3em] uppercase mb-4"
            style={{ color: isDark ? "rgba(200,165,107,0.6)" : "#9c7742" }}
          >
            {copy.eyebrow}
          </p>
          <h2
            className="font-tan-mon-cheri"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              color: isDark ? "#f7f2ec" : "#2f251b",
              lineHeight: 1.2,
            }}
          >
            {copy.title}{" "}
            {"titleAccent" in copy && copy.titleAccent ? (
              <span style={{ color: isDark ? "#c8a56b" : "#9c7742" }}>{copy.titleAccent}</span>
            ) : null}
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {copy.steps.map(({ step, title, desc }) => (
            <div key={step} className="flex gap-4">
              <p
                className="font-tan-mon-cheri shrink-0"
                style={{ fontSize: "3rem", color: "rgba(200,165,107,0.2)", lineHeight: 1 }}
              >
                {step}
              </p>
              <div className="pt-1">
                <h3
                  className="font-tan-mon-cheri text-lg mb-2"
                  style={{ color: isDark ? "#f7f2ec" : "#2f251b" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: isDark ? "rgba(247,242,236,0.5)" : "rgba(47,37,27,0.55)" }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LpTestimonialsSection({ variant = "control" }: SectionProps) {
  const copy = getLpSections(variant).testimonials;

  return (
    <section className="py-16 sm:py-20 px-5" style={{ background: "#faf8f4" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "#9c7742" }}>
            {copy.eyebrow}
          </p>
          <h2
            className="font-tan-mon-cheri"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: "#2f251b", lineHeight: 1.2 }}
          >
            {copy.title}
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {LP_TESTIMONIALS.map(({ name, role, text }) => (
            <div
              key={name}
              className="p-6 rounded-2xl"
              style={{
                background: "#fff",
                border: "1px solid rgba(200,165,107,0.2)",
                boxShadow: "0 4px 24px rgba(156,119,66,0.08)",
              }}
            >
              <p className="text-sm leading-relaxed mb-5 italic" style={{ color: "rgba(47,37,27,0.65)" }}>
                "{text}"
              </p>
              <div>
                <p className="font-semibold text-sm" style={{ color: "#2f251b" }}>
                  {name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(156,119,66,0.7)" }}>
                  {role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LpOfferSection({ onCheckout, variant = "control" }: SectionProps & { onCheckout: () => void }) {
  const copy = getLpSections(variant).offer;

  return (
    <section className="py-16 sm:py-24 px-5 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1e1812 0%, #2f251b 50%, #1a1208 100%)" }}>
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 800,
          height: 500,
          background: "radial-gradient(ellipse, rgba(200,165,107,0.1), transparent 65%)",
        }}
      />
      <div className="max-w-lg mx-auto relative text-center">
        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(200,165,107,0.6)" }}>
          {copy.eyebrow}
        </p>
        <h2
          className="font-tan-mon-cheri mb-2"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f7f2ec", lineHeight: 1.15 }}
        >
          {copy.title}
          {copy.titleAccent && (
            <>
              <br />
              <span style={{ color: "#c8a56b" }}>{copy.titleAccent}</span>
            </>
          )}
        </h2>
        <p className="text-sm mb-8" style={{ color: "rgba(247,242,236,0.45)" }}>
          {copy.subtitle}
        </p>

        <div
          className="rounded-2xl p-8 mb-8 text-left"
          style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.22)" }}
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-6">
            <span
              className="font-tan-mon-cheri"
              style={{ fontSize: "3rem", color: "#c8a56b", lineHeight: 1 }}
            >
              {formatLpPrice(LP_PRICE)}
            </span>
            <span className="text-lg font-medium" style={{ color: "rgba(247,242,236,0.55)" }}>
              à vista
            </span>
            <span className="text-sm w-full sm:w-auto" style={{ color: "rgba(247,242,236,0.45)" }}>
              ou {LP_PRICE_INSTALLMENTS}x de {formatLpPrice(LP_PRICE_INSTALLMENT_VALUE)} no cartão
            </span>
          </div>
          <ul className="space-y-3 mb-6">
            {LP_INCLUDED_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check size={15} className="shrink-0 mt-0.5" style={{ color: "#c8a56b" }} />
                <span className="text-sm" style={{ color: "rgba(247,242,236,0.65)" }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
            style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.15)" }}
          >
            <Shield size={16} style={{ color: "#c8a56b", flexShrink: 0 }} />
            <p className="text-xs" style={{ color: "rgba(247,242,236,0.55)" }}>
              {LP_GUARANTEE_DAYS} dias de garantia incondicional. Não gostou? Devolvemos 100%.
            </p>
          </div>
        </div>

        <LpCtaButton onCheckout={onCheckout} fullWidth />
        <p className="text-xs mt-4" style={{ color: "rgba(247,242,236,0.25)", letterSpacing: "0.06em" }}>
          {copy.footnote}
        </p>
      </div>
    </section>
  );
}

export function LpFaqSection({ variant = "control" }: SectionProps) {
  const copy = getLpSections(variant).faq;

  return (
    <section className="py-16 sm:py-20 px-5" style={{ background: "#fff" }}>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4" style={{ color: "#9c7742" }}>
            {copy.eyebrow}
          </p>
          <h2
            className="font-tan-mon-cheri"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#2f251b" }}
          >
            {copy.title}
          </h2>
        </div>
        <div className="space-y-4">
          {LP_FAQ.map(({ q, a }) => (
            <div
              key={q}
              className="p-5 rounded-xl"
              style={{ background: "#faf8f4", border: "1px solid rgba(200,165,107,0.18)" }}
            >
              <h3 className="font-semibold text-sm mb-2" style={{ color: "#2f251b" }}>
                {q}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(47,37,27,0.6)" }}>
                {a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LpFinalCtaSection({ onCheckout, variant = "control" }: SectionProps & { onCheckout: () => void }) {
  const copy = getLpSections(variant).finalCta;

  return (
    <section className="py-16 sm:py-24 px-5 text-center" style={{ background: "#0f0c09" }}>
      <div className="max-w-xl mx-auto">
        <h2
          className="font-tan-mon-cheri mb-4"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#f7f2ec", lineHeight: 1.2 }}
        >
          {copy.title}
          <br />
          <span style={{ color: "#c8a56b" }}>{copy.titleAccent}</span>
        </h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "rgba(247,242,236,0.45)" }}>
          {copy.body}
        </p>
        <LpCtaButton onCheckout={onCheckout} fullWidth />
      </div>
    </section>
  );
}
