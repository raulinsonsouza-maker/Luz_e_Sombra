import type { AreaVidaId, NivelArea } from "./tipos";

export type TextoNivel = {
  oQueAcontece: string;
  passo: string;
  pergunta: string;
};

/** O que a nota diz em cada área, em voz humana. */
export const CONTEUDO_NIVEL: Record<AreaVidaId, Record<NivelArea, TextoNivel>> = {
  plenitudeFelicidade: {
    urgente: {
      oQueAcontece:
        "A alegria está em falta de um jeito que pesa no corpo inteiro. Os dias passam, e falta aquele fundo de que a vida vale a pena só por existir.",
      passo: "Hoje, nomeie em voz alta uma coisa pequena que te tocou sem você ter conquistado nada. Só presença.",
      pergunta: "Quando foi a última vez que você se sentiu leve sem motivo grande?",
    },
    atencao: {
      oQueAcontece:
        "A alegria ainda chega aos poucos. Tem dia leve, e tem dia em que a satisfação só aparece se algo lá fora mudar primeiro. Essa espera se alonga.",
      passo: "Antes de dormir, diga uma coisa boa do dia que não dependeu de conquista.",
      pergunta: "O que você anda adiando sentir até a vida 'ficar pronta'?",
    },
    desenvolvimento: {
      oQueAcontece:
        "Você está bem, e sabe que bem não é tudo. Há uma versão mais leve e presente disponível, sem exigir circunstâncias perfeitas.",
      passo: "Escolha um momento do dia para estar inteiro onde você está, sem celular e sem meta.",
      pergunta: "O que te aproxima do estado em que o tempo some?",
    },
    excelencia: {
      oQueAcontece:
        "Você cultiva alegria de forma genuína. Essa base sustenta o resto da vida com uma solidez rara.",
      passo: "Proteja um ritual diário que alimenta essa leveza, mesmo nos dias apertados.",
      pergunta: "Como você guarda esse estado quando a pressa chega?",
    },
  },
  espiritualidade: {
    urgente: {
      oQueAcontece:
        "Falta um fio que te ligue a algo maior. Perguntas de sentido assustam mais do que abrem, e esse medo de perguntar já é o problema.",
      passo: "Dez minutos de silêncio por dia, sem agenda. Só respirar.",
      pergunta: "O que acontece em você quando fica em silêncio de verdade?",
    },
    atencao: {
      oQueAcontece:
        "Há uma faísca de conexão, mas ainda falta uma prática que te sustente nos dias difíceis. Intensidade sem constância some na hora do aperto.",
      passo: "Quinze minutos diários de qualquer prática que traga silêncio interior. Prefira repetir a exagerar.",
      pergunta: "Qual prática pequena você conseguiria manter mesmo numa semana caótica?",
    },
    desenvolvimento: {
      oQueAcontece:
        "Há conexão real, ainda intermitente. O convite é integrar o sagrado ao cotidiano, não só aos momentos especiais.",
      passo: "Aprofunde a prática que já existe. Busque gente ou guia que ressoe com o seu caminho.",
      pergunta: "Onde sua espiritualidade ainda fica só na ideia, e não no corpo?",
    },
    excelencia: {
      oQueAcontece:
        "Sua vida interior é âncora. Você vive a partir de um propósito que passa do ego, e isso se sente em quem convive com você.",
      passo: "Ofereça um pouco dessa presença a alguém que está seco por dentro.",
      pergunta: "Como você nutre quem caminha perto de você?",
    },
  },
  saudeDisposicao: {
    urgente: {
      oQueAcontece:
        "O corpo pede socorro. Energia baixa, sono frágil e descuido cobram preço em tudo, em silêncio.",
      passo: "Escolha uma coisa só: dormir meia hora mais cedo ou caminhar vinte minutos. Repita sete dias.",
      pergunta: "Qual sinal do corpo você vem ignorando há tempo?",
    },
    atencao: {
      oQueAcontece:
        "Você se cuida no mínimo, e ainda trata o corpo como máquina que deve aguentar. Ele é aliado, não ferramenta descartável.",
      passo: "Revise o sono desta semana e acrescente um movimento que você goste de verdade.",
      pergunta: "O que o seu corpo pediria se pudesse falar sem filtro?",
    },
    desenvolvimento: {
      oQueAcontece:
        "A saúde anda razoável. Ainda dá para passar de reativo para preventivo, com mais vitalidade e consistência.",
      passo: "Agende o check-up que está adiando e olhe a alimentação por sete dias sem julgamento duro.",
      pergunta: "O que mudaria se você tratasse o corpo como parceiro de longo prazo?",
    },
    excelencia: {
      oQueAcontece:
        "Você habita o corpo com cuidado. Essa vitalidade potencializa o resto da vida e aparece para quem convive com você.",
      passo: "Mantenha o prazer dentro do cuidado, para a rotina não virar obrigação sem gosto.",
      pergunta: "Como você impede que o cuidado vire só disciplina seca?",
    },
  },
  desenvolvimentoIntelectual: {
    urgente: {
      oQueAcontece:
        "A mente está subnutrida. Sem estímulo intencional, a visão do mundo empobrece e o potencial encolhe.",
      passo: "Leia dez páginas por dia de um livro que te desafie. Troque vinte minutos de tela vazia por isso.",
      pergunta: "Quando foi a última vez que uma ideia mudou o jeito de você agir?",
    },
    atencao: {
      oQueAcontece:
        "Há consumo de conteúdo, e pouco aprendizado que transforma. Informação sobra. Mudança de olhar falta.",
      passo: "Escolha um tema para os próximos noventa dias e priorize profundidade, não quantidade.",
      pergunta: "O que você consome por hábito, e o que de fato te muda?",
    },
    desenvolvimento: {
      oQueAcontece:
        "Você aprende, ainda de forma dispersa. Um foco mais claro transformaria inputs em capacidade nova.",
      passo: "Ensine algo que sabe a alguém. Ensinar aprofunda o que você aprendeu.",
      pergunta: "Qual aprendizado desta estação você ainda não aplicou na vida real?",
    },
    excelencia: {
      oQueAcontece:
        "Sua mente está em expansão contínua. Aprender faz parte de quem você é, não de uma lista de tarefas.",
      passo: "Compartilhe e aplique o que aprende. Conhecimento circulando multiplica.",
      pergunta: "Como o que você aprende vira gesto concreto esta semana?",
    },
  },
  equilibrioEmocional: {
    urgente: {
      oQueAcontece:
        "As emoções estão no comando. Reatividade, repetição de dor ou anestesia pedem cuidado urgente e investimento real.",
      passo: "Antes de agir, diga: estou sentindo isto. Nomear é o primeiro freio gentil.",
      pergunta: "Qual emoção chega primeiro e toma a direção do seu dia?",
    },
    atencao: {
      oQueAcontece:
        "Há alguma consciência emocional, e ainda vêm ondas que poderiam ser navegadas com mais habilidade. O que não se processa muda de endereço.",
      passo: "Anote por sete dias o que sentiu e o gatilho. Só observar, sem se julgar.",
      pergunta: "Quais três gatilhos mais frequentes você já reconhece?",
    },
    desenvolvimento: {
      oQueAcontece:
        "Você processa bem no cotidiano, e ainda é desafiado sob pressão, conflito ou feridas antigas.",
      passo: "Escolha uma prática mais profunda: terapia, trabalho no corpo ou meditação de compaixão.",
      pergunta: "O que se ativa em você quando a pressão sobe?",
    },
    excelencia: {
      oQueAcontece:
        "Você sente fundo sem ser arrastado pelo que sente. Essa maturidade cria ambientes mais seguros ao redor.",
      passo: "Use essa capacidade para abrir espaço seguro a quem você ama ou lidera.",
      pergunta: "Como sua estabilidade emocional vira cuidado concreto pelos outros?",
    },
  },
  familia: {
    urgente: {
      oQueAcontece:
        "A família pesa de um jeito que dói no presente. Ferida antiga ou conflito ativo pedem atenção por você, não para agradar ninguém.",
      passo: "Escolha uma coisa que só você pode mudar nesta relação nesta semana. Uma só.",
      pergunta: "Que padrão familiar ainda dirige suas reações sem você perceber?",
    },
    atencao: {
      oQueAcontece:
        "Há relação, e falta intimidade real. Temas evitados e mágoas não ditas criam um vidro entre você e quem ama.",
      passo: "Trinta minutos de presença total com alguém da família. Sem telefone, sem agenda.",
      pergunta: "Qual conversa você vem adiando por medo do clima?",
    },
    desenvolvimento: {
      oQueAcontece:
        "A vida familiar está razoável e ainda pode ser mais profunda, honesta e nutritiva. Isso pede coragem de se mostrar.",
      passo: "Inicie a conversa que você evita. A qualidade sobe na proporção da honestidade.",
      pergunta: "O que você gostaria que existisse a mais nessa relação?",
    },
    excelencia: {
      oQueAcontece:
        "Os vínculos familiares nutrem de verdade. Você investe neles, e isso cria segurança na rede inteira.",
      passo: "Cuide da cultura de segurança emocional ao redor: diga o que sente e escute de volta.",
      pergunta: "Como você ajuda a família a respirar mais verdade?",
    },
  },
  desenvolvimentoAmoroso: {
    urgente: {
      oQueAcontece:
        "A vida amorosa carrega dor: relação que não nutre, ou padrões que se repetem e bloqueiam um amor saudável.",
      passo: "Olhe com honestidade: o que você está tolerando que não deveria? O que em você permite esse padrão?",
      pergunta: "Que história antiga ainda escolhe por você no amor?",
    },
    atencao: {
      oQueAcontece:
        "Há amor, e ele convive com distância, mágoa ou conversa insuficiente. O que existe tem potencial, e pede trabalho ativo.",
      passo: "Proponha uma conversa honesta sobre o que cada um precisa e o que não está funcionando.",
      pergunta: "O que você sente e ainda não disse a quem ama?",
    },
    desenvolvimento: {
      oQueAcontece:
        "O relacionamento é bom, e o conforto pode esconder áreas de crescimento. Amor saudável não vive no piloto automático.",
      passo: "Crie um ritual de conexão novo. Façam algo juntos que nunca fizeram.",
      pergunta: "Quando foi a última vez que vocês se surpreenderam um ao outro?",
    },
    excelencia: {
      oQueAcontece:
        "Há parceria de crescimento mútuo. Amor, respeito e evolução juntos: raro e precioso, e pede cultivo contínuo.",
      passo: "Perguntem juntos: o que queremos viver de novo neste próximo mês?",
      pergunta: "Como vocês evitam que o bom vire só costume?",
    },
  },
  vidaSocial: {
    urgente: {
      oQueAcontece:
        "Solidão real ou relações que drenam. Mesmo escolhido, o isolamento cobra na mente e no senso de quem você é.",
      passo: "Faça contato com uma pessoa que você admira e faz tempo que não vê. Não espere o momento perfeito.",
      pergunta: "De quem você sente falta e ainda não ligou?",
    },
    atencao: {
      oQueAcontece:
        "Há gente ao redor, e a conversa fica na superfície. Falta a profundidade que nasce de vulnerabilidade e investimento real.",
      passo: "Convide alguém para uma conversa de verdade, com intenção, não só um encontro social.",
      pergunta: "Com quem você pode ser inteiro sem se vigiar?",
    },
    desenvolvimento: {
      oQueAcontece:
        "A vida social existe e ainda pode ser mais intencional e alinhada com quem você é hoje. Muita relação rasa não substitui poucas profundas.",
      passo: "Invista mais em quem te inspira e menos no que só consome energia.",
      pergunta: "Quem na sua rede te faz crescer de verdade?",
    },
    excelencia: {
      oQueAcontece:
        "Você cultiva relações genuínas com cuidado. Sua rede é ativo de vida: gente que inspira, desafia e apoia.",
      passo: "Cuide da reciprocidade. Ofereça o mesmo cuidado que recebe.",
      pergunta: "Como você transforma essas relações em algo que também transforma o outro?",
    },
  },
  realizacaoProposito: {
    urgente: {
      oQueAcontece:
        "Viver sem fio de propósito é um sofrimento sutil e persistente. O automático pede redireção de atenção, não necessariamente de vida inteira.",
      passo: "Reserve duas horas e escreva: o que eu faria se soubesse que não posso fracassar?",
      pergunta: "O que te faz perder a noção do tempo de um jeito bom?",
    },
    atencao: {
      oQueAcontece:
        "Há direção, e o alinhamento entre o que você faz e o que acredita ainda é parcial. Esse cansaço é de alma, não só de agenda.",
      passo: "Nomeie a maior contradição entre seus valores e suas escolhas diárias. Reduza uma dissonância esta semana.",
      pergunta: "Onde sua semana trai o que você diz que importa?",
    },
    desenvolvimento: {
      oQueAcontece:
        "Há sentido na maior parte do tempo, e ainda existe uma expressão mais plena, corajosa e sua esperando espaço.",
      passo: "Nomeie o obstáculo real: medo, comodismo ou falta de clareza. Trabalhe nele, não no sintoma.",
      pergunta: "O que impede você de ir um passo mais fundo?",
    },
    excelencia: {
      oQueAcontece:
        "Você vive alinhado com um propósito que se alimenta sozinho. Isso é raro. A maioria passa a vida buscando o que você já encontrou.",
      passo: "Amplie o impacto. Quem mais pode se beneficiar do que você já descobriu?",
      pergunta: "Como seu propósito serve além de você nesta estação?",
    },
  },
  recursosFinanceiros: {
    urgente: {
      oQueAcontece:
        "A instabilidade financeira gera ruído de fundo que afeta atenção, relações e saúde. Clareza e um plano simples já aliviam.",
      passo: "Anote hoje, num papel, o que entra e o que sai. Sem maquiagem.",
      pergunta: "O que você evita olhar nas contas porque dá medo?",
    },
    atencao: {
      oQueAcontece:
        "Você sobrevive financeiramente e ainda não constrói. Sem reserva e plano, qualquer imprevisto vira ansiedade de fundo.",
      passo: "Crie uma reserva mínima como prioridade absoluta, mesmo que pequena e constante.",
      pergunta: "Quanto você precisaria guardar por mês para dormir mais leve?",
    },
    desenvolvimento: {
      oQueAcontece:
        "A situação é estável, e o crescimento ainda não é intencional. Administrar não é o mesmo que construir.",
      passo: "Defina um objetivo de três anos e revise com alguém que entende do assunto.",
      pergunta: "Para onde seu dinheiro trabalha além de pagar o mês?",
    },
    excelencia: {
      oQueAcontece:
        "Há clareza, organização e estratégia. O dinheiro trabalha com intenção e libera escolhas baseadas em valores.",
      passo: "Use parte dos recursos para impacto além de você: causa, pessoa, legado.",
      pergunta: "Como sua prosperidade serve ao que você acredita?",
    },
  },
  contribuicaoSocial: {
    urgente: {
      oQueAcontece:
        "O foco está quase só no individual. Falta um gesto constante que te ligue a algo maior que você.",
      passo: "Escolha uma causa que ressoa e dê um passo concreto nesta semana, não quando sobrar tempo.",
      pergunta: "Que dor do mundo te toca e você ainda não respondeu com gesto?",
    },
    atencao: {
      oQueAcontece:
        "Há intenção de contribuir, e as ações ainda são pontuais. Boa vontade sem compromisso regular vira só narrativa.",
      passo: "Estabeleça um compromisso fixo na agenda, como qualquer prioridade de vida.",
      pergunta: "O que você faria toda semana se a contribuição fosse tão séria quanto o trabalho?",
    },
    desenvolvimento: {
      oQueAcontece:
        "Você já contribui de formas reais. Dá para ir mais fundo: alinhar o que você faz melhor com o que o mundo precisa.",
      passo: "Liste suas competências mais fortes e onde elas fariam falta de verdade.",
      pergunta: "Onde só você, do seu jeito, pode fazer diferença?",
    },
    excelencia: {
      oQueAcontece:
        "Você age com responsabilidade pelo coletivo. Suas escolhas criam ondas que você às vezes nem vê.",
      passo: "Conte uma história do seu impacto. Isso inspira outros a agir também.",
      pergunta: "Quem pode aprender com o jeito que você contribui?",
    },
  },
  criatividadeHobbyDiversao: {
    urgente: {
      oQueAcontece:
        "A vida adulta engoliu o jogo. Sem criação e prazer, o espírito empobrece obrigação por obrigação.",
      passo: "Esta semana, faça uma coisa inútil que te dê prazer. Sem resultado. Só pelo gosto de ser.",
      pergunta: "O que você adorava fazer e abandonou por 'não dar tempo'?",
    },
    atencao: {
      oQueAcontece:
        "Há pequenos lazeres, ainda tratados como prêmio depois da obrigação. Brincar quase não tem horário marcado.",
      passo: "Marque na agenda, como reunião, uma hora só para brincar ou criar. Sem meta.",
      pergunta: "Se o lazer tivesse a mesma prioridade do trabalho, o que entraria na semana?",
    },
    desenvolvimento: {
      oQueAcontece:
        "Há espaço para criar e se divertir, ainda sem a regularidade que nutre de verdade. Leveza também se pratica.",
      passo: "Escolha um ou dois prazeres e cultive com dedicação, em vez de muitos rasos.",
      pergunta: "Qual criação sua está pela metade há tempo demais?",
    },
    excelencia: {
      oQueAcontece:
        "Você honra a criança que vive em você. Jogo e criação são pilares, não extra que sobra no fim do dia.",
      passo: "Proteja esse espaço numa cultura que só valoriza resultado.",
      pergunta: "Como você ensina leveza a quem vive sob pressão perto de você?",
    },
  },
};

export function nivelDe(valor: number): NivelArea {
  if (valor <= 3) return "urgente";
  if (valor <= 5) return "atencao";
  if (valor <= 7) return "desenvolvimento";
  return "excelencia";
}

export const LABEL_NIVEL: Record<NivelArea, string> = {
  urgente: "Atenção urgente",
  atencao: "Atenção necessária",
  desenvolvimento: "Em desenvolvimento",
  excelencia: "Ponto forte",
};
