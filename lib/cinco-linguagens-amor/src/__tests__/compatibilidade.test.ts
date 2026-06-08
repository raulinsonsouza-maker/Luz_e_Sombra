import assert from "node:assert/strict";
import test from "node:test";
import { CODIGOS_PAR } from "../perguntas.js";
import { computarLinguagensAmor } from "../compute.js";
import { computarCompatibilidade } from "../narrativa/compatibilidade.js";

test("compatibilidade alta quando receber de A = expressar de B", () => {
  const answers: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_PAR.map((id) => [id, "a" as const]));
  const perfil = computarLinguagensAmor({ answers });
  const compat = computarCompatibilidade(
    { receber: perfil.receber, expressar: perfil.expressar, nome: "Você" },
    { receber: perfil.receber, expressar: perfil.expressar, nome: "Parceiro" },
  );
  assert.equal(compat.matchARecebeBExpressa, true);
  assert.equal(compat.matchBRecebeAExpressa, true);
  assert.ok(compat.pontuacaoCompatibilidade >= 90);
});

test("modo manual aceita principal expressar", () => {
  const answers: Record<string, "a" | "b"> = Object.fromEntries(CODIGOS_PAR.map((id) => [id, "a" as const]));
  const perfil = computarLinguagensAmor({ answers });
  const compat = computarCompatibilidade(
    { receber: perfil.receber, expressar: perfil.expressar },
    { nome: "Mãe", principalExpressar: "tempo" },
  );
  assert.ok(compat.resumoHumano.length > 20);
  assert.ok(compat.pontesParaA.length >= 1);
});
