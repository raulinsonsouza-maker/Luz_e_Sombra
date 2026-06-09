import type { LinguagemAmor } from "../types.js";

export interface ConteudoLinguagem {
  essencia: string;
  comoSeSenteAmado: string;
  comoExpressa: string;
  dialetos: string[];
  oQueMagoa: string;
  acoesPraticas: string[];
  dicaParaParceiro: string;
}

export const CONTEUDO_LINGUAGEM: Record<LinguagemAmor, ConteudoLinguagem> = {
  palavras: {
    essencia:
      "Para você, o amor fala alto quando chega em palavras: reconhecimento, gratidão, encorajamento e ternura. Não precisa ser poesia, precisa ser verdade e consistência.",
    comoSeSenteAmado:
      "Elogios específicos, um obrigado que nota o que você fez, frases que validam quem você é. Quando alguém diz que acredita em você, seu tanque emocional enche.",
    comoExpressa:
      "Você costuma demonstrar amor com palavras: elogios, agradecimentos, encorajamento e validação verbal. Fala o que sente e reconhece o outro em voz alta.",
    dialetos: [
      "Elogio direto sobre quem você é ou o que fez bem",
      "Encorajamento quando você está inseguro(a)",
      "Tom gentil mesmo em conversas difíceis",
      "Pedidos em vez de ordens ou sarcasmo",
      "Palavras escritas ou ditas sobre você na sua ausência",
    ],
    oQueMagoa:
      "Críticas constantes, sarcasmo, silêncio frio ou palavras duras em público. Quando o que você mais precisa é afirmação e recebe julgamento, sente que o amor evaporou.",
    acoesPraticas: [
      "Anote três frases de afirmação que gostaria de ouvir e compartilhe com quem te ama",
      "Elogie algo concreto que a outra pessoa fez hoje, sem ironia",
      "Quando pedir algo, formule como pedido e não como cobrança",
      "Evite trazer erros antigos para conversas de hoje depois de pedir perdão",
    ],
    dicaParaParceiro:
      "Diga o que aprecia com exemplos reais. Um elogio sincero por semana já muda o clima. Críticas pesam mais para você do que para muitas pessoas.",
  },
  tempo: {
    essencia:
      "Para você, amor é presença com atenção. Não basta estar no mesmo espaço: importa estar disponível, olhar nos olhos e viver momentos juntos sem distrações.",
    comoSeSenteAmado:
      "Conversas sem celular, passeios só a dois, ouvir sem correr para dar soluções, atividades compartilhadas onde a outra pessoa escolhe estar com você de verdade.",
    comoExpressa:
      "Você demonstra amor reservando tempo, criando rituais a dois e dando atenção plena. Prefere estar presente de corpo e mente do que só mandar mensagens.",
    dialetos: [
      "Conversa de qualidade: ouvir sentimentos antes de aconselhar",
      "Atividades em conjunto, mesmo que simples",
      "Rituais de chegada: contar o dia sentados um em frente ao outro",
      "Tempo dedicado aos filhos ou projetos em comum, com foco na pessoa",
      "Silêncio confortável quando ambos estão presentes",
    ],
    oQueMagoa:
      "Telas enquanto você fala, adiar conversas para sempre, planejar tudo menos tempo a dois. Sentir que trabalho, amigos ou hábitos vêm sempre antes de você.",
    acoesPraticas: [
      "Marque duas janelas por semana de 20 minutos só para conversar, sem telas",
      "Na próxima conversa difícil, ouça até o fim antes de sugerir o que fazer",
      "Proponha uma atividade pequena que a outra pessoa goste, mesmo que não seja sua favorita",
      "Ao chegar em casa, pause cinco minutos antes de se isolar em tarefas",
    ],
    dicaParaParceiro:
      "Agende tempo com você como se fosse compromisso. Desligue distrações. Muitas vezes você não quer conselhos, quer sentir que está sendo ouvido(a) e acompanhado(a).",
  },
  presentes: {
    essencia:
      "Para você, amor deixa rastro visível: um gesto, um símbolo, uma lembrança que diz \"pensei em você\". O valor emocional importa mais do que o preço.",
    comoSeSenteAmado:
      "Surpresas pensadas, algo que mostra que te conhecem, presença física em momentos importantes. Um presente diz: \"não te esqueci\".",
    comoExpressa:
      "Você demonstra amor com gestos tangíveis: presentes, lembranças, símbolos e surpresas que mostram atenção aos detalhes da vida do outro.",
    dialetos: [
      "Presentes comprados, feitos à mão ou encontrados no caminho",
      "Cartões ou bilhetes com palavras simples",
      "Presença no hospital, no funeral, no primeiro dia difícil",
      "Lembranças que duram e ficam à vista",
      "Pequenos mimos no dia a dia, não só em datas oficiais",
    ],
    oQueMagoa:
      "Esquecer datas que importam, ausência em crises, presentes claramente sem pensamento. Sentir que não é prioridade quando mais precisa.",
    acoesPraticas: [
      "Faça uma lista do que já te emocionou receber e compartilhe com quem te ama",
      "Ofereça algo simbólico esta semana, mesmo modesto, com intenção clara",
      "Quando não puder estar presente, explique e combine outra forma de apoio",
      "Guarde lembranças de momentos bons e volte a elas em conversas",
    ],
    dicaParaParceiro:
      "Surpreenda com gestos que mostrem que você viu. Em momentos difíceis, sua presença vale mais do que qualquer objeto. Consistência importa mais do que extravagância.",
  },
  servicos: {
    essencia:
      "Para você, amor aparece em ações: aliviar carga, resolver o que pesa, fazer sem precisar ser lembrado. Servir com boa vontade comunica \"estou com você na vida real\".",
    comoSeSenteAmado:
      "Quando alguém tira trabalho das suas mãos, antecipa necessidades ou ajuda sem reclamar. Pequenas tarefas feitas com cuidado falam mais alto do que discursos.",
    comoExpressa:
      "Você demonstra amor na prática: resolve, organiza, antecipa e coloca a mão na massa. Para você, cuidar é fazer o que alivia a vida do outro.",
    dialetos: [
      "Tarefas domésticas ou logísticas que pouparam seu tempo",
      "Apoio prático em projetos, saúde ou filhos",
      "Assumir algo que você estava adiando",
      "Serviço feito com atitude positiva, não por culpa",
      "Pedidos atendidos com liberdade, não por medo",
    ],
    oQueMagoa:
      "Cobranças, críticas ao que não foi feito, promessas vazias ou ajuda com ressentimento. Sentir que serve de capacho, não de parceiro(a) amado(a).",
    acoesPraticas: [
      "Liste três tarefas que mais te aliviam quando alguém as faz e comunique com pedido, não exigência",
      "Faça esta semana uma coisa prática pela pessoa amada sem esperar retorno imediato",
      "Quando pedir ajuda, especifique o que realmente importa para você",
      "Agradeça serviços pequenos que costuma dar como garantidos",
    ],
    dicaParaParceiro:
      "Pergunte \"em que posso ajudar?\" e execute com boa vontade. Para você, amor é menos discurso e mais mãos postas na vida comum.",
  },
  toque: {
    essencia:
      "Para você, proximidade física segura é linguagem nativa: abraço, mão dada, carinho, presença corporal. O corpo recebe o que as palavras às vezes não chegam a dizer.",
    comoSeSenteAmado:
      "Contato afetuoso no dia a dia, abraço quando está mal, gestos de pertença em público e em privado. Intimidade física, quando há confiança, confirma vínculo.",
    comoExpressa:
      "Você demonstra amor com proximidade física: abraços, carinho, mãos dadas e presença corporal. O toque é sua forma natural de dizer \"estou aqui\".",
    dialetos: [
      "Abraços e beijos de chegada e despedida",
      "Mão na cintura, ombro ou costas em momentos calmos",
      "Carinho em crises, mesmo sem muitas palavras",
      "Proximidade no sofá ou na cama com presença real",
      "Toques breves ao passar que dizem \"estou aqui\"",
    ],
    oQueMagoa:
      "Rejeição física prolongada, distância fria, violência ou toque apenas utilitário. Em momentos de dor, ausência de abraço esvazia o tanque rapidamente.",
    acoesPraticas: [
      "Combine com quem te ama quais tipos de toque te confortam e quais evitar",
      "Inicie um gesto afetuoso pequeno por dia se isso não for natural para você",
      "Em stress, peça abraço em vez de esperar que adivinhem",
      "Separe necessidade física de necessidade emocional: ambas importam",
    ],
    dicaParaParceiro:
      "Toque com respeito e frequência. Em dias difíceis, um abraço pode valer mais do que um sermão. Pergunte o que é confortável, não assuma.",
  },
};

export const COMBINACAO_PAR: Partial<Record<string, string>> = {
  "palavras+tempo":
    "Você precisa ouvir que é amado(a) e sentir isso em tempo compartilhado. Palavras sem presença soam vazias; presença sem palavras deixa dúvida.",
  "palavras+presentes":
    "Gestos tangíveis e palavras calorosas se reforçam. Um presente ganha peso quando vem acompanhado de reconhecimento verbal.",
  "palavras+servicos":
    "Ações concretas ganham significado quando são notadas e agradecidas. Criticar o serviço magoa duas vezes.",
  "palavras+toque":
    "Afirmação verbal e carinho físico são seu par ideal. Silêncio frio ou toque sem gentileza nas palavras cria distância.",
  "tempo+presentes":
    "Presença e símbolos: você quer estar junto e lembrar momentos. Ausência em datas importantes pesa muito.",
  "tempo+servicos":
    "Tempo focado em você e ajuda prática formam o mesmo pacote: \"não estou sozinho(a) nesta vida\".",
  "tempo+toque":
    "Estar perto com corpo e atenção. Conversa de qualidade e abraço caminham lado a lado.",
  "presentes+servicos":
    "Cuidado material e cuidado prático. Gestos e tarefas mostram investimento no seu bem-estar.",
  "presentes+toque":
    "Símbolos e proximidade. Em crises, presença física pesa mais do que qualquer objeto.",
  "servicos+toque":
    "Servir e tocar: amor entra pela vida diária e pelo corpo. Ajuda fria, sem afeto, não chega.",
};

export const PONTE_COMPATIBILIDADE: Partial<Record<string, string>> = {
  "palavras+palavras": "Troquem elogios específicos toda semana, vocês dois falam essa língua.",
  "palavras+tempo": "Quem precisa de palavras: reserve 20 minutos sem telas antes de conversar.",
  "palavras+presentes": "Combine presente simbólico com cartão escrito à mão.",
  "palavras+servicos": "Quem serve: diga em voz alta o que fez e peça reconhecimento, não só silêncio.",
  "palavras+toque": "Quem toca: abrace antes de falar; quem precisa de palavras: diga o que sente em voz alta.",
  "tempo+tempo": "Criem um ritual semanal só de vocês, passeio, café ou conversa longa.",
  "tempo+presentes": "Presenteie com experiência a dois, não só objeto.",
  "tempo+servicos": "Ajude nas tarefas e fique junto enquanto faz, presença + ação.",
  "tempo+toque": "Conversa de qualidade terminando com abraço ou carinho.",
  "presentes+presentes": "Surpresas pequenas e frequentes valem mais que extravagância rara.",
  "presentes+servicos": "Presente prático que poupa tempo da pessoa.",
  "presentes+toque": "Em momentos difíceis, presença física antes de qualquer objeto.",
  "servicos+servicos": "Dividam tarefas com gratidão explícita, vocês valorizam ação.",
  "servicos+toque": "Ajude e finalize com gesto afetuoso, serviço frio não basta.",
  "toque+toque": "Rituais de chegada com abraço; proximidade diária mantém o vínculo.",
};
