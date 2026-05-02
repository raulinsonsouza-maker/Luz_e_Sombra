// ============================================
// TABELA DE NASCIMENTO - SISTEMA DE PITÁGORAS
// ============================================

// Significados Metafísicos dos Números (Capítulo 3)
export const SIGNIFICADOS_METAFISICOS: Record<number, string> = {
  1: "O primeiro número físico. O número absoluto que simboliza a expressão divina. É a chave da expressão verbal e a expressão do ego enquanto microcosmo do divino. É a chave da nossa capacidade de comunicação.",
  2: "O primeiro número espiritual, relacionado com os sentimentos. Representa a dualidade humana e simboliza o portal para a nossa sensibilidade, assim como a nossa necessidade de fazer parte de um par. É o número da intuição.",
  3: "O primeiro número mental, relacionado com o raciocínio. É o portal para a mente consciente e para o raciocínio lógico. É o foco da atividade do lobo cerebral esquerdo, a chave da memória. Simbolizado pelo triângulo (mente, alma e corpo).",
  4: "O número que representa o plano físico (da ação). É a chave da disciplina, do sentido prático e da organização. Simbolizado pelo quadrado, a base de praticamente todas as construções.",
  5: "O centro do plano da alma (dos sentimentos) e o epicentro da Tabela de Nascimento. É o número espiritual que representa o amor e a liberdade de expressão.",
  6: "O centro do plano mental (dos pensamentos). Representa a criatividade e a integração dos lobos esquerdo e direito do cérebro. Também representa o oposto — a destruição expressa como preocupação, stress, ansiedade e depressão.",
  7: "O símbolo do templo, do corpo humano e dos seus sete chakras ou centros de poder. É o número do ensino e da aprendizagem, o número da experiência filosófica adquirida com sacrifício, transformando-se em sabedoria indelével.",
  8: "O número espiritual mais ativo. Situado no extremo ativo do plano da alma, é o número da sabedoria expressa intuitivamente através de atitudes bondosas. Põe em foco a independência.",
  9: "O número triplo que se situa no extremo ativo do plano mental. Enquanto mente em ação, representa a ambição (físico), a responsabilidade (racional) e o idealismo (espiritual), combinando os atributos de cada um dos números anteriores.",
  0: "Símbolo místico que representa o nada (numerador) e o tudo (denominador). Indica o grau de misticismo espiritual inerente ao indivíduo. Possui uma espiritualidade inerente que deve ser reconhecida e desenvolvida.",
}

// Os Três Aspectos do Eu (Capítulo 4)
export const TRES_EUS = {
  basico: {
    titulo: "Eu Básico",
    descricao: "O corpo em ação. Expressa-se através dos cinco sentidos físicos, conversa, riso, choro e todas as atividades físicas.",
    plano: "Físico",
    numeros: [1, 4, 7],
    caracteristicas: [
      "Expressão dos cinco sentidos físicos (visão, audição, tato, paladar e olfato)",
      "Comportamento instintivo e reativo",
      "Corpo em autodefesa",
      "Quando desequilibrado: insegurança, desejo de controlar, exibicionismo"
    ],
    equilibrado: "Quando controlado, torna-se o servo mais fiel. O ego é motivado pela compaixão e sabedoria, a vida física organiza-se e há mais paciência.",
  },
  consciente: {
    titulo: "Eu Consciente",
    descricao: "O lar dos nossos pensamentos e atitudes. Pode albergar alegria ou tristeza, memória, criatividade e idealismo.",
    plano: "Mental",
    numeros: [3, 6, 9],
    caracteristicas: [
      "Ponte entre o Eu Básico e o Eu Superior",
      "Integra aspetos reativos com valores espirituais",
      "Conexão entre lobo esquerdo e direito do cérebro",
      "O grande avaliador que transforma despertar espiritual em consciência física"
    ],
    equilibrado: "Ajuda a interpretar a intuição, o amor e a sabedoria. Liga conhecimentos do passado à experiência do presente, criando um recipiente de informação útil.",
  },
  superior: {
    titulo: "Eu Superior",
    descricao: "As nossas virtudes morais, ideias filosóficas e valores espirituais. A essência da sensibilidade e do sentimento.",
    plano: "Alma (Sentimentos)",
    numeros: [2, 5, 8],
    caracteristicas: [
      "Reconhece e determina as nossas necessidades",
      "Expressa-se como intuição, amor e sabedoria",
      "É a nossa mais elevada forma de expressão, o Deus dentro de nós",
      "Conduzido sobretudo pelo lado direito do cérebro: criativo, espiritual e compassivo"
    ],
    equilibrado: "Facilita o desenvolvimento da intuição, levando ao aprofundamento da liberdade pessoal, riqueza emocional, compaixão e sabedoria.",
  },
}

// Os Três Planos da Tabela de Nascimento
export const TRES_PLANOS = {
  mental: {
    titulo: "Plano Mental",
    posicao: "Topo (Cabeça)",
    numeros: [3, 6, 9],
    aspectos: [
      "Memória",
      "Raciocínio",
      "Capacidade de análise",
      "Racionalismo",
      "Imaginação",
      "Criação",
      "Responsabilidade",
      "Ambição",
      "Idealismo"
    ],
  },
  alma: {
    titulo: "Plano da Alma",
    posicao: "Centro (Coração)",
    numeros: [2, 5, 8],
    aspectos: [
      "Sensibilidade",
      "Intuição",
      "Amor",
      "Liberdade",
      "Emoções positivas",
      "Expressão artística",
      "Independência espiritual",
      "Sabedoria"
    ],
  },
  fisico: {
    titulo: "Plano Físico",
    posicao: "Base (Ação)",
    numeros: [1, 4, 7],
    aspectos: [
      "Expressão verbal",
      "Motivação",
      "Linguagem corporal",
      "Organização",
      "Paciência",
      "Materialismo",
      "Capacidade de aprender através do sacrifício"
    ],
  },
}

// Interpretações Detalhadas dos Números na Tabela de Nascimento (Capítulo 5)
export const INTERPRETACOES_NUMEROS_TABELA: Record<number, any> = {
  1: {
    numero: 1,
    plano: "Físico",
    significado: "Expressão do ego e autocontrolo",
    descricaoBase: "Localizado à entrada do Plano Físico, refere-se à expressão do corpo físico na sua relação com o mundo exterior. Indicador da forma como uma pessoa reage aos outros e às circunstâncias.",
    ocorrencias: {
      0: {
        interpretacao: "Ausência do 1 na Tabela",
        descricao: "Indica uma necessidade de desenvolver a expressão verbal e o autocontrolo. A pessoa pode ter dificuldade em expressar o ego de forma equilibrada.",
        recomendacao: "Pratique a comunicação assertiva e trabalhe a autoconfiança através da expressão artística ou escrita."
      },
      1: {
        interpretacao: "Um 1 - Dificuldade de Expressão Verbal",
        descricao: "Dificuldade em expressar sentimentos verbalmente. Podem dizer o contrário do que sentem como forma de defesa. Têm de aprender a pensar antes de falar.",
        recomendacao: "Reserve tempo diário para anotar pensamentos e sentimentos num caderno. Pela manhã, leia em voz alta diante de um espelho e observe sua linguagem corporal. Este exercício aumentará a confiança na expressão.",
        desafios: ["Dificuldade em verbalizar sentimentos", "Tendência à defesa agressiva", "Podem magoar com palavras sem querer"]
      },
      2: {
        interpretacao: "Dois 1 - Dádiva da Autoexpressão",
        descricao: "Abençoadas com a dádiva da autoexpressão. Conseguem ver os dois lados de uma situação. Muitos políticos e figuras públicas de sucesso possuem dois 1.",
        pontoForte: "Excelente capacidade de comunicação e compreensão de diferentes perspectivas.",
        alerta: "Nunca use esta capacidade para manipulação. Cuidado com intolerância para com quem não tem esta facilidade.",
        desafios: []
      },
      3: {
        interpretacao: "Três 1 - O Conversador ou O Introspetivo",
        descricao: "Dois grupos: (1) Conversadores inteligentes e interessantes que gostam de se envolver em várias atividades. (2) Discretos e introspetivos (quando não há números no Plano da Alma), que se expressam melhor pela escrita.",
        pontoForte: "Apreciam a vida e procuram partilhar o seu espírito.",
        alerta: "Pessoas do segundo grupo precisam sentir-se à vontade para se abrir.",
        desafios: []
      },
      4: {
        interpretacao: "Quatro 1 - Turbilhão Emocional",
        descricao: "Dificuldade extrema em expressar-se verbalmente, sendo frequentemente mal-entendidas. Escondem turbilhão emocional com um sorriso. Muito egocêntricas.",
        pontoForte: "Sensibilidade profunda quando conseguem libertar emoções.",
        alerta: "Precisam urgentemente aprender a comandar as emoções e descontrair.",
        desafios: ["Sofrimento interno reprimido", "Egocentrismo", "Identificam-se profundamente com poucos"]
      },
      5: {
        interpretacao: "Cinco ou Mais 1 - Repressão do Ego",
        descricao: "Repressão do ego para contrabalançar a dificuldade de expressão. Jovens podem ser muito tristes e solitários. Obcecados com a aparência.",
        pontoForte: "Quando trabalham com arte (escrita, pintura, música), conseguem canalizar a energia.",
        alerta: "Risco de desequilíbrios mentais. Precisam de ajuda para elevar a consciência através das artes.",
        desafios: ["Egoísmo", "Desilusão", "Solidão profunda", "Obsessão com aparência"]
      }
    }
  },
  2: {
    numero: 2,
    plano: "Alma",
    significado: "Intuição, sensibilidade e sentimento",
    descricaoBase: "Localizado no portal do Plano da Alma, é a chave da intuição, da sensibilidade e do sentimento. Uma verdadeira bênção que fornece um guia para a sensibilidade e intuição.",
    ocorrencias: {
      0: {
        interpretacao: "Ausência do 2 na Tabela",
        descricao: "Não indica ausência total de intuição e sensibilidade, mas sugere que esses traços devem ser ativamente trabalhados e desenvolvidos.",
        recomendacao: "Pratique meditação, passe tempo na natureza e desenvolva a escuta ativa para cultivar a sensibilidade."
      },
      1: {
        interpretacao: "Um 2 - Nível Básico de Intuição",
        descricao: "Nível básico de intuição. Homens precisam praticar diligentemente a sensibilidade. Mulheres têm vantagem natural (equivalente a dois 2).",
        pontoForte: "Base válida para desenvolver sensibilidade equilibrada.",
        alerta: "Num mundo competitivo, pode não ser suficiente. Precisa de equilíbrio.",
        recomendacao: "Passe mais tempo descontraído na natureza, longe da agitação.",
        desafios: ["Podem magoar-se facilmente", "Homens têm mais dificuldade que mulheres"]
      },
      2: {
        interpretacao: "Dois 2 - Equilíbrio Ideal",
        descricao: "Trunfo ideal para desenvolvimento da sensibilidade e intuição. Perceção inata confere inteligência acima da média. Capacidade de formular opiniões instantâneas e precisas.",
        pontoForte: "Detetam facilmente sinceridade ou falsidade. Excelente guia de primeiras impressões.",
        alerta: "Não deixe o ego e imaginação interferirem com a intuição básica. Evite envolver-se excessivamente em causas.",
        desafios: ["Tendência a envolver-se em muitos assuntos humanos simultaneamente"]
      },
      3: {
        interpretacao: "Três 2 - Hipersensibilidade",
        descricao: "A 'trave do equilíbrio' foi ultrapassada. Sensibilidade desequilibrada que pode tornar-se carga emocional. Altamente condicionados pelos sentimentos dos outros.",
        pontoForte: "Sucesso notável na indústria do entretenimento, representando personagens com grande sensibilidade.",
        alerta: "Tendência para solidão e alheamento. Podem dizer coisas para magoar quando se sentem feridos.",
        recomendacao: "Crianças com três 2 precisam muito dos pais para construir autoconfiança sólida.",
        desafios: ["Hipersensibilidade", "Dificuldade em expressar sentimentos profundos", "Solidão", "Comportamento defensivo"]
      },
      4: {
        interpretacao: "Quatro 2 - Impressionabilidade Extrema",
        descricao: "Nível extremamente elevado de impressionabilidade. Sem disciplina, evolui para distorções da realidade acompanhadas de mau génio, sarcasmo e rancor. Intuição torna-se falível.",
        pontoForte: "Quando disciplinados, podem desenvolver sensibilidade profunda.",
        alerta: "Risco de divórcios, bancarrotas, isolamento. Podem recorrer a drogas ou álcool.",
        recomendacao: "URGENTE: Procure aconselhamento apropriado. Aprenda a controlar expressão das emoções. Medite. Acompanhe o curso da vida em vez de tentar contrariá-lo.",
        desafios: ["Impacientes", "Interpretam incorretamente a realidade", "Exageram sempre", "Emocionalmente desequilibrados", "Confiam nas pessoas erradas"]
      },
      5: {
        interpretacao: "Cinco ou Mais 2 - Ocorrência Extremamente Rara",
        descricao: "Extremamente rara. Propensão a tornar-se bastante reativo devido à enorme sensibilidade. Testam a paciência dos outros até às últimas consequências.",
        pontoForte: "Quando bem orientados desde a infância, podem canalizar a sensibilidade extrema positivamente.",
        alerta: "Confusão em relação à vida pessoal que se arrasta para outras decisões.",
        recomendacao: "Necessitam de MUITO cuidado e orientação desde a infância. Aconselhamento especializado é essencial.",
        desafios: ["Sensibilidade extrema", "Grande reatividade", "Desgostos profundos", "Confusão constante"]
      }
    }
  },
  3: {
    numero: 3,
    plano: "Mental",
    significado: "Memória e atividade mental",
    descricaoBase: "O número do portal do Plano Mental que governa a memória. Ao contrário dos números anteriores, um único 3 é a situação de maior força e equilíbrio.",
    ocorrencias: {
      0: {
        interpretacao: "Ausência do 3 na Tabela",
        descricao: "Não implica fraqueza mental, a menos que a pessoa ceda à indolência e/ou indiferença. Indica que precisa de exercer maior esforço nas esferas mentais.",
        recomendacao: "Combata a tendência para a preguiça nos primeiros anos. Exercite a memória e mantenha-se mentalmente ativo.",
        desafios: ["Tendência para preguiça mental se não corrigida cedo"]
      },
      1: {
        interpretacao: "Um 3 - Âncora da Memória",
        descricao: "Fornece qualidade inata que acompanha ao longo da vida. Ajuda a manter atividade mental saudável. Grande apoio na educação formal e informal.",
        pontoForte: "Força e agilidade mentais são bases para atitude equilibrada e otimista. Autoconfiança acima da média.",
        alerta: "Deve ser trabalhada — qualquer capacidade não exercitada irá definhar.",
        desafios: []
      },
      2: {
        interpretacao: "Dois 3 - Imaginação Aumentada",
        descricao: "Aumento de alerta mental refletido em ênfase da imaginação e maior aptidão literária. Cérebro extremamente ativo.",
        pontoForte: "Grande potencial para escrita, arte e criatividade.",
        alerta: "Poder deve ser cuidadosamente disciplinado para evitar comportamento antissocial. Imaginação pode sobrepor-se ao planeamento objetivo.",
        recomendacao: "Pratique meditação, treino de memória e desenvolvimento da intuição para disciplinar a mente.",
        desafios: ["Tendência para se afastar da realidade", "Imaginação em detrimento do planeamento", "Precisa de autodisciplina"]
      }
    }
  },
}

// Função para calcular qual plano é dominante
export function calcularPlanoDominante(tabelaNascimento: Record<number, number>): string {
  const planosCount = {
    mental: 0,
    alma: 0,
    fisico: 0,
  }
  
  // Contar números em cada plano
  TRES_PLANOS.mental.numeros.forEach(num => {
    planosCount.mental += tabelaNascimento[num] || 0
  })
  
  TRES_PLANOS.alma.numeros.forEach(num => {
    planosCount.alma += tabelaNascimento[num] || 0
  })
  
  TRES_PLANOS.fisico.numeros.forEach(num => {
    planosCount.fisico += tabelaNascimento[num] || 0
  })
  
  // Determinar dominante
  const max = Math.max(planosCount.mental, planosCount.alma, planosCount.fisico)
  
  if (planosCount.mental === max) return 'mental'
  if (planosCount.alma === max) return 'alma'
  return 'fisico'
}

// Função para calcular qual Eu é dominante
export function calcularEuDominante(tabelaNascimento: Record<number, number>): string {
  const planoDominante = calcularPlanoDominante(tabelaNascimento)
  
  switch(planoDominante) {
    case 'mental': return 'consciente'
    case 'alma': return 'superior'
    case 'fisico': return 'basico'
    default: return 'consciente'
  }
}
