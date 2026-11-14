import { safeSessionStorage } from "@/lib/safeStorage";

const UTM_STORAGE_KEY = "lp_utm_params";

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  /** Clique do Meta Ads — melhora atribuição. */
  fbclid?: string;
}

export function captureUtmsFromUrl(): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const utm: UtmParams = {};
  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  const content = params.get("utm_content");
  const term = params.get("utm_term");
  const fbclid = params.get("fbclid");
  if (source) utm.source = source;
  if (medium) utm.medium = medium;
  if (campaign) utm.campaign = campaign;
  if (content) utm.content = content;
  if (term) utm.term = term;
  if (fbclid) utm.fbclid = fbclid;
  if (Object.keys(utm).length === 0) return;
  try {
    const prev = getStoredUtms() ?? {};
    safeSessionStorage().setItem(UTM_STORAGE_KEY, JSON.stringify({ ...prev, ...utm }));
  } catch {
    /* ignore */
  }
}

export function getStoredUtms(): UtmParams | undefined {
  try {
    const raw = safeSessionStorage().getItem(UTM_STORAGE_KEY);
    if (!raw) return undefined;
    return JSON.parse(raw) as UtmParams;
  } catch {
    return undefined;
  }
}
