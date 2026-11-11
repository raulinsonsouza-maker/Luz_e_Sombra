import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createHmac } from "node:crypto";
import {
  buildMpPaymentBody,
  sanitizeMpFormData,
  sanitizePaymentLog,
  stableIdempotencyKey,
  verifyMpWebhookSignature,
} from "../mpPaymentSanitize.js";
import { PRECO_OFERTA_NUM } from "../../acesso/periodo.js";

describe("sanitizeMpFormData", () => {
  it("força e-mail do cadastro e remove campos extras", () => {
    const result = sanitizeMpFormData(
      {
        payment_method_id: "visa",
        token: "tok_abc",
        installments: 3,
        transaction_amount: 1,
        cardNumber: "4111111111111111",
        payer: { email: "hacker@evil.com", identification: { type: "CPF", number: "529.982.247-25" } },
      },
      "cliente@portal.com",
    );
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.data.payer?.email, "cliente@portal.com");
    assert.equal(result.data.installments, 3);
    assert.equal(result.data.token, "tok_abc");
    assert.equal((result.data as { cardNumber?: string }).cardNumber, undefined);
  });

  it("rejeita parcelas inválidas", () => {
    const bad = sanitizeMpFormData(
      { payment_method_id: "visa", token: "tok", installments: 99 },
      "a@b.com",
    );
    assert.equal(bad.ok, false);
  });

  it("aceita Pix sem token", () => {
    const ok = sanitizeMpFormData({ payment_method_id: "pix" }, "a@b.com");
    assert.equal(ok.ok, true);
  });
});

describe("buildMpPaymentBody", () => {
  it("sempre usa PRECO_OFERTA_NUM mesmo se cliente tentou adulterar", () => {
    const sanitized = sanitizeMpFormData(
      { payment_method_id: "pix", transaction_amount: 0.01 },
      "a@b.com",
    );
    assert.equal(sanitized.ok, true);
    if (!sanitized.ok) return;
    const body = buildMpPaymentBody({
      form: sanitized.data,
      checkoutToken: "uuid",
      notificationUrl: "https://example.com/hook",
      payerEmail: "a@b.com",
    });
    assert.equal(body.transaction_amount, PRECO_OFERTA_NUM);
    assert.equal((body.payer as { email: string }).email, "a@b.com");
  });
});

describe("sanitizePaymentLog", () => {
  it("redige token e dados de cartão", () => {
    const out = sanitizePaymentLog({ token: "secret", card_number: "4111", status: "rejected" });
    assert.equal(out.token, "[redacted]");
    assert.equal(out.card_number, "[redacted]");
    assert.equal(out.status, "rejected");
  });
});

describe("verifyMpWebhookSignature", () => {
  it("aceita sem secret configurado", () => {
    assert.equal(
      verifyMpWebhookSignature({
        xSignature: undefined,
        xRequestId: undefined,
        dataId: "1",
        secret: "",
      }),
      true,
    );
  });

  it("valida assinatura HMAC correta", () => {
    const secret = "test_secret";
    const dataId = "123456";
    const requestId = "req-1";
    const ts = "1700000000";
    const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
    const v1 = createHmac("sha256", secret).update(manifest).digest("hex");
    assert.equal(
      verifyMpWebhookSignature({
        xSignature: `ts=${ts},v1=${v1}`,
        xRequestId: requestId,
        dataId,
        secret,
      }),
      true,
    );
    assert.equal(
      verifyMpWebhookSignature({
        xSignature: `ts=${ts},v1=deadbeef`,
        xRequestId: requestId,
        dataId,
        secret,
      }),
      false,
    );
  });
});

describe("stableIdempotencyKey", () => {
  it("é estável para o mesmo token/método", () => {
    const a = stableIdempotencyKey("ck", "visa", "tok_abcdef123456");
    const b = stableIdempotencyKey("ck", "visa", "tok_abcdef123456");
    assert.equal(a, b);
  });
});
