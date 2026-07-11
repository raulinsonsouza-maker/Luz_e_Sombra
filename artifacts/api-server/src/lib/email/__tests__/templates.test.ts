import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkoutWelcomeEmail, accessGrantedEmail } from "../templates/index.js";

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
});
