import { normalizarObjetoTextos } from "@workspace/copy-voz";
import { CONTEUDO_NIVEL, LABEL_NIVEL, nivelDe } from "./conteudoNivel";
import { CONTEUDO_TEMPERAMENTO, GESTO_TEMPERAMENTO } from "./conteudoTemperamento";
import { CONTEUDO_TRACO, GESTO_TRACO } from "./conteudoTraco";
import {
  AREAS_LINGUAGEM,
  CONTEUDO_LINGUAGEM_RECEBER,
  NOME_LINGUAGEM,
} from "./conteudoLinguagens";
import {
  AREA_TITULO,
  AREAS_RODA_ORDEM,
  type AnaliseAreaRoda,
  type AreaVidaId,
  type ContextoCruzado,
  type ResultadoRodaCruzada,
} from "./tipos";

const NOME_TRACO: Record<string, string> = {
  esquizoide: "esquizóide",
  oral: "oral",
  psicopata: "psicopata",
  masoquista: "masoquista",
  rigido: "rígido",
};

export const ROTULO_LINGUAGEM: Partial<Record<AreaVidaId, string>> = {
  desenvolvimentoAmoroso: "No jeito de amar",
  familia: "No afeto da família",
  vidaSocial: "Nas amizades",
  plenitudeFelicidade: "O que aquece a alegria",
};

function prosa(titulo: string): string {
  return titulo.trim().toLowerCase();
}

function listaNatural(itens: string[]): string {
  const nomes = itens.map((i) => i.trim()).filter(Boolean);
  if (nomes.length <= 1) return nomes[0] ?? "";
  return `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
}

function chaveDe(titulos: string[]): string {
  return titulos.map((t) => t.toLowerCase()).join(" ");
}

function ehAlegria(chave: string): boolean {
  return /plenitude|criatividade|diversão|hobby|alegria/.test(chave);
}
function ehVinculo(chave: string): boolean {
  return /social|amoroso|família|familia/.test(chave);
}
function ehMente(chave: string): boolean {
  return /intelectual|emocional|espiritualidade/.test(chave);
}

/** Primeira frase de um texto longo, sem virar parágrafo-ensaio. */
function primeiraFrase(texto: string, max = 180): string | undefined {
  const t = texto.trim();
  if (!t) return undefined;
  const corte = t.match(/^(.+?[.!?])(?:\s|$)/);
  const frase = (corte?.[1] ?? t).trim();
  if (frase.length <= max) return frase;
  return `${frase.slice(0, max - 1).trim()}…`;
}

function montarAbertura(scores: Record<AreaVidaId, number>): string[] {
  const ordenadas = AREAS_RODA_ORDEM
    .map((id) => ({ id, titulo: AREA_TITULO[id], valor: scores[id] ?? 0 }))
    .sort((a, b) => a.valor - b.valor);
  const fracas = ordenadas.filter((a) => a.valor <= 5);
  const fortes = [...ordenadas].filter((a) => a.valor >= 8).reverse();
  const foco = (fracas.length ? fracas : ordenadas).slice(0, 2);
  const apoios = (fortes.length ? fortes : [...ordenadas].reverse()).slice(0, 3);
  const amplitude = ordenadas[ordenadas.length - 1].valor - ordenadas[0].valor;

  const focoChave = chaveDe(foco.map((a) => a.titulo));
  const apoioChave = chaveDe(apoios.map((a) => a.titulo));

  let padrao: string;
  if (ehAlegria(focoChave) && ehVinculo(apoioChave) && ehMente(apoioChave)) {
    padrao =
      "Você tem gente, amor e uma mente viva. O que ainda falta não é conquista. É alegria simples: o tipo que não espera a vida ficar pronta para aparecer.";
  } else if (ehAlegria(focoChave) && ehVinculo(apoioChave)) {
    padrao =
      "Tem gente perto, e mesmo assim a leveza ainda parece distante. Relação boa não substitui o prazer de estar vivo no próprio dia.";
  } else if (ehAlegria(focoChave) && ehMente(apoioChave)) {
    padrao =
      "Sua cabeça anda longe, e o prazer de viver ainda fica para depois. Entender a vida não é o mesmo que senti-la.";
  } else if (ehVinculo(focoChave) && ehMente(apoioChave)) {
    padrao =
      "Por dentro você se segura, mas os vínculos pedem presença agora. Crescer sozinho deixa um buraco que nenhuma conquista fecha.";
  } else if (amplitude >= 5) {
    padrao =
      "Uma parte da sua vida puxa para frente. Outra ainda segura o freio. O número do meio não conta essa história.";
  } else if (amplitude <= 2) {
    padrao =
      "Sua roda está mais parecida consigo mesma. Agora o trabalho não é apagar fogo. É escolher, com carinho, onde aprofundar.";
  } else {
    padrao =
      "O que está alto te sustenta. O que está baixo mostra o próximo cuidado. Olhe os dois sem apagar nenhum.";
  }

  return [
    padrao,
    `O pedido mais claro agora está em ${listaNatural(foco.map((a) => prosa(a.titulo)))}. O que já te segura bem está em ${listaNatural(apoios.map((a) => prosa(a.titulo)))}.`,
  ];
}

function textoLinguagens(area: AreaVidaId, ctx: ContextoCruzado, detalhar: boolean): string | undefined {
  if (!ctx.linguagens) return undefined;
  if (!AREAS_LINGUAGEM.includes(area)) return undefined;
  const receber = String(ctx.linguagens.receberPrincipal);
  const expressar = String(ctx.linguagens.expressarPrincipal);
  const nomeRec = NOME_LINGUAGEM[receber] ?? receber;
  const nomeExp = NOME_LINGUAGEM[expressar] ?? expressar;
  const base =
    CONTEUDO_LINGUAGEM_RECEBER[area]?.[receber as keyof (typeof CONTEUDO_LINGUAGEM_RECEBER)[typeof area]] ??
    `Você se sente mais cuidado quando recebe ${nomeRec}. Nesta área, isso muda o que aquece e o que falta.`;

  if (!detalhar) return base;

  const partes = [base];
  if (receber !== expressar) {
    partes.push(
      `Você costuma demonstrar carinho por ${nomeExp}, e isso nem sempre é o que mais te alcança.`,
    );
  }
  if (ctx.linguagens.desalinhamento?.ativo && area === "desenvolvimentoAmoroso") {
    const trecho = primeiraFrase(ctx.linguagens.desalinhamento.texto, 160);
    if (trecho) partes.push(trecho);
  }
  return partes.join(" ");
}

function textoTraco(area: AreaVidaId, ctx: ContextoCruzado): string | undefined {
  if (!ctx.traco) return undefined;
  return CONTEUDO_TRACO[area]?.[ctx.traco.estruturaPrincipal];
}

function textoTemperamento(
  area: AreaVidaId,
  ctx: ContextoCruzado,
  extras: { relacoes?: boolean; trabalho?: boolean; pontoCego?: boolean },
): string | undefined {
  if (!ctx.temperamento) return undefined;
  const prim = ctx.temperamento.primario;
  const base = CONTEUDO_TEMPERAMENTO[area]?.[prim];
  if (!base) return undefined;
  const partes = [base];
  if (extras.relacoes) {
    const trecho = primeiraFrase(ctx.temperamento.trechoRelacoes ?? "", 160);
    if (trecho) partes.push(trecho);
  }
  if (extras.trabalho) {
    const trecho = primeiraFrase(ctx.temperamento.trechoTrabalho ?? "", 160);
    if (trecho) partes.push(trecho);
  }
  if (extras.pontoCego && ctx.temperamento.pontoCego) {
    const trecho = primeiraFrase(ctx.temperamento.pontoCego, 140);
    if (trecho) partes.push(`Um cuidado do seu temperamento: ${trecho.replace(/^./, (c) => c.toLowerCase())}`);
  }
  return partes.join(" ");
}

/**
 * Gera a análise profunda da Roda cruzando Temperamento, Traço e Linguagens.
 * Módulos ausentes simplesmente não aparecem nas seções.
 */
export function gerarAnaliseRodaCruzada(
  scores: Record<AreaVidaId, number>,
  contexto: ContextoCruzado,
): ResultadoRodaCruzada {
  const abertura = montarAbertura(scores);

  const ordenadas = AREAS_RODA_ORDEM
    .map((id) => ({ id, valor: Math.max(0, Math.min(10, Number(scores[id] ?? 0))) }))
    .sort((a, b) => a.valor - b.valor);

  const focoIds = new Set(ordenadas.filter((a) => a.valor <= 5).slice(0, 2).map((a) => a.id));
  if (focoIds.size === 0) {
    ordenadas.slice(0, 2).forEach((a) => focoIds.add(a.id));
  }

  // Extras de temperamento só uma vez, na área mais frágil do grupo
  const maisFracaDe = (candidatas: AreaVidaId[]) =>
    ordenadas.find((a) => candidatas.includes(a.id))?.id;

  const areaRelacoesExtra = maisFracaDe(["desenvolvimentoAmoroso", "familia", "vidaSocial"]);
  const areaTrabalhoExtra = maisFracaDe(["realizacaoProposito", "recursosFinanceiros"]);
  const areaPontoCego =
    (scores.equilibrioEmocional ?? 10) <= 7 ? ("equilibrioEmocional" as AreaVidaId) : null;

  const gestosUsados = new Set<string>();

  const analises: AnaliseAreaRoda[] = ordenadas.map(({ id, valor }) => {
    const nivel = nivelDe(valor);
    const nivelTxt = CONTEUDO_NIVEL[id][nivel];
    const noFoco = focoIds.has(id);

    const comoTemperamentoEntra = textoTemperamento(id, contexto, {
      relacoes: id === areaRelacoesExtra,
      trabalho: id === areaTrabalhoExtra,
      pontoCego: id === areaPontoCego,
    });
    const comoTracoEntra = textoTraco(id, contexto);
    const comoLinguagensEntram = textoLinguagens(
      id,
      contexto,
      id === "desenvolvimentoAmoroso",
    );

    const passos: string[] = [nivelTxt.passo];
    if (noFoco && contexto.temperamento) {
      const g = GESTO_TEMPERAMENTO[contexto.temperamento.primario];
      if (g && !gestosUsados.has(g)) {
        passos.push(g);
        gestosUsados.add(g);
      }
    }
    if (noFoco && passos.length < 2 && contexto.traco) {
      const g = GESTO_TRACO[contexto.traco.estruturaPrincipal];
      if (g && !gestosUsados.has(g)) {
        passos.push(g);
        gestosUsados.add(g);
      }
    }

    return {
      id,
      titulo: AREA_TITULO[id],
      valor,
      nivel,
      labelNivel: LABEL_NIVEL[nivel],
      oQueAcontece: nivelTxt.oQueAcontece,
      comoTemperamentoEntra,
      comoTracoEntra,
      comoLinguagensEntram,
      comoMelhorar: passos.slice(0, 2),
      pergunta: nivelTxt.pergunta,
    };
  });

  return normalizarObjetoTextos({
    abertura,
    analises,
    fontes: {
      temperamento: !!contexto.temperamento,
      traco: !!contexto.traco,
      linguagens: !!contexto.linguagens,
    },
  });
}

export function scoresDeAvaliacao(av: Record<string, number>): Record<AreaVidaId, number> {
  const out = {} as Record<AreaVidaId, number>;
  for (const id of AREAS_RODA_ORDEM) {
    out[id] = Number(av[id] ?? 0);
  }
  return out;
}

export { NOME_TRACO };
