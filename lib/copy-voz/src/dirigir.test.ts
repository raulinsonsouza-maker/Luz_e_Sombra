import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { dirigir, nomeNivelComSexo, sexoOuPadrao, TRATAMENTO } from "./dirigir.js";

describe("dirigir", () => {
  it("fallback feminino quando sexo ausente", () => {
    assert.equal(sexoOuPadrao(null), "feminino");
    assert.equal(TRATAMENTO.bemVindo(undefined), "Bem-vinda");
  });

  it("escolhe variante masculina", () => {
    assert.equal(dirigir("masculino", { feminino: "pronta", masculino: "pronto" }), "pronto");
    assert.equal(TRATAMENTO.iluminado("masculino"), "Iluminado");
  });

  it("nomeNivelComSexo só altera Iluminado", () => {
    assert.equal(nomeNivelComSexo("Explorador", "feminino"), "Explorador");
    assert.equal(nomeNivelComSexo("Iluminado", "feminino"), "Iluminada");
  });
});
