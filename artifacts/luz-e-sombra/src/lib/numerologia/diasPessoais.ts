import type { EnergiaNumerologica } from "./energiaNumerologica";

/** Gesto do dia pessoal — escala de hoje. */
export const DIAS_PESSOAIS: Record<number, EnergiaNumerologica> = {
  1: {
    energia: "Começar",
    titulo: "Hoje pede um começo",
    descricao:
      "Escolha uma coisa que você vem adiando e dê o primeiro passo, mesmo pequeno. O que inicia agora marca o tom do restante do dia.",
    profundidade:
      "Não precisa estar pronto. Precisa começar. Um gesto simples — mensagem, rascunho, decisão — vale mais do que ensaiar o dia inteiro. Repare se está esperando autorização de alguém ou de si.",
    reflexao: '"Qual começo você está empurrando para depois?"',
    acoes: [
      "Abra hoje a única coisa que mais adia — uma versão simples já conta.",
      "Diga em voz alta o que decidiu começar. Fica mais difícil voltar atrás.",
    ],
    evitar: ["Esperar o momento perfeito.", "Abrir três frentes e não terminar nenhuma."],
  },
  2: {
    energia: "Combinar",
    titulo: "Hoje pede escuta",
    descricao:
      "Antes de decidir, deixe a outra pessoa terminar e sinta o que realmente está em jogo. Acordos feitos com paciência andam mais longe.",
    profundidade:
      "A pressa de responder sozinho atrapalha o combinado. Ouça até o fim. Uma conversa honesta hoje vale mais do que um plano feito no escuro.",
    reflexao: '"Com quem você precisa conversar de verdade hoje?"',
    acoes: [
      "Marque ou retome a conversa que você vem empurrando.",
      "Ouça até o fim antes de responder ou decidir.",
    ],
    evitar: ["Decidir por outra pessoa sem perguntar.", "Concordar só para evitar briga."],
  },
  3: {
    energia: "Expressar",
    titulo: "Hoje pede que você se mostre",
    descricao:
      "Diga, escreva ou crie o que está preso. O que fica só na cabeça perde força; o que sai com verdade chega mais longe.",
    profundidade:
      "Pare de ensaiar a frase perfeita. Não precisa estar pronto — precisa ser seu. Onde tem gosto de verdade, vale seguir.",
    reflexao: '"O que você ainda não disse, e para quem?"',
    acoes: [
      "Diga a frase que está pronta na cabeça — numa conversa, num texto ou no trabalho.",
      "Mostre uma coisa pequena que você fez e ainda não mostrou.",
    ],
    evitar: ["Abrir dez ideias e não terminar nenhuma.", "Usar piada para não falar do que importa."],
  },
  4: {
    energia: "Organizar",
    titulo: "Hoje pede ordem",
    descricao:
      "Escolha uma tarefa concreta e leve até o fim, com calma e sem atalho. Base simples sustenta o que você quer ver de pé.",
    profundidade:
      "Atalho agora cobra depois. Arrume uma coisa só — conta, horário, gaveta — e mantenha assim. A clareza vem do que você conclui, não do que planeja.",
    reflexao: '"Qual pendência concreta você pode fechar hoje?"',
    acoes: [
      "Escolha uma tarefa e termine do começo ao fim.",
      "Olhe uma conta, um horário ou uma lista que está solta e organize.",
    ],
    evitar: ["Querer deixar tudo perfeito e não entregar nada.", "Encher o dia de tarefa para não olhar o essencial."],
  },
  5: {
    energia: "Mudar",
    titulo: "Hoje pede movimento",
    descricao:
      "Aceite um ajuste, uma saída ou uma conversa que abra o dia, em vez de segurar tudo no mesmo lugar. Flexibilidade sem abandonar o essencial.",
    profundidade:
      "Nem toda interrupção é problema. Às vezes é o sinal de soltar o que já não cabe. Mude o passo — não a vida inteira numa tarde.",
    reflexao: '"O que você segura só porque já está acostumado?"',
    acoes: [
      "Diga sim a um pequeno desvio da rotina antes de pensar demais.",
      "Solte um compromisso ou hábito do dia que só cansa.",
    ],
    evitar: ["Ficar no que não funciona só porque é conhecido.", "Decidir algo definitivo no impulso."],
  },
  6: {
    energia: "Cuidar",
    titulo: "Hoje pede presença perto",
    descricao:
      "Um gesto de presença — em casa ou numa relação — vale mais do que resolver o mundo. Cuidar sem se apagar.",
    profundidade:
      "Olhe para quem está perto e para o seu próprio corpo. Há um gesto concreto esperando: tempo, conversa ou cuidado. Repare se ajuda porque quer ou por medo de decepcionar.",
    reflexao: '"Você está cuidando porque quer, ou porque tem medo de decepcionar?"',
    acoes: [
      "Passe um tempo com alguém próximo sem celular no meio.",
      "Faça um gesto concreto de cuidado consigo ou com quem depende de você.",
    ],
    evitar: ["Dar tanto que a raiva fica guardada.", "Usar o cuidado com os outros para não olhar para si."],
  },
  7: {
    energia: "Entender",
    titulo: "Hoje pede silêncio útil",
    descricao:
      "Reserve um tempo para pensar com calma antes de responder ou se comprometer. Menos barulho, mais clareza.",
    profundidade:
      "A resposta que você procura não vem de mais uma tarefa. Vem de um intervalo quieto, só seu. Escreva o que já sabe e ainda não admite.",
    reflexao: '"O que você já sabe e ainda não admite?"',
    acoes: [
      "Separe um horário curto sem tela e sem gente. Escreva o que aparecer.",
      "Durma e coma direito — pensar sem cuidar do corpo não traz resposta.",
    ],
    evitar: ["Sumir das pessoas e chamar isso de reflexão.", "Pensar tanto que nada prático anda."],
  },
  8: {
    energia: "Concretizar",
    titulo: "Hoje pede resultado",
    descricao:
      "Trate de um assunto concreto — acordo, preço, decisão — com firmeza e sem dispersar. O que você conduz tende a ganhar forma.",
    profundidade:
      "Olhe para o que vale e para o que você tem aceitado a menos. Diga o número. Não é hora de se diminuir nem de passar por cima de ninguém.",
    reflexao: '"Onde você está cobrando menos do que o seu trabalho vale?"',
    acoes: [
      "Feche ou avance um acordo, preço ou decisão que está em aberto.",
      "Trate um assunto prático até ter um próximo passo claro.",
    ],
    evitar: ["Passar por cima das pessoas para chegar no resultado.", "Trabalhar sem parar e chamar isso de foco."],
  },
  9: {
    energia: "Encerrar",
    titulo: "Hoje pede um encerramento",
    descricao:
      "Termine, agradeça ou solte uma coisa que já cumpriu o tempo. Encerrar bem abre espaço para o que ainda não tem nome.",
    profundidade:
      "Faça a lista do incompleto e feche o que dá para fechar agora. Não é fracasso — é reconhecer que aquilo já fez a parte dele.",
    reflexao: '"O que já acabou e você ainda carrega?"',
    acoes: [
      "Feche uma pendência pequena que está pela metade.",
      "Agradeça ou peça desculpa a alguém — sem reabrir a história inteira.",
    ],
    evitar: ["Abrir projeto grande antes de limpar a mesa.", "Segurar o que já acabou só por saudade."],
  },
  11: {
    energia: "Intuir",
    titulo: "Hoje é dia mestre 11",
    descricao:
      "A antena está ligada. Insights, pressentimentos e clareza súbita pesam mais do que planos rígidos. Aterre uma visão em um gesto concreto.",
    profundidade:
      "O 11 oscila entre iluminação e nervosismo. Não force decisões só com a mente. Escute o que já sabe por dentro — e transforme em um passo pequeno no mundo real, para não ficar só na visão.",
    reflexao: '"Qual insight de hoje você ainda não aterrizou?"',
    acoes: [
      "Anote o insight mais forte do dia antes que escape.",
      "Traduza uma intuição em um gesto prático simples.",
    ],
    evitar: ["Absorver a ansiedade de todo mundo.", "Ter visão e não dar nenhum passo."],
  },
  22: {
    energia: "Construir",
    titulo: "Hoje é dia mestre 22",
    descricao:
      "Dia de visão grande com mão na massa. O que você organiza hoje pode sustentar algo maior do que o momento.",
    profundidade:
      "O 22 pede legado em escala — sem se paralisar pelo tamanho. Comece pelo que é possível agora, com estrutura. Grandiosidade sem base vira só pressão.",
    reflexao: '"Qual pedra você pode colocar hoje num projeto que importa?"',
    acoes: [
      "Avance uma peça concreta de um projeto maior.",
      "Organize recurso, prazo ou pessoa em torno da visão — sem assumir tudo sozinho.",
    ],
    evitar: ["Querer resolver a obra inteira numa tarde.", "Negar descanso em nome da missão."],
  },
  33: {
    energia: "Curar",
    titulo: "Hoje é dia mestre 33",
    descricao:
      "O dia pede amor em ação. Cuidar, ensinar ou acolher — a partir da sua plenitude, não do esvaziamento.",
    profundidade:
      "O 33 cura pela presença. Um gesto genuíno vale mais do que salvar o mundo. Cuide também de si: sem limite, a compaixão vira colapso.",
    reflexao: '"A quem você pode oferecer presença real hoje — inclusive a si?"',
    acoes: [
      "Ofereça um gesto de cuidado concreto a alguém.",
      "Reserve um limite: cuidar sem se apagar.",
    ],
    evitar: ["Absorver a dor de todos.", "Usar o serviço para fugir da própria vida."],
  },
};
