import { createHash, randomBytes } from "node:crypto";

const RESET_TOKEN_BYTES = 32;
const RESET_TTL_MS = 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

const resetRequestLog = new Map<string, number[]>();

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateResetToken(): string {
  return randomBytes(RESET_TOKEN_BYTES).toString("hex");
}

export function getResetTokenExpiry(): Date {
  return new Date(Date.now() + RESET_TTL_MS);
}

export function isResetRateLimited(email: string): boolean {
  const key = email.trim().toLowerCase();
  const now = Date.now();
  const recent = (resetRequestLog.get(key) ?? []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  resetRequestLog.set(key, recent);
  return recent.length >= RATE_LIMIT_MAX;
}

export function recordResetRequest(email: string): void {
  const key = email.trim().toLowerCase();
  const now = Date.now();
  const recent = (resetRequestLog.get(key) ?? []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  resetRequestLog.set(key, recent);
}
