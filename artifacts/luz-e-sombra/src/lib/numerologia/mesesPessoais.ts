import type { EnergiaMesPessoal } from "./energiaNumerologica";

/** Foco do mês — voz acolhedora, didática, sem jargão técnico. */
export const MESES_PESSOAIS: Record<number, EnergiaMesPessoal> = {
  1: {
    energia: "Iniciar",
    titulo: "Mês de abrir caminho",
    descricao:
      "Este mês pede autoria: o que ficou parado só anda se você plantar com coragem. Um começo consciente vale mais do que cinco aberturas por pressa.",
    profundidade:
      "É um mês de assumir o volante — carreira, hábito, relação ou projeto. Independência e reinício ganham espaço. Plante uma semente principal e regue. Querer reinventar tudo ao mesmo tempo ou empurrar os outros para fora só atrapalha. Liderar não é isolar-se: é decidir e seguir, com clareza sobre o que você não vai carregar.",
    clima: "Novos projetos, postura de liderança, decisões de rumo e disciplina inicial.",
    sombra: "Reinício impulsivo, egocentrismo do ciclo ou abandono do que ainda precisava fechar.",
    reflexao: "Qual começo deste mês você ainda espera que alguém autorize?",
    acoes: [
      "Escolha um projeto-eixo do mês e dê o primeiro passo concreto na primeira quinzena.",
      "Declare o compromisso em voz alta para alguém de confiança.",
      "Revise no meio do mês: o que avançou de verdade e o que era só intenção.",
    ],
    evitar: [
      "Abrir três vidas novas no mesmo mês.",
      "Usar o ‘recomeço’ para fugir de uma conclusão necessária.",
    ],
    palavrasChave: ["autoria", "semente", "liderança", "rumo", "coragem"],
    areas: ["projeto que você adia", "decisões só suas", "como você se posiciona"],
  },
  2: {
    energia: "Cooperar",
    titulo: "Mês de parceria e paciência",
    descricao:
      "Este mês anda melhor em dois. Acordos, escuta e timing pesam mais do que a pressa de resolver sozinho.",
    profundidade:
      "É um mês de receptividade: relacionamentos, diplomacia e construção lenta de confiança. Ouça o mercado, a família, o corpo — e não force a colheita. A sensibilidade sobe; conflitos mal resolvidos doem mais. Paciente não é passivo: é quem prepara o terreno. Evite decisões grandes só para acabar com a ansiedade da espera.",
    clima: "Alianças, negociação, cuidado relacional, informação e um ritmo mais lento.",
    sombra: "Dependência, indecisão crônica ou absorver o clima emocional alheio o mês inteiro.",
    reflexao: "Com quem este mês pede conversa verdadeira — não só educada?",
    acoes: [
      "Feche ou avance um acordo que está pela metade.",
      "Reserve espaços do mês só para escuta, sem agenda de ‘resolver’.",
      "Peça ajuda em um ponto que você insiste em carregar sozinho.",
    ],
    evitar: [
      "Decidir por outra pessoa ‘para facilitar’.",
      "Concordar o mês todo e explodir no fim.",
    ],
    palavrasChave: ["parceria", "paciência", "diplomacia", "vínculo", "timing"],
    areas: ["conversas adiadas", "acordos pela metade", "quem divide o caminho com você"],
  },
  3: {
    energia: "Expressar",
    titulo: "Mês de voz e criatividade",
    descricao:
      "Este mês pede que você se mostre: diga, crie, conecte. O que fica só na cabeça perde força ao longo das semanas.",
    profundidade:
      "É um mês de expansão criativa e social. Ideias, humor, conteúdo e encontros florescem. Pratique a voz — profissional ou íntima. O risco é espalhar-se: muitos planos, pouca entrega, gastos por entusiasmo. Escolha um veículo de expressão e leve até um marco visível até o fim do mês. Mostrar-se com verdade abre mais portas do que planejar em silêncio.",
    clima: "Criação, comunicação, rede, otimismo e visibilidade leve.",
    sombra: "Dispersão, superficialidade ou consumo impulsivo de prazer.",
    reflexao: "O que este mês precisa ver de você — não só ouvir planejar?",
    acoes: [
      "Publique, apresente ou entregue uma peça criativa até o fim do mês.",
      "Retome três contatos que importam e nutra a relação.",
      "Defina um limite de novas ideias para não matar a que já está em curso.",
    ],
    evitar: [
      "Abrir dez projetos criativos.",
      "Usar leveza para não falar do que dói.",
    ],
    palavrasChave: ["expressão", "criatividade", "visibilidade", "rede", "entrega"],
    areas: ["o que você ainda não disse", "trabalho guardado", "encontros que nutrem"],
  },
  4: {
    energia: "Construir",
    titulo: "Mês de alicerce",
    descricao:
      "Este mês pede base: contas, hábitos, sistemas e trabalho constante. O que está solto pede ordem que você consiga manter.",
    profundidade:
      "É um mês de construção paciente. Casa, corpo, finanças e processos definem o rendimento do ciclo. Pode parecer sem brilho — e é exatamente por isso que sustenta os meses seguintes. Frustração com a lentidão é normal. Responda com sistemas pequenos e repetíveis, não com heroísmo de um dia. Se surgir vontade de obra gigante, fundação primeiro.",
    clima: "Rotina, trabalho, organização, saúde prática e estabilidade.",
    sombra: "Rigidez, trabalho sem limite, perfeccionismo ou ressentir a ‘falta de magia’.",
    reflexao: "Qual estrutura deste mês, se bem feita, te carrega nos próximos?",
    acoes: [
      "Monte ou ajuste um sistema — dinheiro, agenda ou casa — e mantenha até o fim do mês.",
      "Feche as contas e veja o que entra, sai e some.",
      "Escolha um hábito físico sustentado: sono, movimento ou alimentação.",
    ],
    evitar: [
      "Querer deixar tudo perfeito e não implantar nada.",
      "Usar ocupação para não olhar o essencial.",
    ],
    palavrasChave: ["fundação", "disciplina", "sistema", "constância", "casa"],
    areas: ["dinheiro e contas", "rotina do mês", "o que está pela metade no trabalho"],
  },
  5: {
    energia: "Expandir",
    titulo: "Mês de mudança e liberdade",
    descricao:
      "Este mês mexe no que estava parado. Convites, viagens, pivôs e solturas pedem flexibilidade — sem abandonar o essencial.",
    profundidade:
      "É um mês de vento: variação, aprendizado rápido, quebra de rotina e desejo de ar. Planos rígidos sofrem. Quem se adapta colhe experiência; quem se agarra ao conhecido sofre duas vezes. Cuidado com dispersão, excesso e decisões definitivas no calor. Mude o passo do mês, não a vida inteira numa tarde. Liberdade com critério.",
    clima: "Mudança, deslocamento, promoção, experimentação e renovação.",
    sombra: "Impulsividade, fuga, estímulo em excesso ou irresponsabilidade disfarçada de liberdade.",
    reflexao: "O que você segura só porque já está acostumado?",
    acoes: [
      "Aceite um convite ou rota nova alinhada ao que você quer viver.",
      "Solte um compromisso ou hábito do mês que só cansa.",
      "Documente o que aprendeu com as mudanças — para não repetir o caos.",
    ],
    evitar: [
      "Quebrar tudo no impulso.",
      "Chamar fuga de ‘autenticidade’.",
    ],
    palavrasChave: ["mudança", "liberdade", "adaptação", "experiência", "movimento"],
    areas: ["o que você quer mudar e adia", "convites fora da rotina", "hábitos que cansam"],
  },
  6: {
    energia: "Cuidar",
    titulo: "Mês de lar e vínculos",
    descricao:
      "Este mês pede presença em casa e nas relações próximas. Responsabilidade com afeto — sem se apagar.",
    profundidade:
      "É um mês em que o coração e o dever ficam no centro: família, parceria, casa, cuidado e serviço. Demandas aumentam; o aprendizado é servir sem martírio. Bom para reconciliar, cuidar da saúde e alinhar o amor com ação. Se você só cuida dos outros, o mês cobra. Inclua-se na lista de quem merece presença.",
    clima: "Família, casa, amor, deveres, cura relacional e beleza do cotidiano.",
    sombra: "Controle disfarçado de cuidado, culpa, anulação ou resgate compulsivo.",
    reflexao: "Onde o cuidado deste mês é amor — e onde é medo de decepcionar?",
    acoes: [
      "Faça a conversa de casa ou de vínculo que está esperando.",
      "Melhore um aspecto concreto do lar ou da rotina de cuidado.",
      "Reserve presença sem celular para quem importa — e para você.",
    ],
    evitar: [
      "Dar tanto que a raiva fica guardada.",
      "Usar o cuidado com os outros para não olhar para si.",
    ],
    palavrasChave: ["lar", "vínculo", "dever", "afeto", "responsabilidade"],
    areas: ["a casa", "pessoas próximas", "cuidado com o corpo"],
  },
  7: {
    energia: "Aprofundar",
    titulo: "Mês de interioridade",
    descricao:
      "Este mês pede menos barulho e mais verdade. Estudo, silêncio e perguntas honestas esclarecem o que a pressa embaça.",
    profundidade:
      "É um mês de retiro ativo: pesquisa, espiritualidade prática, análise e descanso nervoso. Não é ideal forçar expansão social o tempo todo. A qualidade das decisões sobe quando você reduz estímulo. Cuidado para não isolar-se por superioridade nem sumir das contas da vida. Vá para dentro — e volte com uma clareza utilizável.",
    clima: "Estudo, introspecção, espiritualidade, análise e refinamento.",
    sombra: "Isolamento frio, cinismo, excesso de pensamento ou negligência prática.",
    reflexao: "O que este mês já te mostrou e você ainda não admite?",
    acoes: [
      "Estabeleça um ritual mensal de silêncio ou estudo, com horários fixos.",
      "Estude uma questão de verdade — sem transformar em performance.",
      "Cuide de sono e nervos: o corpo é o laboratório deste mês.",
    ],
    evitar: [
      "Sumir das pessoas e chamar isso de sabedoria.",
      "Pensar tanto que conta, trabalho e casa param.",
    ],
    palavrasChave: ["profundidade", "estudo", "discernimento", "silêncio", "verdade"],
    areas: ["o que você já sabe e não admite", "estudo que importa", "tempo sozinho neste mês"],
  },
  8: {
    energia: "Realizar",
    titulo: "Mês de colheita e poder",
    descricao:
      "Este mês pede resultado: acordo, preço, meta, visibilidade profissional. Conduza com responsabilidade — a colheita responde ao que foi plantado.",
    profundidade:
      "É um mês de manifestação material e autoridade. Negociações, reconhecimento, dinheiro e estrutura de poder entram em cena. Hora de cobrar o justo e ocupar espaço. Ética e presença sustentam; arrogância derruba. Olhe números reais, não só ambição. Resultado com responsabilidade pesa mais do que status.",
    clima: "Carreira, finanças, autoridade, metas e reconhecimento.",
    sombra: "Controle, ganância, trabalho sem limite ou medir valor só por conquista.",
    reflexao: "Onde você cobra menos — ou exige mais — do que o trabalho vale?",
    acoes: [
      "Feche o acordo, preço ou promoção em aberto: diga o número.",
      "Corte um gasto recorrente que não serve.",
      "Tome a decisão profissional que está na mesa.",
    ],
    evitar: [
      "Passar por cima de pessoas para chegar no resultado.",
      "Trabalhar sem recuperação e chamar isso de mérito.",
    ],
    palavrasChave: ["colheita", "poder", "dinheiro", "meta", "ética"],
    areas: ["valor do seu trabalho", "acordos abertos", "dinheiro que escapa"],
  },
  9: {
    energia: "Encerrar",
    titulo: "Mês de fechar ciclos",
    descricao:
      "Este mês pede conclusão e liberação. Termine, agradeça, doe e solte — para o próximo ciclo ter chão limpo.",
    profundidade:
      "É um mês de colheita emocional e limpeza: fim de projetos, relações que já cumpriram, perdão prático e generosidade. Não é o melhor momento para lançar obra de longo prazo. É o mês de completar. Nostalgia e martírio são as armadilhas. Encerrar bem é inteligência de ciclo, não fracasso.",
    clima: "Conclusões, doação, perdão, limpeza, compaixão e descanso de ciclo.",
    sombra: "Segurar o passado, martírio ou começar o que deveria terminar.",
    reflexao: "O que já acabou e você ainda carrega como se fosse presente?",
    acoes: [
      "Liste o incompleto e feche o que der para fechar neste mês.",
      "Doe, venda ou descarte o que guarda sem uso.",
      "Faça a conversa de agradecimento ou despedida que falta — sem reabrir tudo.",
    ],
    evitar: [
      "Abrir projeto grande antes de limpar a mesa.",
      "Segurar o que já acabou só por saudade.",
    ],
    palavrasChave: ["conclusão", "liberação", "generosidade", "ciclo", "limpeza"],
    areas: ["o incompleto", "conversas que pedem fim", "o que você guarda sem uso"],
  },
  11: {
    energia: "Intuir",
    titulo: "Mês de visão fina",
    descricao:
      "Este mês a antena fica mais fina. Insights e sensibilidade pedem ancoragem: visionar e aterrar, não só sentir.",
    profundidade:
      "É um mês de intuição, inspiração e nervosismo criativo — desejo de significado sobe. Ideias, arte e espiritualidade vivida pedem espaço. Proteja o sistema nervoso. Sem ancoragem, vira ansiedade e promessa vazia. Com ancoragem, vira clareza que orienta os próximos ciclos. Escolha o que merece chão.",
    clima: "Intuição, inspiração, sensibilidade, visão e conexão sutil.",
    sombra: "Ansiedade, desconexão do corpo, idealismo sem passo ou absorção emocional.",
    reflexao: "Qual visão deste mês ainda não tem um passo no chão?",
    acoes: [
      "Mantenha um diário de insights e escolha um por quinzena para agir.",
      "Reduza barulho em horários fixos do mês.",
      "Compartilhe uma intuição com alguém maduro — sem pedir validação de todos.",
    ],
    evitar: [
      "Absorver o clima emocional de todos.",
      "Idealizar tanto que nada se realiza.",
    ],
    palavrasChave: ["visão", "intuição", "ancoragem", "inspiração", "clareza"],
    areas: ["intuição e decisão", "nervos e descanso", "projeto inspirado"],
  },
  22: {
    energia: "Construir",
    titulo: "Mês de legado prático",
    descricao:
      "Este mês pede construir em escala. Visão grande com estrutura: gente, prazo e recurso alinhados a um propósito maior.",
    profundidade:
      "É um mês de capacidade de erguer o que serve a muitos. A responsabilidade pode pesar. Não precisa concluir o monumento — precisa de fundação séria e ritmo sustentável. Delegue. Cuide do corpo. Legado sem saúde vira ruína; legado com método vira história. Uma etapa clara por vez.",
    clima: "Projetos de impacto, sistemas, liderança estruturada e mobilização.",
    sombra: "Paralisia pela grandeza, tirania benevolente ou negar necessidades pessoais.",
    reflexao: "Qual estrutura deste mês deixa legado além de você?",
    acoes: [
      "Defina a próxima etapa mensurável do projeto maior e cumpra.",
      "Organize papéis: quem faz o quê até quando.",
      "Reserve recuperação com a mesma seriedade do trabalho.",
    ],
    evitar: [
      "Paralisar pelo tamanho da missão.",
      "Justificar qualquer meio pela grandeza do fim.",
    ],
    palavrasChave: ["legado", "estrutura", "escala", "método", "visão"],
    areas: ["projeto de impacto", "equipe e recursos", "saúde sob pressão"],
  },
  33: {
    energia: "Curar",
    titulo: "Mês de amor em ação",
    descricao:
      "Este mês pede cura e serviço conscientes. Ensinar e acolher a partir da plenitude, com limites claros.",
    profundidade:
      "É um mês de compaixão em escala: ensino, cura, cuidado comunitário e amor que transforma. Sem limites, vira martírio. Escolha uma frente de serviço e diga não ao resto. Peça cuidado de volta. Amor que esgota não eleva ninguém — só alimenta culpa. Inclua você na conta.",
    clima: "Cura, ensino, serviço, compaixão e elevação de vínculos.",
    sombra: "Martírio, culpa, responsabilidade pela felicidade alheia ou fuga na ‘missão’.",
    reflexao: "Onde você serve por missão — e onde por obrigação?",
    acoes: [
      "Escolha uma frente de cuidado ou ensino e sustente o mês todo.",
      "Pratique um limite semanal de descanso como ato sagrado.",
      "Peça e aceite cuidado — não só ofereça.",
    ],
    evitar: [
      "Absorver o sofrimento de todos.",
      "Usar a missão espiritual para não viver a própria vida.",
    ],
    palavrasChave: ["cura", "serviço", "compaixão", "limite", "presença"],
    areas: ["serviço e limites", "relações de cuidado", "autocuidado"],
  },
};
