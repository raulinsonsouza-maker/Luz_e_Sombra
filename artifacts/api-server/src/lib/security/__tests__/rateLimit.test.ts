import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import type { Request, Response } from "express";
import {
  rateLimit,
  resetRateLimitBuckets,
  loginAbuseGuard,
} from "../rateLimit.js";

function mockReq(partial: Partial<Request> & { body?: Record<string, unknown>; ip?: string }): Request {
  return {
    ip: partial.ip ?? "127.0.0.1",
    headers: {},
    body: partial.body ?? {},
    socket: { remoteAddress: partial.ip ?? "127.0.0.1" },
    ...partial,
  } as unknown as Request;
}

function mockRes() {
  const headers: Record<string, string> = {};
  let statusCode = 200;
  let jsonBody: unknown = null;
  const res = {
    setHeader(k: string, v: string) {
      headers[k] = v;
      return res;
    },
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(body: unknown) {
      jsonBody = body;
      return res;
    },
    get statusCode() {
      return statusCode;
    },
    get body() {
      return jsonBody;
    },
    get headers() {
      return headers;
    },
  };
  return res;
}

describe("rateLimit", () => {
  beforeEach(() => resetRateLimitBuckets());

  it("bloqueia após exceder max no mesmo IP", () => {
    const mw = rateLimit({ name: "t", windowMs: 60_000, max: 2 });
    let nextCount = 0;
    const next = () => {
      nextCount += 1;
    };
    const req = mockReq({ ip: "1.1.1.1" });
    mw(req, mockRes() as unknown as Response, next);
    mw(req, mockRes() as unknown as Response, next);
    const res = mockRes();
    mw(req, res as unknown as Response, next);
    assert.equal(nextCount, 2);
    assert.equal(res.statusCode, 429);
    assert.ok(res.headers["Retry-After"]);
  });
});

describe("loginAbuseGuard", () => {
  beforeEach(() => resetRateLimitBuckets());

  it("aplica lockout após várias falhas", () => {
    const guard = loginAbuseGuard({
      windowMs: 60_000,
      maxAttempts: 3,
      lockMs: 60_000,
      hardLockAfter: 10,
      hardLockMs: 60_000,
    });
    const req = mockReq({ body: { email: "a@b.com" }, ip: "2.2.2.2" });
    let nextCount = 0;
    const next = () => {
      nextCount += 1;
    };
    for (let i = 0; i < 3; i++) {
      guard.middleware(req, mockRes() as unknown as Response, next);
      guard.recordFailure(req);
    }
    const res = mockRes();
    guard.middleware(req, res as unknown as Response, next);
    assert.equal(res.statusCode, 429);
  });
});
