import assert from "node:assert/strict";
import test from "node:test";
import { CODIGOS_PAR } from "../perguntas.js";
import { computarLinguagensAmor } from "../compute.js";

test("resultado inclui narrativa enriquecida", () => {
  const answers: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_PAR.map((id) => [id, "a" as const]));
  const r = computarLinguagensAmor({ answers });
  assert.ok(r.sinteseHumana.length > 20);
  assert.equal(r.perfilPrincipal.linguagem, r.principal);
  assert.equal(r.perfilSecundario.linguagem, r.secundaria);
  assert.ok(r.perfilPrincipal.dialetos.length >= 3);
  assert.ok(r.recomendacoes.length >= 3);
  assert.ok(r.paraQuemTeAma.length > 30);
  assert.ok(r.combinacao.length > 20);
});

test("perfil equilibrado quando diferença entre 1º e 2º é pequena", () => {
  const answers: Record<string, "a" | "b"> = {};
  for (const id of CODIGOS_PAR) {
    const n = Number(id.slice(1));
    answers[id] = n % 2 === 0 ? "a" : "b";
  }
  const r = computarLinguagensAmor({ answers });
  const gap = r.ranking[0].pontos - r.ranking[1].pontos;
  if (gap <= 2 && r.principal !== r.secundaria) {
    assert.equal(r.perfilEquilibrado, true);
    assert.ok(r.sinteseHumana.includes("bilíngue"));
  }
});
