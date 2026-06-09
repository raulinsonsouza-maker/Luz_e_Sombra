export interface AreaDaVida {
  id: string
  titulo: string
  subtitulo: string
  descricao: string
  icon: string
  reflexoes: string[]
  baixo: string
  alto: string
}

export interface FormData {
  nome: string
  dataNascimento: string
  plenitudeFelicidade: number
  espiritualidade: number
  saudeDisposicao: number
  desenvolvimentoIntelectual: number
  equilibrioEmocional: number
  familia: number
  desenvolvimentoAmoroso: number
  vidaSocial: number
  realizacaoProposito: number
  recursosFinanceiros: number
  contribuicaoSocial: number
  criatividadeHobbyDiversao: number
}

export const AREAS_DA_VIDA: AreaDaVida[] = [
  {
    id: 'plenitudeFelicidade',
    titulo: 'Plenitude e Felicidade',
    subtitulo: 'O pulso da sua vida inteira',
    descricao: 'Seu nível geral de satisfação, presença e alegria com a vida como ela é agora.',
    icon: 'Smile',
    reflexoes: [
      'Você acorda a maioria dos dias com um senso genuíno de que a vida vale a pena ser vivida, ou existe um peso difícil de nomear?',
      'Quando foi a última vez que sentiu alegria espontânea, não por conquista ou aprovação, mas simplesmente por existir?',
      'Você consegue estar presente no momento atual, ou vive projetado no futuro ou preso ao passado?',
      'Sua satisfação depende de condições externas específicas, ou existe uma base interna de paz que permanece mesmo nos dias difíceis?',
    ],
    baixo: 'Vazio, apatia ou angústia frequentes. Dificuldade de encontrar motivos genuínos de alegria. Os dias se arrastam sem sentido.',
    alto: 'Presença, gratidão e senso de que a vida vale a pena. Consegue encontrar beleza e significado mesmo nos dias difíceis.',
  },
  {
    id: 'espiritualidade',
    titulo: 'Espiritualidade',
    subtitulo: 'Sua conexão com algo maior que você',
    descricao: 'A qualidade da sua conexão espiritual, da sua prática contemplativa e do seu senso de pertencer a algo além do ego.',
    icon: 'Sparkles',
    reflexoes: [
      'Você tem uma prática espiritual ou de reflexão, meditação, oração, contemplação, natureza, que te sustenta nos momentos difíceis?',
      'Sente que existe um propósito maior guiando sua vida, além das metas e objetivos do dia a dia?',
      'Com que frequência você para, silencia e permite que algo mais profundo do que o pensamento fale?',
      'Sua espiritualidade é algo que você *tem* (crença intelectual) ou algo que você *vive* como prática encarnada no cotidiano?',
    ],
    baixo: 'Vazio existencial, desconexão ou ausência de prática contemplativa. Perguntas sobre propósito e sentido causam ansiedade em vez de abertura.',
    alto: 'Forte senso de conexão com algo maior. Prática espiritual consistente. Propósito claro que sustenta nos momentos de crise.',
  },
  {
    id: 'saudeDisposicao',
    titulo: 'Saúde e Disposição',
    subtitulo: 'O templo que habita sua consciência',
    descricao: 'Sua energia vital, qualidade do sono, alimentação, movimento e a relação que você tem com seu corpo.',
    icon: 'Activity',
    reflexoes: [
      'Você se levanta de manhã com energia genuína para o dia, ou precisa se arrastar para sair da cama?',
      'Seu corpo está sendo nutrido com sono, alimentação e movimento que o sustentam, ou está sendo apenas tolerado e exigido?',
      'Há dores, desconfortos ou sinais que seu corpo vem enviando há tempo que você tem ignorado ou adiado?',
      'Você cuida da sua saúde de forma proativa, prevenção, hábitos consistentes, ou apenas reativa quando algo dói ou para de funcionar?',
    ],
    baixo: 'Energia cronicamente baixa. Sono irregular ou insuficiente. Alimentação descuidada. Sedentarismo. Corpo visto como fardo, não como aliado.',
    alto: 'Energia consistente ao longo do dia. Sono restaurador. Alimentação consciente. Movimento regular que traz prazer e vitalidade.',
  },
  {
    id: 'desenvolvimentoIntelectual',
    titulo: 'Desenvolvimento Intelectual',
    subtitulo: 'A mente como instrumento de evolução',
    descricao: 'Seu investimento em aprendizado, expansão de perspectiva e cultivo de uma mente viva, curiosa e em constante crescimento.',
    icon: 'Brain',
    reflexoes: [
      'Quando foi a última vez que aprendeu algo que genuinamente expandiu sua visão de mundo, não apenas acumulou informação?',
      'Você tem fontes regulares de estímulo intelectual: leituras profundas, cursos, mentores, conversas que provocam sua inteligência?',
      'Você sente que sua mente está crescendo, estagnada ou se atrofiando com o ritmo atual de vida?',
      'O que você aprendeu nos últimos 3 meses que mudou concretamente a forma como pensa ou age?',
    ],
    baixo: 'Pouco investimento em aprendizado intencional. Conteúdos consumidos são majoritariamente superficiais ou de entretenimento. Ausência de curiosidade intelectual ativa.',
    alto: 'Aprendizado constante e intencional. Leituras profundas, cursos, mentores. Mente estimulada e em expansão contínua. Novas ideias sendo integradas e aplicadas.',
  },
  {
    id: 'equilibrioEmocional',
    titulo: 'Equilíbrio Emocional',
    subtitulo: 'A qualidade da sua vida interior',
    descricao: 'Sua consciência emocional, capacidade de regular suas reações e de processar experiências difíceis sem ser dominado por elas.',
    icon: 'Scale',
    reflexoes: [
      'Você tem consciência das emoções que surgem em você antes de agir a partir delas, ou elas aparecem e te controlam antes de perceber?',
      'Como você reage quando as coisas não saem como planejado: mantém o centro ou é varrido pela reação emocional?',
      'Você tem espaço e recursos reais para processar o que sente, terapia, diário, meditação, conversas profundas, ou empurra as emoções para baixo do tapete?',
      'Há padrões emocionais que se repetem na sua vida, raiva, ansiedade, tristeza, medo, que não foram ainda verdadeiramente trabalhados?',
    ],
    baixo: 'Alta reatividade. Emoções intensas e não processadas. Padrões repetitivos de sofrimento. Dificuldade de voltar ao equilíbrio após perturbações.',
    alto: 'Alta consciência emocional. Capaz de sentir profundamente sem ser controlado pelo que sente. Ferramentas consistentes para processar emoções difíceis.',
  },
  {
    id: 'familia',
    titulo: 'Família',
    subtitulo: 'As raízes que sustentam ou prendem',
    descricao: 'A qualidade dos seus vínculos familiares, tanto a família de origem quanto a família que você escolheu ou construiu.',
    icon: 'Home',
    reflexoes: [
      'Você se sente genuinamente nutrido pelas suas relações familiares, ou elas drenam sua energia e ativam suas feridas mais antigas?',
      'Há conflitos, mágoas ou feridas não resolvidas na sua família que continuam afetando seu presente de formas que você ainda não nomeou completamente?',
      'Você está presente de forma real nas relações familiares que importam, não apenas fisicamente, mas emocionalmente disponível?',
      'Que padrões herdados da sua família de origem você ainda carrega inconscientemente, e quais você conscientemente escolhe superar?',
    ],
    baixo: 'Relações familiares marcadas por conflito crônico, distância emocional ou feridas não cicatrizadas. Família como fonte de estresse, não de suporte.',
    alto: 'Vínculos familiares saudáveis, nutridos e recíprocos. Espaço para vulnerabilidade e presença real. Capacidade de se relacionar a partir de quem você é, não apenas de quem foi.',
  },
  {
    id: 'desenvolvimentoAmoroso',
    titulo: 'Relacionamento Amoroso',
    subtitulo: 'A escola mais intensa do autoconhecimento',
    descricao: 'A qualidade da sua vida amorosa: se está em um relacionamento, a profundidade do que existe ali; se não está, a paz e clareza com sua situação atual.',
    icon: 'Heart',
    reflexoes: [
      'Se você está em um relacionamento: há amor, respeito, comunicação genuína e crescimento mútuo, ou existe distância, mágoa acumulada ou estagnação?',
      'Se você não está em um relacionamento: sua situação atual é uma escolha consciente em paz, ou há solidão, bloqueio ou padrões que repetem?',
      'Seus padrões relacionais, o que você atrai, como você ama, o que você tolera, refletem quem você quer ser ou quem você foi no passado?',
      'Você é capaz de vulnerabilidade genuína com quem ama, ou existe uma parte de você que sempre se protege, sempre se reserva?',
    ],
    baixo: 'Relacionamento conflituoso, sem intimidade ou crescimento. Ou situação de solidão não escolhida, com padrões relacionais dolorosos que se repetem.',
    alto: 'Parceria com amor, respeito e comunicação genuína. Ou, se solteiro(a): paz, clareza e abertura consciente para o que vem.',
  },
  {
    id: 'vidaSocial',
    titulo: 'Vida Social',
    subtitulo: 'A teia de relações que te sustenta',
    descricao: 'A qualidade das suas amizades, conexões significativas e do seu senso de pertencimento a uma comunidade que compartilha seus valores.',
    icon: 'Users',
    reflexoes: [
      'Você tem pessoas com quem pode ser completamente honesto, vulnerável e autêntico, sem medo de julgamento?',
      'Sua rede social te nutre, inspira e te ajuda a ser uma versão melhor de você, ou te drena, diminui ou puxa para baixo?',
      'Com que frequência você investe tempo real em amizades que importam, não apenas em interação superficial, digital ou obrigatória?',
      'Você se sente pertencendo a uma comunidade que compartilha seus valores mais profundos?',
    ],
    baixo: 'Solidão frequente. Amizades superficiais ou tóxicas. Dificuldade de criar conexões genuínas. Sentimento crônico de não pertencimento.',
    alto: 'Rede de amizades genuínas, nutridas com cuidado e reciprocidade. Senso de pertencimento. Pessoas que te inspiram e te incentivam a crescer.',
  },
  {
    id: 'realizacaoProposito',
    titulo: 'Realização e Propósito',
    subtitulo: 'A pergunta que sua vida não deixa em silêncio',
    descricao: 'O quanto você sente que está vivendo em alinhamento com seu propósito mais profundo, no trabalho, nas escolhas, na direção da sua vida.',
    icon: 'Target',
    reflexoes: [
      'Você acredita que tem um propósito específico a cumprir nesta vida? Consegue nomeá-lo, ou ainda sente que está buscando?',
      'Seu trabalho ou ocupação principal está alinhado com o que você acredita ser sua contribuição mais autêntica, ou é apenas o que paga as contas?',
      'Ao final de cada semana, você sente que viveu de acordo com seus valores mais profundos, ou existe uma dissonância entre o que você faz e quem você quer ser?',
      'Se você soubesse com certeza que tem exatamente 5 anos de vida pela frente, o que mudaria imediatamente na direção que você está seguindo?',
    ],
    baixo: 'Sensação de viver no automático. Trabalho visto como obrigação sem significado. Ausência de senso de missão ou direção que animate genuinamente.',
    alto: 'Clara consciência de propósito. Trabalho alinhado com valores. Senso profundo de contribuição e significado que sustenta mesmo nos dias difíceis.',
  },
  {
    id: 'recursosFinanceiros',
    titulo: 'Recursos Financeiros',
    subtitulo: 'A energia material que flui, ou estagna',
    descricao: 'Sua clareza financeira, estabilidade material, relação com dinheiro e capacidade de construir prosperidade consciente.',
    icon: 'Coins',
    reflexoes: [
      'Você tem clareza real sobre onde seu dinheiro vai todos os meses, ou existe neblina, ansiedade ou evitação em torno das suas finanças?',
      'Sua relação com dinheiro é saudável? Há crenças herdadas sobre escassez, merecimento ou dinheiro como algo "sujo" que limitam sua prosperidade?',
      'Você está construindo algo consciente, reserva de emergência, investimentos, patrimônio, ou apenas administrando a sobrevivência mês a mês?',
      'Seu padrão de consumo atual está alinhado com seus valores e objetivos, ou você gasta para preencher vazios emocionais?',
    ],
    baixo: 'Instabilidade financeira crônica. Dívidas. Ausência de reservas. Relação de ansiedade, vergonha ou evitação com o tema dinheiro.',
    alto: 'Clareza e organização financeira. Renda estável e compatível com suas necessidades. Reservas e investimentos. Relação saudável e consciente com prosperidade.',
  },
  {
    id: 'contribuicaoSocial',
    titulo: 'Contribuição Social',
    subtitulo: 'O impacto que você deixa além de você',
    descricao: 'O quanto você está contribuindo ativamente para algo maior que seus objetivos pessoais, comunidade, causas, legado.',
    icon: 'Hand',
    reflexoes: [
      'Além dos seus próprios objetivos, você sente que está contribuindo para algo maior, uma causa, uma comunidade, uma transformação no mundo?',
      'Como você se importa concretamente com as pessoas ao seu redor e com a comunidade em que vive, além das boas intenções?',
      'Suas escolhas cotidianas estão alinhadas com o tipo de mundo que você diz querer ajudar a criar?',
      'Que legado você está construindo com suas escolhas, o que as pessoas que você tocou vão carregar de você?',
    ],
    baixo: 'Foco predominantemente individual. Pouca consciência ou ação em relação ao impacto no coletivo. Contribuição ausente ou muito pontual.',
    alto: 'Ações concretas de contribuição ao coletivo. Senso genuíno de responsabilidade pelo bem maior. Legado sendo construído conscientemente com as escolhas diárias.',
  },
  {
    id: 'criatividadeHobbyDiversao',
    titulo: 'Criatividade, Hobby e Diversão',
    subtitulo: 'A criança que você não pode abandonar',
    descricao: 'O espaço que você reserva para o jogo, a criação, o prazer e a leveza, sem justificativa de produtividade.',
    icon: 'Palette',
    reflexoes: [
      'Você tem espaço real em sua vida para atividades que existem apenas pelo prazer que trazem, sem nenhuma utilidade, objetivo ou resultado?',
      'Quando foi a última vez que se entregou a algo criativo sem se preocupar com o resultado, a qualidade ou a aprovação dos outros?',
      'Você ri? Com frequência, de coração, espontaneamente, não por educação ou performance social?',
      'Há uma versão de você que adorava fazer algo, desenhar, cozinhar, jogar, cantar, dançar, escrever, que foi gradualmente abandonada pela vida adulta séria?',
    ],
    baixo: 'Vida dominada por obrigações e produtividade. Lazer visto como "perda de tempo". Criatividade suprimida. Pouca ou nenhuma leveza no cotidiano.',
    alto: 'Espaço regular para jogo, criação e alegria pura. Hobbies cultivados com carinho. Leveza, humor e espontaneidade como partes integrantes da vida.',
  },
]
