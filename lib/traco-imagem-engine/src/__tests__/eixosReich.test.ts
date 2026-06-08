import test from "node:test";
import assert from "node:assert/strict";
import { calcularEixosReich, calcularSegmentosReich } from "../eixosReich.js";
import type { MarcadoresAgregados } from "../types.js";

function ag(partial: Partial<MarcadoresAgregados>): MarcadoresAgregados {
  return {
    shrMedio: null,
    wsrMedio: null,
    ulrMedio: null,
    simetriaMedia: null,
    densidadeMedia: null,
    definicaoMedia: null,
    inclinacaoMedia: null,
    projecaoPeitoMedia: null,
    projecaoCranianaMedia: null,
    ombrosAdiantadosMedio: null,
    colapsoToracicoMedio: null,
    simetriaFacialMedia: null,
    tensaoMandibulaMedia: null,
    rigidezCervicalMedia: null,
    fotosComPoseCorpo: 2,
    ...partial,
  };
}

test("calcularSegmentosReich retorna 7 segmentos 0-1", () => {
  const markers = ag({
    shrMedio: 0.95,
    simetriaMedia: 0.9,
    definicaoMedia: 0.28,
    ombrosAdiantadosMedio: 0.08,
    wsrMedio: 1.06,
    colapsoToracicoMedio: 0.5,
  });
  const eixos = calcularEixosReich(markers);
  const seg = calcularSegmentosReich(markers, eixos);
  for (const k of Object.keys(seg)) {
    const v = seg[k as keyof typeof seg];
    assert.ok(v >= 0 && v <= 1, `${k}=${v}`);
  }
  assert.equal(Object.keys(seg).length, 7);
});
