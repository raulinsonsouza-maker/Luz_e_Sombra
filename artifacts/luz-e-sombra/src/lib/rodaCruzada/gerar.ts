import { NOME_TEMPERAMENTO } from "@workspace/temperamento-v1";
import { normalizarObjetoTextos } from "@workspace/copy-voz";
import { CONTEUDO_NIVEL, LABEL_NIVEL, nivelDe } from "./conteudoNivel";
import { CONTEUDO_TEMPERAMENTO, GESTO_TEMPERAMENTO } from "./conteudoTemperamento";
import { AREA_PARA_DINAMICA, CONTEUDO_TRACO, GESTO_TRACO } from "./conteudoTraco";
import {
  AREAS_LINGUAGEM,
  CONTEUDO_LINGUAGEM_RECEBER,
  NOME_LINGUAGEM,
  textoDesalinhamentoArea,
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

function montarAbertura(
  scores: Record<AreaVidaId, number>,
): string[] {
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

function textoLinguagens(area: AreaVidaId, ctx: ContextoCruzado): string | undefined {
  if (!ctx.linguagens) return undefined;
  if (!AREAS_LINGUAGEM.includes(area)) return undefined;
  const receber = String(ctx.linguagens.receberPrincipal);
  const expressar = String(ctx.linguagens.expressarPrincipal);
  const nomeRec = NOME_LINGUAGEM[receber] ?? receber;
  const nomeExp = NOME_LINGUAGEM[expressar] ?? expressar;
  const base =
    CONTEUDO_LINGUAGEM_RECEBER[area]?.[receber as keyof (typeof CONTEUDO_LINGUAGEM_RECEBER)[typeof area]] ??
    `Você gosta de receber amor principalmente por ${nomeRec}. Nesta área, isso muda o que aquece e o que falta.`;

  const partes = [base];
  if (receber !== expressar) {
    partes.push(
      `Você costuma demonstrar carinho por ${nomeExp}, e isso nem sempre é o que mais te alcança. A diferença importa nesta área.`,
    );
  }
  if (ctx.linguagens.desalinhamento?.ativo && ctx.linguagens.desalinhamento.texto) {
    const extra = textoDesalinhamentoArea(area, ctx.linguagens.desalinhamento.texto);
    if (extra) partes.push(extra);
  } else if (ctx.linguagens.cena && (area === "desenvolvimentoAmoroso" || area === "familia")) {
    partes.push(ctx.linguagens.cena);
  }
  return partes.join(" ");
}

function textoTraco(area: AreaVidaId, ctx: ContextoCruzado): string | undefined {
  if (!ctx.traco) return undefined;
  const est = ctx.traco.estruturaPrincipal;
  const banco = CONTEUDO_TRACO[area]?.[est];
  const partes: string[] = [];
  if (banco) partes.push(banco);
  const campo = AREA_PARA_DINAMICA[area];
  const din = campo && ctx.traco.dinamicaFuncional?.[campo];
  if (din && !partes.some((p) => p.includes(din.slice(0, 40)))) {
    partes.push(din);
  }
  return partes.length ? partes.join(" ") : undefined;
}

function textoTemperamento(area: AreaVidaId, ctx: ContextoCruzado): string | undefined {
  if (!ctx.temperamento) return undefined;
  const prim = ctx.temperamento.primario;
  const base = CONTEUDO_TEMPERAMENTO[area]?.[prim];
  if (!base) return undefined;
  const nome = NOME_TEMPERAMENTO[prim] ?? prim;
  const partes = [base];
  if (
    ctx.temperamento.trechoRelacoes &&
    (area === "desenvolvimentoAmoroso" || area === "familia" || area === "vidaSocial")
  ) {
    partes.push(ctx.temperamento.trechoRelacoes);
  }
  if (
    ctx.temperamento.trechoTrabalho &&
    (area === "realizacaoProposito" || area === "recursosFinanceiros")
  ) {
    partes.push(ctx.temperamento.trechoTrabalho);
  }
  if (ctx.temperamento.pontoCego && area === "equilibrioEmocional") {
    partes.push(`Ponto cego do temperamento ${nome.toLowerCase()}: ${ctx.temperamento.pontoCego}`);
  }
  return partes.join(" ");
}

function passosArea(
  area: AreaVidaId,
  nivelTextoPasso: string,
  ctx: ContextoCruzado,
  valor: number,
): string[] {
  const passos: string[] = [nivelTextoPasso];
  if (valor <= 7 && ctx.temperamento) {
    const g = GESTO_TEMPERAMENTO[ctx.temperamento.primario];
    if (g && !passos.includes(g)) passos.push(g);
  }
  if (valor <= 5 && ctx.traco) {
    const g = GESTO_TRACO[ctx.traco.estruturaPrincipal];
    if (g && !passos.includes(g)) passos.push(g);
  }
  // no máximo 2 passos para não sobrecarregar
  return passos.slice(0, 2);
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

  const analises: AnaliseAreaRoda[] = AREAS_RODA_ORDEM.map((id) => {
    const valor = Math.max(0, Math.min(10, Number(scores[id] ?? 0)));
    const nivel = nivelDe(valor);
    const nivelTxt = CONTEUDO_NIVEL[id][nivel];
    return {
      id,
      titulo: AREA_TITULO[id],
      valor,
      nivel,
      labelNivel: LABEL_NIVEL[nivel],
      oQueAcontece: nivelTxt.oQueAcontece,
      comoTemperamentoEntra: textoTemperamento(id, contexto),
      comoTracoEntra: textoTraco(id, contexto),
      comoLinguagensEntram: textoLinguagens(id, contexto),
      comoMelhorar: passosArea(id, nivelTxt.passo, contexto, valor),
      pergunta: nivelTxt.pergunta,
    };
  }).sort((a, b) => a.valor - b.valor);

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
