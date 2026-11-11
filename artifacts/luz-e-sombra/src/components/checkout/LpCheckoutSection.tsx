import { useEffect, useState } from "react";
import { Loader2, Shield } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import SignupForm from "@/components/funnel/SignupForm";
import MpPaymentBrick from "@/components/checkout/MpPaymentBrick";
import {
  formatLpPrice,
  LP_PRICE,
  LP_ACCESS_MONTHS,
} from "@/lib/lpConfig";

type MpConfig = {
  connected: boolean;
  publicKey: string | null;
  amount: number;
  fundadoresRestantes: number;
  edicaoEspecialAtiva: boolean;
  fundadoresCap: number;
};

type PixPending = {
  qrCode?: string | null;
  qrBase64?: string | null;
};

type Props = {
  checkoutToken?: string | null;
  onTokenChange?: (token: string) => void;
};

export default function LpCheckoutSection({ checkoutToken: tokenProp, onTokenChange }: Props) {
  const [, navigate] = useLocation();
  const [config, setConfig] = useState<MpConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [token, setToken] = useState(tokenProp ?? "");
  const [payerEmail, setPayerEmail] = useState<string | null>(null);
  const [payerName, setPayerName] = useState<string | null>(null);
  const [pendingPix, setPendingPix] = useState<PixPending | null>(null);
  const [polling, setPolling] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (tokenProp) setToken(tokenProp);
  }, [tokenProp]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/payments/mp/public-config");
        const data = await res.json();
        if (!cancelled) setConfig(data);
      } catch {
        if (!cancelled) setConfig(null);
      } finally {
        if (!cancelled) setLoadingConfig(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/funnel/checkout-info?token=${encodeURIComponent(token)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setPayerEmail(data.email ?? null);
          setPayerName(data.nome ?? null);
          if (data.status === "paid") {
            navigate(`/acesso-pos-compra?token=${encodeURIComponent(token)}`);
          }
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  useEffect(() => {
    if (!token || !pendingPix) return;
    setPolling(true);
    const id = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/funnel/checkout-status?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (data.ready) {
          window.clearInterval(id);
          navigate(`/acesso-pos-compra?token=${encodeURIComponent(token)}`);
        }
      } catch {
        /* ignore */
      }
    }, 3000);
    return () => {
      window.clearInterval(id);
      setPolling(false);
    };
  }, [token, pendingPix, navigate]);

  function handleRegistered(checkoutToken: string) {
    setToken(checkoutToken);
    onTokenChange?.(checkoutToken);
    try {
      sessionStorage.setItem("pending_checkout_token", checkoutToken);
      // Não persiste o token na URL (Referer/histórico) — só #checkout.
      const url = new URL(window.location.href);
      url.searchParams.delete("checkout");
      url.searchParams.delete("token");
      url.hash = "checkout";
      window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    } catch {
      /* ignore */
    }
  }

  async function copyPix() {
    if (!pendingPix?.qrCode) return;
    try {
      await navigator.clipboard.writeText(pendingPix.qrCode);
      setCopied(true);
      toast.success("Pix copiado");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar. Selecione o código manualmente.");
    }
  }

  const edicaoAtiva = config?.edicaoEspecialAtiva ?? true;

  return (
    <section id="checkout" className="py-16 sm:py-20 px-5 scroll-mt-24" style={{ background: "#120e0a" }}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[0.28em] uppercase mb-3" style={{ color: "rgba(200,165,107,0.65)" }}>
            {edicaoAtiva ? "Edição especial de lançamento" : "Lançamento"}
          </p>
          <h2 className="font-tan-mon-cheri" style={{ fontSize: "clamp(1.7rem, 4vw, 2.4rem)", color: "#f7f2ec" }}>
            {edicaoAtiva ? "Quero ser um membro fundador" : "Começar minha jornada"}
          </h2>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>
            {formatLpPrice(LP_PRICE)} ou até 6x no cartão · {LP_ACCESS_MONTHS} meses de acesso
          </p>
        </div>

        <div
          className="rounded-3xl p-5 sm:p-7"
          style={{
            background: "linear-gradient(165deg, rgba(30,24,18,0.95), rgba(18,14,10,0.98))",
            border: "1px solid rgba(200,165,107,0.22)",
          }}
        >
          {loadingConfig ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#c8a56b" }} />
            </div>
          ) : !config?.connected || !config.publicKey ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-sm" style={{ color: "rgba(247,242,236,0.7)" }}>
                Pagamento temporariamente indisponível. Estamos finalizando a conexão com o Mercado Pago.
              </p>
              <p className="text-xs" style={{ color: "rgba(247,242,236,0.4)" }}>
                Tente novamente em alguns minutos.
              </p>
            </div>
          ) : !token ? (
            <div className="space-y-5">
              <SignupForm variant="control" onRegistered={handleRegistered} />
              <div className="flex items-center justify-center gap-2 text-xs" style={{ color: "rgba(247,242,236,0.4)" }}>
                <Shield size={14} />
                Pagamento seguro
              </div>
            </div>
          ) : pendingPix ? (
            <div className="space-y-4 py-2">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium" style={{ color: "#f7f2ec" }}>
                  Escaneie ou copie o Pix
                </p>
                <p className="text-xs" style={{ color: "rgba(247,242,236,0.45)" }}>
                  {polling
                    ? "Assim que o pagamento confirmar, liberamos seu acesso automaticamente."
                    : "Finalize o Pix e aguarde alguns instantes."}
                </p>
              </div>
              {pendingPix.qrBase64 ? (
                <div className="flex justify-center">
                  <img
                    src={`data:image/png;base64,${pendingPix.qrBase64}`}
                    alt="QR Code Pix"
                    className="rounded-2xl bg-white p-3 w-52 h-52 object-contain"
                  />
                </div>
              ) : null}
              {pendingPix.qrCode ? (
                <div className="space-y-2">
                  <code
                    className="block text-[11px] break-all rounded-xl px-3 py-3"
                    style={{ background: "rgba(255,255,255,0.04)", color: "rgba(247,242,236,0.65)" }}
                  >
                    {pendingPix.qrCode}
                  </code>
                  <button
                    type="button"
                    onClick={() => void copyPix()}
                    className="w-full rounded-xl py-3 text-sm font-semibold"
                    style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a140e" }}
                  >
                    {copied ? "Copiado!" : "Copiar Pix"}
                  </button>
                </div>
              ) : (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#c8a56b" }} />
                </div>
              )}
            </div>
          ) : (
            <MpPaymentBrick
              publicKey={config.publicKey}
              amount={config.amount || LP_PRICE}
              checkoutToken={token}
              payerEmail={payerEmail}
              payerName={payerName}
              onApproved={() => navigate(`/acesso-pos-compra?token=${encodeURIComponent(token)}`)}
              onPending={(payload) => {
                setPendingPix({
                  qrCode: payload.qrCode,
                  qrBase64: payload.qrBase64,
                });
                toast.message("Pix gerado. Assim que confirmar, seu acesso abre.");
              }}
              onError={(message) => toast.error(message)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
