import { getKommoConfig } from "./config";

const MIN_INTERVAL_MS = 150; // ~6–7 req/s
let lastRequestAt = 0;
let chain: Promise<void> = Promise.resolve();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function throttle(): Promise<void> {
  const now = Date.now();
  const wait = Math.max(0, MIN_INTERVAL_MS - (now - lastRequestAt));
  if (wait > 0) await sleep(wait);
  lastRequestAt = Date.now();
}

export class KommoApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    super(`Kommo API ${status}: ${body.slice(0, 300)}`);
    this.status = status;
    this.body = body;
  }
}

export type KommoRequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  path: string;
  body?: unknown;
};

export async function kommoRequest<T = unknown>(options: KommoRequestOptions): Promise<T> {
  const cfg = getKommoConfig();
  if (!cfg.subdomain || !cfg.apiToken) {
    throw new Error("Kommo não configurada");
  }

  const run = async (): Promise<T> => {
    await throttle();

    const url = `https://${cfg.subdomain}.kommo.com/api/v4${options.path}`;
    const res = await fetch(url, {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${cfg.apiToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

    const text = await res.text();
    if (!res.ok) {
      throw new KommoApiError(res.status, text);
    }

    if (!text) return {} as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return {} as T;
    }
  };

  const result = chain.then(run, run);
  chain = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}
