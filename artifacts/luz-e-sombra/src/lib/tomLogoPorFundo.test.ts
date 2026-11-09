import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { tomLogoPorLuminancia } from "./tomLogoPorFundo.ts";

describe("tomLogoPorLuminancia", () => {
  it("usa logo claro em fundo escuro", () => {
    assert.equal(tomLogoPorLuminancia(40), "claro");
    assert.equal(tomLogoPorLuminancia(139), "claro");
  });

  it("usa logo ouro em fundo claro", () => {
    assert.equal(tomLogoPorLuminancia(140), "ouro");
    assert.equal(tomLogoPorLuminancia(210), "ouro");
  });
});
