import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  computeAccessWindow,
  isAccessExpired,
  PRECO_OFERTA_NUM,
  ACESSO_MESES,
} from "../periodo.js";

describe("acesso pós-pagamento", () => {
  it("define janela de 6 meses e garantia", () => {
    const pagoEm = new Date("2026-01-15T12:00:00.000Z");
    const w = computeAccessWindow(pagoEm);
    assert.equal(w.acessoInicio.toISOString(), pagoEm.toISOString());
    assert.ok(w.acessoAte.getTime() > w.acessoInicio.getTime());
    const monthsApprox =
      (w.acessoAte.getFullYear() - w.acessoInicio.getFullYear()) * 12 +
      (w.acessoAte.getMonth() - w.acessoInicio.getMonth());
    assert.equal(monthsApprox, ACESSO_MESES);
  });

  it("considera expirado após acessoAte", () => {
    const w = computeAccessWindow(new Date("2020-01-01T00:00:00.000Z"));
    assert.equal(isAccessExpired(w.acessoAte, new Date("2030-01-01T00:00:00.000Z")), true);
    assert.equal(isAccessExpired(w.acessoAte, new Date("2020-01-02T00:00:00.000Z")), false);
  });

  it("preço oficial da oferta é positivo e fixo", () => {
    assert.equal(PRECO_OFERTA_NUM, 111.11);
  });
});
