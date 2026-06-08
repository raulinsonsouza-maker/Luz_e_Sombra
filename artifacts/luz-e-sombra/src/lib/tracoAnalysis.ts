/**
 * Traço de Caráter — camada fina: motor de imagem + narrativa + fusão opcional.
 */

import type { TipoFoto } from "@workspace/traco-imagem-engine";
import type { ResultadoAnalise } from "@workspace/traco-narrativa";
import { analisarFotos } from "@workspace/traco-imagem-engine";
import { adaptarVozNarrativa, gerarNarrativa } from "@workspace/traco-narrativa";
import {
  aplicarFusaoTracoDiagnostico,
  diagnosticoEmocionalFusaoSchema,
} from "@workspace/traco-diagnostico-fusion";

export type { TipoFoto } from "@workspace/traco-imagem-engine";
export type {
  ResultadoAnalise,
  EstiloComunicacao,
  DinamicaFuncional,
} from "@workspace/traco-narrativa";

export { gerarNarrativa } from "@workspace/traco-narrativa";

export interface AnalyzeTracoOptions {
  token?: string;
  diagnosticoEmocional?: Record<string, unknown>;
  pessoaId?: number | null;
  pessoaNome?: string | null;
}

export async function analyzeTracoDeCarater(
  photos: Array<{ tipo: TipoFoto; source: File | string }>,
  options?: AnalyzeTracoOptions | string
): Promise<ResultadoAnalise> {
  const opts: AnalyzeTracoOptions =
    typeof options === "string" ? { token: options } : (options ?? {});

  if (photos.length === 0) throw new Error("Nenhuma foto fornecida para análise.");

  const engine = await analisarFotos(photos, opts.token);
  const estruturasSomenteFotos = { ...engine.estruturas };

  let engineForNarrativa = engine;
  let fusaoMetadata: ReturnType<typeof aplicarFusaoTracoDiagnostico>["metadata"] | undefined;

  if (opts.diagnosticoEmocional) {
    const parsed = diagnosticoEmocionalFusaoSchema.safeParse(opts.diagnosticoEmocional);
    if (parsed.success) {
      const variancia = engine.metadata.featureSummary?.varianciaEntreFotos ?? 0;
      const fusao = aplicarFusaoTracoDiagnostico(
        estruturasSomenteFotos,
        parsed.data,
        engine.confiancaAnalise,
        {
          varianciaEntreFotos: variancia,
          indiceContencaoFotos: engine.marcadoresAgregados.eixosReich?.indiceContencao,
        }
      );
      fusaoMetadata = fusao.metadata;
      engineForNarrativa = {
        ...engine,
        estruturas: fusao.estruturasFusionadas,
        estruturaPrincipal: fusao.estruturaPrincipal,
        estruturaSecundaria: fusao.estruturaSecundaria,
        confiancaAnalise: fusao.confiancaAnaliseAjustada,
      };
    }
  }

  let resultado = gerarNarrativa({
    engine: engineForNarrativa,
    fusao: fusaoMetadata,
    estruturasSomenteFotos,
  });

  if (opts.pessoaNome?.trim()) {
    resultado = adaptarVozNarrativa(resultado, opts.pessoaNome.trim());
  }

  return {
    ...resultado,
    estruturasSomenteFotos,
    ...(opts.pessoaId !== undefined ? { pessoaId: opts.pessoaId } : {}),
    ...(opts.pessoaNome ? { pessoaNome: opts.pessoaNome } : {}),
    ...(fusaoMetadata
      ? {
          sinteseIntegradaFotosQuestionario: fusaoMetadata.sinteseIntegrada,
          fusaoDiagnosticoEmocional: {
            versaoMatriz: fusaoMetadata.versaoMatriz,
            alinhamentoFotosFormulario: fusaoMetadata.alinhamentoFotosFormulario,
            assertividadeLeitura: fusaoMetadata.assertividadeLeitura,
            pesoFormulario: fusaoMetadata.pesoFormulario,
            padroesEmocionaisNormalizados: fusaoMetadata.padroesEmocionaisNormalizados,
            vetorFormularioEstruturas: fusaoMetadata.vetorFormularioEstruturas,
            sinaisConvergentes: fusaoMetadata.sinaisConvergentes,
            entradaDiagnostico: opts.diagnosticoEmocional,
          },
        }
      : {}),
  } as ResultadoAnalise;
}
