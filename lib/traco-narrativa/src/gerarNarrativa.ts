import type {
  ResultadoImagemEngine,
  EstruturaTraco,
  EstruturasPct,
  MarcadoresAgregados,
  MarcadoresFoto,
  TipoFoto,
} from "@workspace/traco-imagem-engine";
import type { FusaoDiagnosticoEmocionalMetadata } from "@workspace/traco-diagnostico-fusion";
import type { DinamicaFuncional, EstiloComunicacao, ResultadoAnalise } from "./types.js";
import * as T from "./tabelas.js";

function bandaPct(pct: number): string {
  if (pct < 24) return "discreta";
  if (pct < 42) return "moderada";
  return "marcada";
}

/** Gira qual parágrafo base aparece primeiro conforme a intensidade (%), para não repetir texto só pelo dominante. */
function indiceRotacao(principalPct: number): number {
  return Math.min(4, Math.floor(principalPct / 20));
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
  if (m.densidadeCorpo != null && m.densidadeCorpo > 0.42) {
    partes.push("Ocupação espacial do corpo na imagem é alta (máscara de segmentação).");
  }

  const tecnico = partes.length ? ` ${partes.join(" ")}` : "";
  return `${base}${tecnico} Leitura com intensidade ${bandaPct(pctPrincipal)} para ${T.NOMES[principal]} (${pctPrincipal}% no mapa atual).`;
}

function montarObservacoesPorFoto(
  fotos: MarcadoresFoto[],
  principal: EstruturaTraco,
  pctPrincipal: number
): Partial<Record<TipoFoto, string>> {
  const out: Partial<Record<TipoFoto, string>> = {};
  for (const m of fotos) {
    out[m.tipo] = observacaoPorFoto(m, principal, pctPrincipal);
  }
  return out;
}

function construirInterpretacao(
  estruturas: EstruturasPct,
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  fusao: FusaoDiagnosticoEmocionalMetadata | undefined,
  confiancaZero: boolean
): string {
  const pctP = estruturas[principal];
  const pctS = estruturas[secundaria];
  const ip = T.INTERPRETACOES[principal];
  const isec = T.INTERPRETACOES[secundaria];
  const r = indiceRotacao(pctP);

  const blocos: string[] = [];
  if (fusao?.sinteseIntegrada?.trim()) {
    blocos.push(`Integração fotos + questionário: ${fusao.sinteseIntegrada.trim()}`);
  }
  if (fusao?.sinaisConvergentes?.length) {
    blocos.push(`Sinais convergentes: ${fusao.sinaisConvergentes.slice(0, 4).join(" · ")}`);
  }

  blocos.push(ip[r] ?? ip[0]);
  blocos.push(ip[(r + 1) % 5] ?? ip[1]);
  blocos.push(pctS >= 18 ? isec[(r + 2) % 5] ?? isec[0] : ip[(r + 2) % 5] ?? ip[2]);
  blocos.push(ip[(r + 3) % 5] ?? ip[3]);

  const comboKey = `${principal}-${secundaria}`;
  const combo =
    T.COMBOS[comboKey] ??
    "uma singularidade que pede tempo de observação: dois polos convivem e pedem integração consciente.";
  blocos.push(
    `A combinação de ${T.NOMES[principal]} (${pctP}%) com ${T.NOMES[secundaria]} (${pctS}%) revela ${combo}`
  );

  if (pctP - pctS < 8) {
    blocos.push(
      "Os dois padrões centrais aparecem com intensidade próxima — tendência a respostas mais contextuais e híbridas."
    );
  } else {
    blocos.push(ip[(r + 4) % 5] ?? ip[4]);
  }

  const texto = blocos.filter(Boolean).join("\n\n");
  if (confiancaZero) {
    return `Confiança baixa nesta sessão: não foi possível validar ombros e quadril em foto de corpo. Leia como exploração — refaça com poses claras e fundo neutro.\n\n${texto}`;
  }
  return texto;
}

function construirPerfilFisico(fotos: MarcadoresFoto[], ag: MarcadoresAgregados): string {
  const parts: string[] = [];
  const front = fotos.find((f) => f.tipo === "corpo-frente");
  const side = fotos.find((f) => f.tipo === "corpo-lado");
  const face = fotos.find((f) => f.tipo === "rosto");

  const usarFront = front?.poseDetectada && front.shr != null ? front : null;
  const shrVal = usarFront?.shr ?? ag.shrMedio;

  if (shrVal != null) {
    const shr = shrVal;
    if (shr > 1.35)
      parts.push(
        "Os ombros são marcadamente mais largos que os quadris — silhueta em triângulo invertido, ênfase superior."
      );
    else if (shr > 1.18)
      parts.push("Ombros superam os quadris em largura: proporção superior dominante.");
    else if (shr > 1.06)
      parts.push("Proporção ombro–quadril levemente favorável ao tórax.");
    else if (shr > 0.94)
      parts.push("Ombros e quadril com largura semelhante — silhueta mais retangular/equilibrada.");
    else if (shr < 0.86)
      parts.push("Quadris mais largos que ombros — massa visual mais baixa.");
    else parts.push("Ombros um pouco mais estreitos que o quadril, volume na porção inferior.");

    const ul = usarFront?.ulr ?? ag.ulrMedio;
    if (ul != null) {
      if (ul > 1.25)
        parts.push("Massa/visual mais concentrada na metade superior do corpo.");
      else if (ul < 0.78)
        parts.push("Massa/visual mais concentrada na metade inferior.");
      else parts.push("Distribuição superior/inferior relativamente equilibrada.");
    }

    const sy = usarFront?.simetria ?? ag.simetriaMedia;
    if (sy != null) {
      if (sy > 0.9) parts.push("Alta simetria bilateral nas medidas visíveis.");
      else if (sy > 0.83) parts.push("Boa simetria bilateral com pequenas diferenças naturais.");
      else if (sy < 0.76)
        parts.push("Assimetria bilateral perceptível — organização diferente entre os lados.");
    }

    const dns = usarFront?.densidadeCorpo ?? ag.densidadeMedia;
    if (dns != null && dns > 0.01) {
      if (dns > 0.48) parts.push("Corpo ocupa bastante espaço no quadro (densidade alta na máscara).");
      else if (dns < 0.15) parts.push("Linha mais esguia no quadro (densidade baixa na máscara).");
    }
  }

  if (side?.poseDetectada && side.inclinacaoAnterior != null) {
    const fl = side.inclinacaoAnterior;
    if (fl > 0.03)
      parts.push("No perfil, leve projeção anterior do tronco em relação à pelve.");
    else if (fl < -0.03) parts.push("No perfil, leve recuo ou colapso anterior.");
  }

  if (face?.poseDetectada && face.simetria != null) {
    if (face.simetria > 0.9) parts.push("Rosto com alta simetria entre os lados.");
    else if (face.simetria < 0.76) parts.push("Rosto com assimetria marcada entre os lados.");
  }

  if (parts.length === 0) {
    return "As fotos permitiram uma leitura orientativa do perfil abaixo; para máxima precisão, use fundo neutro, luz uniforme e corpo inteiro visível nas três tomadas.";
  }
  return parts.join(" ");
}

function rotacionarLista<T>(arr: T[], start: number): T[] {
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
    descricao: `${base.descricao} Nota-se também colorido de ${T.NOMES[secundaria]} (${pctS}%) na forma como você organiza frases e ritmo.`,
  };
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
    trabalho: `${base.trabalho} Com frequência, ${T.NOMES[secundaria]} (${pctS}%) puxa dilemas de ritmo e prioridade no trabalho.`,
  };
}

export interface GerarNarrativaInput {
  engine: ResultadoImagemEngine;
  /** Opcional: só quando reidratar texto após fusão no servidor. */
  fusao?: FusaoDiagnosticoEmocionalMetadata;
}

export function gerarNarrativa(input: GerarNarrativaInput): ResultadoAnalise {
  const { engine, fusao } = input;
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

  const obs = montarObservacoesPorFoto(marcadoresPorFoto, principal, pctP);
  const interpretacao = construirInterpretacao(estruturas, principal, secundaria, fusao, confZero);

  const rot = indiceRotacao(pctP);
  const caract = [
    ...rotacionarLista(T.CARACTERISTICAS[principal], rot).slice(0, 4),
    ...rotacionarLista(T.CARACTERISTICAS[secundaria], rot).slice(0, 2),
  ];

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
  const recS = rotacionarLista(T.RECOMENDACOES[secundaria], rot + 1)
    .filter((r) => !recP.includes(r))
    .slice(0, 2);
  const recomendacoesPraticas = [...recP, ...recS];

  const comboKey = `${principal}-${secundaria}`;
  const perfilUnico =
    T.PERFIS_UNICOS[comboKey] ??
    `A combinação de ${T.NOMES[principal]} (${pctP}%) com ${T.NOMES[secundaria]} (${pctS}%) cria um perfil próprio — observe como estes percentuais convivem na sua história, não só no rótulo.`;

  return {
    estruturas,
    estruturaPrincipal: principal,
    estruturaSecundaria: secundaria,
    observacoesPorFoto: obs,
    padraoPostural: T.PADROES_POSTURAIS[principal],
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
    recurso: T.RECURSOS[principal],
    recomendacoesPraticas,
    confiancaAnalise,
    perfilFisicoNarrado: construirPerfilFisico(marcadoresPorFoto, marcadoresAgregados),
    estiloComunicacao: estiloComunicacaoModulado(principal, secundaria, pctS),
    perfilUnico,
    dinamicaFuncional: dinamicaModulada(principal, secundaria, pctS),
    metadata,
    marcadoresPorFoto,
    marcadoresAgregados,
    evidenciasMotor: evidencias,
  };
}
