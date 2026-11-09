import type { EnergiaNumerologica } from "./energiaNumerologica";

/** Clima coletivo do dia — acolhedor, didático, sem jargão técnico. */
export const DIAS_COLETIVOS: Record<number, EnergiaNumerologica> = {
  1: {
    energia: "Iniciar",
    titulo: "No ar: recomeços coletivos",
    descricao:
      "O campo do dia favorece iniciativas públicas: lançamentos, primeiras falas, gente saindo do lugar. Quem planta encontra eco — quem só comenta, menos.",
    profundidade:
      "É um clima compartilhado de começo. Em escritórios, redes e ruas, sobe o apetite por autonomia e novidade. Projetos ganham coragem coletiva; estruturas antigas sentem pressão. Quem insiste em consenso absoluto pode travar o movimento. O ar pede propostas claras e liderança pontual — não heróis isolados que ignoram o tecido social.",
    clima: "Lançamentos, pitches, reformas de rota e espírito empreendedor no ar.",
    sombra: "Fragmentação, ego coletivo ou competição vazia por ser o primeiro.",
    reflexao: "Onde o mundo à volta já começou — e ainda espera uma proposta clara?",
    acoes: [
      "Ofereça uma ideia concreta em um espaço compartilhado.",
      "Apoie um começo coletivo em vez de só criticar.",
      "Nomeie o próximo passo público de um projeto em grupo.",
    ],
    evitar: ["Criticar quem inicia sem oferecer nada.", "Forçar protagonismo às custas do grupo."],
    palavrasChave: ["início coletivo", "proposta", "autonomia", "movimento", "coragem"],
  },
  2: {
    energia: "Cooperar",
    titulo: "No ar: diplomacia",
    descricao:
      "O dia pede diálogo e acordo. Negociações, mediações e paciência coletiva andam mais longe do que a pressa de vencer sozinho.",
    profundidade:
      "A temperatura da disputa baixa e a da escuta sobe. É clima de parceria, trégua e sensibilidade compartilhada. Mal-entendidos explodem se alguém força o ritmo. Quem conecta pontas e espera o timing certo encontra chão. Passividade disfarçada de ‘paz’ também atrapalha: cooperação ativa, não omissão.",
    clima: "Acordos, escuta, alianças, reconciliações e feedback.",
    sombra: "Indecisão coletiva, dependência ou fingir harmonia.",
    reflexao: "Onde o coletivo pede ceder um pouco para o acordo acontecer?",
    acoes: [
      "Facilite um acordo sem monopolizar a fala.",
      "Ouça até o fim numa troca de grupo antes de tomar posição.",
      "Ofereça ponte entre duas partes que não se escutam.",
    ],
    evitar: ["Impor vontade no grupo.", "Concordar em público e sabotar em privado."],
    palavrasChave: ["diplomacia", "parceria", "escuta", "acordo", "timing"],
  },
  3: {
    energia: "Expressar",
    titulo: "No ar: voz e criação",
    descricao:
      "Há mais espaço para criar, conversar e circular ideias. O clima favorece expressão — e cansa o barulho vazio.",
    profundidade:
      "Mídia, arte, humor e encontro aquecem. Conversas fluem; redes fervem; criatividade coletiva sobe. Bom para lançar mensagem, ensaiar, celebrar. O risco compartilhado é dispersão: muita opinião, pouco conteúdo. O campo responde a clareza alegre — não a performance sem substância.",
    clima: "Comunicação, arte, networking, humor e visibilidade leve.",
    sombra: "Fofoca, dispersão, ostentação ou falar para ocupar espaço.",
    reflexao: "O que o grupo precisa ouvir com verdade — não só com volume?",
    acoes: [
      "Compartilhe uma ideia ou criação em espaço coletivo.",
      "Participe de uma conversa com leveza e precisão.",
      "Celebre um avanço compartilhado sem competir por holofote.",
    ],
    evitar: ["Criticar a expressão alheia sem oferecer nada.", "Espalhar ruído em vez de mensagem."],
    palavrasChave: ["expressão", "criação", "rede", "humor", "clareza"],
  },
  4: {
    energia: "Estruturar",
    titulo: "No ar: estrutura",
    descricao:
      "O clima pede trabalho, regra e base. Quem organiza o comum encontra chão; quem busca atalho coletivo cobra depois.",
    profundidade:
      "É um dia de infraestrutura compartilhada: processos, prazos, manutenção, burocracia útil e construção. Produtividade séria sobe; improviso demais sofre. Se pairar pressão por ‘obra grande’, responda com trabalho real, não com discurso de legado. O campo respeita constância.",
    clima: "Trabalho, ordem, infraestrutura, disciplina coletiva e entrega.",
    sombra: "Rigidez institucional, sobrecarga, burocracia sem sentido ou frustração generalizada.",
    reflexao: "Qual estrutura compartilhada está solta e atrapalha todo mundo?",
    acoes: [
      "Organize uma peça prática que o grupo usa — lista, processo ou prazo.",
      "Cumpra um compromisso coletivo até o fim.",
      "Repare algo concreto do ambiente comum.",
    ],
    evitar: ["Prometer ordem e não entregar.", "Cobrar dos outros o que você não sustenta."],
    palavrasChave: ["estrutura", "trabalho", "prazo", "base", "constância"],
  },
  5: {
    energia: "Mudar",
    titulo: "No ar: mudança",
    descricao:
      "O dia mexe planos. Surpresas, pivôs e vontade de ar circulam. Flexibilidade coletiva vence; apego rígido perde.",
    profundidade:
      "É vento social: notícias rápidas, deslocamentos, revisões de rota, estímulo. Rotinas engessadas racham. O campo favorece experimentação e promoção — e tenta a impaciência coletiva. Excessos sobem. Adapte o essencial; não jogue fora o que ainda sustenta o grupo só pela euforia do novo.",
    clima: "Imprevistos, deslocamento, inovação, liberdade e ritmo acelerado.",
    sombra: "Caos, impulsividade coletiva, fuga de responsabilidade ou excesso.",
    reflexao: "Qual mudança coletiva é oportunidade — e qual é só barulho?",
    acoes: [
      "Aceite um ajuste coletivo útil sem resistir por costume.",
      "Proponha uma adaptação prática em vez de só reclamar.",
      "Proteja um compromisso essencial no meio do vento.",
    ],
    evitar: ["Mudar tudo no impulso do grupo.", "Boicotar o novo só porque é desconhecido."],
    palavrasChave: ["mudança", "flexibilidade", "movimento", "inovação", "ar"],
  },
  6: {
    energia: "Cuidar",
    titulo: "No ar: cuidado mútuo",
    descricao:
      "Cresce o pedido de responsabilidade afetiva no coletivo. Casa, comunidade e dever compartilhado ganham peso.",
    profundidade:
      "É clima de lar ampliado: família, vizinhança, políticas de cuidado, harmonia social. Demandas de presença sobem. O campo premia quem cuida de verdade — e cansa quem só discursa. Martírio coletivo também aparece: gente se doando até esvaziar. Cuidado com limite mantém o tecido; culpa não.",
    clima: "Comunidade, família, dever, acolhimento e responsabilidade compartilhada.",
    sombra: "Controle moral, culpa coletiva, resgate compulsivo ou anulação.",
    reflexao: "Onde o coletivo precisa de presença — não de discurso?",
    acoes: [
      "Ofereça um gesto prático de cuidado no seu círculo.",
      "Nomeie um limite saudável no grupo.",
      "Cuide também de si para não cuidar no automático.",
    ],
    evitar: ["Salvar todo mundo.", "Usar ‘cuidado’ para controlar."],
    palavrasChave: ["cuidado", "comunidade", "dever", "lar", "presença"],
  },
  7: {
    energia: "Compreender",
    titulo: "No ar: desacelerar",
    descricao:
      "O campo convida a compreender antes de empurrar. Estudo, silêncio e discernimento coletivo pesam mais do que reunião barulhenta.",
    profundidade:
      "A pressa social esfria. É clima de pesquisa, introspecção compartilhada e espiritualidade sem show. Confrontos ruidosos rendem pouco. O risco é isolamento coletivo ou análise infinita sem decisão. Pausa útil esclarece; fuga intelectual só adia o óbvio.",
    clima: "Estudo, introspecção, pesquisa, quietude e discernimento.",
    sombra: "Frieza, cinismo, sumiço das responsabilidades práticas ou excesso de análise.",
    reflexao: "O que o grupo está forçando — e pediria uma pausa honesta?",
    acoes: [
      "Proponha uma pausa antes de uma decisão coletiva apressada.",
      "Estude o tema que o entorno discute antes de opinar.",
      "Reduza barulho e observe o que aparece.",
    ],
    evitar: ["Isolar o grupo e chamar isso de profundidade.", "Analisar até ninguém agir."],
    palavrasChave: ["discernimento", "estudo", "pausa", "verdade", "quietude"],
  },
  8: {
    energia: "Realizar",
    titulo: "No ar: realização",
    descricao:
      "A atenção coletiva vai para o que se concretiza: economia, liderança, resultado. Força com medida constrói; força sem ética desgasta.",
    profundidade:
      "Acende o radar de poder e recurso. Negócios, metas, status e decisões de impacto circulam. O clima favorece quem entrega e quem negocia com clareza. A sombra coletiva é dominação, ganância e medir dignidade só por conquista. Autoridade a serviço do bem comum eleva o dia; autoridade como teatro o esvazia.",
    clima: "Negócios, finanças, liderança, metas e colheita proporcional.",
    sombra: "Domínio, exploração, status vazio ou pressão tóxica.",
    reflexao: "Onde o coletivo precisa de resultado justo — não de discurso de poder?",
    acoes: [
      "Avance um assunto concreto do grupo até o próximo passo.",
      "Trate recurso ou acordo com firmeza e justiça.",
      "Reconheça entrega real — não só volume de fala.",
    ],
    evitar: ["Dominar o grupo para parecer forte.", "Medir o dia só pelo status."],
    palavrasChave: ["resultado", "poder", "recurso", "ética", "meta"],
  },
  9: {
    energia: "Encerrar",
    titulo: "No ar: fechamento de ciclos",
    descricao:
      "Ciclos coletivos pedem conclusão. Limpeza, generosidade e liberação abrem espaço — começar grande demais atrapalha.",
    profundidade:
      "É o ocaso do ciclo curto compartilhado: encerrar projetos públicos, doar, perdoar o que for coletivo, humanizar. Clima de compaixão e de ‘bastante por agora’. A armadilha é martírio social ou nostalgia que impede o próximo começo de todos. Fechar bem é serviço ao futuro.",
    clima: "Conclusões, doação, causas, liberação e compaixão pública.",
    sombra: "Martírio coletivo, drama de despedida ou recusa em soltar o que acabou.",
    reflexao: "O que o coletivo já terminou e ainda insiste em carregar?",
    acoes: [
      "Participe do fechamento de uma pendência compartilhada.",
      "Doe tempo, atenção ou recurso sem esvaziar a si.",
      "Celebre o fim de um ciclo sem reabrir a ferida.",
    ],
    evitar: ["Reabrir o que o grupo já encerrou.", "Começar frente coletiva grande antes de limpar."],
    palavrasChave: ["conclusão", "liberação", "generosidade", "ciclo", "compaixão"],
  },
  11: {
    energia: "Intuir",
    titulo: "No ar: intuição elevada",
    descricao:
      "O campo fica mais elétrico: insight, empatia e um nervosismo compartilhado. Ancorar é o diferencial.",
    profundidade:
      "Sobe o volume intuitivo para todos. Conexões inesperadas, certeza súbita e sensibilidade empática circulam. É clima de sinal — e de ansiedade se ninguém aterra. O coletivo que transforma insight em gesto pequeno sai fortalecido; o que só ‘sente’ sem ação sai esgotado. Cuidar do sistema nervoso é inteligência coletiva neste ar.",
    clima: "Intuição coletiva, inspiração, empatia alta e clareza súbita.",
    sombra: "Ansiedade elétrica coletiva, desinformação emocional ou visão sem passo.",
    reflexao: "Qual sinal coletivo de hoje merece ser aterrado — não só sentido?",
    acoes: [
      "Participe de um momento de silêncio ou intenção em grupo.",
      "Traduza um insight coletivo em um gesto prático pequeno.",
      "Reduza estímulo e observe o que permanece.",
    ],
    evitar: ["Espalhar ansiedade ‘espiritual’.", "Ficar só na visão sem passo compartilhado."],
    palavrasChave: ["intuição", "inspiração", "empatia", "ancoragem", "clareza"],
  },
  22: {
    energia: "Construir",
    titulo: "No ar: construção de impacto",
    descricao:
      "O dia pede construção de impacto. Idealismo com obra: o campo quer estrutura que sirva a muitos — não só discurso visionário.",
    profundidade:
      "Visões grandes ganham pressão para virar plano, fundação e mobilização. A lacuna entre sonho e realidade pode paralisar grupos inteiros. O antídoto coletivo é a próxima pedra mensurável. Sem ética, a missão vira tirania; com método, vira legado em andamento. Gente de pé sustenta a obra.",
    clima: "Projetos de escala, sistemas, legado, mobilização e visão prática.",
    sombra: "Paralisia coletiva, pressão excessiva ou ‘missão’ justificando abuso.",
    reflexao: "Qual estrutura coletiva pode nascer ou avançar neste ar?",
    acoes: [
      "Avance uma peça concreta de um projeto compartilhado.",
      "Organize papéis e prazos em vez de só debater a visão.",
      "Cuide do ritmo do grupo — legado precisa de gente de pé.",
    ],
    evitar: ["Carregar a missão do grupo sozinho.", "Justificar pressão tóxica pela grandeza do fim."],
    palavrasChave: ["legado", "estrutura", "escala", "método", "visão"],
  },
  33: {
    energia: "Curar",
    titulo: "No ar: cura coletiva",
    descricao:
      "O campo pede cura coletiva: acolher, ensinar, humanizar. Compaixão com limite — senão o serviço vira esgotamento compartilhado.",
    profundidade:
      "O clima favorece reconciliação, cuidado com vulneráveis e palavras que elevam. Sem limites, o coletivo entra em martírio. Amor em ação com fronteira clara cura; amor sem fronteira adoece quem serve e quem recebe. Presença real vale mais do que discurso.",
    clima: "Cura coletiva, ensino, compaixão, acolhimento e elevação.",
    sombra: "Martírio social, culpa, salvacionismo ou fuga na ‘missão’.",
    reflexao: "Onde o coletivo precisa de cuidado real — não de discurso?",
    acoes: [
      "Ofereça um gesto de cuidado concreto no círculo ampliado.",
      "Nomeie um limite saudável no grupo.",
      "Valorize quem cuida sem se apagar.",
    ],
    evitar: ["Salvar todo mundo e esvaziar o núcleo.", "Usar cura coletiva para evitar a própria vida."],
    palavrasChave: ["cura", "ensino", "compaixão", "acolhimento", "limite"],
  },
};
