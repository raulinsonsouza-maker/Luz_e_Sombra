import { normalizarObjetoTextos } from "@workspace/copy-voz";
import type { Dimensao, TemperamentoCodigo, TipoPerfil } from "./types";
import {
  comboNarrativaParaPar,
  comboParaPar,
  dadosTemperamento,
  extrairPerguntaCrescimento,
  montarDimensoesLegiveis,
  montarSinteseHumana,
  NOME_TEMPERAMENTO,
  type RelatorioSecao,
} from "./interpretacao";
import {
  extrairTodosParagrafosAnalise,
  montarAnaliseAprofundada,
  semParagrafosDuplicados,
} from "./analiseAprofundada";

function extrairPassoPratico(texto: string): string {
  return texto.replace(/Pergunta prática:\s*«[^»]+»\.?\s*/g, "").trim();
}

function resumoDom(pontoForte: string): string {
  const frase = pontoForte.split(".")[0];
  return frase ? `${frase}.` : pontoForte;
}

function resumoPontoCego(falha: string): string {
  const frase = falha.split(".")[0];
  return frase ? `${frase}.` : falha;
}

function tracosUnicos(norm: Record<Dimensao, number>, primario: TemperamentoCodigo): string[] {
  const tracos: string[] = [];
  if (norm.ENG >= 0.65) tracos.push("Ritmo acelerado: você ganha energia com movimento e metas claras.");
  else if (norm.ENG <= 0.35) tracos.push("Ritmo profundo: você prefere qualidade e pausa a correria constante.");

  if (norm.EST >= 0.65) tracos.push("Alta sensibilidade emocional: pequenos fatos podem mexer bastante com você.");
  else if (norm.EST <= 0.35) tracos.push("Estabilidade emocional: você mantém a cabeça quando outros entram em pânico.");

  if (primario === "COLERICO") tracos.push("Impulso para resolver antes que outros terminem de explicar.");
  if (primario === "SANGUINEO") tracos.push("Facilidade para conectar e animar pessoas novas.");
  if (primario === "MELANCOLICO") tracos.push("Olhar atento a detalhes que passam despercebidos.");
  if (primario === "FLEUMATICO") tracos.push("Capacidade de sustentar processos sem precisar de holofote.");

  return [...new Set(tracos)].slice(0, 4);
}

export interface NarrativaTemperamentoV4 {
  versaoNarrativa: "temperamento_v4";
  sinteseHumana: string;
  portraitIdentidade: string;
  seuDom: string;
  pontoCego: string;
  comboNarrativa?: string;
  tracosMarcantes: string[];
  perguntaCrescimento: string;
  passoPratico: string;
  dimensoesLegiveis: ReturnType<typeof montarDimensoesLegiveis>;
  insightsDimensao: string[];
  combo?: { forca: string; tensao: string; contexto: string };
  analiseAprofundada: RelatorioSecao[];
  scoreE: number;
  scoreN: number;
  estabilidadeEmocional: number;
}

export function montarNarrativaV4(opts: {
  tipo: TipoPerfil;
  primario: TemperamentoCodigo;
  secundario: TemperamentoCodigo;
  temperamentos_percentuais: Record<TemperamentoCodigo, number>;
  norm: Record<Dimensao, number>;
  empateProximo: boolean;
  frase_sintese: string;
  scoreE: number;
  scoreN: number;
}): NarrativaTemperamentoV4 {
  const {
    tipo,
    primario,
    secundario,
    norm,
    empateProximo,
    frase_sintese,
    temperamentos_percentuais,
    scoreE,
    scoreN,
  } = opts;
  const d = dadosTemperamento(primario);
  const tracos = tracosUnicos(norm, primario);

  let combo: NarrativaTemperamentoV4["combo"];
  let comboNarrativa: string | undefined;
  if (tipo === "DUPLO" || tipo === "MISTO" || empateProximo) {
    const c = comboParaPar(primario, secundario);
    if (c) combo = { forca: c.forca, tensao: c.tensao, contexto: c.contexto };
    comboNarrativa = comboNarrativaParaPar(primario, secundario);
  }

  const analiseAprofundada = montarAnaliseAprofundada({
    tipo,
    primario,
    secundario,
    scoreE,
    scoreN,
    empateProximo,
  });

  const sinteseHumana = montarSinteseHumana({
    tipo,
    primario,
    secundario,
    temperamentos_percentuais,
    empateProximo,
    frase_sintese,
    scoreE,
    scoreN,
  });

  const todosTextos = [
    sinteseHumana,
    resumoDom(d.pontoForte),
    resumoPontoCego(d.falhaEstrutural),
    comboNarrativa ?? "",
    ...tracos,
    ...extrairTodosParagrafosAnalise(analiseAprofundada),
  ].filter(Boolean);
  semParagrafosDuplicados(todosTextos);

  return normalizarObjetoTextos({
    versaoNarrativa: "temperamento_v4",
    sinteseHumana,
    portraitIdentidade: `Com energia social em ${Math.round(scoreE)}% e estabilidade emocional em ${Math.round(100 - scoreN)}%, seu perfil ${NOME_TEMPERAMENTO[primario]} ganha contornos próprios no mapa temperamental.`,
    seuDom: resumoDom(d.pontoForte),
    pontoCego: resumoPontoCego(d.falhaEstrutural),
    comboNarrativa,
    tracosMarcantes: tracos,
    perguntaCrescimento: extrairPerguntaCrescimento(d.caminhoCrescimento),
    passoPratico: extrairPassoPratico(d.caminhoCrescimento),
    dimensoesLegiveis: montarDimensoesLegiveis(norm, primario),
    insightsDimensao: tracos.slice(0, 2),
    combo,
    analiseAprofundada,
    scoreE,
    scoreN,
    estabilidadeEmocional: Math.round(100 - scoreN),
  });
}
