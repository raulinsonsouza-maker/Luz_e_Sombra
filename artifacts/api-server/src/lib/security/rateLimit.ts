import type { Request, Response, NextFunction } from "express";

type Bucket = { count: number; resetAt: number; failures: number; lockUntil: number };

const buckets = new Map<string, Bucket>();

function nowMs(): number {
  return Date.now();
}

function getBucket(key: string, windowMs: number): Bucket {
  const existing = buckets.get(key);
  const now = nowMs();
  if (!existing || now >= existing.resetAt) {
    const fresh: Bucket = { count: 0, resetAt: now + windowMs, failures: 0, lockUntil: 0 };
    buckets.set(key, fresh);
    return fresh;
  }
  return existing;
}

export function clientIp(req: Request): string {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.trim()) return xf.split(",")[0]!.trim();
  return req.ip || req.socket.remoteAddress || "unknown";
}

export type RateLimitOptions = {
  name: string;
  windowMs: number;
  max: number;
  /** Chave extra (e-mail, token) além do IP. */
  keyFrom?: (req: Request) => string;
  message?: string;
};

export function rateLimit(opts: RateLimitOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = clientIp(req);
    const extra = opts.keyFrom?.(req)?.trim().toLowerCase() || "";
    const key = `${opts.name}:${ip}:${extra}`;
    const bucket = getBucket(key, opts.windowMs);
    const now = nowMs();

    if (bucket.lockUntil > now) {
      const retry = Math.ceil((bucket.lockUntil - now) / 1000);
      res.setHeader("Retry-After", String(retry));
      return res.status(429).json({
        error: opts.message || "Muitas tentativas. Aguarde e tente novamente.",
        code: "rate_limited",
      });
    }

    bucket.count += 1;
    if (bucket.count > opts.max) {
      const retry = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(Math.max(1, retry)));
      return res.status(429).json({
        error: opts.message || "Muitas tentativas. Aguarde e tente novamente.",
        code: "rate_limited",
      });
    }
    return next();
  };
}

/** Login: conta falhas e aplica lockout progressivo. */
export function loginAbuseGuard(opts?: {
  windowMs?: number;
  maxAttempts?: number;
  lockMs?: number;
  hardLockAfter?: number;
  hardLockMs?: number;
}) {
  const windowMs = opts?.windowMs ?? 15 * 60 * 1000;
  const maxAttempts = opts?.maxAttempts ?? 5;
  const lockMs = opts?.lockMs ?? 15 * 60 * 1000;
  const hardLockAfter = opts?.hardLockAfter ?? 20;
  const hardLockMs = opts?.hardLockMs ?? 60 * 60 * 1000;

  return {
    middleware(req: Request, res: Response, next: NextFunction) {
      const email = String(req.body?.email ?? req.body?.username ?? "")
        .trim()
        .toLowerCase();
      const ip = clientIp(req);
      const key = `login:${ip}:${email}`;
      const bucket = getBucket(key, windowMs);
      const now = nowMs();
      if (bucket.lockUntil > now) {
        const retry = Math.ceil((bucket.lockUntil - now) / 1000);
        res.setHeader("Retry-After", String(retry));
        return res.status(429).json({
          error: "Muitas tentativas. Aguarde e tente novamente.",
          code: "rate_limited",
        });
      }
      (req as Request & { __loginAbuseKey?: string }).__loginAbuseKey = key;
      return next();
    },
    recordFailure(req: Request) {
      const key = (req as Request & { __loginAbuseKey?: string }).__loginAbuseKey;
      if (!key) return;
      const bucket = getBucket(key, windowMs);
      bucket.failures += 1;
      bucket.count += 1;
      if (bucket.failures >= hardLockAfter) {
        bucket.lockUntil = nowMs() + hardLockMs;
      } else if (bucket.failures >= maxAttempts) {
        bucket.lockUntil = nowMs() + lockMs;
      }
    },
    recordSuccess(req: Request) {
      const key = (req as Request & { __loginAbuseKey?: string }).__loginAbuseKey;
      if (!key) return;
      buckets.delete(key);
    },
  };
}

/** Delay constante (~250–400ms) para equalizar timing em falhas de login. */
export async function constantLoginDelay(minMs = 250, maxMs = 400): Promise<void> {
  const ms = minMs + Math.floor(Math.random() * (maxMs - minMs + 1));
  await new Promise((r) => setTimeout(r, ms));
}

/** Test helper: limpa buckets entre testes. */
export function resetRateLimitBuckets(): void {
  buckets.clear();
}
