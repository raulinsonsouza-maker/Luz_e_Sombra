import type {
  ResultadoImagemEngine,
  EstruturaTraco,
  EstruturasPct,
  EixosReich,
  MarcadoresAgregados,
  MarcadoresFoto,
  TipoFoto,
} from "@workspace/traco-imagem-engine";
import type { FusaoDiagnosticoEmocionalMetadata } from "@workspace/traco-diagnostico-fusion";
import { normalizarObjetoTextos } from "@workspace/copy-voz";
import type { DinamicaFuncional, EstiloComunicacao, ResultadoAnalise } from "./types.js";
import * as T from "./tabelas.js";
import { VERSAO_NARRATIVA } from "./constants.js";
import {
  montarContrasteFotosFormulario,
  montarCouracaCorporal,
  montarLeituraEmocionalDeclarada,
  montarPontosCuidadoPrioritarios,
} from "./cruzamentos.js";

function bandaPct(pct: number): string {
  if (pct < 24) return "discreta";
  if (pct < 42) return "moderada";
  return "marcada";
}

/** Gira qual parágrafo base aparece primeiro conforme a intensidade (%), para não repetir texto só pelo dominante. */
function indiceRotacao(principalPct: number): number {
  return Math.min(4, Math.floor(principalPct / 20));
}

function observacaoPorFotoHumana(m: MarcadoresFoto, principal: EstruturaTraco): string {
  const base =
    m.tipo === "rosto"
      ? T.OBS_ROSTO[principal]
      : m.tipo === "corpo-frente"
        ? T.OBS_FRENTE[principal]
        : T.OBS_LADO[principal];

  if (!m.poseDetectada || m.qualidadeFoto < 0.22) {
    return "Nesta foto a leitura foi limitada. Use as outras tomadas como complemento.";
  }
  return base;
}

function observacaoPorFoto(
  m: MarcadoresFoto,
  principal: EstruturaTraco,
  pctPrincipal: number
): string {
  const base =
    m.tipo === "rosto"
      ? T.OBS_ROSTO[principal]
      : m.tipo === "corpo-frente"
        ? T.OBS_FRENTE[principal]
        : T.OBS_LADO[principal];

  if (!m.poseDetectada || m.qualidadeFoto < 0.22) {
    return `${base} Nesta tomada a leitura biométrica foi limitada (qualidade estimada ${Math.round(m.qualidadeFoto * 100)}%); interprete como pista somente, junto às outras fotos. Intensidade ${bandaPct(pctPrincipal)} da estrutura ${T.NOMES[principal]} (${pctPrincipal}%).`;
  }

  const partes: string[] = [];
  if (m.shr != null) {
    if (m.shr > 1.35)
      partes.push(
        `Razão ombro–quadril elevada (~${m.shr.toFixed(2)}), silhueta com ênfase superior.`
      );
    else if (m.shr < 0.88)
      partes.push(
        `Razão ombro–quadril mais baixa (~${m.shr.toFixed(2)}), mais volume na base do tronco.`
      );
    else partes.push(`Razão ombro–quadril ~${m.shr.toFixed(2)}.`);
  }
  if (m.simetria != null && m.simetria < 0.78) {
    partes.push(`Assimetria bilateral perceptível nos landmarks (equilíbrio ~${Math.round(m.simetria * 100)}%).`);
  }
  if (m.ulr != null) {
    if (m.ulr > 1.2) partes.push(`Predomínio visual da metade superior do corpo (razão vertical ~${m.ulr.toFixed(2)}).`);
    else if (m.ulr < 0.85) partes.push(`Predomínio visual da metade inferior (~${m.ulr.toFixed(2)}).`);
  }
  if (m.inclinacaoAnterior != null && Math.abs(m.inclinacaoAnterior) > 0.018) {
    partes.push(
      m.inclinacaoAnterior > 0
        ? "No perfil, leve avanço anterior do tronco."
        : "No perfil, leve recuo ou empilhamento anterior."
    );
  }
  if (m.projecaoCraniana != null && m.projecaoCraniana > 0.05) {
    partes.push(`Projeção craniana perceptível no perfil (~${m.projecaoCraniana.toFixed(2)}).`);
  }
  if (m.ombrosAdiantados != null && m.ombrosAdiantados > 0.05) {
    partes.push(`Ombros adiantados em relação à pelve (~${m.ombrosAdiantados.toFixed(2)}).`);
  }
  if (m.colapsoToracico != null && m.colapsoToracico > 0.45) {
    partes.push(`Sinais de colapso torácico superior (~${m.colapsoToracico.toFixed(2)}).`);
  }
  if (m.erroProcessamento) {
    partes.push(`Atenção: ${m.erroProcessamento}`);
  }

  const tecnico = partes.length ? ` ${partes.join(" ")}` : "";
  return `${base}${tecnico} Leitura com intensidade ${bandaPct(pctPrincipal)} para ${T.NOMES[principal]} (${pctPrincipal}% no mapa atual).`;
}

function montarObservacoesPorFoto(
  fotos: MarcadoresFoto[],
  principal: EstruturaTraco,
  pctPrincipal: number,
  humano: boolean
): Partial<Record<TipoFoto, string>> {
  const out: Partial<Record<TipoFoto, string>> = {};
  for (const m of fotos) {
    out[m.tipo] = humano
      ? observacaoPorFotoHumana(m, principal)
      : observacaoPorFoto(m, principal, pctPrincipal);
  }
  return out;
}

const TAGS_ORAIS_CONFLITAM_RIGIDO = [
  "Baixo tônus",
  "Postura curvada",
  "Peito colapsado",
  "Pouco enraizamento",
  "Ombros caídos",
  "baixo nível de carga energética",
];

const TAGS_RIGIDOS_CONFLITAM_ORAL = [
  "Simetria corporal marcante",
  "Tônus muscular bem distribuído",
  "Postura ereta",
  "Alinhamento preciso",
];

function tagConflita(
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  tag: string
): boolean {
  if (principal === "rigido" && secundaria === "oral") {
    return TAGS_ORAIS_CONFLITAM_RIGIDO.some((k) => tag.includes(k));
  }
  if (principal === "oral" && secundaria === "rigido") {
    return TAGS_RIGIDOS_CONFLITAM_ORAL.some((k) => tag.includes(k));
  }
  return false;
}

function montarCaracteristicas(
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  pctP: number,
  pctS: number
): string[] {
  const rot = indiceRotacao(pctP);
  const doPrincipal = rotacionarLista(T.CARACTERISTICAS[principal], rot).slice(0, 4);
  if (pctS < 22) return doPrincipal;

  const candidata = rotacionarLista(T.CARACTERISTICAS[secundaria], rot).find(
    (tag) => !doPrincipal.includes(tag) && !tagConflita(principal, secundaria, tag)
  );
  return candidata ? [...doPrincipal, candidata] : doPrincipal;
}

function construirInterpretacao(
  estruturas: EstruturasPct,
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  confiancaZero: boolean,
): { texto: string; perguntaTransformacao: string } {
  const pctP = estruturas[principal];
  const pctS = estruturas[secundaria];
  const ip = T.INTERPRETACOES[principal];
  const ferida = T.FERIDAS[principal];
  const fraseInterp = (ip[1] ?? ip[0]).split(/(?<=[.!?])\s+/)[0] ?? ip[0];

  const blocos: string[] = [];
  blocos.push(`${ferida} ${fraseInterp}`);

  const comboRedundanteComPerfilUnico =
    principal === "rigido" && secundaria === "oral";
  const incluirTensao =
    pctS >= 20 &&
    secundaria !== principal &&
    secundaria !== "psicopata" &&
    !comboRedundanteComPerfilUnico &&
    !(principal === "rigido" && secundaria === "oral" && pctS < 26);

  if (incluirTensao) {
    blocos.push(
      `Entre ${T.NOMES[principal]} e ${T.NOMES[secundaria]} há uma tensão viva no cotidiano, não um defeito, mas um convite à integração.`,
    );
  } else if (pctP - pctS < 12) {
    blocos.push(
      "Os dois padrões centrais aparecem com intensidade próxima, respostas mais contextuais e híbridas.",
    );
  }

  let texto = blocos.slice(0, 3).join("\n\n");
  if (confiancaZero) {
    texto = `Não foi possível validar ombros e quadril nesta sessão. Refaça com poses claras e fundo neutro para uma leitura mais completa.\n\n${texto}`;
  }
  return { texto, perguntaTransformacao: T.PERGUNTAS_TRANSFORMACAO[principal] };
}

function construirPerfilFisicoHumano(
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  pctS: number,
  ag: MarcadoresAgregados
): string {
  const rot = indiceRotacao(ag.simetriaMedia != null ? Math.round(ag.simetriaMedia * 100) : 30);
  const frases = rotacionarLista(T.PERFIL_FISICO_HUMANO[principal], rot).slice(0, 3);
  const eixos = ag.eixosReich;

  if (principal === "rigido" && (eixos?.indiceContencao ?? 0) > 0.38 && frases.length < 4) {
    if (!frases.some((f) => f.includes("contenção"))) {
      frases.push(
        "A organização corporal sugere alguém que mantém o equilíbrio por dentro, com cuidado e precisão."
      );
    }
  }

  if (pctS >= 22 && secundaria !== principal && secundaria === "oral" && principal === "rigido") {
    frases.push("Por baixo dessa estrutura, também aparece uma abertura emocional e desejo de vínculo.");
  }

  if (frases.length === 0) {
    return "Suas fotos revelam padrões do seu perfil corporal. Use as três tomadas juntas para uma visão mais completa.";
  }
  return frases.join(" ");
}

function construirSinteseHumana(
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  pctS: number,
  fusao?: FusaoDiagnosticoEmocionalMetadata
): string | undefined {
  if (!fusao) return undefined;

  const adj = T.SINTESE_ADJ_PRINCIPAL[principal];
  const alinhamento = fusao.alinhamentoFotosFormulario;

  if (alinhamento >= 75) {
    if (pctS >= 22) {
      const toque = T.SINTESE_TOQUE_SECUNDARIO[secundaria];
      return `Suas fotos e seu questionário apontam para alguém ${adj}, com ${toque}.`;
    }
    return `Suas fotos e seu questionário contam a mesma história, com foco em ${T.SINTESE_FOCO[principal]}.`;
  }
  if (alinhamento >= 55) {
    return `Suas fotos e suas respostas se complementam, predominando ${T.SINTESE_FOCO[principal]}.`;
  }
  return `Suas fotos e suas respostas oferecem leituras diferentes; o resultado integrado destaca ${T.SINTESE_FOCO[principal]}.`;
}

function rotacionarLista<U>(arr: U[], start: number): U[] {
  if (arr.length === 0) return arr;
  const s = ((start % arr.length) + arr.length) % arr.length;
  return [...arr.slice(s), ...arr.slice(0, s)];
}

function estiloComunicacaoModulado(
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  pctS: number
): EstiloComunicacao {
  const base = T.ESTILOS_COMUNICACAO[principal];
  if (pctS < 26) return { ...base };
  return {
    ...base,
    descricao: `${base.descricao} Nota-se também colorido de ${T.NOMES[secundaria]} na forma como você organiza frases e ritmo.`,
  };
}

const PADRAO_CONTENCAO_RIGIDA =
  "O corpo apresenta organização e simetria notáveis, com contenção emocional perceptível. Não é colapso buscando sustentação, mas couraça funcional que mantém tudo no lugar. Há tensão discreta na cintura e região dorsal, sugerindo compressão crônica mais do que flacidez oral.";

function resolverPadraoPostural(
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  pctS: number,
  margemEstreita: boolean,
  eixos?: EixosReich
): string {
  const contencaoAlta = (eixos?.indiceContencao ?? 0) > 0.5;
  const retracaoAlta = (eixos?.indiceRetracao ?? 0) > 0.5;
  const compressaoAlta = (eixos?.indiceCompressao ?? 0) > 0.45;
  const retracao = eixos?.indiceRetracao ?? 0;
  const compressao = eixos?.indiceCompressao ?? 0;

  if (principal === "oral" && contencaoAlta && retracaoAlta) {
    const base = PADRAO_CONTENCAO_RIGIDA;
    if (compressaoAlta) {
      return `${base} A compressão dorsal reforça leitura masoquista como traço secundário.`;
    }
    return base;
  }

  if (principal === "rigido" || (contencaoAlta && principal !== "psicopata")) {
    let base = T.PADROES_POSTURAIS[principal === "oral" && contencaoAlta ? "rigido" : principal];
    if (compressaoAlta && principal !== "masoquista") {
      base += " Há também sinais de compressão vertical na cintura e dorsal.";
    }
    if (margemEstreita) {
      if (principal === "rigido" && retracao < 0.5 && compressao < 0.4) {
        if (secundaria === "oral" && pctS < 25) {
          return `${base} ${T.COMBO_POSTURAL_LEVE_ORAL}`;
        }
        return base;
      }
      if (secundaria === "oral" && pctS < 25) {
        return `${base} ${T.COMBO_POSTURAL_LEVE_ORAL}`;
      }
      const ponte = T.PONTE_POSTURAL_SECUNDARIA[secundaria];
      return ponte ? `${base} ${ponte}` : base;
    }
    return base;
  }

  if (margemEstreita) {
    if (secundaria === "oral" && pctS < 25) {
      return `${T.PADROES_POSTURAIS[principal]} ${T.COMBO_POSTURAL_LEVE_ORAL}`;
    }
    const ponte = T.PONTE_POSTURAL_SECUNDARIA[secundaria];
    return ponte
      ? `${T.PADROES_POSTURAIS[principal]} ${ponte}`
      : T.PADROES_POSTURAIS[principal];
  }
  return T.PADROES_POSTURAIS[principal];
}

function dinamicaModulada(
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  pctS: number
): DinamicaFuncional {
  const base = T.DINAMICAS_FUNCIONAIS[principal];
  if (pctS < 26) return { ...base };
  return {
    ...base,
    trabalho: `${base.trabalho} Com frequência, ${T.NOMES[secundaria]} puxa dilemas de ritmo e prioridade no trabalho.`,
  };
}

export interface GerarNarrativaInput {
  engine: ResultadoImagemEngine;
  /** Opcional: só quando reidratar texto após fusão no servidor. */
  fusao?: FusaoDiagnosticoEmocionalMetadata;
  /** Percentuais só das fotos (antes da fusão), para contraste. */
  estruturasSomenteFotos?: EstruturasPct;
}

export function gerarNarrativa(input: GerarNarrativaInput): ResultadoAnalise {
  const { engine, fusao, estruturasSomenteFotos } = input;
  const {
    estruturas,
    estruturaPrincipal: principal,
    estruturaSecundaria: secundaria,
    confiancaAnalise,
    marcadoresPorFoto,
    marcadoresAgregados,
    evidencias,
    metadata,
  } = engine;

  const pctP = estruturas[principal];
  const pctS = estruturas[secundaria];
  const confZero = confiancaAnalise === 0;
  const margemEstreita = pctP - pctS < 12;

  const obsHumano = montarObservacoesPorFoto(marcadoresPorFoto, principal, pctP, true);
  const obsTecnico = montarObservacoesPorFoto(marcadoresPorFoto, principal, pctP, false);
  const { texto: interpretacao, perguntaTransformacao } = construirInterpretacao(
    estruturas,
    principal,
    secundaria,
    confZero,
  );

  const rot = indiceRotacao(pctP);
  const caract = montarCaracteristicas(principal, secundaria, pctP, pctS);

  const pfP = rotacionarLista(T.PONTOS_FORTES[principal], rot).slice(0, 3);
  const pfS = rotacionarLista(T.PONTOS_FORTES[secundaria], rot + 1)
    .filter((p) => !pfP.includes(p))
    .slice(0, 2);
  const pontosFortes = [...pfP, ...pfS];

  const paP = rotacionarLista(T.PONTOS_ATENCAO[principal], rot).slice(0, 3);
  const paS = rotacionarLista(T.PONTOS_ATENCAO[secundaria], rot + 2)
    .filter((p) => !paP.includes(p))
    .slice(0, 1);
  const pontosAtencao = [...paP, ...paS];

  const recP = rotacionarLista(T.RECOMENDACOES[principal], rot).slice(0, 3);
  const maxRecSec =
    secundaria === "oral" && pctS < 25
      ? 1
      : secundaria !== "psicopata" || principal === "psicopata"
        ? 2
        : 0;
  const recS =
    maxRecSec > 0
      ? rotacionarLista(T.RECOMENDACOES[secundaria], rot + 1)
          .filter((r) => !recP.includes(r))
          .slice(0, maxRecSec)
      : [];
  const recomendacoesPraticas = [...recP, ...recS];

  const comboKey = `${principal}-${secundaria}`;
  const perfilUnico =
    T.PERFIS_UNICOS[comboKey] ??
    `A combinação de ${T.NOMES[principal]} com ${T.NOMES[secundaria]} cria um perfil próprio. Observe como estes padrões convivem na sua história, não só no rótulo.`;

  const sinteseHumana = construirSinteseHumana(principal, secundaria, pctS, fusao);
  const eixos = marcadoresAgregados.eixosReich ?? metadata?.eixosReich;
  const pontosCuidadoPrioritarios = montarPontosCuidadoPrioritarios(
    principal,
    secundaria,
    pontosAtencao,
    comboKey,
  );

  const resultado: ResultadoAnalise = {
    versaoNarrativa: VERSAO_NARRATIVA,
    estruturas,
    estruturaPrincipal: principal,
    estruturaSecundaria: secundaria,
    observacoesPorFoto: obsHumano,
    observacoesPorFotoTecnico: obsTecnico,
    sinteseHumana,
    padraoPostural: resolverPadraoPostural(
      principal,
      secundaria,
      pctS,
      margemEstreita,
      marcadoresAgregados.eixosReich ?? metadata?.eixosReich
    ),
    caracteristicasFisicasObservadas: caract,
    interpretacao,
    centroEnergetico: T.CENTROS[principal],
    padraoEnergetico: T.PADROES_ENERGETICOS[principal],
    mensagemTerapeutica: T.MENSAGENS[principal],
    dominanteApelido: T.APELIDOSS[principal],
    fraseIdentidade: T.FRASES_IDENTIDADE[principal],
    pontosFortes,
    pontosAtencao,
    ferida: T.FERIDAS[principal],
    dorLivro: T.DORES_LIVRO[principal],
    perguntaTransformacao,
    leituraEmocionalDeclarada: montarLeituraEmocionalDeclarada(principal, secundaria, fusao),
    contrasteFotosFormulario: montarContrasteFotosFormulario(
      estruturas,
      estruturasSomenteFotos,
      fusao,
    ),
    couracaCorporal: montarCouracaCorporal(principal, eixos),
    pontosCuidadoPrioritarios,
    recurso: T.RECURSOS[principal],
    recomendacoesPraticas,
    confiancaAnalise,
    perfilFisicoNarrado: construirPerfilFisicoHumano(
      principal,
      secundaria,
      pctS,
      marcadoresAgregados
    ),
    estiloComunicacao: estiloComunicacaoModulado(principal, secundaria, pctS),
    perfilUnico,
    dinamicaFuncional: dinamicaModulada(principal, secundaria, pctS),
    metadata,
    marcadoresPorFoto,
    marcadoresAgregados,
    evidenciasMotor: evidencias,
    eixosReich: eixos,
    segmentosReich: marcadoresAgregados.segmentosReich ?? metadata?.segmentosReich,
    estruturasSomenteFotos,
  };
  return normalizarObjetoTextos(resultado);
}
