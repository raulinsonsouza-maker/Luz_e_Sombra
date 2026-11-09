import type { EnergiaNumerologica } from "./energiaNumerologica";

/** Clima coletivo do dia — igual para todas as pessoas naquela data. */
export const DIAS_COLETIVOS: Record<number, EnergiaNumerologica> = {
  1: {
    energia: "Começar",
    titulo: "No ar: recomeço coletivo",
    descricao:
      "À volta, o clima é de iniciativa. Gente e projetos estão saindo do lugar. O convite compartilhado é não ficar só olhando.",
    profundidade:
      "O dia favorece aberturas públicas: ideias novas, primeiros contatos, recomeços. Quem planta com clareza encontra eco; quem só observa perde o ritmo do coletivo.",
    reflexao: '"Onde o mundo à sua volta já começou e você ainda não entrou?"',
    acoes: [
      "Participe de um começo coletivo — reunião, mensagem, proposta — com um gesto concreto.",
      "Ofereça uma ideia simples em vez de só comentar a dos outros.",
    ],
    evitar: ["Criticar quem inicia sem oferecer nada.", "Esperar que o movimento passe para depois agir."],
  },
  2: {
    energia: "Combinar",
    titulo: "No ar: cooperação",
    descricao:
      "O convite coletivo é cooperar. Diálogos e acordos andam mais longe do que a pressa de vencer sozinho.",
    profundidade:
      "O dia pede escuta compartilhada: mediações, parcerias e gestos de paciência. Quem força o próprio ritmo atrapalha o campo; quem combina ganha chão.",
    reflexao: '"Onde o coletivo pede que você ceda um pouco para o acordo acontecer?"',
    acoes: [
      "Facilite um acordo ou uma conversa em grupo sem monopolizar.",
      "Ouça até o fim numa troca coletiva antes de tomar posição.",
    ],
    evitar: ["Impor a própria vontade no grupo.", "Fingir acordo e guardar ressentimento."],
  },
  3: {
    energia: "Expressar",
    titulo: "No ar: voz e criação",
    descricao:
      "Há mais espaço para criar e conversar. Use isso para colocar para fora algo que importa, não só para preencher o silêncio.",
    profundidade:
      "O clima coletivo favorece expressão: ideias, humor, encontros. Quem comunica com verdade se conecta; quem se espalha em barulho se perde.",
    reflexao: '"O que o grupo precisa ouvir e só você pode dizer com clareza?"',
    acoes: [
      "Compartilhe uma ideia ou criação em um espaço coletivo.",
      "Participe de uma conversa com leveza e verdade, sem monopolizar.",
    ],
    evitar: ["Falar só para ocupar espaço.", "Criticar o que os outros expressam sem oferecer nada."],
  },
  4: {
    energia: "Organizar",
    titulo: "No ar: estrutura",
    descricao:
      "O clima pede estrutura. Quem organiza a própria casa e o próprio trabalho encontra mais chão no coletivo.",
    profundidade:
      "O dia favorece rotinas, prazos e bases compartilhadas. Trabalho constante pesa mais do que impulso. Atalhos coletivos cobram depois.",
    reflexao: '"Qual estrutura compartilhada está solta e atrapalha todo mundo?"',
    acoes: [
      "Organize uma peça prática que o grupo usa (lista, horário, processo).",
      "Cumpra um compromisso coletivo até o fim, sem atalho.",
    ],
    evitar: ["Prometer ordem e não entregar.", "Cobrar dos outros o que você não sustenta."],
  },
  5: {
    energia: "Mudar",
    titulo: "No ar: mudança",
    descricao:
      "À volta, as coisas se mexem. Mudanças pedem flexibilidade, sem abandonar o que é essencial.",
    profundidade:
      "O clima coletivo traz interrupções, novidades e revisões de rota. Quem se agarra ao conhecido trava; quem se adapta sem se perder acompanha o campo.",
    reflexao: '"Qual mudança coletiva você ainda trata como ameaça?"',
    acoes: [
      "Aceite um ajuste coletivo pequeno sem resistir por costume.",
      "Proponha uma adaptação útil em vez de só reclamar da mudança.",
    ],
    evitar: ["Mudar tudo no impulso do grupo.", "Boicotar o novo só porque é desconhecido."],
  },
  6: {
    energia: "Cuidar",
    titulo: "No ar: cuidado mútuo",
    descricao:
      "Cresce o pedido de cuidado mútuo. O que você faz pelas pessoas certas também devolve chão para você.",
    profundidade:
      "O dia coletivo destaca casa, comunidade e responsabilidade afetiva. Presença concreta pesa mais do que discurso. Cuidar sem se apagar mantém o campo íntegro.",
    reflexao: '"Onde o coletivo precisa de presença, não de discurso?"',
    acoes: [
      "Ofereça um gesto prático de cuidado a alguém do seu círculo.",
      "Cuide também de si para não cuidar dos outros no automático.",
    ],
    evitar: ["Salvar todo mundo e se esvaziar.", "Usar o cuidado coletivo para evitar a própria vida."],
  },
  7: {
    energia: "Entender",
    titulo: "No ar: desacelerar",
    descricao:
      "Há um convite a desacelerar e compreender. Quem busca sentido, em vez de só resultado, enxerga melhor o caminho.",
    profundidade:
      "O clima coletivo favorece estudo, silêncio e perguntas honestas. Menos barulho compartilhado, mais clareza. A pressa coletiva embasa decisões ruins.",
    reflexao: '"O que o grupo está forçando e pediria uma pausa?"',
    acoes: [
      "Proponha uma pausa útil antes de uma decisão coletiva apressada.",
      "Estude ou reflita sobre um tema que o entorno está discutindo.",
    ],
    evitar: ["Isolar-se e chamar isso de sabedoria coletiva.", "Analisar até ninguém agir."],
  },
  8: {
    energia: "Concretizar",
    titulo: "No ar: realização",
    descricao:
      "A atenção vai para o que se realiza no mundo. Use a força com medida, para construir e não para controlar.",
    profundidade:
      "O dia coletivo destaca resultados, recursos e decisões práticas. Quem conduz com responsabilidade ganha forma; quem só disputa poder desgasta o campo.",
    reflexao: '"Onde o coletivo precisa de resultado, não de discurso?"',
    acoes: [
      "Avance um assunto concreto do grupo até um próximo passo claro.",
      "Trate recursos ou acordos com firmeza e justiça.",
    ],
    evitar: ["Dominar o grupo para parecer forte.", "Medir o dia só pelo status."],
  },
  9: {
    energia: "Encerrar",
    titulo: "No ar: fechamento de ciclos",
    descricao:
      "Ciclos estão se completando. O que ficou para trás pode ser solto, e isso autoriza você a fazer o mesmo.",
    profundidade:
      "O clima coletivo favorece conclusões, despedidas e limpeza do que não serve. Encerrar bem abre espaço compartilhado. Segurar o passado trava o próximo ciclo de todos.",
    reflexao: '"O que o coletivo já terminou e ainda insiste em carregar?"',
    acoes: [
      "Participe do fechamento de uma pendência compartilhada.",
      "Agradeça ou solte um ciclo coletivo que já cumpriu o tempo.",
    ],
    evitar: ["Reabrir o que o grupo já encerrou.", "Começar grande frente coletiva antes de limpar a mesa."],
  },
  11: {
    energia: "Intuir",
    titulo: "No ar: portal 11 — intuição coletiva",
    descricao:
      "O campo coletivo fica mais sensível. Dias como 11/11 e os dias 11 abrem um clima de insight compartilhado, sinais e inspiração — se o grupo aterra, não só sonha.",
    profundidade:
      "No portal 11 a antena coletiva sobe. Ideias, presságios e conversas profundas circulam com mais força. Sem ancoragem, vira nervosismo coletivo. Com presença, vira clareza compartilhada.",
    reflexao: '"Qual sinal coletivo de hoje merece ser escutado — e aterrado?"',
    acoes: [
      "Participe de um momento de silêncio, intenção ou conversa profunda em grupo.",
      "Traduza um insight coletivo em um gesto prático pequeno.",
    ],
    evitar: ["Espalhar ansiedade espiritual.", "Ficar só na visão sem nenhum passo compartilhado."],
  },
  22: {
    energia: "Construir",
    titulo: "No ar: portal 22 — construção coletiva",
    descricao:
      "O clima pede legado em escala. Dias 22 e portais mestres convidam o coletivo a estruturar o que a visão já mostrou.",
    profundidade:
      "O 22 coletivo junta inspiração e obra. É dia de alinhar gente, recurso e prazo em torno de algo maior — sem tirania benevolente nem paralisia pelo tamanho.",
    reflexao: '"Qual estrutura coletiva pode nascer ou avançar hoje?"',
    acoes: [
      "Avance uma peça concreta de um projeto compartilhado.",
      "Organize papéis e próximos passos em vez de só debater a visão.",
    ],
    evitar: ["Carregar a missão do grupo sozinho.", "Justificar pressão excessiva pela grandeza do fim."],
  },
  33: {
    energia: "Curar",
    titulo: "No ar: portal 33 — cura coletiva",
    descricao:
      "O campo pede amor em ação no coletivo. Cuidar, ensinar e acolher — com limites, para o serviço não virar esgotamento compartilhado.",
    profundidade:
      "O 33 coletivo eleva a compaixão do grupo. Sem autocuidado coletivo, vira martírio. Com presença e limites, cura de verdade.",
    reflexao: '"Onde o coletivo precisa de cuidado real — não só de discurso?"',
    acoes: [
      "Ofereça um gesto de cuidado concreto no seu círculo.",
      "Nomeie um limite saudável no grupo para ninguém se apagar.",
    ],
    evitar: ["Salvar todo mundo e se esvaziar.", "Usar a missão de cura para evitar a própria vida."],
  },
};
