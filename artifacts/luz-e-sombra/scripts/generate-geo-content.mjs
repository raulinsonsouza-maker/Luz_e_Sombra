import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dirA = path.join(root, "content/analises");
const dirArt = path.join(root, "content/artigos");
fs.mkdirSync(dirA, { recursive: true });
fs.mkdirSync(dirArt, { recursive: true });

const UPDATED = "2026-03-26";

function writeTs(file, exportName, obj) {
  const body = `import type { ${exportName === "ARTICLES" ? "ArticleContent" : "AnalysisPageContent"} } from "../types";\n\nexport const ${exportName} = ${JSON.stringify(obj, null, 2)} as const satisfies ${exportName === "ARTICLES" ? "ArticleContent[]" : "AnalysisPageContent"};\n`;
  fs.writeFileSync(file, body, "utf8");
}

const analyses = [
  {
    slug: "tracos-de-carater",
    path: "/analises/tracos-de-carater",
    title: "Traços de caráter e linguagem corporal",
    description:
      "O que são os cinco traços de caráter na abordagem corporal do Portal Iluminando, como funciona a análise e quais são seus limites.",
    h1: "Traços de caráter e linguagem corporal",
    directAnswer:
      "No Portal Iluminando, a análise de traços de caráter observa padrões emocionais e comportamentais a partir de fotografias do corpo e de um questionário, oferecendo uma leitura interpretativa — não um diagnóstico clínico.",
    definition:
      "Os traços de caráter, nesta abordagem, são padrões de funcionamento emocional e comportamental que se formam ao longo da vida e podem aparecer na postura, na expressão e nas reações do dia a dia. A leitura corporal é usada como pista complementar às suas respostas, nunca como exame médico.",
    sections: [
      {
        heading: "O que a abordagem procura observar",
        body: [
          "A análise cruza duas fontes: imagens seguindo orientações simples e respostas sobre como você tem se sentido e reagido.",
          "O objetivo é ampliar consciência sobre padrões de proteção, tensão e potencial — não rotular você de forma fixa.",
        ],
      },
      {
        heading: "Por que isso importa no autoconhecimento",
        body: [
          "Muitas pessoas só olham para pensamentos. Incluir o corpo ajuda a notar o que a mente racionaliza ou evita.",
          "Quando o resultado conversa com sua vivência, ele vira mapa de reflexão, não sentença.",
        ],
      },
    ],
    methodology: [
      "Fotografias orientadas + questionário emocional/comportamental.",
      "Cruzamento multimídia interno do Portal para destacar traços com maior intensidade relativa.",
      "Narrativa em linguagem acessível, com ênfase em padrões e possibilidades.",
    ],
    howItWorks: [
      "Você acessa o módulo na Jornada Da Sombra à Luz (área logada).",
      "Segue as orientações de fotos e responde ao questionário com sinceridade.",
      "Recebe a leitura organizada para consultar depois, no seu ritmo.",
    ],
    discoveries: [
      "Quais traços aparecem com mais força nas suas respostas e imagens.",
      "Como padrões de proteção podem aparecer no cotidiano.",
      "Pistas para observar comportamento sem se reduzir a um único rótulo.",
    ],
    examples: [
      "Alguém que se descreve sempre 'no controle' pode notar, na leitura, um padrão de contenção que também aparece na postura.",
      "Outra pessoa reconhece um traço ligado a busca de aprovação e conecta isso a relações de trabalho.",
    ],
    limitations: [
      "Não é diagnóstico clínico, avaliação médica nem psicoterapia.",
      "Não substitui acompanhamento profissional de saúde mental.",
      "Imagens e respostas são interpretações contextuais; resultados podem mudar com o tempo e com novas informações.",
      "Referências históricas de modelos corporais (quando mencionadas internamente) não transformam a ferramenta em ciência comprovada.",
    ],
    faq: [
      {
        q: "Preciso de equipamento especial?",
        a: "Não. O importante é seguir as orientações de enquadramento em um ambiente tranquilo.",
      },
      {
        q: "A análise substitui terapia?",
        a: "Não. Ela é uma ferramenta de reflexão dentro do Portal, complementar a qualquer acompanhamento profissional.",
      },
    ],
    relatedPaths: [
      { href: "/analises/temperamento", label: "Temperamento" },
      { href: "/analises/dossie-de-vida", label: "Dossiê de Vida" },
      { href: "/blog/o-que-sao-os-cinco-tracos-de-carater", label: "Artigo: cinco traços" },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "temperamento",
    path: "/analises/temperamento",
    title: "Temperamento",
    description:
      "Os quatro temperamentos clássicos no Portal Iluminando: o que a análise revela, como funciona e o que ela não pretende ser.",
    h1: "Temperamento: quatro tendências de funcionamento",
    directAnswer:
      "A análise de temperamento do Portal Iluminando usa um questionário curto para indicar tendências entre Colérico, Sanguíneo, Melancólico e Fleumático — um mapa interpretativo de estilo de reação, não um exame psicológico oficial.",
    definition:
      "Temperamento, aqui, é um conjunto de tendências de energia, expressão emocional e modo de reagir. Os quatro temperamentos clássicos servem como linguagem compartilhada para observar diferenças, sem afirmar que a personalidade se resume a um tipo.",
    sections: [
      {
        heading: "Diferença entre temperamento e personalidade",
        body: [
          "Personalidade é mais ampla: inclui história, valores, aprendizados e contexto.",
          "Temperamento destaca tendências relativamente estáveis de ritmo e reação — um recorte útil, não o retrato inteiro.",
        ],
      },
      {
        heading: "Os quatro temperamentos no Portal",
        body: [
          "Colérico, Sanguíneo, Melancólico e Fleumático aparecem com intensidades relativas nas suas respostas.",
          "O perfil ajuda a conversar sobre energia social, estabilidade e expressão emocional no dia a dia.",
        ],
      },
    ],
    methodology: [
      "Questionário com afirmações Sim/Não (cerca de 16 itens).",
      "Respostas pensadas para o 'na maior parte do tempo', não só o humor do dia.",
      "Mapa de temperamento predominante e tendências associadas.",
    ],
    howItWorks: [
      "Abra o módulo Temperamento na jornada (área logada).",
      "Responda com sinceridade em poucos minutos.",
      "Consulte o perfil e use-o como ponto de partida para reflexão.",
    ],
    discoveries: [
      "Qual temperamento aparece com maior intensidade.",
      "Como sua energia social e emocional tendem a se organizar.",
      "Pistas para relações, trabalho e autoconhecimento cotidiano.",
    ],
    examples: [
      "Uma pessoa Sanguínea pode reconhecer facilidade social e também dispersão.",
      "Alguém Melancólico pode validar profundidade emocional e tendência à cobrança interna.",
    ],
    limitations: [
      "Modelo clássico interpretativo; não é tipagem científica consensual contemporânea.",
      "Não diagnostica transtornos nem define capacidade profissional.",
      "Perfis mistos são comuns; evite se prender a um único adjetivo.",
    ],
    faq: [
      {
        q: "Posso refazer o questionário?",
        a: "Sim. O Portal permite nova análise; o mais útil é observar o que permanece e o que muda.",
      },
      {
        q: "Temperamento muda?",
        a: "Tendências costumam ser relativamente estáveis, mas expressão e contexto mudam. Use o resultado como hipótese viva.",
      },
    ],
    relatedPaths: [
      { href: "/analises/tracos-de-carater", label: "Traços de caráter" },
      { href: "/analises/linguagens-do-amor", label: "Linguagens do amor" },
      { href: "/blog/diferenca-entre-personalidade-e-temperamento", label: "Artigo: personalidade x temperamento" },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "linguagens-do-amor",
    path: "/analises/linguagens-do-amor",
    title: "Linguagens do amor",
    description:
      "As cinco linguagens do amor como ferramenta de autoconhecimento relacional no Portal Iluminando.",
    h1: "Linguagens do amor no Portal Iluminando",
    directAnswer:
      "A análise das cinco linguagens do amor no Portal ajuda você a perceber como prefere receber carinho e como costuma demonstrá-lo — um modelo interpretativo de relacionamentos, não uma medida científica do amor.",
    definition:
      "As linguagens do amor descrevem formas frequentes de expressar e perceber afeto (palavras, tempo, presentes, atos de serviço e toque). No Portal, você responde escolhas que exploram receber e expressar — que nem sempre coincidem.",
    sections: [
      {
        heading: "Receber e expressar podem ser diferentes",
        body: [
          "Muita gente demonstra amor de um jeito e espera recebê-lo de outro.",
          "Reconhecer essa diferença reduz frustração e melhora conversas sobre necessidade afetiva.",
        ],
      },
      {
        heading: "Uso saudável do modelo",
        body: [
          "Trate o resultado como vocabulário compartilhado, não como regra rígida.",
          "Nenhuma linguagem é superior; o valor está no diálogo e na observação.",
        ],
      },
    ],
    methodology: [
      "Conjunto de escolhas entre pares de preferências.",
      "Dimensões separadas: receber e expressar.",
      "Perfil guardado para consulta na jornada.",
    ],
    howItWorks: [
      "Acesse Linguagens do Amor na área logada.",
      "Responda pensando no que realmente faz sentido para você.",
      "Leia o perfil e leve insights para relações reais com respeito mútuo.",
    ],
    discoveries: [
      "Quais formas de carinho mais te alimentam.",
      "Como você tende a demonstrar afeto.",
      "Onde há desalinhamento entre expectativa e expressão.",
    ],
    examples: [
      "Quem prioriza palavras pode sofrer com parceiros que só ajudam em tarefas — e vice-versa.",
      "Alguém que expressa por atos de serviço pode descobrir que precisa pedir mais tempo de qualidade.",
    ],
    limitations: [
      "Modelo popular de autoconhecimento relacional; não prova científica definitiva sobre o amor.",
      "Não diagnostica incompatibilidade nem justifica abuso ou negligência.",
      "Cultura, gênero e história pessoal influenciam como o afeto aparece.",
    ],
    faq: [
      {
        q: "Serve só para casais?",
        a: "Não. Família, amizades e até ambientes de trabalho se beneficiam de clareza sobre reconhecimento e cuidado.",
      },
      {
        q: "E se eu empatar em várias linguagens?",
        a: "É comum. Observe situações recentes e converse; o empate já é informação.",
      },
    ],
    relatedPaths: [
      { href: "/autoconhecimento-e-relacionamentos", label: "Autoconhecimento e relacionamentos" },
      { href: "/blog/quais-sao-as-cinco-linguagens-do-amor", label: "Artigo: cinco linguagens" },
      { href: "/analises/dossie-de-vida", label: "Dossiê de Vida" },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "roda-da-vida",
    path: "/analises/roda-da-vida",
    title: "Roda da Vida",
    description:
      "O que é a Roda da Vida, como avaliar 12 áreas da vida e como o Portal Iluminando usa essa ferramenta.",
    h1: "Roda da Vida: um mapa de satisfação atual",
    directAnswer:
      "A Roda da Vida no Portal Iluminando é uma autoavaliação de 12 áreas importantes da vida, com notas de 1 a 10, para visualizar equilíbrio, prioridades e pontos de atenção — um autorretrato do momento, não um veredito definitivo.",
    definition:
      "A Roda da Vida é uma ferramenta visual de autoconhecimento: você avalia dimensões como saúde, carreira, finanças, relacionamentos, família, lazer e crescimento. O desenho final mostra onde há satisfação e onde falta cuidado.",
    sections: [
      {
        heading: "Por que notas subjetivas ajudam",
        body: [
          "Não existem notas certas. O valor está na honestidade sobre como você se sente agora.",
          "Repetir a roda ao longo do tempo transforma percepção em acompanhamento.",
        ],
      },
      {
        heading: "Do mapa à ação",
        body: [
          "Depois de ver o desenho, escolha uma ou duas áreas para atenção prática.",
          "No Portal, a roda conversa com outras análises e com a reflexão diária.",
        ],
      },
    ],
    methodology: [
      "Autoavaliação em 12 áreas com escala 1–10.",
      "Mapa visual das respostas.",
      "Possibilidade de novas avaliações para acompanhar mudanças.",
    ],
    howItWorks: [
      "Entre no módulo Roda da Vida na jornada.",
      "Avalie cada área com sinceridade.",
      "Observe o mapa e registre o que merece atenção agora.",
    ],
    discoveries: [
      "Quais áreas estão mais satisfatórias.",
      "Onde a energia está concentrada ou em falta.",
      "Prioridades concretas para o próximo ciclo.",
    ],
    examples: [
      "Carreira alta e lazer baixo pode explicar cansaço mesmo com 'sucesso'.",
      "Relacionamentos baixos com autoconhecimento alto convidam a práticas de conexão.",
    ],
    limitations: [
      "É percepção subjetiva; não mede desempenho objetivo externo.",
      "Humor do dia pode enviesar notas — use séries ao longo do tempo.",
      "Não substitui aconselhamento financeiro, jurídico ou clínico.",
    ],
    faq: [
      {
        q: "Quantas áreas existem no Portal?",
        a: "A análise trabalha com 12 áreas importantes da vida, cobrindo saúde, vínculos, trabalho, recursos e crescimento.",
      },
      {
        q: "Devo refazer com que frequência?",
        a: "Quando houver mudança relevante de fase, ou em intervalos regulares (por exemplo mensal) se quiser acompanhar evolução.",
      },
    ],
    relatedPaths: [
      { href: "/blog/o-que-e-a-roda-da-vida", label: "Artigo: o que é a Roda da Vida" },
      { href: "/analises/reflexao-diaria", label: "Reflexão diária" },
      { href: "/desenvolvimento-pessoal", label: "Desenvolvimento pessoal" },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "numerologia",
    path: "/analises/numerologia",
    title: "Numerologia e mapa numerológico",
    description:
      "O que é numerologia no Portal Iluminando: mapa simbólico a partir do nome e da data de nascimento, com limites claros.",
    h1: "Numerologia no Portal Iluminando",
    directAnswer:
      "No Portal, a numerologia é uma leitura simbólica a partir do nome e da data de nascimento (Caminho de Vida, Expressão, Alma, Personalidade e triângulo numerológico). É autoconhecimento interpretativo — não ciência comprovada nem previsão determinista.",
    definition:
      "A numerologia atribui significados simbólicos a números derivados de dados pessoais. No Portal Iluminando, o mapa organiza esses números em uma narrativa de reflexão sobre trajetória, talentos e desejos.",
    sections: [
      {
        heading: "O que o mapa costuma reunir",
        body: [
          "Caminho de Vida, Expressão, Alma e Personalidade são eixos comuns da leitura oferecida.",
          "O objetivo é oferecer vocabulário simbólico para pensar sua história — não prever eventos.",
        ],
      },
      {
        heading: "Como usar com maturidade",
        body: [
          "Trate cada número como metáfora e pergunta, não como destino.",
          "Combine com temperamento, traços e roda para uma visão mais rica e menos dogmática.",
        ],
      },
    ],
    methodology: [
      "Cálculos a partir de data de nascimento e nome cadastrados.",
      "Interpretações simbólicas organizadas em mapa consultável.",
      "Integração posterior no Dossiê de Vida com outras análises.",
    ],
    howItWorks: [
      "Confirme seus dados no perfil.",
      "Abra o módulo de Numerologia na jornada.",
      "Leia o mapa e anote o que ressoa — e o que não ressoa.",
    ],
    discoveries: [
      "Símbolos associados à sua trajetória e expressão.",
      "Temas recorrentes para reflexão pessoal.",
      "Linguagem para dialogar com outras peças do Portal.",
    ],
    examples: [
      "Alguém pode usar o Caminho de Vida como pergunta sobre propósito, sem aceitar como sentença.",
      "Outra pessoa cruza Expressão com linguagens do amor para pensar comunicação.",
    ],
    limitations: [
      "Não é ciência comprovada nem método de previsão do futuro.",
      "Não substitui decisões médicas, financeiras ou jurídicas.",
      "Erros de grafia no nome ou data alteram o mapa — dados corretos importam.",
    ],
    faq: [
      {
        q: "Numerologia é religião?",
        a: "No Portal ela é apresentada como ferramenta simbólica de autoconhecimento, sem exigir crença religiosa.",
      },
      {
        q: "Preciso 'acreditar' para usar?",
        a: "Não. Você pode usar como exercício de reflexão e descartar o que não fizer sentido.",
      },
    ],
    relatedPaths: [
      { href: "/analises/ciclos-numerologicos", label: "Ciclos numerológicos" },
      { href: "/analises/numerologia-diaria", label: "Numerologia diária" },
      { href: "/blog/o-que-e-numerologia", label: "Artigo: o que é numerologia" },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "ciclos-numerologicos",
    path: "/analises/ciclos-numerologicos",
    title: "Ciclos numerológicos",
    description:
      "Ano pessoal e ciclos mensais na leitura numerológica do Portal Iluminando — abordagem simbólica, não científica.",
    h1: "Ciclos numerológicos: ano pessoal e movimentos do tempo",
    directAnswer:
      "Os ciclos numerológicos no Portal descrevem simbolicamente fases como Ano Pessoal e movimentos mensais, ajudando a refletir sobre ritmo e foco — sem garantir eventos futuros.",
    definition:
      "Ciclos numerológicos são leituras simbólicas do tempo pessoal a partir da data de nascimento. O Ano Pessoal, por exemplo, costuma ser pensado a partir do aniversário, não necessariamente do calendário civil de 1º de janeiro.",
    sections: [
      {
        heading: "Para que serve um ciclo simbólico",
        body: [
          "Serve para organizar atenção: o que cultivar, o que soltar, o que observar.",
          "Não serve para justificar passividade ou medo ('o ano manda').",
        ],
      },
      {
        heading: "Como o Portal apresenta ciclos",
        body: [
          "Você encontra leituras de anos e movimentos associados ao seu mapa.",
          "A proposta é acompanhar trajetória com linguagem simbólica alinhada ao restante da jornada.",
        ],
      },
    ],
    methodology: [
      "Cálculos derivados da data de nascimento e contexto do mapa.",
      "Textos interpretativos por ciclo.",
      "Uso combinado com reflexão diária e missões.",
    ],
    howItWorks: [
      "Com o mapa numerológico disponível, explore a seção de ciclos.",
      "Leia o Ano Pessoal e os movimentos destacados.",
      "Traduza insights em perguntas práticas para a semana.",
    ],
    discoveries: [
      "Temas simbólicos do período atual.",
      "Comparação com anos anteriores e o próximo ciclo.",
      "Âncoras para planejamento pessoal consciente.",
    ],
    examples: [
      "Em um ciclo descrito como mais introspectivo, alguém prioriza descanso e revisão de metas.",
      "Em ciclo de expansão simbólica, outra pessoa testa projetos com cautela e registro.",
    ],
    limitations: [
      "Leitura simbólica; não prevê acontecimentos concretos.",
      "Não deve ser usada para decisões de risco sem análise racional própria.",
      "Calendários pessoais e culturais variam — trate como modelo, não lei.",
    ],
    faq: [
      {
        q: "Ano Pessoal começa quando?",
        a: "Na abordagem do Portal, o Ano Pessoal é pensado a partir do aniversário, alinhado à sua data de nascimento.",
      },
      {
        q: "E se o texto não combinar com minha vida?",
        a: "Descarte ou reinterprete. O critério final é a sua experiência.",
      },
    ],
    relatedPaths: [
      { href: "/analises/numerologia", label: "Mapa numerológico" },
      { href: "/blog/como-funcionam-os-ciclos-numerologicos", label: "Artigo: ciclos" },
      { href: "/analises/numerologia-diaria", label: "Numerologia diária" },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "numerologia-diaria",
    path: "/analises/numerologia-diaria",
    title: "Numerologia diária",
    description:
      "Como funciona a numerologia diária no Portal Iluminando: significados simbólicos do dia e reflexões práticas.",
    h1: "Numerologia diária: um convite simbólico ao dia",
    directAnswer:
      "A numerologia diária do Portal oferece significados simbólicos e reflexões para o dia — um estímulo de consciência, não um horóscopo determinista nem previsão científica.",
    definition:
      "A numerologia diária traduz a data em um tema simbólico e propõe perguntas ou imagens para orientar atenção. No Portal, ela convive com frases, reflexões e acompanhamento do momento.",
    sections: [
      {
        heading: "Como usar de manhã sem superstição",
        body: [
          "Leia o tema do dia como pergunta: 'onde isso aparece na minha agenda real?'.",
          "Se não ressoar, siga em frente — a ferramenta é opcional.",
        ],
      },
      {
        heading: "Integração com a experiência diária",
        body: [
          "A numerologia diária dialoga com o espaço de reflexão e registro emocional.",
          "Juntas, ajudam a criar hábito de presença, não dependência de sinais.",
        ],
      },
    ],
    methodology: [
      "Cálculo simbólico associado à data.",
      "Textos e reflexões apresentados na experiência do Portal.",
      "Opcionalmente cruzados com seu mapa pessoal.",
    ],
    howItWorks: [
      "No ambiente logado, abra a experiência do dia.",
      "Leia o tema simbólico e a reflexão proposta.",
      "Registre, se quiser, o que fez sentido na prática.",
    ],
    discoveries: [
      "Um foco simbólico para o dia.",
      "Perguntas curtas que abrem consciência.",
      "Continuidade quando usada com o diário de reflexão.",
    ],
    examples: [
      "Tema de 'escuta' leva alguém a reduzir reuniões e ouvir um amigo com atenção.",
      "Tema de 'limpeza' inspira organizar uma gaveta e uma pendência emocional.",
    ],
    limitations: [
      "Não prevê sorte, azar ou eventos.",
      "Não deve guiar decisões médicas ou financeiras.",
      "É estímulo reflexivo; a responsabilidade das escolhas continua sua.",
    ],
    faq: [
      {
        q: "É a mesma coisa que horóscopo?",
        a: "Não exatamente. Aqui o foco é reflexão simbólica ligada a números e datas, sem pretensão de previsão astral científica.",
      },
      {
        q: "Posso ignorar alguns dias?",
        a: "Sim. A ferramenta existe para servir, não para cobrar.",
      },
    ],
    relatedPaths: [
      { href: "/analises/reflexao-diaria", label: "Reflexão diária" },
      { href: "/analises/ciclos-numerologicos", label: "Ciclos" },
      { href: "/blog/o-que-significa-numerologia-diaria", label: "Artigo: numerologia diária" },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "reflexao-diaria",
    path: "/analises/reflexao-diaria",
    title: "Reflexão diária e experiência do dia",
    description:
      "Espaço de reflexão diária no Portal Iluminando: desacelerar, registrar emoções e transformar insight em hábito.",
    h1: "Reflexão diária: presença que vira hábito",
    directAnswer:
      "A experiência diária do Portal Iluminando é um espaço para desacelerar, reconhecer emoções, refletir e registrar o momento presente — a ponte entre análise pontual e prática contínua.",
    definition:
      "Reflexão diária, no Portal, combina estímulos (frases, convites, numerologia simbólica) com registro pessoal. O foco é consciência e continuidade, não performance.",
    sections: [
      {
        heading: "Por que o diário importa mais que o insight isolado",
        body: [
          "Análises abrem mapa; o diário ensina a caminhar nele.",
          "Pequenos registros honestos superam grandes planos abandonados.",
        ],
      },
      {
        heading: "Do sentimento à escolha",
        body: [
          "Nomear emoção reduz confusão e impulsividade.",
          "Missões e convites do Portal ajudam a transformar percepção em gesto concreto.",
        ],
      },
    ],
    methodology: [
      "Conteúdo diário e convites de reflexão.",
      "Espaço de registro emocional e textual.",
      "Integração com acompanhamento e frases guardadas.",
    ],
    howItWorks: [
      "Acesse a área de reflexão no ambiente logado.",
      "Leia o estímulo do dia e responda com sinceridade.",
      "Guarde o que quiser revisitar; volte amanhã sem cobrança excessiva.",
    ],
    discoveries: [
      "Padrões emocionais que se repetem na semana.",
      "Gatilhos e recursos pessoais.",
      "Senso de continuidade na jornada.",
    ],
    examples: [
      "Alguém nota irritação recorrente às segundas e ajusta rotina de sono.",
      "Outra pessoa usa o registro para preparar uma conversa difícil com mais clareza.",
    ],
    limitations: [
      "Não substitui psicoterapia ou atendimento de crise.",
      "Registros são pessoais — trate-os com privacidade.",
      "Consistência ajuda, mas dias sem registro não são fracasso moral.",
    ],
    faq: [
      {
        q: "Quanto tempo leva por dia?",
        a: "Pode ser poucos minutos. O valor está na honestidade, não na extensão.",
      },
      {
        q: "Outras pessoas veem minhas reflexões?",
        a: "Registros pessoais são tratados como privados no Portal, conforme a política de proteção de dados.",
      },
    ],
    relatedPaths: [
      { href: "/blog/como-manter-um-diario-de-autoconhecimento", label: "Artigo: diário" },
      { href: "/analises/dossie-de-vida", label: "Dossiê de Vida" },
      { href: "/desenvolvimento-pessoal", label: "Desenvolvimento pessoal" },
    ],
    updatedAt: UPDATED,
  },
  {
    slug: "dossie-de-vida",
    path: "/analises/dossie-de-vida",
    title: "Dossiê de Vida",
    description:
      "O Dossiê de Vida integra as análises do Portal Iluminando em uma síntese pessoal de características e padrões.",
    h1: "Dossiê de Vida: a síntese da jornada",
    directAnswer:
      "O Dossiê de Vida é a síntese integrada das suas análises no Portal Iluminando — uma visão ampliada de características, padrões e possibilidades, gerada a partir do que você já percorreu na jornada.",
    definition:
      "Em vez de olhares isolados, o dossiê conecta traço, temperamento, linguagens do amor, roda, numerologia e elementos emocionais disponíveis, oferecendo um panorama pessoal para consulta e reflexão.",
    sections: [
      {
        heading: "Por que integração importa",
        body: [
          "Uma análise isolada pode distorcer. Cruzar lentes reduz extremos e revela coerências.",
          "O dossiê responde, na prática, à pergunta da marca: quem eu sou e o que faço com isso?",
        ],
      },
      {
        heading: "Como ler sem se engessar",
        body: [
          "Use o dossiê como mapa vivo: destaque o que ressoa e questione o que não.",
          "Volte após novas análises ou fases de vida — síntese muda quando as partes mudam.",
        ],
      },
    ],
    methodology: [
      "Agregação das análises concluídas na conta.",
      "Narrativa integrada de padrões e potenciais.",
      "Disponibilidade para consulta no ambiente logado.",
    ],
    howItWorks: [
      "Percorra as etapas da Jornada Da Sombra à Luz.",
      "Quando houver base suficiente, abra o Dossiê de Vida.",
      "Leia a síntese e escolha um foco prático para o período.",
    ],
    discoveries: [
      "Temas que se repetem em várias análises.",
      "Contrastes úteis (por exemplo, expressão afetiva x avaliação da roda).",
      "Direção mais clara para missões e reflexão diária.",
    ],
    examples: [
      "Alguém vê o mesmo padrão de contenção no traço e na roda de relacionamentos.",
      "Outra pessoa usa o dossiê para alinhar carreira (roda) com temperamento e expressão.",
    ],
    limitations: [
      "A qualidade depende das análises e dados informados.",
      "Não é laudo clínico nem avaliação oficial de personalidade.",
      "Síntese interpretativa — não captura a totalidade de uma pessoa.",
    ],
    faq: [
      {
        q: "Preciso terminar tudo para ter o dossiê?",
        a: "Quanto mais etapas concluídas, mais rica a síntese. O Portal orienta o caminho na jornada.",
      },
      {
        q: "Posso compartilhar o dossiê?",
        a: "É conteúdo pessoal. Compartilhe só se fizer sentido para você e com quem você confia.",
      },
    ],
    relatedPaths: [
      { href: "/jornada-da-sombra-a-luz", label: "Jornada Da Sombra à Luz" },
      { href: "/blog/o-que-e-um-dossie-de-vida", label: "Artigo: dossiê" },
      { href: "/analises", label: "Todas as análises" },
    ],
    updatedAt: UPDATED,
  },
];

for (const a of analyses) {
  const exportName = a.slug
    .split("-")
    .map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1)))
    .join("")
    .replace(/^(.)/, (m) => m.toUpperCase())
    .replace(/-/g, "");
  // simpler export names
  const names = {
    "tracos-de-carater": "ANALISE_TRACOS",
    temperamento: "ANALISE_TEMPERAMENTO",
    "linguagens-do-amor": "ANALISE_LINGUAGENS",
    "roda-da-vida": "ANALISE_RODA",
    numerologia: "ANALISE_NUMEROLOGIA",
    "ciclos-numerologicos": "ANALISE_CICLOS",
    "numerologia-diaria": "ANALISE_NUM_DIARIA",
    "reflexao-diaria": "ANALISE_REFLEXAO",
    "dossie-de-vida": "ANALISE_DOSSIE",
  };
  const en = names[a.slug];
  const file = path.join(dirA, `${a.slug}.ts`);
  fs.writeFileSync(
    file,
    `import type { AnalysisPageContent } from "../types";\n\nexport const ${en} = ${JSON.stringify(a, null, 2)} satisfies AnalysisPageContent;\n`,
    "utf8",
  );
}

fs.writeFileSync(
  path.join(dirA, "index.ts"),
  `import type { AnalysisPageContent } from "../types";
import { ANALISE_TRACOS } from "./tracos-de-carater";
import { ANALISE_TEMPERAMENTO } from "./temperamento";
import { ANALISE_LINGUAGENS } from "./linguagens-do-amor";
import { ANALISE_RODA } from "./roda-da-vida";
import { ANALISE_NUMEROLOGIA } from "./numerologia";
import { ANALISE_CICLOS } from "./ciclos-numerologicos";
import { ANALISE_NUM_DIARIA } from "./numerologia-diaria";
import { ANALISE_REFLEXAO } from "./reflexao-diaria";
import { ANALISE_DOSSIE } from "./dossie-de-vida";

export const ANALISES: AnalysisPageContent[] = [
  ANALISE_TRACOS,
  ANALISE_TEMPERAMENTO,
  ANALISE_LINGUAGENS,
  ANALISE_RODA,
  ANALISE_NUMEROLOGIA,
  ANALISE_CICLOS,
  ANALISE_NUM_DIARIA,
  ANALISE_REFLEXAO,
  ANALISE_DOSSIE,
];

export function getAnaliseBySlug(slug: string) {
  return ANALISES.find((a) => a.slug === slug);
}

export function getAnaliseByPath(p: string) {
  return ANALISES.find((a) => a.path === p);
}
`,
  "utf8",
);

console.log("analyses written", analyses.length);
