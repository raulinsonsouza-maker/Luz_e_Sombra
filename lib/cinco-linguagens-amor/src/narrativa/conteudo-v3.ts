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

export const CONTEUDO_V3: Record<LinguagemAmor, ConteudoLinguagemV3> = {
  palavras: {
    mecanismoEmocional:
      "Seu sistema emocional traduz palavras em segurança. Quando alguém nomeia o que vê em você — com verdade, sem ironia — o cérebro registra pertencimento. Não é vaidade: é a necessidade de saber que sua presença importa e foi notada.",
    cenasCotidiano: [
      "Você fez algo difícil e ouviu um \"obrigado, vi o esforço que você fez\" — na hora sentiu que valia a pena.",
      "Em uma briga, uma frase dura ficou ecoando por dias, mesmo depois de tudo ter sido resolvido.",
      "Recebeu uma mensagem simples de carinho no meio de um dia pesado e guardou no coração como quem guarda um talismã.",
    ],
    feridaPadrao:
      "Quando as palavras somem ou viram crítica, você não explode de imediato — primeiro duvida de si. O silêncio frio, o sarcasmo ou o \"não foi nada\" acumulam uma ferida silenciosa: a sensação de que seu coração não está sendo lido.",
    sinalDeAlerta: "Você fica mais defensivo(a) ou mais quieto(a) do que o normal, esperando que o outro perceba sem você pedir.",
    comoInterpretarAnti:
      "Presentes e gestos práticos te agradam, mas não substituem o que você mais precisa ouvir. Quando alguém te ama só por ações ou objetos, pode parecer que você é ingrato(a) — mas o que falta não é gratidão, é afirmação verbal.",
    cartaParaParceiro:
      "Quando você diz o que aprecia em mim — com exemplo real, sem ironia — eu sinto que estamos conectados de verdade. Não precisa ser poesia; preciso ouvir que você me vê e que acredita em mim. Críticas pesam mais para mim do que você imagina, então, quando precisar corrigir, faça com gentileza e especificidade.",
    planoSeteDias: [
      "Escreva três frases que gostaria de ouvir e compartilhe com quem te ama.",
      "Elogie algo concreto que a outra pessoa fez hoje, sem exagero.",
      "Quando pedir algo, formule como pedido, não como cobrança.",
      "Envie uma mensagem de gratidão por algo pequeno que passou despercebido.",
      "Evite sarcasmo o dia inteiro — note como o clima muda.",
      "Peça feedback com uma pergunta aberta: \"O que você mais valorizou em mim esta semana?\"",
      "Antes de dormir, diga em voz alta algo que admira na pessoa amada.",
    ],
  },
  tempo: {
    mecanismoEmocional:
      "Seu sistema emocional registra atenção como segurança. Não basta morar na mesma casa: distração, pressa e \"depois a gente conversa\" acumulam abandono silencioso — mesmo quando o outro jura que te ama.",
    cenasCotidiano: [
      "Você contou algo importante e viu o olhar do outro desviar para a tela — na hora sentiu que tinha perdido a vez.",
      "Marcaram um jantar e, por uma hora, ninguém levantou por obrigação. Você lembra desse dia mais do que de qualquer declaração.",
      "Quando estão no sofá em silêncio, mas próximos, você sente mais amor do que em festas cheias de elogios públicos.",
    ],
    feridaPadrao:
      "Quando o tempo de qualidade some por semanas, você não explode — você se fecha. Fica mais frio(a), mais lógico(a), como se estivesse testando se ainda importa. O outro pode interpretar como indiferença, mas é o oposto: é o jeito que seu corpo avisa que o vínculo está ficando superficial.",
    sinalDeAlerta: "Você começa a ocupar-se demais com trabalho, telas ou tarefas para não sentir a distância.",
    comoInterpretarAnti:
      "Presentes bonitos te agradam, mas não enchem seu coração se vierem no lugar da presença. Quando alguém te ama só por objetos, você pode parecer difícil — mas o que falta não é gratidão, é tempo dedicado.",
    cartaParaParceiro:
      "Quando você coloca o celular de lado e me pergunta como foi meu dia — de verdade — eu sinto que estamos bem, mesmo se o mundo lá fora estiver difícil. Não precisa de discurso perfeito; preciso sentir que você escolheu aquele momento comigo. Se estiver ocupado(a), prefiro que diga \"hoje não consigo\" do que ficar ao meu lado ausente.",
    planoSeteDias: [
      "Marque 20 minutos só para conversar, sem telas — trate como compromisso.",
      "Na próxima conversa difícil, ouça até o fim antes de sugerir soluções.",
      "Proponha uma atividade pequena que a outra pessoa goste, mesmo que não seja sua favorita.",
      "Ao chegar em casa, pause cinco minutos antes de se isolar em tarefas.",
      "Desligue notificações durante o jantar ou café juntos.",
      "Pergunte: \"Tem algo que você queria me contar e não teve espaço?\"",
      "Planeje um passeio simples só a dois, sem pressa de voltar.",
    ],
  },
  presentes: {
    mecanismoEmocional:
      "Seu sistema emocional lê símbolos como prova de lembrança. Um gesto tangível diz \"pensei em você quando você não estava aqui\" — e isso confirma que você ocupa espaço na mente de quem ama.",
    cenasCotidiano: [
      "Recebeu algo simples que mostrava que a pessoa lembrava de um detalhe que você mencionou — e ficou emocionado(a) por dias.",
      "Em uma data importante, a ausência de qualquer gesto doeu mais do que a briga em si.",
      "Guarda lembranças físicas de momentos bons e volta a elas quando precisa sentir vínculo.",
    ],
    feridaPadrao:
      "Quando datas passam em branco ou presentes chegam sem intenção, você interpreta como descaso — não por materialismo, mas porque o símbolo representa prioridade. A ferida não é \"não ganhei nada\"; é \"não fui lembrado(a)\".",
    sinalDeAlerta: "Você para de mencionar o que gostaria de receber ou comemorar, para não parecer exigente.",
    comoInterpretarAnti:
      "Palavras bonitas te aquecem, mas sem gesto tangível podem soar vazias. Quando alguém só declara amor sem nunca materializar cuidado, você pode parecer frio(a) — mas o que falta é prova visível de lembrança.",
    cartaParaParceiro:
      "Quando você me surpreende com algo — mesmo pequeno — que mostra que prestou atenção ao que eu disse, eu sinto que importo. Não precisa ser caro; precisa ser pensado. Em momentos difíceis, sua presença física vale mais que qualquer objeto, mas não esqueça que gestos simbólicos me lembram que você está comigo.",
    planoSeteDias: [
      "Liste três coisas que já te emocionaram receber e compartilhe com quem te ama.",
      "Ofereça algo simbólico esta semana, mesmo modesto, com intenção clara.",
      "Anote uma data que importa para você e comunique com antecedência.",
      "Guarde uma lembrança de um momento bom e conte a história para quem ama.",
      "Faça um cartão ou bilhete escrito à mão para alguém especial.",
      "Quando não puder estar presente, explique e combine outra forma de apoio.",
      "Surpreenda com algo que a pessoa mencionou casualmente nos últimos dias.",
    ],
  },
  servicos: {
    mecanismoEmocional:
      "Seu sistema emocional traduz ação em comprometimento. Quando alguém alivia sua carga sem ser cobrado, o corpo relaxa — porque entende que não está sozinho(a) na vida prática, que o amor desce do discurso para a rotina.",
    cenasCotidiano: [
      "Chegou em casa exausto(a) e viu que alguém resolveu algo que você vinha adiando — sentiu alívio profundo.",
      "Pediu ajuda e recebeu com ressentimento; o gesto perdeu todo o significado.",
      "Notou que alguém antecipou uma necessidade sua antes de você pedir — e isso valeu mais que qualquer elogio.",
    ],
    feridaPadrao:
      "Quando promessas não viram ação, ou ajuda vem com cobrança, você sente que virou funcionário(a) emocional, não parceiro(a). A ferida é sentir que seu valor depende do que você produz, não de quem você é.",
    sinalDeAlerta: "Você assume mais tarefas em silêncio e depois explode por coisas pequenas.",
    comoInterpretarAnti:
      "Palavras de carinho te aquecem, mas sem ação prática podem soar como promessa vazia. Quando alguém só fala e nunca faz, você pode parecer exigente — mas o que falta é parceria concreta.",
    cartaParaParceiro:
      "Quando você coloca a mão na massa — sem reclamar, sem cobrar retorno — eu sinto que estamos no mesmo time. Pergunte \"em que posso ajudar?\" e execute com boa vontade. Para mim, amor é menos discurso e mais vida compartilhada. Um \"obrigado\" depois da ajuda também importa muito.",
    planoSeteDias: [
      "Liste três tarefas que mais te aliviam quando alguém as faz.",
      "Faça esta semana uma coisa prática pela pessoa amada sem esperar retorno.",
      "Quando pedir ajuda, especifique o que realmente importa.",
      "Agradeça um serviço pequeno que costuma passar despercebido.",
      "Antecipe uma necessidade da pessoa amada antes de ela pedir.",
      "Evite prometer o que não vai cumprir — combine prazos realistas.",
      "Divida uma tarefa chata e faça junto, não só delegue.",
    ],
  },
  toque: {
    mecanismoEmocional:
      "Seu sistema emocional registra proximidade física como pertencimento. O corpo entende amor antes da mente — um abraço, uma mão dada, um ombro encostado comunicam \"estou aqui\" de um jeito que palavras demoram para alcançar.",
    cenasCotidiano: [
      "Em um dia difícil, um abraço longo acalmou mais do que qualquer conselho.",
      "Sentiu distância física prolongada no relacionamento e interpretou como rejeição, mesmo sem briga.",
      "Um toque breve ao passar — mão no ombro, encostar-se no sofá — mudou seu humor inteiro.",
    ],
    feridaPadrao:
      "Quando o toque desaparece ou vira apenas utilitário, você sente rejeição corporal — uma das formas mais profundas de abandono. A ferida não é \"falta de sexo\"; é falta de presença física afetuosa no cotidiano.",
    sinalDeAlerta: "Você busca contato físico com amigos ou família para compensar a distância no relacionamento principal.",
    comoInterpretarAnti:
      "Presentes e palavras te agradam, mas sem carinho físico o vínculo parece distante. Quando alguém te ama só por gestos intelectuais ou materiais, você pode parecer \"frio(a)\" — mas o que falta é proximidade corporal segura.",
    cartaParaParceiro:
      "Quando você me abraça sem pressa, ou segura minha mão em silêncio, eu sinto que pertenço. Em dias difíceis, seu toque vale mais que um sermão. Pergunte o que é confortável para mim — não assuma. Pequenos gestos frequentes importam mais do que grandes demonstrações raras.",
    planoSeteDias: [
      "Combine com quem te ama quais tipos de toque te confortam.",
      "Inicie um gesto afetuoso pequeno por dia — abraço de chegada, por exemplo.",
      "Em stress, peça abraço em vez de esperar que adivinhem.",
      "Durante uma conversa difícil, mantenha contato físico leve se ambos concordarem.",
      "Crie um ritual de despedida com carinho físico.",
      "Observe se você está retraindo toque por medo de rejeição — comunique isso.",
      "Antes de dormir, compartilhe um momento de proximidade sem telas.",
    ],
  },
};

export const DINAMICA_PAR: Partial<Record<string, DinamicaPar>> = {
  "palavras+tempo": {
    dinamicaRelacional:
      "Você precisa de presença e de ouvir que essa presença importa. Tempo sem palavras deixa dúvida; palavras sem tempo soam como roteiro. O casal que funciona melhor com você aprende a dizer \"eu escolhi estar aqui\" enquanto de fato está.",
    tensaoComum: "Você pede atenção e o outro oferece declarações rápidas antes de realmente parar.",
    alavancaRelacional: "Reserve vinte minutos sem telas e comece dizendo uma coisa que admira na pessoa — depois ouça.",
  },
  "palavras+presentes": {
    dinamicaRelacional:
      "Gestos tangíveis e palavras calorosas se reforçam. Um presente ganha peso quando vem acompanhado de reconhecimento verbal — e uma frase bonita ganha corpo quando há símbolo que a sustenta.",
    tensaoComum: "Você recebe presentes sem palavras e sente que falta alma; ou ouve elogios sem nunca ganhar gesto concreto.",
    alavancaRelacional: "Combine cartão escrito à mão com um mimo simples — as duas linguagens num só gesto.",
  },
  "palavras+servicos": {
    dinamicaRelacional:
      "Ações concretas ganham significado quando são notadas e agradecidas. Para você, servir sem reconhecimento magoa duas vezes — e palavras sem ação soam vazias.",
    tensaoComum: "O outro faz muito por você mas nunca ouve \"obrigado\"; ou elogia sem nunca colocar a mão na massa.",
    alavancaRelacional: "Quem serve: diga em voz alta o que fez. Quem precisa de palavras: agradeça com exemplo específico.",
  },
  "palavras+toque": {
    dinamicaRelacional:
      "Afirmação verbal e carinho físico são seu par ideal. Silêncio frio ou toque sem gentileza nas palavras cria distância que nenhum dos dois entende direito.",
    tensaoComum: "Você quer ouvir \"te amo\" e receber abraço; o outro oferece só um dos dois.",
    alavancaRelacional: "Abrace antes de falar — ou fale com ternura enquanto se aproxima fisicamente.",
  },
  "tempo+presentes": {
    dinamicaRelacional:
      "Presença e símbolos: você quer estar junto e ser lembrado. Ausência em datas importantes pesa muito; presente sem tempo parece compensação.",
    tensaoComum: "Ganha algo caro mas a pessoa não está disponível; ou passa tempo junto mas nunca há gesto simbólico.",
    alavancaRelacional: "Presenteie com experiência a dois — objeto ou momento que exija presença compartilhada.",
  },
  "tempo+servicos": {
    dinamicaRelacional:
      "Tempo focado em você e ajuda prática formam o mesmo pacote: \"não estou sozinho(a) nesta vida\". Um sem o outro parece incompleto.",
    tensaoComum: "O outro resolve tudo mas nunca para para ouvir; ou fica horas conversando sem ajudar em nada prático.",
    alavancaRelacional: "Façam uma tarefa juntos — lavar louça, organizar algo — com atenção mútua, não em paralelo distante.",
  },
  "tempo+toque": {
    dinamicaRelacional:
      "Estar perto com corpo e atenção. Conversa de qualidade e abraço caminham lado a lado — silêncio confortável com proximidade física é seu paraíso.",
    tensaoComum: "Conversam muito mas sem carinho físico; ou há toque mas a mente está longe.",
    alavancaRelacional: "Conversa de qualidade terminando com abraço demorado — presença total, corpo e mente.",
  },
  "presentes+servicos": {
    dinamicaRelacional:
      "Cuidado material e cuidado prático. Gestos e tarefas mostram investimento no seu bem-estar — você lê amor pelo que alivia sua vida.",
    tensaoComum: "Recebe presentes mas continua sobrecarregado(a); ou tem ajuda mas nunca símbolo de carinho.",
    alavancaRelacional: "Presente prático que poupa tempo — algo que resolve e emociona ao mesmo tempo.",
  },
  "presentes+toque": {
    dinamicaRelacional:
      "Símbolos e proximidade. Em crises, presença física pesa mais do que qualquer objeto — mas o gesto tangível marca a memória.",
    tensaoComum: "Ganha presentes mas sente frieza corporal; ou há carinho físico mas nunca lembrança simbólica.",
    alavancaRelacional: "Em momento difícil, abrace primeiro; depois deixe um bilhete ou mimo que a pessoa encontre.",
  },
  "servicos+toque": {
    dinamicaRelacional:
      "Servir e tocar: amor entra pela vida diária e pelo corpo. Ajuda fria, sem afeto, não chega — e toque sem parceria prática parece superficial.",
    tensaoComum: "O outro faz tudo certo nas tarefas mas nunca abraça; ou há carinho físico mas você continua sobrecarregado(a).",
    alavancaRelacional: "Ajude em algo prático e finalize com gesto afetuoso — ação e corpo no mesmo momento.",
  },
};

export const TOM_VEREDITO: Record<IntensidadePerfil, string> = {
  forte: "Seu perfil aponta com clareza para uma linguagem dominante",
  moderada: "Sua linguagem principal se destaca, com uma segunda força importante",
  equilibrada: "Você oscila entre duas linguagens com força parecida — isso é um perfil bilíngue, não indecisão",
};

export const ESPELHO_EXPRESSAR: Record<LinguagemAmor, string> = {
  palavras: "Você costuma demonstrar amor falando: elogia, agradece, encoraja. Quem te ama pode achar que palavras bastam — mas você precisa receber de outras formas também.",
  tempo: "Você demonstra amor reservando tempo e atenção. Pode frustrar-se quando o outro não faz o mesmo, mesmo oferecendo presença de sobra.",
  presentes: "Você demonstra amor com gestos tangíveis e surpresas. Pode esperar que o outro leia seus símbolos sem explicar o que precisa receber.",
  servicos: "Você demonstra amor na prática — resolve, antecipa, coloca a mão na massa. Pode sentir que faz mais do que recebe em ações concretas.",
  toque: "Você demonstra amor com proximidade física. Pode não perceber que o outro precisa de palavras ou tempo, não só abraços.",
};

export const PONTE_COMUNICACAO =
  "Use estas três frases como roteiro: (1) \"Eu aprendi que me sinto amado(a) quando...\" (2) \"Eu sei que você mostra amor de outro jeito, e isso também importa.\" (3) \"Você toparia tentar [gesto concreto] esta semana?\" — sem culpa, com curiosidade.";

function chavePar(a: LinguagemAmor, b: LinguagemAmor): string {
  return a < b ? `${a}+${b}` : `${b}+${a}`;
}

export function dinamicaPar(principal: LinguagemAmor, secundaria: LinguagemAmor): DinamicaPar {
  const direto = DINAMICA_PAR[chavePar(principal, secundaria)];
  if (direto) return direto;
  return {
    dinamicaRelacional: `Você combina ${principal} com ${secundaria} de formas que se complementam. Relações duradouras alimentam as duas pontuações mais altas.`,
    tensaoComum: "Às vezes você não sabe qual das duas linguagens pedir primeiro.",
    alavancaRelacional: "Alterne gestos nas duas linguagens ao longo da semana e observe o que mais enche.",
  };
}
