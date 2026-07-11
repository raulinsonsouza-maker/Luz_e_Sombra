import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useSearch } from "wouter";
import {
  Check,
  Loader2,
  Shield,
  ArrowLeft,
  ExternalLink,
  User,
  Mail,
  Phone,
  Lock,
  Sparkles,
  CreditCard,
  QrCode,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  LP_PRODUCT_NAME,
  LP_PRODUCT_TAGLINE,
  LP_INCLUDED_ITEMS,
  LP_PRICE,
  LP_PRICE_INSTALLMENTS,
  LP_PRICE_INSTALLMENT_VALUE,
  LP_PRICE_ORIGINAL,
  LP_BILLING_LABEL,
  formatLpPrice,
  buildCaktoUrl,
  CAKTO_CHECKOUT_URL,
  LP_GUARANTEE_DAYS,
} from "@/lib/lpConfig";
import { formatBrazilPhone } from "@/lib/phoneMask";
import { trackLpEvent, type LpVariant } from "@/lib/lpAnalytics";

interface CheckoutInfo {
  nome: string;
  email: string;
  telefone: string | null;
  variant: string;
  status: string;
}

function variantFromSearch(from: string | null): LpVariant {
  return from === "vsl" ? "vsl" : "control";
}

const STEPS = [
  { id: 1, label: "Cadastro", done: true },
  { id: 2, label: "Pagamento", done: false, active: true },
  { id: 3, label: "Acesso", done: false },
];

function StepIndicator() {
  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((step, i) => (
        <li key={step.id} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center gap-1.5 min-w-[4.5rem]">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: step.done
                  ? "linear-gradient(135deg, #9c7742, #c8a56b)"
                  : step.active
                    ? "rgba(200,165,107,0.2)"
                    : "rgba(255,255,255,0.05)",
                border: step.active ? "2px solid #c8a56b" : step.done ? "none" : "1px solid rgba(200,165,107,0.15)",
                color: step.done || step.active ? "#fff" : "rgba(247,242,236,0.35)",
                boxShadow: step.active ? "0 0 20px rgba(200,165,107,0.35)" : "none",
              }}
            >
              {step.done ? <Check size={14} strokeWidth={3} /> : step.id}
            </div>
            <span
              className="text-[10px] sm:text-xs font-medium tracking-wide"
              style={{ color: step.active || step.done ? "#c8a56b" : "rgba(247,242,236,0.35)" }}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="w-6 sm:w-12 h-px mb-5"
              style={{
                background: step.done
                  ? "linear-gradient(90deg, #c8a56b, rgba(200,165,107,0.3))"
                  : "rgba(200,165,107,0.15)",
              }}
            />
          )}
        </li>
      ))}
    </ol>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: "rgba(15,12,9,0.55)", border: "1px solid rgba(200,165,107,0.1)" }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(200,165,107,0.12)" }}
      >
        <Icon size={16} style={{ color: "#c8a56b" }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "rgba(247,242,236,0.35)" }}>
          {label}
        </p>
        <p className="text-sm truncate" style={{ color: "#f7f2ec" }}>
          {value}
        </p>
      </div>
      <Check size={14} className="flex-shrink-0 ml-auto" style={{ color: "rgba(200,165,107,0.5)" }} />
    </div>
  );
}

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const from = params.get("from");
  const token = params.get("token");
  const variant = variantFromSearch(from);

  const trackedStart = useRef(false);
  const redirected = useRef(false);
  const [info, setInfo] = useState<CheckoutInfo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate(from === "vsl" ? "/vsl" : "/");
      return;
    }

    fetch(`/api/funnel/checkout-info?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("not found");
        return res.json() as Promise<CheckoutInfo>;
      })
      .then(setInfo)
      .catch(() => {
        toast.error("Checkout inválido ou expirado.");
        navigate(from === "vsl" ? "/vsl" : "/");
      })
      .finally(() => setCarregando(false));
  }, [token, from, navigate]);

  useEffect(() => {
    if (trackedStart.current || !info) return;
    trackedStart.current = true;
    trackLpEvent("checkout_start", variant, { from: from ?? "direct" });
  }, [variant, from, info]);

  const handlePay = useCallback(() => {
    if (!info || !token || redirected.current) return;
    redirected.current = true;
    setEnviando(true);

    const caktoUrl = buildCaktoUrl(
      info.nome,
      info.email,
      info.telefone ?? undefined,
      token,
    );

    if (CAKTO_CHECKOUT_URL && caktoUrl) {
      trackLpEvent("checkout_complete", variant, { provider: "cakto" });
      window.location.href = caktoUrl;
      return;
    }

    redirected.current = false;
    toast.error("Checkout Cakto não configurado.");
    setEnviando(false);
  }, [info, token, variant]);

  useEffect(() => {
    if (!enviando) return;
    const fallback = setTimeout(() => {
      redirected.current = false;
      setEnviando(false);
      toast.error("Não foi possível abrir o pagamento. Clique no botão para tentar novamente.");
    }, 10000);
    return () => clearTimeout(fallback);
  }, [enviando]);

  const economia = LP_PRICE_ORIGINAL - LP_PRICE;
  const telefoneFormatado = info?.telefone ? formatBrazilPhone(info.telefone) : null;

  if (carregando || !info) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0f0c09" }}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.2)" }}
        >
          <Loader2 className="animate-spin" size={28} style={{ color: "#c8a56b" }} />
        </div>
        <p className="text-sm" style={{ color: "rgba(247,242,236,0.45)" }}>
          Preparando seu checkout...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#0f0c09" }}>
      {/* Background */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-15%",
          right: "-10%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,165,107,0.1) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-20%",
          left: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(156,119,66,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Nav */}
      <nav
        className="relative z-10 h-16 flex items-center px-5"
        style={{
          background: "rgba(15,12,9,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(200,165,107,0.1)",
        }}
      >
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(from === "vsl" ? "/vsl" : "/")}
            className="flex items-center gap-2 text-xs transition-opacity hover:opacity-70"
            style={{ color: "rgba(200,165,107,0.7)" }}
          >
            <ArrowLeft size={14} />
            Voltar
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={14} style={{ color: "#c8a56b" }} />
            <span className="font-tan-mon-cheri text-sm hidden sm:inline" style={{ color: "#f7f2ec" }}>
              {LP_PRODUCT_NAME}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(200,165,107,0.6)" }}>
            <Lock size={12} />
            <span className="hidden sm:inline">Checkout seguro</span>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-8 sm:py-12">
        {/* Steps */}
        <div className="mb-10">
          <StepIndicator />
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Order summary — 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <p
                className="text-[10px] font-bold tracking-[0.35em] uppercase mb-2"
                style={{ color: "rgba(200,165,107,0.55)" }}
              >
                Resumo do pedido
              </p>
              <h1
                className="font-tan-mon-cheri mb-2"
                style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "#f7f2ec", lineHeight: 1.15 }}
              >
                {LP_PRODUCT_NAME}
              </h1>
              <p className="text-sm max-w-lg" style={{ color: "rgba(247,242,236,0.45)" }}>
                {LP_PRODUCT_TAGLINE}
              </p>
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(30,24,18,0.95) 0%, rgba(20,16,12,0.98) 100%)",
                border: "1px solid rgba(200,165,107,0.18)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
              }}
            >
              {/* Price header */}
              <div
                className="px-6 py-5"
                style={{ borderBottom: "1px solid rgba(200,165,107,0.1)", background: "rgba(200,165,107,0.04)" }}
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-tan-mon-cheri" style={{ fontSize: "2.5rem", color: "#c8a56b", lineHeight: 1 }}>
                        {formatLpPrice(LP_PRICE)}
                      </span>
                      <span className="text-sm font-medium pb-1" style={{ color: "rgba(247,242,236,0.5)" }}>
                        à vista
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "rgba(247,242,236,0.4)" }}>
                      {LP_BILLING_LABEL} · ou {LP_PRICE_INSTALLMENTS}x de{" "}
                      {formatLpPrice(LP_PRICE_INSTALLMENT_VALUE)} no cartão
                    </p>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: "rgba(76,175,80,0.15)", color: "#7dce82", border: "1px solid rgba(76,175,80,0.25)" }}
                  >
                    Economize {formatLpPrice(economia)}
                  </div>
                </div>
                {LP_PRICE_ORIGINAL > LP_PRICE && (
                  <p className="text-xs mt-2" style={{ color: "rgba(247,242,236,0.3)" }}>
                    De <span className="line-through">{formatLpPrice(LP_PRICE_ORIGINAL)}</span> por {formatLpPrice(LP_PRICE)}
                  </p>
                )}
              </div>

              {/* Included items */}
              <div className="px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "rgba(200,165,107,0.6)" }}>
                  O que você recebe
                </p>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {LP_INCLUDED_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "rgba(200,165,107,0.15)" }}
                      >
                        <Check size={11} strokeWidth={3} style={{ color: "#c8a56b" }} />
                      </div>
                      <span className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.65)" }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment methods */}
              <div
                className="px-6 py-4 flex flex-wrap items-center gap-4"
                style={{ borderTop: "1px solid rgba(200,165,107,0.08)", background: "rgba(0,0,0,0.15)" }}
              >
                <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "rgba(247,242,236,0.3)" }}>
                  Aceito:
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: "rgba(200,165,107,0.1)", color: "#c8a56b", border: "1px solid rgba(200,165,107,0.15)" }}
                  >
                    <QrCode size={14} />
                    PIX
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: "rgba(200,165,107,0.1)", color: "#c8a56b", border: "1px solid rgba(200,165,107,0.15)" }}
                  >
                    <CreditCard size={14} />
                    Cartão
                  </span>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div
              className="flex items-start gap-4 p-5 rounded-2xl"
              style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.12)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(200,165,107,0.12)" }}
              >
                <Shield size={18} style={{ color: "#c8a56b" }} />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "#f7f2ec" }}>
                  Garantia de {LP_GUARANTEE_DAYS} dias
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
                  Pagamento processado com segurança pela Cakto. Seu acesso é liberado automaticamente após a confirmação.
                </p>
              </div>
            </div>
          </div>

          {/* Payment panel — 2 cols, sticky */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6 sm:p-7 lg:sticky lg:top-8"
              style={{
                background: "linear-gradient(160deg, #1e1812 0%, #16120e 100%)",
                border: "1px solid rgba(200,165,107,0.22)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <BadgeCheck size={18} style={{ color: "#c8a56b" }} />
                <h2 className="font-tan-mon-cheri text-xl" style={{ color: "#f7f2ec" }}>
                  Quase lá!
                </h2>
              </div>
              <p className="text-xs mb-6" style={{ color: "rgba(247,242,236,0.4)" }}>
                Seus dados estão confirmados. Falta só o pagamento.
              </p>

              <div className="space-y-2.5 mb-6">
                <InfoRow icon={User} label="Nome" value={info.nome} />
                <InfoRow icon={Mail} label="E-mail" value={info.email} />
                {telefoneFormatado && (
                  <InfoRow icon={Phone} label="Celular" value={telefoneFormatado} />
                )}
              </div>

              {/* Next steps */}
              <div
                className="rounded-xl p-4 mb-6"
                style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.1)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(200,165,107,0.55)" }}>
                  Na próxima tela
                </p>
                <ol className="space-y-2">
                  {["Informe seu CPF", "Escolha PIX ou cartão", "Acesso liberado em segundos"].map((step, i) => (
                    <li key={step} className="flex items-center gap-2.5 text-xs" style={{ color: "rgba(247,242,236,0.55)" }}>
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                        style={{ background: "rgba(200,165,107,0.15)", color: "#c8a56b" }}
                      >
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={handlePay}
                disabled={enviando}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:translate-y-0 disabled:hover:shadow-none"
                style={{
                  background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 45%, #ddb87a 55%, #9c7742 100%)",
                  backgroundSize: "200% 100%",
                  color: "#fff",
                  boxShadow: "0 8px 32px rgba(200,165,107,0.35)",
                }}
              >
                {enviando ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Abrindo pagamento seguro...
                  </>
                ) : (
                  <>
                    Ir para pagamento agora
                    <ExternalLink size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-[10px] mt-4 flex items-center justify-center gap-1.5" style={{ color: "rgba(247,242,236,0.25)" }}>
                <Lock size={10} />
                Conexão criptografada · Processado pela Cakto
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
