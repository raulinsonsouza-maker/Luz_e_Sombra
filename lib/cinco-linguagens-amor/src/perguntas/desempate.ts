import type { LinguagemAmor, ParForcado } from "../types.js";

export const CODIGOS_DESEMPATE = ["D01", "D02", "D03", "D04", "D05"] as const;
export type CodigoDesempate = (typeof CODIGOS_DESEMPATE)[number];

type ChavePar =
  | "palavras+tempo"
  | "palavras+presentes"
  | "palavras+servicos"
  | "palavras+toque"
  | "presentes+tempo"
  | "presentes+servicos"
  | "presentes+toque"
  | "servicos+tempo"
  | "servicos+toque"
  | "tempo+toque";

function chave(a: LinguagemAmor, b: LinguagemAmor): ChavePar {
  const k = a < b ? `${a}+${b}` : `${b}+${a}`;
  return k as ChavePar;
}

/** Pares de desempate por combinação de duas linguagens (até 3 por par). */
const POOL_DESEMPATE: Record<ChavePar, ParForcado[]> = {
  "palavras+tempo": [
    { id: "D01", bloco: "receber", textoA: "Prefiro ouvir \"eu te amo\" com sinceridade do que passar a tarde inteira junto em silêncio.", textoB: "Prefiro uma tarde inteira presente do que ouvir declarações sem atenção de verdade.", linguagemA: "palavras", linguagemB: "tempo" },
    { id: "D02", bloco: "receber", textoA: "Um elogio no momento certo vale mais que horas de companhia distraída.", textoB: "Companhia atenta vale mais que palavras bonitas ditas com pressa.", linguagemA: "palavras", linguagemB: "tempo" },
  ],
  "palavras+presentes": [
    { id: "D01", bloco: "receber", textoA: "Uma frase carinhosa escrita à mão me emociona mais que um objeto caro sem palavras.", textoB: "Um gesto tangível que mostra lembrança me emociona mais que elogios genéricos.", linguagemA: "palavras", linguagemB: "presentes" },
    { id: "D02", bloco: "receber", textoA: "Preciso ouvir que sou amado(a) para sentir que o presente veio do coração.", textoB: "O presente em si já diz tudo — não preciso de discurso para acreditar.", linguagemA: "palavras", linguagemB: "presentes" },
  ],
  "palavras+servicos": [
    { id: "D01", bloco: "receber", textoA: "Ouvir reconhecimento pelo que fiz me enche mais que alguém fazer por mim.", textoB: "Ver alguém agir por mim fala mais alto que qualquer elogio.", linguagemA: "palavras", linguagemB: "servicos" },
    { id: "D02", bloco: "receber", textoA: "Palavras de gratidão depois de uma ajuda são essenciais para mim.", textoB: "A ajuda em si já é a mensagem — palavras são complemento.", linguagemA: "palavras", linguagemB: "servicos" },
  ],
  "palavras+toque": [
    { id: "D01", bloco: "receber", textoA: "Dizer o que sente em voz alta é mais importante para mim que abraçar.", textoB: "Um abraço longo comunica mais que mil palavras bonitas.", linguagemA: "palavras", linguagemB: "toque" },
    { id: "D02", bloco: "receber", textoA: "Ouvir \"estou aqui por você\" me acalma mais que um carinho físico.", textoB: "O carinho físico me acalma mesmo quando ninguém sabe o que dizer.", linguagemA: "palavras", linguagemB: "toque" },
  ],
  "presentes+tempo": [
    { id: "D01", bloco: "receber", textoA: "Um presente pensado me marca mais que horas de conversa.", textoB: "Horas de presença real me marcam mais que qualquer objeto.", linguagemA: "presentes", linguagemB: "tempo" },
    { id: "D02", bloco: "receber", textoA: "Lembranças materiais ficam comigo e me lembram do amor.", textoB: "Memórias de momentos juntos ficam comigo e me lembram do amor.", linguagemA: "presentes", linguagemB: "tempo" },
  ],
  "servicos+tempo": [
    { id: "D01", bloco: "receber", textoA: "Alguém resolver algo por mim mostra amor mais que ficar conversando.", textoB: "Alguém parar tudo para estar comigo mostra amor mais que fazer tarefas.", linguagemA: "servicos", linguagemB: "tempo" },
    { id: "D02", bloco: "receber", textoA: "Ação prática é minha prova de amor favorita.", textoB: "Presença dedicada é minha prova de amor favorita.", linguagemA: "servicos", linguagemB: "tempo" },
  ],
  "presentes+servicos": [
    { id: "D01", bloco: "receber", textoA: "Um mimo surpresa aquece meu coração mais que alguém lavar a louça.", textoB: "Alguém assumir minhas tarefas aquece meu coração mais que um presente.", linguagemA: "presentes", linguagemB: "servicos" },
    { id: "D02", bloco: "receber", textoA: "Símbolos tangíveis me lembram que importo.", textoB: "Atitudes concretas me lembram que importo.", linguagemA: "presentes", linguagemB: "servicos" },
  ],
  "presentes+toque": [
    { id: "D01", bloco: "receber", textoA: "Um presente inesperado me emociona mais que um abraço rotineiro.", textoB: "Um abraço demorado me emociona mais que qualquer surpresa material.", linguagemA: "presentes", linguagemB: "toque" },
    { id: "D02", bloco: "receber", textoA: "Gestos visíveis de amor importam muito para mim.", textoB: "Proximidade física importa muito para mim.", linguagemA: "presentes", linguagemB: "toque" },
  ],
  "servicos+toque": [
    { id: "D01", bloco: "receber", textoA: "Quando alguém faz por mim, sinto amor na prática.", textoB: "Quando alguém me abraça, sinto amor no corpo.", linguagemA: "servicos", linguagemB: "toque" },
    { id: "D02", bloco: "receber", textoA: "Ajuda concreta no dia a dia é minha linguagem.", textoB: "Carinho físico no dia a dia é minha linguagem.", linguagemA: "servicos", linguagemB: "toque" },
  ],
  "tempo+toque": [
    { id: "D01", bloco: "receber", textoA: "Conversa de qualidade sem distrações me enche mais que carinho físico.", textoB: "Estar perto com toque e silêncio confortável me enche mais que conversar.", linguagemA: "tempo", linguagemB: "toque" },
    { id: "D02", bloco: "receber", textoA: "Olhar nos olhos e ouvir de verdade é o que preciso.", textoB: "Sentir o corpo do outro perto é o que preciso.", linguagemA: "tempo", linguagemB: "toque" },
  ],
};

/** Retorna até 5 pares de desempate focados nas duas linguagens empatadas. */
export function paresDesempatePara(langA: LinguagemAmor, langB: LinguagemAmor): ParForcado[] {
  const pool = POOL_DESEMPATE[chave(langA, langB)] ?? [];
  return pool.slice(0, 5).map((p, i) => ({
    ...p,
    id: CODIGOS_DESEMPATE[i] ?? `D0${i + 1}`,
  }));
}

export const PARES_DESEMPATE_TODOS: ParForcado[] = Object.values(POOL_DESEMPATE).flat();
