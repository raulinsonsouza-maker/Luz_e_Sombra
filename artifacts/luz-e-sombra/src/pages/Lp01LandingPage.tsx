import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Shield, Star } from "lucide-react";
import LogoPortal from "@/components/LogoPortal";
import LpHeroVideo from "@/components/lp/LpHeroVideo";
import LpCheckoutSection from "@/components/checkout/LpCheckoutSection";
import Lp01ScarcityTimer from "@/components/lp01/Lp01ScarcityTimer";
import Lp01Carousel from "@/components/lp01/Lp01Carousel";
import { captureUtmsFromUrl } from "@/lib/utm";
import { trackLpEvent } from "@/lib/lpAnalytics";
import { trackMetaViewContent } from "@/lib/metaPixel";
import { safeSessionStorage } from "@/lib/safeStorage";
import {
  LP01_BONUSES,
  LP01_CAROUSEL,
  LP01_FAQ,
  LP01_FOOTER,
  LP01_GUARANTEE,
  LP01_HERO,
  LP01_OFFER,
  LP01_RECEIVE,
  LP01_TESTIMONIALS,
  LP01_WHAT_IS,
  LP01_WHY,
} from "@/lib/lp01Config";

export default function Lp01LandingPage() {
  const trackedView = useRef(false);
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    captureUtmsFromUrl();
    if (trackedView.current) return;
    trackedView.current = true;
    trackLpEvent("lp_view", "lp01");
    trackMetaViewContent();
    try {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("checkout") || params.get("token");
      if (token) {
        setCheckoutToken(token);
        safeSessionStorage().setItem("pending_checkout_token", token);
        params.delete("checkout");
        params.delete("token");
        const qs = params.toString();
        window.history.replaceState(
          {},
          "",
          `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash || "#checkout"}`,
        );
      } else {
        const pending = safeSessionStorage().getItem("pending_checkout_token");
        if (pending) setCheckoutToken(pending);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const goCheckout = () => {
    document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ background: "#0f0c09", minHeight: "100vh" }}>
      {/* 1 — Hero full-bleed (mobile: vídeo de fundo; desktop: texto + vídeo) */}
      <section className="relative overflow-hidden" style={{ background: "#0a0805" }}>
        {/* Mobile: vídeo edge-to-edge atrás do texto */}
        <div className="absolute inset-0 lg:hidden">
          <LpHeroVideo
            className="h-full min-h-[100svh]"
            aspectClassName="!aspect-auto h-full min-h-[100svh]"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,8,5,0.72) 0%, rgba(10,8,5,0.35) 28%, rgba(10,8,5,0.55) 55%, rgba(10,8,5,0.94) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col min-h-[100svh] lg:min-h-0">
          <div className="flex items-center justify-center px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2 lg:py-5">
            <LogoPortal className="h-8 sm:h-9 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]" />
          </div>

          <div className="flex-1 flex flex-col justify-end lg:justify-center max-w-5xl w-full mx-auto px-5 pb-10 pt-6 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="text-center lg:text-left">
                <p
                  className="text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase mb-3"
                  style={{ color: "rgba(200,165,107,0.85)" }}
                >
                  {LP01_HERO.brand}
                </p>
                <h1
                  className="font-tan-mon-cheri mb-3"
                  style={{
                    fontSize: "clamp(1.85rem, 7vw, 3.4rem)",
                    lineHeight: 1.1,
                    color: "#f7f2ec",
                    textShadow: "0 2px 24px rgba(0,0,0,0.45)",
                  }}
                >
                  {LP01_HERO.headline}
                </h1>
                <p
                  className="mb-7 max-w-md mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed"
                  style={{ color: "rgba(247,242,236,0.78)" }}
                >
                  {LP01_HERO.subheadline}
                </p>
                <div className="flex justify-center lg:justify-start">
                  <button
                    type="button"
                    onClick={goCheckout}
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm"
                    style={{
                      background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 50%, #9c7742 100%)",
                      color: "#fff",
                      boxShadow: "0 10px 36px rgba(200,165,107,0.4)",
                    }}
                  >
                    {LP01_HERO.cta}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="relative hidden lg:block max-w-md mx-auto w-full">
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    border: "1px solid rgba(200,165,107,0.22)",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
                  }}
                >
                  <LpHeroVideo aspectClassName="aspect-[4/5] max-h-[480px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que é (tráfego frio) */}
      <section className="py-12 sm:py-14 px-5" style={{ background: "#faf8f4" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-2" style={{ color: "#9c7742" }}>
            {LP01_WHAT_IS.eyebrow}
          </p>
          <h2 className="font-tan-mon-cheri mb-3" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: "#2f251b" }}>
            {LP01_WHAT_IS.title}
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: "rgba(47,37,27,0.65)" }}>
            {LP01_WHAT_IS.body}
          </p>
          <ul className="text-left space-y-2.5 max-w-lg mx-auto">
            {LP01_WHAT_IS.points.map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(47,37,27,0.7)" }}>
                <Check size={14} className="mt-0.5 shrink-0" style={{ color: "#9c7742" }} />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2 — O que você vai receber */}
      <section className="py-12 sm:py-14 px-5" style={{ background: "#120e0a" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-7">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.65)" }}>
              {LP01_RECEIVE.eyebrow}
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: "#f7f2ec" }}>
              {LP01_RECEIVE.title}
            </h2>
          </div>
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {LP01_RECEIVE.items.map((item) => (
              <li
                key={item}
                className="px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)", color: "rgba(247,242,236,0.78)" }}
              >
                <Check size={14} className="shrink-0" style={{ color: "#c8a56b" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 — Por que agora */}
      <section className="py-12 sm:py-14 px-5" style={{ background: "#faf8f4" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-7">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-2" style={{ color: "#9c7742" }}>
              {LP01_WHY.eyebrow}
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: "#2f251b" }}>
              {LP01_WHY.title}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {LP01_WHY.items.map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-xl"
                style={{ background: "#fff", border: "1px solid rgba(47,37,27,0.08)" }}
              >
                <h3 className="font-semibold text-sm mb-1" style={{ color: "#2f251b" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-snug" style={{ color: "rgba(47,37,27,0.55)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Bônus */}
      <section id="bonus" className="py-12 sm:py-14 px-5 scroll-mt-20" style={{ background: "#1e1812" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-7">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.65)" }}>
              {LP01_BONUSES.eyebrow}
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: "#f7f2ec" }}>
              {LP01_BONUSES.title}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {LP01_BONUSES.items.map((item, i) => (
              <div
                key={item.title}
                className="p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.16)" }}
              >
                <p className="text-[11px] font-bold mb-1.5" style={{ color: "#c8a56b" }}>
                  Bônus {i + 1}
                </p>
                <h3 className="font-semibold text-sm mb-1" style={{ color: "#f7f2ec" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-snug" style={{ color: "rgba(247,242,236,0.5)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Oferta + checkout juntos */}
      <section
        id="oferta"
        className="py-12 sm:py-16 px-5 scroll-mt-20"
        style={{ background: "#0f0c09" }}
      >
        <div className="max-w-xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase" style={{ color: "rgba(200,165,107,0.65)" }}>
              {LP01_OFFER.eyebrow}
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)", color: "#f7f2ec" }}>
              {LP01_OFFER.title}
            </h2>
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.5)" }}>
              {LP01_OFFER.subtitle}
            </p>
            <div>
              <p className="font-tan-mon-cheri" style={{ fontSize: "clamp(2.2rem, 6vw, 3rem)", color: "#c8a56b", lineHeight: 1.1 }}>
                {LP01_OFFER.installmentsHighlight}
              </p>
              <p className="text-sm mt-1" style={{ color: "rgba(247,242,236,0.55)" }}>
                {LP01_OFFER.installmentsHint}
              </p>
              <p className="text-xs mt-2" style={{ color: "rgba(247,242,236,0.38)" }}>
                {LP01_OFFER.totalSoft}
              </p>
            </div>
            <Lp01ScarcityTimer label={LP01_OFFER.timerLabel} />
            <ul className="text-left space-y-1.5 max-w-xs mx-auto">
              {LP01_OFFER.includedPreview.map((line) => (
                <li key={line} className="flex items-start gap-2 text-sm" style={{ color: "rgba(247,242,236,0.65)" }}>
                  <Check size={13} className="mt-0.5 shrink-0" style={{ color: "#c8a56b" }} />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <LpCheckoutSection
            checkoutToken={checkoutToken}
            onTokenChange={setCheckoutToken}
            variant="lp01"
            embedded
          />
        </div>
      </section>

      {/* 6 — App por dentro */}
      <section className="py-12 sm:py-14" style={{ background: "#120e0a" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 px-5">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.65)" }}>
              {LP01_CAROUSEL.eyebrow}
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: "#f7f2ec" }}>
              {LP01_CAROUSEL.title}
            </h2>
          </div>
          <div className="px-5 sm:px-6">
            <Lp01Carousel />
          </div>
        </div>
      </section>

      {/* 7 — Depoimentos */}
      <section className="py-12 sm:py-14 px-5" style={{ background: "#faf8f4" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-7">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-2" style={{ color: "#9c7742" }}>
              {LP01_TESTIMONIALS.eyebrow}
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: "#2f251b" }}>
              {LP01_TESTIMONIALS.title}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {LP01_TESTIMONIALS.items.map((t) => (
              <blockquote
                key={t.name}
                className="p-5 rounded-2xl flex flex-col"
                style={{ background: "#fff", border: "1px solid rgba(47,37,27,0.08)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={t.image}
                    alt={`Foto de ${t.name}`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                    style={{ border: "2px solid rgba(200,165,107,0.45)" }}
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <cite className="not-italic block text-sm font-semibold truncate" style={{ color: "#2f251b" }}>
                      {t.name}
                    </cite>
                    <p className="text-[11px]" style={{ color: "rgba(47,37,27,0.45)" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 mb-3" aria-label={`${t.rating} de 5 estrelas`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="#c8a56b" stroke="#c8a56b" />
                  ))}
                </div>
                <p className="text-sm leading-snug" style={{ color: "rgba(47,37,27,0.7)" }}>
                  “{t.text}”
                </p>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — Garantia */}
      <section className="py-12 sm:py-14 px-5" style={{ background: "#1e1812" }}>
        <div className="max-w-lg mx-auto text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(200,165,107,0.12)", border: "1px solid rgba(200,165,107,0.3)" }}
          >
            <Shield size={20} style={{ color: "#c8a56b" }} />
          </div>
          <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.65)" }}>
            {LP01_GUARANTEE.eyebrow}
          </p>
          <h2 className="font-tan-mon-cheri mb-3" style={{ fontSize: "clamp(1.35rem, 3vw, 1.85rem)", color: "#f7f2ec" }}>
            {LP01_GUARANTEE.title}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
            {LP01_GUARANTEE.body}
          </p>
          <button
            type="button"
            onClick={goCheckout}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #9c7742, #c8a56b)", color: "#fff" }}
          >
            Quero garantir minha vaga
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* 9 — FAQ */}
      <section id="faq" className="py-12 sm:py-14 px-5 scroll-mt-20" style={{ background: "#120e0a" }}>
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-7">
            <p className="text-[11px] font-bold tracking-[0.28em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.65)" }}>
              {LP01_FAQ.eyebrow}
            </p>
            <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)", color: "#f7f2ec" }}>
              {LP01_FAQ.title}
            </h2>
          </div>
          <div className="space-y-2">
            {LP01_FAQ.items.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid rgba(200,165,107,0.14)", background: "rgba(255,255,255,0.02)" }}
                >
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    <span className="text-sm font-medium" style={{ color: "#f7f2ec" }}>
                      {item.q}
                    </span>
                    <span style={{ color: "#c8a56b" }}>{open ? "−" : "+"}</span>
                  </button>
                  {open ? (
                    <div className="px-4 pb-3">
                      <p className="text-sm leading-snug" style={{ color: "rgba(247,242,236,0.55)" }}>
                        {item.a}
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10 — Rodapé */}
      <footer
        className="py-8 px-5 text-center"
        style={{ background: "#0a0805", borderTop: "1px solid rgba(200,165,107,0.08)" }}
      >
        <LogoPortal className="h-8 w-auto mx-auto mb-2" />
        <p className="text-xs" style={{ color: "rgba(247,242,236,0.28)" }}>
          {LP01_FOOTER.line}
        </p>
      </footer>
    </div>
  );
}
