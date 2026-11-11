import type { IntensidadePerfil, LinguagemAmor } from "../types.js";

export interface ConteudoLinguagemV3 {
  mecanismoEmocional: string;
  cenasCotidiano: [string, string, string];
  feridaPadrao: string;
  sinalDeAlerta: string;
  comoInterpretarAnti: string;
  cartaParaParceiro: string;
  planoSeteDias: [string, string, string, string, string, string, string];
}

export interface DinamicaPar {
  dinamicaRelacional: string;
  tensaoComum: string;
  alavancaRelacional: string;
}

/** Definições simples das cinco linguagens (diretriz de comunicação). */
export const DEFINICAO_LINGUAGEM: Record<LinguagemAmor, string> = {
  palavras:
    "Palavras de afirmação: sentir-se amado por meio de elogios, reconhecimento, incentivo e palavras de carinho.",
  tempo:
    "Tempo de qualidade: valorizar a presença, a atenção e os momentos compartilhados.",
  presentes:
    "Presentes: perceber o carinho por meio de lembranças e gestos simbólicos que demonstram consideração.",
  servicos:
    "Atos de serviço: sentir-se cuidado quando alguém oferece ajuda e realiza atitudes que facilitam seu dia.",
  toque:
    "Toque físico: perceber o afeto por meio de abraços, carícias, mãos dadas e outras formas de contato físico consentido.",
};

export const CONTEUDO_V3: Record<LinguagemAmor, ConteudoLinguagemV3> = {
  palavras: {
    mecanismoEmocional:
      "Você costuma se sentir mais amado quando ouve reconhecimento, incentivo e palavras de carinho. Elogios sinceros e frases que nomeiam o que o outro vê em você aproximam e trazem segurança.",
    cenasCotidiano: [
      "Você fez algo difícil e ouviu um \"obrigado, vi o esforço que você fez\". Na hora, sentiu que valia a pena.",
      "Em uma conversa tensa, uma frase dura ficou com você por um tempo, mesmo depois de o assunto ter se acalmado.",
      "Recebeu uma mensagem simples de carinho no meio de um dia pesado e isso mudou o clima interno.",
    ],
    feridaPadrao:
      "Quando faltam palavras ou elas vêm só como crítica, pode surgir a sensação de que sua presença não foi notada. Isso não significa que o outro não se importa. Pode ser que ele demonstre afeto de outro jeito.",
    sinalDeAlerta:
      "Você pode ficar mais quieto ou mais na defensiva, esperando que a outra pessoa perceba o que falta sem você precisar pedir.",
    comoInterpretarAnti:
      "Gestos práticos e presentes também podem agradar, mas costumam não substituir o que você mais precisa: ouvir que importa. Pedir palavras não é exigência demais. É nomear sua maneira de receber.",
    cartaParaParceiro:
      "Quando você diz o que aprecia em mim, com um exemplo real e sem ironia, eu me sinto conectado. Não precisa ser poesia. Preciso ouvir que você me vê. Se precisar corrigir algo, faça com gentileza e clareza: isso me ajuda a receber melhor.",
    planoSeteDias: [
      "Escreva três frases que gostaria de ouvir e compartilhe com alguém próximo.",
      "Elogie algo concreto que a outra pessoa fez, sem exagero.",
      "Quando pedir algo, formule como pedido, não como cobrança.",
      "Envie uma mensagem de gratidão por algo pequeno que passou despercebido.",
      "Observe um dia sem sarcasmo e note como o clima da conversa muda.",
      "Pergunte: \"O que você mais valorizou em mim nestes dias?\"",
      "Antes de dormir, diga em voz alta algo que admira na pessoa amada.",
    ],
  },
  tempo: {
    mecanismoEmocional:
      "Você costuma se sentir mais amado quando há presença e atenção. Momentos compartilhados, sem pressa e sem distração, comunicam vínculo de um jeito que declarações rápidas sozinhas não alcançam.",
    cenasCotidiano: [
      "Você contou algo importante e viu o olhar do outro desviar para a tela. Na hora, sentiu que tinha perdido a vez.",
      "Marcaram um encontro e, por um tempo, ninguém levantou por obrigação. Você lembra desse dia com carinho.",
      "Quando estão juntos em silêncio, mas próximos, você sente mais proximidade do que em ambientes cheios de elogios públicos.",
    ],
    feridaPadrao:
      "Quando a presença diminui por muito tempo, pode surgir distância mesmo sem briga. O outro pode achar que você está indiferente, quando na verdade o que falta é atenção compartilhada.",
    sinalDeAlerta:
      "Você pode se ocupar demais com trabalho, telas ou tarefas para não sentir a falta de presença.",
    comoInterpretarAnti:
      "Presentes e gestos práticos podem agradar, mas raramente substituem o tempo junto. Pedir presença não desvaloriza o que o outro já faz. É esclarecer o que te alcança.",
    cartaParaParceiro:
      "Quando você coloca o celular de lado e me pergunta como foi o dia, de verdade, eu sinto que estamos bem. Não preciso de um discurso perfeito. Preciso sentir que você escolheu aquele momento comigo. Se estiver ocupado, prefiro ouvir \"hoje não consigo\" do que ficar ao meu lado ausente.",
    planoSeteDias: [
      "Reserve 20 minutos só para conversar, sem telas, como um compromisso.",
      "Na próxima conversa difícil, ouça até o fim antes de sugerir soluções.",
      "Proponha uma atividade pequena que a outra pessoa goste.",
      "Ao chegar em casa, pause alguns minutos antes de se isolar em tarefas.",
      "Desligue notificações durante uma refeição juntos.",
      "Pergunte: \"Tem algo que você queria me contar e não teve espaço?\"",
      "Planeje um passeio simples a dois, sem pressa de voltar.",
    ],
  },
  presentes: {
    mecanismoEmocional:
      "Você costuma perceber o carinho por meio de lembranças e gestos simbólicos. Um mimo pensado diz \"eu lembrei de você\", e isso confirma consideração.",
    cenasCotidiano: [
      "Recebeu algo simples que mostrava que a pessoa lembrava de um detalhe seu, e ficou tocado por dias.",
      "Em uma data importante, a ausência de qualquer gesto doeu mais do que uma discussão.",
      "Você guarda lembranças físicas de momentos bons e volta a elas quando precisa sentir vínculo.",
    ],
    feridaPadrao:
      "Quando datas passam em branco ou o gesto chega sem intenção, pode surgir a sensação de não ter sido lembrado. Não se trata de materialismo. O símbolo representa consideração.",
    sinalDeAlerta:
      "Você pode parar de mencionar o que gostaria de receber ou comemorar, para não parecer exigente.",
    comoInterpretarAnti:
      "Palavras e presença também aquecem, mas sem um gesto tangível podem parecer incompletas para você. Pedir um símbolo não anula o valor do que o outro já oferece.",
    cartaParaParceiro:
      "Quando você me surpreende com algo, mesmo pequeno, que mostra atenção ao que eu disse, eu sinto que importo. Não precisa ser caro. Precisa ser pensado. Em momentos difíceis, sua presença vale muito, e gestos simbólicos me lembram que você está comigo.",
    planoSeteDias: [
      "Liste três coisas que já te emocionaram receber e compartilhe com quem te ama.",
      "Ofereça algo simbólico, mesmo modesto, com intenção clara.",
      "Anote uma data que importa para você e comunique com antecedência.",
      "Guarde uma lembrança de um momento bom e conte a história para quem ama.",
      "Faça um cartão ou bilhete escrito à mão para alguém especial.",
      "Quando não puder estar presente, explique e combine outra forma de apoio.",
      "Surpreenda com algo que a pessoa mencionou casualmente nos últimos dias.",
    ],
  },
  servicos: {
    mecanismoEmocional:
      "Você costuma se sentir cuidado quando alguém oferece ajuda e realiza atitudes que facilitam o dia. O amor desce do discurso para a rotina.",
    cenasCotidiano: [
      "Chegou em casa exausto e viu que alguém resolveu algo que você vinha adiando. Sentiu alívio profundo.",
      "Pediu ajuda e recebeu com ressentimento. O gesto perdeu boa parte do significado.",
      "Alguém antecipou uma necessidade sua antes de você pedir, e isso valeu mais do que qualquer elogio.",
    ],
    feridaPadrao:
      "Quando promessas não viram ação, ou a ajuda vem acompanhada de cobrança, pode surgir a sensação de estar sozinho na vida prática. Isso não prova falta de amor. Pode indicar estilos diferentes de demonstrar cuidado.",
    sinalDeAlerta:
      "Você pode assumir mais tarefas em silêncio e depois reagir com irritação a coisas pequenas.",
    comoInterpretarAnti:
      "Palavras de carinho aquecem, mas sem ação prática podem soar incompletas para você. Pedir ajuda concreta é uma forma de cuidar da relação, não de exigir demais.",
    cartaParaParceiro:
      "Quando você coloca a mão na massa, sem reclamar e sem cobrar retorno, eu sinto que estamos no mesmo time. Pergunte \"em que posso ajudar?\" e execute com boa vontade. Para mim, amor também é vida compartilhada. Um \"obrigado\" depois da ajuda importa muito.",
    planoSeteDias: [
      "Liste três tarefas que mais te aliviam quando alguém as faz.",
      "Faça uma coisa prática pela pessoa amada sem esperar retorno.",
      "Quando pedir ajuda, especifique o que realmente importa.",
      "Agradeça um serviço pequeno que costuma passar despercebido.",
      "Antecipe uma necessidade da pessoa amada antes de ela pedir.",
      "Evite prometer o que não vai cumprir. Combine prazos realistas.",
      "Divida uma tarefa chata e façam juntos, não só delegue.",
    ],
  },
  toque: {
    mecanismoEmocional:
      "Você costuma perceber o afeto por meio de abraços, carícias, mãos dadas e outras formas de contato físico consentido. A proximidade do corpo comunica \"estou aqui\".",
    cenasCotidiano: [
      "Em um dia difícil, um abraço longo acalmou mais do que qualquer conselho.",
      "Sentiu distância física prolongada e interpretou como afastamento, mesmo sem briga.",
      "Um toque breve ao passar, mão no ombro ou encostar-se no sofá, mudou seu humor.",
    ],
    feridaPadrao:
      "Quando o toque diminui ou fica só utilitário, pode surgir a sensação de distância. Isso não significa rejeição automática. Pode ser que a outra pessoa demonstre afeto de outras maneiras.",
    sinalDeAlerta:
      "Você pode buscar mais contato com amigos ou família para compensar a falta de proximidade no vínculo principal.",
    comoInterpretarAnti:
      "Presentes e palavras também agradam, mas sem carinho físico o vínculo pode parecer distante para você. Combinar o que é confortável para os dois abre caminho sem pressão.",
    cartaParaParceiro:
      "Quando você me abraça sem pressa, ou segura minha mão em silêncio, eu sinto que pertenço. Em dias difíceis, seu toque vale mais do que um sermão. Pergunte o que é confortável para mim. Pequenos gestos frequentes importam mais do que grandes demonstrações raras.",
    planoSeteDias: [
      "Combine com quem te ama quais tipos de toque te confortam.",
      "Inicie um gesto afetuoso pequeno por dia, como um abraço de chegada.",
      "Em stress, peça um abraço em vez de esperar que adivinhem.",
      "Durante uma conversa difícil, mantenha contato físico leve se ambos concordarem.",
      "Crie um ritual de despedida com carinho físico consentido.",
      "Se estiver retraindo o toque por medo de rejeição, comunique isso.",
      "Antes de dormir, compartilhe um momento de proximidade sem telas.",
    ],
  },
};

export const DINAMICA_PAR: Partial<Record<string, DinamicaPar>> = {
  "palavras+tempo": {
    dinamicaRelacional:
      "Você se sente bem quando há presença e quando essa presença também é nomeada. Tempo sem palavras pode deixar dúvida. Palavras sem tempo podem soar distantes.",
    tensaoComum: "Você pede atenção e a outra pessoa oferece declarações rápidas antes de realmente parar.",
    alavancaRelacional: "Reservem um tempo sem telas e comecem dizendo uma coisa que admiram um no outro, depois escutem.",
  },
  "palavras+presentes": {
    dinamicaRelacional:
      "Gestos tangíveis e palavras calorosas se reforçam. Um presente ganha peso com reconhecimento verbal, e uma frase ganha corpo quando há um símbolo que a sustenta.",
    tensaoComum: "Você recebe presentes sem palavras e sente que falta algo, ou ouve elogios sem nunca receber um gesto concreto.",
    alavancaRelacional: "Combinem um bilhete escrito à mão com um mimo simples: as duas maneiras no mesmo gesto.",
  },
  "palavras+servicos": {
    dinamicaRelacional:
      "Ações concretas ganham significado quando são notadas e agradecidas. Servir sem reconhecimento magoa. Palavras sem ação podem soar incompletas.",
    tensaoComum: "A outra pessoa faz muito, mas raramente ouve \"obrigado\". Ou elogia sem colocar a mão na massa.",
    alavancaRelacional: "Quem serve pode dizer o que fez. Quem precisa de palavras pode agradecer com um exemplo específico.",
  },
  "palavras+toque": {
    dinamicaRelacional:
      "Afirmação verbal e carinho físico caminham bem juntos. Silêncio frio ou toque sem gentileza nas palavras cria distância desnecessária.",
    tensaoComum: "Você quer ouvir e receber proximidade. A outra pessoa oferece só um dos dois.",
    alavancaRelacional: "Aproximem-se com ternura e digam, com clareza, o que valorizam um no outro.",
  },
  "tempo+presentes": {
    dinamicaRelacional:
      "Você valoriza estar junto e ser lembrado. Ausência em datas importantes pesa. Presente sem tempo pode parecer compensação.",
    tensaoComum: "Ganha algo especial, mas a pessoa não está disponível. Ou há presença, mas nunca um gesto simbólico.",
    alavancaRelacional: "Presenteiem com uma experiência a dois: objeto ou momento que peça presença compartilhada.",
  },
  "tempo+servicos": {
    dinamicaRelacional:
      "Tempo focado e ajuda prática formam o mesmo pacote: \"não estou sozinho nesta vida\". Um sem o outro pode parecer incompleto.",
    tensaoComum: "A outra pessoa resolve tudo, mas nunca para para ouvir. Ou conversa muito sem ajudar no prático.",
    alavancaRelacional: "Façam uma tarefa juntos, com atenção mútua, não só em paralelo.",
  },
  "tempo+toque": {
    dinamicaRelacional:
      "Estar perto com atenção e com o corpo. Conversa de qualidade e proximidade física caminham lado a lado.",
    tensaoComum: "Conversam muito sem carinho físico, ou há toque, mas a mente está longe.",
    alavancaRelacional: "Reservem conversa de qualidade e encerrem com proximidade consentida, presença total.",
  },
  "presentes+servicos": {
    dinamicaRelacional:
      "Cuidado material e cuidado prático. Gestos e tarefas mostram investimento no bem-estar. Você lê amor pelo que alivia a vida.",
    tensaoComum: "Recebe presentes, mas continua sobrecarregado. Ou tem ajuda, mas nunca um símbolo de carinho.",
    alavancaRelacional: "Escolham um presente prático que poupe tempo: algo que resolve e emociona ao mesmo tempo.",
  },
  "presentes+toque": {
    dinamicaRelacional:
      "Símbolos e proximidade. Em crises, presença física pesa muito. O gesto tangível marca a memória do cuidado.",
    tensaoComum: "Ganha presentes, mas sente pouca proximidade corporal. Ou há carinho físico, mas nunca lembrança simbólica.",
    alavancaRelacional: "Em momento difícil, priorizem a proximidade. Depois, deixem um bilhete ou mimo para a pessoa encontrar.",
  },
  "servicos+toque": {
    dinamicaRelacional:
      "Servir e tocar: o amor entra pela vida diária e pelo corpo. Ajuda sem afeto pode parecer fria. Toque sem parceria prática pode parecer incompleto.",
    tensaoComum: "A outra pessoa faz as tarefas certas, mas raramente abraça. Ou há carinho físico, mas a sobrecarga continua.",
    alavancaRelacional: "Ajudem em algo prático e finalizem com um gesto afetuoso consentido.",
  },
};

export const TOM_VEREDITO: Record<IntensidadePerfil, string> = {
  forte: "Suas respostas apontam com clareza para uma maneira principal de receber afeto",
  moderada: "Suas respostas destacam uma maneira principal de receber afeto, com outra também presente",
  equilibrada: "Suas respostas mostram duas maneiras de receber afeto com intensidades próximas. Isso é riqueza, não indecisão",
};

export const ESPELHO_EXPRESSAR: Record<LinguagemAmor, string> = {
  palavras:
    "Você costuma demonstrar amor falando: elogia, agradece e encoraja. Isso é uma forma genuína de cuidar. Pode ser diferente da forma como você prefere receber.",
  tempo:
    "Você costuma demonstrar amor reservando tempo e atenção. Essa presença é um cuidado real. Pode ser diferente da forma como você prefere receber.",
  presentes:
    "Você costuma demonstrar amor com gestos tangíveis e surpresas. Esses símbolos são consideração. Pode ser diferente da forma como você prefere receber.",
  servicos:
    "Você costuma demonstrar amor na prática: resolve, antecipa e coloca a mão na massa. Essa ajuda é cuidado concreto. Pode ser diferente da forma como você prefere receber.",
  toque:
    "Você costuma demonstrar amor com proximidade física consentida. Esse contato comunica presença. Pode ser diferente da forma como você prefere receber.",
};

export const PONTE_COMUNICACAO =
  "Para conversar sobre isso, você pode usar estas três frases: (1) \"Eu aprendi que me sinto amado quando...\" (2) \"Eu sei que você mostra amor de outro jeito, e isso também importa.\" (3) \"Você toparia tentar este gesto comigo?\". Sem culpa. Com curiosidade.";

function chavePar(a: LinguagemAmor, b: LinguagemAmor): string {
  return a < b ? `${a}+${b}` : `${b}+${a}`;
}

export function dinamicaPar(principal: LinguagemAmor, secundaria: LinguagemAmor): DinamicaPar {
  const direto = DINAMICA_PAR[chavePar(principal, secundaria)];
  if (direto) return direto;
  return {
    dinamicaRelacional: `Você combina ${principal} com ${secundaria} de formas que se complementam. Relacionamentos cuidam melhor quando alimentam as maneiras que mais te alcançam.`,
    tensaoComum: "Às vezes você não sabe qual das duas maneiras pedir primeiro.",
    alavancaRelacional: "Alterne gestos nas duas maneiras ao longo dos dias e observe o que mais te alcança.",
  };
}
