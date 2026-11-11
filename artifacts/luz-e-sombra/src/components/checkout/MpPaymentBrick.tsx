import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    MercadoPago?: new (
      publicKey: string,
      options?: { locale?: string },
    ) => {
      bricks: () => {
        create: (
          type: string,
          containerId: string,
          settings: Record<string, unknown>,
        ) => Promise<{ unmount: () => void }>;
      };
    };
  }
}

type Props = {
  publicKey: string;
  amount: number;
  checkoutToken: string;
  payerEmail?: string | null;
  onApproved: () => void;
  onPending: (payload: unknown) => void;
  onError: (message: string) => void;
};

const CONTAINER_ID = "mpPaymentBrick_container";

async function loadMpSdk(): Promise<void> {
  if (window.MercadoPago) return;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-mp-sdk="v2"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Falha ao carregar Mercado Pago")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.dataset.mpSdk = "v2";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Falha ao carregar Mercado Pago"));
    document.head.appendChild(script);
  });
}

export default function MpPaymentBrick({
  publicKey,
  amount,
  checkoutToken,
  payerEmail,
  onApproved,
  onPending,
  onError,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const controllerRef = useRef<{ unmount: () => void } | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let cancelled = false;

    async function mount() {
      try {
        setLoading(true);
        await loadMpSdk();
        if (cancelled || !window.MercadoPago) return;

        const mp = new window.MercadoPago(publicKey, { locale: "pt-BR" });
        const bricksBuilder = mp.bricks();

        if (controllerRef.current) {
          try {
            controllerRef.current.unmount();
          } catch {
            /* ignore */
          }
        }

        const container = document.getElementById(CONTAINER_ID);
        if (container) container.innerHTML = "";

        controllerRef.current = await bricksBuilder.create("payment", CONTAINER_ID, {
          initialization: {
            amount,
            payer: payerEmail ? { email: payerEmail } : undefined,
          },
          customization: {
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              ticket: "all",
              bankTransfer: "all",
              maxInstallments: 6,
            },
            visual: {
              style: {
                theme: "dark",
              },
            },
          },
          callbacks: {
            onReady: () => {
              if (mounted.current) setLoading(false);
            },
            onError: (error: { message?: string }) => {
              onError(error?.message || "Erro no checkout Mercado Pago");
            },
            onSubmit: async ({ formData }: { formData: Record<string, unknown> }) => {
              setBusy(true);
              try {
                const res = await fetch("/api/payments/mp/process", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ checkoutToken, formData }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                  throw new Error(data.error || "Falha ao processar pagamento");
                }
                if (data.status === "approved" || data.alreadyPaid) {
                  onApproved();
                  return;
                }
                if (data.status === "pending" || data.status === "in_process") {
                  onPending(data);
                  return;
                }
                throw new Error(data.error || "Pagamento não aprovado. Tente outro meio.");
              } catch (err) {
                const message = err instanceof Error ? err.message : "Erro no pagamento";
                onError(message);
                throw err;
              } finally {
                if (mounted.current) setBusy(false);
              }
            },
          },
        });
      } catch (err) {
        if (!cancelled) {
          setLoading(false);
          onError(err instanceof Error ? err.message : "Não foi possível abrir o pagamento");
        }
      }
    }

    void mount();

    return () => {
      cancelled = true;
      mounted.current = false;
      try {
        controllerRef.current?.unmount();
      } catch {
        /* ignore */
      }
      controllerRef.current = null;
    };
  }, [publicKey, amount, checkoutToken, payerEmail]);

  return (
    <div className="relative min-h-[280px]">
      {(loading || busy) && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl" style={{ background: "rgba(12,9,6,0.55)" }}>
          <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#c8a56b" }} />
        </div>
      )}
      <div id={CONTAINER_ID} />
    </div>
  );
}
