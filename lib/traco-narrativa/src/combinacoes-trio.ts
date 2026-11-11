import type { CombinacaoTrio } from "./perfil.js";
import type { EstruturaTraco } from "./types.js";
import { PERFIS_TRACO } from "./perfis/index.js";

function chave(ids: EstruturaTraco[]): string {
  return [...ids].sort().join("-");
}

const COMBINACOES: CombinacaoTrio[] = [
  {
    ids: ["masoquista", "oral", "rigido"],
    titulo: "Entre o vínculo, o reconhecimento e a capacidade de sustentar",
    abertura:
      "Você reúne características que podem fazer de você uma pessoa dedicada, comprometida e muito presente nas relações. Existe uma combinação interessante entre a valorização dos vínculos, a busca por reconhecimento e a capacidade de sustentar responsabilidades.",
    oQueCadaAcrescenta:
      "O Oral pode aumentar a importância dos relacionamentos, da atenção e da reciprocidade. O Rígido pode favorecer a dedicação, a organização e o desejo de fazer as coisas bem-feitas. Já o Masoquista pode contribuir com persistência, responsabilidade e capacidade de continuar mesmo diante das dificuldades.",
    emComum:
      "Os três compartilham uma ética de cuidado e entrega: oferecer, corresponder e permanecer. Em comum, há a tendência a valorizar o outro e a própria contribuição nas relações e nos projetos.",
    tensoes:
      "Pode existir uma tensão: você pode desejar ser acolhido, sentir-se reconhecido e receber reciprocidade, mas ter dificuldade de expressar suas necessidades e estabelecer limites. O Oral quer proximidade; o Rígido quer forma e mérito; o Masoquista quer estabilidade sem conflito.",
    comoAparecemJuntos:
      "O Oral pode dizer: preciso sentir que sou importante e que existe reciprocidade. O Rígido pode dizer: preciso fazer bem-feito e demonstrar meu valor. O Masoquista pode dizer: preciso continuar, cumprir minhas responsabilidades e não criar problemas. Quando essas três estratégias aparecem juntas, você pode acabar oferecendo muito, assumindo responsabilidades, procurando corresponder às expectativas e esperando que as pessoas reconheçam naturalmente tudo o que faz.",
    comoApareceNaVida:
      "No trabalho, você pode assumir muitas responsabilidades, dedicar-se intensamente e buscar entregar resultados de qualidade, frustrando-se quando o esforço não é reconhecido. No amor, pode demonstrar afeto por presença e atitudes, e quando sente que não está sendo escolhido, tentar recuperar a segurança sendo ainda mais competente ou agradável. Na família, pode ser quem organiza e ajuda, com as próprias necessidades em segundo plano. Na comunicação, pode evitar demonstrar insatisfação e ter dificuldade de pedir diretamente. Nas decisões, pode considerar as necessidades de todos e suportar desconfortos por mais tempo do que gostaria. Consigo, pode cobrar muito de si e sentir dificuldade de descansar sem a sensação de que ainda existe algo a fazer.",
    recursosDaCombinacao: [
      "Dedicação e comprometimento",
      "Sensibilidade aos relacionamentos",
      "Capacidade de acolhimento",
      "Persistência diante de desafios",
      "Organização e qualidade",
      "Confiabilidade",
    ],
    pontoDeAtencao:
      "O principal cuidado pode estar em não transformar dedicação em obrigação, cuidado em autoabandono e busca por reconhecimento em cobrança constante. Você pode acabar esperando que as pessoas percebam o quanto se dedica, enquanto não comunica claramente aquilo de que precisa.",
    caminhoIntegracao:
      "Você não precisa deixar de ser dedicado, afetuoso ou responsável. Precisa experimentar que seu valor não depende de fazer tudo perfeitamente; que pode pedir cuidado sem precisar demonstrar que merece recebê-lo; que pode estabelecer limites sem deixar de amar; que pode descansar sem abandonar suas responsabilidades; e que pode comunicar necessidades antes de chegar ao limite.",
    pergunta:
      "Você consegue permitir que cuidem de você, reconhecer suas necessidades e descansar sem sentir que precisa continuar provando o seu valor?",
  },
  {
    ids: ["oral", "psicopata", "rigido"],
    titulo: "Entre o vínculo, a autonomia e a excelência",
    abertura:
      "Você combina sede de conexão, capacidade de conduzir e busca por qualidade. Pode ser alguém que aquece relações e, ao mesmo tempo, quer participar das decisões e entregar com capricho.",
    oQueCadaAcrescenta:
      "O Oral acrescenta calor e necessidade de reciprocidade. O Psicopata acrescenta iniciativa, influência e autonomia. O Rígido acrescenta padrão, organização e desejo de reconhecimento.",
    emComum:
      "Os três valorizam impacto: ser visto, ser ouvido e ser admirado pelo que entrega.",
    tensoes:
      "Pode haver tensão entre querer proximidade e preservar liberdade; entre acolher e conduzir; entre pedir colo e precisar parecer impecável.",
    comoAparecemJuntos:
      "Você pode cuidar e liderar ao mesmo tempo, esperando reconhecimento afetivo e de desempenho. Às vezes a generosidade disfarça a necessidade de aprovação, e a excelência disfarça o medo de não ser escolhido.",
    comoApareceNaVida:
      "No trabalho, aquece a equipe e empurra resultados. No amor, quer presença e também respeito à própria voz. Nas decisões, consulta o impacto relacional e ainda assim quer manter o controle da qualidade. Consigo, pode oscilar entre dar demais e cobrar demais.",
    recursosDaCombinacao: ["Influência humana", "Capacidade de realização", "Empatia com direção", "Padrão alto com calor"],
    pontoDeAtencao:
      "Cuidado para não usar cuidado, comando e excelência como três formas de garantir valor. Nomear a necessidade direta reduz a performance.",
    caminhoIntegracao:
      "Pratique pedir sem impressionar, liderar sem centralizar e entregar o suficientemente bom sem abandonar a qualidade que importa.",
    pergunta:
      "Onde você está pedindo amor por meio de desempenho, em vez de pedir com clareza?",
  },
  {
    ids: ["masoquista", "oral", "psicopata"],
    titulo: "Entre o vínculo, a condução e a sustentação",
    abertura:
      "Você une necessidade de proximidade, impulso de avançar e capacidade de aguentar. Pode cuidar, decidir e permanecer.",
    oQueCadaAcrescenta:
      "O Oral traz acolhimento. O Psicopata traz autonomia e estratégia. O Masoquista traz persistência e contenção.",
    emComum:
      "Há uma tendência a assumir o clima da situação: cuidar, resolver e carregar.",
    tensoes:
      "Desejo de conexão pode colidir com medo de depender; capacidade de aguentar pode ocultar a necessidade de pedir alívio; liderança pode mascarar cansaço.",
    comoAparecemJuntos:
      "Você pode ser a pessoa que segura o grupo, decide o próximo passo e ainda tenta manter todo mundo bem, até o corpo ou o ressentimento cobrarem.",
    comoApareceNaVida:
      "No trabalho, assume e conduz. No amor, investe e aguenta. Na comunicação, pode negociar ou engolir. Consigo, demora a admitir limite.",
    recursosDaCombinacao: ["Resiliência", "Iniciativa", "Generosidade", "Capacidade de crise"],
    pontoDeAtencao:
      "Não transformar urgência e lealdade em sobrecarga crônica. Pedir ajuda não cancela liderança nem afeto.",
    caminhoIntegracao:
      "Delegue cedo, diga o desconforto cedo e permita receber sem negociar o cuidado.",
    pergunta:
      "Quanto do que você carrega hoje poderia ser compartilhado sem perder seu lugar?",
  },
  {
    ids: ["esquizoide", "oral", "rigido"],
    titulo: "Entre o espaço interior, o vínculo e a forma",
    abertura:
      "Você reúne profundidade interior, sede de conexão e busca por qualidade. Quer perto e também precisa de distância; quer entregar bem e também se proteger.",
    oQueCadaAcrescenta:
      "O Esquizóide acrescenta mundo interior e necessidade de espaço. O Oral acrescenta calor e reciprocidade. O Rígido acrescenta excelência e reconhecimento.",
    emComum:
      "Os três lidam com o risco de exposição: ser visto demais, sentir demais ou errar demais.",
    tensoes:
      "Pode querer proximidade e se sobrecarregar com ela; pode querer ser admirado e temer mostrar o rascunho; pode amar e sumir para processar.",
    comoAparecemJuntos:
      "Você pode cuidar com capricho e, no dia seguinte, precisar de silêncio. A excelência organiza o vínculo; o recolhimento protege a individualidade.",
    comoApareceNaVida:
      "No trabalho, entrega com qualidade e precisa de autonomia. No amor, investe e pede espaço. Na comunicação, alterna abertura e contenção.",
    recursosDaCombinacao: ["Profundidade", "Empatia", "Qualidade", "Originalidade com cuidado"],
    pontoDeAtencao:
      "Avisar o espaço evita que o outro leia distância como abandono. Entregar o suficiente evita adiar o vínculo.",
    caminhoIntegracao:
      "Combine presença em doses, pedidos claros e o suficientemente bom nas entregas afetivas e práticas.",
    pergunta:
      "Como seria pedir proximidade e espaço na mesma conversa, sem culpa?",
  },
  {
    ids: ["esquizoide", "oral", "psicopata"],
    titulo: "Entre o espaço, o vínculo e a autonomia",
    abertura:
      "Você combina vida interior, necessidade de conexão e impulso de conduzir. Pode parecer seletivo, afetuoso e decisivo ao mesmo tempo.",
    oQueCadaAcrescenta:
      "O Esquizóide traz observação. O Oral traz calor. O Psicopata traz influência e autonomia.",
    emComum:
      "Há inteligência situacional: ler o ambiente antes de se entregar.",
    tensoes:
      "Proximidade versus liberdade; recolhimento versus liderança; cuidado versus controle.",
    comoAparecemJuntos:
      "Você pode acolher e, no mesmo movimento, organizar o cenário. Quando se sente invadido, some; quando se sente seguro, conduz.",
    comoApareceNaVida:
      "No trabalho, observa, articula e conecta. No amor, quer ser visto sem perder autonomia. Consigo, oscila entre solidão regeneradora e solidão que isola.",
    recursosDaCombinacao: ["Visão", "Empatia estratégica", "Iniciativa", "Seletividade saudável"],
    pontoDeAtencao:
      "Não usar distância ou controle para evitar a vulnerabilidade do vínculo.",
    caminhoIntegracao:
      "Pratique presença pequena, pedidos sem estratégia e liderança com escuta.",
    pergunta:
      "Quando você se afasta ou assume o comando, o que está protegendo?",
  },
  {
    ids: ["esquizoide", "oral", "masoquista"],
    titulo: "Entre o espaço, o vínculo e a sustentação",
    abertura:
      "Você une mundo interior, desejo de acolhimento e capacidade de aguentar. Pode cuidar em silêncio e carregar muito por dentro.",
    oQueCadaAcrescenta:
      "O Esquizóide traz recolhimento. O Oral traz necessidade de proximidade. O Masoquista traz persistência e contenção.",
    emComum:
      "Há tendência a processar por dentro e a priorizar o outro ou a estabilidade antes de se expressar.",
    tensoes:
      "Quer perto e precisa de espaço; oferece e aguenta; pode não pedir até o limite.",
    comoAparecemJuntos:
      "Você pode ser leal, generoso e reservado. O vínculo importa, mas o pedido demora; o silêncio protege e também isola.",
    comoApareceNaVida:
      "No amor e na família, investe e engole. No trabalho, entrega com constância sem reclamar. Consigo, resolve sozinho até cansar.",
    recursosDaCombinacao: ["Empatia profunda", "Lealdade", "Profundidade", "Resistência"],
    pontoDeAtencao:
      "O autoabandono silencioso. Nomear necessidade cedo evita explosão ou distanciamento tardio.",
    caminhoIntegracao:
      "Peça em dose pequena, diga o desconforto cedo e permita espaço sem sumir.",
    pergunta:
      "O que você está sustentando em silêncio que pediria uma frase clara?",
  },
  {
    ids: ["esquizoide", "psicopata", "rigido"],
    titulo: "Entre a profundidade, a condução e a excelência",
    abertura:
      "Você reúne visão interior, capacidade de avançar e padrão alto. Pode pensar fundo, decidir e entregar com precisão.",
    oQueCadaAcrescenta:
      "O Esquizóide traz ideia e espaço. O Psicopata traz influência. O Rígido traz qualidade e reconhecimento.",
    emComum:
      "Competência e independência: fazer bem, pensar antes, não depender demais.",
    tensoes:
      "Exposição versus excelência; controle versus recolhimento; admiração versus intimidade.",
    comoAparecemJuntos:
      "Você pode liderar por ideias e padrões, preferindo bastidores ou controle da forma. A fragilidade fica para depois da entrega.",
    comoApareceNaVida:
      "No trabalho, brilha em estratégia e qualidade. No amor, pode parecer distante ou exigente. Consigo, cobra e pensa sem pedir colo.",
    recursosDaCombinacao: ["Visão executável", "Padrão alto", "Autonomia", "Clareza"],
    pontoDeAtencao:
      "Não adiar a vida emocional até o projeto estar perfeito.",
    caminhoIntegracao:
      "Mostre o rascunho, peça apoio e pratique o suficientemente bom no afeto.",
    pergunta:
      "O que aconteceria se você fosse visto antes de estar pronto?",
  },
  {
    ids: ["esquizoide", "masoquista", "psicopata"],
    titulo: "Entre a profundidade, a sustentação e a autonomia",
    abertura:
      "Você combina vida interior, capacidade de carregar e impulso de conduzir. Pode parecer calmo por fora e intenso por dentro.",
    oQueCadaAcrescenta:
      "O Esquizóide observa. O Masoquista aguenta. O Psicopata decide.",
    emComum:
      "Tendência a resolver por conta própria e a subestimar a necessidade de ser cuidado.",
    tensoes:
      "Recolher versus avançar; aguentar versus controlar; silêncio versus influência.",
    comoAparecemJuntos:
      "Você pode carregar a crise, analisar e cortar o nó, sem pedir ajuda. A autonomia protege e também isola.",
    comoApareceNaVida:
      "No trabalho, é âncora e estrategista. Nas relações, demora a mostrar o peso. Consigo, processa e age sem testemunho.",
    recursosDaCombinacao: ["Resiliência estratégica", "Profundidade", "Iniciativa", "Constância"],
    pontoDeAtencao:
      "Pedir apoio não reduz autonomia. Engolir e decidir sozinho custa caro.",
    caminhoIntegracao:
      "Nomeie o peso, compartilhe uma decisão e permita presença sem invasão.",
    pergunta:
      "Quem poderia segurar uma ponta do que você está carregando sozinho?",
  },
  {
    ids: ["esquizoide", "masoquista", "rigido"],
    titulo: "Entre a profundidade, a sustentação e a forma",
    abertura:
      "Você une mundo interior, persistência e busca por excelência. Pode entregar muito, falar pouco e cobrar alto de si.",
    oQueCadaAcrescenta:
      "O Esquizóide traz espaço e ideia. O Masoquista traz resistência. O Rígido traz padrão e reconhecimento.",
    emComum:
      "Contenção: guardar, aguentar e caprichar antes de se mostrar.",
    tensoes:
      "Querer ser valorizado sem se expor; permanecer em excesso; perfeccionismo que atrasa o pedido de ajuda.",
    comoAparecemJuntos:
      "Você pode ser a pessoa quieta que segura o padrão e a carga. O reconhecimento demora porque a necessidade não é dita.",
    comoApareceNaVida:
      "No trabalho, constância e qualidade. Em casa, responsabilidade sem reclamar. Consigo, pouco descanso e muita exigência.",
    recursosDaCombinacao: ["Confiabilidade", "Profundidade", "Qualidade", "Persistência"],
    pontoDeAtencao:
      "Não confundir silêncio competente com bem-estar. Limite e celebração também são parte da entrega.",
    caminhoIntegracao:
      "Diga um não pequeno, entregue o suficiente e permita ser visto sem a versão final.",
    pergunta:
      "O que você entregaria se não precisasse estar impecável nem invisível?",
  },
  {
    ids: ["masoquista", "psicopata", "rigido"],
    titulo: "Entre a sustentação, a condução e a excelência",
    abertura:
      "Você combina persistência, influência e padrão alto. Pode realizar muito, assumir demais e cobrar de si o impossível.",
    oQueCadaAcrescenta:
      "O Masoquista traz capacidade de permanecer. O Psicopata traz avanço e autonomia. O Rígido traz qualidade e reconhecimento.",
    emComum:
      "Alta performance com pouco espaço para fragilidade.",
    tensoes:
      "Centralizar versus aguentar; excelência versus cansaço; autonomia versus pedido de ajuda.",
    comoAparecemJuntos:
      "Você pode conduzir, carregar e caprichar até o limite. A vida emocional fica para depois do resultado.",
    comoApareceNaVida:
      "No trabalho, referência de entrega. Nas relações, pode parecer forte demais. Consigo, descanso vira culpa.",
    recursosDaCombinacao: ["Realização", "Liderança", "Resistência", "Padrão elevado"],
    pontoDeAtencao:
      "O burnout disfarçado de competência. Dividir carga e mostrar limite aumenta confiança.",
    caminhoIntegracao:
      "Delegue, diga o cansaço e pratique o suficientemente bom sem abandonar o que importa.",
    pergunta:
      "Que parte da sua força hoje está sendo usada só para não parar?",
  },
];

const BY_KEY = new Map(COMBINACOES.map((c) => [chave(c.ids), c]));

export function combinacaoTrioDe(
  a: EstruturaTraco,
  b: EstruturaTraco,
  c: EstruturaTraco,
): CombinacaoTrio | null {
  if (a === b || a === c || b === c) return null;
  return BY_KEY.get(chave([a, b, c])) ?? null;
}

/** Mini apresentação individual para a etapa 7. */
export function miniBlocoIndividual(traco: EstruturaTraco): string {
  const p = PERFIS_TRACO[traco];
  return `${p.nome}: ${p.identidade.titulo}. ${p.formacao.necessidadeEmocional}`;
}

export { COMBINACOES as COMBINACOES_TRIO };
