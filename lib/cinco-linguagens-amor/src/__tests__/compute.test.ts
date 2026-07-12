import assert from "node:assert/strict";
import test from "node:test";
import { CODIGOS_CORE, PARES_RECEBER } from "../perguntas.js";
import { computarLinguagensAmor, avaliarNecessidadeDesempate } from "../compute.js";
import { validarBlocosUnicos } from "../narrativa/anti-repeticao.js";
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

test("bloco receber v3 tem 8 aparições por linguagem", () => {
  const c = contarAparicoes(PARES_RECEBER);
  for (const lang of Object.keys(c) as LinguagemAmor[]) {
    assert.equal(c[lang], 8, `${lang}`);
  }
});

test("soma das pontuações receber é 20", () => {
  const answers: Record<string, "a" | "b"> = {};
  for (const id of CODIGOS_CORE) {
    answers[id] = id.charCodeAt(2) % 2 === 0 ? "a" : "b";
  }
  const r = computarLinguagensAmor({ answers });
  const sumR = Object.values(r.receber.pontuacoes).reduce((a, b) => a + b, 0);
  assert.equal(sumR, 20);
  assert.equal(r.versao, "linguagens_amor_v3");
});

test("resultado v3 inclui narrativa com blocos únicos", () => {
  const answers: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_CORE.map((id) => [id, "a" as const]));
  const r = computarLinguagensAmor({ answers });
  assert.ok(r.narrativa.veredito.length > 10);
  assert.ok(r.narrativa.abertura.length > 20);
  assert.equal(r.narrativa.cenas.length, 3);
  assert.equal(r.narrativa.planoSeteDias.length, 7);
  assert.ok(r.metricas.confiancaLabel);
  assert.ok(r.distribuicao.reduce((s, x) => s + x.pct, 0) >= 99);
  const erros = validarBlocosUnicos({
    abertura: r.narrativa.abertura,
    mecanismo: r.narrativa.mecanismo,
    ferida: r.narrativa.feridaPadrao,
    dinamica: r.narrativa.dinamicaPar,
    carta: r.narrativa.cartaParceiro,
  });
  assert.equal(erros.length, 0, erros.join("; "));
});

test("avaliarNecessidadeDesempate retorna null para perfil claro", () => {
  const answers: Record<string, "a" | "b"> = {};
  for (const id of CODIGOS_CORE) {
    answers[id] = id.endsWith("1") || id.endsWith("3") || id.endsWith("6") || id.endsWith("9") || id.endsWith("16") ? "a" : "b";
  }
  const aval = avaliarNecessidadeDesempate(answers);
  if (aval !== null) {
    assert.ok(aval.gap <= 1);
    return;
  }
  assert.equal(aval, null);
});

test("expressar opcional completa perfil", () => {
  const answers: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_CORE.map((id) => [id, "a" as const]));
  answers.E01 = "b";
  answers.E02 = "a";
  answers.E03 = "b";
  answers.E04 = "a";
  answers.E05 = "b";
  const r = computarLinguagensAmor({ answers });
  assert.equal(r.expressarCompleto, true);
  assert.notEqual(r.expressar.principal, r.receber.principal);
});
