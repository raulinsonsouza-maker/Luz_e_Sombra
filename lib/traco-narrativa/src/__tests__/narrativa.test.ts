import test from "node:test";
import assert from "node:assert/strict";
import { gerarNarrativa } from "../gerarNarrativa.js";
import type { ResultadoImagemEngine } from "@workspace/traco-imagem-engine";

function mkEngine(estruturas: ResultadoImagemEngine["estruturas"]): ResultadoImagemEngine {
  const sorted = Object.entries(estruturas).sort((a, b) => b[1] - a[1]);
  const principal = sorted[0]![0] as ResultadoImagemEngine["estruturaPrincipal"];
  const secundaria = sorted[1]![0] as ResultadoImagemEngine["estruturaSecundaria"];
  return {
    estruturas,
    estruturaPrincipal: principal,
    estruturaSecundaria: secundaria,
    evidencias: [],
    marcadoresPorFoto: [],
    marcadoresAgregados: {
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
      fotosComPoseCorpo: 0,
    },
    confiancaAnalise: 55,
    metadata: {
      analysisVersion: "test",
      confidenceBreakdown: {
        imageQuality: 0.5,
        bodyDetection: 0,
        photoCoverage: 0.66,
        featureVariance: 0.5,
      },
      featureSummary: {
        mediaSimetria: 0,
        mediaDensidadeCorporal: 0,
        mediaRazaoOmbroQuadril: 0,
        mediaMassaSuperiorInferior: 0,
        varianciaEntreFotos: 0,
      },
    },
  };
}

test("mesmo dominante com percentagens diferentes altera interpretação", () => {
  const low = gerarNarrativa({
    engine: mkEngine({
      esquizoide: 38,
      oral: 22,
      psicopata: 15,
      masoquista: 15,
      rigido: 10,
    }),
  });
  const high = gerarNarrativa({
    engine: mkEngine({
      esquizoide: 72,
      oral: 10,
      psicopata: 8,
      masoquista: 6,
      rigido: 4,
    }),
  });
  assert.notEqual(low.interpretacao, high.interpretacao);
  assert.notEqual(low.pontosFortes.join("|"), high.pontosFortes.join("|"));
});
