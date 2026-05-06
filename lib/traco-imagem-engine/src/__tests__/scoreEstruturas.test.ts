import test from "node:test";
import assert from "node:assert/strict";
import { scoreEstruturas } from "../scoreEstruturas.js";

test("OMR alto favorece psicopata sobre rigido", () => {
  const a = scoreEstruturas({
    ag: {
      shrMedio: 1.55,
      wsrMedio: 1.2,
      ulrMedio: 1.35,
      simetriaMedia: 0.88,
      densidadeMedia: 0.25,
      definicaoMedia: 0.2,
      inclinacaoMedia: 0.02,
      projecaoPeitoMedia: 0.04,
      fotosComPoseCorpo: 2,
    },
    numFotos: 3,
  });
  assert.ok(a.estruturas.psicopata > a.estruturas.rigido);
});

test("silhueta inferior (OMR baixo) não favorece psicopata", () => {
  const b = scoreEstruturas({
    ag: {
      shrMedio: 0.82,
      wsrMedio: null,
      ulrMedio: 0.72,
      simetriaMedia: 0.75,
      densidadeMedia: 0.35,
      definicaoMedia: 0.12,
      inclinacaoMedia: null,
      projecaoPeitoMedia: null,
      fotosComPoseCorpo: 1,
    },
    numFotos: 2,
  });
  assert.ok(b.estruturas.psicopata < 45);
});
