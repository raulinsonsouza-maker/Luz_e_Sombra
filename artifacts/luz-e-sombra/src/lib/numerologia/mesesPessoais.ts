import type { EnergiaMesPessoal } from "./energiaNumerologica";

/** Foco do mês pessoal — ciclo mensal (não o gesto de um dia). */
export const MESES_PESSOAIS: Record<number, EnergiaMesPessoal> = {
  1: {
    energia: "Iniciar",
    titulo: "Mês de abrir caminho",
    descricao:
      "Este mês pede autoria: o que ficou parado só anda se você plantar com coragem. Um começo consciente vale mais do que cinco aberturas por pressa.",
    profundidade:
      "O Mês Pessoal 1 define o tom dos próximos ciclos curtos: independência, liderança pessoal e reinício. É o mês de assumir o volante — carreira, hábito, relação ou projeto. Plante uma semente principal e regue. A sombra mensal do 1 é querer reinventar tudo ao mesmo tempo ou empurrar os outros para fora. Liderar não é isolar-se: é decidir e seguir, com clareza sobre o que você não vai carregar.",
    clima: "Novos projetos, postura de liderança, decisões de rumo, autodisciplina inicial.",
    sombra: "Impulsividade de reinício, egocentrismo de ciclo, abandono do que ainda precisava fechar.",
    reflexao: '"Qual começo deste mês você ainda espera que alguém autorize?"',
    acoes: [
      "Escolha UM projeto-eixo do mês e dê o primeiro passo concreto na primeira quinzena.",
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
      "O Mês Pessoal 2 pede receptividade sustentada: relacionamentos, diplomacia, construção lenta de confiança. É mês de ouvir o mercado, a família, o corpo — e de não forçar colheita. Sensibilidade sobe; conflitos mal resolvidos doem mais. Paciente não é passivo: é quem prepara o terreno. Evite decisões grandes só para acabar com a ansiedade da espera.",
    clima: "Alianças, negociação, cuidado relacional, informação, ritmo mais lento.",
    sombra: "Dependência, indecisão crônica, absorver o clima emocional alheio o mês inteiro.",
    reflexao: '"Com quem este mês pede conversa verdadeira — não só educada?"',
    acoes: [
      "Feche ou avance um acordo que está pela metade.",
      "Reserve espaços do mês só para escuta (sem agenda de ‘resolver’).",
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
      "O Mês Pessoal 3 é expansão criativa e social. Ideias, humor, conteúdo, encontros e aprendizado leve florescem. É mês de praticar a voz — profissional ou íntima. O risco é espalhar-se: muitos planos, pouca entrega, gastos por entusiasmo. Escolha um veículo de expressão (texto, produto, conversa-chave) e leve até um marco visível até o fim do mês.",
    clima: "Criação, comunicação, rede, otimismo, visibilidade.",
    sombra: "Dispersão, superficialidade, fofoca, consumo impulsivo de prazer.",
    reflexao: '"O que este mês precisa ver de você — não só ouvir planejar?"',
    acoes: [
      "Publique, apresente ou entregue uma peça criativa até o fim do mês.",
      "Retome três contatos que importam e nutra a relação.",
      "Defina um limite de ‘novas ideias’ para não matar a que já está em curso.",
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
      "O Mês Pessoal 4 é construção paciente. Casa, corpo, finanças, processos e disciplina definem o rendimento do ciclo. Pode parecer ‘sem brilho’ — e é exatamente por isso que sustenta os meses seguintes. Frustração com a lentidão é normal. Responda com sistemas pequenos e repetíveis, não com heroísmo de um dia. Em ecos de 22, a tentação de obra gigante aparece: fundação primeiro.",
    clima: "Rotina, trabalho, organização, saúde prática, estabilidade.",
    sombra: "Rigidez, workaholism, perfeccionismo, ressentir a ‘falta de magia’.",
    reflexao: '"Qual estrutura deste mês, se bem feita, te carrega nos próximos?"',
    acoes: [
      "Monte ou ajuste um sistema (dinheiro, agenda ou casa) e mantenha até o fim do mês.",
      "Feche as contas e veja o que entra, sai e some.",
      "Escolha um hábito físico sustentado (sono, movimento, alimentação).",
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
      "O Mês Pessoal 5 é vento: variação, aprendizado rápido, quebra de rotina, marketing de si, desejo de ar. Planos rígidos sofrem. Quem se adapta colhe experiência; quem se agarra ao conhecido sofre duas vezes. A sombra é dispersão, excesso e decisões definitivas no calor. Mude o passo do mês, não a vida inteira numa tarde. Liberdade com critério.",
    clima: "Mudança, deslocamento, promoção, experimentação, renovação.",
    sombra: "Impulsividade, fuga, vícios de estímulo, irresponsabilidade disfarçada de liberdade.",
    reflexao: '"O que você segura só porque já está acostumado?"',
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
      "O Mês Pessoal 6 coloca o coração e o dever no centro: família, parceria, casa, cuidado, beleza útil, serviço. Demandas aumentam; o aprendizado é servir sem martírio. É mês poderoso para reconciliar, cuidar da saúde e alinhar o amor com ação. Se você só cuida dos outros, o mês cobra. Inclua-se na lista de quem merece presença.",
    clima: "Família, casa, amor, deveres, cura relacional, estética do cotidiano.",
    sombra: "Controle disfarçado de cuidado, culpa, anulação, resgate compulsivo.",
    reflexao: '"Onde o cuidado deste mês é amor — e onde é medo de decepcionar?"',
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
      "O Mês Pessoal 7 é retiro ativo: pesquisa, espiritualidade prática, análise, descanso nervoso, discernimento. Não é mês ideal para forçar expansão social o tempo todo. A qualidade das decisões sobe quando você reduz estímulo. A sombra é isolar-se por superioridade ou sumir das contas da vida. Vá para dentro — e volte com uma clareza utilizável.",
    clima: "Estudo, introspecção, espiritualidade, análise, refinamento.",
    sombra: "Isolamento frio, cinismo, overthinking, negligência prática.",
    reflexao: '"O que este mês já te mostrou e você ainda não admite?"',
    acoes: [
      "Estabeleça um ritual mensal de silêncio/estudo (horários fixos).",
      "Estude uma questão de verdade — sem transformar em performance.",
      "Cuide de sono e nervos: o corpo é o laboratório do 7.",
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
      "O Mês Pessoal 8 é manifestação material e autoridade. Negociações, reconhecimento, dinheiro e estrutura de poder entram em cena. É mês de cobrar o justo e de ocupar espaço. A sombra é obsessão por status, domínio e trabalho sem limite. Ética e presença sustentam o 8; arrogância o derruba. Olhe números reais, não só ambição.",
    clima: "Carreira, finanças, autoridade, metas, reconhecimento.",
    sombra: "Controle, ganância, workaholism, medir valor só por conquista.",
    reflexao: '"Onde você cobra menos — ou exige mais — do que o trabalho vale?"',
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
      "O Mês Pessoal 9 é colheita emocional e limpeza: fim de projetos, relações que já cumpriram, perdão prático, generosidade, visão mais ampla. Não é o melhor mês para lançar obra de longo prazo. É o mês de completar. Nostalgia e martírio são as armadilhas. Encerrar bem é inteligência de ciclo, não fracasso.",
    clima: "Conclusões, doação, perdão, limpeza, compaixão, descanso de ciclo.",
    sombra: "Segurar o passado, martírio, começar o que deveria terminar.",
    reflexao: '"O que já acabou e você ainda carrega como se fosse presente?"',
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
    titulo: "Mês mestre 11 — visão",
    descricao:
      "Este mês a antena fica mais fina. Insights e sensibilidade pedem ancoragem: visionar e aterrar, não só sentir.",
    profundidade:
      "O Mês 11 eleva o 2: intuição, inspiração, nervosismo criativo, desejo de significado. É mês de canal — ideias, arte, espiritualidade vivida, liderança suave pela presença. Proteja o sistema nervoso. Sem ancoragem, o 11 vira ansiedade e promessa vazia. Com ancoragem, vira mês de clareza que orienta os próximos ciclos.",
    clima: "Intuição, inspiração, sensibilidade, visão, conexão sutil.",
    sombra: "Ansiedade, desconexão do corpo, idealismo sem passo, absorção emocional.",
    reflexao: '"Qual visão deste mês ainda não tem um passo no chão?"',
    acoes: [
      "Mantenha um diário de insights e escolha um por quinzena para agir.",
      "Reduza barulho em horários fixos do mês.",
      "Compartilhe uma intuição com alguém maduro — sem pedir validação de todos.",
    ],
    evitar: [
      "Absorver o clima emocional de todos.",
      "Idealizar tanto que nada se realiza.",
    ],
    palavrasChave: ["mestre", "visão", "intuição", "ancoragem", "inspiração"],
    areas: ["intuição e decisão", "nervos e descanso", "projeto inspirado"],
  },
  22: {
    energia: "Construir",
    titulo: "Mês mestre 22 — legado",
    descricao:
      "Este mês pede construir em escala. Visão grande com estrutura: gente, prazo e recurso alinhados a um propósito maior.",
    profundidade:
      "O Mês 22 une visão de 11 com força de 4: capacidade de erguer o que serve a muitos. A responsabilidade pode pesar. Não precisa concluir o monumento — precisa de fundação séria e ritmo sustentável. Delegue. Cuide do corpo. Legado sem saúde vira ruína. Legado com método vira história.",
    clima: "Projetos de impacto, sistemas, liderança estruturada, mobilização.",
    sombra: "Paralisia pela grandeza, tirania benevolente, negar necessidades pessoais.",
    reflexao: '"Qual estrutura deste mês deixa legado além de você?"',
    acoes: [
      "Defina a próxima etapa mensurável do projeto maior e cumpra.",
      "Organize papéis: quem faz o quê até quando.",
      "Reserve recuperação com a mesma seriedade do trabalho.",
    ],
    evitar: [
      "Paralisar pelo tamanho da missão.",
      "Justificar qualquer meio pela grandeza do fim.",
    ],
    palavrasChave: ["mestre", "legado", "estrutura", "escala", "método"],
    areas: ["projeto de impacto", "equipe e recursos", "saúde sob pressão"],
  },
  33: {
    energia: "Curar",
    titulo: "Mês mestre 33 — amor em ação",
    descricao:
      "Este mês pede cura e serviço conscientes. Ensinar e acolher a partir da plenitude, com limites claros.",
    profundidade:
      "O Mês 33 é compaixão em escala (6 elevado): ensino, cura, cuidado comunitário, amor que transforma. Sem limites, vira martírio mensal. Escolha uma frente de serviço e diga não ao resto. Peça cuidado de volta. Amor que esgota não eleva ninguém — só alimenta culpa.",
    clima: "Cura, ensino, serviço, compaixão, elevação de vínculos.",
    sombra: "Martírio, culpa, responsabilidade pela felicidade alheia, fuga na ‘missão’.",
    reflexao: '"Onde você serve por missão — e onde por obrigação?"',
    acoes: [
      "Escolha uma frente de cuidado/ensino e sustente o mês todo.",
      "Pratique um limite semanal de descanso como ato sagrado.",
      "Peça e aceite cuidado — não só ofereça.",
    ],
    evitar: [
      "Absorver o sofrimento de todos.",
      "Usar a missão espiritual para não viver a própria vida.",
    ],
    palavrasChave: ["mestre", "cura", "serviço", "compaixão", "limite"],
    areas: ["serviço e limites", "relações de cuidado", "autocuidado"],
  },
};
