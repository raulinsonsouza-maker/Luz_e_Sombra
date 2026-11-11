import { limparJargao } from "@workspace/copy-voz";
import { combinacaoTrioDe, miniBlocoIndividual } from "../combinacoes-trio.js";
import { perfilDe } from "../perfis/index.js";
import type { EstruturaTraco, EstruturasPct } from "../types.js";
import type { BlocoJornada, EtapaJornada, JornadaTraco } from "./tipos.js";

const AVISO =
  "Esta leitura é um caminho de autoconhecimento. Ela se apoia principalmente nas suas respostas. Os percentuais mostram a distribuição relativa entre os cinco padrões observados, não uma porcentagem da sua personalidade nem um diagnóstico. O corpo, quando entra, é apenas apoio cuidadoso.";

const ABERTURA_MAPA =
  "Você é uma combinação de características, experiências e maneiras de enxergar o mundo. Algumas delas aparecem com mais intensidade, enquanto outras se manifestam de maneira mais discreta. Neste mapa, você vai conhecer os cinco padrões observados em suas respostas e descobrir quais deles aparecem com maior destaque. Mais do que identificar um perfil, nossa proposta é compreender como essas características podem se combinar e influenciar a maneira como você pensa, sente, se relaciona e toma decisões.";

const MENSAGEM_RECURSO =
  "Você não precisa abandonar sua força para transformar sua dor. Precisa aprender a utilizar sua força sem precisar se proteger o tempo todo.";

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

function ranking(estruturas: EstruturasPct): Array<[EstruturaTraco, number]> {
  return (Object.entries(estruturas) as Array<[EstruturaTraco, number]>).sort((a, b) => b[1] - a[1]);
}

function significadoMapa(
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  terciaria: EstruturaTraco,
): string {
  const p = perfilDe(principal);
  const s = perfilDe(secundaria);
  const t = perfilDe(terciaria);
  if (principal === secundaria) {
    return `Seu resultado aponta com clareza para o traço ${p.nome}: ${p.identidade.titulo.toLowerCase()}.`;
  }
  let texto = `O traço que mais aparece em você é ${p.nome}: ${p.identidade.titulo.toLowerCase()}. Em seguida vem ${s.nome}.`;
  if (terciaria !== secundaria && terciaria !== principal) {
    texto += ` Em terceiro aparece ${t.nome}, que colore o conjunto sem ocupar o centro.`;
  }
  return texto;
}

export function comporJornadaTraco(resultado: {
  estruturas: EstruturasPct;
  estruturaPrincipal: EstruturaTraco;
  estruturaSecundaria: EstruturaTraco;
  pontosFortes?: string[];
  pontosAtencao?: string[];
}): JornadaTraco {
  const principal = resultado.estruturaPrincipal;
  const secundaria = resultado.estruturaSecundaria;
  const terciaria = estruturaTerciariaDe(resultado.estruturas, principal, secundaria);
  const perfil = perfilDe(principal);
  const perfilS = perfilDe(secundaria);
  const perfilT = perfilDe(terciaria);
  const temSecundario = secundaria !== principal;
  const temTerciario = terciaria !== secundaria && terciaria !== principal;
  const combo = temTerciario ? combinacaoTrioDe(principal, secundaria, terciaria) : null;
  const significado = significadoMapa(principal, secundaria, terciaria);
  const ordenado = ranking(resultado.estruturas);

  const listaCinco = ordenado
    .map(([id, pct], i) => {
      const nome = perfilDe(id).nome;
      const papel =
        i === 0 ? "principal" : i === 1 ? "também presente" : i === 2 ? "em terceiro" : "mais discreto";
      return `${nome} (${pct}%): ${papel}. ${perfilDe(id).identidade.titulo}.`;
    })
    .join(" ");

  const etapas: EtapaJornada[] = [
    {
      id: "mapa",
      numero: 1,
      titulo: "Seu mapa de personalidade",
      subtitulo: "Como os cinco padrões se organizam em você",
      blocos: limparBlocos([
        blocoTexto(undefined, ABERTURA_MAPA),
        blocoTexto(
          "Como ler os percentuais",
          "Os percentuais representam a distribuição relativa entre os cinco padrões observados nas suas respostas (e na fusão com as fotos, quando houver). Não representam porcentagens da sua personalidade, precisão psicológica nem diagnóstico clínico.",
        ),
        blocoTexto("Os cinco padrões no seu mapa", listaCinco),
        blocoTexto("O que isso significa?", significado),
      ]),
    },
    {
      id: "formacao",
      numero: 2,
      titulo: "Como seu padrão se formou",
      subtitulo: "A história emocional que este traço pode carregar",
      blocos: limparBlocos([
        blocoTexto("Em uma frase", `${perfil.identidade.apresentacao} ${perfil.identidade.essencia}`),
        blocoTexto("Fase de desenvolvimento associada", perfil.formacao.faseDesenvolvimento),
        blocoTexto("Experiências possíveis", perfil.formacao.experienciasPossiveis),
        {
          tipo: "lista",
          rotulo: "O que a criança pode ter interpretado",
          itens: perfil.formacao.interpretacoesDaCrianca,
        },
        blocoTexto("Necessidade emocional", perfil.formacao.necessidadeEmocional),
        blocoTexto("Estratégia de proteção", perfil.formacao.estrategiaDeProtecao),
      ]),
    },
    {
      id: "dor",
      numero: 3,
      titulo: "A dor que você aprendeu a proteger",
      subtitulo: "O que esse padrão procura evitar",
      blocos: limparBlocos([
        blocoTexto("Experiência emocional", perfil.dorEmocional.experienciaEmocional),
        blocoTexto("Interpretação interna", perfil.dorEmocional.interpretacaoInterna),
        blocoTexto("Crença protetora", perfil.dorEmocional.crencaProtetora),
        blocoTexto("O que esse padrão tenta evitar", perfil.dorEmocional.oQueTentaEvitar),
        blocoTexto("A necessidade que permanece", perfil.dorEmocional.necessidadePorTrasDoPadrao),
        blocoTexto("Como pode aparecer na vida adulta", perfil.dorEmocional.manifestacaoNaVidaAdulta),
      ]),
    },
    {
      id: "recurso",
      numero: 4,
      titulo: "A inteligência da proteção: seu recurso",
      subtitulo: "O talento que nasceu do mesmo movimento",
      blocos: limparBlocos([
        blocoTexto("Talento natural", perfil.inteligenciaProtecao.talentoNatural),
        blocoTexto("Recurso desenvolvido", perfil.inteligenciaProtecao.recursoDesenvolvido),
        blocoTexto("Potencial de expansão", perfil.inteligenciaProtecao.potencialDeExpansao),
        {
          tipo: "tabela",
          rotulo: "Quando equilibra, quando exagera e para onde pode expandir",
          cabecalhos: ["Recurso", "Quando está equilibrado", "Quando está em excesso", "Potencial de expansão"],
          linhas: perfil.inteligenciaProtecao.recursos.map((r) => [
            r.nome,
            r.equilibrio,
            r.excesso,
            r.expansao,
          ]),
        },
        { tipo: "destaque", rotulo: "Mensagem central", texto: MENSAGEM_RECURSO },
      ]),
    },
    {
      id: "vida",
      numero: 5,
      titulo: "Como isso aparece na sua vida",
      subtitulo: "Trabalho, amor, família, comunicação, decisões e relação consigo",
      blocos: limparBlocos([
        {
          tipo: "cena",
          rotulo: "Trabalho e realização",
          ...perfil.manifestacoes.trabalho,
        },
        {
          tipo: "cena",
          rotulo: "Amor e relacionamentos",
          ...perfil.manifestacoes.amor,
        },
        {
          tipo: "cena",
          rotulo: "Família e convivência",
          ...perfil.manifestacoes.familia,
        },
        {
          tipo: "cena",
          rotulo: "Comunicação",
          ...perfil.manifestacoes.comunicacao,
        },
        {
          tipo: "cena",
          rotulo: "Decisões e emoções",
          ...perfil.manifestacoes.decisoesEmocoes,
        },
        {
          tipo: "cena",
          rotulo: "Relação consigo",
          ...perfil.manifestacoes.relacaoConsigo,
        },
        temSecundario
          ? blocoTexto(
              "Um toque do segundo traço",
              `Com ${perfilS.nome} também presente, essa dinâmica ganha a cor de ${perfilS.identidade.titulo.toLowerCase()}. ${perfilS.formacao.necessidadeEmocional}`,
            )
          : null,
      ]),
    },
    {
      id: "sombra",
      numero: 6,
      titulo: "Sua sombra: quando a proteção começa a limitar",
      subtitulo: "A intenção boa e o efeito que cansa",
      blocos: limparBlocos([
        {
          tipo: "tabela",
          rotulo: "Você tenta… e pode acabar…",
          cabecalhos: ["Você tenta", "Mas pode acabar"],
          linhas: perfil.sombra.pares,
        },
        blocoTexto("O desafio", perfil.sombra.desafio),
        { tipo: "destaque", rotulo: "Lembrete", texto: prosa(perfil.sombra.fraseCentral) },
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
          temSecundario
            ? `Principal: ${perfil.nome}. Também presente: ${perfilS.nome}.${temTerciario ? ` Em terceiro: ${perfilT.nome}.` : ""}`
            : `O traço ${perfil.nome} aparece com bastante clareza no seu perfil.`,
        ),
        temSecundario ? blocoTexto(`O que ${perfil.nome} acrescenta`, miniBlocoIndividual(principal)) : null,
        temSecundario ? blocoTexto(`O que ${perfilS.nome} acrescenta`, miniBlocoIndividual(secundaria)) : null,
        temTerciario ? blocoTexto(`O que ${perfilT.nome} acrescenta`, miniBlocoIndividual(terciaria)) : null,
        combo ? blocoTexto(combo.titulo, combo.abertura) : null,
        combo ? blocoTexto("O que cada traço acrescenta", combo.oQueCadaAcrescenta) : null,
        combo ? blocoTexto("O que existe em comum", combo.emComum) : null,
        combo ? blocoTexto("Onde podem surgir tensões", combo.tensoes) : null,
        combo ? blocoTexto("Como os três podem aparecer juntos", combo.comoAparecemJuntos) : null,
        combo ? blocoTexto("Como essa combinação pode aparecer na vida", combo.comoApareceNaVida) : null,
        combo
          ? {
              tipo: "lista",
              rotulo: "Recursos da combinação",
              itens: combo.recursosDaCombinacao,
            }
          : null,
        combo ? blocoTexto("Ponto de atenção", combo.pontoDeAtencao) : null,
        combo ? blocoTexto("Caminho de integração do trio", combo.caminhoIntegracao) : null,
        combo ? { tipo: "destaque", rotulo: "Para pensar sobre a combinação", texto: prosa(combo.pergunta) } : null,
        !combo && temSecundario
          ? blocoTexto(
              "Como as duas forças se encontram",
              `A combinação de ${perfil.nome} com ${perfilS.nome} cria um perfil próprio. Observe como a necessidade de ${perfil.formacao.necessidadeEmocional.toLowerCase()} conversa com ${perfilS.formacao.necessidadeEmocional.toLowerCase()}.`,
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
        blocoTexto("O que precisa aprender a reconhecer", perfil.integracao.reconhecer),
        blocoTexto("O que pode flexibilizar", perfil.integracao.flexibilizar),
        blocoTexto("O que pode desenvolver", perfil.integracao.desenvolver),
        {
          tipo: "tabela",
          rotulo: "Deixar de viver só assim · Aprender a experimentar",
          cabecalhos: ["Deixar de viver só assim", "Aprender a experimentar"],
          linhas: perfil.integracao.deixarAprender,
        },
        {
          tipo: "passos",
          rotulo: "Exercícios para esta semana",
          itens: perfil.integracao.exercicios.map((e) => `${e.titulo}: ${e.descricao}`),
        },
      ]),
    },
    {
      id: "luz",
      numero: 9,
      titulo: "Da sombra à luz",
      subtitulo: "Reconhecimento e um próximo passo",
      blocos: limparBlocos([
        { tipo: "destaque", rotulo: "Para levar com você", texto: prosa(perfil.reflexaoFinal.mensagem) },
        blocoTexto(
          undefined,
          "Da sombra à luz não significa abandonar quem você é. Significa reconhecer aquilo que aprendeu a fazer para se proteger e descobrir que, a partir da consciência, você pode escolher caminhos diferentes.",
        ),
        { tipo: "destaque", rotulo: "Para pensar", texto: prosa(perfil.reflexaoFinal.pergunta) },
      ]),
    },
  ];

  return {
    aviso: AVISO,
    mapa: {
      principal,
      secundaria,
      terciaria,
      nomePrincipal: perfil.nome,
      nomeSecundaria: perfilS.nome,
      nomeTerciaria: perfilT.nome,
      percentuais: resultado.estruturas,
      pontosFortes: perfil.pontosFortes,
      pontosAtencao: perfil.pontosAtencao,
      significado,
    },
    etapas,
  };
}

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
        for (const linha of bloco.linhas) out.push(...linha);
      }
      if (bloco.tipo === "cena") {
        out.push(bloco.oQue, bloco.reacao, bloco.protege, bloco.consequencia);
      }
    }
  }
  return out.map((p) => p.trim()).filter(Boolean);
}
