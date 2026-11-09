import type { EnergiaNumerologica } from "./energiaNumerologica";

/** Gesto do dia pessoal — escala de 24h (não é o mês nem o clima coletivo). */
export const DIAS_PESSOAIS: Record<number, EnergiaNumerologica> = {
  1: {
    energia: "Iniciar",
    titulo: "Dia de iniciativa",
    descricao:
      "Hoje a energia favorece o primeiro passo: projeto, conversa ou decisão que só anda se você assumir a autoria. É o seu tempo de agir — não de esperar o cenário perfeito.",
    profundidade:
      "Em numerologia, o Dia Pessoal 1 é o mais curto ciclo de começo: coragem, independência e movimento. Você tende a sentir mais ambição e clareza sobre o que quer. Use isso para abrir uma frente só. A sombra do 1 no dia é empurrar os outros para fora do quadro e insistir só no seu ponto de vista. Inicie com firmeza e sem atropelar quem precisa estar no jogo.",
    clima: "Começos, autonomia, propostas, primeiro contato, coragem pontual.",
    sombra: "Teimosia, pressa egocêntrica, ignorar quem também importa na decisão.",
    reflexao: '"Qual único começo de hoje muda o resto da semana se você der o passo?"',
    acoes: [
      "Abra a única coisa que mais adia — uma versão simples já conta.",
      "Envie a mensagem ou proposta que está pronta na cabeça.",
      "Diga em voz alta o que decidiu começar; fica mais difícil voltar atrás.",
    ],
    evitar: ["Abrir três frentes novas no mesmo dia.", "Esperar autorização externa para o que só você pode iniciar."],
    palavrasChave: ["início", "autoria", "coragem", "foco", "independência"],
  },
  2: {
    energia: "Escutar",
    titulo: "Dia de receptividade",
    descricao:
      "Hoje pede escuta antes da decisão. Reúna informação, toque base com quem importa e evite conflito desnecessário. Diplomacia rende mais do que força bruta.",
    profundidade:
      "O Dia Pessoal 2 desacelera o impulso do 1: parceria, tato e timing. É bom para conversas delicadas, acordos e romance — e para sentir o que o ambiente devolve antes de avançar. Se a sensibilidade subir (especialmente em ecos de 11), não interprete tensão como fracasso: é o radar ligado. Ouça até o fim. Quem responde cedo demais perde o que o dia quer entregar.",
    clima: "Diálogos, feedback, paciência, conexão, informação antes de agir.",
    sombra: "Indecisão paralisante, absorver o humor alheio, evitar o assunto difícil.",
    reflexao: '"O que você ainda não ouviu porque já tinha a resposta pronta?"',
    acoes: [
      "Marque ou retome a conversa que vem empurrando — e ouça até o fim.",
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
      "Hoje a vida pede que você diga, escreva, crie ou socialize. Ideias e encontros ganham força quando saem da cabeça. Leveza ajuda — dispersão atrapalha.",
    profundidade:
      "O Dia Pessoal 3 favorece comunicação, humor, networking e projetos criativos. É ótimo para retomar contatos, brainstorm e se mostrar com verdade. O risco clássico é espalhar energia em dez ideias e não fechar nenhuma, ou gastar demais (tempo, dinheiro, atenção) no prazer do momento. Escolha um canal de expressão e vá até o fim nele. Otimismo é combustível; falta de foco é o vazamento.",
    clima: "Conversas, criação, networking, humor, presença social.",
    sombra: "Dispersão, superficialidade, gastar sem limite, falar para preencher o silêncio.",
    reflexao: '"O que precisa sair de você hoje — e para quem?"',
    acoes: [
      "Diga ou escreva a frase que está pronta há dias.",
      "Mostre um trabalho/ideia que ainda está guardado.",
      "Retome um contato importante com leveza e clareza.",
    ],
    evitar: ["Abrir dez frentes criativas.", "Usar piada para não falar do que importa."],
    palavrasChave: ["expressão", "criatividade", "rede", "clareza", "leveza"],
  },
  4: {
    energia: "Estruturar",
    titulo: "Dia de base e detalhe",
    descricao:
      "Hoje favorece rotina, contas, organização e trabalho concreto. O que está emperrado por falta de ordem pode andar se você tratar o detalhe com seriedade.",
    profundidade:
      "O Dia Pessoal 4 é o dia do ofício: arquivo, planilha, casa, corpo, pendência técnica. Não é glamour — é fundação. Em ecos de 22, a pressão por ‘entregar grande’ pode aparecer; responda com um bloco de trabalho real, não com fantasia de escala. Frustração com a pilha é comum: escolha uma tarefa e conclua. Atalho hoje vira retrabalho amanhã.",
    clima: "Organização, disciplina, casa, finanças práticas, entrega pontual.",
    sombra: "Rigidez, sobrecarga de tarefas, perfeccionismo que impede entregar.",
    reflexao: '"Qual pendência concreta, se fechada hoje, libera o resto?"',
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
      "Espere ajustes de plano, imprevistos e vontade de ar. Hoje favorece experiência nova, deslocamento e promoção de si — não papelada monótona.",
    profundidade:
      "O Dia Pessoal 5 traz liberdade, variação e surpresa. Roteiros rígidos racham; quem se adapta aproveita. É bom para viagem curta, pitch, experimentar, sair do automático. A sombra é impaciência, exagero (comida, tela, estímulo) e decidir no calor do momento. Dê espaço para o dia respirar, mas não quebre um compromisso importante só pela euforia do novo.",
    clima: "Imprevisto útil, promoção, deslocamento, experimentação, ar fresco.",
    sombra: "Impulsividade, excesso, fuga da responsabilidade, irritação com o rotineiro.",
    reflexao: '"O que precisa de flexibilidade hoje — e o que ainda é inegociável?"',
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
      "O Dia Pessoal 6 pede harmonia, serviço e atenção às pessoas próximas. Demandas alheias podem aumentar; respeite o compromisso sem se tornar salvador. É bom para família, cuidado com o corpo, beleza útil, jantar a dois, reconciliar. A armadilha é se anular ‘pelo bem de todos’ e depois guardar raiva. Equilíbrio: você também entra na conta do cuidado.",
    clima: "Casa, família, deveres, afeto concreto, cura pontual.",
    sombra: "Excesso de responsabilidade, martírio, controlar quem você ‘ajuda’.",
    reflexao: '"Você está cuidando porque quer — ou porque tem medo de decepcionar?"',
    acoes: [
      "Faça um gesto concreto de presença com alguém próximo.",
      "Cuide do corpo (alimentação, descanso, atendimento) como prioridade do dia.",
      "Cumpra um dever doméstico ou relacional sem drama.",
    ],
    evitar: ["Resolver a vida dos outros.", "Dar tanto que a raiva fica guardada."],
    palavrasChave: ["cuidado", "lar", "dever", "afeto", "equilíbrio"],
  },
  7: {
    energia: "Aprofundar",
    titulo: "Dia de silêncio útil",
    descricao:
      "Hoje favorece estudo, reflexão e distância do barulho. Evite confronto e agenda social densa. A resposta vem quando você para de empurrar.",
    profundidade:
      "O Dia Pessoal 7 é introspectivo: pesquisa, meditação, análise, natureza, hobby quieto. Não é o melhor dia para forçar networking ou briga. Em ecos intensos, a tendência a levar tudo para o pessoal sobe — dê um passo atrás. Revise o plano do mês, leia, caminhe. Isolamento útil esclarece; sumir por fuga só adia o que precisa ser visto.",
    clima: "Estudo, introspecção, análise, descanso nervoso, insight.",
    sombra: "Isolamento defensivo, frieza, overthinking, evitar gente necessária.",
    reflexao: '"O que você já sabe e ainda não admite para si?"',
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
      "Hoje favorece negócios, dinheiro, autoridade e resultado. Confiança sobe — use para negociar e decidir, não para dominar.",
    profundidade:
      "O Dia Pessoal 8 é o campo da manifestação material: reunião importante, compra consciente, cobrança justa, meta. Você pode sentir mais drive e presença. Mostre competência. A sombra é controle, workaholism e medir o valor do dia só pelo status. Firmeza com ética constrói; força sem medida queima relação e reputação.",
    clima: "Finanças, carreira, negociação, meta, autoridade saudável.",
    sombra: "Domínio, pressão excessiva, ambição sem escrúpulo, esgotamento.",
    reflexao: '"Onde você está cobrando menos — ou impondo mais — do que é justo?"',
    acoes: [
      "Trate o assunto concreto (preço, acordo, decisão) até o próximo passo claro.",
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
      "O Dia Pessoal 9 sintetiza o ciclo: conclusão, compaixão, liberação. Ideal para terminar projeto, limpar casa/escritório, follow-ups, aparição pública breve, gesto generoso. Não é dia de compromisso de longo prazo nem de começar obra grande. A armadilha é o martírio — ‘doar’ até ficar ressentido. Generosidade real deixa você íntegro, não esgotado.",
    clima: "Fechamentos, limpeza, doação, perdão prático, descanso após ciclo.",
    sombra: "Martírio, nostalgia que prende, começar o que deveria terminar.",
    reflexao: '"O que já cumpriu o tempo e ainda ocupa espaço na sua vida?"',
    acoes: [
      "Feche uma pendência ou limpe um espaço físico/mental.",
      "Faça um gesto generoso concreto sem esperar retorno.",
      "Solte uma cobrança interna ou externa que já não serve.",
    ],
    evitar: ["Assinar compromisso longo ‘no impulso do coração’.", "Carregar mágoa e chamar isso de virtude."],
    palavrasChave: ["conclusão", "liberação", "generosidade", "ciclo", "limpeza"],
  },
  11: {
    energia: "Intuir",
    titulo: "Dia mestre 11 — insight",
    descricao:
      "A antena sobe. Clareza súbita, empatia e nervosismo podem vir juntos. Aterre uma intuição em um gesto — não fique só na visão.",
    profundidade:
      "O 11 no dia pessoal é um 2 elevado: sensibilidade espiritual e radar fino. Confie no gut quando vier com quietude, não com pânico. Você pode absorver o clima alheio com mais força — proteja o sistema nervoso. O risco do 11 é promessa sem materialização: muitos insights, zero passo. Canalize: anote, decida uma coisa, execute um microgesto no mundo real.",
    clima: "Intuição, inspiração, conexão sutil, certeza interior, empatia.",
    sombra: "Ansiedade elétrica, desconexão do corpo, visão sem ação.",
    reflexao: '"Qual insight de hoje merece um passo concreto — não só mais reflexão?"',
    acoes: [
      "Anote o insight mais forte antes que escape.",
      "Traduza uma intuição em uma ação simples hoje.",
      "Reduza estímulo (tela, barulho) em um bloco do dia.",
    ],
    evitar: ["Absorver a tensão de todo mundo.", "Idealizar e não aterrar nada."],
    palavrasChave: ["mestre", "intuição", "canal", "sensibilidade", "ancoragem"],
  },
  22: {
    energia: "Construir",
    titulo: "Dia mestre 22 — obra com visão",
    descricao:
      "Dia de construir algo que importa além de você. Idealismo com pragmatismo: coloque uma pedra real na estrutura — não só no sonho.",
    profundidade:
      "O 22 no dia é o construtor mestre: escala de legado com mão na massa (raiz 4). A pressão pode ser grande — a lacuna entre visão e realidade paralisa. Resposta: comece a construir, não termine a catedral hoje. Organize recurso, prazo ou pessoa. Sem estrutura, o 22 vira ansiedade de missão; com estrutura, vira progresso mensurável.",
    clima: "Projetos de impacto, planejamento sério, mobilização, legado prático.",
    sombra: "Paralisia pelo tamanho, controlismo, negar necessidade pessoal.",
    reflexao: '"Qual pedra concreta você coloca hoje num projeto maior?"',
    acoes: [
      "Avance uma peça mensurável do projeto importante.",
      "Alinhe uma pessoa ou recurso à visão — sem carregar tudo sozinho.",
      "Defina o próximo prazo realista e cumpra só ele hoje.",
    ],
    evitar: ["Querer resolver a obra inteira numa tarde.", "Justificar pressão excessiva pela ‘missão’."],
    palavrasChave: ["mestre", "legado", "estrutura", "escala", "execução"],
  },
  33: {
    energia: "Curar",
    titulo: "Dia mestre 33 — amor em ação",
    descricao:
      "Dia de cura e ensino pelo gesto. Acolha com presença — e cuide de si para o serviço não virar esvaziamento.",
    profundidade:
      "O 33 no dia é compaixão ativa (raiz 6 elevada). Sua presença pode aliviar, ensinar ou reconciliar. O perigo é o mártir: absorver dor alheia até colapsar. Escolha um gesto de cuidado genuíno e um limite claro. Amor sem fronteira não é virtude — é burnout. Plenitude primeiro; serviço depois.",
    clima: "Cura, ensino, acolhimento, compaixão prática, reconciliação.",
    sombra: "Martírio, culpa, responsabilidade pela felicidade dos outros.",
    reflexao: '"A quem você oferece presença real hoje — inclusive a si?"',
    acoes: [
      "Ofereça um gesto de cuidado concreto a alguém.",
      "Nomeie um limite saudável sem se explicar demais.",
      "Aceite cuidado de alguém — não só ofereça.",
    ],
    evitar: ["Salvar todo mundo.", "Usar ‘missão espiritual’ para evitar a própria vida."],
    palavrasChave: ["mestre", "cura", "compaixão", "serviço", "limite"],
  },
};
