import { useMemo } from "react";
import { adaptarVozNarrativa, gerarNarrativa } from "@workspace/traco-narrativa";
import type { ResultadoImagemEngine } from "@workspace/traco-imagem-engine";
import MobileTopBar from "@/components/MobileTopBar";
import { TracoPainelResultado } from "@/pages/traco/components/TracoPainelResultado";

/** Perfil usado nos testes da Letícia: Rígido 31% + Oral 24%. Só existe no dev local. */
function resultadoLeticia() {
  const estruturas: ResultadoImagemEngine["estruturas"] = {
    rigido: 31,
    oral: 24,
    masoquista: 20,
    psicopata: 14,
    esquizoide: 11,
  };
  const eixos = {
    indiceExpansao: 0.35,
    indiceRetracao: 0.43,
    indiceContencao: 0.43,
    indiceCompressao: 0.28,
    indiceFragmentacao: 0.2,
  };
  const engine: ResultadoImagemEngine = {
    estruturas,
    estruturaPrincipal: "rigido",
    estruturaSecundaria: "oral",
    evidencias: [],
    marcadoresPorFoto: [],
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
      eixosReich: eixos,
    },
    confiancaAnalise: 70,
    metadata: {
      analysisVersion: "preview-local",
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
      eixosReich: eixos,
    },
  };

  const gerado = gerarNarrativa({
    engine,
    fusao: {
      versaoMatriz: "fusao_v2",
      alinhamentoFotosFormulario: 96,
      assertividadeLeitura: 80,
      pesoFormulario: 0.25,
      padroesEmocionaisNormalizados: { vinculo: 0.42, controle: 0.38 },
      vetorFormularioEstruturas: {},
      sinaisConvergentes: [],
      sinteseIntegrada: "",
    },
  });

  return adaptarVozNarrativa(gerado, "Leticia");
}

export default function TracoPreviewPage() {
  const resultado = useMemo(() => resultadoLeticia(), []);

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #1e1812 0%, #2a1f14 50%, #2f251b 100%)" }}
    >
      <MobileTopBar />
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <p className="text-xs mb-6" style={{ color: "rgba(200,165,107,0.65)" }}>
          Prévia local · Rígido 31% e Oral 24% · não é a conta de produção
        </p>
        <TracoPainelResultado
          analise={{ id: 0, resultado, criadoEm: new Date().toISOString() }}
          onReanalisar={() => undefined}
          analisando={false}
          fotosCount={3}
          pessoaNome="Leticia"
        />
      </div>
    </div>
  );
}
