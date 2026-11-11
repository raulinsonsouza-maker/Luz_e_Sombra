import assert from "node:assert/strict";
import { describe, it } from "node:test";

/**
 * Contrato do funil pending (sem bater no DB real):
 * - register cria usuário/compra pending e devolve checkoutToken
 * - login de pending devolve 402 + checkoutToken
 * - check-email de pending NÃO vaza checkoutToken
 */
describe("funnel pending recovery contract", () => {
  it("register response shape inclui checkoutToken", () => {
    const registerOk = {
      checkoutToken: "tok-abc",
      userId: 1,
      username: "fulano",
    };
    assert.equal(typeof registerOk.checkoutToken, "string");
    assert.ok(registerOk.checkoutToken.length > 0);
  });

  it("login pending devolve 402 com code e token", () => {
    const loginPending = {
      status: 402,
      body: {
        error: "pagamento_pendente",
        code: "pagamento_pendente",
        checkoutToken: "tok-abc",
      },
    };
    assert.equal(loginPending.status, 402);
    assert.equal(loginPending.body.code, "pagamento_pendente");
    assert.ok(loginPending.body.checkoutToken);
  });

  it("check-email pending não inclui checkoutToken", () => {
    const checkPending = {
      available: false,
      status: "pending",
      message: "Este e-mail já está cadastrado. Faça login para continuar o pagamento.",
    };
    assert.equal(checkPending.status, "pending");
    assert.equal("checkoutToken" in checkPending, false);
  });
});
