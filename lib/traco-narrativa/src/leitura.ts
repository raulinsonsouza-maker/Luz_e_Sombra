import { comporLeitura, type LeituraPortal, type PecaLeitura } from "@workspace/copy-voz";
import type { ResultadoAnalise } from "./types.js";
import * as T from "./tabelas.js";

function item(rotulo: string, texto?: string | null): PecaLeitura | null {
  const t = (texto ?? "").trim();
  return t ? { rotulo, texto: t } : null;
}

function lista(partes: Array<PecaLeitura | null | undefined>): PecaLeitura[] {
  return partes.filter((parte): parte is PecaLeitura => {
    if (parte == null) return false;
    if (typeof parte === "string") return parte.trim().length > 0;
    return parte.texto.trim().length > 0;
  });
}

function ou(partes: PecaLeitura[], fallback: string): PecaLeitura | PecaLeitura[] {
  return partes.length ? partes : fallback;
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

function rotuloInterpretacao(texto: string, indice: number): string {
  if (/tensão viva/i.test(texto)) return "A tensão entre os traços";
  if (/intensidade próxima/i.test(texto)) return "Os dois no mesmo grau";
  if (/Não foi possível validar/i.test(texto)) return "Sobre as fotos";
  return indice === 0 ? "Como isso se formou" : "O que isso mostra";
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
  const leitura = semFerida(resultado.interpretacao, resultado.ferida).map((texto, indice) => ({
    rotulo: rotuloInterpretacao(texto, indice),
    texto,
  }));
  return comporLeitura({
    quemVoceE: lista([
      nome ? `O traço que mais aparece em você é ${nome}.` : "",
      item("Em uma frase", resultado.fraseIdentidade),
      ...leitura,
      item("Os dois traços juntos", resultado.perfilUnico),
      item("O que já é seu", resultado.recurso),
    ]),
    noDiaADia: ou(
      lista([
        item("No trabalho", dia?.trabalho),
        item("Nas relações", dia?.relacoes),
        item("Nas decisões", dia?.decisoes),
        item("Sua energia", dia?.energia),
        item("Como você se comunica", estilo?.descricao),
        item("Com as pessoas", estilo?.emRelacoes),
      ]),
      "Observe hoje um momento em que esse traço conduz sua reação antes de você escolher.",
    ),
    sombra: ou(
      lista([
        item("A ferida", resultado.ferida),
        item("O que ainda dói", resultado.dorLivro),
        item("No automático", dia?.sombra),
        item("Quando a pressão sobe", dia?.estresse),
      ]),
      "A sombra deste traço é a dor que ele aprendeu a carregar. Ela não define quem você é.",
    ),
    oQueFazer: ou(
      lista([
        item("Por onde começar", resultado.mensagemTerapeutica),
        ...(resultado.recomendacoesPraticas ?? []),
        resultado.perguntaTransformacao,
      ]),
      "Escolha um gesto pequeno hoje que use o talento deste traço, sem tentar virar outra pessoa.",
    ),
  });
}
