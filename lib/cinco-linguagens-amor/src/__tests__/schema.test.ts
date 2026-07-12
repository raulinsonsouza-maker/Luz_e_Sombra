import assert from "node:assert/strict";
import test from "node:test";
import { CODIGOS_CORE } from "../perguntas.js";
import { entradaLinguagensAmorSchema } from "../schemas.js";

test("schema rejeita códigos v1 P01", () => {
  const answers: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_CORE.map((id) => [id, "a" as const]));
  answers.P01 = "a";
  const r = entradaLinguagensAmorSchema.safeParse({ answers });
  assert.equal(r.success, false);
});

test("schema aceita R01–R20 completos", () => {
  const answers: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_CORE.map((id) => [id, "b" as const]));
  const r = entradaLinguagensAmorSchema.safeParse({ answers });
  assert.equal(r.success, true);
});

test("schema rejeita v2 R16 sem R20", () => {
  const answers: Record<string, "a" | "b"> = {};
  for (let i = 1; i <= 15; i++) {
    answers[`R${String(i).padStart(2, "0")}`] = "a";
  }
  const r = entradaLinguagensAmorSchema.safeParse({ answers });
  assert.equal(r.success, false);
});
