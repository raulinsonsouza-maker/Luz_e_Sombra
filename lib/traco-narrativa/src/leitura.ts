import { comporLeitura, type LeituraPortal } from "@workspace/copy-voz";
import type { ResultadoAnalise } from "./types.js";
import * as T from "./tabelas.js";

function juntar(...partes: Array<string | null | undefined>): string {
  return partes
    .map((p) => (p ?? "").trim())
    .filter(Boolean)
    .join(" ");
}

/** A leitura longa do traço, encaixada na moldura. A pontuação não entra aqui. */
export function leituraDoTraco(resultado: {
  estruturaPrincipal: ResultadoAnalise["estruturaPrincipal"];
  fraseIdentidade?: string;
  interpretacao?: string;
  perfilUnico?: string;
  pontosFortes?: string[];
  dinamicaFuncional?: ResultadoAnalise["dinamicaFuncional"];
  estiloComunicacao?: ResultadoAnalise["estiloComunicacao"];
  ferida?: string;
  dorLivro?: string;
  pontosAtencao?: string[];
  recomendacoesPraticas?: string[];
  mensagemTerapeutica?: string;
  perguntaTransformacao?: string;
  recurso?: string;
}): LeituraPortal {
  const nome = T.NOMES[resultado.estruturaPrincipal];
  const dia = resultado.dinamicaFuncional;
  const estilo = resultado.estiloComunicacao;
  return comporLeitura({
    quemVoceE: juntar(
      nome ? `O traço que mais aparece em você é ${nome}.` : "",
      resultado.fraseIdentidade,
      resultado.interpretacao,
      resultado.perfilUnico,
      resultado.recurso,
      resultado.pontosFortes?.length ? `Talentos que já estão em você: ${resultado.pontosFortes.join(", ")}.` : "",
    ),
    noDiaADia: juntar(
      dia?.trabalho,
      dia?.relacoes,
      dia?.decisoes,
      dia?.energia,
      estilo?.descricao,
      estilo?.emRelacoes,
    ) || "Observe hoje um momento em que esse traço conduz sua reação antes de você escolher.",
    sombra: juntar(
      resultado.ferida,
      resultado.dorLivro,
      dia?.sombra,
      dia?.estresse,
      resultado.pontosAtencao?.length
        ? `Onde isso pede cuidado: ${resultado.pontosAtencao.join(", ")}.`
        : "",
    ) || "A sombra deste traço é a dor que ele aprendeu a carregar. Ela não define quem você é.",
    oQueFazer: juntar(
      resultado.mensagemTerapeutica,
      resultado.recomendacoesPraticas?.join(" "),
      resultado.perguntaTransformacao,
    ) || "Escolha um gesto pequeno hoje que use o talento deste traço, sem tentar virar outra pessoa.",
  });
}
