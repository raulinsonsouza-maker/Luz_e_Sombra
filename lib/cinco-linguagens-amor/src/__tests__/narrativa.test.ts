import assert from "node:assert/strict";
import test from "node:test";
import { CODIGOS_CORE } from "../perguntas.js";
import { computarLinguagensAmor } from "../compute.js";
import { validarBlocosUnicos } from "../narrativa/anti-repeticao.js";

test("narrativa v3 não repete conteúdo entre blocos principais", () => {
  const answers: Record<string, "a" | "b"> = Object.fromEntries(
    CODIGOS_CORE.map((id, i) => [id, i % 2 === 0 ? "a" : "b"] as const),
  );
  const r = computarLinguagensAmor({ answers });
  const n = r.narrativa;
  const erros = validarBlocosUnicos({
    abertura: n.abertura,
    mecanismo: n.mecanismo,
    ferida: n.feridaPadrao,
    dinamica: n.dinamicaPar,
    carta: n.cartaParceiro,
    anti: n.linguagemAnti,
  });
  assert.equal(erros.length, 0, erros.join("; "));
  assert.ok(n.cartaParceiro.length > 50);
  assert.ok(n.planoSeteDias.every((d) => d.length > 15));
});
