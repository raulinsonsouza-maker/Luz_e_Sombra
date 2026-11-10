import { limparJargao } from "@workspace/copy-voz";
import * as T from "../tabelas.js";
import type { EstruturaTraco, EstruturasPct, ResultadoAnalise } from "../types.js";
import { INTEGRACAO_TABELA, RECURSOS_TABELA, SOMBRA_TABELA } from "./complementos.js";
import type { BlocoJornada, EtapaJornada, JornadaTraco } from "./tipos.js";

const AVISO =
  "Esta leitura é um caminho de autoconhecimento. Ela se apoia principalmente nas suas respostas. O corpo entra como apoio, com cuidado, e não como diagnóstico.";

function texto(...partes: Array<string | null | undefined>): string[] {
  return partes.map((p) => (p ?? "").trim()).filter(Boolean);
}

function prosa(valor: string | null | undefined): string {
  return limparJargao((valor ?? "").trim());
}

function blocoTexto(rotulo: string | undefined, valor: string | null | undefined): BlocoJornada | null {
  const t = prosa(valor);
  if (!t) return null;
  return rotulo ? { tipo: "texto", rotulo, texto: t } : { tipo: "texto", texto: t };
}

function limparBlocos(blocos: Array<BlocoJornada | null | undefined>): BlocoJornada[] {
  return blocos.filter((b): b is BlocoJornada => b != null);
}

/** Terceiro maior percentual (diferente de principal e secundário). */
export function estruturaTerciariaDe(
  estruturas: EstruturasPct,
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
): EstruturaTraco {
  const ordenado = (Object.entries(estruturas) as Array<[EstruturaTraco, number]>).sort(
    (a, b) => b[1] - a[1],
  );
  const terceiro = ordenado.find(([k]) => k !== principal && k !== secundaria);
  return terceiro?.[0] ?? secundaria;
}

function significadoMapa(
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  terciaria: EstruturaTraco,
): string {
  const nomeP = T.NOMES[principal];
  const nomeS = T.NOMES[secundaria];
  const nomeT = T.NOMES[terciaria];
  if (principal === secundaria) {
    return `Seu resultado aponta com clareza para o traço ${nomeP}: ${T.SINTESE_FOCO[principal]}.`;
  }
  const base = `Seu resultado mostra ${nomeP} como o jeito que mais aparece, ${T.SINTESE_ADJ_PRINCIPAL[principal]}, com presença de ${nomeS}, ${T.SINTESE_TOQUE_SECUNDARIO[secundaria]}`;
  if (terciaria === secundaria || terciaria === principal) {
    return `${base}.`;
  }
  return `${base}. Ainda aparece um terceiro tom de ${nomeT}, que colore o conjunto sem ocupar o centro.`;
}

function necessidadePorTras(principal: EstruturaTraco): string {
  if (principal === "esquizoide") {
    return "Por trás da distância pode haver o desejo de existir com segurança e ser acolhido sem invasão.";
  }
  if (principal === "oral") {
    return "Por trás da busca pelo outro pode haver o desejo de ser sustentado de forma constante.";
  }
  if (principal === "psicopata") {
    return "Por trás do controle pode haver o desejo de não ser ferido outra vez e de manter dignidade.";
  }
  if (principal === "masoquista") {
    return "Por trás do aguentar pode haver o desejo de pertencimento sem crítica.";
  }
  return "Por trás da excelência pode haver o desejo de ser escolhido e amado sem precisar provar.";
}

export function comporJornadaTraco(resultado: {
  estruturas: EstruturasPct;
  estruturaPrincipal: EstruturaTraco;
  estruturaSecundaria: EstruturaTraco;
  pontosFortes?: string[];
  pontosAtencao?: string[];
  fraseIdentidade?: string;
  ferida?: string;
  dorLivro?: string;
  recurso?: string;
  perfilUnico?: string;
  dinamicaFuncional?: ResultadoAnalise["dinamicaFuncional"];
  estiloComunicacao?: ResultadoAnalise["estiloComunicacao"];
  recomendacoesPraticas?: string[];
  mensagemTerapeutica?: string;
  perguntaTransformacao?: string;
}): JornadaTraco {
  const principal = resultado.estruturaPrincipal;
  const secundaria = resultado.estruturaSecundaria;
  const terciaria = estruturaTerciariaDe(resultado.estruturas, principal, secundaria);
  const nomeP = T.NOMES[principal];
  const nomeS = T.NOMES[secundaria];
  const nomeT = T.NOMES[terciaria];
  // Preferir tabelas atuais para a prosa principal (resultado salvo pode estar desatualizado).
  const dia = T.DINAMICAS_FUNCIONAIS[principal];
  const estilo = T.ESTILOS_COMUNICACAO[principal];
  const ferida = T.FERIDAS[principal];
  const dorLivro = T.DORES_LIVRO[principal];
  const recurso = T.RECURSOS[principal];
  const interp = T.INTERPRETACOES[principal];
  const comboKey = `${principal}-${secundaria}`;
  const perfilPar =
    T.PERFIS_PAR[comboKey] ??
    T.PERFIS_UNICOS[comboKey] ??
    `A combinação de ${nomeP} com ${nomeS} cria um perfil próprio. As duas forças se encontram no seu jeito de viver.`;
  const recomendacoes = resultado.recomendacoesPraticas?.length
    ? resultado.recomendacoesPraticas
    : T.RECOMENDACOES[principal];
  const mensagem = T.MENSAGENS[principal];
  const pergunta = T.PERGUNTAS_TRANSFORMACAO[principal];
  const pontosFortes = resultado.pontosFortes?.length ? resultado.pontosFortes : T.PONTOS_FORTES[principal];
  const pontosAtencao = resultado.pontosAtencao?.length ? resultado.pontosAtencao : T.PONTOS_ATENCAO[principal];
  const significado = significadoMapa(principal, secundaria, terciaria);

  const etapas: EtapaJornada[] = [
    {
      id: "mapa",
      numero: 1,
      titulo: "Seu mapa de personalidade",
      subtitulo: "Como os cinco traços se organizam em você",
      blocos: limparBlocos([
        blocoTexto(
          "O que os números mostram",
          "Cada percentual diz quanto aquele jeito aparece no seu perfil. Os cinco somam 100%. O maior conduz; o segundo colore o primeiro; o terceiro acrescenta um tom.",
        ),
        blocoTexto("O que isso significa?", significado),
      ]),
    },
    {
      id: "formacao",
      numero: 2,
      titulo: "Como seu padrão se formou",
      subtitulo: "A história que este traço pode carregar",
      blocos: limparBlocos([
        blocoTexto("Em uma frase", T.FRASES_IDENTIDADE[principal]),
        blocoTexto("De onde isso pode ter vindo", interp[0]),
        blocoTexto("O que essa proteção desenvolveu", interp[1]),
        blocoTexto("Como isso pode aparecer hoje", interp[2]),
      ]),
    },
    {
      id: "dor",
      numero: 3,
      titulo: "A dor que você aprendeu a proteger",
      subtitulo: "O que esse padrão procura evitar",
      blocos: limparBlocos([
        blocoTexto("A experiência emocional", ferida),
        blocoTexto("Como isso pode ter ecoado na vida", dorLivro),
        blocoTexto("A necessidade por trás", necessidadePorTras(principal)),
      ]),
    },
    {
      id: "recurso",
      numero: 4,
      titulo: "A inteligência da sua proteção",
      subtitulo: "O talento que nasceu do mesmo movimento",
      blocos: limparBlocos([
        blocoTexto("O recurso que já é seu", recurso),
        {
          tipo: "tabela",
          rotulo: "Quando equilibra e quando exagera",
          cabecalhos: ["Recurso", "Em equilíbrio", "Em excesso"],
          linhas: RECURSOS_TABELA[principal].map(([nome, bom, excesso]) => [nome, bom, excesso]),
        },
        {
          tipo: "lista",
          rotulo: "Talentos que aparecem com frequência",
          itens: pontosFortes,
        },
        blocoTexto(
          "A mensagem central",
          "Você não precisa abandonar sua força para cuidar da dor. O caminho é usar essa força sem precisar se proteger o tempo todo.",
        ),
      ]),
    },
    {
      id: "vida",
      numero: 5,
      titulo: "Como isso aparece na sua vida",
      subtitulo: "Trabalho, relações, decisões e o jeito de se comunicar",
      blocos: limparBlocos([
        blocoTexto("No trabalho", dia.trabalho),
        blocoTexto("Nas relações", dia.relacoes),
        blocoTexto("Nas decisões", dia.decisoes),
        blocoTexto("Sua energia", dia.energia),
        blocoTexto("Como você se comunica", estilo.descricao),
        blocoTexto("Com as pessoas próximas", estilo.emRelacoes),
        blocoTexto("Quando a pressão sobe", dia.estresse),
      ]),
    },
    {
      id: "sombra",
      numero: 6,
      titulo: "Sua sombra: quando a proteção limita",
      subtitulo: "A intenção boa e o efeito que cansa",
      blocos: limparBlocos([
        blocoTexto("O que está por trás", dia.sombra),
        {
          tipo: "tabela",
          rotulo: "Você tenta… e pode acabar…",
          cabecalhos: ["Você tenta", "Pode acabar"],
          linhas: SOMBRA_TABELA[principal],
        },
        {
          tipo: "lista",
          rotulo: "Pontos que pedem cuidado",
          itens: pontosAtencao,
        },
        blocoTexto(
          "Lembrete",
          "O que um dia foi proteção pode, sem que você perceba, virar prisão. A sombra não é defeito: é o excesso de uma estratégia que já teve função.",
        ),
      ]),
    },
    {
      id: "outros",
      numero: 7,
      titulo: "A influência dos outros traços",
      subtitulo: "Como o segundo e o terceiro coloram o primeiro",
      blocos: limparBlocos([
        blocoTexto(
          "Seu trio",
          principal === secundaria
            ? `O traço ${nomeP} aparece com bastante clareza no seu perfil.`
            : `Principal: ${nomeP}. Também presente: ${nomeS}. Terceiro tom: ${nomeT}.`,
        ),
        blocoTexto("Como as duas forças principais se encontram", perfilPar),
        principal !== terciaria && secundaria !== terciaria
          ? blocoTexto("O que o terceiro traço acrescenta", T.TOQUE_TERCIARIO[terciaria])
          : null,
      ]),
    },
    {
      id: "integracao",
      numero: 8,
      titulo: "Seu caminho de integração",
      subtitulo: "O que flexibilizar e o que praticar",
      blocos: limparBlocos([
        blocoTexto("O caminho que se abre", interp[3]),
        {
          tipo: "tabela",
          rotulo: "Deixar de viver só assim · Aprender a experimentar",
          cabecalhos: ["Deixar de viver só assim", "Aprender a experimentar"],
          linhas: INTEGRACAO_TABELA[principal],
        },
        {
          tipo: "passos",
          rotulo: "Exercícios para esta semana",
          itens: recomendacoes.slice(0, 3),
        },
        blocoTexto("Um cuidado próximo da ferida", T.CUIDADOS_FERIDA[principal]),
      ]),
    },
    {
      id: "luz",
      numero: 9,
      titulo: "Da sombra à luz",
      subtitulo: "Reconhecimento e um próximo passo",
      blocos: limparBlocos([
        { tipo: "destaque", rotulo: "Para levar com você", texto: prosa(mensagem) },
        blocoTexto(
          undefined,
          interp[4] ??
            "Seu próximo passo não é se tornar outra pessoa. É descobrir quem você pode ser quando a proteção antiga não precisa mais conduzir sozinha.",
        ),
        { tipo: "destaque", rotulo: "Para pensar", texto: prosa(pergunta) },
      ]),
    },
  ];

  return {
    aviso: AVISO,
    mapa: {
      principal,
      secundaria,
      terciaria,
      nomePrincipal: nomeP,
      nomeSecundaria: nomeS,
      nomeTerciaria: nomeT,
      percentuais: resultado.estruturas,
      pontosFortes,
      pontosAtencao,
      significado,
    },
    etapas,
  };
}

/** Garante que a jornada tenha as 9 partes na ordem. */
export function idsEtapas(jornada: JornadaTraco): string[] {
  return jornada.etapas.map((e) => e.id);
}

export function textosDaJornada(jornada: JornadaTraco): string[] {
  const out: string[] = [jornada.aviso, jornada.mapa.significado];
  for (const etapa of jornada.etapas) {
    for (const bloco of etapa.blocos) {
      if (bloco.tipo === "texto" || bloco.tipo === "destaque") out.push(bloco.texto);
      if (bloco.tipo === "lista" || bloco.tipo === "passos") out.push(...bloco.itens);
      if (bloco.tipo === "tabela") {
        for (const linha of bloco.linhas) {
          out.push(...linha);
        }
      }
    }
  }
  return texto(...out);
}
