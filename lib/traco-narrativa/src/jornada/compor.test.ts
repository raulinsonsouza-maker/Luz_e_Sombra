import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { comporJornadaTraco, estruturaTerciariaDe, idsEtapas, textosDaJornada } from "./compor.js";

const BASE = {
  estruturas: {
    esquizoide: 11,
    oral: 29,
    psicopata: 13,
    masoquista: 22,
    rigido: 25,
  },
  estruturaPrincipal: "oral" as const,
  estruturaSecundaria: "rigido" as const,
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
    assert.match(jornada.mapa.nomePrincipal, /Oral/);
    assert.match(jornada.mapa.nomeSecundaria, /Rígido/);
    assert.match(jornada.mapa.nomeTerciaria, /Masoquista/);
  });

  it("deriva o terceiro traço pelo ranking de percentuais", () => {
    assert.equal(estruturaTerciariaDe(BASE.estruturas, "oral", "rigido"), "masoquista");
  });

  it("cruza os três principais no mapa e na etapa 7", () => {
    const jornada = comporJornadaTraco(BASE);
    assert.match(jornada.mapa.significado, /Oral/);
    assert.match(jornada.mapa.significado, /Rígido/);
    assert.match(jornada.mapa.significado, /terceiro tom|Masoquista/i);
    assert.match(jornada.mapa.significado, /com organização|com presença de Rígido/i);

    const outros = jornada.etapas.find((e) => e.id === "outros");
    const texto = outros?.blocos
      .filter((b) => b.tipo === "texto" || b.tipo === "destaque")
      .map((b) => ("texto" in b ? b.texto : ""))
      .join(" ");
    assert.match(texto ?? "", /Oral/);
    assert.match(texto ?? "", /Rígido/);
    assert.match(texto ?? "", /Masoquista/);
    assert.match(texto ?? "", /terceiro|Em terceiro/i);
  });

  it("não coloca métricas técnicas nem jargão residual na saída", () => {
    const jornada = comporJornadaTraco(BASE);
    const blob = textosDaJornada(jornada).join(" ");
    assert.equal(
      /convergência|assertividade|couraça|\bchakra\b|\bplexo\b|% de confiança|concordância entre fotos|landmarks|biométrica|Na abordagem dos traços|padrão adaptativo|mecanismo de proteção/i.test(
        blob,
      ),
      false,
    );
    assert.equal(/tratandose/.test(blob), false);
  });

  it("mantém o tom hipotético na formação", () => {
    const jornada = comporJornadaTraco(BASE);
    const formacao = jornada.etapas.find((e) => e.id === "formacao");
    const blob = formacao?.blocos
      .filter((b) => b.tipo === "texto")
      .map((b) => b.texto)
      .join(" ");
    assert.match(blob ?? "", /pode ter|observe se/i);
  });
});
