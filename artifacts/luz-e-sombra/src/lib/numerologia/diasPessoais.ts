import type { EnergiaNumerologica } from "./energiaNumerologica";

/** Gesto do dia — voz acolhedora, didática, sem jargão técnico. */
export const DIAS_PESSOAIS: Record<number, EnergiaNumerologica> = {
  1: {
    energia: "Iniciar",
    titulo: "Dia de iniciativa",
    descricao:
      "Hoje o caminho abre quando você dá o primeiro passo. Não precisa do cenário perfeito — precisa de um começo seu, com coragem e clareza.",
    profundidade:
      "Este é um dia de autoria: projeto, conversa ou decisão que só anda se você assumir. Pode surgir mais ambição e vontade de avançar — use isso para abrir uma frente só, com atenção. A firmeza ajuda; atropelar quem também importa no jogo atrapalha. Comece com presença, não com pressa de provar algo.",
    clima: "Começos simples, autonomia, propostas e a coragem de dar o primeiro contato.",
    sombra: "Teimosia, pressa centrada só em você e deixar de fora quem precisa estar na decisão.",
    reflexao: "Qual único começo de hoje muda o resto da semana se você der o passo?",
    acoes: [
      "Abra a única coisa que mais adia — uma versão simples já conta.",
      "Envie a mensagem ou proposta que já está pronta na cabeça.",
      "Diga em voz alta o que decidiu começar; fica mais difícil voltar atrás.",
    ],
    evitar: ["Abrir três frentes novas no mesmo dia.", "Esperar autorização externa para o que só você pode iniciar."],
    palavrasChave: ["início", "autoria", "coragem", "foco", "independência"],
  },
  2: {
    energia: "Escutar",
    titulo: "Dia de receptividade",
    descricao:
      "Hoje pede escuta antes da resposta. Reúna o que precisa saber, toque base com quem importa e deixe o diálogo respirar.",
    profundidade:
      "É um dia de tato e timing: parceria, delicadeza e paciência rendem mais do que forçar. Bom para conversas importantes, acordos e para sentir o que o ambiente devolve antes de avançar. Se a sensibilidade subir, não interprete tensão como fracasso — é o radar ligado. Ouça até o fim. Quem responde cedo demais perde o que o dia quer entregar.",
    clima: "Diálogos honestos, feedback, paciência e conexão antes de agir.",
    sombra: "Ficar parado na dúvida, absorver o humor alheio ou evitar o assunto difícil.",
    reflexao: "O que você ainda não ouviu porque já tinha a resposta pronta?",
    acoes: [
      "Retome a conversa que vem adiando — e ouça até o fim.",
      "Peça um retorno claro antes de fechar um acordo.",
      "Ofereça presença a alguém próximo sem tentar resolver a vida dela.",
    ],
    evitar: ["Decidir por outra pessoa sem perguntar.", "Concordar só para encerrar o desconforto."],
    palavrasChave: ["parceria", "tato", "escuta", "timing", "acordo"],
  },
  3: {
    energia: "Expressar",
    titulo: "Dia de voz e criação",
    descricao:
      "Hoje a vida pede que você diga, escreva, crie ou se mostre. Ideias ganham força quando saem da cabeça e encontram alguém.",
    profundidade:
      "É um dia bom para comunicar com leveza, retomar contatos e deixar a criatividade circular. Humor e presença abrem portas. O cuidado é não espalhar energia em dez ideias e não fechar nenhuma. Escolha um canal — uma conversa, um texto, um gesto criativo — e vá até o fim nele. Alegria alimenta; falta de foco esvazia.",
    clima: "Conversas, criação, encontros e uma expressão clara do que você sente.",
    sombra: "Dispersão, superficialidade ou falar só para preencher o silêncio.",
    reflexao: "O que precisa sair de você hoje — e para quem?",
    acoes: [
      "Diga ou escreva a frase que está pronta há dias.",
      "Mostre um trabalho ou ideia que ainda está guardado.",
      "Retome um contato importante com leveza e clareza.",
    ],
    evitar: ["Abrir dez frentes criativas.", "Usar piada para não falar do que importa."],
    palavrasChave: ["expressão", "criatividade", "rede", "clareza", "leveza"],
  },
  4: {
    energia: "Estruturar",
    titulo: "Dia de base e detalhe",
    descricao:
      "Hoje favorece o concreto: rotina, contas, organização e o trabalho que ninguém vê — mas que sustenta o resto.",
    profundidade:
      "É um dia de ofício e chão. O que está emperrado por falta de ordem pode andar se você tratar o detalhe com atenção e seriedade. Pode parecer sem brilho; ainda assim é fundação. Se surgir vontade de ‘entregar algo enorme’, responda com um bloco real de trabalho, não com fantasia de escala. Escolha uma tarefa e conclua. Atalho hoje vira retrabalho amanhã.",
    clima: "Organização, disciplina suave, casa, finanças práticas e entrega pontual.",
    sombra: "Rigidez, sobrecarga ou perfeccionismo que impede entregar.",
    reflexao: "Qual pendência concreta, se fechada hoje, libera o resto?",
    acoes: [
      "Termine uma tarefa do começo ao fim — só uma.",
      "Organize contas, arquivos ou um canto da casa que trava você.",
      "Faça o trabalho físico ou técnico que vem adiando.",
    ],
    evitar: ["Querer deixar tudo perfeito e não entregar nada.", "Encher o dia de microtarefas para evitar o essencial."],
    palavrasChave: ["ordem", "detalhe", "rotina", "fundação", "constância"],
  },
  5: {
    energia: "Movimentar",
    titulo: "Dia de mudança e flexibilidade",
    descricao:
      "Espere ajustes, imprevistos e vontade de ar. Hoje favorece o novo — experiência, deslocamento, promoção de si — mais do que a papelada monótona.",
    profundidade:
      "É um dia de liberdade e variação. Planos rígidos racham; quem se adapta aproveita. Bom para experimentar, sair do automático e deixar o dia respirar. O cuidado é não decidir no calor do momento nem quebrar um compromisso importante só pela euforia do novo. Flexibilidade com critério: abra espaço, sem abandonar o que ainda importa.",
    clima: "Imprevisto útil, promoção, deslocamento, experimentação e ar fresco.",
    sombra: "Impulsividade, excesso, fuga da responsabilidade ou irritação com o rotineiro.",
    reflexao: "O que precisa de flexibilidade hoje — e o que ainda é inegociável?",
    acoes: [
      "Aceite um desvio pequeno da rotina com presença.",
      "Promova uma ideia ou a si em um canal concreto.",
      "Deixe margem no dia para o que não estava no script.",
    ],
    evitar: ["Decisões definitivas no impulso.", "Compensar tédio com excesso."],
    palavrasChave: ["mudança", "liberdade", "adaptação", "movimento", "surpresa"],
  },
  6: {
    energia: "Cuidar",
    titulo: "Dia de responsabilidade afetiva",
    descricao:
      "Hoje o foco volta para casa, vínculos e deveres concretos. Cuidar é presença — não carregar o problema de todo mundo nas costas.",
    profundidade:
      "É um dia de harmonia e atenção às pessoas próximas. Demandas podem aparecer; respeite o compromisso sem se tornar salvador. Bom para família, corpo, um gesto afetuoso, reconciliar. A armadilha é se anular ‘pelo bem de todos’ e depois guardar raiva. Você também entra na conta do cuidado. Equilíbrio começa por aí.",
    clima: "Casa, família, deveres cumpridos com afeto e cuidado pontual.",
    sombra: "Excesso de responsabilidade, martírio ou controlar quem você ‘ajuda’.",
    reflexao: "Você está cuidando porque quer — ou porque tem medo de decepcionar?",
    acoes: [
      "Faça um gesto concreto de presença com alguém próximo.",
      "Cuide do corpo — alimentação, descanso ou um atendimento — como prioridade do dia.",
      "Cumpra um dever doméstico ou relacional sem drama.",
    ],
    evitar: ["Resolver a vida dos outros.", "Dar tanto que a raiva fica guardada."],
    palavrasChave: ["cuidado", "lar", "dever", "afeto", "equilíbrio"],
  },
  7: {
    energia: "Aprofundar",
    titulo: "Dia de silêncio útil",
    descricao:
      "Hoje favorece estudo, reflexão e um pouco de distância do barulho. A resposta costuma chegar quando você para de empurrar.",
    profundidade:
      "É um dia introspectivo: pesquisar, meditar, analisar, caminhar, ficar quieto com o que importa. Não é o melhor momento para forçar confronto ou agenda social densa. Se tudo parecer pessoal demais, dê um passo atrás. Revise o plano, leia, escute-se. Silêncio útil esclarece; sumir por fuga só adia o que precisa ser visto.",
    clima: "Estudo, introspecção, análise serena e um insight que pede espaço.",
    sombra: "Isolamento defensivo, frieza ou pensar tanto que nada prático anda.",
    reflexao: "O que você já sabe e ainda não admite para si?",
    acoes: [
      "Separe um bloco sem tela para pensar ou escrever o que aparece.",
      "Estude ou pesquise uma questão que está emperrada.",
      "Caminhe ou fique em silêncio antes de responder algo delicado.",
    ],
    evitar: ["Marcar confronto ou festa barulhenta.", "Pensar tanto que nada prático anda."],
    palavrasChave: ["introspecção", "estudo", "silêncio", "análise", "verdade"],
  },
  8: {
    energia: "Realizar",
    titulo: "Dia de poder prático",
    descricao:
      "Hoje favorece negócios, dinheiro, autoridade e resultado. A confiança sobe — use para negociar e decidir, não para dominar.",
    profundidade:
      "É um dia de manifestação concreta: reunião importante, acordo justo, meta clara, presença. Você pode sentir mais drive — mostre competência com ética. Firmeza constrói; força sem medida queima relação e reputação. Olhe o que é justo cobrar e o que é justo oferecer. Resultado com responsabilidade pesa mais do que status.",
    clima: "Finanças, carreira, negociação, meta e autoridade saudável.",
    sombra: "Domínio, pressão excessiva, ambição sem escrúpulo ou esgotamento.",
    reflexao: "Onde você está cobrando menos — ou impondo mais — do que é justo?",
    acoes: [
      "Trate o assunto concreto até o próximo passo claro.",
      "Agende ou conduza a conversa profissional que pesa.",
      "Olhe um número financeiro real: o que entra, o que sai, o que falta.",
    ],
    evitar: ["Passar por cima de pessoas para ‘ganhar’ o dia.", "Trabalhar sem parar e chamar isso de foco."],
    palavrasChave: ["resultado", "poder", "dinheiro", "meta", "responsabilidade"],
  },
  9: {
    energia: "Encerrar",
    titulo: "Dia de conclusão e generosidade",
    descricao:
      "Hoje pede fechar, limpar e soltar — não abrir ciclo longo. Conclua, doe, perdoe o que couber e dê de si sem se esvaziar.",
    profundidade:
      "É um dia de síntese: conclusão, compaixão e liberação. Ideal para terminar algo, limpar um espaço, fazer um follow-up ou um gesto generoso. Não é dia de compromisso de longo prazo nem de começar obra grande. A armadilha é o martírio — ‘doar’ até ficar ressentido. Generosidade real deixa você íntegro, não esgotado.",
    clima: "Fechamentos, limpeza, doação, perdão prático e descanso após um ciclo.",
    sombra: "Martírio, nostalgia que prende ou começar o que deveria terminar.",
    reflexao: "O que já cumpriu o tempo e ainda ocupa espaço na sua vida?",
    acoes: [
      "Feche uma pendência ou limpe um espaço físico ou mental.",
      "Faça um gesto generoso concreto sem esperar retorno.",
      "Solte uma cobrança interna ou externa que já não serve.",
    ],
    evitar: ["Assinar compromisso longo ‘no impulso do coração’.", "Carregar mágoa e chamar isso de virtude."],
    palavrasChave: ["conclusão", "liberação", "generosidade", "ciclo", "limpeza"],
  },
  11: {
    energia: "Intuir",
    titulo: "Dia de intuição fina",
    descricao:
      "A antena sobe. Clareza súbita, empatia e um pouco de nervosismo podem vir juntos. Aterre uma intuição em um gesto — não fique só na visão.",
    profundidade:
      "É um dia de sensibilidade elevada e radar fino. Confie no que vem com quietude, não com pânico. Você pode absorver o clima alheio com mais força — proteja o sistema nervoso. O risco é acumular insight sem materializar nada. Canalize: anote, escolha uma coisa e execute um microgesto no mundo real. Visão precisa de chão.",
    clima: "Intuição, inspiração, conexão sutil, certeza interior e empatia.",
    sombra: "Ansiedade elétrica, desconexão do corpo ou visão sem ação.",
    reflexao: "Qual insight de hoje merece um passo concreto — não só mais reflexão?",
    acoes: [
      "Anote o insight mais forte antes que escape.",
      "Traduza uma intuição em uma ação simples hoje.",
      "Reduza estímulo — tela, barulho — em um bloco do dia.",
    ],
    evitar: ["Absorver a tensão de todo mundo.", "Idealizar e não aterrar nada."],
    palavrasChave: ["intuição", "canal", "sensibilidade", "ancoragem", "clareza"],
  },
  22: {
    energia: "Construir",
    titulo: "Dia de obra com visão",
    descricao:
      "Dia de construir algo que importa além de você. Idealismo com pragmatismo: coloque uma pedra real na estrutura — não só no sonho.",
    profundidade:
      "É um dia de visão grande com mão na massa. A pressão pode ser alta — a lacuna entre o sonho e a realidade paralisa. A resposta é começar a construir, não terminar a catedral hoje. Organize recurso, prazo ou pessoa. Sem estrutura, a missão vira ansiedade; com estrutura, vira progresso que se mede. Uma pedra de cada vez.",
    clima: "Projetos de impacto, planejamento sério, mobilização e legado prático.",
    sombra: "Paralisia pelo tamanho, controlismo ou negar a própria necessidade.",
    reflexao: "Qual pedra concreta você coloca hoje num projeto maior?",
    acoes: [
      "Avance uma peça mensurável do projeto importante.",
      "Alinhe uma pessoa ou recurso à visão — sem carregar tudo sozinho.",
      "Defina o próximo prazo realista e cumpra só ele hoje.",
    ],
    evitar: ["Querer resolver a obra inteira numa tarde.", "Justificar pressão excessiva pela ‘missão’."],
    palavrasChave: ["legado", "estrutura", "escala", "execução", "visão"],
  },
  33: {
    energia: "Curar",
    titulo: "Dia de amor em ação",
    descricao:
      "Dia de cura e ensino pelo gesto. Acolha com presença — e cuide de si para o serviço não virar esvaziamento.",
    profundidade:
      "É um dia de compaixão ativa. Sua presença pode aliviar, ensinar ou reconciliar. O perigo é o mártir: absorver dor alheia até colapsar. Escolha um gesto de cuidado genuíno e um limite claro. Amor sem fronteira não é virtude — é burnout. Plenitude primeiro; serviço depois. Inclua você na conta.",
    clima: "Cura, ensino, acolhimento, compaixão prática e reconciliação.",
    sombra: "Martírio, culpa ou responsabilidade pela felicidade dos outros.",
    reflexao: "A quem você oferece presença real hoje — inclusive a si?",
    acoes: [
      "Ofereça um gesto de cuidado concreto a alguém.",
      "Nomeie um limite saudável sem se explicar demais.",
      "Aceite cuidado de alguém — não só ofereça.",
    ],
    evitar: ["Salvar todo mundo.", "Usar ‘missão espiritual’ para evitar a própria vida."],
    palavrasChave: ["cura", "compaixão", "serviço", "limite", "presença"],
  },
};
