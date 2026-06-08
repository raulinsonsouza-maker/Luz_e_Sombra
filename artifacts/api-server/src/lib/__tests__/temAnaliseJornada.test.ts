import test from "node:test";
import assert from "node:assert/strict";
import { temAnalise } from "../temAnaliseJornada.js";

function mockDb(rows: unknown[]) {
  return {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => rows,
        }),
      }),
    }),
  };
}

test("temAnalise traco retorna false quando não há análise do Eu", async () => {
  const ok = await temAnalise(1, "traco", mockDb([]) as never);
  assert.equal(ok, false);
});

test("temAnalise traco retorna true quando existe análise do Eu", async () => {
  const ok = await temAnalise(1, "traco", mockDb([{ id: 99 }]) as never);
  assert.equal(ok, true);
});

test("temAnalise linguagens-amor retorna false sem linha do Eu", async () => {
  const ok = await temAnalise(2, "linguagens-amor", mockDb([]) as never);
  assert.equal(ok, false);
});

test("temAnalise slug desconhecido retorna false", async () => {
  const ok = await temAnalise(1, "inexistente", mockDb([{ id: 1 }]) as never);
  assert.equal(ok, false);
});
