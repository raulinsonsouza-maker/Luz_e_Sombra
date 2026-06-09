import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  normalizarObjetoTextos,
  normalizarTextoUsuario,
  removerTravessoes,
} from "./normalizar.js";

describe("copy-voz", () => {
  it("remove travessões com vírgula antes de mas", () => {
    const r = removerTravessoes("não por birra — mas porque sua natureza é construir");
    assert.ok(!r.includes("—"));
    assert.match(r, /birra, mas/);
  });

  it("remove travessões com ponto antes de frase nova", () => {
    const r = removerTravessoes("Você lidera — Isso é raro.");
    assert.ok(!r.includes("—"));
    assert.match(r, /lidera\.\s+Isso/);
  });

  it("converte guillemets e PT-PT", () => {
    const r = normalizarTextoUsuario(
      "Como pensas — «O que eu perco?» quando ninguém está a olhar",
    );
    assert.ok(!r.includes("—"));
    assert.ok(!r.includes("«"));
    assert.match(r, /Como você pensa/);
    assert.match(r, /está olhando/);
  });

  it("normalizarObjetoTextos percorre aninhados", () => {
    const o = normalizarObjetoTextos({
      a: "texto — continua",
      b: [{ c: "breakthrough aqui" }],
    });
    assert.ok(!JSON.stringify(o).includes("—"));
    assert.match((o as { b: { c: string }[] }).b[0]!.c, /virada/i);
  });
});
