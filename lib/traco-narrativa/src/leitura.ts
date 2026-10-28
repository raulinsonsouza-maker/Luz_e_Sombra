import { comporLeitura, type LeituraPortal } from "@workspace/copy-voz";
import type { ResultadoAnalise } from "./types.js";
import * as T from "./tabelas.js";

function pedacos(...partes: Array<string | null | undefined>): string[] {
  return partes.map((p) => (p ?? "").trim()).filter(Boolean);
}

/** A ferida da infância fica só em "A sombra". Aqui ela sai do começo da interpretação. */
function semFerida(texto: string | undefined, ferida?: string): string[] {
  const f = (ferida ?? "").trim();
  return (texto ?? "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      if (!f) return p;
      if (p === f) return "";
      if (p.startsWith(f)) return p.slice(f.length).trim();
      return p;
    })
    .filter(Boolean);
}

function ou(partes: string[], fallback: string): string | string[] {
  return partes.length ? partes : fallback;
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
    quemVoceE: pedacos(
      nome ? `O traço que mais aparece em você é ${nome}.` : "",
      resultado.fraseIdentidade,
      ...semFerida(resultado.interpretacao, resultado.ferida),
      resultado.perfilUnico,
      resultado.recurso,
    ),
    noDiaADia: ou(
      pedacos(dia?.trabalho, dia?.relacoes, dia?.decisoes, dia?.energia, estilo?.descricao, estilo?.emRelacoes),
      "Observe hoje um momento em que esse traço conduz sua reação antes de você escolher.",
    ),
    sombra: ou(
      pedacos(resultado.ferida, resultado.dorLivro, dia?.sombra, dia?.estresse),
      "A sombra deste traço é a dor que ele aprendeu a carregar. Ela não define quem você é.",
    ),
    oQueFazer: ou(
      pedacos(resultado.mensagemTerapeutica, ...(resultado.recomendacoesPraticas ?? []), resultado.perguntaTransformacao),
      "Escolha um gesto pequeno hoje que use o talento deste traço, sem tentar virar outra pessoa.",
    ),
  });
}
