import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  checkoutWelcomeEmail,
  accessGrantedEmail,
  passwordResetEmail,
  passwordChangedEmail,
  paymentPendingReminderEmail,
  journeyNudgeEmail,
} from "../templates/index.js";
import { EMAIL_PORTAL_NAME } from "../branding.js";

const LOGIN = "https://portaliluminando.com.br/login";
const JORNADA = "https://portaliluminando.com.br/jornada/traco";

describe("email templates", () => {
  it("checkout_welcome inclui checkout e login", () => {
    const { subject, html } = checkoutWelcomeEmail({
      nome: "Maria Silva",
      checkoutUrl: "https://portaliluminando.com.br/checkout?token=abc",
      loginUrl: LOGIN,
    });
    assert.match(subject, /Bem-vindo/i);
    assert.match(subject, new RegExp(EMAIL_PORTAL_NAME));
    assert.match(html, /checkout\?token=abc/);
    assert.match(html, /\/login/);
    assert.match(html, /Maria/);
    assert.match(html, /Jornada Da Sombra à Luz/);
  });

  it("access_granted prioriza login e inclui jornada", () => {
    const { subject, html } = accessGrantedEmail({
      nome: "João",
      email: "joao@test.com",
      loginUrl: LOGIN,
      jornadaUrl: JORNADA,
    });
    assert.match(subject, /Pagamento confirmado/i);
    assert.match(html, /joao@test\.com/);
    assert.match(html, /Acessar minha conta/);
    assert.match(html, /\/login/);
    assert.match(html, /Traço de Caráter/);
    assert.match(html, /jornada\/traco/);
  });

  it("password_reset inclui link de redefinição", () => {
    const { html } = passwordResetEmail({
      nome: "Ana",
      resetUrl: "https://portaliluminando.com.br/redefinir-senha?token=xyz",
    });
    assert.match(html, /redefinir-senha\?token=xyz/);
    assert.match(html, /Criar nova senha/);
  });

  it("password_changed aponta para login", () => {
    const { html } = passwordChangedEmail({
      nome: "Pedro",
      loginUrl: LOGIN,
    });
    assert.match(html, /Fazer login/);
    assert.match(html, /\/login/);
  });

  it("payment_pending_reminder inclui checkout e login", () => {
    const { subject, html } = paymentPendingReminderEmail({
      nome: "Ana",
      checkoutUrl: "https://portaliluminando.com.br/checkout?token=xyz",
      loginUrl: LOGIN,
    });
    assert.match(subject, /PIX|pendente/i);
    assert.match(html, /checkout\?token=xyz/);
    assert.match(html, /\/login/);
  });

  it("journey_nudge aponta para módulo e login", () => {
    const { subject, html } = journeyNudgeEmail({
      nome: "Pedro",
      moduloTitulo: "Traço de Caráter",
      jornadaUrl: JORNADA,
      loginUrl: LOGIN,
    });
    assert.match(subject, /jornada/i);
    assert.match(html, /Traço de Caráter/);
    assert.match(html, /jornada\/traco/);
    assert.match(html, /Fazer login/);
  });
});
