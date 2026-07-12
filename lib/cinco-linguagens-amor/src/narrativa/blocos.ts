import { LABEL_LINGUAGEM } from "../perguntas/index.js";
import type {
  DimensaoPerfil,
  LinguagemAmor,
  MetricasQualidade,
  NarrativaV3,
} from "../types.js";
import {
  CONTEUDO_V3,
  ESPELHO_EXPRESSAR,
  PONTE_COMUNICACAO,
  TOM_VEREDITO,
  dinamicaPar,
} from "./conteudo-v3.js";
import { normalizarObjetoTextos } from "@workspace/copy-voz";

function abertura(principal: LinguagemAmor, secundaria: LinguagemAmor, intensidade: MetricasQualidade["intensidade"]): string {
  const lp = LABEL_LINGUAGEM[principal].toLowerCase();
  const c = CONTEUDO_V3[principal];
  if (intensidade === "equilibrada" && principal !== secundaria) {
    const ls = LABEL_LINGUAGEM[secundaria].toLowerCase();
    return `Seu coração responde com força tanto a ${lp} quanto a ${ls}. Você não precisa escolher entre elas — relações que duram costumam nutrir as duas, não só a primeira da lista. ${c.mecanismoEmocional.split(".")[0]}.`;
  }
  return `Para você, amor se mede principalmente em ${lp}. ${c.mecanismoEmocional}`;
}

function confiancaNarrativa(metricas: MetricasQualidade, receber: DimensaoPerfil): string {
  if (metricas.confiancaLabel === "alta" && metricas.intensidade === "forte") {
    return "Seu perfil tem distância clara entre primeira e segunda linguagem. Isso indica um resultado sólido — use-o como ponto de partida para conversas e gestos concretos.";
  }
  if (metricas.desempateUsado) {
    return "Refinamos seu perfil com perguntas extras porque as duas primeiras linguagens estavam muito próximas. O resultado agora reflete melhor suas escolhas.";
  }
  if (metricas.perfilEquilibradoReceber) {
    return "Seu perfil é genuinamente bilíngue: duas linguagens competem com força parecida. Isso não é indecisão — é riqueza. Peça as duas na relação.";
  }
  if (metricas.confiancaLabel === "baixa") {
    return "Algumas respostas indicam perfil difuso ou muito rápido. Considere refazer com mais calma se quiser mais precisão — mas o que você leu aqui já é um bom mapa para começar.";
  }
  return `Seu perfil aponta com boa confiança para ${LABEL_LINGUAGEM[receber.principal].toLowerCase()}, com ${LABEL_LINGUAGEM[receber.secundaria].toLowerCase()} como complemento relevante.`;
}

function textoDesalinhamento(receber: LinguagemAmor, expressar: LinguagemAmor): string {
  const lr = LABEL_LINGUAGEM[receber].toLowerCase();
  const le = LABEL_LINGUAGEM[expressar].toLowerCase();
  return `Você precisa receber principalmente ${lr}, mas demonstra amor naturalmente em ${le}. Quem te ama pode estar falando a língua errada sem querer — não por falta de carinho, mas por desconhecer seu mapa. Compartilhe a carta abaixo e peça o gesto que enche você.`;
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
      ? `Sua linguagem principal é ${LABEL_LINGUAGEM[p]}.`
      : `Sua linguagem principal é ${LABEL_LINGUAGEM[p]}, com ${LABEL_LINGUAGEM[s]} como segunda força.`;

  const narrativa: NarrativaV3 = {
    veredito,
    abertura: abertura(p, s, metricas.intensidade),
    mecanismo: cp.mecanismoEmocional,
    cenas: cp.cenasCotidiano,
    feridaPadrao: `${cp.feridaPadrao} ${cp.sinalDeAlerta}`,
    sinalDeAlerta: cp.sinalDeAlerta,
    dinamicaPar:
      p === s
        ? "Seu perfil concentra-se numa linguagem dominante. Invista nela com intenção e peça explicitamente o que enche seu coração."
        : `${din.dinamicaRelacional} Tensão comum: ${din.tensaoComum} Alavanca: ${din.alavancaRelacional}`,
    cartaParceiro: cp.cartaParaParceiro,
    planoSeteDias: [...cp.planoSeteDias],
    linguagemAnti: `Sua linguagem menos natural hoje é ${LABEL_LINGUAGEM[anti].toLowerCase()}. ${CONTEUDO_V3[anti].comoInterpretarAnti}`,
    confiancaNarrativa: confiancaNarrativa(metricas, receber),
  };

  if (expressarCompleto && expressar.principal !== receber.principal) {
    narrativa.espelhoExpressar = `${ESPELHO_EXPRESSAR[expressar.principal]} ${textoDesalinhamento(receber.principal, expressar.principal)}`;
    narrativa.ponteComunicacao = PONTE_COMUNICACAO;
  } else if (expressarCompleto) {
    narrativa.espelhoExpressar = ESPELHO_EXPRESSAR[expressar.principal];
  }

  const desalinhamento = {
    ativo: expressarCompleto && receber.principal !== expressar.principal,
    texto: expressarCompleto && receber.principal !== expressar.principal
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
