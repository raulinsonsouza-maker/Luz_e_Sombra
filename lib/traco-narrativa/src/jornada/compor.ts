import { limparJargao } from "@workspace/copy-voz";
import * as T from "../tabelas.js";
import type { EstruturaTraco, EstruturasPct, ResultadoAnalise } from "../types.js";
import { INTEGRACAO_TABELA, RECURSOS_TABELA, SOMBRA_TABELA } from "./complementos.js";
import type { BlocoJornada, EtapaJornada, JornadaTraco } from "./tipos.js";

const AVISO =
  "Esta leitura é um caminho de autoconhecimento. Ela se apoia principalmente nas suas respostas. O corpo entra como apoio, com cuidado, e não como diagnóstico.";

/** Sem vírgulas internas: entram em frases longas e o formatador não pode parti-las. */
const FOCO_CURTO: Record<EstruturaTraco, string> = {
  esquizoide: "espaço interior e profundidade",
  oral: "vínculo e cuidado",
  psicopata: "direção e presença",
  masoquista: "permanência e sustentação",
  rigido: "forma e compromisso",
};

const RISCO_CURTO: Record<EstruturaTraco, string> = {
  esquizoide: "sumir quando a vida pede presença",
  oral: "se esvaziar cuidando do outro",
  psicopata: "controlar para não sentir",
  masoquista: "carregar além do justo",
  rigido: "endurecer o afeto sob o nome de qualidade",
};

/** Como o 2º traço colore o cotidiano (uma frase objetiva por domínio). */
const COR_SECUNDARIA: Record<EstruturaTraco, { trabalho: string; relacoes: string }> = {
  esquizoide: {
    trabalho:
      "Com o Esquizóide também presente, você precisa de intervalos de silêncio para não perder a qualidade do que entrega.",
    relacoes:
      "O Esquizóide colore o vínculo: mesmo querendo perto, você precisa de espaço — e avisar isso evita que o outro leia distância como rejeição.",
  },
  oral: {
    trabalho:
      "Com o Oral também presente, o clima humano da equipe pesa no seu rendimento: sem vínculo, a entrega seca mais rápido.",
    relacoes:
      "O Oral colore o vínculo: há sede de proximidade e o risco de dar além do justo para não perder o calor.",
  },
  psicopata: {
    trabalho:
      "Com o Psicopata também presente, você empurra decisões e corta nós quando o grupo trava — o cuidado é não transformar urgência em pressão sobre quem está ao lado.",
    relacoes:
      "O Psicopata colore o vínculo: há força e direção, e também a tentação de conduzir a intimidade em vez de habitá-la.",
  },
  masoquista: {
    trabalho:
      "Com o Masoquista também presente, você segura sobrecarga por tempo longo antes de pedir alívio — e isso pode parecer competência até o corpo cobrar.",
    relacoes:
      "O Masoquista colore o vínculo: você permanece e aguenta, às vezes além do ponto em que um limite claro seria o verdadeiro cuidado.",
  },
  rigido: {
    trabalho:
      "Com o Rígido também presente, você cuida com constância e cobra de si um padrão alto — às vezes mais do que o cargo ou a equipe pediram.",
    relacoes:
      "O Rígido colore o vínculo: você ama com lealdade organizada e pode demorar a mostrar a parte frágil, mesmo quando o peito já pediu colo.",
  },
};

const COR_TERCIARIA: Record<EstruturaTraco, string> = {
  esquizoide:
    "Em terceiro, o Esquizóide acrescenta a necessidade de um canto só seu — sem isso, o excesso de contato esgota a presença.",
  oral:
    "Em terceiro, o Oral acrescenta calor e a vontade de ser visto: mesmo quando outro traço conduz, o vínculo continua pedindo lugar.",
  psicopata:
    "Em terceiro, o Psicopata acrescenta impulso de corte e avanço quando a situação pede decisão rápida.",
  masoquista:
    "Em terceiro, o Masoquista acrescenta a tendência a carregar a sobrecarga emocional por tempo longo antes de pedir alívio.",
  rigido:
    "Em terceiro, o Rígido acrescenta capricho e a vontade de manter a forma — útil na entrega, arriscado quando vira couraça no afeto.",
};

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
  const base = `O traço que mais aparece em você é ${nomeP}: ${T.SINTESE_ADJ_PRINCIPAL[principal]}. Em seguida vem ${nomeS}, ${T.SINTESE_TOQUE_SECUNDARIO[secundaria]}`;
  if (terciaria === secundaria || terciaria === principal) {
    return `${base}.`;
  }
  return `${base}. Em terceiro aparece ${nomeT}, que colore o conjunto sem ocupar o centro.`;
}

function necessidadePorTras(principal: EstruturaTraco): string {
  if (principal === "esquizoide") {
    return "Por trás da distância costuma haver um desejo simples e profundo: existir por inteiro sem ser invadido, rejeitado ou obrigado a performar presença. Você não busca frieza — busca um espaço em que a alma caiba sem ter de se explicar o tempo todo.";
  }
  if (principal === "oral") {
    return "Por trás da busca pelo outro costuma haver o desejo de ser sustentado de forma constante: sentir que alguém fica, que o colo não some, que você não precisa merecer cuidado produzindo cuidado. Nomear isso não diminui a generosidade — coloca a necessidade no lugar certo.";
  }
  if (principal === "psicopata") {
    return "Por trás do controle costuma haver o desejo de não ser ferido outra vez e de manter dignidade. A força protege uma parte que ainda pergunta: se eu baixar a guarda, quem segura? Integrar não é abandonar o poder — é descobrir que vulnerabilidade escolhida também é poder.";
  }
  if (principal === "masoquista") {
    return "Por trás do aguentar costuma haver o desejo de pertencimento sem crítica: ficar e ser querido sem ter de encolher o próprio desejo. A lealdade é real. O convite é descobrir que você também cabe na conta do cuidado que oferece.";
  }
  return "Por trás da excelência costuma haver o desejo de ser escolhido e amado sem precisar provar. A competência abre portas. O que ainda pede espaço é o direito de ser visto também quando não está entregando a versão impecável.";
}

function quandoOsTresSeEncontram(
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  terciaria: EstruturaTraco,
): string {
  const nomeP = T.NOMES[principal];
  const nomeS = T.NOMES[secundaria];
  const nomeT = T.NOMES[terciaria];
  // Frases curtas e sem listas de vírgulas: o formatador não deve partir este bloco.
  return (
    `Lendo os três juntos: o ${nomeP} conduz em torno de ${FOCO_CURTO[principal]}. ` +
    `O ${nomeS} dá a cor de ${FOCO_CURTO[secundaria]}. ` +
    `O ${nomeT} acrescenta um fio de ${FOCO_CURTO[terciaria]}. ` +
    `O risco do conjunto é ${RISCO_CURTO[principal]} — reforçado pela tendência a ${RISCO_CURTO[secundaria]} ` +
    `e atravessado pelo impulso de ${RISCO_CURTO[terciaria]}. ` +
    `Integração aqui não é apagar nenhum dos três. É deixar o ${nomeP} brilhar sem que os outros trabalhem só como defesa.`
  );
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
  // Sempre a tabela viva: resultados salvos podem carregar exercícios antigos/rasos.
  const recomendacoes = T.RECOMENDACOES[principal];
  const mensagem = T.MENSAGENS[principal];
  const pergunta = T.PERGUNTAS_TRANSFORMACAO[principal];
  // Mapa: só o traço principal — evita misturar Excelência/Organização sem contexto.
  const pontosFortes = T.PONTOS_FORTES[principal];
  const pontosAtencao = T.PONTOS_ATENCAO[principal];
  const significado = significadoMapa(principal, secundaria, terciaria);
  const temSecundario = secundaria !== principal;
  const temTerciarioDistinto = terciaria !== secundaria && terciaria !== principal;

  const trabalho = temSecundario
    ? `${dia.trabalho} ${COR_SECUNDARIA[secundaria].trabalho}`
    : dia.trabalho;
  const relacoes = temSecundario
    ? `${dia.relacoes} ${COR_SECUNDARIA[secundaria].relacoes}`
    : dia.relacoes;
  const decisoes = temTerciarioDistinto
    ? `${dia.decisoes} ${COR_TERCIARIA[terciaria]}`
    : dia.decisoes;

  const etapas: EtapaJornada[] = [
    {
      id: "mapa",
      numero: 1,
      titulo: "Seu mapa de personalidade",
      subtitulo: "Como os cinco traços se organizam em você",
      blocos: limparBlocos([
        blocoTexto(
          "O que os números mostram",
          "Cada percentual diz quanto aquele jeito aparece no seu perfil. Os cinco somam 100%. O maior conduz; o segundo colore o primeiro; o terceiro acrescenta nuance. Os menores não somem: ficam em segundo plano até a vida pedi-los.",
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
        blocoTexto("Como isso pode ter começado", interp[0]),
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
        blocoTexto(
          "A mensagem central",
          "Você não precisa abandonar sua força para cuidar da dor. O mesmo movimento que um dia protegeu também gerou talento. O caminho é usar essa força sem precisar se proteger o tempo todo — e sem confundir excesso com virtude.",
        ),
      ]),
    },
    {
      id: "vida",
      numero: 5,
      titulo: "Como isso aparece na sua vida",
      subtitulo: "Trabalho, relações, decisões e o jeito de se comunicar",
      blocos: limparBlocos([
        blocoTexto("No trabalho", trabalho),
        blocoTexto("Nas relações", relacoes),
        blocoTexto("Nas decisões", decisoes),
        blocoTexto("Sua energia", dia.energia),
        blocoTexto("Quando a pressão sobe", dia.estresse),
        blocoTexto("Como você se comunica", `${estilo.descricao} ${estilo.emConflito}`),
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
        blocoTexto(
          "Lembrete",
          "O que um dia foi proteção pode, sem que você perceba, virar prisão. A sombra não é defeito: é o excesso de uma estratégia que já teve função. Olhar para ela com honestidade é o começo de recuperar escolha.",
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
            : `Principal: ${nomeP}. Também presente: ${nomeS}. Em terceiro: ${nomeT}.`,
        ),
        blocoTexto("Como as duas forças principais se encontram", perfilPar),
        temTerciarioDistinto
          ? blocoTexto("O que o terceiro traço acrescenta", T.TOQUE_TERCIARIO[terciaria])
          : null,
        temTerciarioDistinto
          ? blocoTexto(
              "Quando os três se encontram na vida",
              quandoOsTresSeEncontram(principal, secundaria, terciaria),
            )
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
