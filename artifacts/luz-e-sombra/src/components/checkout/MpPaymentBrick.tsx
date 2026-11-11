import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { formatLpPrice, LP_PRICE_INSTALLMENTS } from "@/lib/lpConfig";
import { trackMetaAddPaymentInfo } from "@/lib/metaPixel";

declare global {
  interface Window {
    MercadoPago?: new (
      publicKey: string,
      options?: { locale?: string },
    ) => MpSdk;
  }
}

type MpSdk = {
  createCardToken: (payload: Record<string, string>) => Promise<{
    id?: string;
    error?: string;
    message?: string;
  }>;
  getPaymentMethods: (payload: { bin: string }) => Promise<{
    results?: Array<{ id?: string }>;
  }>;
};

type Props = {
  publicKey: string;
  amount: number;
  checkoutToken: string;
  payerEmail?: string | null;
  payerName?: string | null;
  onApproved: () => void;
  onPending: (payload: {
    paymentId?: string | null;
    qrCode?: string | null;
    qrBase64?: string | null;
  }) => void;
  onError: (message: string) => void;
};

type Method = "pix" | "card";

const inputClass =
  "w-full px-4 py-3 rounded-xl text-sm outline-none transition-[border-color,box-shadow] focus:border-[rgba(200,165,107,0.55)] focus:ring-2 focus:ring-[rgba(200,165,107,0.15)]";

const inputStyle = {
  background: "rgba(15,12,9,0.8)",
  border: "1px solid rgba(200,165,107,0.2)",
  color: "#f7f2ec",
} as const;

function digits(value: string): string {
  return value.replace(/\D/g, "");
}

function formatCpf(value: string): string {
  const d = digits(value).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatCardNumber(value: string): string {
  return digits(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();
}

function formatExpiry(value: string): string {
  const d = digits(value).slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function isValidCpf(raw: string): boolean {
  const cpf = digits(raw);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const calc = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i++) total += Number(base[i]) * (factor - i);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  const d1 = calc(cpf.slice(0, 9), 10);
  const d2 = calc(cpf.slice(0, 10), 11);
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
}

async function loadMpSdk(): Promise<void> {
  if (window.MercadoPago) return;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-mp-sdk="v2"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Falha ao carregar Mercado Pago")));
      if (window.MercadoPago) resolve();
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
  payerName,
  onApproved,
  onPending,
  onError,
}: Props) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState<Method>("pix");
  const [cpf, setCpf] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiration, setCardExpiration] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [cardholderName, setCardholderName] = useState(payerName ?? "");
  const [installments, setInstallments] = useState(1);
  const [localError, setLocalError] = useState("");
  const [mp, setMp] = useState<MpSdk | null>(null);

  const installmentOptions = useMemo(() => {
    const max = Math.max(1, LP_PRICE_INSTALLMENTS);
    return Array.from({ length: max }, (_, i) => i + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadMpSdk();
        if (cancelled || !window.MercadoPago) return;
        setMp(new window.MercadoPago(publicKey, { locale: "pt-BR" }));
        setReady(true);
      } catch (err) {
        if (!cancelled) {
          onError(err instanceof Error ? err.message : "Não foi possível abrir o pagamento");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- monta o SDK uma vez por publicKey
  }, [publicKey]);

  useEffect(() => {
    if (payerName && !cardholderName) setCardholderName(payerName);
  }, [payerName, cardholderName]);

  async function createCardToken() {
    if (!mp) throw new Error("Checkout ainda carregando.");
    const exp = cardExpiration.replace(/\s/g, "");
    const [month, year] = exp.split("/");
    if (!month || !year) throw new Error("Informe a validade no formato MM/AA.");
    const token = await mp.createCardToken({
      cardNumber: digits(cardNumber),
      cardholderName: cardholderName.trim(),
      cardExpirationMonth: month,
      cardExpirationYear: year.length === 2 ? `20${year}` : year,
      securityCode: securityCode.trim(),
      identificationType: "CPF",
      identificationNumber: digits(cpf),
    });
    if (token.error || !token.id) {
      throw new Error(token.message || "Não foi possível validar o cartão.");
    }
    return token.id;
  }

  async function handlePay() {
    setLocalError("");
    setBusy(true);
    try {
      if (!ready || !mp) throw new Error("Checkout ainda carregando.");
      if (!isValidCpf(cpf)) throw new Error("Informe um CPF válido.");

      const formData: Record<string, unknown> = {
        payment_method_id: method === "pix" ? "pix" : undefined,
        payer: {
          email: payerEmail || undefined,
          identification: {
            type: "CPF",
            number: digits(cpf),
          },
        },
      };

      if (method === "card") {
        if (digits(cardNumber).length < 13) throw new Error("Número do cartão incompleto.");
        if (!cardholderName.trim()) throw new Error("Informe o nome impresso no cartão.");
        if (digits(securityCode).length < 3) throw new Error("Informe o CVV.");
        const token = await createCardToken();
        formData.token = token;
        formData.installments = installments;
        try {
          const bin = digits(cardNumber).slice(0, 6);
          const methods = await mp.getPaymentMethods({ bin });
          formData.payment_method_id = methods?.results?.[0]?.id || null;
        } catch {
          /* payment_method_id opcional; MP pode inferir pelo token */
        }
        if (!formData.payment_method_id) {
          throw new Error("Não identificamos a bandeira do cartão. Confira o número.");
        }
      }

      trackMetaAddPaymentInfo(method);
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
        const tx =
          data.pix ??
          data.pointOfInteraction?.transaction_data ??
          data.point_of_interaction?.transaction_data ??
          {};
        onPending({
          paymentId: data.paymentId ?? null,
          qrCode: typeof tx.qr_code === "string" ? tx.qr_code : null,
          qrBase64: typeof tx.qr_code_base64 === "string" ? tx.qr_code_base64 : null,
        });
        return;
      }
      throw new Error(data.error || "Pagamento não aprovado. Tente outro meio.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro no pagamento";
      setLocalError(message);
      onError(message);
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-7 h-7 animate-spin" style={{ color: "#c8a56b" }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: "rgba(200,165,107,0.7)" }}>
            Pagamento
          </p>
          <p className="text-sm mt-1" style={{ color: "rgba(247,242,236,0.55)" }}>
            Total{" "}
            <span className="font-semibold" style={{ color: "#e8d5b0" }}>
              {formatLpPrice(amount)}
            </span>
          </p>
        </div>
        {payerEmail ? (
          <p className="text-[11px] text-right max-w-[55%] truncate" style={{ color: "rgba(247,242,236,0.35)" }}>
            {payerEmail}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="mp-cpf" className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.55)" }}>
          CPF
        </label>
        <input
          id="mp-cpf"
          inputMode="numeric"
          autoComplete="off"
          value={cpf}
          onChange={(e) => setCpf(formatCpf(e.target.value))}
          placeholder="000.000.000-00"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(["pix", "card"] as const).map((m) => {
          const on = method === m;
          return (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className="rounded-xl py-2.5 text-sm font-medium transition-colors"
              style={{
                background: on ? "rgba(200,165,107,0.18)" : "rgba(255,255,255,0.03)",
                border: on ? "1px solid rgba(200,165,107,0.55)" : "1px solid rgba(200,165,107,0.18)",
                color: on ? "#e8d5b0" : "rgba(247,242,236,0.55)",
              }}
            >
              {m === "pix" ? "Pix" : "Cartão"}
            </button>
          );
        })}
      </div>

      {method === "card" ? (
        <div className="space-y-3">
          <div>
            <label htmlFor="mp-card" className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.55)" }}>
              Número do cartão
            </label>
            <input
              id="mp-card"
              inputMode="numeric"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="mp-exp" className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.55)" }}>
                Validade
              </label>
              <input
                id="mp-exp"
                placeholder="MM/AA"
                autoComplete="cc-exp"
                value={cardExpiration}
                onChange={(e) => setCardExpiration(formatExpiry(e.target.value))}
                className={inputClass}
                style={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="mp-cvv" className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.55)" }}>
                CVV
              </label>
              <input
                id="mp-cvv"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={securityCode}
                onChange={(e) => setSecurityCode(digits(e.target.value).slice(0, 4))}
                className={inputClass}
                style={inputStyle}
              />
            </div>
          </div>
          <div>
            <label htmlFor="mp-holder" className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.55)" }}>
              Nome no cartão
            </label>
            <input
              id="mp-holder"
              autoComplete="cc-name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="mp-installments" className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.55)" }}>
              Parcelas
            </label>
            <select
              id="mp-installments"
              value={installments}
              onChange={(e) => setInstallments(Number(e.target.value))}
              className={inputClass}
              style={inputStyle}
            >
              {installmentOptions.map((n) => (
                <option key={n} value={n}>
                  {n}x de {formatLpPrice(amount / n)}
                  {n === 1 ? " à vista" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => void handlePay()}
        disabled={busy}
        className="w-full rounded-xl py-3.5 text-sm font-semibold transition-opacity disabled:opacity-60"
        style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a140e" }}
      >
        {busy ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processando…
          </span>
        ) : (
          "Pagar e liberar acesso"
        )}
      </button>

      {localError ? (
        <p className="text-xs text-center" style={{ color: "rgba(224,123,57,0.95)" }}>
          {localError}
        </p>
      ) : null}

      <p className="text-[11px] text-center" style={{ color: "rgba(247,242,236,0.35)" }}>
        Mercado Pago · pagamento seguro no navegador
      </p>
    </div>
  );
}
