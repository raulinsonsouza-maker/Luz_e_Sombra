import { useEffect, useRef, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Check, Loader2, Shield, ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import {
  LP_PRODUCT_NAME,
  LP_PRODUCT_TAGLINE,
  LP_INCLUDED_ITEMS,
  LP_PRICE,
  LP_PRICE_INSTALLMENTS,
  LP_PRICE_INSTALLMENT_VALUE,
  LP_BILLING_LABEL,
  formatLpPrice,
  buildCaktoUrl,
  CAKTO_CHECKOUT_URL,
  LP_GUARANTEE_DAYS,
} from "@/lib/lpConfig";
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

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const from = params.get("from");
  const token = params.get("token");
  const variant = variantFromSearch(from);

  const trackedStart = useRef(false);
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

  function handlePay() {
    if (!info || !token) return;
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
    toast.error("Checkout Cakto não configurado.");
    setEnviando(false);
  }

  if (carregando || !info) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0c09" }}>
        <Loader2 className="animate-spin" size={32} style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0f0c09" }}>
      <nav
        className="h-14 flex items-center px-5"
        style={{ borderBottom: "1px solid rgba(200,165,107,0.12)" }}
      >
        <button
          type="button"
          onClick={() => navigate(from === "vsl" ? "/vsl" : "/")}
          className="flex items-center gap-2 text-xs transition-opacity hover:opacity-70"
          style={{ color: "rgba(200,165,107,0.7)" }}
        >
          <ArrowLeft size={14} />
          Voltar
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-5 py-10 grid lg:grid-cols-2 gap-10">
        <div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: "rgba(200,165,107,0.6)" }}>
            Resumo do pedido
          </p>
          <h1 className="font-tan-mon-cheri mb-2" style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#f7f2ec", lineHeight: 1.2 }}>
            {LP_PRODUCT_NAME}
          </h1>
          <p className="text-sm mb-6" style={{ color: "rgba(247,242,236,0.45)" }}>
            {LP_PRODUCT_TAGLINE}
          </p>

          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.2)" }}
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-tan-mon-cheri text-4xl" style={{ color: "#c8a56b" }}>
                {formatLpPrice(LP_PRICE)}
              </span>
              <span className="text-sm font-medium" style={{ color: "rgba(247,242,236,0.5)" }}>
                à vista
              </span>
            </div>
            <p className="text-xs mb-5" style={{ color: "rgba(247,242,236,0.45)" }}>
              {LP_BILLING_LABEL} · ou {LP_PRICE_INSTALLMENTS}x de {formatLpPrice(LP_PRICE_INSTALLMENT_VALUE)} no cartão
            </p>
            <ul className="space-y-2.5">
              {LP_INCLUDED_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#c8a56b" }} />
                  <span className="text-xs" style={{ color: "rgba(247,242,236,0.6)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.12)" }}
          >
            <Shield size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#c8a56b" }} />
            <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
              Garantia de {LP_GUARANTEE_DAYS} dias. Pagamento processado com segurança pela Cakto (PIX ou cartão).
            </p>
          </div>
        </div>

        <div>
          <div
            className="rounded-2xl p-7"
            style={{ background: "#1e1812", border: "1px solid rgba(200,165,107,0.18)" }}
          >
            <h2 className="font-tan-mon-cheri text-xl mb-6" style={{ color: "#f7f2ec" }}>
              Quase lá!
            </h2>

            <div className="space-y-3 mb-6 text-sm" style={{ color: "rgba(247,242,236,0.6)" }}>
              <p><span style={{ color: "rgba(247,242,236,0.4)" }}>Nome:</span> {info.nome}</p>
              <p><span style={{ color: "rgba(247,242,236,0.4)" }}>E-mail:</span> {info.email}</p>
              {info.telefone && (
                <p><span style={{ color: "rgba(247,242,236,0.4)" }}>Celular:</span> {info.telefone}</p>
              )}
            </div>

            <p className="text-xs mb-6 leading-relaxed" style={{ color: "rgba(247,242,236,0.4)" }}>
              Na próxima tela você informará CPF e escolherá PIX ou cartão. Após a confirmação do pagamento, seu acesso é liberado automaticamente.
            </p>

            <button
              type="button"
              onClick={handlePay}
              disabled={enviando}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
              style={{
                background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 50%, #9c7742 100%)",
                color: "#fff",
                boxShadow: "0 8px 32px rgba(200,165,107,0.3)",
              }}
            >
              {enviando ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Redirecionando...
                </>
              ) : (
                <>
                  Ir para pagamento seguro
                  <ExternalLink size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
