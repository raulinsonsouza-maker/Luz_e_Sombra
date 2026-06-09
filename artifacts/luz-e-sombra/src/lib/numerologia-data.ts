// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface NumeroPerfil {
  titulo: string
  arquetipo: string
  essencia: string
  missao: string
  descricao: string
  talentos: string[]
  desafios: string[]
  palavrasChave: string[]
  carreira: string
  relacionamentos: string
  saude: string
  espiritualidade: string
  afirmacao: string
  sombra: string
}

export interface AnaliseNumero {
  titulo: string
  descricao: string
  detalhado: string
  essencia?: string
  temas: {
    carreira: string
    financas: string
    relacionamentos: string
    saude: string
    desenvolvimento?: string
    espiritualidade?: string
  }
  desafios: string[]
  palavrasChave: string[]
  afirmacoes?: string[]
  praticasSugeridas?: string[]
  areasDeAtencao?: string[]
}

export interface AnaliseUniversal {
  titulo: string
  temaGeral: string
  climaColetivo: string
  oportunidades: string
  desafios: string
  comoAproveitar: string
}

export interface CombinacaoUniversalPessoal {
  tema: string
  carreira: string
  financas: string
  relacoes: string
  saude?: string
  desafios: string
  recomendacoes: string
  foco?: string
  mantra?: string
}

// ─── Números de Vida (Caminho de Vida) ──────────────────────────────────────
// A interpretação mais profunda e permanente: quem você é na essência

export const NUMEROS_DE_VIDA: Record<number, NumeroPerfil> = {
  1: {
    titulo: 'Caminho de Vida 1. O Pioneiro',
    arquetipo: 'O Pioneiro',
    essencia: 'Você nasceu para liderar, iniciar e abrir caminhos onde outros ainda não ousaram pisar. Sua energia fundamental é a da autonomia e da criação a partir do nada.',
    missao: 'Desenvolver autoconfiança genuína e originalidade para que possa pavimentar novos caminhos, não por necessidade de controle, mas porque realmente enxerga além do que os outros ainda não veem.',
    descricao: 'O Caminho de Vida 1 carrega a energia do número mais original da numerologia: o início absoluto. Você não é apenas alguém que começa projetos, você é a própria força criadora que coloca coisas em movimento. Sua passagem pela Terra tem tudo a ver com a construção de uma identidade única e inabalável, com coragem para defender suas visões mesmo quando estão sozinhos no campo.',
    talentos: [
      'Capacidade natural de enxergar possibilidades onde outros veem obstáculos',
      'Força de vontade e determinação acima da média',
      'Criatividade original e pensamento pioneiro',
      'Liderança carismática e inspiradora quando alinhada ao propósito',
      'Autoconfiança que motiva equipes e mobiliza pessoas',
      'Resiliência: levanta-se rapidamente após quedas',
    ],
    desafios: [
      'Dificuldade em delegar e colaborar, tendência a querer fazer tudo sozinho',
      'Impaciência com pessoas e processos mais lentos',
      'Ego inflado após conquistas, arrogância disfarçada de autoconfiança',
      'Teimosia em defender posições mesmo quando claramente equivocadas',
      'Solidão não intencional criada pelo excesso de independência',
      'Dificuldade em pedir ajuda, confunde fragilidade com pedir suporte',
    ],
    palavrasChave: ['pioneirismo', 'liderança', 'autonomia', 'coragem', 'originalidade', 'iniciativa', 'determinação'],
    carreira: 'Você prospera em ambientes onde pode liderar, criar e decidir com autonomia. Empreendedorismo, gestão, startups, consultoria independente, artes solo, direção e produção executiva são terrenos naturais. Quando em posição subordinada, tende a frustrar-se, a menos que o gestor reconheça e canalize seu espírito pioneiro. Melhor em profissões onde seja o rosto e a voz do projeto.',
    relacionamentos: 'Em relacionamentos, você ama com intensidade mas luta com a necessidade de espaço e autonomia. Seus parceiros precisam entender que sua independência não é rejeição, é condição para você ser inteiro(a). Você se apaixona por pessoas que te desafiam intelectualmente e respeitam suas iniciativas. O risco maior é transformar parceiros em seguidores em vez de co-criadores. Aprenda a ceder o palco.',
    saude: 'Você tende a ignorar o corpo em favor da mente e das conquistas. Os pontos de atenção são: cabeça (enxaquecas, pressão alta por estresse), coração (sobrecarga emocional reprimida), suprarrenais (burnout por excesso de ação sem descanso). Pratique exercícios que desenvolvam presença, corrida consciente, artes marciais, yoga de força. Crie rituais de parada intencional.',
    espiritualidade: 'Sua espiritualidade se expressa pela ação. Você não é contemplativo por natureza, encontra o sagrado no ato de criar, de manifestar, de transformar ideias em realidade. Afirmações de poder, visualizações criativas e meditações ativas (caminhar, dançar, escrever) funcionam melhor do que práticas passivas. Seu chakra primário é o Plexo Solar, trabalhe-o.',
    afirmacao: '"Eu sou o arquiteto da minha própria vida. Minha originalidade é meu presente ao mundo."',
    sombra: 'Quando não integrado, o Caminho 1 pode tornar-se dominador, egocêntrico e incapaz de reconhecer os outros. A sombra mais profunda é a solidão, construir um mundo em torno de si mesmo e perceber, tarde demais, que não há ninguém genuinamente próximo.',
  },
  2: {
    titulo: 'Caminho de Vida 2. O Mediador',
    arquetipo: 'O Mediador',
    essencia: 'Você nasceu para unir, harmonizar e criar pontes. Sua maior força não é a ação individual, mas a capacidade de sentir o outro tão profundamente que consegue criar espaços onde todos se sentem compreendidos.',
    missao: 'Aprender a servir com amor sem perder-se nesse processo. Ser o elo que une sem se dissolve, cultivando a força silenciosa da cooperação e da sensibilidade como dons, não como fraquezas.',
    descricao: 'O Caminho de Vida 2 traz a energia da dualidade e da parceria. Você é naturalmente empático, diplomático e profundamente intuitivo. Sua inteligência emocional é uma ferramenta extraordinária, quando bem gerenciada. O desafio é que essa mesma sensibilidade pode torná-lo(a) vulnerável à influência e à aprovação externas.',
    talentos: [
      'Inteligência emocional e empática extraordinária',
      'Diplomacia natural, encontra acordos onde outros veem apenas conflito',
      'Intuição poderosa que raramente falha quando ouvida',
      'Capacidade de criar ambientes de harmonia e cooperação',
      'Lealdade e dedicação profunda nas relações',
      'Sensibilidade artística e estética refinada',
    ],
    desafios: [
      'Dependência de aprovação externa, dificuldade em decidir sem validação',
      'Tendência a reprimir opiniões para evitar conflito',
      'Hipersensibilidade que pode transformar-se em mágoa acumulada',
      'Dificuldade em estabelecer limites, coloca as necessidades dos outros antes das próprias',
      'Indecisão paralisante em momentos-chave',
      'Ressentimento quando os sacrifícios não são reconhecidos',
    ],
    palavrasChave: ['cooperação', 'sensibilidade', 'diplomacia', 'parceria', 'intuição', 'harmonia', 'lealdade'],
    carreira: 'Você brilha em carreiras colaborativas: mediação, psicologia, terapia, trabalho social, recursos humanos, diplomacia, artes colaborativas, música, ensinamento. Em ambientes competitivos e agressivos, pode murchar. Seu talento é o de construir relações produtivas e transformar grupos em equipes. Posições de segundo plano não são fracasso, muitas vezes você é o verdadeiro motor por trás dos líderes visíveis.',
    relacionamentos: 'Você ama com uma profundidade rara e investe nas relações como se fossem sua obra de arte. O risco é a co-dependência, dar tanto que não resta espaço para si mesmo(a). Você precisa de parceiros emocionalmente maduros que valorizem sua sensibilidade sem se aproveitar dela. Aprenda a distinguir entrega amorosa de auto-sacrifício. Seus relacionamentos mais saudáveis são aqueles onde você também é nutrido(a).',
    saude: 'Seu sistema nervoso é sensível por natureza. Pontos de atenção: problemas digestivos (estômago e intestino como centro emocional), dores nas costas (sobrecarga de responsabilidades não expressas), ansiedade e insônia. Práticas recomendadas: yoga restaurativo, meditação de compaixão, tempo na natureza, terapia corporal. Aprenda a identificar quando está absorvendo emoções dos outros.',
    espiritualidade: 'Você é naturalmente espiritual, sente a interconexão de todas as coisas de forma visceral. Sua prática ideal envolve comunidade, rituais de cura, meditação de coração aberto (Loving-Kindness) e trabalhos com o chakra do coração. Você aprende pela relação e pelo serviço. Cuidado: espiritualidade não deve ser outra forma de negação das suas próprias necessidades.',
    afirmacao: '"Minha sensibilidade é poder. Eu sirvo com amor e também me permito ser amado(a)."',
    sombra: 'Quando desequilibrado, o Caminho 2 pode tornar-se passivo-agressivo, manipulador pela fraqueza, ou completamente dependente. A sombra é o mártir que sacrifica tudo e depois apresenta a conta emocional.',
  },
  3: {
    titulo: 'Caminho de Vida 3. O Criador',
    arquetipo: 'O Criador',
    essencia: 'Você nasceu para expressar, inspirar e trazer beleza e alegria ao mundo. Sua voz, sua criatividade e sua presença têm o poder genuíno de transformar o ambiente ao redor.',
    missao: 'Usar o dom da expressão criativa como ferramenta de cura e elevação, não apenas de entretenimento. Aprender a disciplinar o talento para que a genialidade não se perca na dispersão.',
    descricao: 'O Caminho de Vida 3 vibra com a energia da comunicação, criatividade e alegria. Você é naturalmente carismático, expressivo e tem facilidade para conectar pessoas através das palavras, da arte ou do humor. Seu desafio maior é a disciplina: a energia do 3 é expansiva e abundante, mas sem foco pode dissipar-se em mil direções sem concretizar nada.',
    talentos: [
      'Criatividade natural e originalidade expressiva',
      'Comunicação cativante, fala, escrita, presença cênica',
      'Carisma que atrai pessoas e oportunidades',
      'Otimismo genuíno que levanta o ambiente',
      'Facilidade com palavras, línguas e expressão artística',
      'Humor inteligente e capacidade de encontrar leveza em situações difíceis',
    ],
    desafios: [
      'Dispersão, começa muito e termina pouco',
      'Superficialidade quando não aprofunda experiências e relações',
      'Gastos impulsivos em momentos de entusiasmo',
      'Hipersensibilidade a críticas, ego frágil por trás do carisma',
      'Dificuldade em manter foco de longo prazo',
      'Tendência ao exibicionismo que pode afastar relacionamentos profundos',
    ],
    palavrasChave: ['criatividade', 'expressão', 'alegria', 'comunicação', 'carisma', 'arte', 'inspiração'],
    carreira: 'Você prospera em profissões criativas e comunicativas: escrita, jornalismo, publicidade, marketing, atuação, música, dança, coaching, fala em público, ensino. O mundo digital é seu terreno natural, criação de conteúdo, podcasts, plataformas de educação. O maior erro profissional seria aprisionar seu espírito criativo em funções mecânicas e repetitivas. Você precisa de espaço para inventar.',
    relacionamentos: 'Você é apaixonante, intenso, divertido e profundamente afetivo quando se sente seguro(a). O risco é usar o carisma como proteção para não mostrar vulnerabilidade. Você prefere a leveza mas precisa aprender a habitar também as profundezas emocionais. Seus relacionamentos mais ricos são aqueles onde pode ser tanto o palhaço quanto o ser humano com medos e feridas.',
    saude: 'Seu ponto de atenção é a garganta e os pulmões (expressão reprimida manifesta-se aí), sistema nervoso (ansiedade por excesso de estímulos) e pele (sensibilidade emocional se exterioriza). Práticas: canto, dança, tai chi, yoga, práticas criativas como forma terapêutica. Cuide do sono, sua mente ativa precisa de desligamento intencional.',
    espiritualidade: 'Sua espiritualidade se manifesta pela beleza, pelo prazer sagrado e pela expressão artística como oração. Música, dança, pintura, poesia, qualquer ato criativo profundo é uma prática espiritual para você. O chakra da garganta e o do coração são seus centros energéticos primários. Manifestação pela palavra é particularmente poderosa no seu caso.',
    afirmacao: '"Minha expressão é sagrada. Cada ato criativo é minha contribuição única ao mundo."',
    sombra: 'Quando bloqueado, o Caminho 3 pode tornar-se superficial, frívolo, ou usar o humor como armadura contra a intimidade real. A tristeza profunda pode esconder-se por trás de um sorriso permanente.',
  },
  4: {
    titulo: 'Caminho de Vida 4. O Construtor',
    arquetipo: 'O Construtor',
    essencia: 'Você nasceu para construir, estruturar e criar bases duradouras. Onde outros veem desordem, você enxerga sistemas. Onde outros desistem, você persevera.',
    missao: 'Criar estruturas sólidas, em projetos, relacionamentos e em si mesmo(a), que sirvam não apenas ao presente mas às gerações futuras. Aprender a equilibrar a necessidade de ordem com a abertura à vida orgânica.',
    descricao: 'O Caminho de Vida 4 vibra com disciplina, método e construção. Você é o alicerce sobre o qual os outros constroem, confiável, meticuloso e profundamente comprometido. Sua presença traz segurança e estabilidade ao ambiente. O desafio é não deixar que a busca por controle e ordem sufoque a espontaneidade e a alegria.',
    talentos: [
      'Disciplina e foco excepcionais',
      'Capacidade de transformar visões abstratas em planos concretos',
      'Confiabilidade, quando você diz que vai fazer, faz',
      'Habilidade para construir sistemas e processos duradouros',
      'Paciência com processos longos que exigem persistência',
      'Sentido prático aguçado e resolução eficaz de problemas',
    ],
    desafios: [
      'Rigidez, dificuldade em adaptar-se a mudanças inesperadas',
      'Perfeccionismo que paralisa e atrasa entregas',
      'Dificuldade em relaxar e "deixar fluir"',
      'Tendência a trabalhar em excesso e negligenciar saúde e relações',
      'Visão limitada pela praticidade, dificuldade com o abstrato e o poético',
      'Resistência à inovação que não segue padrões comprovados',
    ],
    palavrasChave: ['disciplina', 'estrutura', 'método', 'confiabilidade', 'construção', 'perseverança', 'fundação'],
    carreira: 'Você brilha em engenharia, arquitetura, gestão de projetos, finanças, contabilidade, direito, medicina, construção civil, logística, TI. Qualquer profissão que exija método, precisão e capacidade de sustentar resultados ao longo do tempo é seu território. Você não é um ser de flashes de genialidade, é de construção consistente. Seus projetos duram porque têm fundações sólidas.',
    relacionamentos: 'Você é o parceiro mais leal e confiável que existe. Quando se compromete, é para valer. O desafio é que seu amor se expressa mais por atos do que por palavras, o que pode ser mal interpretado como frieza. Aprenda a verbalizar afeto e a aceitar que nem toda conversa precisa ter solução prática. Seus relacionamentos mais saudáveis são com pessoas que valorizam estabilidade e profundidade.',
    saude: 'Seus pontos de atenção são joelhos e ossos (estrutura física espelha a psíquica), problemas digestivos (por excesso de controle), tensão muscular crônica. Você tende a negligenciar o corpo em função do trabalho. Práticas: caminhadas na natureza, pilates, yoga estrutural, massagem terapêutica. Crie rituais de descanso tão disciplinados quanto seu trabalho.',
    espiritualidade: 'Você tende ao ceticismo em relação ao espiritual, prefere o que pode ser provado. Mas a espiritualidade do Caminho 4 está na beleza do sagrado cotidiano: no trabalho bem-feito, na casa organizada, no jardim cuidado. Rituais regulares, práticas de aterramento e contato com a terra são seus acessos ao transcendente. Meditação estruturada e journaling funcionam melhor do que práticas mais fluidas.',
    afirmacao: '"Eu construo com sabedoria e amor. Minhas fundações são eternas."',
    sombra: 'Quando bloqueado, o Caminho 4 pode tornar-se controlador, compulsivo com regras, ou usar o trabalho como fuga das emoções. O medo existencial mais profundo é o caos, e a tentativa de controlá-lo pode destruir exatamente as relações que mais importam.',
  },
  5: {
    titulo: 'Caminho de Vida 5. O Explorador',
    arquetipo: 'O Explorador',
    essencia: 'Você nasceu para experimentar, questionar e expandir os limites do possível. Sua alma é nômade por natureza, não apenas geograficamente, mas em ideias, relações e perspectivas.',
    missao: 'Ser o mensageiro da liberdade e da expansão consciente, não pela fuga das responsabilidades, mas pelo exemplo de que é possível viver plenamente fora das caixas que a sociedade oferece.',
    descricao: 'O Caminho de Vida 5 pulsa com a energia da mudança, liberdade e versatilidade. Você é adaptável, curioso e capaz de comunicar experiências de uma forma que transforma os outros. Sua mente processa rapidamente múltiplas perspectivas. O desafio central é transformar a amplitude de experiências em profundidade e sabedoria.',
    talentos: [
      'Adaptabilidade extraordinária em qualquer ambiente ou situação',
      'Comunicação persuasiva e capacidade de contar histórias transformadoras',
      'Aprendizado rápido, absorve novas habilidades com facilidade',
      'Criatividade versátil e pensamento fora do convencional',
      'Capacidade de inspirar outros a sair da zona de conforto',
      'Leitura aguçada de ambientes, pessoas e oportunidades emergentes',
    ],
    desafios: [
      'Inconstância, abandona projetos e relações quando perdem a novidade',
      'Impulsividade em decisões importantes (especialmente financeiras)',
      'Dificuldade com compromissos de longo prazo',
      'Excesso de sensações pode levar a vícios ou comportamentos de risco',
      'Resistência à rotina que pode limitar conquistas que exigem consistência',
      'Fuga das responsabilidades em nome da "liberdade"',
    ],
    palavrasChave: ['liberdade', 'mudança', 'versatilidade', 'aventura', 'comunicação', 'expansão', 'experiência'],
    carreira: 'Você precisa de variedade, movimento e desafio constante. Jornalismo, vendas, relações públicas, turismo, marketing digital, coaching, viagens, comércio exterior, política, investimentos, carreiras criativas nômades. O emprego fixo e burocrático é sua kryptonita. Você produz melhor em projetos com fases distintas, freelancing estratégico ou empreendedorismo ágil.',
    relacionamentos: 'Você ama com a intensidade de quem vive cada momento como se fosse único. O problema: seus parceiros às vezes não conseguem acompanhar o ritmo. Você precisa de liberdade dentro do relacionamento, espaço para crescer individualmente. Os relacionamentos mais sustentáveis são com pessoas igualmente independentes e que entendem que seu amor não é menor por não seguir os padrões convencionais.',
    saude: 'Seu sistema nervoso está em constante hiperatividade. Pontos de atenção: ansiedade, nervosismo crônico, problemas respiratórios, tendências aditivas (busca de dopamina constante). Práticas que te fazem parar: meditação, respiração consciente, yoga, artes marciais. O corpo precisa de pausas que sua mente resiste em fazer.',
    espiritualidade: 'Para você, a espiritualidade é experiencial, não doutrinária. Você encontra o sagrado em viagens transformadoras, em conversas profundas, em rituais de povos diferentes, na natureza selvagem. Práticas xamânicas, medicinas da floresta e espiritualidade de liberdade ressoam com você. Cuidado: não use a busca espiritual como outra forma de fuga.',
    afirmacao: '"Eu abraço a mudança como minha mestra. Minha liberdade é responsável e consciente."',
    sombra: 'Quando desequilibrado, o Caminho 5 pode tornar-se irresponsável, adicto a estímulos, incapaz de profundidade. A sombra mais difícil é chegar à maturidade com muitas histórias mas poucas raízes.',
  },
  6: {
    titulo: 'Caminho de Vida 6. O Nutridor',
    arquetipo: 'O Nutridor',
    essencia: 'Você nasceu com uma capacidade extraordinária de amar, cuidar e criar harmonia. Sua presença transforma ambientes e relacionamentos, quando você entra em uma sala, as pessoas sentem.',
    missao: 'Aprender a dar e receber amor em equilíbrio, sem o martírio do auto-sacrifício e sem a prisão da perfeição imposta. Criar beleza e cura no mundo a partir de um lugar de plenitude, não de carência.',
    descricao: 'O Caminho de Vida 6 é o número do amor, da responsabilidade e da beleza. Você tem uma vocação natural para o cuidado, de pessoas, espaços, projetos e relacionamentos. Sua presença é profundamente cuidadora e sua sensibilidade estética é refinada. O desafio central é não se perder nos outros e não transformar o cuidar em controle.',
    talentos: [
      'Amor incondicional e capacidade cuidadora extraordinária',
      'Senso estético refinado, beleza, harmonia, design',
      'Responsabilidade e comprometimento com os que ama',
      'Capacidade de criar ambientes onde outros florescem',
      'Sabedoria prática em relações e mediação de conflitos familiares',
      'Lealdade e confiabilidade que raramente são encontradas',
    ],
    desafios: [
      'Auto-sacrifício crônico, coloca todos antes de si mesmo(a)',
      'Perfeccionismo que se transforma em crítica disfarçada de cuidado',
      'Dificuldade em aceitar ajuda, precisa ser sempre o cuidador',
      'Tendência a assumir responsabilidade pelo estado emocional dos outros',
      'Codependência em relacionamentos',
      'Mágoa acumulada quando o cuidado não é reconhecido ou retribuído',
    ],
    palavrasChave: ['amor', 'cuidado', 'responsabilidade', 'harmonia', 'beleza', 'família', 'serviço'],
    carreira: 'Medicina, enfermagem, psicologia, terapia, nutrição, educação infantil, design de interiores, culinária, coaching de relacionamentos, trabalho social, artes. Você brilha em profissões onde o cuidado humano é o centro. Cuidado: em ambientes corporativos competitivos, pode ser explorado(a) por ser naturalmente prestativo(a). Estabeleça limites profissionais claros.',
    relacionamentos: 'Você é o parceiro mais devotado e amoroso. Ama com toda a sua capacidade e raramente guarda rancor. O risco é transformar o amor em controle sutil, querer que o outro seja de determinada forma para a relação funcionar. Aprenda a diferença entre cuidar e controlar. Seus relacionamentos mais saudáveis são aqueles onde o outro também tem maturidade emocional para cuidar de você.',
    saude: 'Você tende a negligenciar sua própria saúde enquanto cuida dos outros. Pontos de atenção: problemas cardíacos (coração sobrecarregado de responsabilidade), coluna (peso que carrega por outros), sistema imunológico (depleção por falta de autocuidado). Pratique o autocuidado como disciplina sagrada, não como luxo.',
    espiritualidade: 'Você é profundamente espiritual de forma prática, encontra Deus no cuidado, na cura, na beleza que cria. Práticas de devoção, trabalho com ancestrais, rituais de lar e família, meditações de cura ressoam com você. Chakra do coração é seu centro energético primário.',
    afirmacao: '"Eu me cuido com o mesmo amor que ofereço ao mundo. Minha plenitude é meu maior serviço."',
    sombra: 'Quando desequilibrado, o Caminho 6 pode tornar-se controlador, martirizado, ou usar o amor como moeda de troca. A sombra mais profunda é o ressentimento silencioso de quem deu tudo e não recebeu o que esperava.',
  },
  7: {
    titulo: 'Caminho de Vida 7. O Buscador',
    arquetipo: 'O Buscador',
    essencia: 'Você nasceu com uma fome insaciável pela verdade mais profunda. Sua mente não aceita respostas superficiais, você precisa entender os mecanismos invisíveis que regem a existência.',
    missao: 'Integrar o conhecimento intelectual com a sabedoria do coração. Trazer o que você descobre nas profundezas da contemplação de volta ao mundo, não guardar tesouros para si mesmo(a).',
    descricao: 'O Caminho de Vida 7 é o número do mistério, da análise profunda e do desenvolvimento espiritual. Você tem uma mente extraordinariamente analítica que pode penetrar camadas de complexidade que outros nem percebem existir. Intuitivo e perceptivo, frequentemente sente coisas que não consegue ainda articular em palavras. O desafio é sair da ilha da mente e habitar também o mundo das relações e do corpo.',
    talentos: [
      'Inteligência analítica e capacidade de investigação profunda',
      'Intuição altamente desenvolvida',
      'Percepção de padrões e verdades ocultas que outros ignoram',
      'Especialização, capacidade de dominar um campo de conhecimento',
      'Independência intelectual e pensamento original',
      'Espiritualidade genuína que emerge da investigação sincera',
    ],
    desafios: [
      'Isolamento, prefere a companhia dos livros à das pessoas',
      'Desconfiança excessiva que dificulta relações íntimas',
      'Frieza emocional percebida pelos outros como indiferença',
      'Perfeccionismo intelectual que paralisa a ação',
      'Dificuldade em confiar na intuição quando conflita com a lógica',
      'Tendência ao cinismo quando a realidade não corresponde ao ideal',
    ],
    palavrasChave: ['análise', 'introspecção', 'sabedoria', 'espiritualidade', 'mistério', 'investigação', 'verdade'],
    carreira: 'Ciência, pesquisa, filosofia, psicologia analítica, astrologia, numerologia, teologia, literatura, programação, estratégia, medicina especializada, direito, arqueologia. Qualquer campo que exija profundidade de conhecimento e pensamento independente. Você não é bom em vendas ou em posições que exigem constante exposição social. Trabalhe em profissões onde sua mente possa mergulhar fundo.',
    relacionamentos: 'Você ama de forma rara e profunda, mas raramente. Exige tempo para construir confiança e raramente se abre com facilidade. Quando se abre, é com uma profundidade que poucos conseguem habitar. Seus relacionamentos mais ricos são com pessoas que combinam inteligência emocional com profundidade intelectual. Não tente forçar-se a ser mais social do que é, encontre parceiros que respeitem sua necessidade de silêncio.',
    saude: 'Sua tendência à vida mental em detrimento do corpo manifesta-se em: sistema nervoso tenso, distúrbios do sono (mente que não para), problemas digestivos (ansiedade), isolamento que enfraquece o sistema imunológico. Práticas que integram mente e corpo: artes marciais, yoga, tai chi, caminhadas contemplatitas. O corpo é seu maior desafio e sua maior escola.',
    espiritualidade: 'Você tem uma vida espiritual profunda e geralmente solitária. Pesquisa mística, meditação vipassana, práticas contemplativas, leitura de textos sagrados. Sua espiritualidade não é tribal, é individual e investigativa. Encontra Deus no laboratório interior da consciência. Compartilhar essa jornada com outros pode ser transformador.',
    afirmacao: '"Minha profundidade é um presente. Eu partilho minha sabedoria e permito que outros entrem."',
    sombra: 'Quando bloqueado, o Caminho 7 pode tornar-se paranoico, niilista ou usar o conhecimento como escudo contra a vida real. A solidão não escolhida é sua sombra mais dolorosa.',
  },
  8: {
    titulo: 'Caminho de Vida 8. O Realizador',
    arquetipo: 'O Realizador',
    essencia: 'Você nasceu com a capacidade de manifestar no plano material o que outros apenas sonham. Sua relação com poder, dinheiro e autoridade não é casual, é o tema central da sua jornada.',
    missao: 'Dominar o jogo material do mundo sem ser dominado por ele. Usar poder e abundância como instrumentos de bem, construindo não apenas riqueza pessoal, mas legado que serve ao coletivo.',
    descricao: 'O Caminho de Vida 8 é o número do poder, da abundância e da autoridade. Você tem uma compreensão natural dos mecanismos de negócios, finanças e liderança. Sua energia é executiva, foca em resultados, planeja estrategicamente e tem visão de longo prazo. A grande tensão do Caminho 8 é entre o mundo material e o espiritual: você está aqui para integrá-los, não para escolher um.',
    talentos: [
      'Visão estratégica e capacidade executiva fora do comum',
      'Inteligência financeira natural',
      'Liderança autoritária mas justa quando desenvolvida',
      'Resiliência extraordinária, transforma fracassos em aprendizado',
      'Capacidade de pensar em grande escala e longo prazo',
      'Magnetismo natural que atrai recursos, pessoas e oportunidades',
    ],
    desafios: [
      'Ganância e obsessão com poder quando não integrado',
      'Tendência a julgar o valor das pessoas pelo status material',
      'Workaholism, trabalho como identidade, não como instrumento',
      'Dificuldade em mostrar vulnerabilidade',
      'Relacionamentos prejudicados pela ambição não equilibrada',
      'Karma financeiro intenso, grandes altos e baixos se não houver sabedoria',
    ],
    palavrasChave: ['poder', 'abundância', 'autoridade', 'realização', 'estratégia', 'liderança', 'legado'],
    carreira: 'Você nasceu para os negócios. Empreendedorismo, finanças, investimentos, direito corporativo, política, medicina de alto nível, engenharia de grandes obras, gestão executiva. Você não é feito para trabalhar para os outros indefinidamente, cedo ou tarde, a liderança chama. Sua trajetória ideal inclui assumir responsabilidade crescente e construir algo que dure.',
    relacionamentos: 'Você é intenso(a) em relacionamentos, dá tudo ou nada. O risco é colocar o sucesso profissional acima das relações importantes. Seus parceiros precisam ser igualmente ambiciosos e seguros de si mesmos para não se sentirem ofuscados. Aprenda que o sucesso compartilhado é mais rico do que o solitário. Vulnerabilidade não é fraqueza, é o ingrediente que transforma relações de contrato em amor real.',
    saude: 'Você trabalha até o limite e tende a ignorar sinais do corpo. Pontos de atenção: coração e sistema cardiovascular (pressão de responsabilidades), suprarrenais (burnout executivo), costas e ombros (peso que carrega). Pratique descanso com a mesma seriedade que trata negócios. A saúde é seu maior ativo.',
    espiritualidade: 'Sua espiritualidade é frequentemente negligenciada no altar do sucesso, e isso cobra um preço alto. Quando integrada, é poderosa: você entende que a abundância material e a espiritual não são opostas mas complementares. Práticas de gratidão, filantropia consciente, meditação de intenção e trabalho com o karma são especialmente transformadores.',
    afirmacao: '"Eu uso meu poder com sabedoria e ética. Minha prosperidade serve ao bem maior."',
    sombra: 'Quando não integrado, o Caminho 8 pode tornar-se corrupto, dominador e vazio por dentro. A tragédia maior é alcançar o topo da montanha e perceber que estava olhando para a montanha errada.',
  },
  9: {
    titulo: 'Caminho de Vida 9. O Humanitário',
    arquetipo: 'O Humanitário',
    essencia: 'Você nasceu com uma sabedoria que vai além desta vida. Sua alma acumulou muito, e agora está aqui para dar, servir e contribuir para algo maior que si mesmo(a).',
    missao: 'Integrar a sabedoria acumulada e direcioná-la para o serviço ao coletivo. Aprender a deixar ir com graça, pessoas, situações e versões antigas de si mesmo(a), para que o novo possa emergir.',
    descricao: 'O Caminho de Vida 9 carrega a síntese de todos os números anteriores. Você tem uma profundidade e uma amplitude raras, entende de tudo um pouco porque sua alma já experienciou muito. Sua vocação é humanitária: você não nasceu apenas para si mesmo(a), mas para contribuir com algo que dure além de você. O desafio é não se perder no coletivo nem se tornar amargo pelo peso das responsabilidades que assume.',
    talentos: [
      'Compaixão universal e capacidade de empatia profunda',
      'Sabedoria prática adquirida através de múltiplas experiências',
      'Visão ampla que transcende perspectivas individuais',
      'Capacidade de inspirar e transformar através do exemplo',
      'Generosidade genuína e incondicional',
      'Criatividade e expressão artística que toca a alma coletiva',
    ],
    desafios: [
      'Dificuldade em desapegar, tanto de pessoas quanto de fases já encerradas',
      'Tendência ao martírio e ao auto-sacrifício excessivo',
      'Amargura quando o mundo não corresponde aos ideais',
      'Dificuldade em receber cuidado e amor',
      'Tristeza existencial difícil de articular',
      'Sensação de estar deslocado(a) no mundo. "não pertenço aqui"',
    ],
    palavrasChave: ['compaixão', 'serviço', 'humanidade', 'sabedoria', 'desapego', 'universalidade', 'transformação'],
    carreira: 'Arte, filosofia, espiritualidade, educação, trabalho social, medicina holística, diplomacia, ativismo, liderança espiritual, psicologia transpessoal, escrita transformadora. Você brilha quando sua carreira está ligada a um propósito maior. Trabalhos puramente materiais e sem significado drenam sua alma. Você precisa sentir que o que faz importa, para além do salário.',
    relacionamentos: 'Você ama com uma generosidade que pode ser mal interpretada ou explorada. Frequentemente atrai pessoas que precisam de cura sem estar ainda prontas para reciprocidade. Aprenda a selecionar relações baseadas em troca real, não em necessidade. Suas relações mais profundas são espirituais, parcerias de alma, conexões que transcendem o convencional.',
    saude: 'Você absorve a dor do mundo, literalmente. Pontos de atenção: sistema imunológico (depleção por absorção emocional), pele (fronteiras permeáveis), circulação (bloqueios quando não libera emoções). Práticas: banhos de sal grosso, meditação de limpeza energética, tempo na natureza, terapias de liberação emocional (como constelação familiar).',
    espiritualidade: 'Você é profundamente espiritual por natureza, não como escolha, mas como condição. Busca o sagrado em tudo: na música, na dor, na beleza, na humanidade. Práticas de serviço, meditação de compaixão, rituais de fechamento de ciclos e trabalho com o karma ressoam profundamente. Cuide para que a espiritualidade seja fortalecedora, não mais uma forma de auto-sacrifício.',
    afirmacao: '"Eu sirvo ao mundo a partir da minha plenitude. Deixo ir com amor o que já cumpriu seu propósito."',
    sombra: 'Quando desequilibrado, o Caminho 9 pode tornar-se o resgatador compulsivo que não cuida de si, o amargo que perdeu a fé na humanidade, ou o que usa a espiritualidade como fuga da vida real.',
  },
  11: {
    titulo: 'Número Mestre 11. O Visionário',
    arquetipo: 'O Visionário',
    essencia: 'Você chegou a este plano com uma antena extraordinária para o invisível. Sua sensibilidade não é fraqueza, é um instrumento de captação de verdades que a maioria ainda não consegue perceber.',
    missao: 'Ser um canal de luz e inspiração, transformar sua sensibilidade elevada em uma força que desperta consciências. Aterrar as visões do plano espiritual em formas que o mundo possa tocar.',
    descricao: 'O Número Mestre 11 é o mais intuitivo de todos os caminhos. Você oscila entre os dons extraordinários do 11 e as tensões do 2 (sua forma reduzida). Sua vida é marcada por alternâncias de iluminação e escuridão, de picos de inspiração e vales de dúvida. Essa polaridade não é defeito, é o motor da sua evolução.',
    talentos: [
      'Intuição e percepção psíquica naturalmente elevadas',
      'Capacidade de inspirar e transformar pela presença e palavra',
      'Empatia profunda que permite entrar na frequência de qualquer pessoa',
      'Visão ampliada, enxerga além do aparente',
      'Liderança espiritual e capacidade de guiar crises coletivas',
      'Criatividade que toca o sagrado e transforma quem a experimenta',
    ],
    desafios: [
      'Hipersensibilidade que pode tornar-se ansiedade e nervosismo crônicos',
      'Oscilações emocionais intensas, do êxtase à depressão',
      'Sensação constante de "não pertencer" a este plano',
      'Dificuldade em aterrar visões em ação prática',
      'Absorção das emoções e energias do ambiente e das pessoas',
      'Idealismo excessivo que colide com a imperfeição da realidade',
    ],
    palavrasChave: ['intuição', 'inspiração', 'visão', 'espiritualidade', 'sensibilidade', 'canal', 'iluminação'],
    carreira: 'Espiritualidade, arte inspiradora, psicologia transpessoal, coaching de alto nível, escrita visionária, música, cinema, astrologia, numerologia, ensino transformacional, diplomacia, liderança de movimentos. Você não serve ao convencional, serve ao extraordinário. Sua carreira ideal está sempre ligada a elevar a consciência humana de alguma forma.',
    relacionamentos: 'Você precisa de profundidade em tudo, incluindo o amor. Relacionamentos superficiais não te sustentam. Sua sensibilidade pode tornar as relações intensas, e às vezes difíceis de manter por causa disso. Procure parceiros com maturidade emocional que não se assustem com sua profundidade. Aprenda a criar proteção energética sem fechar o coração.',
    saude: 'Seu sistema nervoso é seu calcanhar de Aquiles. Tudo impacta você mais do que aos outros. Práticas essenciais: meditação diária, proteção energética, contato com a natureza, sono de qualidade, redução de estímulos eletrônicos. Cuide especialmente do sistema nervoso, adrenais e sistema endócrino.',
    espiritualidade: 'Espiritualidade não é opcional para você, é sobrevivência. Sem uma prática consistente, você se perde na sensibilidade sem direcionamento. Meditação, canalização consciente, práticas de ancoragem, trabalho com guias espirituais e professores elevados. Você é naturalmente um canal, aprenda a usá-lo com intenção e proteção.',
    afirmacao: '"Eu sou um canal de luz. Minha sensibilidade é sagrada e eu a honro com sabedoria."',
    sombra: 'O 11 não integrado pode tornar-se um ser de promessa não cumprida, cheio de visões e insights que nunca se materializam, perdido entre o espiritual e o mundano, ansioso e desconectado.',
  },
  22: {
    titulo: 'Número Mestre 22. O Mestre Construtor',
    arquetipo: 'O Mestre Construtor',
    essencia: 'Você nasceu com a rara capacidade de transformar os maiores sonhos em realidade tangível. Seu potencial de impacto não é apenas pessoal, é civilizacional.',
    missao: 'Manifestar projetos de escala que deixem um legado real para a humanidade. Integrar a visão espiritual mais elevada com a capacidade prática mais poderosa.',
    descricao: 'O Número Mestre 22 combina a visão elevada do 11 com a força construtora do 4 (sua forma reduzida). Você é capaz de conceber e executar projetos que transformam a realidade coletiva. A tensão é enorme, a responsabilidade de um 22 pode ser esmagadora. Mas quando alinhado ao propósito, não há Caminho mais poderoso para criar legado.',
    talentos: [
      'Visão grandiosa combinada com capacidade de execução prática',
      'Liderança que inspira tanto quanto organiza',
      'Planejamento estratégico em escala que outros não conseguem conceber',
      'Capacidade de mobilizar recursos, pessoas e energias em torno de uma visão',
      'Resiliência e determinação para projetos de longa maturação',
      'Integração entre sabedoria espiritual e inteligência prática',
    ],
    desafios: [
      'Peso da responsabilidade pode tornar-se paralisante',
      'Perfeccionismo extremo que atrasa ou impede realizações',
      'Tensão entre a grandiosidade da visão e as limitações da realidade',
      'Tendência a assumir tudo sozinho, dificuldade em delegar com confiança',
      'Workaholism justificado pela grandeza da missão',
      'Negação das necessidades pessoais em nome do projeto maior',
    ],
    palavrasChave: ['legado', 'manifestação', 'escala', 'liderança', 'construção', 'impacto', 'visão prática'],
    carreira: 'Empreendedorismo de grande impacto, arquitetura, engenharia de sistemas, política transformacional, liderança de organizações internacionais, inovação social, criação de movimentos, fundações, ensino transformacional. Você não é feito para trabalhos pequenos, mas precisa aprender a começar pelo que é possível agora e escalar com sabedoria.',
    relacionamentos: 'Você precisa de parceiros que entendam o tamanho da missão que carrega. Relacionamentos são testados pela grandeza dos seus projetos. Aprenda a estar presente nas pequenas coisas, a grandeza começa no cotidiano. Seus parceiros precisam de você, não apenas do seu legado.',
    saude: 'Você tende a tratar a saúde como obstáculo à missão. Errado: sem saúde, não há missão. Cuide do coração, sistema nervoso central e da estrutura óssea. Pratique descanso profundo e rituais de recuperação com a seriedade de um atleta de alto rendimento.',
    espiritualidade: 'Sua espiritualidade é ancorada na ação transformadora. Você encontra Deus na capacidade de criar mundos melhores. Práticas que integram visão e ação: meditação de intenção global, journaling estratégico, rituais de alinhamento de missão. Conecte-se com tradições de grandes realizadores espirituais.',
    afirmacao: '"Eu sou o arquiteto de realidades melhores. Manifesto com sabedoria, amor e responsabilidade."',
    sombra: 'O 22 não integrado pode tornar-se um tirano benevolente, alguém que justifica qualquer meio pela grandeza dos fins, ou que colapsa sob o peso de uma missão que não consegue executar.',
  },
  33: {
    titulo: 'Número Mestre 33. O Mestre Curador',
    arquetipo: 'O Mestre Curador',
    essencia: 'Você nasceu com a mais elevada expressão do amor que existe neste plano. Sua presença cura, sua voz transforma e seu caminho é o de servir à ascensão coletiva.',
    missao: 'Curar e elevar a humanidade através do amor incondicional, do ensinamento e da compaixão ativa. Tornar-se um canal tão puro que a luz que passa por você transforma tudo que toca.',
    descricao: 'O Número Mestre 33 é o mais elevado dos caminhos. Combina a inspiração do 11, a grandeza do 22 e a bondade do 6. Pouquíssimas pessoas carregam verdadeiramente este número, e as que carregam têm uma responsabilidade proporcional. Sua vida é uma escola acelerada de amor em ação.',
    talentos: [
      'Amor incondicional que transcende julgamentos e condições',
      'Poder de cura, pela presença, pela voz ou pelo toque',
      'Sabedoria espiritual profunda e accessível',
      'Capacidade de ensinar verdades complexas de forma simples e transformadora',
      'Compaixão que alcança mesmo onde outros desistiram',
      'Criatividade a serviço da elevação humana',
    ],
    desafios: [
      'Absorção dos sofrimentos alheios de forma exaustiva',
      'Dificuldade em aceitar as próprias imperfeições',
      'Sacrifício excessivo que pode levar ao colapso',
      'Elevação de expectativas sobre si mesmo que se torna tirania interna',
      'Dificuldade em viver "normalmente", a vida ordinária parece insuficiente',
      'Sensação de responsabilidade pela felicidade dos outros',
    ],
    palavrasChave: ['cura', 'amor incondicional', 'serviço', 'ensinamento', 'compaixão', 'elevação', 'sacrifício sagrado'],
    carreira: 'Medicina holística, espiritualidade, ensinamento transformacional, liderança espiritual, artes que curam, psicologia transpessoal, trabalho com populações vulneráveis, liderança de comunidades de cura. Qualquer carreira que seja veículo de amor e transformação.',
    relacionamentos: 'Você ama de uma forma que poucos conseguem receber ou retribuir adequadamente. Aprenda a encontrar parceiros que caminhem no mesmo nível de amadurecimento. Você precisa ser tão cuidado(a) quanto cuida.',
    saude: 'Seu maior risco é o esgotamento total por falta de limites. Pratique o autocuidado sagrado. Cuide do coração, da imunidade e do equilíbrio hormonal. O descanso é sua prática espiritual mais importante.',
    espiritualidade: 'Você é espiritualidade em movimento. Sua vida inteira é uma prática. Conecte-se com tradições de cura, com mestres reais, com comunidades que sustentam seu crescimento sem te colocar num pedestal.',
    afirmacao: '"Eu sou amor em ação. Cuido do mundo a partir da minha plenitude sagrada."',
    sombra: 'O 33 não integrado pode tornar-se o mártir supremo, aquele que sacrifica tudo e não encontra paz, ou que usa a "missão espiritual" como justificativa para não viver sua própria humanidade.',
  },
}

// ─── Análises do Ano Universal ──────────────────────────────────────────────

export const ANOS_UNIVERSAIS: Record<number, AnaliseUniversal> = {
  1: {
    titulo: 'Ano Universal 1. Começo e Inovação Coletiva',
    temaGeral: 'Começo, inovação, liderança, reinvenção coletiva',
    climaColetivo: 'Espírito empreendedor coletivo, iniciativas novas, estruturas sendo reconfiguradas. Sociedades tendem a priorizar independência, startups, reformas institucionais e novos paradigmas.',
    oportunidades: 'Lançar projetos, liderar mudanças, iniciar carreira, arriscar com novas ideias',
    desafios: 'Egoísmo coletivo, fragmentação, isolamento em nome de autonomia',
    comoAproveitar: 'Assumir responsabilidade, agir com coragem, estruturar planos de longo prazo, evitar impulsividade'
  },
  2: {
    titulo: 'Ano Universal 2. Cooperação e Diplomacia',
    temaGeral: 'Cooperação, diplomacia, parceria, sensibilidade coletiva',
    climaColetivo: 'Foco em diálogos, acordos, negociações internacionais e reconciliações. O coletivo pede pausa, escuta e colaboração.',
    oportunidades: 'Trabalhar em equipe, formar alianças, desenvolver empatia, curar relações',
    desafios: 'Indecisão coletiva, excesso de dependência, passividade',
    comoAproveitar: 'Cultivar escuta ativa, parcerias estratégicas, nutrir relações e equilibrar autoafirmação com sensibilidade'
  },
  3: {
    titulo: 'Ano Universal 3. Criatividade e Comunicação',
    temaGeral: 'Criatividade, comunicação, expressão, entretenimento e celebração',
    climaColetivo: 'Movimentos artísticos florescem, ênfase em mídia e comunicação. Humor, leveza e expressão coletiva são valorizados.',
    oportunidades: 'Expressão criativa, campanhas de comunicação, lançamento de conteúdo transformador',
    desafios: 'Dispersão coletiva, superficialidade, excessos festivos',
    comoAproveitar: 'Criar com propósito, comunicar com clareza, usar storytelling para divulgar ideias que importam'
  },
  4: {
    titulo: 'Ano Universal 4. Estrutura e Disciplina',
    temaGeral: 'Estrutura, trabalho duro, disciplina, construção de bases sólidas',
    climaColetivo: 'Foco coletivo em produtividade, regulamentações e construção de infraestrutura. Ano de trabalho, não de expansão fácil.',
    oportunidades: 'Consolidar processos, trabalhar na base de projetos, disciplina financeira e organização sistêmica',
    desafios: 'Rigidez coletiva, resistência à mudança, sobrecarga de trabalho',
    comoAproveitar: 'Organizar, sistematizar, priorizar tarefas e cuidar da saúde para manter ritmo sustentável'
  },
  5: {
    titulo: 'Ano Universal 5. Mudança e Liberdade',
    temaGeral: 'Mudança, liberdade, movimento, intercâmbio cultural e tecnológico',
    climaColetivo: 'Transformações rápidas e inesperadas. Inovações tecnológicas, movimentos sociais e revisões de paradigmas marcam o ano.',
    oportunidades: 'Explorar, adaptar-se, aproveitar oportunidades inesperadas, expandir horizontes',
    desafios: 'Instabilidade coletiva, dispersão, comportamentos impulsivos e riscos mal calculados',
    comoAproveitar: 'Ser flexível, aprender rápido, estar aberto ao inesperado mas manter âncoras de estabilidade'
  },
  6: {
    titulo: 'Ano Universal 6. Responsabilidade e Harmonia',
    temaGeral: 'Responsabilidade, família, comunidade, harmonia doméstica e social',
    climaColetivo: 'Atenção coletiva a questões familiares, políticas sociais de saúde e educação. Foco no cuidado e na comunidade.',
    oportunidades: 'Fortalecer laços, projetos com propósito social, reconciliações, formalizar compromissos',
    desafios: 'Paternalismo coletivo, responsabilidade excessiva, sacrifício sem limites',
    comoAproveitar: 'Equilibrar cuidar dos outros e de si, assumir responsabilidades com limites claros e consciência'
  },
  7: {
    titulo: 'Ano Universal 7. Introspecção e Conhecimento',
    temaGeral: 'Introspecção, estudo, espiritualidade, pesquisa e ciência',
    climaColetivo: 'Busca coletiva por conhecimento profundo, espiritualidade e ciência reflexiva. Período favorável a descobertas.',
    oportunidades: 'Estudos, retiros, investigação, desenvolvimento intelectual e espiritual',
    desafios: 'Isolamento coletivo, ceticismo excessivo, frieza emocional',
    comoAproveitar: 'Aprofundar-se, meditar, estudar, investir em desenvolvimento interno e pesquisa de ponta'
  },
  8: {
    titulo: 'Ano Universal 8. Poder e Abundância',
    temaGeral: 'Poder, abundância, negócios, resultados materiais e karma financeiro coletivo',
    climaColetivo: 'Foco em economia, finanças, liderança corporativa e decisões de grande impacto econômico. Ano de colheita proporcional ao que foi plantado.',
    oportunidades: 'Crescimento financeiro estruturado, promoção, negócios que escalam com ética',
    desafios: 'Ganância coletiva, corrupção, desigualdade e abuso de poder',
    comoAproveitar: 'Planejar negócios, assumir liderança ética, negociar com visão financeira de longo prazo'
  },
  9: {
    titulo: 'Ano Universal 9. Conclusão e Transformação',
    temaGeral: 'Conclusão, encerramento de ciclos coletivos, compaixão e transformação profunda',
    climaColetivo: 'Fechamento de eras, liberação coletiva do que não serve mais. Foco em causas humanitárias e revisão de legados.',
    oportunidades: 'Terminar projetos históricos, movimentos sociais de transformação, reflexão sobre legado coletivo',
    desafios: 'Tristeza coletiva, sensação de perda, dificuldade em desapegar do familiar',
    comoAproveitar: 'Finalizar com dignidade, participar de causas filantrópicas, preparar terreno para o novo ciclo'
  },
  11: {
    titulo: 'Ano Universal 11. Intuição e Inspiração Coletiva',
    temaGeral: 'Intuição coletiva, canal espiritual, inspiração e despertar',
    climaColetivo: 'Momentos de grande sensibilidade coletiva, insights compartilhados, inspiração artística e espiritual. Ano de sinais e revelações.',
    oportunidades: 'Movimentos inspiradores, liderança espiritual, causas que tocam emoções profundas coletivamente',
    desafios: 'Volatilidade emocional coletiva, idealismo sem base prática',
    comoAproveitar: 'Ouvir a intuição coletiva, ativar projetos que unam arte e transcendência, disciplinar ideias em ação'
  },
  22: {
    titulo: 'Ano Universal 22. Manifestação em Grande Escala',
    temaGeral: 'Manifestar em grande escala, projetos de impacto estrutural civilizacional',
    climaColetivo: 'Capacidade coletiva de transformar visões grandiosas em estruturas tangíveis. Grandes projetos e reformas de impacto duradouro.',
    oportunidades: 'Grandes obras, reformas estruturais, iniciativas com impacto civilizacional duradouro',
    desafios: 'Responsabilidade esmagadora coletiva, falhar por falta de planejamento',
    comoAproveitar: 'Planejamento estratégico rigoroso, trabalho em equipe com altos padrões, traduzir visão em etapas práticas'
  }
}

// ─── Análises do Ano Pessoal ─────────────────────────────────────────────────

export const ANOS_PESSOAIS: Record<number, AnaliseNumero> = {
  1: {
    titulo: 'Ano Pessoal 1. Inícios, Autonomia e Liderança',
    descricao: 'O Ano Pessoal 1 traz a energia de sementeira, iniciativa e autoconfiança. É um ciclo favorável para começos, projetos individuais e assumir papel de liderança. Este é o ano em que você planta as sementes do novo ciclo de 9 anos que se inicia.',
    essencia: 'Você é o pioneiro da sua própria vida neste ano. A energia do 1 te convoca a ser protagonista, tomar decisões corajosas e confiar em sua visão única. É tempo de parar de esperar permissão e começar a agir com determinação.',
    detalhado: `Propósito central: Recomeço consciente, autoafirmação autêntica e desenvolvimento de liderança pessoal.

Temas principais:
• INÍCIOS ESTRATÉGICOS: Não se trata de começar por começar, mas de plantar sementes que você quer ver florescer nos próximos 9 anos. Escolha com consciência o que inaugura agora.

• AUTONOMIA VERDADEIRA: Aprenda a confiar profundamente em suas escolhas. Este ano te ensina que você não precisa de validação externa para seguir seu caminho.

• VISIBILIDADE E PRESENÇA: Oportunidade única para se destacar em sua área. Sua voz, suas ideias e sua marca pessoal ganham força natural.

• CORAGEM CALCULADA: Não é impulsividade, mas coragem fundamentada. Arrisque-se, mas com planejamento. Seja ousado(a), mas não inconsequente.`,
    temas: {
      carreira: 'Ano dourado para iniciar negócios próprios, lançar projetos inovadores, assumir papéis de liderança. Oportunidades surgem para quem age com iniciativa e clareza de propósito.',
      financas: 'Momento para assumir riscos calculados e iniciar planos de renda nova. Invista em sua independência financeira. Cuidado com gastos impulsivos, mantenha orçamento estruturado.',
      relacionamentos: 'Começo de novos ciclos afetivos ou renovação profunda de dinâmicas existentes. Necessidade aumentada de espaço pessoal. Relações que limitam sua individualidade podem chegar ao fim.',
      saude: 'Energia vital renovada e forte. Excelente para começar rotina de exercícios ou programa de saúde. Atenção à cabeça (enxaquecas por estresse) e ao gerenciamento de impulsos.',
      desenvolvimento: 'Foco em autoconfiança, autodisciplina e liderança. Invista em cursos que desenvolvam sua "voz" única no mundo.',
      espiritualidade: 'Conexão com o EU Superior através da ação consciente. Afirmações de poder, visualizações criativas e meditações ativas são suas práticas mais poderosas.'
    },
    desafios: ['Arrogância por conquistas iniciais', 'Impaciência com processos lentos', 'Iniciar múltiplos projetos sem finalizar', 'Impulsividade financeira disfarçada de coragem'],
    palavrasChave: ['começo', 'iniciativa', 'autonomia', 'liderança', 'coragem', 'pioneirismo', 'ação'],
    afirmacoes: ['Eu sou o autor(a) da minha própria vida', 'Minhas ideias têm valor e merecem ser manifestadas', 'Eu lidero minha vida com coragem e sabedoria'],
    praticasSugeridas: ['Journaling diário sobre decisões e ações tomadas', 'Exercícios físicos de força e presença', 'Networking intencional com líderes da sua área'],
    areasDeAtencao: ['Equilibrar autonomia com colaboração saudável', 'Pedir ajuda quando necessário', 'Cultivar paciência com processos que não dependem só de você']
  },
  2: {
    titulo: 'Ano Pessoal 2. Parcerias, Sensibilidade e Diplomacia',
    descricao: 'O Ano Pessoal 2 pede pausa, escuta e cooperação. Depois do impulso do 1, o 2 convida a cultivar relações, refinar o que foi iniciado e desenvolver paciência estratégica.',
    essencia: 'Este é o ano do "nós". Sua força virá da cooperação, da diplomacia e da sua capacidade de se tornar indispensável através das relações. Não é um ano de ação individual solitária, é de tecer redes.',
    detalhado: `Propósito central: Cultivar parcerias autênticas, aprofundar sensibilidade emocional e aprender a negociar sem perder-se. Temas principais: • PARCERIAS ESTRATÉGICAS: As sementes plantadas no Ano 1 precisam de colaboradores para florescer. Identifique quem pode ser um parceiro genuíno, em negócios, projetos e na vida pessoal. • PACIÊNCIA COMO ESTRATÉGIA: O 2 ensina que nem tudo precisa de ação imediata. Esperar o momento certo, observar e acumular informações é um poder silencioso que poucos dominam. • INTELIGÊNCIA EMOCIONAL: Suas percepções emocionais estão aguçadas. Use essa sensibilidade para entender o que está além das palavras, nas negociações, nas relações e em você mesmo(a). • DIPLOMACIA: Conflitos não resolvidos pedem atenção. Este é o momento de reparar pontes, negociar acordos e curar relações que precisam de atenção.`,
    temas: {
      carreira: 'Excelente para negociações, formação de parcerias e trabalho colaborativo. Projetos em equipe avançam bem. Evite decisões unilaterais em assuntos que envolvem outros.',
      financas: 'Momento de consolidar e compartilhar responsabilidades financeiras. Bom para revisar orçamentos, negociar contratos e criar reservas junto com parceiros ou sócios.',
      relacionamentos: 'Ano de grande profundidade nas relações. Conexões se fortalecem ou se transformam definitivamente. Casamentos, parcerias formais e reconciliações são favorecidos.',
      saude: 'Cuide do equilíbrio emocional. Ansiedade por indecisão pode manifestar-se no corpo. Práticas de grupo, yoga em grupo, danças circulares, terapias em grupo, são especialmente benéficas.',
      desenvolvimento: 'Desenvolva escuta ativa e empatia profunda. Pratique comunicação não-violenta. Aprenda a distinguir intuição de projeção emocional.',
      espiritualidade: 'Espiritualidade em comunidade. Retiros com grupos, práticas de meditação em dupla, trabalhos de cura de relacionamentos e conexão com o feminino divino.'
    },
    desafios: ['Dependência emocional de parceiros', 'Procrastinação por indecisão', 'Medo de conflitos que leva à omissão', 'Perder-se nos outros e esquecer suas próprias necessidades'],
    palavrasChave: ['parceria', 'sensibilidade', 'diplomacia', 'paciência', 'cooperação', 'escuta', 'relação'],
    afirmacoes: ['Eu construo pontes com amor e clareza', 'Minha sensibilidade é uma força, não uma fraqueza', 'Eu coopero e também me afirmo com equilíbrio'],
    praticasSugeridas: ['Meditação de escuta ativa diária', 'Journaling sobre sentimentos e relações', 'Terapia individual ou de casal'],
    areasDeAtencao: ['Estabelecer limites claros mesmo sendo diplomático(a)', 'Não sacrificar suas necessidades para manter a paz', 'Cuidar da saúde emocional proativamente']
  },
  3: {
    titulo: 'Ano Pessoal 3. Expressão, Criatividade e Expansão Social',
    descricao: 'O Ano Pessoal 3 traz leveza, criatividade e expansão. Depois de consolidar bases no 2, agora é hora de florescer, comunicar, criar, celebrar e expandir sua rede de influência.',
    essencia: 'Este é seu ano de florescer visivelmente. A energia do 3 favorece quem se arrisca a mostrar-se, compartilhar criações e viver com mais leveza e alegria intencional.',
    detalhado: `Propósito central: Expressar o que foi interno, comunicar com autenticidade e expandir através da criatividade. Temas principais: • EXPRESSÃO CRIATIVA: Seja em que forma for, escrita, fala, música, dança, projetos visuais, este é o ano de criar e compartilhar. O que estava esperando "o momento certo"? Esse momento é agora. • SOCIALIZAÇÃO INTENCIONAL: Sua rede de contatos se expande naturalmente. Aproveite para cultivar conexões que alimentam tanto profissionalmente quanto emocionalmente. • COMUNICAÇÃO TRANSFORMADORA: Suas palavras têm impacto elevado. Discursos, publicações, conteúdo digital, apresentações, tudo que você comunicar com autenticidade reverbera mais longe. • ALEGRIA COMO PRÁTICA: Não como superficialidade, mas como escolha consciente. Cultivar alegria em um mundo pesado é um ato de resistência e generosidade.`,
    temas: {
      carreira: 'Excelente para marketing, vendas, comunicação, artes, educação e produção de conteúdo. Lançar cursos, livros, canais, serviços criativos. Sua presença pública se fortalece.',
      financas: 'Oportunidades de monetizar criatividade e talentos. Cuidado com gastos impulsivos por entusiasmo do momento. Monetize de forma estruturada.',
      relacionamentos: 'Sua sociabilidade atrai novas conexões significativas. Romance pode surgir naturalmente. Relações existentes ganham leveza e comunicação melhora.',
      saude: 'Bem-estar melhora com atividades criativas e expressivas. Dança, teatro, artes plásticas como terapia. Cuide da garganta e sistema respiratório.',
      desenvolvimento: 'Foco em comunicação e presença. Invista em curso de oratória, escrita criativa, artes expressivas. Desenvolva coragem de aparecer.',
      espiritualidade: 'Espiritualidade pela alegria, beleza e expressão artística. Canto sagrado, mandalas, rituais criativos. O sagrado se manifesta através da beleza que você cria.'
    },
    desafios: ['Dispersão em muitos projetos simultaneamente', 'Superficialidade nas relações por excesso de socialização', 'Gastos impulsivos em momentos de entusiasmo', 'Hipersensibilidade a críticas'],
    palavrasChave: ['expressão', 'criatividade', 'alegria', 'comunicação', 'expansão', 'arte', 'sociabilidade'],
    afirmacoes: ['Minha expressão tem valor e cura o mundo', 'Eu me permito ser visto(a) e celebrado(a)', 'Eu crio com alegria e propósito'],
    praticasSugeridas: ['Prática criativa diária (escrever, desenhar, cantar)', 'Participar de grupos criativos ou artísticos', 'Publicar ou compartilhar uma criação por semana'],
    areasDeAtencao: ['Escolher qualidade sobre quantidade de projetos', 'Aprofundar relações em vez de apenas ampliar rede', 'Equilibrar leveza com profundidade']
  },
  4: {
    titulo: 'Ano Pessoal 4. Estrutura, Disciplina e Construção',
    descricao: 'O Ano Pessoal 4 é o alicerce do ciclo. Depois de expressar e expandir no 3, agora é hora de estruturar, organizar e construir bases sólidas para o que virá.',
    essencia: 'Este é o ano do trabalho honesto e da construção metódica. Não é glamouroso, mas é o mais importante: sem alicerces sólidos, os sonhos do 1 e a expressão do 3 não têm onde pousar.',
    detalhado: `Propósito central: Construir com método, disciplina e comprometimento as estruturas que sustentarão o ciclo inteiro. Temas principais: • ORGANIZAÇÃO COMO PODER: Organize finanças, documentos, projetos e rotinas. O que está bagunçado drena energia sem que você perceba. A arrumação externa reflete e cria a interna. • TRABALHO CONSISTENTE: Não é um ano de flashes de genialidade, é de resultados construídos tijolo a tijolo. Respeite o processo. O que você construir aqui durará. • SAÚDE COMO FUNDAÇÃO: Cuide do corpo com a seriedade de quem sabe que é seu único veículo de manifestação. Rotinas de exercício, sono e alimentação constroem a base para tudo mais. • PLANEJAMENTO DE LONGO PRAZO: Pense em horizontes de 3 a 5 anos. O que você quer ter construído? Mapeie o caminho hoje.`,
    temas: {
      carreira: 'Foco em trabalho duro, aperfeiçoamento técnico e consolidação de processos. Não é ano de mudanças bruscas, mas de aprofundamento. Certifications, especializações e sistemas são bem-vindos.',
      financas: 'Poupar, criar reservas de emergência, organizar investimentos e eliminar dívidas. Decisões financeiras conservadoras e estruturadas. Excelente para planejamento de longo prazo.',
      relacionamentos: 'Relações são testadas pela rotina e pela presença real. As que sobrevivem a este ano são sólidas. Compromissos sérios e formalizações são possíveis.',
      saude: 'Excelente para criar rotinas de saúde sustentáveis. Corpo, alimentação, sono, estruture tudo. Atenção a joelhos e coluna (estrutura física como espelho da psíquica).',
      desenvolvimento: 'Habilidades técnicas e gestão de projetos. Cursos práticos, certificações, mentoria de especialistas. Aprenda a fazer bem o que já faz.',
      espiritualidade: 'Espiritualidade estruturada: rituais diários fixos, meditação de horário definido, journaling disciplinado. O sagrado no cotidiano organizado.'
    },
    desafios: ['Rigidez excessiva que impede adaptação necessária', 'Perfeccionismo que paralisa progresso', 'Sobrecarga de trabalho sem descanso', 'Frustração quando o progresso parece lento'],
    palavrasChave: ['disciplina', 'estrutura', 'método', 'construção', 'trabalho', 'organização', 'persistência'],
    afirmacoes: ['Eu construo minha vida com método e dedicação', 'Minha disciplina cria a liberdade que desejo', 'Cada tijolo que coloco hoje é a fundação do meu futuro'],
    praticasSugeridas: ['Sistema de metas semanais e mensais', 'Organização financeira com planner dedicado', 'Rotina de exercícios consistente por pelo menos 30 dias'],
    areasDeAtencao: ['Permitir flexibilidade dentro da estrutura', 'Incluir descanso e prazer no planejamento', 'Não negligenciar relações em favor do trabalho']
  },
  5: {
    titulo: 'Ano Pessoal 5. Mudanças, Liberdade e Expansão',
    descricao: 'O Ano Pessoal 5 traz movimento, transformações e oportunidades inesperadas. Depois de construir no 4, o 5 quebra o que ficou rígido e abre novos horizontes.',
    essencia: 'Este é o ano das transformações que você precisava mas talvez não tenha pedido. O 5 não pede permissão, ele simplesmente muda o cenário. Sua tarefa é surfar essa onda com graça.',
    detalhado: `Propósito central: Liberdade consciente, adaptação criativa e expansão através da experiência direta. Temas principais: • MUDANÇAS COMO MESTRA: Neste ano, o inesperado é o planejado. Resistir à mudança será mais custoso do que abraçá-la. Desenvolva confiança na vida como um processo inteligente. • LIBERDADE RESPONSÁVEL: Liberdade não é ausência de compromissos, é a capacidade de viver com autenticidade mesmo dentro das estruturas necessárias. Revise o que te limita desnecessariamente. • NOVAS EXPERIÊNCIAS: Saia da zona de conforto com intenção. Viaje, conheça pessoas diferentes, experimente formas de trabalho ou relacionamento que ainda não experimentou. A expansão vem da experiência. • VERSATILIDADE: Sua capacidade de adaptação é seu maior ativo este ano. Quem se agarra ao que era antes do 5 tende a sofrer mais.`,
    temas: {
      carreira: 'Mudanças de emprego, pivôs de negócio, novas oportunidades inesperadas. Esteja aberto(a) a ofertas que pareçam "fora do planejado". A vida o(a) está redirecionando.',
      financas: 'Possibilidade de ganhos inesperados, mas também de perdas por impulsividade. Contratos curtos, projetos por demanda. Mantenha uma reserva maior neste ano.',
      relacionamentos: 'Novos encontros significativos, maior necessidade de liberdade nas relações existentes. Relacionamentos que sufocam podem chegar ao fim.',
      saude: 'Atividades dinâmicas e variadas. Evite sedentarismo. Cuide do sistema nervoso, priorize práticas que reduzam ansiedade gerada pelas mudanças.',
      desenvolvimento: 'Idiomas, culturas diferentes, habilidades tecnológicas emergentes. Quanto mais diverso o aprendizado, melhor para este ano.',
      espiritualidade: 'Espiritualidade de liberdade: nature journeys, retiros de aventura, práticas de diferentes tradições. Expanda sua visão do sagrado.'
    },
    desafios: ['Inconsistência e abandono de projetos antes do tempo', 'Impulsividade financeira ou relacional', 'Resistência à mudança necessária', 'Dispersão em muitas direções sem concluir nada'],
    palavrasChave: ['mudança', 'liberdade', 'aventura', 'adaptação', 'expansão', 'movimento', 'versatilidade'],
    afirmacoes: ['Eu confio na inteligência das mudanças em minha vida', 'Minha liberdade é consciente e responsável', 'Eu me adapto com graça e aprendo com tudo'],
    praticasSugeridas: ['Planejamento flexível com revisões semanais', 'Pelo menos uma nova experiência significativa por mês', 'Meditação de desapego e confiança'],
    areasDeAtencao: ['Distinguir fuga saudável de fuga irresponsável', 'Honrar compromissos existentes mesmo com o espírito livre', 'Ancorar as mudanças em valores claros']
  },
  6: {
    titulo: 'Ano Pessoal 6. Amor, Responsabilidade e Harmonia',
    descricao: 'O Ano Pessoal 6 traz foco nas relações próximas, família e responsabilidades afetivas. Depois das mudanças do 5, o 6 pede retorno ao lar, interno e externo.',
    essencia: 'Este é o ano do amor em ação. Não o amor romântico e idealizado, mas o amor que serve, que cuida, que constrói harmonia no cotidiano. Sua capacidade de cuidar está em evidência.',
    detalhado: `Propósito central: Responsabilidade amorosa, harmonia nos relacionamentos e serviço ao bem-estar coletivo próximo. Temas principais: • FAMÍLIA E LAR: Questões familiares pedem atenção, seja para fortalecer vínculos, resolver conflitos antigos ou redesenhar dinâmicas. O lar interno (sua paz) e o externo (seu espaço físico) pedem cuidado. • COMPROMISSO COM AMOR: Formalização de relacionamentos, casamentos, parcerias. Também é o momento de clarificar compromissos que existem de fato (sem papel formal) ou de finalizar o que já não tem substância. • BELEZA E ESTÉTICA: O 6 é o número da beleza. Cuide do seu ambiente físico. Redecorações, renovações, organização do espaço impactam diretamente seu bem-estar emocional. • LIMITES COM AMOR: Dizer não quando necessário, sem culpa, é um ato de amor, por você e pelos outros. Aprenda este equilíbrio sofisticado.`,
    temas: {
      carreira: 'Trabalhos com propósito social, saúde, educação e cuidado ganham destaque. Equilibrar vida profissional e familiar é o desafio central. Não negligencie as relações pelo trabalho.',
      financas: 'Foco em estabilidade financeira familiar. Planejamento conjunto para lar, educação dos filhos, ou cuidado de pais. Investimentos em imóveis são favorecidos.',
      relacionamentos: 'Ano de grande intensidade afetiva. Compromissos se aprofundam ou se encerram. Casamentos e parcerias formais são possíveis. Família ganha centralidade.',
      saude: 'Equilíbrio emocional é fundamental. Cuide do coração, órgão e chakra. Práticas de autocuidado como prioridade, não luxo.',
      desenvolvimento: 'Inteligência emocional, comunicação compassiva, limites saudáveis. Terapia familiar ou de casais pode ser transformadora.',
      espiritualidade: 'Devoção, práticas de cura familiar, constelação familiar, rituais de lar. Conecte o sagrado com o cotidiano através do cuidado.'
    },
    desafios: ['Auto-sacrifício que esgota sem nutrir', 'Interferência excessiva na vida dos outros', 'Perfeccionismo nas relações que gera cobranças', 'Negligenciar as próprias necessidades'],
    palavrasChave: ['amor', 'responsabilidade', 'família', 'harmonia', 'cuidado', 'beleza', 'compromisso'],
    afirmacoes: ['Eu cuido de mim para poder cuidar melhor do mundo', 'Meu amor inclui limites saudáveis', 'Eu crio harmonia sem me perder'],
    praticasSugeridas: ['Rituais de lar e família', 'Terapia individual ou familiar', 'Autocuidado sistemático (corpo, mente, espaço)'],
    areasDeAtencao: ['Equilibrar dar e receber', 'Não assumir responsabilidades que são dos outros', 'Cuidar da saúde com a mesma dedicação que cuida dos outros']
  },
  7: {
    titulo: 'Ano Pessoal 7. Interiorização, Estudo e Espiritualidade',
    descricao: 'O Ano Pessoal 7 convida ao recolhimento, à pesquisa e ao aprofundamento. Depois do intenso 6, o 7 pede silêncio, estudo e reconexão com a dimensão interior da vida.',
    essencia: 'Este é o ano de ir fundo, em conhecimento, em autoconhecimento, em espiritualidade. O mundo externo desacelera intencionalmente para que o mundo interno possa falar.',
    detalhado: `Propósito central: Aprofundamento intelectual e espiritual, refinamento interno e planejamento estratégico baseado em sabedoria. Temas principais: • ESTUDO PROFUNDO: Não é ano de lançamentos e expansão, é de aprofundamento. Especialização, pesquisa, leituras transformadoras. O que você aprende agora alimentará os próximos ciclos. • INTROSPECÇÃO: Pratique autoconhecimento com seriedade. Terapia, journaling, meditação, retiros. As respostas que você precisa estão dentro, não fora. • PLANEJAMENTO ESTRATÉGICO: O 7 é excelente para planejar o que virá no 8 (ano de colheita). Pesquise, avalie, refine. Decisões tomadas com pesquisa profunda aqui terão resultados excepcionais no próximo ciclo. • SELETIVIDADE SOCIAL: Reduza compromissos que drenam sem nutrir. A quantidade de relações cede lugar para a qualidade da presença.`,
    temas: {
      carreira: 'Especialização, pesquisa, análise estratégica. Não é o melhor ano para lançamentos públicos, mas é ideal para preparar o terreno do próximo ciclo com conhecimento profundo.',
      financas: 'Reavaliar e planejar. Pesquisar investimentos com profundidade antes de agir. Momento de consolidar, não de especular. Contrate assessoria especializada.',
      relacionamentos: 'Menor intensidade social é natural. Prefira poucos relacionamentos profundos. Parceiros intelectualmente compatíveis ganham destaque. Introspecção solitária pode gerar tensão em relações.',
      saude: 'Sono e recuperação profunda são essenciais. Retiros, meditação, práticas restaurativas. Atenção ao isolamento que pode evoluir para depressão.',
      desenvolvimento: 'Mestrados, especializações, cursos de filosofia, psicologia ou espiritualidade. Leituras de alta densidade. Mentoria com especialistas.',
      espiritualidade: 'Este é o ano mais espiritual do ciclo. Meditação profunda, retiros de silêncio, estudos esotéricos e filosóficos. Conecte-se com sua prática espiritual mais profunda.'
    },
    desafios: ['Isolamento social que evolui para solidão', 'Análise paralisante sem ação', 'Cinismo ou pessimismo sobre o futuro', 'Frieza emocional percebida pelos próximos'],
    palavrasChave: ['introspecção', 'estudo', 'espiritualidade', 'análise', 'conhecimento', 'recolhimento', 'sabedoria'],
    afirmacoes: ['Eu me aprofundo com coragem e curiosidade', 'Meu silêncio é produtivo e sagrado', 'Eu planejo com sabedoria para colher com abundância'],
    praticasSugeridas: ['Meditação diária de pelo menos 20 minutos', 'Leitura de pelo menos 1 livro transformador por mês', 'Retiro de silêncio de pelo menos 1 fim de semana'],
    areasDeAtencao: ['Não confundir introspecção saudável com isolamento destrutivo', 'Manter conexões essenciais mesmo no período de recolhimento', 'Traduzir o conhecimento em planos concretos']
  },
  8: {
    titulo: 'Ano Pessoal 8. Poder, Realização e Prosperidade',
    descricao: 'O Ano Pessoal 8 é o ano da colheita. Depois de planejar no 7, agora é hora de agir com poder, foco e determinação para concretizar resultados materiais e profissionais.',
    essencia: 'Este é o ano em que o esforço de ciclos anteriores se materializa. O 8 não dá presentes, ele amplifica o que foi construído. Se a fundação é sólida, a colheita é abundante.',
    detalhado: `Propósito central: Manifestação material, liderança executiva e alinhamento entre poder pessoal e propósito. Temas principais: • COLHEITA PROPORCIONAL: Você colhe o que plantou nos ciclos anteriores. Este é o momento de exigir o que é seu, promoções, contratos, reconhecimento e crescimento financeiro. • LIDERANÇA EXECUTIVA: Assuma posições de liderança e responsabilidade. O 8 favorece quem age com autoridade e ética. Liderança com integridade gera resultados duradouros. • PODER PESSOAL: Trabalhe sua relação com poder, dinheiro e autoridade. O 8 amplifica desequilíbrios nessa área. Se você tem medo de dinheiro ou poder, eles fugirão. Se os busca por insegurança, voltarão para ensiná-lo(a). • GESTÃO ESTRATÉGICA: Planejamento financeiro detalhado, auditorias, contratos claros. Este é o ano de tratar negócios como negócios, com profissionalismo e visão.`,
    temas: {
      carreira: 'Promoções, negócios escaláveis, negociações importantes, liderança executiva. Melhor ano para expansão profissional e financeira. Aja com autoridade e ética.',
      financas: 'Ano de ganhos significativos quando bem canalizado. Expansão patrimonial, investimentos estruturados, fechamento de grandes contratos. Evite atalhos antiéticos.',
      relacionamentos: 'Relações são testadas pela ambição e pelo poder. Parceiros precisam de segurança para não se sentir ofuscados. Equilíbrio entre ambição e presença afetiva é essencial.',
      saude: 'Risco de burnout executivo. Cuide do coração e do sistema cardiovascular. Pratique descanso com a disciplina que trata as metas profissionais.',
      desenvolvimento: 'Liderança, gestão financeira, negociação, inteligência executiva. Mentoria com líderes que você admira. Desenvolva capacidade de delegar.',
      espiritualidade: 'Integrar prosperidade material e espiritual. Gratidão e filantropia como práticas. Entenda que abundância é um estado de consciência antes de ser um estado de conta.'
    },
    desafios: ['Ganância e busca de poder como fim em si mesmo', 'Workaholism que prejudica saúde e relações', 'Estresse intenso por responsabilidades enormes', 'Conflitos de poder com outros'],
    palavrasChave: ['poder', 'prosperidade', 'realização', 'autoridade', 'colheita', 'liderança', 'sucesso'],
    afirmacoes: ['Eu manifesto prosperidade com ética e propósito', 'Meu poder serve ao bem maior', 'Eu colho o que plantei com sabedoria'],
    praticasSugeridas: ['Planejamento financeiro detalhado trimestral', 'Mentoria com líder que admira', 'Prática de gratidão e filantropia regular'],
    areasDeAtencao: ['Não sacrificar saúde e relações pelo sucesso material', 'Agir com ética mesmo sob pressão', 'Usar poder para elevar os outros, não apenas a si mesmo(a)']
  },
  9: {
    titulo: 'Ano Pessoal 9. Conclusões, Liberação e Transformação',
    descricao: 'O Ano Pessoal 9 encerra o ciclo de 9 anos. É tempo de finalizar, libertar e preparar terreno para o novo começo que virá com o Ano Pessoal 1.',
    essencia: 'Este é o ano da sabedoria que vem do desapego. Não é o fim, é a preparação sagrada para um começo completamente novo. O que você liberar aqui criará espaço para o extraordinário.',
    detalhado: `Propósito central: Encerramento consciente de ciclos, liberação do que não serve mais e preparação do terreno para o novo. Temas principais: • ENCERRAMENTOS NECESSÁRIOS: Projetos, relacionamentos, crenças, padrões de comportamento, o que ainda não foi finalizado pede atenção. Não arraste para o próximo ciclo o que precisa ser encerrado aqui. • LIBERAÇÃO E DESAPEGO: Pratique o desapego ativo. Doe o que não usa, perdoe quem ainda carrega, complete processos inacabados. Cada liberação cria espaço para o novo. • COMPAIXÃO UNIVERSAL: O 9 expande o coração para além do ego individual. Causas maiores, contribuição social, humanitarismo. Sua presença em serviço ao coletivo tem impacto ampliado. • SABEDORIA DO CICLO: Reflita sobre os 9 anos que passaram. O que aprendeu? O que construiu? O que precisa levar para o próximo ciclo e o que deve ficar para trás?`,
    temas: {
      carreira: 'Finalizar projetos longos, preparar transições, encerrar ciclos profissionais. Não é o melhor ano para grandes lançamentos novos, mas é excelente para consolidar legado.',
      financas: 'Liquidar dívidas e pendências, reorganizar patrimônio, desinvestir de ativos que não fazem mais sentido. Libere o que drena para receber o novo.',
      relacionamentos: 'Encerramentos e reconciliações. Relações chegam ao fim de um ciclo, para fechar ou para se transformar. Processos de perdão são particularmente poderosos.',
      saude: 'Limpeza e desintoxicação, física, emocional e energética. Terapias de liberação (constelação familiar, regressão, biodescodificação). Cuide do sistema linfático.',
      desenvolvimento: 'Filosofia de vida, propósito, legado. O que você quer que reste quando não estiver mais aqui? Esta pergunta orienta o próximo ciclo.',
      espiritualidade: 'Práticas de perdão, rituais de encerramento, meditações de morte simbólica. Trabalhe com arquétipos de transformação. Conecte-se com a dimensão do sagrado que transcende o individual.'
    },
    desafios: ['Resistência em deixar ir por medo do vazio', 'Tristeza e melancolia sobre o que termina', 'Sensação de perda sem entender que é limpeza', 'Iniciar grandes projetos antes de encerrar os pendentes'],
    palavrasChave: ['conclusão', 'liberação', 'desapego', 'compaixão', 'sabedoria', 'transformação', 'encerramento'],
    afirmacoes: ['Eu deixo ir com amor e gratidão o que já cumpriu seu propósito', 'Cada encerramento é o início disfarçado', 'Eu me transformo e renasço mais sábio(a) e livre'],
    praticasSugeridas: ['Ritual de encerramento anual (carta de liberação)', 'Doação de objetos físicos e simbólicos', 'Processo de perdão, de si mesmo(a) e dos outros'],
    areasDeAtencao: ['Não iniciar grandes projetos novos antes de fechar os pendentes', 'Honrar a tristeza dos encerramentos sem se afundar nela', 'Preparar conscientemente o terreno para o próximo ciclo']
  },
  11: {
    titulo: 'Número Mestre 11. Intuição, Inspiração e Sensibilidade Superior',
    descricao: 'O Ano Pessoal 11 é de intensidade espiritual rara. Sua intuição está no pico, os insights que chegam este ano podem redirecionar toda a trajetória.',
    essencia: 'Este é o ano em que o véu entre o visível e o invisível se torna mais fino. Sua capacidade de perceber verdades profundas está no auge. Use com sabedoria.',
    detalhado: `Propósito: Despertar espiritual acelerado, liderança por inspiração e materialização de insights elevados. Temas principais: • INTUIÇÃO AGUÇADA: Confie mais do que nunca nas suas percepções internas. O 11 amplifica a captação de informações sutis. Sua antena está no pico. • LIDERANÇA INSPIRADORA: Pessoas serão atraídas pela sua presença e visão. Você está sendo chamado(a) a liderar, não pelo cargo, mas pela luz que carrega. • ANCORAGEM PRÁTICA: O risco do 11 é o misticismo sem aplicação. Cada insight espiritual precisa encontrar forma concreta na vida real.`,
    temas: {
      carreira: 'Papéis que envolvam aconselhamento, espiritualidade, arte transformadora e inspiração coletiva. Liderança visionária.',
      financas: 'Monetizar dons intuitivos com estrutura prática. Cuidado com ingenuidade financeira por excesso de idealismo.',
      relacionamentos: 'Conexões profundas e empáticas. Pode atrair pessoas que precisam de cura. Discernimento é essencial.',
      saude: 'Sistema nervoso sob pressão. Práticas de ancoragem diárias são obrigatórias. Limite estímulos e exposição a ambientes caóticos.',
      espiritualidade: 'Ano de grande aceleração espiritual. Mediação profunda, canalizações conscientes, trabalhos de cura e luz.'
    },
    desafios: ['Ansiedade e hipersensibilidade excessivas', 'Viver entre dois mundos sem aterrar em nenhum', 'Absorver emoções e energias do ambiente'],
    palavrasChave: ['intuição', 'inspiração', 'visão', 'sensibilidade', 'espiritualidade', 'canal', 'despertar'],
    afirmacoes: ['Eu sou um canal de luz consciente e protegido', 'Minha intuição me guia com clareza'],
    praticasSugeridas: ['Meditação diária obrigatória', 'Proteção energética antes de ambientes ou pessoas intensas', 'Journaling de insights e intuições']
  },
  22: {
    titulo: 'Número Mestre 22. Mestre Construtor em Grande Escala',
    descricao: 'O Ano Pessoal 22 é de manifestação poderosa. As visões que você carrega podem ganhar forma real e duradoura neste ciclo.',
    essencia: 'Este é o ano de construir algo que vai além de você. Projetos de grande escala, legados, estruturas que servem ao coletivo. A responsabilidade é enorme, mas também o potencial.',
    detalhado: `Propósito: Manifestar projetos de impacto coletivo com visão espiritual e execução prática impecável. Temas principais: • GRANDE ESCALA: Pense maior do que parece razoável, mas planeje com mais rigor do que parece necessário. • LIDERANÇA RESPONSÁVEL: Com grande poder vem grande responsabilidade. Cada decisão tem impacto amplificado. • INTEGRAÇÃO VISÃO-EXECUÇÃO: Sua maior habilidade este ano é transformar visões em realidades palpáveis.`,
    temas: {
      carreira: 'Grandes projetos, liderança de alto impacto, expansão em escala. Ano de manifestações significativas.',
      financas: 'Grandes movimentos financeiros. Planejamento rigoroso e assessoria especializada são essenciais.',
      relacionamentos: 'Parcerias de negócio e de vida que sustentam grandes visões. Relacionamentos testados pelo peso da missão.',
      saude: 'Risco de exaustão total. Descanso programado é tão estratégico quanto qualquer reunião.',
      espiritualidade: 'Integrar missão espiritual com impacto material. A maior prática é fazer o extraordinário com consciência.'
    },
    desafios: ['Peso esmagador da responsabilidade', 'Perfeccionismo que impede o início', 'Workaholic justificado pela grandeza da missão'],
    palavrasChave: ['legado', 'escala', 'manifestação', 'construção', 'responsabilidade', 'impacto'],
    afirmacoes: ['Eu manifesto o extraordinário com sabedoria e amor', 'Meu legado serve ao bem maior']
  }
}

// ─── Combinações Ano Universal × Ano Pessoal ────────────────────────────────

export const COMBINACOES: Record<string, CombinacaoUniversalPessoal> = {
  '1-1': {
    tema: 'Duplo recomeço, energia máxima de início em todos os planos.',
    carreira: 'Lançar negócios, assumir liderança, posicionar-se como pioneiro na área',
    financas: 'Boas oportunidades para investimento inicial; cuidado com endividamento por otimismo excessivo',
    relacoes: 'Novos relacionamentos ou renovação completa de dinâmicas existentes',
    desafios: 'Impulsividade por excesso de energia, competitividade desnecessária',
    recomendacoes: 'Planeje metas claras, consolide apoio estratégico, estabeleça processos para sustentar o impulso de início'
  },
  '1-9': {
    tema: 'O coletivo conclui enquanto você inicia, começo após limpeza profunda.',
    carreira: 'Iniciar projetos depois de encerrar o que estava pendente',
    financas: 'Limpar dívidas antes de novos investimentos',
    relacoes: 'Liberação do passado cria espaço para o genuinamente novo',
    desafios: 'Nostalgia e dificuldade de desapegar enquanto o mundo também fecha ciclos',
    recomendacoes: 'Rituais de encerramento conscientes, planejar novos passos com clareza de propósito'
  },
  '9-1': {
    tema: 'Recomeço pessoal em contexto de finais coletivos, renascer enquanto o mundo fecha ciclos.',
    carreira: 'Renascer profissionalmente após encerramentos significativos',
    financas: 'Limpar o que impede novos investimentos',
    relacoes: 'Deixar o passado para abrir espaço para o genuíno',
    desafios: 'Tristeza coletiva influenciando suas escolhas pessoais',
    recomendacoes: 'Rituais de fechamento pessoal e coletivo, foco claro na visão pessoal'
  },
  '9-9': {
    tema: 'Dupla conclusão, ano de fechamento profundo em todas as frentes.',
    carreira: 'Terminar ciclos longos e preparar transições fundamentais',
    financas: 'Livrar-se de pendências e simplificar estruturas',
    relacoes: 'Despedidas conscientes, encerramentos com dignidade',
    desafios: 'Vazio existencial e desorientação entre ciclos',
    recomendacoes: 'Terapia, redefinição de valores, planejamento cuidadoso do próximo ciclo'
  },
  '8-8': {
    tema: 'Dupla intensidade material, ano de resultados e responsabilidades enormes.',
    carreira: 'Expansão de negócios, aquisições, liderança forte e resultados concretos',
    financas: 'Grandes movimentos, lucros significativos com planejamento ou perdas com impulsividade',
    relacoes: 'Parcerias de alto nível, negociações importantes',
    desafios: 'Tentações por poder, abuso de posição, estresse intenso',
    recomendacoes: 'Conselho especializado externo, auditoria, ética absolutamente prioritária em todas as decisões'
  },
  '5-5': {
    tema: 'Dupla transformação, ano de mudanças radicais em todas as áreas.',
    carreira: 'Mudanças de carreira inesperadas mas significativas, oportunidades disruptivas',
    financas: 'Instabilidade que pode ser oportunidade, exige maior reserva e flexibilidade',
    relacoes: 'Transformações profundas nas relações importantes',
    desafios: 'Instabilidade em todos os planos simultaneamente',
    recomendacoes: 'Âncoras de estabilidade (rotinas, valores, práticas espirituais), abertura radical ao inesperado'
  },
  '7-7': {
    tema: 'Dupla introspecção, ano de profundidade espiritual e intelectual rara.',
    carreira: 'Especialização máxima, pesquisa profunda, planejamento estratégico de longo prazo',
    financas: 'Consolidação e pesquisa antes de qualquer movimento',
    relacoes: 'Relações profundas e filosóficas. Isolamento pode ser interpretado negativamente pelos próximos',
    desafios: 'Excesso de análise sem ação, isolamento que evolui para solidão',
    recomendacoes: 'Equilíbrio entre introspecção e presença no mundo, traduzir o conhecimento em planos concretos'
  },
  '3-3': {
    tema: 'Dupla expressão, ano de criatividade, comunicação e expansão social acelerada.',
    carreira: 'Lançamentos criativos, comunicação em escala, projetos artísticos de grande alcance',
    financas: 'Oportunidades criativas de monetização, mas risco de gastos impulsivos elevado',
    relacoes: 'Expansão social intensa, novos encontros significativos',
    desafios: 'Dispersão em excesso de projetos, superficialidade nas relações',
    recomendacoes: 'Foco estratégico em 1-3 projetos criativos principais, aprofundar relações em vez de apenas multiplicar'
  },
}
