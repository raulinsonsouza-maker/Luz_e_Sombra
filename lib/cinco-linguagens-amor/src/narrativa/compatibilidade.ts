import { LABEL_LINGUAGEM } from "../perguntas/index.js";
import type {
  DimensaoPerfil,
  EntradaCompatibilidadeManual,
  LinguagemAmor,
  ResultadoCompatibilidade,
} from "../types.js";
import { PONTE_COMPATIBILIDADE } from "./tabelas.js";

function chavePar(a: LinguagemAmor, b: LinguagemAmor): string {
  return `${a}+${b}`;
}

function ponte(receber: LinguagemAmor, expressar: LinguagemAmor): string {
  const k1 = chavePar(receber, expressar);
  const k2 = chavePar(expressar, receber);
  return PONTE_COMPATIBILIDADE[k1] ?? PONTE_COMPATIBILIDADE[k2] ?? `Experimente falar em ${LABEL_LINGUAGEM[receber].toLowerCase()} enquanto o outro demonstra em ${LABEL_LINGUAGEM[expressar].toLowerCase()}.`;
}

function perfilManual(manual: EntradaCompatibilidadeManual): DimensaoPerfil {
  const principal = manual.principalReceber ?? manual.principalExpressar;
  const secundaria = manual.principalExpressar === principal ? principal : manual.principalExpressar;
  const zero = { palavras: 0, tempo: 0, presentes: 0, servicos: 0, toque: 0 };
  zero[principal] = 6;
  if (secundaria !== principal) zero[secundaria] = 4;
  const ranking = (Object.keys(zero) as LinguagemAmor[])
    .map((linguagem, idx) => ({
      linguagem,
      pontos: zero[linguagem],
      pct: Math.round((zero[linguagem] / 15) * 1000) / 10,
      posicao: idx + 1,
    }))
    .sort((a, b) => b.pontos - a.pontos);
  ranking.forEach((r, i) => { r.posicao = i + 1; });
  return {
    pontuacoes: zero,
    ranking,
    principal,
    secundaria: ranking[1]?.linguagem ?? principal,
    terciaria: ranking[2]?.linguagem ?? principal,
    anti: ranking[4]?.linguagem ?? principal,
  };
}

export function computarCompatibilidade(
  perfilA: { receber: DimensaoPerfil; expressar: DimensaoPerfil; nome?: string },
  perfilB: { receber: DimensaoPerfil; expressar: DimensaoPerfil; nome?: string } | EntradaCompatibilidadeManual,
): ResultadoCompatibilidade {
  const b =
    "principalExpressar" in perfilB
      ? {
          receber: perfilManual(perfilB),
          expressar: {
            ...perfilManual(perfilB),
            principal: perfilB.principalExpressar,
            secundaria: perfilB.principalReceber ?? perfilB.principalExpressar,
          },
          nome: perfilB.nome,
        }
      : perfilB;

  const nomeA = perfilA.nome ?? "Você";
  const nomeB = b.nome ?? "A outra pessoa";

  const matchARecebeBExpressa = perfilA.receber.principal === b.expressar.principal;
  const matchBRecebeAExpressa = b.receber.principal === perfilA.expressar.principal;

  let pontuacao = 40;
  if (matchARecebeBExpressa) pontuacao += 30;
  if (matchBRecebeAExpressa) pontuacao += 30;
  if (perfilA.receber.principal === b.receber.principal) pontuacao += 5;
  if (perfilA.expressar.principal === b.expressar.principal) pontuacao += 5;
  pontuacao = Math.min(100, pontuacao);

  const pontesParaA = [ponte(perfilA.receber.principal, b.expressar.principal)];
  const pontesParaB = [ponte(b.receber.principal, perfilA.expressar.principal)];

  if (!matchARecebeBExpressa) {
    pontesParaA.push(
      `${nomeB}pode aprender a oferecer mais${LABEL_LINGUAGEM[perfilA.receber.principal].toLowerCase()}, é o que mais enche seu tanque.`,
    );
  }
  if (!matchBRecebeAExpressa) {
    pontesParaB.push(
      `Você pode oferecer mais${LABEL_LINGUAGEM[b.receber.principal].toLowerCase()}para${nomeB}, é o que mais enche o tanque dela(e).`,
    );
  }

  let resumoHumano: string;
  if (matchARecebeBExpressa && matchBRecebeAExpressa) {
    resumoHumano = `${nomeA} e ${nomeB} formam um par natural: cada um demonstra na linguagem que o outro mais precisa receber.`;
  } else if (matchARecebeBExpressa || matchBRecebeAExpressa) {
    resumoHumano = `Há uma ponte clara entre vocês em pelo menos uma direção. Com pequenos ajustes na outra direção, o vínculo pode aquecer muito.`;
  } else {
    resumoHumano = `Vocês falam linguagens diferentes, isso não é falta de amor, é falta de tradução. Usem as pontes abaixo como roteiro prático.`;
  }

  return {
    pontuacaoCompatibilidade: pontuacao,
    resumoHumano,
    pontesParaA,
    pontesParaB,
    matchARecebeBExpressa,
    matchBRecebeAExpressa,
  };
}
