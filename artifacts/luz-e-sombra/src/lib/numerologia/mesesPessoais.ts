import type { EnergiaMesPessoal } from "./energiaNumerologica";

/**
 * Meses pessoais 1–9 e mestres 11/22/33.
 * Voz acolhedora e prática: o que fazer, onde olhar, o que evitar.
 * Base ampliada com carreira, relações e corpo.
 */
export const MESES_PESSOAIS: Record<number, EnergiaMesPessoal> = {
  1: {
    energia: "Iniciar",
    titulo: "Mês de abrir caminho",
    descricao:
      "Este mês pede autoria: o que ficou parado só anda se você plantar com coragem. Um começo consciente vale mais do que cinco aberturas por pressa.",
    profundidade:
      "É o mês de assumir o volante. A energia favorece iniciativa, reinício e decisões que só você pode tomar — carreira, hábito, relação ou projeto. Plante uma semente principal e regue; querer reinventar tudo ao mesmo tempo dilui a força. Independência sobe: o risco é empurrar os outros para fora ou chamar impulsividade de coragem. Liderar neste ciclo não é isolar-se — é decidir, comunicar o rumo e sustentar o primeiro passo até ele virar caminho. O que você inicia agora tende a ecoar nos próximos meses; escolha com intenção, não com ansiedade.",
    clima: "Novos projetos, postura de liderança, decisões de rumo, disciplina inicial e coragem para ocupar espaço.",
    sombra: "Reinício impulsivo, egocentrismo do ciclo, abandono do que ainda precisava fechar ou pressa disfarçada de ousadia.",
    reflexao: "Qual começo deste mês você ainda espera que alguém autorize?",
    acoes: [
      "Escolha um projeto-eixo do mês e dê o primeiro passo concreto na primeira quinzena.",
      "Declare o compromisso em voz alta para alguém de confiança.",
      "Revise no meio do mês: o que avançou de verdade e o que era só intenção.",
      "Defina um limite claro: o que este mês você não vai carregar.",
    ],
    evitar: [
      "Abrir três vidas novas no mesmo mês.",
      "Usar o ‘recomeço’ para fugir de uma conclusão necessária.",
      "Decidir sozinho e só avisar depois, quando o outro já foi atropelado.",
    ],
    palavrasChave: ["autoria", "semente", "liderança", "rumo", "coragem"],
    areas: ["projeto que você adia", "decisões só suas", "como você se posiciona"],
    carreira:
      "Bom mês para lançar, pedir, propor e assumir frente. Evite esperar o ‘momento perfeito’. Negocie com clareza o que é seu e o que é compartilhado. Se há promoção, candidatura ou pivô na mesa, este ciclo favorece o primeiro movimento — desde que seja um, não dez.",
    relacoes:
      "Menos romance de fusão, mais honestidade de rumo. Conversas de limite e de desejo pessoal ganham força. Comunique o que precisa sem anular o outro; o atrito do mês 1 costuma vir de iniciativa unilateral, não de coragem em si.",
    saude:
      "O corpo pede movimento e direção: caminhada com intenção, treino curto e constante, sono protegido. Cabeça e adrenalina sobem — se não ancorar, vira irritação e pressa. Pare no fim do dia para registrar o que de fato começou.",
  },
  2: {
    energia: "Cooperar",
    titulo: "Mês de parceria e paciência",
    descricao:
      "Este mês anda melhor em dois. Acordos, escuta e timing pesam mais do que a pressa de resolver sozinho.",
    profundidade:
      "Depois do impulso do 1, o 2 pede receptividade. Relacionamentos, diplomacia e construção lenta de confiança entram no centro. Ouça o mercado, a família, o corpo — e não force a colheita. A sensibilidade sobe; conflitos mal resolvidos doem mais. Paciente não é passivo: é quem prepara o terreno, ajusta detalhes e deixa o outro revelar a carta. Decisões grandes só para acabar com a ansiedade da espera costumam sair caras. Este mês recompensa quem coopera sem se anular e quem espera sem se omitir.",
    clima: "Alianças, negociação, cuidado relacional, informação, detalhes e um ritmo mais lento.",
    sombra: "Dependência, indecisão crônica, absorver o clima emocional alheio ou concordar o mês todo e explodir no fim.",
    reflexao: "Com quem este mês pede conversa verdadeira — não só educada?",
    acoes: [
      "Feche ou avance um acordo que está pela metade.",
      "Reserve espaços do mês só para escuta, sem agenda de ‘resolver’.",
      "Peça ajuda em um ponto que você insiste em carregar sozinho.",
      "Anote o que ouviu de verdade — e o que só fingiu ouvir.",
    ],
    evitar: [
      "Decidir por outra pessoa ‘para facilitar’.",
      "Concordar o mês todo e explodir no fim.",
      "Forçar resultado quando o processo ainda pede maturação.",
    ],
    palavrasChave: ["parceria", "paciência", "diplomacia", "vínculo", "timing"],
    areas: ["conversas adiadas", "acordos pela metade", "quem divide o caminho com você"],
    carreira:
      "Favorável a trabalho em equipe, negociações delicadas e revisão de detalhes. Não é o melhor mês para imposição solitária. Use reuniões para alinhar, não para atropelar. Parcerias, contratos e feedbacks ganham qualidade quando há tempo de escuta.",
    relacoes:
      "O vínculo pede presença suave. Questões pendentes pedem tato, não ultimato. Bom para reconciliar e para construir confiança. Se alguém não corresponde, o mês 2 mostra — sem você precisar forçar a prova.",
    saude:
      "Sistema nervoso e emoção ficam mais porosos. Reduza barulho, hidrate, priorize sono e evite absorver discussões alheias. Toque, natureza e rotinas a dois (ou em companhia segura) acalmam mais do que isolamento ríspido.",
  },
  3: {
    energia: "Expressar",
    titulo: "Mês de voz e criatividade",
    descricao:
      "Este mês pede que você se mostre: diga, crie, conecte. O que fica só na cabeça perde força ao longo das semanas.",
    profundidade:
      "Expansão criativa e social. Ideias, humor, conteúdo, apresentações e encontros florescem. A voz — profissional ou íntima — quer espaço. O risco clássico é espalhar-se: muitos planos, pouca entrega, gastos por entusiasmo, conversa que evita o que dói. Escolha um veículo de expressão e leve até um marco visível. Mostrar-se com verdade abre mais portas do que planejar em silêncio. Leveza é recurso, não fuga: use-a para comunicar, não para maquiar.",
    clima: "Criação, comunicação, rede, otimismo, visibilidade leve e convívio.",
    sombra: "Dispersão, superficialidade, consumo impulsivo de prazer ou usar humor para não falar do essencial.",
    reflexao: "O que este mês precisa ver de você — não só ouvir planejar?",
    acoes: [
      "Publique, apresente ou entregue uma peça criativa até o fim do mês.",
      "Retome três contatos que importam e nutra a relação.",
      "Defina um limite de novas ideias para não matar a que já está em curso.",
      "Escreva ou fale uma verdade que você vem enfeitando.",
    ],
    evitar: [
      "Abrir dez projetos criativos.",
      "Usar leveza para não falar do que dói.",
      "Gastar por euforia e chamar isso de ‘investimento em si’.",
    ],
    palavrasChave: ["expressão", "criatividade", "visibilidade", "rede", "entrega"],
    areas: ["o que você ainda não disse", "trabalho guardado", "encontros que nutrem"],
    carreira:
      "Excelente para pitches, conteúdo, marketing, aulas, networking e lançamentos leves. Se o projeto estava no silêncio, este é o mês de mostrar. Cuidado com prometer mais do que consegue entregar na onda do entusiasmo.",
    relacoes:
      "Socializar nutre. Encontros, flertes de ideia e conversas criativas fluem. Evite superficialidade crônica: escolha algumas relações para profundidade real. Dizer o que sente com leveza é o ouro do mês 3.",
    saude:
      "Energia sobe; garganta, voz e respiração pedem cuidado. Cante, fale, respire, mova o corpo com prazer. Evite excesso de café, álcool e noites viradas ‘só mais uma’. Alegria sustentável > pico seguido de queda.",
  },
  4: {
    energia: "Construir",
    titulo: "Mês de alicerce",
    descricao:
      "Este mês pede base: contas, hábitos, sistemas e trabalho constante. O que está solto pede ordem que você consiga manter.",
    profundidade:
      "Construção paciente. Casa, corpo, finanças e processos definem o rendimento do ciclo. Pode parecer sem brilho — e é exatamente por isso que sustenta os meses seguintes. Frustração com a lentidão é normal; responda com sistemas pequenos e repetíveis, não com heroísmo de um dia. Se surgir vontade de obra gigante, fundação primeiro. O mês 4 recompensa quem faz o trabalho feio com dignidade e quem organiza o caos sem virar prisioneiro da perfeição.",
    clima: "Rotina, trabalho, organização, saúde prática, documentos e estabilidade.",
    sombra: "Rigidez, trabalho sem limite, perfeccionismo, ressentir a ‘falta de magia’ ou ocupar-se para não olhar o essencial.",
    reflexao: "Qual estrutura deste mês, se bem feita, te carrega nos próximos?",
    acoes: [
      "Monte ou ajuste um sistema — dinheiro, agenda ou casa — e mantenha até o fim do mês.",
      "Feche as contas e veja o que entra, sai e some.",
      "Escolha um hábito físico sustentado: sono, movimento ou alimentação.",
      "Termine uma pendência burocrática que trava o resto.",
    ],
    evitar: [
      "Querer deixar tudo perfeito e não implantar nada.",
      "Usar ocupação para não olhar o essencial.",
      "Criticar a lentidão alheia enquanto sua base ainda treme.",
    ],
    palavrasChave: ["fundação", "disciplina", "sistema", "constância", "casa"],
    areas: ["dinheiro e contas", "rotina do mês", "o que está pela metade no trabalho"],
    carreira:
      "Mês de infraestrutura: processos, planilhas, prazos, qualidade e entrega consistente. Promoções flashy são menos o foco do que merecimento construído. Bom para organizar equipe, backlog e operação.",
    relacoes:
      "Menos drama, mais confiabilidade. Mostre amor cumprindo o que prometeu. Conflitos pedem diálogo prático, não explosão. Dividir tarefas da casa ou do projeto fortalece o vínculo mais do que discursos.",
    saude:
      "Coluna, joelhos, rotina e sono. Exercício regular vence treino extremo. Alimentação estável, horários previsíveis e pausas reais. O corpo deste mês responde à constância, não ao castigo.",
  },
  5: {
    energia: "Expandir",
    titulo: "Mês de mudança e liberdade",
    descricao:
      "Este mês mexe no que estava parado. Convites, viagens, pivôs e solturas pedem flexibilidade — sem abandonar o essencial.",
    profundidade:
      "Vento no ciclo: variação, aprendizado rápido, quebra de rotina e desejo de ar. Planos rígidos sofrem. Quem se adapta colhe experiência; quem se agarra ao conhecido sofre duas vezes. Cuidado com dispersão, excesso e decisões definitivas no calor do momento. Mude o passo do mês, não a vida inteira numa tarde. Liberdade com critério: experimente, teste, viaje se puder — e documente o que aprendeu para não repetir o caos como estilo de vida.",
    clima: "Mudança, deslocamento, promoção de ideias, experimentação, renovação e imprevisto útil.",
    sombra: "Impulsividade, fuga, estímulo em excesso, irresponsabilidade disfarçada de autenticidade ou quebrar tudo no impulso.",
    reflexao: "O que você segura só porque já está acostumado?",
    acoes: [
      "Aceite um convite ou rota nova alinhada ao que você quer viver.",
      "Solte um compromisso ou hábito do mês que só cansa.",
      "Documente o que aprendeu com as mudanças — para não repetir o caos.",
      "Faça uma mudança calculada que você adia há tempo.",
    ],
    evitar: [
      "Quebrar tudo no impulso.",
      "Chamar fuga de ‘autenticidade’.",
      "Assinar compromisso definitivo no pico da euforia ou da raiva.",
    ],
    palavrasChave: ["mudança", "liberdade", "adaptação", "experiência", "movimento"],
    areas: ["o que você quer mudar e adia", "convites fora da rotina", "hábitos que cansam"],
    carreira:
      "Pivôs, entrevistas, freelas, viagens a trabalho, testes de produto e networking móvel. Bom para sair da caixa — mal para contratos eternos assinados sem ler. Mantenha uma âncora: prazo, orçamento ou critério de decisão.",
    relacoes:
      "Vínculos pedem ar. Ciúme e controle sofrem; honestidade e espaço florescem. Pode surgir gente nova ou vontade de renegociar o formato da relação. Não confunda novidade com profundidade.",
    saude:
      "Nervos e desejo de estímulo sobem. Cuidado com excessos (tela, noite, substância, gasto). Canalize em movimento: caminhada longa, esporte novo, viagem curta. Hidrate e durma — liberdade sem corpo é só ansiedade.",
  },
  6: {
    energia: "Cuidar",
    titulo: "Mês de lar e vínculos",
    descricao:
      "Este mês pede presença em casa e nas relações próximas. Responsabilidade com afeto — sem se apagar.",
    profundidade:
      "Coração e dever no centro: família, parceria, casa, cuidado e serviço. Demandas aumentam; o aprendizado é servir sem martírio. Bom para reconciliar, cuidar da saúde, embelezar o ambiente e alinhar o amor com ação concreta. Se você só cuida dos outros, o mês cobra. Inclua-se na lista de quem merece presença. Amor neste ciclo não é discurso — é presença, limite e reparo.",
    clima: "Família, casa, amor, deveres, cura relacional, beleza do cotidiano e serviço próximo.",
    sombra: "Controle disfarçado de cuidado, culpa, anulação, resgate compulsivo ou raiva guardada por dar demais.",
    reflexao: "Onde o cuidado deste mês é amor — e onde é medo de decepcionar?",
    acoes: [
      "Faça a conversa de casa ou de vínculo que está esperando.",
      "Melhore um aspecto concreto do lar ou da rotina de cuidado.",
      "Reserve presença sem celular para quem importa — e para você.",
      "Diga um não claro a um pedido que só alimenta culpa.",
    ],
    evitar: [
      "Dar tanto que a raiva fica guardada.",
      "Usar o cuidado com os outros para não olhar para si.",
      "Resolver a vida alheia e negligenciar a própria casa.",
    ],
    palavrasChave: ["lar", "vínculo", "dever", "afeto", "responsabilidade"],
    areas: ["a casa", "pessoas próximas", "cuidado com o corpo"],
    carreira:
      "Pode puxar para mediação, atendimento, RH, ensino, cuidado com clientes ou equilíbrio vida-trabalho. Evite assumir o papel de ‘pai/mãe’ da equipe. Negocie carga; serviço sem limite vira burnout.",
    relacoes:
      "Mês forte para conversas de casal, família e amizades íntimas. Cura e cobrança andam juntas. Beleza e hospitalidade ajudam, mas o essencial é honestidade afetiva. Peça o que precisa com a mesma clareza com que oferece.",
    saude:
      "Peito, coração emocional, pele e cansaço por sobrecarga. Autocuidado não é luxo: é o que permite cuidar. Massagem, belo no ambiente, comida nutritiva e limites de disponibilidade regeneram.",
  },
  7: {
    energia: "Aprofundar",
    titulo: "Mês de interioridade",
    descricao:
      "Este mês pede menos barulho e mais verdade. Estudo, silêncio e perguntas honestas esclarecem o que a pressa embaça.",
    profundidade:
      "Retiro ativo: pesquisa, espiritualidade prática, análise e descanso nervoso. Não é o melhor mês para forçar expansão social o tempo todo. A qualidade das decisões sobe quando você reduz estímulo. Cuidado para não isolar-se por superioridade nem sumir das contas da vida. Vá para dentro — e volte com uma clareza utilizável. O 7 aprofunda o que o resto do ciclo só passou batido.",
    clima: "Estudo, introspecção, espiritualidade, análise, refinamento e silêncio produtivo.",
    sombra: "Isolamento frio, cinismo, excesso de pensamento, negligência prática ou sumir e chamar isso de sabedoria.",
    reflexao: "O que este mês já te mostrou e você ainda não admite?",
    acoes: [
      "Estabeleça um ritual mensal de silêncio ou estudo, com horários fixos.",
      "Estude uma questão de verdade — sem transformar em performance.",
      "Cuide de sono e nervos: o corpo é o laboratório deste mês.",
      "Faça um balanço honesto do semestre/ciclo — no papel, não só na cabeça.",
    ],
    evitar: [
      "Sumir das pessoas e chamar isso de sabedoria.",
      "Pensar tanto que conta, trabalho e casa param.",
      "Forçar lançamentos barulhentos contra a maré do mês.",
    ],
    palavrasChave: ["profundidade", "estudo", "discernimento", "silêncio", "verdade"],
    areas: ["o que você já sabe e não admite", "estudo que importa", "tempo sozinho neste mês"],
    carreira:
      "Pesquisa, planejamento, análise, cursos, estratégia e revisão de rota. Evite launches agressivos. Use o mês para estudar o terreno; o próximo ciclo colhe o que você esclareceu agora.",
    relacoes:
      "Prefira poucas conversas profundas a muitas superficiais. Pode parecer distante — avise quem importa. Intimidade intelectual e espiritual ganha; festa vazia cansa. Não use o silêncio como punição.",
    saude:
      "Sistema nervoso e mente. Meditação, natureza, leitura, sono e redução de tela. Evite overthinking noturno. O corpo pede descanso restaurador, não mais estímulo.",
  },
  8: {
    energia: "Realizar",
    titulo: "Mês de colheita e poder",
    descricao:
      "Este mês pede resultado: acordo, preço, meta, visibilidade profissional. Conduza com responsabilidade — a colheita responde ao que foi plantado.",
    profundidade:
      "Manifestação material e autoridade. Negociações, reconhecimento, dinheiro e estrutura de poder entram em cena. Hora de cobrar o justo e ocupar espaço. Ética e presença sustentam; arrogância e atalho derrubam. Olhe números reais, não só ambição. Resultado com responsabilidade pesa mais do que status. O mês 8 mostra o retorno do que foi construído — e cobra o que foi adiado.",
    clima: "Carreira, finanças, autoridade, metas, reconhecimento e decisões firmes.",
    sombra: "Controle, ganância, trabalho sem limite, medir valor só por conquista ou passar por cima de gente.",
    reflexao: "Onde você cobra menos — ou exige mais — do que o trabalho vale?",
    acoes: [
      "Feche o acordo, preço ou promoção em aberto: diga o número.",
      "Corte um gasto recorrente que não serve.",
      "Tome a decisão profissional que está na mesa.",
      "Peça o reconhecimento ou o recurso que você já mereceu.",
    ],
    evitar: [
      "Passar por cima de pessoas para chegar no resultado.",
      "Trabalhar sem recuperação e chamar isso de mérito.",
      "Confundir poder com dureza.",
    ],
    palavrasChave: ["colheita", "poder", "dinheiro", "meta", "ética"],
    areas: ["valor do seu trabalho", "acordos abertos", "dinheiro que escapa"],
    carreira:
      "Mês clássico para promoção, fechamento, investimento, liderança e negociação salarial. Entre na sala preparado. Lidere com integridade; conflitos de ego aparecem quando o poder não tem ética.",
    relacoes:
      "Pode haver disputa de espaço ou cobrança de reciprocidade. Parcerias pedem clareza de papéis e de dinheiro. Respeito mútuo vale mais do que ‘ganhar’ a discussão. Compartilhe vitórias sem humilhar.",
    saude:
      "Tensão, pressão arterial, mandíbula, ombros. Resultado sem recuperação vira dívida no corpo. Treino de força com descanso, limites de hora extra e sono são parte da estratégia — não luxo.",
  },
  9: {
    energia: "Encerrar",
    titulo: "Mês de fechar ciclos",
    descricao:
      "Este mês pede conclusão e liberação. Termine, agradeça, doe e solte — para o próximo ciclo ter chão limpo.",
    profundidade:
      "Colheita emocional e limpeza: fim de projetos, relações que já cumpriram, perdão prático e generosidade. Não é o melhor momento para lançar obra de longo prazo — é o mês de completar. Nostalgia e martírio são as armadilhas. Encerrar bem é inteligência de ciclo, não fracasso. O que você solta agora cria espaço para o que vem; o que você segura vira peso no próximo começo.",
    clima: "Conclusões, doação, perdão, limpeza, compaixão, balanço e descanso de ciclo.",
    sombra: "Segurar o passado, martírio, começar o que deveria terminar ou reabrir ferida em nome de ‘só mais uma chance’.",
    reflexao: "O que já acabou e você ainda carrega como se fosse presente?",
    acoes: [
      "Liste o incompleto e feche o que der para fechar neste mês.",
      "Doe, venda ou descarte o que guarda sem uso.",
      "Faça a conversa de agradecimento ou despedida que falta — sem reabrir tudo.",
      "Perdoe na prática: um gesto, uma carta ou um corte limpo.",
    ],
    evitar: [
      "Abrir projeto grande antes de limpar a mesa.",
      "Segurar o que já acabou só por saudade.",
      "Transformar o fim em drama eterno.",
    ],
    palavrasChave: ["conclusão", "liberação", "generosidade", "ciclo", "limpeza"],
    areas: ["o incompleto", "conversas que pedem fim", "o que você guarda sem uso"],
    carreira:
      "Feche entregas, encerre contratos ruins, documente aprendizados, mentore ou doe conhecimento. Evite iniciar megaprojeto. Bom para encerrar fase e preparar o terreno do próximo ciclo.",
    relacoes:
      "Despedidas, perdões e liberações. Pode doer — e ainda assim ser certo. Generosidade e compaixão ajudam; martírio não. Não reabra o que já mostrou o fim só por medo do vazio.",
    saude:
      "Cansaço de ciclo, emoção à flor da pele. Limpeza (casa, agenda, corpo), descanso e rituais de fechamento. Chorar, caminhar, soltar. Não anestesie o fim com excesso; sinta e complete.",
  },
  11: {
    energia: "Intuir",
    titulo: "Mês de visão fina",
    descricao:
      "Este mês a antena fica mais fina. Insights e sensibilidade pedem ancoragem: visionar e aterrar, não só sentir.",
    profundidade:
      "Intuição, inspiração e nervosismo criativo — o desejo de significado sobe. Ideias, arte e espiritualidade vivida pedem espaço. Proteja o sistema nervoso. Sem ancoragem, vira ansiedade e promessa vazia; com ancoragem, vira clareza que orienta os próximos ciclos. Sonhos, sincronicidades e ‘sabe sem saber’ aumentam. Escolha o que merece chão. O 11 ilumina — mas só serve se você traduzir a visão em um passo concreto.",
    clima: "Intuição, inspiração, sensibilidade, visão, conexão sutil e ensino inspirado.",
    sombra: "Ansiedade, desconexão do corpo, idealismo sem passo, absorção emocional ou viver de insight sem entrega.",
    reflexao: "Qual visão deste mês ainda não tem um passo no chão?",
    acoes: [
      "Mantenha um diário de insights e escolha um por quinzena para agir.",
      "Reduza barulho em horários fixos do mês.",
      "Compartilhe uma intuição com alguém maduro — sem pedir validação de todos.",
      "Ancore: caminhada, banho frio/quente ou terra nos pés antes de decidir.",
    ],
    evitar: [
      "Absorver o clima emocional de todos.",
      "Idealizar tanto que nada se realiza.",
      "Trocar o corpo por só ‘canalizar’.",
    ],
    palavrasChave: ["visão", "intuição", "ancoragem", "inspiração", "clareza"],
    areas: ["intuição e decisão", "nervos e descanso", "projeto inspirado"],
    carreira:
      "Conteúdo inspirador, aconselhamento, arte, estratégia visionária, branding com alma. Evite decisões só no êxtase. Traduza insight em protótipo, texto ou conversa útil.",
    relacoes:
      "Empatia alta: você sente o outro demais. Escolha com quem abrir o canal. Relações superficiais cansam; vínculos conscientes florescem. Não salve quem não pediu.",
    saude:
      "Nervos, sono, adrenalina. Meditação, natureza, redução de cafeína/tela, exercício suave. O 11 sem corpo vira pânico; com corpo, vira farol.",
  },
  22: {
    energia: "Construir",
    titulo: "Mês de legado prático",
    descricao:
      "Este mês pede construir em escala. Visão grande com estrutura: gente, prazo e recurso alinhados a um propósito maior.",
    profundidade:
      "Capacidade de erguer o que serve a muitos. A responsabilidade pode pesar. Não precisa concluir o monumento — precisa de fundação séria e ritmo sustentável. Delegue. Cuide do corpo. Legado sem saúde vira ruína; legado com método vira história. Se a grandeza paralisar, trabalhe na raiz 4: uma etapa clara, um sistema, um prazo. O 22 une visão e tijolo.",
    clima: "Projetos de impacto, sistemas, liderança estruturada, mobilização e fundação de longo prazo.",
    sombra: "Paralisia pela grandeza, tirania benevolente, negar necessidades pessoais ou justificar qualquer meio pelo fim.",
    reflexao: "Qual estrutura deste mês deixa legado além de você?",
    acoes: [
      "Defina a próxima etapa mensurável do projeto maior e cumpra.",
      "Organize papéis: quem faz o quê até quando.",
      "Reserve recuperação com a mesma seriedade do trabalho.",
      "Documente o sistema para que não dependa só de você.",
    ],
    evitar: [
      "Paralisar pelo tamanho da missão.",
      "Justificar qualquer meio pela grandeza do fim.",
      "Carregar sozinho o que pediria equipe.",
    ],
    palavrasChave: ["legado", "estrutura", "escala", "método", "visão"],
    areas: ["projeto de impacto", "equipe e recursos", "saúde sob pressão"],
    carreira:
      "Arquitetura de negócio, operações, fundações, produtos que escalam, liderança de projetos grandes. Foque progresso, não perfeição. Uma base sólida este mês vale mais do que dez ideias geniais sem chão.",
    relacoes:
      "Pode haver tensão entre missão e intimidade. Avise parceiros do tamanho da carga. Delegue em casa também. Amor não compete com legado — compete com desorganização.",
    saude:
      "Pressão e peso nas costas (literal e simbólico). Força com recuperação, limites de agenda, sono e apoio. Não heroísmo; método.",
  },
  33: {
    energia: "Curar",
    titulo: "Mês de amor em ação",
    descricao:
      "Este mês pede cura e serviço conscientes. Ensinar e acolher a partir da plenitude, com limites claros.",
    profundidade:
      "Compaixão em escala: ensino, cura, cuidado comunitário e amor que transforma. Sem limites, vira martírio. Escolha uma frente de serviço e diga não ao resto. Peça cuidado de volta. Amor que esgota não eleva ninguém — só alimenta culpa. O 33 eleva quando você inclui a si na conta do cuidado; afunda quando a missão vira fuga da própria vida.",
    clima: "Cura, ensino, serviço, compaixão, elevação de vínculos e presença generosa.",
    sombra: "Martírio, culpa, responsabilidade pela felicidade alheia, fuga na ‘missão’ ou absorver o sofrimento de todos.",
    reflexao: "Onde você serve por missão — e onde por obrigação?",
    acoes: [
      "Escolha uma frente de cuidado ou ensino e sustente o mês todo.",
      "Pratique um limite semanal de descanso como ato sagrado.",
      "Peça e aceite cuidado — não só ofereça.",
      "Ensine ou acolha a partir do que você já integrou, não do que ainda dói aberto.",
    ],
    evitar: [
      "Absorver o sofrimento de todos.",
      "Usar a missão espiritual para não viver a própria vida.",
      "Dizer sim automático a todo pedido de ajuda.",
    ],
    palavrasChave: ["cura", "serviço", "compaixão", "limite", "presença"],
    areas: ["serviço e limites", "relações de cuidado", "autocuidado"],
    carreira:
      "Ensino, terapia, cuidado, mentoria, causas, conteúdo de cura. Defina escopo. Serviço sem fronteira destrói a capacidade de servir. Cobrar com dignidade também é amor.",
    relacoes:
      "Vínculos pedem doçura e verdade. Evite salvar quem não quer. Parcerias amadurecem com reciprocidade. Seja claro sobre o que pode e o que não pode carregar.",
    saude:
      "Empatia alta drena. Banho, natureza, sono, terapia e ‘não’ são medicina. Coração e sistema nervoso pedem contorno. Cuidar de si é parte do serviço.",
  },
};
