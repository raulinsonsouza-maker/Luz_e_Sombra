import assert from "node:assert/strict";
import test from "node:test";
import { CODIGOS_PAR } from "../perguntas.js";
import { entradaLinguagensAmorSchema } from "../schemas.js";

test("schema rejeita códigos v1 P01", () => {
  const answers: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_PAR.map((id) => [id, "a" as const]));
  answers.P01 = "a";
  const r = entradaLinguagensAmorSchema.safeParse({ answers });
  assert.equal(r.success, false);
});

test("schema aceita R01–E15 completos", () => {
  const answers: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_PAR.map((id) => [id, "b" as const]));
  const r = entradaLinguagensAmorSchema.safeParse({ answers });
  assert.equal(r.success, true);
});
