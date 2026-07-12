import type { ParForcado } from "../types.js";

/** Bloco principal v3 — como você se sente amado(a). Matriz balanceada: 8 aparições por linguagem. */
export const CODIGOS_RECEBER = [
  "R01", "R02", "R03", "R04", "R05", "R06", "R07", "R08", "R09", "R10",
  "R11", "R12", "R13", "R14", "R15", "R16", "R17", "R18", "R19", "R20",
] as const;

export type CodigoReceber = (typeof CODIGOS_RECEBER)[number];

export const PARES_RECEBER: ParForcado[] = [
  { id: "R01", bloco: "receber", textoA: "Sinto-me amado(a) quando ouço elogios sinceros e palavras de carinho.", textoB: "Sinto-me amado(a) quando passo tempo a sós com quem amo.", linguagemA: "palavras", linguagemB: "tempo" },
  { id: "R02", bloco: "receber", textoA: "Gosto quando ganho presentes que mostram que pensaram em mim.", textoB: "Sei que sou amado(a) quando alguém faz coisas para me ajudar sem eu pedir.", linguagemA: "presentes", linguagemB: "servicos" },
  { id: "R03", bloco: "receber", textoA: "Um abraço firme me faz sentir seguro(a) e amado(a).", textoB: "Ouvir \"tenho orgulho de você\" ou \"eu te admiro\" me fortalece por dentro.", linguagemA: "toque", linguagemB: "palavras" },
  { id: "R04", bloco: "receber", textoA: "Conversar sem pressa, só nós dois, é quando mais me sinto amado(a).", textoB: "Receber algo simbólico — mesmo pequeno — mostra que não fui esquecido(a).", linguagemA: "tempo", linguagemB: "presentes" },
  { id: "R05", bloco: "receber", textoA: "Quando alguém resolve algo prático por mim, sinto que me ama de verdade.", textoB: "Carinho físico — um abraço, uma mão na minha — fala mais alto que discursos.", linguagemA: "servicos", linguagemB: "toque" },
  { id: "R06", bloco: "receber", textoA: "Mensagens carinhosas ou notas escritas marcam meu dia.", textoB: "Flores, um mimo ou qualquer gesto que diga \"pensei em você\" me emociona.", linguagemA: "palavras", linguagemB: "presentes" },
  { id: "R07", bloco: "receber", textoA: "Reservar um momento na agenda só para mim me faz sentir prioridade.", textoB: "Quando alguém assume uma tarefa minha sem reclamar, meu coração relaxa.", linguagemA: "tempo", linguagemB: "servicos" },
  { id: "R08", bloco: "receber", textoA: "Um toque reconfortante quando estou ansioso(a) acalma mais que qualquer conselho.", textoB: "Surpresas simples, mesmo sem data especial, me deixam contente.", linguagemA: "toque", linguagemB: "presentes" },
  { id: "R09", bloco: "receber", textoA: "Ouvir \"você é importante para mim\" de forma genuína enche meu coração.", textoB: "Gosto de ficar de mãos dadas ou receber carinho leve no dia a dia.", linguagemA: "palavras", linguagemB: "toque" },
  { id: "R10", bloco: "receber", textoA: "Tempo de qualidade sem celular é o que mais me conecta com quem amo.", textoB: "Um elogio específico sobre algo que fiz bem me faz sentir visto(a).", linguagemA: "tempo", linguagemB: "palavras" },
  { id: "R11", bloco: "receber", textoA: "Presentes em datas importantes mostram que eu importo.", textoB: "Proximidade física ao acordar ou antes de dormir me faz sentir em casa.", linguagemA: "presentes", linguagemB: "toque" },
  { id: "R12", bloco: "receber", textoA: "Quando alguém alivia minha carga de tarefas, sinto amor na prática.", textoB: "Elogios e palavras de apoio frequentes me mantêm emocionalmente forte.", linguagemA: "servicos", linguagemB: "palavras" },
  { id: "R13", bloco: "receber", textoA: "Uma conversa profunda, olho no olho, é meu jeito favorito de sentir vínculo.", textoB: "Gestos de carinho físico em momentos difíceis me acolhem de verdade.", linguagemA: "tempo", linguagemB: "toque" },
  { id: "R14", bloco: "receber", textoA: "Um presente simbólico — nem precisa ser caro — aquece meu coração.", textoB: "Apoio contínuo nas coisas do dia a dia me faz sentir acompanhado(a).", linguagemA: "presentes", linguagemB: "servicos" },
  { id: "R15", bloco: "receber", textoA: "Quando alguém conserta ou resolve algo que me irritava, sinto cuidado real.", textoB: "Rituais nossos — um café, uma caminhada semanal — me fazem sentir amado(a).", linguagemA: "servicos", linguagemB: "tempo" },
  { id: "R16", bloco: "receber", textoA: "Palavras de encorajamento quando estou inseguro(a) mudam meu dia.", textoB: "Um presente surpresa, mesmo modesto, me mostra que fui lembrado(a).", linguagemA: "palavras", linguagemB: "presentes" },
  { id: "R17", bloco: "receber", textoA: "Estar junto fazendo algo simples, sem distrações, é amor para mim.", textoB: "Lembranças tangíveis de momentos bons me emocionam por muito tempo.", linguagemA: "tempo", linguagemB: "presentes" },
  { id: "R18", bloco: "receber", textoA: "Abraços e beijos de quem amo me fazem sentir pertencente.", textoB: "Quando alguém antecipa o que preciso e coloca a mão na massa, me sinto cuidado(a).", linguagemA: "toque", linguagemB: "servicos" },
  { id: "R19", bloco: "receber", textoA: "Ouvir que sou querido(a) e amado(a) com frequência me nutre por dentro.", textoB: "Ajuda prática nas tarefas e projetos me mostra comprometimento.", linguagemA: "palavras", linguagemB: "servicos" },
  { id: "R20", bloco: "receber", textoA: "Silêncio confortável ao lado de quem amo, com presença real, me basta.", textoB: "Carícias e proximidade física frequente me fazem sentir vivo(a) no relacionamento.", linguagemA: "tempo", linguagemB: "toque" },
];
