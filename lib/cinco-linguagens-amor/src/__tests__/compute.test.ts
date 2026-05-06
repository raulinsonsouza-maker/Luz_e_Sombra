import assert from "node:assert/strict";
import test from "node:test";
import { CODIGOS_PAR } from "../perguntas.js";
import { computarLinguagensAmor } from "../compute.js";

test("soma das pontuações é sempre 30", () => {
  const answers: Record<string, "a" | "b"> = {};
  for (const id of CODIGOS_PAR) {
    answers[id] = id.charCodeAt(2) % 2 === 0 ? "a" : "b";
  }
  const r = computarLinguagensAmor({ answers });
  const sum = Object.values(r.pontuacoes).reduce((a, b) => a + b, 0);
  assert.equal(sum, 30);
});

test("se todas as escolhas são 'a', só pontuam linguagens do lado A de cada par", () => {
  const answers: Record<string, "a" | "b"> = {};
  for (const id of CODIGOS_PAR) answers[id] = "a";
  const r = computarLinguagensAmor({ answers });
  assert.ok(r.principal);
  assert.ok(r.interpretacaoPrincipal.length > 10);
});

test("todas A vs todas B produzem distribuições diferentes", () => {
  const allA: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_PAR.map((id) => [id, "a" as const]));
  const allB: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_PAR.map((id) => [id, "b" as const]));
  const ra = computarLinguagensAmor({ answers: allA });
  const rb = computarLinguagensAmor({ answers: allB });
  assert.notDeepEqual(ra.pontuacoes, rb.pontuacoes);
});
