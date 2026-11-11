import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addMonths,
  computeAccessWindow,
  diasRestantes,
  isAccessExpired,
  FUNDADORES_CAP,
  PRECO_OFERTA_NUM,
} from "../acesso/periodo";

describe("acesso periodo", () => {
  it("soma 6 meses calendário", () => {
    const inicio = new Date(2026, 4, 10); // 10/05/2026
    const fim = addMonths(inicio, 6);
    assert.equal(fim.getFullYear(), 2026);
    assert.equal(fim.getMonth(), 10); // novembro
    assert.equal(fim.getDate(), 10);
  });

  it("ajusta último dia do mês quando o dia não existe", () => {
    const inicio = new Date(2026, 0, 31); // 31/01
    const fim = addMonths(inicio, 1);
    assert.equal(fim.getMonth(), 1); // fevereiro
    assert.equal(fim.getDate(), 28);
  });

  it("computeAccessWindow define garantia de 7 dias e 6 meses", () => {
    const pagoEm = new Date(2026, 0, 1);
    const w = computeAccessWindow(pagoEm);
    assert.equal(w.acessoInicio.getTime(), pagoEm.getTime());
    assert.equal(w.acessoAte.getMonth(), 6);
    assert.equal(w.garantiaAte.getDate(), 8);
  });

  it("isAccessExpired e diasRestantes", () => {
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const future = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    assert.equal(isAccessExpired(past), true);
    assert.equal(isAccessExpired(future), false);
    assert.equal(isAccessExpired(null), false);
    assert.equal(diasRestantes(future), 3);
    assert.equal(diasRestantes(past), 0);
  });

  it("constantes da oferta", () => {
    assert.equal(FUNDADORES_CAP, 111);
    assert.equal(PRECO_OFERTA_NUM, 111.11);
  });
});
