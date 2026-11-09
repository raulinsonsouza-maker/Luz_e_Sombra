import type { EnergiaMesPessoal } from "./energiaNumerologica";

/** Foco do mês pessoal — visão mensal (não semanal). */
export const MESES_PESSOAIS: Record<number, EnergiaMesPessoal> = {
  1: {
    energia: "Começar",
    titulo: "Mês de abrir caminho",
    descricao:
      "Este mês pede um começo de verdade. O que ficou parado só anda se você der o primeiro passo, mesmo pequeno.",
    profundidade:
      "Escolha uma coisa só, aquela que você adia porque ainda não está redonda, e abra ela neste mês. O que você inicia agora marca o tom dos meses seguintes. Repare se está começando porque quer, ou só para não ficar parado. Um começo consciente vale mais do que cinco aberturas por pressa.",
    reflexao: '"Qual começo você está esperando alguém autorizar?"',
    acoes: [
      "Abra neste mês a única coisa que você mais adia. Uma versão simples já conta.",
      "Diga em voz alta, para alguém, o que você decidiu começar. Fica mais difícil voltar atrás.",
      "Se aparecer vontade de abrir mais três coisas, volte para a primeira.",
    ],
    evitar: [
      "Esperar o momento perfeito. Ele não chega antes do primeiro passo.",
      "Pedir opinião de todo mundo antes de agir.",
    ],
    areas: ["o projeto que você adia", "as decisões que só você pode tomar", "o jeito como você se mostra"],
  },
  2: {
    energia: "Combinar",
    titulo: "Mês de parceria",
    descricao:
      "Este mês anda melhor em dois. Conversas, acordos e parcerias pesam mais do que a pressa de resolver sozinho.",
    profundidade:
      "Antes de decidir algo que mexe com outra pessoa, ouça até o fim. A paciência daqui não é ficar parado: é entender o que o outro precisa para o combinado funcionar. Uma conversa honesta neste mês vale mais do que um plano feito no escuro. Repare se você está ouvindo ou só esperando a sua vez de falar.",
    reflexao: '"Com quem você precisa conversar de verdade neste mês?"',
    acoes: [
      "Marque a conversa que você vem empurrando. Ouça até o fim antes de responder.",
      "Feche um acordo que está pela metade. Diga o que você precisa e o que pode oferecer.",
      "Se um conflito passou do seu alcance, peça ajuda em vez de resolver sozinho.",
    ],
    evitar: [
      "Decidir por outra pessoa sem perguntar.",
      "Concordar só para evitar briga e guardar raiva depois.",
    ],
    areas: ["as conversas que você adia", "os acordos pela metade", "as pessoas com quem você divide o caminho"],
  },
  3: {
    energia: "Expressar",
    titulo: "Mês de falar e criar",
    descricao:
      "Este mês pede que você diga e mostre. O que fica só na cabeça perde força. O que você fala com verdade chega mais longe.",
    profundidade:
      "Pare de ensaiar a frase perfeita. Diga a coisa que você tem guardado, numa conversa, num texto ou num trabalho que ainda não saiu. Não precisa estar pronto. Precisa ser seu. Repare se você está falando para ser aceito ou para ser claro. A leveza deste mês aponta o caminho: onde tem gosto de verdade, vale seguir.",
    reflexao: '"O que você ainda não disse, e para quem?"',
    acoes: [
      "Diga a frase que está pronta na cabeça. Numa conversa, num texto ou no trabalho.",
      "Mostre uma coisa que você fez e ainda não mostrou a ninguém.",
      "Se a crítica vier, anote o que serve e solte o resto. Não pare por causa dela.",
    ],
    evitar: [
      "Abrir dez ideias e não terminar nenhuma.",
      "Usar piada para não falar do que dói.",
    ],
    areas: ["o que você ainda não disse", "o trabalho que está guardado", "as pessoas com quem vale se encontrar"],
  },
  4: {
    energia: "Organizar",
    titulo: "Mês de construir base",
    descricao:
      "Este mês pede base. Contas, horários, hábitos e pendências. O que está solto pede uma ordem simples, que você consiga manter.",
    profundidade:
      "Escolha a parte da vida que mais te atrapalha por falta de ordem e arrume ela de um jeito que dure. Pode ser o dinheiro, a rotina de trabalho ou o corpo. Atalho agora cobra depois. Repare se a bagunça é falta de tempo ou um jeito de não olhar para o que já está claro.",
    reflexao: '"Qual parte da sua rotina neste mês está tão solta que te atrapalha todo dia?"',
    acoes: [
      "Abra as contas e olhe o dinheiro: o que entra, o que sai e o que você nem lembra que paga.",
      "Escolha um horário fixo para a coisa do trabalho que sempre fica para depois.",
      "Arrume uma gaveta, uma pasta ou uma lista. Só uma. E mantenha assim até o fim do mês.",
    ],
    evitar: [
      "Querer deixar tudo perfeito e não entregar nada.",
      "Encher o dia de tarefa para não olhar o que já está claro.",
    ],
    areas: ["o dinheiro e as contas", "a rotina do mês", "o que está pela metade no trabalho"],
  },
  5: {
    energia: "Mudar",
    titulo: "Mês de movimento",
    descricao:
      "Este mês mexe no que estava parado. Uma mudança, um convite ou uma interrupção pede que você solte o que já não cabe.",
    profundidade:
      "Nem toda interrupção é problema. Às vezes é o sinal de que um hábito, um compromisso ou um medo está ocupando o lugar do que vem depois. Você não precisa controlar o mês inteiro. Precisa perceber o que está segurando por costume. Diga sim a uma coisa nova antes de analisar até cansar, e não decida nada definitivo no impulso.",
    reflexao: '"O que você segura só porque já está acostumado?"',
    acoes: [
      "Diga sim a um convite fora da rotina antes de pensar demais.",
      "Solte um compromisso, um hábito ou um combinado que só cansa.",
      "Não decida nada definitivo no calor do momento. Mude o passo, não a vida inteira numa tarde.",
    ],
    evitar: [
      "Ficar no que já não funciona só porque é conhecido.",
      "Gastar ou romper alguma coisa só pela empolgação do novo.",
    ],
    areas: ["o que você quer mudar e adia", "um convite fora da rotina", "um hábito que já cansa"],
  },
  6: {
    energia: "Cuidar",
    titulo: "Mês de presença em casa",
    descricao:
      "Este mês pede presença em casa e nas pessoas próximas. Cuidar aqui é um ato concreto, não uma obrigação para ser bem visto.",
    profundidade:
      "Olhe para a casa, para a família e para quem depende de você. Há uma conversa, uma arrumação ou um cuidado com o seu próprio corpo que está esperando. Repare se você ajuda porque quer ou porque tem medo de decepcionar. Cuidar sem se apagar é o ponto deste mês.",
    reflexao: '"Você está cuidando porque quer, ou porque tem medo de decepcionar?"',
    acoes: [
      "Passe um tempo com alguém próximo sem celular no meio.",
      "Faça a conversa de casa que está esperando. Sem consertar a pessoa, só falar o que pesa.",
      "Cuide do seu corpo neste mês do mesmo jeito que você cuida dos outros.",
    ],
    evitar: [
      "Dar tanto que a raiva fica guardada.",
      "Usar o cuidado com os outros para não olhar para si.",
    ],
    areas: ["a casa", "as pessoas mais próximas", "o cuidado com o seu corpo"],
  },
  7: {
    energia: "Entender",
    titulo: "Mês de aprofundar",
    descricao:
      "Este mês pede menos pressa e mais escuta. A resposta que você procura não vem de mais uma tarefa. Vem de um tempo quieto, só seu.",
    profundidade:
      "Separe um horário curto, de verdade, sem tela e sem gente. Escreva o que você já sabe e ainda não admite. Estude uma coisa que te interessa, mas não encha o mês de compromisso para parecer ocupado. Repare se o silêncio está te ajudando a ver ou se virou um jeito de sumir.",
    reflexao: '"O que você já sabe e ainda não admite?"',
    acoes: [
      "Separe um horário curto, sem tela e sem gente. Escreva o que aparecer.",
      "Estude uma coisa só, aquela que te interessa de verdade, sem transformar isso em mais uma obrigação.",
      "Durma e coma direito. Pensar o mês inteiro sem cuidar do corpo não traz resposta.",
    ],
    evitar: [
      "Sumir das pessoas e chamar isso de reflexão.",
      "Pensar tanto que a conta, o trabalho e a casa ficam parados.",
    ],
    areas: ["o que você já sabe e não admite", "um estudo que te interessa de verdade", "o tempo sozinho neste mês"],
  },
  8: {
    energia: "Concretizar",
    titulo: "Mês de colher resultado",
    descricao:
      "Este mês pede resultado. Acordo, preço, promoção ou uma decisão que você vem empurrando porque pesa.",
    profundidade:
      "Olhe para o que o seu trabalho vale e para o que você tem aceitado a menos. Feche um combinado, cobre o que é justo ou tome a decisão que está na mesa. Não é hora de se diminuir para evitar conflito. Também não é hora de passar por cima das pessoas para chegar lá. Repare onde você entrega o comando para outro decidir no seu lugar.",
    reflexao: '"Onde você está cobrando menos do que o seu trabalho vale?"',
    acoes: [
      "Feche o acordo, o preço ou a promoção que está em aberto. Diga o número.",
      "Corte um gasto que sai todo mês e você nem usa.",
      "Tome a decisão que está na mesa. Esperar outra pessoa decidir é entregar o seu lugar.",
    ],
    evitar: [
      "Passar por cima das pessoas para chegar no resultado.",
      "Trabalhar sem parar e chamar isso de foco.",
    ],
    areas: ["o valor do seu trabalho", "um acordo que está aberto", "o dinheiro que escapa sem você ver"],
  },
  9: {
    energia: "Encerrar",
    titulo: "Mês de fechar ciclos",
    descricao:
      "Este mês pede fim. Pendência, conversa, objeto ou hábito que já cumpriu o tempo. Terminar bem abre espaço.",
    profundidade:
      "Faça a lista do que está incompleto e feche o que dá para fechar agora. Encerrar não é fracasso. É reconhecer que aquilo já fez a parte dele. Agradeça, solte e não abra coisa nova grande antes de limpar a mesa. Repare o que você carrega por saudade e o que carrega por medo de ficar sem.",
    reflexao: '"O que já acabou e você ainda carrega?"',
    acoes: [
      "Faça a lista do que está pela metade e feche o que dá para fechar agora.",
      "Doe, venda ou jogue fora o que você guarda sem uso.",
      "Fale com a pessoa a quem você precisa agradecer ou pedir desculpa. Sem reabrir a história inteira.",
    ],
    evitar: [
      "Abrir projeto novo grande antes de limpar a mesa.",
      "Segurar o que já acabou só por saudade.",
    ],
    areas: ["o que está incompleto", "uma conversa que precisa de um fim", "o que você guarda sem uso"],
  },
  11: {
    energia: "Intuir",
    titulo: "Mês mestre 11 — visão",
    descricao:
      "Este mês a antena fica mais fina. Insights, sensibilidade e inspiração pedem que você aterre o que sente em forma concreta.",
    profundidade:
      "O mês 11 oscila entre clareza e nervosismo. Proteja o sistema nervoso, escolha poucos estímulos e transforme intuição em decisão. Visão sem passo vira ansiedade; passo sem escuta vira pressa.",
    reflexao: '"Qual visão deste mês você ainda não colocou no chão?"',
    acoes: [
      "Guarde um diário de insights e escolha um por mês para agir.",
      "Reduza barulho (tela, gente demais) em horários fixos do mês.",
      "Compartilhe uma intuição com alguém maduro — sem pedir validação de todo mundo.",
    ],
    evitar: [
      "Absorver o clima emocional de todos à sua volta.",
      "Idealizar tanto que nada se realiza.",
    ],
    areas: ["intuição e decisão", "sistema nervoso e descanso", "um projeto inspirado"],
  },
  22: {
    energia: "Construir",
    titulo: "Mês mestre 22 — legado",
    descricao:
      "Este mês pede construir em escala. Visão grande com estrutura: pessoas, prazos e recursos alinhados a um propósito maior.",
    profundidade:
      "O 22 carrega peso de missão. Não precisa erguer o monumento inteiro neste mês — precisa de fundação séria. Delegue, planeje e sustente o corpo junto com o projeto.",
    reflexao: '"Qual estrutura deste mês deixa legado além de você?"',
    acoes: [
      "Defina a próxima etapa mensurável do projeto maior.",
      "Organize quem faz o quê — sem carregar tudo sozinho.",
      "Reserve recuperação com a mesma seriedade do trabalho.",
    ],
    evitar: [
      "Paralisar pelo tamanho da missão.",
      "Justificar qualquer meio pela grandeza do fim.",
    ],
    areas: ["projeto de impacto", "equipe e recursos", "saúde sob pressão"],
  },
  33: {
    energia: "Curar",
    titulo: "Mês mestre 33 — amor em ação",
    descricao:
      "Este mês pede cura e serviço conscientes. Ensinar, acolher e elevar — a partir da plenitude, com limites claros.",
    profundidade:
      "O 33 ama em escala. Sem autocuidado, vira martírio. Escolha onde sua presença realmente transforma e diga não ao resto. Amor sem limite não é virtude — é esgotamento.",
    reflexao: '"Onde você está servindo por missão — e onde por obrigação?"',
    acoes: [
      "Escolha uma frente de cuidado/ensino e sustente ela o mês todo.",
      "Pratique um limite semanal de descanso como ato sagrado.",
      "Peça e aceite cuidado de alguém — não só ofereça.",
    ],
    evitar: [
      "Absorver o sofrimento de todos.",
      "Usar a missão espiritual para não viver a própria vida.",
    ],
    areas: ["serviço e limites", "relações de cuidado", "autocuidado sagrado"],
  },
};
