import test from "node:test";
import assert from "node:assert/strict";
import { scoreEstruturas } from "../scoreEstruturas.js";
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
    fotosComPoseCorpo: 2,
    ...partial,
  };
}

test("OMR alto favorece psicopata sobre rigido", () => {
  const a = scoreEstruturas({
    ag: ag({
      shrMedio: 1.55,
      wsrMedio: 1.2,
      ulrMedio: 1.35,
      simetriaMedia: 0.88,
      densidadeMedia: 0.25,
      definicaoMedia: 0.2,
      inclinacaoMedia: 0.02,
      projecaoPeitoMedia: 0.04,
    }),
    numFotos: 3,
  });
  assert.ok(a.estruturas.psicopata > a.estruturas.rigido);
});

test("silhueta inferior forte não favorece psicopata", () => {
  const b = scoreEstruturas({
    ag: ag({
      shrMedio: 0.82,
      ulrMedio: 0.72,
      simetriaMedia: 0.75,
      densidadeMedia: 0.35,
      definicaoMedia: 0.12,
    }),
    numFotos: 2,
  });
  assert.ok(b.estruturas.psicopata < 45);
});

test("corpo equilibrado com alta densidade não domina masoquista", () => {
  const r = scoreEstruturas({
    ag: ag({
      shrMedio: 0.95,
      wsrMedio: 0.92,
      ulrMedio: 1.0,
      simetriaMedia: 0.9,
      densidadeMedia: 0.32,
      definicaoMedia: 0.28,
    }),
    numFotos: 3,
  });
  assert.ok(r.estruturas.masoquista < 25, `masoquista=${r.estruturas.masoquista}`);
});

test("perfil oral + rigido (tipo Letícia) favorece oral ou rigido", () => {
  const r = scoreEstruturas({
    ag: ag({
      shrMedio: 0.95,
      ulrMedio: 1.02,
      simetriaMedia: 0.9,
      definicaoMedia: 0.28,
      densidadeMedia: 0.28,
      projecaoCranianaMedia: 0.1,
      ombrosAdiantadosMedio: 0.08,
      colapsoToracicoMedio: 0.55,
      inclinacaoMedia: -0.02,
    }),
    numFotos: 3,
  });
  const top = Object.entries(r.estruturas).sort((a, b) => b[1] - a[1])[0]![0];
  assert.ok(
    top === "oral" || top === "rigido",
    `esperado oral ou rigido no topo, obteve ${top}: ${JSON.stringify(r.estruturas)}`
  );
  assert.ok(r.estruturas.masoquista < 25, `masoquista=${r.estruturas.masoquista}`);
});

test("masoquista real exige OMR baixo e sinais combinados", () => {
  const r = scoreEstruturas({
    ag: ag({
      shrMedio: 0.8,
      ulrMedio: 0.78,
      simetriaMedia: 0.76,
      wsrMedio: 1.1,
      densidadeMedia: 0.3,
    }),
    numFotos: 2,
  });
  assert.ok(r.estruturas.masoquista >= 22);
});

test("corpo neutro sem sinais fortes: nenhuma estrutura acima de 38%", () => {
  const r = scoreEstruturas({
    ag: ag({
      shrMedio: 1.0,
      ulrMedio: 1.0,
      simetriaMedia: 0.85,
      densidadeMedia: 0.2,
      definicaoMedia: 0.18,
    }),
    numFotos: 2,
  });
  const max = Math.max(...Object.values(r.estruturas));
  assert.ok(max <= 38, `max=${max} ${JSON.stringify(r.estruturas)}`);
});
