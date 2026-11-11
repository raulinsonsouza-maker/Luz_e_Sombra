import { itemPorId, type CodigoItem, type RespostaSimNao } from "./itens";
import type { TemperamentoCodigo } from "./types";
import { TEMPERAMENTOS } from "./types";

export const FRASE_ASSUMIR =
  "Diante da demora, você toma a iniciativa e busca uma solução.";

export const FRASE_CRITICA =
  "Uma crítica fica com você por vários dias, mesmo quando a conversa já acabou.";

export interface CartaoConversa {
  id: string;
  titulo: string;
  paragrafos: string[];
  perguntas: string[];
  passos: string[];
}

interface CenaItem {
  id: CodigoItem;
  alvo: TemperamentoCodigo;
  reconhecer?: string;
  facilidade?: string;
  relacao?: string;
  trabalho?: string;
  atrapalha?: string;
  experimento?: string;
}

interface LeituraUnica {
  essencia: string[];
  mundo: string[];
  motivacao: string[];
  emocao: string[];
  pressao: string[];
  relacao: string[];
  trabalho: string[];
  forca: string[];
  atrapalhos: [string, string, string];
  passos: [string, string, string];
  porquePassos: string;
  fechamento: string[];
  pergunta: string;
}

const NOME: Record<TemperamentoCodigo, string> = {
  SANGUINEO: "sanguíneo",
  COLERICO: "colérico",
  MELANCOLICO: "melancólico",
  FLEUMATICO: "fleumático",
};

const NOME_TITULO: Record<TemperamentoCodigo, string> = {
  SANGUINEO: "Sanguíneo",
  COLERICO: "Colérico",
  MELANCOLICO: "Melancólico",
  FLEUMATICO: "Fleumático",
};

const AVISO_ANTIGO =
  "Este desenho vem da proporção das suas respostas anteriores. O que nenhuma pergunta nova cobriu fica como possibilidade: indica o que pode aparecer, não uma cena que você marcou.";

const LEITURA: Record<TemperamentoCodigo, LeituraUnica> = {
  SANGUINEO: {
    essencia: [
      "O seu temperamento é o sanguíneo. A conexão com as pessoas, a comunicação e as experiências ocupam um espaço importante na sua maneira de viver.",
      "Você encontra entusiasmo no que acontece ao redor: conversas, encontros, novidades e a sensação de estar fazendo parte. Muitas vezes, uma experiência ganha mais sentido quando pode ser compartilhada.",
      "O aprendizado deste temperamento não é deixar de ser espontâneo. É aprender a sustentar o que importa quando a novidade passa, e a valorizar o que você faz mesmo sem plateia.",
    ],
    mundo: [
      "Você tende a perceber o mundo como um lugar de experiências, possibilidades e encontros. Num ambiente novo, presta atenção nas pessoas, no clima e no que dá para conversar.",
      "Muitas vezes você descobre o que pensa enquanto fala. A interação organiza a ideia. Isso não significa falta de reflexão: conversar pode ser parte do seu jeito de compreender.",
    ],
    motivacao: [
      "O que motiva você costuma estar ligado a experimentar, sentir-se incluído e compartilhar. O reconhecimento também importa, principalmente quando mostra que sua presença e suas ideias foram percebidas.",
      "Quando falta resposta, o ânimo pode cair. O desenvolvimento acontece quando você aprende a valorizar o que fez mesmo quando ninguém está observando, elogiando ou participando.",
    ],
    emocao: [
      "Você pode expressar com facilidade o que sente, sobretudo quando encontra alguém com quem conversar com liberdade. Na alegria, compartilha; na tristeza, pode buscar conversa, atenção ou uma atividade que recupere o ânimo.",
      "Às vezes, a vontade de sair rápido de um desconforto faz com que o sentimento não seja compreendido antes de ser substituído por outra experiência. O convite é permanecer um pouco mais com o que você sente.",
    ],
    pressao: [
      "Sob pressão, você pode procurar recuperar a conexão, o entusiasmo ou a sensação de liberdade: falar mais, explicar seu lado, pedir apoio ou mudar de assunto para aliviar o momento.",
      "Também pode ser difícil permanecer concentrado em um problema que exige atenção longa e não oferece saída imediata. Escutar uma crítica sem tratá-la como rejeição é um ponto de crescimento.",
    ],
    relacao: [
      "Nas relações, você valoriza presença, conversa, espontaneidade e demonstrações de interesse. Gosta de contar o dia, fazer planos e envolver as pessoas nas suas experiências.",
      "Uma dificuldade possível é interpretar falta de comunicação como falta de interesse. Uma pessoa mais reservada pode demonstrar afeto de outro jeito, sem conversar com a mesma frequência.",
      "Nas amizades e na família, você costuma ser a pessoa que reúne e movimenta. O desafio é manter proximidade também quando a relação pede constância, e não só entusiasmo.",
    ],
    trabalho: [
      "No trabalho, ambientes com comunicação, criatividade, interação e variedade tendem a te motivar. Você pode apresentar ideias, criar conexões e perceber oportunidades com facilidade.",
      "A fase de manutenção pede outro esforço. Quando a novidade diminui, pode surgir vontade de começar outra frente. Seu desenvolvimento passa por criar etapas de conclusão e terminar uma atividade antes de abrir a próxima.",
    ],
    forca: [
      "Sua força está em aproximar pessoas, abrir conversas e trazer movimento para ambientes parados. Você transforma silêncio em troca e ideias em energia compartilhada.",
      "Quando essa força está equilibrada, você anima sem atropelar o tempo do outro e transforma entusiasmo em continuidade.",
    ],
    atrapalhos: [
      "A busca por novidade pode dificultar a continuidade: começos frequentes e conclusões adiadas.",
      "A facilidade para conversar pode virar dificuldade de escutar, e o desejo de manter o clima bom pode evitar conversas necessárias.",
      "Quando o reconhecimento externo define o valor do seu esforço, a frustração aparece rápido se a resposta não vem.",
    ],
    passos: [
      "Escolha uma ideia ou tarefa já começada e leve até o fim antes de abrir outra.",
      "Numa conversa, conte menos uma frase e pergunte o que a outra pessoa pensou.",
      "Quando algo der certo, registre para você o que você fez, antes de contar para alguém.",
    ],
    porquePassos:
      "Estes exercícios fortalecem a continuidade e a escuta, sem apagar sua espontaneidade. São práticas para a vida, no seu ritmo.",
    fechamento: [
      "Você não precisa falar menos para ser profundo, nem abrir mão do entusiasmo para ser constante. O ponto sensível é o instante em que a novidade passa e o que importa ainda pede presença.",
      "Conhecer o seu temperamento sanguíneo é o começo. A partir daqui, observe como essa tendência aparece no dia a dia e amplie a compreensão sobre si mesmo.",
    ],
    pergunta: "Você consegue continuar valorizando o que começou quando o ânimo passa e ninguém está te incentivando?",
  },
  COLERICO: {
    essencia: [
      "O seu temperamento é o colérico. Iniciativa, autonomia e realização ocupam um espaço importante na sua maneira de viver.",
      "Quando algo precisa ser feito, você sente vontade de agir, encontrar uma saída e assumir a responsabilidade. Prefere começar e ajustar o caminho durante a execução.",
      "O aprendizado deste temperamento é compreender que realizar não significa controlar tudo, que ouvir não diminui sua capacidade e que nem toda situação precisa ser resolvida na hora.",
    ],
    mundo: [
      "Você tende a perceber situações a partir do que precisa ser feito, resolvido ou alcançado. Diante de um problema, procura a saída antes de reunir todos os detalhes.",
      "Isso favorece objetividade. Também pode fazer você passar rápido pela etapa de compreender o que aconteceu, quando as pessoas envolvidas ainda precisam ser ouvidas.",
    ],
    motivacao: [
      "O que motiva você costuma estar ligado a conquistar objetivos, tomar decisões, superar desafios e ver resultados concretos. Autonomia pesa bastante.",
      "Quando os resultados demoram ou dependem de terceiros, pode surgir irritação ou a sensação de estar impedido de avançar. O desenvolvimento está em separar o que depende de você do que exige tempo e colaboração.",
    ],
    emocao: [
      "Você tende a transformar emoção em atitude. Quando algo incomoda, procura resolver, confrontar, estabelecer limite ou mudar a situação.",
      "Às vezes a reação chega antes de você compreender o que sentiu. Por trás da irritação pode haver frustração ou medo de perder o rumo. O convite é reconhecer o sentimento antes da ação.",
    ],
    pressao: [
      "Sob pressão, aumenta a necessidade de organização, direção e controle. Você pode falar mais direto, cobrar resultado e assumir o que estava distribuído.",
      "A intenção pode ser evitar que tudo dê errado. Para o outro, isso pode parecer pressão ou falta de espaço para contribuir. Dividir responsabilidade também é uma forma de realizar.",
    ],
    relacao: [
      "Nas relações, você valoriza sinceridade, clareza e confiança. Prefere conversas diretas e, quando há problema, quer encontrar uma solução.",
      "A objetividade pode chegar como dureza quando você não percebe como as palavras chegam. Pode achar que está só sendo claro, enquanto a outra pessoa sente cobrança.",
      "Demonstrar carinho por atitudes e resolução de problemas é natural para você. Vale lembrar que o outro também pode precisar de escuta e disponibilidade, não só de solução.",
    ],
    trabalho: [
      "No trabalho, desafios, autonomia e objetivos claros te motivam. Você toma iniciativa, organiza tarefas e enfrenta o que outros evitam.",
      "Quando o foco no resultado fica intenso, o processo e as pessoas podem ficar em segundo plano. Delegar e compartilhar decisões fortalece o resultado e reduz sobrecarga.",
    ],
    forca: [
      "Sua força está em fazer a coisa andar: decidir, organizar e sustentar o caminho até o fim. Você entra quando ninguém decide.",
      "Quando essa força está equilibrada, você lidera sem apagar a contribuição do outro e resolve sem transformar toda conversa em cobrança.",
    ],
    atrapalhos: [
      "A vontade de resolver pode virar impaciência com o ritmo diferente do seu.",
      "A objetividade pode virar comunicação dura, e a iniciativa pode virar necessidade de controlar.",
      "Diante da demora, você toma a iniciativa e busca uma solução. A outra pessoa perde o lugar de pensar junto.",
    ],
    passos: [
      "Antes da próxima decisão, faça uma pergunta e espere a resposta inteira.",
      "Corrija uma coisa por conversa. Deixe o resto para outro momento.",
      "Diga um acerto de outra pessoa sem emendar a correção na mesma frase.",
    ],
    porquePassos:
      "Estes exercícios treinam escuta e partilha de controle, sem tirar sua capacidade de realizar. São práticas para a vida.",
    fechamento: [
      "Você não precisa desistir de resolver para deixar a outra pessoa participar da decisão. O ponto sensível é o instante em que a pressa vira pressão.",
      "Conhecer o seu temperamento colérico é o começo. Observe como essa tendência aparece no dia a dia e escolha quando agir e quando esperar.",
    ],
    pergunta: "Você consegue deixar as coisas acontecerem de um jeito diferente do seu sem sentir que perdeu o controle?",
  },
  MELANCOLICO: {
    essencia: [
      "O seu temperamento é o melancólico. Reflexão, profundidade, observação e busca por qualidade ocupam um espaço importante na sua maneira de viver.",
      "Você gosta de compreender antes de decidir. Nota detalhes, inconsistências e aspectos que outras pessoas deixam passar.",
      "O aprendizado deste temperamento é preservar a profundidade sem transformar cada escolha em preocupação, e buscar qualidade sem exigir que tudo esteja impecável para começar.",
    ],
    mundo: [
      "Você presta atenção no significado das situações, nos detalhes e nas possíveis consequências. Diante de uma decisão, quer o contexto antes de escolher.",
      "Isso favorece decisões cuidadosas. Também pode fazer situações simples parecerem maiores do que são, quando a análise continua depois de já haver elementos suficientes.",
    ],
    motivacao: [
      "O que motiva você costuma estar ligado a sentido, qualidade e responsabilidade. Fazer bem feito importa mais do que fazer rápido.",
      "Quando a pressa externa ignora o cuidado, a frustração aparece. O desenvolvimento está em confiar que algumas experiências só se compreendem durante a realização.",
    ],
    emocao: [
      "Você pode sentir com intensidade e processar por dentro antes de expressar. Uma crítica ou um detalhe pode continuar com você depois que a conversa acabou.",
      "O risco é transformar um comentário sobre a tarefa numa dúvida sobre a sua capacidade. Separar o retorno do trabalho da avaliação de quem você é traz alívio.",
    ],
    pressao: [
      "Sob pressão, o medo de errar pode travar o começo, a decisão ou a entrega. Você mexe de novo num detalhe de algo que já estava pronto.",
      "O convite é marcar o que é suficiente e entregar quando chegar lá, sem tratar um erro pequeno como sentença sobre você.",
    ],
    relacao: [
      "Nas relações, você valoriza profundidade, lealdade e compreensão. Pode esperar que o outro perceba o que você precisa sem você dizer.",
      "O silêncio cuidadoso pode virar distância. Uma frase pequena no mesmo dia costuma ser mais leve do que uma noite inteira revisando o que não foi dito.",
      "Quando confia, você explica com riqueza. Avisar que precisa de um tempo também é um jeito de cuidar da relação.",
    ],
    trabalho: [
      "No trabalho, organização, previsão de problemas e capricho são marcas suas. Você melhora o que vai ser entregue.",
      "O excesso aparece quando a qualidade vira adiamento. Mostrar o trabalho no meio do caminho, antes de estar impecável, acelera o aprendizado e reduz o peso sozinho.",
    ],
    forca: [
      "Sua força está em ver o que outros não veem e cuidar da qualidade do que importa. Você traz profundidade para decisões e projetos.",
      "Quando essa força está equilibrada, o cuidado serve à vida, e não a impede de acontecer.",
    ],
    atrapalhos: [
      "Pensar demais pode adiar o começo, a escolha ou a conclusão.",
      "Você transforma um comentário sobre a tarefa numa dúvida sobre a sua capacidade.",
      "Carregar sozinho o que precisava de uma conversa cansa e isola.",
    ],
    passos: [
      "Escreva o que é suficiente antes de começar. Quando chegar lá, entregue.",
      "Diga uma preocupação pequena no mesmo dia em que ela aparecer.",
      "Mostre um trabalho no meio, antes de ele estar impecável.",
    ],
    porquePassos:
      "Estes exercícios abrem espaço entre cuidado e ação, sem abandonar sua profundidade. São práticas para a vida.",
    fechamento: [
      "Você pode continuar cuidadoso e, ainda assim, deixar as coisas acontecerem sem controlar cada detalhe. O ponto sensível é o instante em que a análise substitui o passo.",
      "Conhecer o seu temperamento melancólico é o começo. Observe onde o cuidado te fortalece e onde ele te trava.",
    ],
    pergunta: "Quantas vezes você deixa de começar, decidir ou concluir porque ainda acha que poderia fazer melhor?",
  },
  FLEUMATICO: {
    essencia: [
      "O seu temperamento é o fleumático. Tranquilidade, estabilidade e preservação da harmonia ocupam um espaço importante na sua maneira de viver.",
      "Você observa antes de participar, escuta antes de responder e prefere compreender o ambiente antes de agir. Sua calma pode acolher quem está ao redor.",
      "O aprendizado deste temperamento é descobrir que preservar a paz não significa evitar todo conflito, e que dizer o que você quer também pode fortalecer uma relação.",
    ],
    mundo: [
      "Você valoriza estabilidade e observa as situações antes de decidir como entrar. Em ambientes agitados, pode não sentir a mesma urgência que os outros.",
      "Não reagir na hora não quer dizer ausência de opinião. Você pode estar percebendo muita coisa e escolher não colocar tudo para fora naquele momento.",
    ],
    motivacao: [
      "O que motiva você costuma estar ligado a rotina segura, relações estáveis e ambientes respeitosos, sem cobrança constante.",
      "A dificuldade aparece quando a busca por estabilidade evita mudanças necessárias. Segurança também se constrói ao enfrentar o que precisa mudar.",
    ],
    emocao: [
      "Você pode demonstrar o que sente de forma mais reservada. Às vezes diz que está tudo bem mesmo quando algo não agradou, para não gerar atrito.",
      "O desconforto pode permanecer em silêncio. Quando isso se repete, fica difícil explicar depois por que a situação passou a incomodar tanto.",
    ],
    pressao: [
      "Sob pressão, você pode reduzir o contato com o desconforto: ficar mais quieto, adiar decisões ou esperar que a situação se resolva sozinha.",
      "Isso evita briga imediata e também pode deixar problemas sem destino. Uma frase no meio do caminho costuma ser mais leve do que uma cobrança tardia.",
    ],
    relacao: [
      "Nas relações, você valoriza harmonia, constância e respeito. Escuta até o fim e as pessoas se sentem à vontade para falar.",
      "O risco é a conversa terminar agradável e incompleta: o que é seu não entra. Concordar por fora e revisar por dentro cansa.",
      "Pedir uma mudança pequena não desfaz a paz. Dizer não a um pedido não é dizer não à pessoa.",
    ],
    trabalho: [
      "No trabalho, você contribui com constância, cooperação e capacidade de sustentar processos sem precisar de holofote.",
      "Pode aceitar tarefas para não criar atrito e adiar o que é realmente seu. Marcar limite e dividir a carga preserva sua energia e a qualidade do grupo.",
    ],
    forca: [
      "Sua força está em acalmar ambientes, escutar com presença e manter o que precisa de continuidade. Você segura conversas difíceis para não virarem briga.",
      "Quando essa força está equilibrada, a calma inclui a sua voz, e não só a dos outros.",
    ],
    atrapalhos: [
      "Evitar desconforto pode deixar situações importantes sem solução.",
      "Você pode engolir o incômodo até ele ficar grande demais.",
      "O silêncio pode ser lido como acordo, quando na verdade você só não quis brigar.",
    ],
    passos: [
      "Diga o incômodo no dia em que ele aparecer, em uma frase.",
      "Recuse um pedido que não é seu, sem justificar demais.",
      "Peça uma mudança em uma coisa só, no mesmo dia.",
    ],
    porquePassos:
      "Estes exercícios treinam expressão e limite sem abandonar sua busca por harmonia. São práticas para a vida.",
    fechamento: [
      "Você pode continuar buscando um ambiente calmo e, ainda assim, ocupar um pedaço da conversa com o que é seu. O ponto sensível é o instante em que a paz vira silêncio sobre o que importa.",
      "Conhecer o seu temperamento fleumático é o começo. Observe onde a calma te sustenta e onde ela te impede de pedir o que precisa.",
    ],
    pergunta: "Quantas vezes você deixa de dizer o que realmente quer só para evitar um desconforto?",
  },
};

const CENAS: CenaItem[] = [
  {
    id: "E01",
    alvo: "SANGUINEO",
    reconhecer: "Você consegue iniciar conversas até com pessoas que acabou de conhecer.",
    facilidade: "Você se aproxima e as pessoas entram no assunto.",
  },
  {
    id: "E02",
    alvo: "SANGUINEO",
    reconhecer: "Estar no meio das pessoas te anima mais do que te cansa.",
  },
  {
    id: "E03",
    alvo: "SANGUINEO",
    relacao: "Em casa, você conta o que sentiu e já segue em frente. A outra pessoa ainda está naquele assunto.",
    experimento: "Na próxima discussão, fique mais um minuto no assunto antes de contar outra coisa.",
  },
  {
    id: "E04",
    alvo: "SANGUINEO",
    atrapalha: "Você conta a história e a outra pessoa quase não entra. A conversa termina sem a opinião dela.",
    experimento: "Numa conversa desta semana, conte menos uma frase e pergunte o que a outra pessoa achou.",
  },
  {
    id: "E05",
    alvo: "COLERICO",
    trabalho: "No trabalho, quando a decisão trava, você assume o próximo passo mesmo já estando cheio de tarefa.",
    facilidade: "Quando o grupo está parado, você escolhe o próximo passo.",
  },
  {
    id: "E06",
    alvo: "COLERICO",
    atrapalha: FRASE_ASSUMIR,
    experimento: "Quando alguém demorar, diga que espera e deixe a pessoa terminar o raciocínio.",
  },
  {
    id: "E07",
    alvo: "COLERICO",
    trabalho: "Numa reunião, você fecha o assunto enquanto a outra pessoa ainda está entendendo.",
    experimento: "Escolha uma conversa e termine sem pedir uma conclusão. Só agradeça o que foi dito.",
  },
  {
    id: "E08",
    alvo: "COLERICO",
    relacao: "Em casa, você cobra na hora quando alguém atrasa o combinado. A outra pessoa para de contar o que sentia.",
    experimento: "Na próxima cobrança, pergunte primeiro o que atrasou. A cobrança vem na frase seguinte.",
  },
  {
    id: "N01",
    alvo: "MELANCOLICO",
    trabalho: "Você organiza e prevê problemas por tempo demais, e o prazo anda. A tarefa só fica pronta quando você tem certeza.",
    facilidade: "Olhar antes te evita um passo que você ia querer desfazer.",
  },
  {
    id: "N02",
    alvo: "MELANCOLICO",
    reconhecer: FRASE_CRITICA,
    atrapalha: "Você transforma um comentário sobre a tarefa numa dúvida sobre a sua capacidade.",
    experimento: "Se uma crítica voltar, escreva uma frase sobre o que ela pediu e pare por hoje.",
  },
  {
    id: "N03",
    alvo: "MELANCOLICO",
    trabalho: "No trabalho, você mexe de novo num detalhe de algo que já estava pronto. A entrega atrasa.",
    experimento: "Ao terminar uma atividade, pergunte se você melhora o resultado ou só procura outro detalhe.",
  },
  {
    id: "N04",
    alvo: "MELANCOLICO",
    relacao: "Você espera que a outra pessoa perceba o que você precisa, sem você dizer. O silêncio vira distância.",
    experimento: "Diga uma coisa pequena que te incomodou no mesmo dia, em uma frase.",
  },
  {
    id: "N05",
    alvo: "FLEUMATICO",
    reconhecer: "Você mantém a calma quando as pessoas ao redor estão nervosas.",
    facilidade: "Essa calma segura uma conversa difícil para ela não virar briga.",
  },
  {
    id: "N06",
    alvo: "FLEUMATICO",
    relacao: "Em família, você concorda para evitar briga e o combinado não era o seu.",
    experimento: "Numa conversa em que você discordar, diga a sua posição em uma frase, sem aumentar o tom.",
  },
  {
    id: "N07",
    alvo: "FLEUMATICO",
    reconhecer: "Você gosta de um momento sem pressa e sem ter algo para resolver.",
  },
  {
    id: "N08",
    alvo: "FLEUMATICO",
    relacao: "Você escuta até o fim e o seu próprio assunto fica para depois.",
    facilidade: "As pessoas falam a verdade porque você não interrompe.",
  },
];

function ordenar(percentuais: Record<TemperamentoCodigo, number>): TemperamentoCodigo[] {
  return [...TEMPERAMENTOS].sort((a, b) => (percentuais[b] ?? 0) - (percentuais[a] ?? 0));
}

function conta(id: string, respostas: Record<string, RespostaSimNao>): boolean {
  const item = itemPorId(id);
  if (!item) return false;
  const marca = item.direcao === "positiva" ? "sim" : "nao";
  return respostas[id] === marca;
}

function cenasDe(
  alvos: TemperamentoCodigo[],
  respostas: Record<string, RespostaSimNao> | undefined,
  usar: boolean,
): CenaItem[] {
  if (!usar || !respostas) return [];
  return CENAS.filter((cena) => alvos.includes(cena.alvo) && conta(cena.id, respostas));
}

function textos(cenas: CenaItem[], campo: keyof CenaItem, max: number): string[] {
  const saida: string[] = [];
  for (const cena of cenas) {
    const valor = cena[campo];
    if (typeof valor === "string" && !saida.includes(valor)) saida.push(valor);
    if (saida.length >= max) break;
  }
  return saida;
}

function unicos(textosLista: Array<string | undefined>, max: number): string[] {
  const saida: string[] = [];
  for (const texto of textosLista) {
    if (!texto || saida.includes(texto)) continue;
    saida.push(texto);
    if (saida.length >= max) break;
  }
  return saida;
}

/** Monta a leitura do temperamento único (sem combinação). `secundario` é ignorado e existe só por compatibilidade. */
export function montarLeituraConversa(opts: {
  primario: TemperamentoCodigo;
  secundario?: TemperamentoCodigo;
  percentuais: Record<TemperamentoCodigo, number>;
  respostas?: Record<string, RespostaSimNao>;
  questionarioClaro?: boolean;
}): CartaoConversa[] {
  const ordem = ordenar(opts.percentuais);
  const primario = ordem[0] ?? opts.primario;
  const base = LEITURA[primario];
  const usar = opts.questionarioClaro === true && !!opts.respostas;
  const respostas = opts.respostas;
  const cenas = cenasDe([primario], respostas, usar);
  const aviso = usar ? [] : [AVISO_ANTIGO];
  const reconhecidos = textos(cenas, "reconhecer", 3);

  const atrapalhos = usar ? textos(cenas, "atrapalha", 3) : [...base.atrapalhos];
  if (usar && atrapalhos.length === 0) {
    atrapalhos.push("Nenhuma cena de aperto ficou marcada nas suas respostas deste temperamento.");
  }
  if (!usar) {
    // Mantém a palavra "possibilidade" para leituras antigas sem questionário claro.
    atrapalhos[0] = `${atrapalhos[0]} Isso aparece como possibilidade a partir do conjunto das respostas.`;
  }

  const cenasAtrapalho = usar
    ? cenas.filter((cena) => cena.atrapalha && atrapalhos.includes(cena.atrapalha))
    : [];
  const experimentos = unicos([...cenasAtrapalho.map((cena) => cena.experimento), ...base.passos], 3);

  const relacoes = usar ? unicos([...textos(cenas, "relacao", 3), ...base.relacao], 4) : [...base.relacao];
  const trabalhos = usar ? unicos([...textos(cenas, "trabalho", 3), ...base.trabalho], 4) : [...base.trabalho];
  const forcas = usar ? unicos([...textos(cenas, "facilidade", 3), ...base.forca], 4) : [...base.forca];

  const primeiro = [
    ...base.essencia,
    ...aviso,
    ...(reconhecidos.length
      ? reconhecidos
      : usar
        ? ["Nas perguntas deste temperamento, você não marcou um comportamento para destacar."]
        : []),
  ];

  return [
    {
      id: "antes",
      titulo: "Sobre o seu resultado",
      paragrafos: [
        `A partir das suas respostas, o temperamento que mais aparece em você é o ${NOME[primario]}. Esta leitura aprofunda como essa tendência se manifesta nas emoções, nas relações, no trabalho e no seu processo de autoconhecimento.`,
      ],
      perguntas: [],
      passos: [],
    },
    {
      id: "primeiro",
      titulo: `Seu temperamento: ${NOME_TITULO[primario]}`,
      paragrafos: primeiro,
      perguntas: [base.pergunta],
      passos: [],
    },
    {
      id: "mundo",
      titulo: "Como você costuma enxergar o mundo",
      paragrafos: base.mundo,
      perguntas: [],
      passos: [],
    },
    {
      id: "motivacao",
      titulo: "O que te motiva",
      paragrafos: base.motivacao,
      perguntas: [],
      passos: [],
    },
    {
      id: "emocao",
      titulo: "Emoções e pressão",
      paragrafos: [...base.emocao, ...base.pressao],
      perguntas: [],
      passos: [],
    },
    {
      id: "aproveitar",
      titulo: "Suas tendências comportamentais",
      paragrafos: forcas,
      perguntas: [],
      passos: [],
    },
    {
      id: "relacoes",
      titulo: "Nos relacionamentos",
      paragrafos: relacoes,
      perguntas: [],
      passos: [],
    },
    {
      id: "trabalho",
      titulo: "No trabalho",
      paragrafos: trabalhos,
      perguntas: [],
      passos: [],
    },
    {
      id: "atrapalha",
      titulo: "Quando essa tendência atrapalha",
      paragrafos: atrapalhos,
      perguntas: [],
      passos: [],
    },
    {
      id: "semana",
      titulo: "Exercícios para a vida",
      paragrafos: [base.porquePassos],
      perguntas: [],
      passos: experimentos,
    },
    {
      id: "fica",
      titulo: "Para o seu autoconhecimento",
      paragrafos: base.fechamento,
      perguntas: [base.pergunta],
      passos: [],
    },
  ];
}
