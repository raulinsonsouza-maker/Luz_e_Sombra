import assert from "node:assert/strict";
import test from "node:test";
import { CODIGOS_PAR, PARES_EXPRESSAR, PARES_RECEBER } from "../perguntas.js";
import { computarLinguagensAmor } from "../compute.js";
import type { LinguagemAmor } from "../types.js";

function contarAparicoes(pares: typeof PARES_RECEBER): Record<LinguagemAmor, number> {
  const acc: Record<LinguagemAmor, number> = {
    palavras: 0,
    tempo: 0,
    presentes: 0,
    servicos: 0,
    toque: 0,
  };
  for (const p of pares) {
    acc[p.linguagemA] += 1;
    acc[p.linguagemB] += 1;
  }
  return acc;
}

test("cada bloco tem 6 aparições por linguagem", () => {
  for (const pares of [PARES_RECEBER, PARES_EXPRESSAR]) {
    const c = contarAparicoes(pares);
    for (const lang of Object.keys(c) as LinguagemAmor[]) {
      assert.equal(c[lang], 6, `${lang} em ${pares[0].bloco}`);
    }
  }
});

test("soma das pontuações é 15 por dimensão", () => {
  const answers: Record<string, "a" | "b"> = {};
  for (const id of CODIGOS_PAR) {
    answers[id] = id.charCodeAt(2) % 2 === 0 ? "a" : "b";
  }
  const r = computarLinguagensAmor({ answers });
  const sumR = Object.values(r.receber.pontuacoes).reduce((a, b) => a + b, 0);
  const sumE = Object.values(r.expressar.pontuacoes).reduce((a, b) => a + b, 0);
  assert.equal(sumR, 15);
  assert.equal(sumE, 15);
  assert.equal(r.versao, "linguagens_amor_v2");
});

test("resultado v2 inclui receber e expressar separados", () => {
  const answers: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_PAR.map((id) => [id, "a" as const]));
  const r = computarLinguagensAmor({ answers });
  assert.ok(r.receber.principal);
  assert.ok(r.expressar.principal);
  assert.ok(r.metricas.confianca >= 0 && r.metricas.confianca <= 100);
  assert.equal(r.principal, r.receber.principal);
});

test("todas A vs todas B produzem distribuições diferentes", () => {
  const allA: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_PAR.map((id) => [id, "a" as const]));
  const allB: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_PAR.map((id) => [id, "b" as const]));
  const ra = computarLinguagensAmor({ answers: allA });
  const rb = computarLinguagensAmor({ answers: allB });
  assert.notDeepEqual(ra.receber.pontuacoes, rb.receber.pontuacoes);
});
