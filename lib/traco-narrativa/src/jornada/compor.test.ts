import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { comporJornadaTraco, idsEtapas, textosDaJornada } from "./compor.js";

const BASE = {
  estruturas: {
    esquizoide: 11,
    oral: 23,
    psicopata: 15,
    masoquista: 19,
    rigido: 32,
  },
  estruturaPrincipal: "rigido" as const,
  estruturaSecundaria: "oral" as const,
};

describe("comporJornadaTraco", () => {
  it("devolve as nove etapas na ordem", () => {
    const jornada = comporJornadaTraco(BASE);
    assert.deepEqual(idsEtapas(jornada), [
      "mapa",
      "formacao",
      "dor",
      "recurso",
      "vida",
      "sombra",
      "outros",
      "integracao",
      "luz",
    ]);
    assert.equal(jornada.etapas.length, 9);
    assert.match(jornada.mapa.nomePrincipal, /Rígido/);
    assert.match(jornada.mapa.nomeSecundaria, /Oral/);
  });

  it("inclui o encontro entre principal e secundário", () => {
    const jornada = comporJornadaTraco(BASE);
    const outros = jornada.etapas.find((e) => e.id === "outros");
    const texto = outros?.blocos
      .filter((b) => b.tipo === "texto" || b.tipo === "destaque")
      .map((b) => ("texto" in b ? b.texto : ""))
      .join(" ");
    assert.match(texto ?? "", /Oral|vínculo|Rígido/i);
  });

  it("não coloca métricas técnicas na saída", () => {
    const jornada = comporJornadaTraco(BASE);
    const blob = textosDaJornada(jornada).join(" ");
    assert.equal(
      /convergência|assertividade|couraça|\bchakra\b|\bplexo\b|% de confiança|concordância entre fotos/i.test(blob),
      false,
    );
  });

  it("mantém o tom hipotético na formação", () => {
    const jornada = comporJornadaTraco(BASE);
    const formacao = jornada.etapas.find((e) => e.id === "formacao");
    const blob = formacao?.blocos
      .filter((b) => b.tipo === "texto")
      .map((b) => b.texto)
      .join(" ");
    assert.match(blob ?? "", /pode ter|observe se|abordagem/i);
  });
});
