import type { AnaliseNumero } from "@/lib/numerologia-data";

/**
 * Anos pessoais 1–9 e mestres 11/22.
 * Conteúdo aprofundado: clima do ciclo + carreira, finanças, relações, saúde.
 */
export const ANOS_PESSOAIS: Record<number, AnaliseNumero> = {
  1: {
    titulo: "Ano Pessoal 1. Inícios, autonomia e liderança",
    descricao:
      "Você entra em um ciclo de sementeira. O 1 não pede permissão: pede coragem para começar o que pode durar os próximos nove anos. Recomeçar com intenção vale mais do que reiniciar por impulso.",
    essencia:
      "Este é o ano de ser protagonista da própria vida. A energia favorece iniciativa, decisões de rumo e a confiança de que sua visão merece chão — sem esperar validação externa para o primeiro passo.",
    detalhado:
      "O Ano 1 abre o ciclo de nove anos. O que você planta agora tende a ecoar até o 9. Por isso o convite não é “começar tudo”, e sim escolher com consciência a semente principal: carreira, identidade, projeto ou forma de se relacionar. Autonomia verdadeira aparece quando você age e também quando define o que não vai carregar. Visibilidade sobe: sua voz e sua marca pessoal ganham força natural. Coragem aqui é calculada — ousar com plano, não com pressa. Se você só reage, o ciclo vira caos; se você lidera o próprio ritmo, o ciclo vira caminho.",
    temas: {
      carreira:
        "Ótimo para lançar negócio, assumir liderança, mudar de área ou propor o que estava engavetado. O mercado responde a quem se posiciona. Evite dez frentes: uma iniciativa-eixo bem cuidada rende mais do que um festival de começos. Peça, candidate-se, publique, inaugure — e sustente o primeiro trimestre com disciplina.",
      financas:
        "Momento de renda nova, investimento em autonomia e planos de longo prazo. Riscos calculados fazem sentido; gastos impulsivos disfarçados de ‘investir em mim’ não. Estruture orçamento desde o início do ciclo: o 1 planta, os anos seguintes colhem ou pagam a conta.",
      relacionamentos:
        "Foco em autenticidade e espaço pessoal. Relações que só existem se você se anula tendem a rachar. Pode haver recomeço afetivo ou renovação profunda do vínculo atual. Comunique o rumo sem atropelar: liderança íntima não é egoísmo quando há clareza e respeito.",
      saude:
        "Energia alta, adrenalina e cabeça cheias. Excelente para iniciar treino e hábitos — perigoso para tensão, enxaqueca e burnout precoce. Canalize o fogo em movimento regular e sono protegido. O corpo deste ano responde a direção, não a castigo.",
      desenvolvimento:
        "Autoconfiança, voz própria, liderança e disciplina de início. Cursos que fortaleçam posicionamento, oratória, gestão de projeto ou ofício solo. Pratique decidir em prazo curto e revisar com honestidade.",
      espiritualidade:
        "O sagrado pela ação consciente. Afirmações de poder, visualização criativa, meditação ativa (caminhar, escrever, construir). Espiritualidade que não vira fuga do mundo — vira coragem de habitá-lo.",
    },
    desafios: [
      "Arrogância por conquistas iniciais",
      "Impaciência com o que ainda não depende só de você",
      "Abrir muitos projetos e não regar nenhum",
      "Impulsividade financeira disfarçada de coragem",
    ],
    palavrasChave: ["começo", "iniciativa", "autonomia", "liderança", "coragem", "semente", "rumo"],
    afirmacoes: [
      "Eu sou autor(a) da minha vida neste ciclo",
      "Minhas ideias merecem um primeiro passo concreto",
      "Eu lidero meu ritmo com coragem e critério",
    ],
    praticasSugeridas: [
      "Escolha uma semente-eixo do ano e revise-a todo mês",
      "Journaling semanal: o que avancei de verdade?",
      "Networking intencional com quem já trilhou caminho parecido",
    ],
    areasDeAtencao: [
      "Equilibrar autonomia com colaboração",
      "Pedir ajuda sem sentir que perde poder",
      "Não usar o recomeço para fugir de um fim necessário",
    ],
  },
  2: {
    titulo: "Ano Pessoal 2. Parcerias, sensibilidade e diplomacia",
    descricao:
      "Depois do impulso do 1, o 2 suaviza o ritmo. É ciclo de cooperação, vínculos e maturação. Forçar resultado sozinho custa mais do que tecer com paciência.",
    essencia:
      "Este é o ano do nós. Sua força vem da escuta, da diplomacia e da capacidade de se tornar indispensável sem se anular. Não é ano de herói solitário — é de rede viva.",
    detalhado:
      "O 2 ensina timing. O que foi plantado no 1 precisa de terra, água e gente. Parcerias estratégicas — amorosas, profissionais, criativas — definem o rendimento do ciclo. Sensibilidade sobe: você sente o não dito e isso é poder, desde que não vire absorção crônica. Paciência aqui é estratégia, não passividade. Negocie, observe, acumule informação. Conflitos mal resolvidos pedem reparo com tato. O risco é perder-se no outro ou adiar decisões até a ansiedade decidir por você.",
    temas: {
      carreira:
        "Equipes, negociações, contratos, mediação e projetos a dois florescem. Evite decisões unilaterais em assuntos compartilhados. Sua reputação de alguém com quem dá para construir vale ouro neste ciclo.",
      financas:
        "Consolidar, revisar orçamentos, negociar condições e compartilhar responsabilidades com clareza. Bom para acordos e reservas. Ruim para apostas solitárias no calor da insegurança.",
      relacionamentos:
        "Ano de profundidade afetiva. Casamentos, reconciliações, parcerias formais e conversas que mudam o vínculo. Quem não cabe no ‘nós’ saudável fica evidente. Escuta verdadeira > performance de harmonia.",
      saude:
        "Emoção manda no corpo. Ansiedade por indecisão, peito apertado, sono irregular. Yoga, terapia, práticas em grupo seguro e limites energéticos ajudam. Não absorva o clima de todo mundo.",
      desenvolvimento:
        "Escuta ativa, empatia com limites, comunicação não violenta, intuição vs projeção. Distinguir o que é seu do que é do outro é a habilidade-mestre do 2.",
      espiritualidade:
        "Espiritualidade em relação: meditação a dois, retiros em grupo, cura de vínculos, rituais de perdão. O sagrado aparece no encontro — e no não que protege o encontro.",
    },
    desafios: [
      "Dependência emocional",
      "Procrastinação por medo de errar",
      "Omitir-se para ‘manter a paz’",
      "Esquecer as próprias necessidades",
    ],
    palavrasChave: ["parceria", "paciência", "diplomacia", "escuta", "vínculo", "timing", "cooperação"],
    afirmacoes: [
      "Eu construo pontes sem me apagar",
      "Minha sensibilidade é força com contorno",
      "Eu coopero e também me afirmo",
    ],
    praticasSugeridas: [
      "Uma conversa difícil por mês, com preparo e respeito",
      "Journaling sobre o que é seu e o que é do outro",
      "Terapia individual ou de vínculo, se o ciclo pedir",
    ],
    areasDeAtencao: [
      "Limites claros mesmo sendo diplomático(a)",
      "Não sacrificar necessidade para evitar atrito",
      "Cuidar da saúde emocional de propósito",
    ],
  },
  3: {
    titulo: "Ano Pessoal 3. Expressão, criatividade e expansão social",
    descricao:
      "O 3 traz brilho, voz e rede. Depois de tecer no 2, é hora de florescer: criar, comunicar, estudar e se mostrar — com entrega, não só entusiasmo.",
    essencia:
      "Este é o ano de aparecer com verdade. Criatividade e comunicação ganham vento. Quem se arrisca a compartilhar o que carrega dentro colhe conexão e oportunidades.",
    detalhado:
      "Expressão é o eixo. Escrita, fala, arte, conteúdo, aulas, humor, presença pública — o ciclo pede forma visível para o que era interno. Sociabilidade sobe: conheça gente, nutra rede, celebre com intenção. O perigo é dispersão: dez ideias, zero marco. Escolha um ou dois veículos de expressão e leve até resultado. Alegria aqui é prática, não fuga: leveza que comunica o essencial cura mais do que superficialidade crônica.",
    temas: {
      carreira:
        "Marketing, vendas, educação, artes, mídia, lançamentos e posicionamento público. Publique, apresente, ensine. Sua presença comunica antes do currículo — use isso com ética e consistência.",
      financas:
        "Monetizar talento criativo e comunicação. Cuidado com gasto por euforia. Transforme entusiasmo em oferta estruturada: preço, prazo, entrega.",
      relacionamentos:
        "Magnetismo e encontros. Relações ganham leveza e diálogo. Evite colecionar contatos sem profundidade. Dizer o que sente com graça fortalece mais do que performar charme.",
      saude:
        "Garganta, voz, respiração e humor. Dança, canto, movimento expressivo. Evite excesso de noites, álcool e agenda lotada ‘só por estímulo’. Alegria sustentável > pico e queda.",
      desenvolvimento:
        "Oratória, escrita, presença, storytelling, artes. Coragem de ser visto(a). Feedback de confiança > opinião de todo mundo.",
      espiritualidade:
        "Beleza como caminho: canto, criação ritual, gratidão expressa, celebração consciente. O sagrado também ri e cria.",
    },
    desafios: [
      "Dispersão em muitos projetos",
      "Superficialidade afetiva",
      "Gastos impulsivos no entusiasmo",
      "Hipersensibilidade a crítica",
    ],
    palavrasChave: ["expressão", "criatividade", "voz", "rede", "alegria", "visibilidade", "entrega"],
    afirmacoes: [
      "Minha expressão tem valor e lugar",
      "Eu me permito ser visto(a) com verdade",
      "Eu crio com alegria e compromisso",
    ],
    praticasSugeridas: [
      "Uma entrega criativa pública por quinzena",
      "Limite consciente de novas ideias por mês",
      "Três conversas profundas, não trinta superficiais",
    ],
    areasDeAtencao: [
      "Qualidade acima de quantidade",
      "Aprofundar vínculos, não só ampliar rede",
      "Equilibrar leveza com profundidade",
    ],
  },
  4: {
    titulo: "Ano Pessoal 4. Estrutura, disciplina e construção",
    descricao:
      "O 4 é alicerce. Depois de florescer no 3, o ciclo pede tijolo: rotina, sistema, trabalho honesto e base que sustente o que vem.",
    essencia:
      "Este é o ano do método. Não é o mais glamouroso — é o que impede o sonho de desabar. Construir com constância cria a liberdade que o impulso sozinho não entrega.",
    detalhado:
      "Organização vira poder: finanças, documentos, processos, casa, corpo. O progresso é tijolo a tijolo. Frustração com a lentidão é normal; responda com sistemas pequenos e repetíveis. Saúde e rotina são fundação, não detalhe. Planeje horizonte de 3 a 5 anos: o que precisa existir para o restante do ciclo não tremer? Perfeccionismo paralisa; consistência libera. O 4 ama quem faz o trabalho feio com dignidade.",
    temas: {
      carreira:
        "Aprofundar ofício, certificar, estruturar operação, melhorar qualidade e prazo. Mudanças bruscas rendem menos do que especialização e sistema. Seja a pessoa em quem se confia para entregar.",
      financas:
        "Poupar, quitar, reservar, investir com conservadorismo inteligente. Excelente para planejamento longo e eliminação de vazamentos. Evite atalhos ‘geniais’ sem base.",
      relacionamentos:
        "O vínculo é testado pela rotina real. Quem fica, fica de verdade. Compromissos sérios e divisão prática de responsabilidades fortalecem. Amor também é cumprir o combinado.",
      saude:
        "Coluna, joelhos, sono, alimentação e constância. Treino regular vence extremo. Postura e pausas importam. O corpo espelha a estrutura da vida.",
      desenvolvimento:
        "Gestão, técnica, projetos, finanças pessoais, ofício bem feito. Mentoria prática. Aprenda a fazer melhor o que já faz.",
      espiritualidade:
        "Ritual diário fixo: meditação no horário, journaling disciplinado, gratidão simples. O sagrado no cotidiano organizado.",
    },
    desafios: [
      "Rigidez que impede adaptação",
      "Perfeccionismo que trava",
      "Trabalho sem descanso",
      "Frustração com ritmo lento",
    ],
    palavrasChave: ["estrutura", "disciplina", "método", "base", "constância", "trabalho", "sistema"],
    afirmacoes: [
      "Eu construo com método e respeito ao tempo",
      "Minha disciplina cria liberdade real",
      "Cada tijolo de hoje sustenta o amanhã",
    ],
    praticasSugeridas: [
      "Sistema semanal de metas e revisão",
      "Organização financeira com ritual mensal",
      "Hábito físico sustentado por 30 dias seguidos",
    ],
    areasDeAtencao: [
      "Flexibilidade dentro da estrutura",
      "Incluir descanso no plano",
      "Não negligenciar relações pelo trabalho",
    ],
  },
  5: {
    titulo: "Ano Pessoal 5. Mudanças, liberdade e expansão",
    descricao:
      "O 5 mexe no que endureceu. Depois da base do 4, vem movimento: pivôs, viagens, imprevistos e reinvenção — com critério, não com fuga.",
    essencia:
      "Este é o ano de surfar a mudança. O cenário se altera; sua tarefa é adaptar-se com inteligência. Liberdade consciente, não caos romantizado.",
    detalhado:
      "O inesperado entra no roteiro. Resistir custa mais do que ajustar a vela. Liberdade aqui é autenticidade dentro do que importa — revisar o que limita sem destruir o essencial. Novas experiências ensinam: gente, lugares, formatos de trabalho. Versatilidade é ativo. O risco é dispersar, abandonar no meio e chamar impulso de destino. Mude o que pediu mudança; não quebre tudo para sentir ar.",
    temas: {
      carreira:
        "Mudança de emprego, pivô, freela, viagem a trabalho, oferta ‘fora do plano’. Esteja aberto(a) e mantenha âncora: critério, prazo, reserva. Contratos eternos no calor do 5 pedem leitura fria.",
      financas:
        "Ganhos e perdas por movimento. Projetos curtos, renda variável. Aumente reserva. Evite dívida por ‘oportunidade’ não testada.",
      relacionamentos:
        "Intensidade e novidade. Vínculos pedem ar; controle sufoca. Pode haver gente nova ou renegociação do formato. Não confunda excitação com profundidade.",
      saude:
        "Nervos, sono, desejo de estímulo. Movimento ajuda; excesso (tela, noite, substância) drena. Canalize em corpo e natureza. Limites são parte da liberdade.",
      desenvolvimento:
        "Idiomas, culturas, skills digitais, experiências diversas. Quanto mais repertório consciente, melhor o surfe do ciclo.",
      espiritualidade:
        "Espiritualidade em movimento: retiros, natureza, práticas de outras tradições, desapego ritual. Confiança no processo > controle rígido.",
    },
    desafios: [
      "Abandonar projetos cedo demais",
      "Impulsividade afetiva ou financeira",
      "Resistência à mudança necessária",
      "Dispersão sem conclusão",
    ],
    palavrasChave: ["mudança", "liberdade", "adaptação", "movimento", "experiência", "pivô", "ar"],
    afirmacoes: [
      "Eu confio na inteligência das mudanças",
      "Minha liberdade tem critério e cuidado",
      "Eu me adapto e aprendo com o que se move",
    ],
    praticasSugeridas: [
      "Planejamento flexível com revisão semanal",
      "Uma experiência nova significativa por mês",
      "Meditação de desapego antes de decisões grandes",
    ],
    areasDeAtencao: [
      "Distinguir liberdade de fuga",
      "Honrar compromissos essenciais",
      "Ancorar mudanças em valores claros",
    ],
  },
  6: {
    titulo: "Ano Pessoal 6. Amor, responsabilidade e harmonia",
    descricao:
      "O 6 traz lar, vínculos e dever afetivo. Depois do movimento do 5, o ciclo pede presença próxima: cuidar sem se apagar.",
    essencia:
      "Este é o ano do amor em ação — não o idealizado, o que serve, repara e constrói harmonia no cotidiano. Cuidar inclui você na lista.",
    detalhado:
      "Família, casa, parceria e responsabilidades próximas ganham centro. Questões antigas pedem conversa. Compromissos amadurecem ou se desfazem com honestidade. Beleza do ambiente importa: o espaço físico espelha e molda o emocional. Limites com amor são a arte do 6: dizer não sem culpa, dar sem martírio. Quem só nutre os outros chega ao fim do ano vazio — e ressentido.",
    temas: {
      carreira:
        "Saúde, educação, cuidado, estética, mediação, equilíbrio vida-trabalho. Evite ser o ‘pai/mãe’ da equipe. Negocie carga. Propósito sem limite vira burnout.",
      financas:
        "Estabilidade do núcleo: casa, educação, cuidado de quem depende de você. Planejamento conjunto. Imóvel e melhorias do lar podem fazer sentido com pé no chão.",
      relacionamentos:
        "Intensidade afetiva alta. Aprofundar, formalizar ou encerrar com dignidade. Família e intimidade pedem tempo real. Peça o que precisa com a mesma clareza com que oferece.",
      saude:
        "Coração (órgão e emoção), cansaço por sobrecarga, pele. Autocuidado é estratégia. Massagem, belo no ambiente, sono e ‘não’ regeneram a capacidade de amar.",
      desenvolvimento:
        "Inteligência emocional, limites, comunicação compassiva. Terapia de vínculo pode transformar o ciclo.",
      espiritualidade:
        "Devoção no cotidiano: rituais de casa, cuidado como oração, gratidão compartilhada. O sagrado na mesa e na presença.",
    },
    desafios: [
      "Auto-sacrifício que esgota",
      "Interferir na vida alheia",
      "Cobrança perfeccionista nos vínculos",
      "Negligenciar a si",
    ],
    palavrasChave: ["amor", "lar", "dever", "cuidado", "harmonia", "vínculo", "limite"],
    afirmacoes: [
      "Eu cuido de mim para cuidar melhor",
      "Meu amor inclui limites saudáveis",
      "Eu crio harmonia sem me perder",
    ],
    praticasSugeridas: [
      "Ritual semanal de casa e vínculo",
      "Um ‘não’ consciente por semana",
      "Autocuidado com horário na agenda",
    ],
    areasDeAtencao: [
      "Equilíbrio entre dar e receber",
      "Não assumir o que é do outro",
      "Cuidar da saúde com a mesma seriedade do cuidado alheio",
    ],
  },
  7: {
    titulo: "Ano Pessoal 7. Interiorização, estudo e espiritualidade",
    descricao:
      "O 7 desacelera de propósito. Depois do 6 intenso, o ciclo pede silêncio, estudo e profundidade. Menos barulho, mais verdade.",
    essencia:
      "Este é o ano de ir fundo — em conhecimento, em si, no sentido. O mundo externo afina o volume para o interno poder falar.",
    detalhado:
      "Pesquisa, especialização, introspecção e espiritualidade prática. Não é o melhor ano para lançamentos barulhentos; é excelente para preparar o terreno do 8. Seletividade social: qualidade de presença > quantidade de compromissos. Análise sem ação vira labirinto; recolhimento sem vínculo vira frio. Vá para dentro e volte com plano utilizável. O 7 aprofunda o que os outros anos só tocaram.",
    temas: {
      carreira:
        "Estudo, estratégia, análise, pesquisa, planejamento. Prepare o próximo salto com profundidade. Evite forçar expansão pública o ano inteiro — construa a base invisível que sustenta a colheita.",
      financas:
        "Reavaliar, pesquisar, consolidar. Pouca especulação; muita clareza. Assessoria especializada antes de movimentos grandes. O 8 agradece o que o 7 estudou.",
      relacionamentos:
        "Poucos e profundos. Parceiros com afinidade intelectual/espiritual ganham destaque. Avise quem importa que o recolhimento não é abandono. Não use silêncio como punição.",
      saude:
        "Sono, nervos, mente. Meditação, natureza, leitura, redução de estímulo. Vigie isolamento que vira depressão. Corpo pede restauração, não mais performance.",
      desenvolvimento:
        "Estudos densos, filosofia, psicologia, ofício profundo, mentoria. Um livro transformador por mês. Traduza insight em decisão.",
      espiritualidade:
        "Ano mais espiritual do ciclo: meditação longa, retiro, silêncio, estudo sagrado. Conecte prática com ética no cotidiano.",
    },
    desafios: [
      "Isolamento que vira solidão",
      "Análise paralisante",
      "Cinismo ou pessimismo",
      "Frieza percebida pelos próximos",
    ],
    palavrasChave: ["estudo", "silêncio", "profundidade", "estratégia", "espiritualidade", "discernimento", "retiro"],
    afirmacoes: [
      "Meu silêncio é produtivo e sagrado",
      "Eu me aprofundo com coragem",
      "Eu planejo com sabedoria para colher depois",
    ],
    praticasSugeridas: [
      "Meditação diária consistente",
      "Retiro ou fim de semana de silêncio no ano",
      "Plano escrito do que o próximo ciclo deve colher",
    ],
    areasDeAtencao: [
      "Não confundir introspecção com isolamento destrutivo",
      "Manter vínculos essenciais",
      "Traduzir conhecimento em plano concreto",
    ],
  },
  8: {
    titulo: "Ano Pessoal 8. Poder, realização e prosperidade",
    descricao:
      "O 8 é colheita. Depois do estudo do 7, o ciclo pede resultado: autoridade, dinheiro, meta e ética. O 8 amplifica o que foi construído — para o bem ou para o desgaste.",
    essencia:
      "Este é o ano em que o esforço ganha forma material. Não é presente: é retorno. Fundação sólida gera abundância; atalho e ego geram conta.",
    detalhado:
      "Manifestação, liderança executiva e relação com poder. Exija o justo: promoção, contrato, preço, reconhecimento. Gestão estratégica: números, prazos, auditoria pessoal. Ambição sem ética desaba; ética sem coragem de ocupar espaço também. Relação com dinheiro e autoridade vem à tona para ser amadurecida. Colha com responsabilidade — e descanse com a mesma seriedade com que produz.",
    temas: {
      carreira:
        "Expansão, liderança, negociação, escala, fechamentos importantes. Melhor janela do ciclo para ocupar posição e fechar o que estava na mesa. Lidere com integridade; conflito de ego aparece quando o poder não tem centro.",
      financas:
        "Ganhos significativos possíveis com canalização clara. Patrimônio, investimento estruturado, grandes contratos. Evite atalho antiético e dívida por status. Trate dinheiro como ferramenta, não como prova de valor.",
      relacionamentos:
        "Ambição testa o vínculo. Parceiros precisam de segurança e presença, não só do seu sucesso. Equilíbrio entre conquista e afeto. Compartilhe vitórias sem humilhar; peça apoio sem descarregar só pressão.",
      saude:
        "Burnout, coração, pressão, mandíbula, ombros. Resultado sem recuperação é dívida no corpo. Treino, sono e limites de hora extra são estratégia — não luxo.",
      desenvolvimento:
        "Liderança, finanças, negociação, delegação, inteligência executiva. Mentoria com quem já sustentou poder com ética.",
      espiritualidade:
        "Integrar prosperidade e consciência. Gratidão, filantropia, abundância como estado antes de conta bancária. Poder a serviço de algo maior que o ego.",
    },
    desafios: [
      "Ganância e poder como fim",
      "Workaholism",
      "Estresse por responsabilidade",
      "Conflitos de autoridade",
    ],
    palavrasChave: ["colheita", "poder", "prosperidade", "liderança", "resultado", "ética", "meta"],
    afirmacoes: [
      "Eu manifesto com ética e propósito",
      "Meu poder serve ao bem maior",
      "Eu colho o que plantei — e cuido da colheita",
    ],
    praticasSugeridas: [
      "Planejamento financeiro trimestral rigoroso",
      "Mentoria com líder íntegro",
      "Ritual de gratidão e partilha regular",
    ],
    areasDeAtencao: [
      "Não sacrificar saúde e vínculos pelo sucesso",
      "Ética sob pressão",
      "Usar poder para elevar, não só para acumular",
    ],
  },
  9: {
    titulo: "Ano Pessoal 9. Conclusões, liberação e transformação",
    descricao:
      "O 9 fecha o ciclo de nove anos. Termine, liberte, perdoe e limpe o terreno. O próximo 1 precisa de mesa vazia — não de bagagem não resolvida.",
    essencia:
      "Este é o ano da sabedoria do desapego. Não é só fim: é preparação sagrada para um começo novo. O que você solta cria espaço; o que segura vira peso.",
    detalhado:
      "Encerramentos necessários: projetos, padrões, relações, crenças. Liberação ativa — doar, perdoar, completar. Compaixão se amplia para além do ego: serviço, causa, generosidade. Faça o balanço dos nove anos: o que levar, o que deixar. Nostalgia e medo do vazio são naturais; martírio e reabrir o morto não ajudam. Encerrar bem é inteligência de ciclo. Evite lançar megaprojeto antes de limpar a mesa.",
    temas: {
      carreira:
        "Finalizar, documentar legado, encerrar contratos ruins, preparar transição. Consolidar o que foi feito. Não é o melhor ano para inaugurar império — é para completar com dignidade.",
      financas:
        "Quitar, simplificar, desinvestir do que drena, organizar patrimônio. Liberar o que impede o próximo ciclo de respirar.",
      relacionamentos:
        "Despedidas, perdões, transformações profundas. Pode doer e ainda assim ser certo. Generosidade sem martírio. Não reabra o fim só por medo do vazio.",
      saude:
        "Limpeza, desintoxicação, cansaço de ciclo, emoção à flor da pele. Descanso, natureza, rituais de fechamento. Sinta e complete — não anestesie o fim.",
      desenvolvimento:
        "Filosofia de vida, propósito, legado. O que importa quando o ciclo fecha? Essa pergunta orienta o próximo 1.",
      espiritualidade:
        "Perdão, rituais de encerramento, morte simbólica, serviço. Conexão com o que transcende o individual.",
    },
    desafios: [
      "Segurar por medo do vazio",
      "Melancolia que paralisa",
      "Confundir limpeza com perda",
      "Começar grande antes de terminar",
    ],
    palavrasChave: ["conclusão", "liberação", "desapego", "perdão", "ciclo", "limpeza", "legado"],
    afirmacoes: [
      "Eu deixo ir com amor o que já cumpriu",
      "Cada encerramento abre espaço",
      "Eu me transformo e sigo mais livre",
    ],
    praticasSugeridas: [
      "Ritual anual de liberação (carta, doação, corte limpo)",
      "Lista do incompleto com datas de fechamento",
      "Processo consciente de perdão",
    ],
    areasDeAtencao: [
      "Não iniciar o grande antes de fechar o pendente",
      "Honrar a tristeza sem afundar nela",
      "Preparar o terreno do próximo ciclo",
    ],
  },
  11: {
    titulo: "Ano Pessoal 11. Intuição, inspiração e sensibilidade",
    descricao:
      "O 11 é intensidade espiritual rara. A antena sobe: insights podem redirecionar a rota. Sem ancoragem, vira ansiedade; com ancoragem, vira farol.",
    essencia:
      "O véu afina. Você percebe mais — e precisa escolher o que merece chão. Canalizar sem aterrar esgota; aterrar a visão eleva.",
    detalhado:
      "Intuição no pico, liderança por inspiração, nervos à flor da pele. Pessoas sentem sua presença. O risco é misticismo sem aplicação ou absorver o mundo inteiro. Cada insight pede um gesto concreto. Proteja o sistema nervoso como quem protege o instrumento de trabalho. O 11 ilumina o ciclo — desde que você traduza luz em passo.",
    temas: {
      carreira:
        "Aconselhamento, arte, espiritualidade aplicada, visão de marca, ensino inspirador. Traduza insight em protótipo, texto ou oferta útil. Evite decisão só no êxtase.",
      financas:
        "Monetizar dons com estrutura. Cuidado com ingenuidade e ‘universo providencia’ sem planilha. Idealismo precisa de contrato.",
      relacionamentos:
        "Empatia alta: você sente demais. Discernimento essencial. Pode atrair quem pede cura — escolha com quem abrir o canal. Não salve quem não pediu.",
      saude:
        "Nervos, sono, adrenalina. Ancoragem diária obrigatória: corpo, natureza, redução de estímulo. O 11 sem corpo vira pânico.",
      espiritualidade:
        "Aceleração: meditação, canalização consciente, cura, diário de sincronicidades. Prática com proteção e ética.",
    },
    desafios: [
      "Ansiedade e hipersensibilidade",
      "Viver entre dois mundos sem aterrar",
      "Absorver emoções do ambiente",
    ],
    palavrasChave: ["intuição", "inspiração", "visão", "ancoragem", "canal", "sensibilidade", "luz"],
    afirmacoes: [
      "Eu sou canal consciente e protegido",
      "Minha intuição me guia — e meus pés no chão sustentam",
    ],
    praticasSugeridas: [
      "Meditação e ancoragem diárias",
      "Diário de insights com um gesto por quinzena",
      "Limite de exposição a ambientes caóticos",
    ],
    areasDeAtencao: [
      "Ancorar antes de decidir",
      "Não confundir intuição com ansiedade",
      "Cuidar do corpo como instrumento",
    ],
  },
  22: {
    titulo: "Ano Pessoal 22. Mestre construtor — legado em escala",
    descricao:
      "O 22 pede construir o que serve a muitos. Visão grande com método. Se a grandeza paralisar, trabalhe na raiz 4: uma etapa clara por vez.",
    essencia:
      "Este é o ano de erguer além de si. Legado, sistema, impacto. A responsabilidade pesa — e o potencial também.",
    detalhado:
      "Integração visão-execução. Pense grande e planeje com rigor. Liderança responsável: cada decisão ecoa. Não precisa terminar o monumento no ano — precisa de fundação séria, equipe e ritmo sustentável. Legado sem saúde vira ruína. Delegue. Documente. O 22 une o sonho do 11 com o tijolo do 4.",
    temas: {
      carreira:
        "Projetos de escala, operações, fundações, produtos que servem muitos, liderança de impacto. Progresso > perfeição. Uma base sólida vale mais do que dez ideias geniais sem chão.",
      financas:
        "Movimentos grandes exigem assessoria e plano. Capital a serviço da visão, não do ego. Risco calculado com estrutura.",
      relacionamentos:
        "Parcerias que sustentam missão. O peso do projeto pode tensionar a intimidade — comunique a carga e divida cuidado. Amor não compete com legado; compete com desorganização.",
      saude:
        "Exaustão por responsabilidade. Descanso programado é estratégico. Costas, sono, limites de agenda. Método, não heroísmo.",
      espiritualidade:
        "Missão com consciência. Fazer o extraordinário sem perder humanidade. Serviço estruturado > martírio.",
    },
    desafios: [
      "Paralisia pela grandeza",
      "Peso esmagador da responsabilidade",
      "Workaholism justificado pela missão",
    ],
    palavrasChave: ["legado", "escala", "construção", "método", "impacto", "visão", "fundação"],
    afirmacoes: [
      "Eu manifesto o extraordinário com método e cuidado",
      "Meu legado serve — e eu também mereço sustentação",
    ],
    praticasSugeridas: [
      "Etapa mensurável do projeto maior a cada mês",
      "Papéis claros: quem faz o quê até quando",
      "Recuperação com a mesma seriedade do trabalho",
    ],
    areasDeAtencao: [
      "Não paralisar pelo tamanho",
      "Delegar de verdade",
      "Saúde como parte do plano de legado",
    ],
  },
};
