import test from "node:test";
import assert from "node:assert/strict";
import { calcularEixosReich } from "../eixosReich.js";
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
    simetriaFacialMedia: null,
    tensaoMandibulaMedia: null,
    rigidezCervicalMedia: null,
    fotosComPoseCorpo: 2,
    ...partial,
  };
}

test("expansão alta favorece psicopata", () => {
  const markers = ag({
    shrMedio: 1.45,
    ulrMedio: 1.35,
    inclinacaoMedia: 0.08,
    projecaoPeitoMedia: 0.05,
    simetriaMedia: 0.82,
    definicaoMedia: 0.2,
  });
  const a = scoreEstruturas({ ag: markers, numFotos: 3 });
  assert.ok(a.estruturas.psicopata >= a.estruturas.rigido);
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

test("corpo equilibrado com alta densidade não domina masoquista por OMR", () => {
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
  assert.ok(r.estruturas.masoquista < 30, `masoquista=${r.estruturas.masoquista}`);
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
});

test("contenção organizada (Letícia clínica) favorece Rígido no topo", () => {
  const markers = ag({
    shrMedio: 0.95,
    ulrMedio: 1.02,
    simetriaMedia: 0.9,
    definicaoMedia: 0.28,
    densidadeMedia: 0.28,
    ombrosAdiantadosMedio: 0.08,
    colapsoToracicoMedio: 0.48,
    wsrMedio: 1.06,
    inclinacaoMedia: 0.01,
    projecaoPeitoMedia: 0.01,
  });
  const eixos = calcularEixosReich(markers);
  assert.ok(eixos.indiceContencao > 0.45, `contencao=${eixos.indiceContencao}`);

  const r = scoreEstruturas({ ag: markers, numFotos: 3 });
  const top = Object.entries(r.estruturas).sort((a, b) => b[1] - a[1])[0]![0];
  assert.ok(
    top === "rigido" || top === "masoquista",
    `esperado rigido/masoquista, obteve ${top}: ${JSON.stringify(r.estruturas)}`
  );
  assert.ok(r.estruturas.oral < 35, `oral alto demais: ${r.estruturas.oral}`);
  assert.ok(r.estruturas.psicopata <= 20, `psicopata=${r.estruturas.psicopata}`);
});

test("masoquista por compressão sem OMR baixo", () => {
  const r = scoreEstruturas({
    ag: ag({
      shrMedio: 0.95,
      wsrMedio: 1.08,
      ombrosAdiantadosMedio: 0.07,
      simetriaMedia: 0.88,
      definicaoMedia: 0.24,
      colapsoToracicoMedio: 0.4,
    }),
    numFotos: 2,
  });
  assert.ok(r.estruturas.masoquista >= 18, `masoquista=${r.estruturas.masoquista}`);
});

test("masoquista clássico com OMR baixo", () => {
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

/** Marcadores proxy extraídos de auditoria Letícia (reanálise jun/2026). */
test("golden Letícia real — contenção + compressão dorsal", () => {
  const r = scoreEstruturas({
    ag: ag({
      shrMedio: 0.96,
      wsrMedio: 1.07,
      ulrMedio: 1.01,
      simetriaMedia: 0.91,
      definicaoMedia: 0.29,
      densidadeMedia: 0.27,
      projecaoCranianaMedia: 0.09,
      ombrosAdiantadosMedio: 0.075,
      colapsoToracicoMedio: 0.5,
      inclinacaoMedia: 0.0,
      projecaoPeitoMedia: 0.015,
    }),
    numFotos: 3,
  });
  assert.ok(r.estruturas.rigido >= 25, `rigido=${r.estruturas.rigido}`);
  assert.ok(r.estruturas.masoquista >= 15, `masoquista=${r.estruturas.masoquista}`);
  assert.ok(r.estruturas.oral <= 30, `oral=${r.estruturas.oral}`);
  assert.ok(r.estruturas.psicopata <= 18, `psicopata=${r.estruturas.psicopata}`);
});
