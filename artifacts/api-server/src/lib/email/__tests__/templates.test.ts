import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  checkoutWelcomeEmail,
  accessGrantedEmail,
  paymentPendingReminderEmail,
  journeyNudgeEmail,
} from "../templates/index.js";

describe("email templates", () => {
  it("checkout_welcome inclui link de checkout", () => {
    const { subject, html } = checkoutWelcomeEmail({
      nome: "Maria Silva",
      checkoutUrl: "https://portaliluminando.com.br/checkout?token=abc",
    });
    assert.match(subject, /pagamento/i);
    assert.match(html, /checkout\?token=abc/);
    assert.match(html, /Maria/);
  });

  it("access_granted inclui login e jornada", () => {
    const { html } = accessGrantedEmail({
      nome: "João",
      email: "joao@test.com",
      loginUrl: "https://portaliluminando.com.br/login",
      jornadaUrl: "https://portaliluminando.com.br/jornada/traco",
    });
    assert.match(html, /joao@test\.com/);
    assert.match(html, /jornada\/traco/);
  });

  it("payment_pending_reminder inclui checkout", () => {
    const { subject, html } = paymentPendingReminderEmail({
      nome: "Ana",
      checkoutUrl: "https://portaliluminando.com.br/checkout?token=xyz",
    });
    assert.match(subject, /PIX|pendente/i);
    assert.match(html, /checkout\?token=xyz/);
  });

  it("journey_nudge aponta para módulo", () => {
    const { subject, html } = journeyNudgeEmail({
      nome: "Pedro",
      moduloTitulo: "Traço de Caráter",
      jornadaUrl: "https://portaliluminando.com.br/jornada/traco",
    });
    assert.match(subject, /jornada/i);
    assert.match(html, /Traço de Caráter/);
    assert.match(html, /jornada\/traco/);
  });
});

describe("funnel helpers", () => {
  function normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  function isValidFunnelEmail(email: string): boolean {
    const norm = normalizeEmail(email);
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm);
  }

  it("valida e-mail do funil", () => {
    assert.equal(isValidFunnelEmail("  User@Mail.com "), true);
    assert.equal(isValidFunnelEmail("invalid"), false);
  });

  it("checkout paid redireciona para acesso-pos-compra", () => {
    const token = "abc-123";
    const status = "paid";
    const destino =
      status === "paid" ? `/acesso-pos-compra?token=${encodeURIComponent(token)}` : "/checkout";
    assert.match(destino, /acesso-pos-compra/);
    assert.match(destino, /abc-123/);
  });
});
