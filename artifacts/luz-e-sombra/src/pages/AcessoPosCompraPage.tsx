import { useEffect, useRef, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Loader2, CheckCircle2 } from "lucide-react";
import { setAuth } from "@/lib/auth";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 120000;

export default function AcessoPosCompraPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const token =
    new URLSearchParams(search).get("token") ??
    (() => {
      try {
        return sessionStorage.getItem("pending_checkout_token");
      } catch {
        return null;
      }
    })();
  const [status, setStatus] = useState<"waiting" | "success" | "timeout">("waiting");
  const [mensagem, setMensagem] = useState("Confirmando seu pagamento...");
  const [retryKey, setRetryKey] = useState(0);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    let cancelled = false;
    startedAt.current = Date.now();

    async function poll() {
      while (!cancelled) {
        if (Date.now() - startedAt.current > POLL_TIMEOUT_MS) {
          setStatus("timeout");
          setMensagem("Ainda estamos aguardando a confirmação. Se pagou via PIX, pode levar alguns minutos.");
          return;
        }

        try {
          const statusRes = await fetch(
            `/api/funnel/checkout-status?token=${encodeURIComponent(token!)}`,
          );
          if (statusRes.ok) {
            const data = await statusRes.json();
            if (data.ready) {
              const completeRes = await fetch("/api/funnel/complete-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ checkoutToken: token }),
              });
              if (completeRes.ok) {
                const authData = await completeRes.json();
                setAuth(authData.token, authData.user);
                setStatus("success");
                setMensagem("Pagamento confirmado! Entrando na plataforma...");
                const destino = authData.user?.primeiroAcesso ? "/jornada/traco" : "/dashboard";
                setTimeout(() => navigate(destino), 800);
                return;
              }
            }
          }
        } catch {
          /* retry */
        }

        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [token, navigate, retryKey]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: "#0f0c09" }}
    >
      <div className="max-w-md w-full text-center p-8 rounded-2xl"
        style={{ background: "#1e1812", border: "1px solid rgba(200,165,107,0.2)" }}>
        {status === "success" ? (
          <CheckCircle2 size={48} className="mx-auto mb-4" style={{ color: "#c8a56b" }} />
        ) : (
          <Loader2 size={48} className="mx-auto mb-4 animate-spin" style={{ color: "#c8a56b" }} />
        )}
        <h1 className="font-tan-mon-cheri text-2xl mb-3" style={{ color: "#f7f2ec" }}>
          {status === "success" ? "Acesso liberado!" : "Quase pronto"}
        </h1>
        <p className="text-sm mb-6" style={{ color: "rgba(247,242,236,0.5)" }}>
          {mensagem}
        </p>
        {status === "timeout" && token && (
          <div className="flex flex-col gap-3 items-center">
            <button
              type="button"
              onClick={() => {
                setRetryKey((k) => k + 1);
                setStatus("waiting");
                setMensagem("Confirmando seu pagamento...");
              }}
              className="text-sm font-semibold px-4 py-2 rounded-xl"
              style={{ background: "rgba(200,165,107,0.15)", color: "#c8a56b" }}
            >
              Verificar novamente
            </button>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm underline"
              style={{ color: "#c8a56b" }}
            >
              Ir para o login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
