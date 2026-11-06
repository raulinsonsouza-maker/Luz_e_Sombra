import { calcularDiaPessoal } from "@/lib/numerologia-utils";

type Fala = {
  hoje: string;
  periodo: string;
  ciclo: string;
  clima: string;
};

const FALAS: Record<number, Fala> = {
  1: {
    hoje: "Hoje pede um começo. Escolha uma coisa que você vem adiando e dê o primeiro passo, mesmo pequeno.",
    periodo: "Este período favorece iniciar. O que você planta agora ganha corpo quando você assume a autoria, sem esperar o momento perfeito.",
    ciclo: "Na sua vida, este é um tempo de abrir o próprio caminho. Decisões tomadas com coragem desenham o que vem pela frente.",
    clima: "À volta, o ar é de recomeço. Gente e projetos estão saindo do lugar, e isso convida você a não ficar só olhando.",
  },
  2: {
    hoje: "Hoje pede escuta. Antes de decidir, deixe a outra pessoa terminar e sinta o que realmente está em jogo.",
    periodo: "Este período pede cuidado com as relações. Acordos feitos com paciência valem mais do que respostas apressadas.",
    ciclo: "Na sua vida, este é um tempo de parceria. O que amadurece agora cresce melhor quando você não carrega tudo sozinho.",
    clima: "À volta, o convite é cooperar. Diálogos e acordos andam mais longe do que a pressa de vencer sozinho.",
  },
  3: {
    hoje: "Hoje pede que você se expresse. Diga, escreva ou crie o que está preso, com leveza e com verdade.",
    periodo: "Este período abre a voz. Conversas, ideias e encontros ganham força quando você comunica com clareza, sem se espalhar em tudo ao mesmo tempo.",
    ciclo: "Na sua vida, este é um tempo de florescer. O que você mostra ao mundo pode aproximar as pessoas certas.",
    clima: "À volta, há mais espaço para criar e conversar. Use isso para colocar para fora algo que importa, não só para preencher o silêncio.",
  },
  4: {
    hoje: "Hoje pede ordem. Escolha uma tarefa concreta e leve até o fim, com calma e sem atalho.",
    periodo: "Este período favorece construir base. Rotina, cuidado com os detalhes e um passo de cada vez sustentam o que você quer ver de pé.",
    ciclo: "Na sua vida, este é um tempo de alicerce. O esforço constante, mais do que o impulso, é o que fica.",
    clima: "À volta, o clima pede estrutura. Quem organiza a própria casa e o próprio trabalho encontra mais chão.",
  },
  5: {
    hoje: "Hoje pede movimento. Aceite um ajuste, uma saída ou uma conversa que abra o dia, em vez de segurar tudo no mesmo lugar.",
    periodo: "Este período traz mudança. O que estava rígido pode ceder, e a liberdade aparece quando você solta o que já não cabe.",
    ciclo: "Na sua vida, este é um tempo de ampliar. Novos caminhos aparecem para quem se permite experimentar sem se perder.",
    clima: "À volta, as coisas se mexem. Mudanças pedem flexibilidade, sem abandonar o que é essencial para você.",
  },
  6: {
    hoje: "Hoje pede cuidado com quem está perto. Um gesto de presença, em casa ou numa relação, vale mais do que resolver o mundo.",
    periodo: "Este período traz as relações próximas para o centro. Responsabilidade com afeto, sem se anular, deixa o ambiente mais inteiro.",
    ciclo: "Na sua vida, este é um tempo de harmonizar. Família, casa e os compromissos do coração pedem atenção honesta.",
    clima: "À volta, cresce o pedido de cuidado mútuo. O que você faz pelas pessoas certas também devolve chão para você.",
  },
  7: {
    hoje: "Hoje pede silêncio útil. Reserve um tempo para pensar com calma antes de responder ou de se comprometer.",
    periodo: "Este período convida a ir para dentro. Estudo, descanso e perguntas sinceras esclarecem o que a pressa embaça.",
    ciclo: "Na sua vida, este é um tempo de aprofundar. Menos barulho e mais compreensão deixam a próxima escolha mais verdadeira.",
    clima: "À volta, há um convite a desacelerar e compreender. Quem busca sentido, em vez de só resultado, enxerga melhor o caminho.",
  },
  8: {
    hoje: "Hoje pede foco no que pode se realizar. Trate de um assunto concreto, com firmeza e sem dispersar a energia.",
    periodo: "Este período favorece colher e organizar resultados. Decisões práticas, no trabalho e nos limites, pedem a sua presença.",
    ciclo: "Na sua vida, este é um tempo de concretizar. O que você conduz com responsabilidade tende a ganhar forma.",
    clima: "À volta, a atenção vai para o que se realiza no mundo. Use a sua força com medida, para construir e não para controlar.",
  },
  9: {
    hoje: "Hoje pede um encerramento. Termine, agradeça ou solte uma coisa que já cumpriu o seu tempo.",
    periodo: "Este período é de fechamento. O que você conclui agora abre espaço para o que ainda não tem nome.",
    ciclo: "Na sua vida, este é um tempo de liberar. Despedidas honestas preparam um começo mais limpo.",
    clima: "À volta, ciclos estão se completando. O que ficou para trás pode ser solto, e isso autoriza você a fazer o mesmo.",
  },
};

export function momentoDoDia(dataNascimento: string, data: Date = new Date()): string | null {
  const numeros = calcularDiaPessoal(dataNascimento, data);
  if (!numeros) return null;

  const papeis = [
    FALAS[numeros.hoje].hoje,
    FALAS[numeros.periodo].periodo,
    FALAS[numeros.ciclo].ciclo,
    FALAS[numeros.clima].clima,
  ];
  const chaves = [numeros.hoje, numeros.periodo, numeros.ciclo, numeros.clima];
  const vistos = new Set<number>();
  const partes: string[] = [];

  chaves.forEach((numero, indice) => {
    if (vistos.has(numero)) return;
    vistos.add(numero);
    partes.push(papeis[indice]);
  });

  return partes.join(" ");
}
