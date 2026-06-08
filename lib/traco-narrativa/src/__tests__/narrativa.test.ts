import test from "node:test";
import assert from "node:assert/strict";
import { gerarNarrativa } from "../gerarNarrativa.js";
import type { ResultadoImagemEngine } from "@workspace/traco-imagem-engine";

function mkEngine(
  estruturas: ResultadoImagemEngine["estruturas"],
  overrides?: Partial<ResultadoImagemEngine>
): ResultadoImagemEngine {
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
      simetriaFacialMedia: null,
      tensaoMandibulaMedia: null,
      rigidezCervicalMedia: null,
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
    ...overrides,
  };
}

const EIXOS_LETICIA = {
  indiceExpansao: 0.35,
  indiceRetracao: 0.43,
  indiceContencao: 0.43,
  indiceCompressao: 0.28,
  indiceFragmentacao: 0.2,
};

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

test("Letícia rigido+oral — postural sem colapso oral dominante", () => {
  const r = gerarNarrativa({
    engine: mkEngine(
      {
        rigido: 31,
        oral: 24,
        masoquista: 20,
        psicopata: 14,
        esquizoide: 11,
      },
      {
        estruturaPrincipal: "rigido",
        estruturaSecundaria: "oral",
        marcadoresAgregados: {
          shrMedio: 0.96,
          wsrMedio: null,
          ulrMedio: 1.01,
          simetriaMedia: 0.91,
          densidadeMedia: 0.27,
          definicaoMedia: null,
          inclinacaoMedia: 0,
          projecaoPeitoMedia: null,
          projecaoCranianaMedia: 0.09,
          ombrosAdiantadosMedio: 0.075,
          colapsoToracicoMedio: 0.5,
          simetriaFacialMedia: null,
          tensaoMandibulaMedia: null,
          rigidezCervicalMedia: null,
          fotosComPoseCorpo: 2,
          eixosReich: EIXOS_LETICIA,
        },
        metadata: {
          analysisVersion: "test",
          confidenceBreakdown: {
            imageQuality: 0.7,
            bodyDetection: 0.8,
            photoCoverage: 1,
            featureVariance: 0.3,
          },
          featureSummary: {
            mediaSimetria: 0.91,
            mediaDensidadeCorporal: 0.27,
            mediaRazaoOmbroQuadril: 0.96,
            mediaMassaSuperiorInferior: 1.01,
            varianciaEntreFotos: 0.1,
          },
          eixosReich: EIXOS_LETICIA,
        },
      }
    ),
    fusao: {
      versaoMatriz: "fusao_v2",
      alinhamentoFotosFormulario: 96,
      assertividadeLeitura: 80,
      pesoFormulario: 0.25,
      padroesEmocionaisNormalizados: {},
      vetorFormularioEstruturas: {},
      sinaisConvergentes: [],
      sinteseIntegrada: "técnico",
    },
  });

  assert.ok(!r.padraoPostural.includes("colapso postural de cima para baixo"));
  assert.ok(!r.padraoPostural.includes("peito afunda"));
  assert.ok(r.padraoPostural.includes("ereta") || r.padraoPostural.includes("organização"));
  assert.ok(
    r.padraoPostural.includes("vínculo") || r.padraoPostural.includes("colapso postural dominante") === false
  );
});

test("Letícia rigido+oral — características sem tags conflitantes", () => {
  const r = gerarNarrativa({
    engine: mkEngine(
      {
        rigido: 31,
        oral: 24,
        masoquista: 20,
        psicopata: 14,
        esquizoide: 11,
      },
      {
        estruturaPrincipal: "rigido",
        estruturaSecundaria: "oral",
        marcadoresAgregados: {
          shrMedio: 0.96,
          wsrMedio: null,
          ulrMedio: 1.01,
          simetriaMedia: 0.91,
          densidadeMedia: 0.27,
          definicaoMedia: null,
          inclinacaoMedia: 0,
          projecaoPeitoMedia: null,
          projecaoCranianaMedia: null,
          ombrosAdiantadosMedio: null,
          colapsoToracicoMedio: null,
          simetriaFacialMedia: null,
          tensaoMandibulaMedia: null,
          rigidezCervicalMedia: null,
          fotosComPoseCorpo: 2,
          eixosReich: EIXOS_LETICIA,
        },
      }
    ),
  });

  const conflitos = ["Baixo tônus", "Postura curvada", "Peito colapsado", "Ombros caídos"];
  for (const tag of r.caracteristicasFisicasObservadas) {
    for (const c of conflitos) {
      assert.ok(!tag.includes(c), `tag conflitante: ${tag}`);
    }
  }
  assert.ok(r.caracteristicasFisicasObservadas.length <= 5);
});

test("observações por foto humanas sem métricas técnicas", () => {
  const r = gerarNarrativa({
    engine: mkEngine(
      { rigido: 40, oral: 25, masoquista: 15, psicopata: 10, esquizoide: 10 },
      {
        estruturaPrincipal: "rigido",
        estruturaSecundaria: "oral",
        marcadoresPorFoto: [
          {
            tipo: "rosto",
            poseDetectada: true,
            qualidadeFoto: 0.8,
            shr: null,
            wsr: null,
            ulr: null,
            simetria: 0.92,
            densidadeCorpo: null,
            definicaoCorpo: null,
            inclinacaoAnterior: null,
            projecaoPeito: null,
            projecaoCraniana: null,
            ombrosAdiantados: null,
            colapsoToracico: null,
          },
          {
            tipo: "corpo-frente",
            poseDetectada: true,
            qualidadeFoto: 0.75,
            shr: 0.96,
            wsr: null,
            ulr: 1.01,
            simetria: 0.91,
            densidadeCorpo: 0.27,
            definicaoCorpo: null,
            inclinacaoAnterior: null,
            projecaoPeito: null,
            projecaoCraniana: null,
            ombrosAdiantados: 0.07,
            colapsoToracico: 0.03,
          },
          {
            tipo: "corpo-lado",
            poseDetectada: true,
            qualidadeFoto: 0.7,
            shr: 1.85,
            wsr: null,
            ulr: null,
            simetria: 0.88,
            densidadeCorpo: null,
            definicaoCorpo: null,
            inclinacaoAnterior: 0,
            projecaoPeito: null,
            projecaoCraniana: 0.09,
            ombrosAdiantados: null,
            colapsoToracico: null,
          },
        ],
      }
    ),
  });

  const texto = Object.values(r.observacoesPorFoto).join(" ");
  assert.ok(!texto.includes("OMR"));
  assert.ok(!texto.includes("landmarks"));
  assert.ok(!texto.includes("% no mapa"));
  assert.ok(!texto.includes("~"));

  const tecnico = Object.values(r.observacoesPorFotoTecnico ?? {}).join(" ");
  assert.ok(tecnico.includes("0.96") || tecnico.includes("mapa"));
});

test("interpretação não repete síntese de fusão", () => {
  const r = gerarNarrativa({
    engine: mkEngine({
      rigido: 31,
      oral: 24,
      masoquista: 20,
      psicopata: 14,
      esquizoide: 11,
    }),
    fusao: {
      versaoMatriz: "fusao_v2",
      alinhamentoFotosFormulario: 96,
      assertividadeLeitura: 80,
      pesoFormulario: 0.25,
      padroesEmocionaisNormalizados: {},
      vetorFormularioEstruturas: {},
      sinaisConvergentes: ["sinal A", "sinal B"],
      sinteseIntegrada: "Leitura integrada técnica com 96%",
    },
  });

  assert.ok(!r.interpretacao.includes("Integração fotos + questionário"));
  assert.ok(!r.interpretacao.includes("Sinais convergentes"));
  assert.ok(r.sinteseHumana?.includes("fotos e seu questionário"));
  assert.ok(!r.sinteseHumana?.includes("%"));
});

test("perfil físico humano sem números", () => {
  const r = gerarNarrativa({
    engine: mkEngine(
      { rigido: 31, oral: 24, masoquista: 20, psicopata: 14, esquizoide: 11 },
      {
        estruturaPrincipal: "rigido",
        estruturaSecundaria: "oral",
        marcadoresAgregados: {
          shrMedio: 0.96,
          wsrMedio: null,
          ulrMedio: 1.01,
          simetriaMedia: 0.91,
          densidadeMedia: 0.27,
          definicaoMedia: null,
          inclinacaoMedia: 0,
          projecaoPeitoMedia: null,
          projecaoCranianaMedia: null,
          ombrosAdiantadosMedio: null,
          colapsoToracicoMedio: null,
          simetriaFacialMedia: null,
          tensaoMandibulaMedia: null,
          rigidezCervicalMedia: null,
          fotosComPoseCorpo: 2,
          eixosReich: EIXOS_LETICIA,
        },
      }
    ),
  });

  assert.ok(r.perfilFisicoNarrado.length > 20);
  assert.ok(!/\d+\.\d+/.test(r.perfilFisicoNarrado));
  assert.ok(!r.perfilFisicoNarrado.includes("OMR"));
  assert.ok(!r.perfilFisicoNarrado.includes("máscara"));
});
