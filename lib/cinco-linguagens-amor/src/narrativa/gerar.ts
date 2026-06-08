import { LABEL_LINGUAGEM } from "../perguntas/index.js";
import { textoDominante, textoParPrincipalSecundaria } from "../interpretacao.js";
import type {
  Desalinhamento,
  DimensaoPerfil,
  LinguagemAmor,
  MetricasQualidade,
  PerfilLinguagemDetalhe,
  ResultadoLinguagensAmorComputado,
} from "../types.js";
import { COMBINACAO_PAR, CONTEUDO_LINGUAGEM } from "./tabelas.js";

function chavePar(a: LinguagemAmor, b: LinguagemAmor): string {
  return `${a}+${b}`;
}

export function perfilDetalhe(linguagem: LinguagemAmor): PerfilLinguagemDetalhe {
  const c = CONTEUDO_LINGUAGEM[linguagem];
  return {
    linguagem,
    label: LABEL_LINGUAGEM[linguagem],
    essencia: c.essencia,
    comoSeSenteAmado: c.comoSeSenteAmado,
    comoExpressa: c.comoExpressa,
    dialetos: [...c.dialetos],
    oQueMagoa: c.oQueMagoa,
    acoesPraticas: [...c.acoesPraticas],
    dicaParaParceiro: c.dicaParaParceiro,
  };
}

function sinteseHumana(
  receber: DimensaoPerfil,
  expressar: DimensaoPerfil,
  metricas: MetricasQualidade,
): string {
  const lp = LABEL_LINGUAGEM[receber.principal].toLowerCase();
  const le = LABEL_LINGUAGEM[expressar.principal].toLowerCase();
  const pct = receber.ranking[0]?.pct ?? 0;

  if (metricas.perfilEquilibradoReceber) {
    const ls = LABEL_LINGUAGEM[receber.secundaria].toLowerCase();
    return `Seu coração responde com força a ${lp} e a ${ls}: você é bilíngue no amor e se nutre melhor quando as duas linguagens aparecem na relação.`;
  }
  if (receber.principal === expressar.principal) {
    if (pct >= 40) {
      return `Sua primeira linguagem para receber e expressar é ${lp}. Quando esse tanque emocional está cheio, você se sente seguro(a), visto(a) e pronto(a) para dar o melhor de si.`;
    }
    return `Você recebe e demonstra amor principalmente em ${lp}, com ${LABEL_LINGUAGEM[receber.secundaria].toLowerCase()} como complemento importante.`;
  }
  return `Você se sente mais amado(a) em ${lp}, mas costuma demonstrar amor em ${le}. Esse descompasso é comum — e entendê-lo já melhora seus relacionamentos.`;
}

function textoTanque(receber: DimensaoPerfil, metricas: MetricasQualidade): string {
  const pct = receber.ranking[0]?.pct ?? 0;
  const label = LABEL_LINGUAGEM[receber.principal].toLowerCase();
  if (pct >= 40) {
    return `Seu tanque emocional enche principalmente com ${label}. Quando isso falta por muito tempo, você sente distância mesmo com boas intenções ao redor.`;
  }
  if (metricas.perfilEquilibradoReceber) {
    return "Seu tanque é alimentado por mais de uma linguagem com força parecida. Pequenos gestos em duas frentes costumam fazer grande diferença.";
  }
  return `Seu tanque responde bem a ${label}, mas também a ${LABEL_LINGUAGEM[receber.secundaria].toLowerCase()}. Varie os gestos para manter o vínculo aquecido.`;
}

function textoDesalinhamento(receber: DimensaoPerfil, expressar: DimensaoPerfil): Desalinhamento {
  if (receber.principal === expressar.principal) {
    return { ativo: false, texto: "" };
  }
  const lr = LABEL_LINGUAGEM[receber.principal].toLowerCase();
  const le = LABEL_LINGUAGEM[expressar.principal].toLowerCase();
  return {
    ativo: true,
    texto: `Você precisa receber principalmente ${lr}, mas demonstra amor naturalmente em ${le}. Quem te ama pode estar falando a língua errada — não por falta de carinho, mas por desconhecer seu mapa emocional. Compartilhe este resultado e peça o mesmo gesto que você costuma oferecer.`,
  };
}

function textoCombinacao(principal: LinguagemAmor, secundaria: LinguagemAmor): string {
  if (principal === secundaria) {
    return "Seu perfil concentra-se numa linguagem dominante. Invista nela com intenção e peça explicitamente o que enche seu tanque emocional.";
  }
  const direto = COMBINACAO_PAR[chavePar(principal, secundaria)];
  const inverso = COMBINACAO_PAR[chavePar(secundaria, principal)];
  if (direto) return direto;
  if (inverso) return inverso;
  return `Você combina ${LABEL_LINGUAGEM[principal].toLowerCase()} com ${LABEL_LINGUAGEM[secundaria].toLowerCase()}. Relações duradouras costumam alimentar as duas pontuações mais altas, não só a primeira.`;
}

function evitarNoRelacionamento(principal: LinguagemAmor, secundaria: LinguagemAmor): string[] {
  const itens = [CONTEUDO_LINGUAGEM[principal].oQueMagoa];
  if (secundaria !== principal) {
    const sec = CONTEUDO_LINGUAGEM[secundaria].oQueMagoa;
    if (!itens[0].includes(sec.slice(0, 40))) itens.push(sec);
  }
  return itens;
}

function recomendacoesSemana(
  receber: DimensaoPerfil,
  expressar: DimensaoPerfil,
  metricas: MetricasQualidade,
): string[] {
  const out: string[] = [];
  const peso = receber.ranking.slice(0, 3);
  for (const item of peso) {
    const acao = CONTEUDO_LINGUAGEM[item.linguagem].acoesPraticas[0];
    if (acao && !out.includes(acao)) out.push(acao);
    if (out.length >= 2) break;
  }
  if (receber.principal !== expressar.principal) {
    out.push(
      `Converse com quem te ama: você precisa de ${LABEL_LINGUAGEM[receber.principal].toLowerCase()}, mas costuma oferecer ${LABEL_LINGUAGEM[expressar.principal].toLowerCase()}. Peça o que você precisa receber.`,
    );
  }
  if (metricas.confianca < 70) {
    out.push(
      "Se algumas respostas foram rápidas demais, considere refazer com mais calma — o resultado fica mais fiel ao seu dia a dia.",
    );
  }
  out.push(
    "Três vezes por semana, pergunte em casa: «De zero a dez, como está seu tanque de amor?» e faça um gesto concreto na linguagem certa.",
  );
  return out.slice(0, 4);
}

function paraQuemTeAma(principal: LinguagemAmor, secundaria: LinguagemAmor): string {
  const p = CONTEUDO_LINGUAGEM[principal].dicaParaParceiro;
  if (secundaria === principal) return p;
  const s = CONTEUDO_LINGUAGEM[secundaria].dicaParaParceiro;
  return `${p} Você também valoriza ${LABEL_LINGUAGEM[secundaria].toLowerCase()}: ${s.charAt(0).toLowerCase()}${s.slice(1)}`;
}

const REFLEXAO_AMOR =
  "Amor duradouro não é só paixão: é escolha diária de falar a linguagem do outro, mesmo quando não é a sua natural. Quando o tanque de quem você ama enche, o relacionamento ganha espaço para resolver o resto.";

export function montarNarrativaV2(input: {
  receber: DimensaoPerfil;
  expressar: DimensaoPerfil;
  metricas: MetricasQualidade;
}): ResultadoLinguagensAmorComputado {
  const { receber, expressar, metricas } = input;
  const desalinhamento = textoDesalinhamento(receber, expressar);

  return {
    versao: "linguagens_amor_v2",
    receber,
    expressar,
    desalinhamento,
    metricas,
    sinteseHumana: sinteseHumana(receber, expressar, metricas),
    tanqueEmocional: textoTanque(receber, metricas),
    perfilPrincipal: perfilDetalhe(receber.principal),
    perfilSecundario: perfilDetalhe(receber.secundaria),
    perfilExpressar: perfilDetalhe(expressar.principal),
    combinacao: textoCombinacao(receber.principal, receber.secundaria),
    paraQuemTeAma: paraQuemTeAma(receber.principal, receber.secundaria),
    evitar: evitarNoRelacionamento(receber.principal, receber.secundaria),
    recomendacoes: recomendacoesSemana(receber, expressar, metricas),
    reflexaoAmor: REFLEXAO_AMOR,
    perfilEquilibrado: metricas.perfilEquilibradoReceber,
    principal: receber.principal,
    secundaria: receber.secundaria,
    pontuacoes: receber.pontuacoes,
    ranking: receber.ranking,
    interpretacaoPrincipal: textoDominante(receber.principal),
    interpretacaoPar: textoParPrincipalSecundaria(receber.principal, receber.secundaria),
  };
}

/** Alias para retrocompatibilidade com imports v1. */
export const montarNarrativa = montarNarrativaV2;
