import { LABEL_LINGUAGEM } from "../perguntas/index.js";
import type {
  DimensaoPerfil,
  LinguagemAmor,
  MetricasQualidade,
  NarrativaV3,
} from "../types.js";
import {
  CONTEUDO_V3,
  DEFINICAO_LINGUAGEM,
  ESPELHO_EXPRESSAR,
  PONTE_COMUNICACAO,
  dinamicaPar,
} from "./conteudo-v3.js";
import { normalizarObjetoTextos } from "@workspace/copy-voz";

function abertura(
  principal: LinguagemAmor,
  secundaria: LinguagemAmor,
  intensidade: MetricasQualidade["intensidade"],
): string {
  const lp = LABEL_LINGUAGEM[principal];
  if (intensidade === "equilibrada" && principal !== secundaria) {
    const ls = LABEL_LINGUAGEM[secundaria];
    return `Suas respostas mostram que você responde com força tanto a ${lp.toLowerCase()} quanto a ${ls.toLowerCase()}. Não é preciso escolher uma como a única certa. Preferências podem mudar ao longo da vida, e conhecer essas diferenças favorece o diálogo e a compreensão mútua.`;
  }
  return `A maneira que mais aparece nas suas respostas para receber afeto é ${lp.toLowerCase()}. Isso não é uma regra fixa sobre seus relacionamentos. É um mapa para compreender melhor o que te alcança e como conversar sobre isso.`;
}

function confiancaNarrativa(metricas: MetricasQualidade, receber: DimensaoPerfil): string {
  if (metricas.confiancaLabel === "alta" && metricas.intensidade === "forte") {
    return "Há uma diferença clara entre a primeira e a segunda preferência. Use este mapa como ponto de partida para diálogo e gestos concretos, não como regra fixa sobre seus relacionamentos.";
  }
  if (metricas.desempateUsado) {
    return "Refinamos o perfil com perguntas extras porque as duas primeiras preferências estavam próximas. O resultado reflete melhor suas escolhas atuais. Preferências podem mudar ao longo da vida.";
  }
  if (metricas.perfilEquilibradoReceber) {
    return "Seu perfil traz duas maneiras de receber afeto com intensidades parecidas. Isso é riqueza, não indecisão. Você pode pedir as duas na relação.";
  }
  if (metricas.confiancaLabel === "baixa") {
    return "Algumas respostas ficaram difusas ou muito rápidas. Se quiser mais clareza, pode refazer com mais calma. Mesmo assim, o que você lê aqui já ajuda a conversar sobre afeto.";
  }
  return `Suas respostas apontam principalmente para ${LABEL_LINGUAGEM[receber.principal].toLowerCase()}, com ${LABEL_LINGUAGEM[receber.secundaria].toLowerCase()} também presente. Nenhuma linguagem é melhor do que a outra.`;
}

function textoDesalinhamento(receber: LinguagemAmor, expressar: LinguagemAmor): string {
  const lr = LABEL_LINGUAGEM[receber].toLowerCase();
  const le = LABEL_LINGUAGEM[expressar].toLowerCase();
  return `Você prefere receber afeto principalmente por meio de ${lr}, e costuma demonstrá-lo por meio de ${le}. Essas duas formas nem sempre são iguais. Isso não significa erro seu nem da outra pessoa. Reconhecer a diferença favorece o diálogo e a compreensão mútua.`;
}

export function montarBlocosNarrativa(input: {
  receber: DimensaoPerfil;
  expressar: DimensaoPerfil;
  metricas: MetricasQualidade;
  expressarCompleto: boolean;
}): NarrativaV3 & { desalinhamento: { ativo: boolean; texto: string } } {
  const { receber, expressar, metricas, expressarCompleto } = input;
  const p = receber.principal;
  const s = receber.secundaria;
  const anti = receber.anti;
  const cp = CONTEUDO_V3[p];
  const din = dinamicaPar(p, s);

  const veredito =
    p === s
      ? `A maneira principal como você gosta de receber amor é ${LABEL_LINGUAGEM[p]}.`
      : `A maneira principal como você gosta de receber amor é ${LABEL_LINGUAGEM[p]}. Também aparece com força ${LABEL_LINGUAGEM[s]}.`;

  const narrativa: NarrativaV3 = {
    veredito,
    abertura: abertura(p, s, metricas.intensidade),
    mecanismo: `${DEFINICAO_LINGUAGEM[p]} ${cp.mecanismoEmocional}`,
    cenas: cp.cenasCotidiano,
    feridaPadrao: `${cp.feridaPadrao} ${cp.sinalDeAlerta}`,
    sinalDeAlerta: cp.sinalDeAlerta,
    dinamicaPar:
      p === s
        ? "Seu perfil concentra-se em uma maneira principal de receber afeto. Nomear isso com clareza ajuda quem te ama a cuidar de você sem precisar adivinhar."
        : `${din.dinamicaRelacional} Diferença comum: ${din.tensaoComum} Um caminho possível: ${din.alavancaRelacional}`,
    cartaParceiro: cp.cartaParaParceiro,
    planoSeteDias: [...cp.planoSeteDias],
    linguagemAnti: `A maneira menos natural para você hoje é ${LABEL_LINGUAGEM[anti].toLowerCase()}. ${CONTEUDO_V3[anti].comoInterpretarAnti} Isso não a torna pior. Só mostra o que alcança menos neste momento.`,
    confiancaNarrativa: confiancaNarrativa(metricas, receber),
  };

  if (expressarCompleto && expressar.principal !== receber.principal) {
    narrativa.espelhoExpressar = `${ESPELHO_EXPRESSAR[expressar.principal]} ${textoDesalinhamento(receber.principal, expressar.principal)}`;
    narrativa.ponteComunicacao = PONTE_COMUNICACAO;
  } else if (expressarCompleto) {
    narrativa.espelhoExpressar = `${ESPELHO_EXPRESSAR[expressar.principal]} Neste momento, a forma como você demonstra e a forma como prefere receber caminham na mesma direção.`;
  }

  const desalinhamento = {
    ativo: expressarCompleto && receber.principal !== expressar.principal,
    texto:
      expressarCompleto && receber.principal !== expressar.principal
        ? textoDesalinhamento(receber.principal, expressar.principal)
        : "",
  };

  return normalizarObjetoTextos({ ...narrativa, desalinhamento }) as NarrativaV3 & {
    desalinhamento: { ativo: boolean; texto: string };
  };
}

export function montarNarrativaV3(input: Parameters<typeof montarBlocosNarrativa>[0]) {
  return montarBlocosNarrativa(input);
}
