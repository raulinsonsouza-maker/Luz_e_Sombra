import { LP_JOURNEY_NAME, LP_PRICE } from "@/lib/lpConfig";
import { safeSessionStorage } from "@/lib/safeStorage";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

export const META_PIXEL_ID = "1154669126746844";

const PURCHASE_DEDUP_KEY = "meta_purchase_sent_v1";

type FbqParams = Record<string, string | number | boolean | undefined>;

function fbqTrack(event: string, params?: FbqParams, options?: { eventID?: string }) {
  try {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;
    if (options?.eventID) {
      window.fbq("track", event, params ?? {}, { eventID: options.eventID });
    } else {
      window.fbq("track", event, params ?? {});
    }
  } catch {
    /* pixel bloqueado / WebView */
  }
}

function contentPayload(extra?: FbqParams): FbqParams {
  return {
    content_name: LP_JOURNEY_NAME,
    content_category: "Jornada",
    content_ids: ["jornada-sombra-luz"],
    content_type: "product",
    value: LP_PRICE,
    currency: "BRL",
    ...extra,
  };
}

/** ViewContent — LP / oferta */
export function trackMetaViewContent() {
  fbqTrack("ViewContent", contentPayload());
}

/** Lead — cadastro concluído */
export function trackMetaLead(extra?: FbqParams) {
  fbqTrack("Lead", contentPayload(extra));
}

/** InitiateCheckout — chegou na etapa de pagamento */
export function trackMetaInitiateCheckout(extra?: FbqParams) {
  fbqTrack("InitiateCheckout", {
    ...contentPayload(extra),
    num_items: 1,
  });
}

/** AddPaymentInfo — enviou Pix/cartão */
export function trackMetaAddPaymentInfo(method?: string) {
  fbqTrack("AddPaymentInfo", contentPayload({ payment_method: method }));
}

/**
 * Purchase — pagamento confirmado (valor da venda).
 * Dedup por checkoutToken para não disparar 2x no poll.
 */
export function trackMetaPurchase(opts?: {
  checkoutToken?: string | null;
  value?: number;
  orderId?: string | null;
}) {
  const token = opts?.checkoutToken?.trim() || "";
  if (token) {
    try {
      const key = `${PURCHASE_DEDUP_KEY}:${token}`;
      if (safeSessionStorage().getItem(key) === "1") return;
      safeSessionStorage().setItem(key, "1");
    } catch {
      /* ignore */
    }
  }

  const value = typeof opts?.value === "number" ? opts.value : LP_PRICE;
  fbqTrack(
    "Purchase",
    contentPayload({
      value,
      currency: "BRL",
      num_items: 1,
      order_id: opts?.orderId || token || undefined,
    }),
    token ? { eventID: `purchase_${token}` } : undefined,
  );
}
