// Dados completos de numerologia

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

// Análises do Ano Universal
export const ANOS_UNIVERSAIS: Record<number, AnaliseUniversal> = {
  1: {
    titulo: 'Ano Universal 1 — Começo e Inovação Coletiva',
    temaGeral: 'Começo, inovação, liderança, reinvenção coletiva',
    climaColetivo: 'Espírito empreendedor, iniciativas novas, estruturas sendo iniciadas. Sociedades tendem a priorizar independência, startups, reformas institucionais.',
    oportunidades: 'Lançar projetos, liderar mudanças, iniciar carreira, arriscar com novas ideias',
    desafios: 'Egoísmo coletivo, fragmentação, isolamento em nome de autonomia',
    comoAproveitar: 'Assumir responsabilidade, agir com coragem, estruturar planos de longo prazo, evitar impulsividade'
  },
  2: {
    titulo: 'Ano Universal 2 — Cooperação e Diplomacia',
    temaGeral: 'Cooperação, diplomacia, parceria, sensibilidade',
    climaColetivo: 'Foco em diálogos, acordos, negociações, diplomacia internacional e reconciliações',
    oportunidades: 'Trabalhar em equipe, formar alianças, desenvolver empatia, curar relações',
    desafios: 'Indecisão, excesso de dependência, passividade',
    comoAproveitar: 'Cultivar escuta ativa, parcerias estratégicas, nutrir relações e equilibrar autoafirmação com sensibilidade'
  },
  3: {
    titulo: 'Ano Universal 3 — Criatividade e Comunicação',
    temaGeral: 'Criatividade, comunicação, expressão, entretenimento',
    climaColetivo: 'Movimentos artísticos, ênfase em mídia, marketing e socialização',
    oportunidades: 'Expressão criativa, campanhas de comunicação, lançamento de conteúdo',
    desafios: 'Dispersão, superficialidade, excessos festivos',
    comoAproveitar: 'Criar, comunicar com clareza, usar redes sociais e storytelling para divulgar ideias'
  },
  4: {
    titulo: 'Ano Universal 4 — Estrutura e Disciplina',
    temaGeral: 'Estrutura, trabalho duro, disciplina, bases sólidas',
    climaColetivo: 'Foco em produtividade, regras, construção de infraestrutura',
    oportunidades: 'Consolidar processos, trabalhar na base de projetos, disciplina financeira',
    desafios: 'Rigidez, resistência à mudança, sobrecarga de trabalho',
    comoAproveitar: 'Organizar, sistematizar, priorizar tarefas e cuidar da saúde para manter ritmo'
  },
  5: {
    titulo: 'Ano Universal 5 — Mudança e Liberdade',
    temaGeral: 'Mudança, liberdade, movimento, intercâmbio',
    climaColetivo: 'Transformações rápidas, viagens, inovações tecnológicas e sociais',
    oportunidades: 'Explorar, adaptar-se, aproveitar oportunidades inesperadas',
    desafios: 'Instabilidade, dispersão, comportamento impulsivo',
    comoAproveitar: 'Ser flexível, aprender rápido, viajar e expandir horizontes com cautela'
  },
  6: {
    titulo: 'Ano Universal 6 — Responsabilidade e Harmonia',
    temaGeral: 'Responsabilidade, família, comunidade, harmonia doméstica',
    climaColetivo: 'Atenção a questões familiares, políticas sociais, cuidado com a saúde pública',
    oportunidades: 'Fortalecer laços, reconciliações, cuidar de projetos com propósito social',
    desafios: 'Paternalismo, excessiva responsabilidade pessoal, sacrifício sem limites',
    comoAproveitar: 'Equilibrar cuidar dos outros e de si, assumir papéis de zelo com limites claros'
  },
  7: {
    titulo: 'Ano Universal 7 — Introspecção e Conhecimento',
    temaGeral: 'Introspecção, estudo, espiritualidade, pesquisa',
    climaColetivo: 'Busca por conhecimento profundo, espiritualidade institucional e ciência reflexiva',
    oportunidades: 'Estudos, retiros, investigação, desenvolvimento intelectual',
    desafios: 'Isolamento, ceticismo excessivo, frieza emocional',
    comoAproveitar: 'Aprofundar-se, meditar, estudar, investir em desenvolvimento interno'
  },
  8: {
    titulo: 'Ano Universal 8 — Poder e Abundância',
    temaGeral: 'Poder, abundância, negócios, resultados materiais',
    climaColetivo: 'Foco em economia, finanças, liderança corporativa, decisões de grande impacto econômico',
    oportunidades: 'Crescimento financeiro, promoção, negócios que escalam',
    desafios: 'Ganância, corrupção, desigualdade',
    comoAproveitar: 'Planejar negócios, assumir liderança, negociar com ética e visão financeira de longo prazo'
  },
  9: {
    titulo: 'Ano Universal 9 — Conclusão e Transformação',
    temaGeral: 'Conclusão, encerramento, compaixão, transformação',
    climaColetivo: 'Fechamento de ciclos, liberação do que não serve, foco em causas humanitárias',
    oportunidades: 'Terminar projetos, doações, movimentos sociais, reflexão sobre legado',
    desafios: 'Tristeza coletiva, sensação de perda, dificuldade em desapegar',
    comoAproveitar: 'Finalizar com dignidade, limpar o que impede o novo, participar de causas filantrópicas'
  },
  11: {
    titulo: 'Ano Universal 11 — Intuição e Inspiração Coletiva',
    temaGeral: 'Intuição, canal espiritual, inspiração coletiva',
    climaColetivo: 'Momentos de grande sensibilidade, insights coletivos, inspiração artística e espiritual',
    oportunidades: 'Movimentos inspiradores, liderança espiritual, causas que tocam emoções profundas',
    desafios: 'Volatilidade emocional, idealismo sem base prática',
    comoAproveitar: 'Ouvir intuição, ativar projetos que unam arte e transcendência, disciplina para aterrissar ideias'
  },
  22: {
    titulo: 'Ano Universal 22 — Manifestação em Grande Escala',
    temaGeral: 'Manifestar em grande escala, projetos de impacto estrutural',
    climaColetivo: 'Capacidade de transformar visões grandiosas em estruturas tangíveis',
    oportunidades: 'Grandes obras, reformas estruturais, iniciativas com impacto duradouro',
    desafios: 'Responsabilidade esmagadora, falhar por falta de planejamento',
    comoAproveitar: 'Planejamento estratégico, trabalho em equipe com altos padrões, traduzir visão em etapas práticas'
  }
}

// Análises expandidas do Ano Pessoal
export const ANOS_PESSOAIS: Record<number, AnaliseNumero> = {
  1: {
    titulo: 'Ano Pessoal 1 — Inícios, Autonomia e Liderança',
    descricao: 'O Ano Pessoal 1 traz a energia de sementeira, iniciativa e autoconfiança. É um ciclo favorável para começos, projetos individuais e assumir papel de liderança. Este é o ano em que você planta as sementes do novo ciclo de 9 anos que se inicia.',
    essencia: 'Você é o pioneiro da sua própria vida neste ano. A energia do 1 te convoca a ser protagonista, tomar decisões corajosas e confiar em sua visão única. É tempo de parar de esperar permissão e começar a agir com determinação.',
    detalhado: `Propósito central: Recomeço consciente, autoafirmação autêntica e desenvolvimento de liderança pessoal.

Temas principais expandidos:
• INÍCIOS ESTRATÉGICOS: Não se trata de começar por começar, mas de plantar sementes que você quer ver florescer nos próximos 9 anos. Escolha projetos que realmente ressoem com sua essência.

• AUTONOMIA VERDADEIRA: Aprenda a confiar profundamente em suas escolhas. Este ano te ensina que você não precisa de validação externa para seguir seu caminho. Desenvolva autoconfiança através da ação.

• VISIBILIDADE E PRESENÇA: Oportunidade única para se destacar em sua área. Sua voz, suas ideias e sua marca pessoal ganham força naturalmente. Use isso sabiamente.

• CORAGEM CALCULADA: Não é impulsividade, mas coragem fundamentada. Arrisque-se, mas com planejamento. Seja ousado, mas não inconsequente.

Ações práticas detalhadas:
• PLANEJAMENTO ESTRATÉGICO: Defina 1-3 metas principais para o ano. Quebre cada meta em passos mensais. Foco é mais poderoso que dispersão.

• INICIATIVA DIÁRIA: Tome pelo menos uma ação todo dia que te aproxime de seus objetivos. Pequenas ações consistentes constroem grandes resultados.

• ROTINA DE DISCIPLINA: Estabeleça rituais matinais que te empoderem. Exercícios, meditação, journaling - escolha práticas que fortaleçam sua autoconfiança.

• GESTÃO DE IMPULSOS: Crie um sistema de validação antes de grandes decisões. Pergunte: "Isso serve meu objetivo maior ou é apenas excitação momentânea?"

• CONSTRUÇÃO DE MARCA: Invista em sua imagem profissional, presença digital e networking estratégico. Como você quer ser conhecido?`,
    temas: {
      carreira: 'ANO DOURADO para iniciar negócios próprios, lançar projetos inovadores, assumir papéis de liderança e destacar-se em sua área. Excelente para mudanças de carreira, rebranding profissional e posicionamento como autoridade. Oportunidades surgem para quem age com iniciativa.',
      financas: 'Momento para assumir riscos calculados e começar planos de renda nova. Invista em sua independência financeira e considere diversificar fontes de renda. Cuidado: energia de início pode gerar gastos impulsivos - mantenha orçamento estruturado. Bom para investimentos de longo prazo que você inicia agora.',
      relacionamentos: 'Começo de novos ciclos afetivos ou renovação completa de dinâmicas existentes. Se solteiro(a), momento propício para conhecer alguém significativo - mas primeiro, conecte-se consigo mesmo(a). Necessidade aumentada de espaço pessoal nas relações. Mostre iniciativa afetiva, mas respeite sua necessidade de autonomia. Relacionamentos que limitam sua individualidade podem terminar.',
      saude: 'Energia vital renovada e forte. Excelente momento para começar rotina de exercícios, nova modalidade esportiva ou programa de saúde. Cuidado com acidentes por excesso de pressa ou impulsividade. Práticas recomendadas: corrida, artes marciais, yoga dinâmico, atividades que desenvolvam força e presença. Atenção à saúde da cabeça (enxaquecas podem surgir se não gerenciar stress).',
      desenvolvimento: 'Foco em desenvolver autoconfiança, autodisciplina e capacidade de tomar decisões. Invista em cursos de liderança, coaching, mentorias. Leia biografias de pessoas que iniciaram projetos do zero. Desenvolva sua "voz" única - seja através de escrita, fala ou expressão artística. Trabalhe seu medo de fracasso através de ação progressiva.',
      espiritualidade: 'Conexão com o EU Superior através da ação consciente. Práticas: afirmações de poder pessoal, visualizações criativas de seus objetivos, meditações de ancoragem e presença. Trabalhe o chakra raiz (segurança) e o plexo solar (poder pessoal). Você aprende espiritualidade fazendo - não apenas contemplando.'
    },
    desafios: [
      'Arrogância e ego inflado por conquistas iniciais',
      'Impaciência destrutiva com processos que exigem tempo',
      'Solidão não escolhida por excesso de independência',
      'Iniciar múltiplos projetos sem finalizar nenhum',
      'Conflitos desnecessários por querer sempre estar certo',
      'Burnout por não saber delegar ou pedir ajuda',
      'Impulsividade financeira disfarçada de "coragem"'
    ],
    palavrasChave: ['começo', 'iniciativa', 'autonomia', 'decisão', 'liderança', 'coragem', 'pioneirismo', 'autoconfiança', 'ação', 'manifestação'],
    afirmacoes: [
      'Eu sou o autor/autora da minha própria vida',
      'Minhas ideias têm valor e merecem ser manifestadas',
      'Eu tomo decisões com clareza e confiança',
      'Eu lidero minha vida com coragem e sabedoria',
      'Eu inicio o que desejo criar e tenho disciplina para sustentar',
      'Minha autonomia não me afasta - me empodera'
    ],
    praticasSugeridas: [
      'Journaling diário sobre decisões e ações tomadas',
      'Meditação matinal de 10 min focada em intenções do dia',
      'Exercícios físicos que desenvolvam força e presença (peso, corrida, artes marciais)',
      'Lista semanal de "1 ação corajosa" e execução',
      'Networking intencional - conectar-se com 1 pessoa nova por semana',
      'Estudo de casos de empreendedores e líderes inspiradores',
      'Prática de falar em público ou gravar vídeos (desenvolver voz)'
    ],
    areasDeAtencao: [
      'Equilibrar autonomia com colaboração saudável',
      'Gerenciar impulsos antes de decisões financeiras grandes',
      'Pedir ajuda quando necessário - você não precisa fazer tudo sozinho(a)',
      'Cultivar paciência com processos que não dependem só de você',
      'Manter relacionamentos enquanto constrói independência'
    ]
  },
  2: {
    titulo: 'Ano Pessoal 2 — Parcerias, Sensibilidade e Diplomacia',
    descricao: 'O Ano Pessoal 2 pede pausa e cooperação. Energia de sutileza, negociações e trânsito emocional.',
    detalhado: `Propósito: parceria, colaboração e sensibilidade.

Temas principais:
• Relacionamentos: aprofundamento ou construção de alianças
• Paciência: melhor momento para planejamento e não para agir impetuosamente
• Diplomacia: negociações e fortalecimento de vínculos

Ações práticas recomendadas:
• Investir em escuta ativa e negociações
• Trabalhar em parcerias com contratos e acordos claros
• Cuidar da saúde emocional
• Desenvolver empatia e sensibilidade`,
    temas: {
      carreira: 'Bom para trabalhar em equipe, negociações, acordos e colaborações estratégicas',
      financas: 'Consolidar, dividir responsabilidades, orçamentos compartilhados',
      relacionamentos: 'Fortalecer vínculos, reconciliação, cultivar escuta e limites saudáveis',
      saude: 'Equilíbrio emocional; evitar ansiedade por indecisão; práticas de cura em grupo'
    },
    desafios: ['Dependência emocional', 'Procrastinação', 'Medo de conflitos', 'Indecisão'],
    palavrasChave: ['parceria', 'sensibilidade', 'compromisso', 'diplomacia', 'paciência', 'escuta']
  },
  3: {
    titulo: 'Ano Pessoal 3 — Expressão, Criatividade e Expansão',
    descricao: 'O Ano Pessoal 3 é leve, comunicativo e criativo. Período favorável para projetos artísticos, marketing e sociabilidade.',
    detalhado: `Propósito: expressão criativa, sociabilidade e crescimento através da comunicação.

Temas principais:
• Expressão: escrita, fala, performance, comunicação
• Alegria e celebração: aumentam as conexões sociais
• Carisma e necessidade de expressão

Ações práticas recomendadas:
• Publicar conteúdo, participar de eventos
• Divulgar trabalhos e criar redes
• Exercícios de expressão (teatro, escrita, vídeos)
• Dedicar tempo à criação e cursos`,
    temas: {
      carreira: 'Ótimo para marketing, vendas, artes, comunicação e produção de conteúdo',
      financas: 'Oportunidades via criatividade; monetizar talentos; cuidado com gastos impulsivos',
      relacionamentos: 'Sociabilidade aumenta; romance favorecido; expressão com leveza',
      saude: 'Melhora do bem-estar com atividades criativas; escrita terapêutica'
    },
    desafios: ['Superficialidade', 'Dispersão', 'Falta de foco', 'Gastos excessivos'],
    palavrasChave: ['criatividade', 'comunicação', 'alegria', 'fluxo', 'expressão', 'socialização']
  },
  4: {
    titulo: 'Ano Pessoal 4 — Estrutura, Disciplina e Construção',
    descricao: 'O Ano Pessoal 4 pede trabalho constante e organização. É o alicerce do ciclo.',
    detalhado: `Propósito: construção, disciplina, segurança material.

Temas principais:
• Disciplina: rotinas, sistemas e gestão do tempo
• Construção: planejamento a longo prazo e bases sólidas
• Necessidade de estrutura e rotina

Ações práticas recomendadas:
• Criar sistemas replicáveis e checklists
• Investir em seguros, contratos e proteções legais
• Implementar processos e cronogramas
• Cuidar da rotina de saúde e disciplina espiritual`,
    temas: {
      carreira: 'Foco em trabalho duro, aperfeiçoamento técnico, consolidar bases e processos',
      financas: 'Poupar, criar reservas, organizar finanças, investimentos estáveis',
      relacionamentos: 'Relações testadas pela rotina; construir segurança; compromisso prático',
      saude: 'Cuidar do corpo com rotina; disciplina em práticas espirituais'
    },
    desafios: ['Rigidez', 'Frustração se progresso lento', 'Tédio', 'Excesso de cautela'],
    palavrasChave: ['disciplina', 'estabilidade', 'trabalho', 'previsão', 'estrutura', 'método']
  },
  5: {
    titulo: 'Ano Pessoal 5 — Mudanças, Liberdade e Versatilidade',
    descricao: 'Energia de movimentações, viagens e adaptações. Ano favorável a sair da rotina e explorar.',
    detalhado: `Propósito: liberdade, mudança, expansão.

Temas principais:
• Liberdade: viajar, mudar de cidade, experimentar novos papéis
• Inovação: adaptar-se rápido e aprender novas habilidades
• Desejo por aventura e novas experiências

Ações práticas recomendadas:
• Aceitar pequenas aventuras e testes rápidos (MVPs)
• Controlar impulsos financeiros
• Trocar recursos de forma inteligente
• Abrir-se para mudanças e redesenhar rotinas`,
    temas: {
      carreira: 'Oportunidades de pivotar, viajar, mudanças de emprego, testar novas possibilidades',
      financas: 'Possibilidade de ganhos inesperados; risco de perdas por impulsividade; contratos curtos',
      relacionamentos: 'Novos encontros, maior liberdade; aventurar-se em novos tipos',
      saude: 'Buscar atividades dinâmicas; evitar excessos; práticas de libertação'
    },
    desafios: ['Inconsistência', 'Dispersão', 'Riscos mal calculados', 'Instabilidade'],
    palavrasChave: ['mudança', 'liberdade', 'aventura', 'curiosidade', 'adaptação', 'movimento']
  },
  6: {
    titulo: 'Ano Pessoal 6 — Amor, Responsabilidade e Harmonia',
    descricao: 'Ano de deveres emocionais e foco nas relações próximas. Ajustes familiares e compromissos são comuns.',
    detalhado: `Propósito: responsabilidade afetiva, serviço, cura doméstica.

Temas principais:
• Equilíbrio familiar: reestruturações do lar e cuidados
• Compromissos: possibilita uniões e responsabilidades claras
• Necessidade de cuidar e ser cuidado

Ações práticas recomendadas:
• Investir em terapia de casal ou família
• Planejamento financeiro conjunto
• Voluntariado e serviços comunitários
• Estabelecer limites saudáveis`,
    temas: {
      carreira: 'Equilibrar vida profissional e familiar; projetos com propósito social',
      financas: 'Foco em estabilidade familiar; investimentos em imóvel; planejamento conjunto',
      relacionamentos: 'Forte ênfase em família, casamento; tempo de cuidar e formalizar',
      saude: 'Cuidar do equilíbrio emocional; serviço e devoção como transformação'
    },
    desafios: ['Sobrecarga', 'Auto-sacrifício', 'Sacrifício excessivo', 'Cobranças emocionais'],
    palavrasChave: ['responsabilidade', 'amor', 'compromisso', 'cuidador', 'harmonia', 'família']
  },
  7: {
    titulo: 'Ano Pessoal 7 — Interiorização, Estudo e Espiritualidade',
    descricao: 'Ano de busca interna, estudo profundo e recolhimento. É recomendado desacelerar e recolher informações.',
    detalhado: `Propósito: estudo, introspecção, refinamento espiritual.

Temas principais:
• Pesquisa: aprendizagem formal e informal profunda
• Introspecção: meditação, retiros e autoanálise
• Busca por sentido e conhecimento

Ações práticas recomendadas:
• Reservar horas semanais para estudo estruturado
• Laboratórios, residências e mestrados
• Equilibrar isolamento e contato social
• Dedicar-se ao sono e práticas restaurativas`,
    temas: {
      carreira: 'Estudos, pesquisa, trabalhos que exijam análise e especialização',
      financas: 'Momento de consolidar e reavaliar planos; investir em conhecimento',
      relacionamentos: 'Menor foco social; necessidade de espaço; tempo de interiorização',
      saude: 'Dedicar ao sono e restauração; retiro, leituras e meditações'
    },
    desafios: ['Isolamento', 'Frieza emocional', 'Cinismo', 'Pessimismo', 'Distanciamento social'],
    palavrasChave: ['conhecimento', 'solitude', 'espiritualidade', 'análise', 'introspecção', 'estudo']
  },
  8: {
    titulo: 'Ano Pessoal 8 — Poder, Realização e Prosperidade',
    descricao: 'Foco em metas materiais, receita e autorrealização. Ano de colheita de frutos econômicos quando bem canalizado.',
    detalhado: `Propósito: poder pessoal, resultados materiais, liderança executiva.

Temas principais:
• Carreira: promoções, negociações e expansões comerciais
• Finanças: consolidação de patrimônio e investimentos
• Ambição e desejo de reconhecimento

Ações práticas recomendadas:
• Planejamento financeiro detalhado e auditorias
• Postura profissional e negociações com contratos claros
• Evitar atalho antiético; reputação importa
• Buscar mentoria financeira`,
    temas: {
      carreira: 'Promoções, negócios escaláveis, negociações importantes, liderança executiva',
      financas: 'Ano de ganhos significativos; expansão financeira; investimento estruturado',
      relacionamentos: 'Ajustes por conta de ambição; equilíbrio entre poder e vulnerabilidade',
      saude: 'Atenção ao estresse relacionado a responsabilidade; trabalhar poder pessoal'
    },
    desafios: ['Ganância', 'Abuso de poder', 'Estresse pelo controle', 'Conflitos de poder'],
    palavrasChave: ['autoridade', 'prosperidade', 'gestão', 'realização', 'poder', 'sucesso']
  },
  9: {
    titulo: 'Ano Pessoal 9 — Conclusões, Liberação e Transformação',
    descricao: 'Ciclo de finalizações e liberações. Preparar-se para deixar ir e curar padrões antigos.',
    detalhado: `Propósito: conclusão, entrega, compaixão.

Temas principais:
• Encerramentos: fechamento de projetos e limpeza pessoal
• Humanitarismo: entrega para o coletivo e causas maiores
• Desapego e fechamento de ciclos

Ações práticas recomendadas:
• Organizar e terminar pendências administrativas e emocionais
• Doar, participar de causas sociais
• Iniciar processos de perdão
• Fechar ciclos com dignidade`,
    temas: {
      carreira: 'Finalizar projetos, preparar transição, fechamentos e entrega',
      financas: 'Liquidar pendências, doar, reorganizar; desinvestimento de ativos',
      relacionamentos: 'Encerramentos e reconciliações; processos de perdão',
      saude: 'Processo de limpeza, mudanças terapêuticas; atuações humanitárias'
    },
    desafios: ['Desapego difícil', 'Tristeza', 'Sentimento de perda', 'Resistência em deixar ir'],
    palavrasChave: ['conclusão', 'compaixão', 'renovação', 'desapego', 'fechamento', 'entrega']
  },
  11: {
    titulo: 'Número Mestre 11 — Intuição, Inspiração e Sensibilidade Superior',
    descricao: '11 é considerado um Número Mestre. Expressa sensibilidade psíquica, inspiração e potencial de liderança espiritual.',
    detalhado: `Propósito: despertar espiritual, inspiração, liderança visionária com componente intuitivo.

Temas principais:
• Inspiração e visão: ideias que tocam muitas pessoas
• Intuição aguçada e empatia elevada
• Sensibilidade elevada e potencial de canalizar grande empatia

Ações práticas recomendadas:
• Desenvolver ancoragem prática: rotinas e suporte
• Trabalhar com expressão criativa que sirva ao coletivo
• Práticas espirituais e fronteiras emocionais`,
    temas: {
      carreira: 'Papéis que envolvam aconselhamento, arte, espiritualidade e inspiração',
      financas: 'Monetizar dons intuitivos com estrutura prática',
      relacionamentos: 'Conexões profundas e empáticas; sensibilidade nas relações',
      saude: 'Práticas de ancoragem; equilíbrio entre sensibilidade e praticidade'
    },
    desafios: ['Sensibilidade excessiva', 'Ansiedade', 'Viver em altos e baixos', 'Sobrecarga emocional', 'Idealismo'],
    palavrasChave: ['intuição', 'empatia', 'inspiração', 'sensibilidade', 'visão', 'espiritualidade']
  },
  22: {
    titulo: 'Número Mestre 22 — Mestre Construtor e Realizador em Grande Escala',
    descricao: '22 atua como construtor de sonhos em escala material. Capacidade de manifestar projetos muito grandes com estrutura.',
    detalhado: `Propósito: construir em grande escala, manifestar projetos que impactam coletivamente.

Temas principais:
• Grandes realizações: projetos que geram legado
• Habilidade de organizar recursos e equipes
• Grande responsabilidade e visão prática estruturadora

Ações práticas recomendadas:
• Usar planejamento profissional e conselhos jurídicos/financeiros
• Estruturar equipes e delegue para manter escala
• Dividir responsabilidades e montar equipe qualificada`,
    temas: {
      carreira: 'Liderança em projetos de alto impacto, infraestrutura, empresas de grande porte',
      financas: 'Manifestação material em larga escala; planejamento estratégico robusto',
      relacionamentos: 'Parcerias que suportam grandes visões; responsabilidades compartilhadas',
      saude: 'Gerenciar carga de responsabilidade; equilíbrio entre visão e prática'
    },
    desafios: ['Peso da responsabilidade', 'Expectativa social', 'Possível exaustão', 'Carga de responsabilidade'],
    palavrasChave: ['legado', 'estrutura', 'escala', 'realização', 'manifestação', 'construção']
  }
}

// Combinações Ano Universal x Ano Pessoal (principais combinações)
export const COMBINACOES: Record<string, CombinacaoUniversalPessoal> = {
  '1-1': {
    tema: 'Duplo recomeço. Energia máxima de início.',
    carreira: 'Excelente para lançar negócios, assumir liderança, rebrand',
    financas: 'Boas oportunidades para investimento inicial; cuidado com endividamento por excesso de otimismo',
    relacoes: 'Novos relacionamentos ou novo status de relações existentes',
    desafios: 'Impulsividade, excesso de ego',
    recomendacoes: 'Planeje metas, consolide apoio, estabeleça processos para sustentar o impulso'
  },
  '1-9': {
    tema: 'Começo após final coletivo. Coletividade conclui ciclos enquanto você inicia o seu.',
    carreira: 'Bom para começar projetos novos após encerrar antigos',
    financas: 'Limpar dívidas antes de iniciar investimentos',
    relacoes: 'Liberação do passado permite iniciar novo',
    desafios: 'Nostalgia e dificuldade em desapegar',
    recomendacoes: 'Rituais de encerramento, planejar novos passos práticos'
  },
  '9-1': {
    tema: 'Recomeço pessoal em contexto de finais coletivos. O mundo fecha ciclos enquanto você inicia.',
    carreira: 'Oportunidade para renascer profissionalmente após encerramentos',
    financas: 'Limpar o que impede novo investimento',
    relacoes: 'Deixar o antigo para abrir espaço para novo',
    desafios: 'Tristeza coletiva influenciando suas escolhas',
    recomendacoes: 'Rituais de fechamento, foco em visão pessoal'
  },
  '9-9': {
    tema: 'Dupla conclusão. Ano de fechamento profundo em todas as frentes.',
    carreira: 'Terminar ciclos longos, preparar transição',
    financas: 'Livrar-se de pendências, simplificar',
    relacoes: 'Despedidas, encerramentos',
    desafios: 'Vazio e desorientação',
    recomendacoes: 'Planejar reconstrução, terapia e redefinição de valores'
  },
  '8-8': {
    tema: 'Dupla intensidade material. Ano de resultados e responsabilidades enormes.',
    carreira: 'Expansão de negócios, aquisições, liderança forte',
    financas: 'Grandes movimentos — lucros ou perdas significativas',
    relacoes: 'Negociações de alto nível',
    desafios: 'Tentações, abuso de poder',
    recomendacoes: 'Conselho externo, auditoria, ética em todas negociações'
  }
}
