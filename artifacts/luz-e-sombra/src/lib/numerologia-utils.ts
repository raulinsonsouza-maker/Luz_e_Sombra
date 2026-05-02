export interface MesPessoal {
  mesNumero: number
  soma: number
  reduzido: number
  mesNome: string
  energia: string
  descricao: string
  profundidade: string
  reflexao: string
  acoes: string[]
  evitar: string[]
  areas: string[]
}

// ─── Digit helpers ─────────────────────────────────────────────────────────

export function somaDigitosString(str: string): number {
  return str.replace(/[^0-9]/g, '').split('').reduce((acc, d) => acc + Number(d), 0)
}

export function reduzirNumeroSimples(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num
  let n = num
  while (n > 9) {
    n = String(n).split('').reduce((a, b) => a + Number(b), 0)
    if (n === 11 || n === 22 || n === 33) return n
  }
  return n
}

export function reduzirNumeroForcando(num: number): number {
  let n = num
  while (n > 9) n = String(n).split('').reduce((a, b) => a + Number(b), 0)
  return n
}

export function formatPassosReducao(value: number): string {
  const passos = []
  let n = value
  passos.push(String(n))
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, b) => a + Number(b), 0)
    passos.push(String(n))
  }
  return passos.join(' → ')
}

// ─── Pythagorean letter → number ───────────────────────────────────────────

const TABELA_PITAGORICA: Record<string, number> = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9,
}

const VOGAIS = new Set(['A', 'E', 'I', 'O', 'U'])

function normalizar(nome: string): string {
  return nome
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '')
}

function somaLetras(letras: string[]): number {
  return letras.reduce((acc, l) => acc + (TABELA_PITAGORICA[l] || 0), 0)
}

// ─── Core Numerology Calculations ──────────────────────────────────────────

export function calcularAnoUniversal(ano: number) {
  const soma = somaDigitosString(String(ano))
  const reduzido = reduzirNumeroSimples(soma)
  return { ano, soma, reduzido, passos: formatPassosReducao(soma) }
}

export function calcularAnoPessoal(dataNascimentoDDMMYYYY: string, anoAnalise: number) {
  const parts = dataNascimentoDDMMYYYY.split('/')
  if (parts.length !== 3) return null
  const dia = Number(parts[0])
  const mes = Number(parts[1])
  const somaAnoDigits = somaDigitosString(String(anoAnalise))
  const somaTotal = dia + mes + somaAnoDigits
  const reduzido = reduzirNumeroSimples(somaTotal)
  const reduzidoForcado = reduzirNumeroForcando(somaTotal)
  return {
    dataNascimento: dataNascimentoDDMMYYYY,
    dia, mes, anoAnalise, somaAnoDigits, somaTotal,
    reduzido, reduzidoForcado,
    passos: formatPassosReducao(somaTotal),
  }
}

export interface ResultadoNumero {
  valor: number
  soma: number
  passos: string
}

export function calcularNumerodeVida(dataNascimentoDDMMYYYY: string): ResultadoNumero | null {
  const parts = dataNascimentoDDMMYYYY.split('/')
  if (parts.length !== 3) return null
  const dia = Number(parts[0])
  const mes = Number(parts[1])
  const somaAno = somaDigitosString(parts[2])
  const soma = dia + mes + somaAno
  const valor = reduzirNumeroSimples(soma)
  return { valor, soma, passos: `${dia} + ${mes} + ${somaAno} → ${formatPassosReducao(soma)}` }
}

export function calcularNumerodeExpressao(nome: string): ResultadoNumero {
  const letras = normalizar(nome).split('')
  const soma = somaLetras(letras)
  const valor = reduzirNumeroSimples(soma)
  return { valor, soma, passos: formatPassosReducao(soma) }
}

export function calcularNumerodaAlma(nome: string): ResultadoNumero {
  const letras = normalizar(nome).split('').filter(l => VOGAIS.has(l))
  const soma = somaLetras(letras)
  const valor = reduzirNumeroSimples(soma)
  return { valor, soma, passos: formatPassosReducao(soma) }
}

export function calcularNumerodaPersonalidade(nome: string): ResultadoNumero {
  const letras = normalizar(nome).split('').filter(l => !VOGAIS.has(l) && TABELA_PITAGORICA[l])
  const soma = somaLetras(letras)
  const valor = reduzirNumeroSimples(soma)
  return { valor, soma, passos: formatPassosReducao(soma) }
}

export function formatarDataBrasileira(dataISO: string): string {
  if (!dataISO) return ''
  const partes = dataISO.split('-')
  if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`
  return dataISO
}

export function construirTabelaNascimento(dataNascimentoDDMMYYYY: string): Record<number, number> {
  const tabela: Record<number, number> = {}
  for (let i = 1; i <= 9; i++) tabela[i] = 0
  const apenasNumeros = dataNascimentoDDMMYYYY.replace(/[^0-9]/g, '')
  for (const char of apenasNumeros) {
    const num = parseInt(char)
    if (num >= 1 && num <= 9) tabela[num]++
  }
  return tabela
}

// ─── Personal Months ────────────────────────────────────────────────────────

export function calcularMesesPessoais(anoPessoal: number, anoAnalise: number): MesPessoal[] {
  const meses: MesPessoal[] = []
  for (let m = 1; m <= 12; m++) {
    const soma = anoPessoal + m
    const reduzido = reduzirNumeroForcando(soma)
    const mesInfo = gerarDescricaoMesPessoal(m, reduzido)
    mesInfo.soma = soma
    meses.push(mesInfo)
  }
  return meses
}

function gerarDescricaoMesPessoal(numeroMesCalendario: number, numeroEnergia: number): MesPessoal {
  const nomeMeses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
    'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  const mesNome = nomeMeses[numeroMesCalendario - 1]

  type EnergiaInfo = {
    energia: string
    descricao: string
    profundidade: string
    reflexao: string
    acoes: string[]
    evitar: string[]
    areas: string[]
  }

  const energias: Record<number, EnergiaInfo> = {
    1: {
      energia: 'Início e Ação',
      descricao: 'Mês de iniciativa, liderança e novos começos. A energia do 1 ativa o impulso criador — aquele que planta as sementes do que virá.',
      profundidade: 'Este não é apenas um mês de começar coisas — é um mês de reivindicar autoria sobre sua própria vida. Cada decisão tomada com coragem aqui ecoa nos meses seguintes. O universo tende a apoiar quem age com convicção, mesmo quando a certeza ainda não chegou. A qualidade dos inícios que você cria neste mês determina a qualidade da colheita que virá. Pergunte-se: estou agindo por genuína visão ou por hábito e medo do vazio? A diferença é tudo.',
      reflexao: '"O que tenho esperado permissão para começar — e o que mudaria se eu simplesmente começasse hoje?"',
      acoes: [
        'Iniciar o projeto mais importante que você tem adiado — mesmo que em versão imperfeita',
        'Definir com clareza 1 a 3 metas concretas para os próximos 3 meses',
        'Investir em sua visibilidade: escreva, fale, mostre seu trabalho',
        'Tomar uma decisão corajosa que você vem postergando por "falta do momento certo"',
        'Criar ou revisar um ritual matinal que fortaleça sua presença e foco',
        'Fazer contato estratégico com alguém que pode abrir portas relevantes para você',
        'Anunciar uma intenção importante — tornar público aquilo que você quer criar responsabiliza e energiza',
      ],
      evitar: [
        'Esperar condições perfeitas — elas raramente chegam antes da ação',
        'Buscar validação externa excessiva antes de agir',
        'Iniciar tantas coisas que nenhuma avança de fato',
        'Confundir impulsividade com coragem — aja, mas com intenção',
      ],
      areas: ['Novos projetos e iniciativas', 'Liderança e visibilidade', 'Marca pessoal e posicionamento', 'Tomada de decisão e autonomia'],
    },
    2: {
      energia: 'Cooperação e Parcerias',
      descricao: 'Mês de sensibilidade, diplomacia e relações. A percepção das pessoas ao seu redor está aguçada — use essa inteligência emocional como ferramenta.',
      profundidade: 'A força sutil da cooperação entra em foco neste mês. Este não é o tempo dos heróis solitários — é o tempo das alianças bem construídas, das negociações pacientes e das relações que se aprofundam. Sua capacidade de sentir o que os outros precisam antes que digam em voz alta está amplificada. Use isso sabiamente. A paciência aqui não é passividade: é uma forma de inteligência estratégica. Decisões tomadas com pressa neste mês tendem a custar mais do que as tomadas com cuidado. Pergunte-se: estou realmente ouvindo — ou apenas esperando minha vez de falar?',
      reflexao: '"Onde estou sacrificando minha autenticidade para manter uma paz que não é verdadeira — e como seria uma conexão genuína nessa relação?"',
      acoes: [
        'Ter uma conversa profunda e honesta com alguém que importa para você',
        'Identificar e fortalecer sua parceria mais estratégica — profissional ou pessoal',
        'Praticar escuta ativa: responda só depois de compreender completamente',
        'Negociar acordos ou contratos pendentes com cuidado e paciência',
        'Dedicar tempo a reparar uma relação que foi abalada recentemente',
        'Criar uma meta compartilhada com um parceiro, colega ou colaborador',
        'Buscar mediação externa para um conflito que você sozinho(a) não consegue resolver',
      ],
      evitar: [
        'Tomar decisões unilaterais que afetam outras pessoas sem consulta',
        'Provocar conflitos desnecessários por impaciência',
        'Engolir suas próprias necessidades para evitar confronto — isso gera ressentimento',
        'Confiar em alguém sem verificar se a confiança é merecida',
      ],
      areas: ['Parcerias profissionais e pessoais', 'Negociação e diplomacia', 'Inteligência emocional e empatia', 'Resolução de conflitos e cura de relações'],
    },
    3: {
      energia: 'Expressão e Criatividade',
      descricao: 'Mês de comunicação, criação e expansão social. Sua voz carrega peso incomum — o que você expressa com autenticidade ressoa e se expande.',
      profundidade: 'Há uma diferença fundamental entre performance e expressão genuína: a performance busca aprovação; a expressão busca verdade. Este mês, você é convidado(a) a parar de ensaiar e começar a dizer. O que você criar agora tem energia amplificada — não porque seja perfeito, mas porque o momento está alinhado. Conexões sociais iniciadas neste mês tendem a ser mais duradouras do que o comum. A alegria não é frívola este mês: ela é um bússola que aponta para onde sua energia deve ir.',
      reflexao: '"O que tenho medo de expressar — e de quem ainda busco aprovação para ter permissão de falar?"',
      acoes: [
        'Completar e compartilhar uma criação que você tem guardado por medo de julgamento',
        'Falar sua verdade em uma conversa que você vem adiando',
        'Escrever, gravar ou publicar algo que representa sua voz autêntica',
        'Participar ou criar um evento que conecte você a pessoas inspiradoras',
        'Investir em uma habilidade de comunicação: oratória, escrita, storytelling',
        'Reconnectar-se com a leveza e o jogo que a vida adulta séria tende a suprimir',
        'Lançar um projeto criativo — mesmo que incompleto, mesmo que imperfeito',
      ],
      evitar: [
        'Dispersar a energia criativa em muitos projetos inacabados simultaneamente',
        'Usar humor ou leveza como escudo contra profundidade emocional real',
        'Gastar impulsivamente com obrigações sociais que não nutrem',
        'Deixar o medo de crítica silenciar sua expressão autêntica',
      ],
      areas: ['Projetos criativos e expressão artística', 'Comunicação, conteúdo e marketing', 'Expansão social e novas conexões significativas', 'A alegria como prática intencional'],
    },
    4: {
      energia: 'Organização e Construção',
      descricao: 'Mês de disciplina, método e fundações. Cada grande obra começa com os fundamentos invisíveis que ninguém aplaude mas todos dependem.',
      profundidade: 'O trabalho silencioso e metódico é o tema deste mês. Não é glamouroso — mas é absolutamente necessário. As estruturas que você constrói agora (hábitos, sistemas, processos financeiros, rotinas de saúde) são a base sobre a qual tudo mais se apoia. Este mês recompensa quem abraça o esforço consistente e penaliza quem busca atalhos. Pergunte-se: que área da minha vida está construída sobre areia — e o que seria necessário para criar uma fundação verdadeiramente sólida?',
      reflexao: '"Que área da minha vida está em desordem — e como seria ter ali uma estrutura confiável e duradoura?"',
      acoes: [
        'Fazer uma auditoria financeira completa: contas, dívidas, assinaturas, investimentos',
        'Criar ou refinar os sistemas centrais do seu trabalho — templates, processos, checklists',
        'Estabelecer uma rotina de saúde e manter por todo o mês sem exceções',
        'Revisar e atualizar documentos importantes: contratos, seguros, registros legais',
        'Atacar um projeto que exige esforço sustentado que você tem evitado',
        'Desenhar o cronograma que tornaria sua semana ideal possível — e testá-lo',
        'Investir em ferramentas ou treinamentos que aumentem sua eficiência operacional',
      ],
      evitar: [
        'Rigidez excessiva que impede adaptação quando as circunstâncias pedem',
        'Perfeccionismo que adia indefinidamente o início ou a entrega',
        'Trabalho excessivo sem períodos de recuperação programados',
        'Usar ocupação constante como fuga do que emocionalmente precisa ser processado',
      ],
      areas: ['Produtividade e sistemas de trabalho', 'Organização financeira e planejamento', 'Saúde, disciplina e rotinas físicas', 'Ordem administrativa e legal'],
    },
    5: {
      energia: 'Mudança e Liberdade',
      descricao: 'Mês de transformação, oportunidades inesperadas e expansão. O que parece disrupção pode ser libertação em disfarce — depende da perspectiva.',
      profundidade: 'O universo rearranja o cenário neste mês. O que você experimenta como interrupção muitas vezes é a vida removendo o que estava impedindo seu crescimento. Sua tarefa não é controlar a mudança — é desenvolver a agilidade emocional para fluir com ela. Rigidez aqui tem um custo alto; flexibilidade tem uma recompensa proporcional. O convite é: expanda. Vá além dos limites que você mesmo(a) se impôs. A pergunta mais honesta: o que você tem segurado por hábito ou medo — não porque genuinamente pertença ao seu futuro?',
      reflexao: '"O que estou segurando por costume ou por medo — não porque verdadeiramente pertença a quem estou me tornando?"',
      acoes: [
        'Agir sobre uma mudança que você vem adiando — a vida está tentando mostrar algo',
        'Planejar ou realizar uma viagem, mesmo curta, para mudar sua perspectiva',
        'Experimentar uma abordagem completamente diferente para um desafio persistente',
        'Liberar uma obrigação, relação ou hábito que drena energia sem nutrir',
        'Buscar uma experiência de aprendizado em uma área totalmente diferente da sua expertise',
        'Dizer sim a uma oportunidade inesperada antes de analisá-la exaustivamente',
        'Criar espaço em sua agenda para o inesperado — improvise algo esta semana',
      ],
      evitar: [
        'Apegar-se à zona de conforto quando o universo claramente o(a) está empurrando para além dela',
        'Impulsividade financeira ou relacional motivada pela excitação do novo',
        'Tomar decisões irreversíveis em estado de agitação — mudança não é o mesmo que caos',
        'Dispersar energia em tantas direções que nenhuma experiência é verdadeiramente integrada',
      ],
      areas: ['Transições de vida e pivôs de carreira', 'Viagens e novos ambientes', 'Aprendizado e expansão intelectual', 'Liberação de hábitos e situações limitantes'],
    },
    6: {
      energia: 'Responsabilidade e Harmonia',
      descricao: 'Mês do coração e das relações próximas. Família, lar e comunidade pedem atenção genuína — não de obrigação, mas de amor consciente.',
      profundidade: 'O amor como ação prática é o tema deste mês. Não o amor romântico e idealizado — mas o amor que organiza a casa, que tem a conversa difícil, que está presente quando a outra pessoa mais precisa. Seu lar (tanto o físico quanto o interno) precisa de cuidado. A qualidade do ambiente em que você vive afeta diretamente a qualidade do seu estado interno. Pergunte-se: estou cuidando dos outros a partir de abundância — ou a partir do medo de perder amor? A diferença é a fronteira entre cuidado e codependência.',
      reflexao: '"Onde nas minhas relações estou dando a partir da abundância — e onde estou dando a partir do medo de não ser amado(a)?"',
      acoes: [
        'Dedicar tempo de qualidade às relações mais importantes — sem telefone, sem agenda',
        'Ter uma conversa que você vem evitando sobre uma dinâmica relacional que não está funcionando',
        'Embelezar seu espaço de vida ou trabalho — o ambiente molda o estado interno',
        'Praticar um ato genuíno de serviço para alguém na sua comunidade',
        'Abordar com coragem uma questão familiar que está esperando atenção há tempo',
        'Revisar sua saúde — não como obrigação, mas como ato de amor próprio radical',
        'Formalizar um compromisso importante que você tem deixado indefinido',
      ],
      evitar: [
        'Dar tanto que o ressentimento se acumula silenciosamente',
        'Usar "cuidar dos outros" como desculpa para não cuidar de si mesmo(a)',
        'Impor sua visão de harmonia a pessoas que não pediram sua intervenção',
        'Negligenciar suas próprias necessidades em nome de um amor que não tem fronteiras',
      ],
      areas: ['Família e relações íntimas', 'Lar e ambiente físico', 'Saúde e autocuidado profundo', 'Serviço e comunidade'],
    },
    7: {
      energia: 'Reflexão e Estudo',
      descricao: 'Mês de introspecção, investigação e profundidade. Os insights mais transformadores não virão de reuniões ou mais informação — virão do silêncio.',
      profundidade: 'O silêncio é o professor deste mês. Em uma cultura que glorifica a produtividade constante e o barulho perpétuo, a prática deliberada de ir para dentro é um ato de coragem. Sua intuição está aguçada — mais do que o normal. O que você sente como verdade, mas que sua mente racional ainda resiste em aceitar? Este mês, contemple mais e analise menos. As respostas que você busca não estão em mais dados — estão em uma camada de consciência que só se revela quando você para de buscar ativamente.',
      reflexao: '"O que eu sei, nas profundezas de mim mesmo(a), que minha mente racional tem se recusado a reconhecer?"',
      acoes: [
        'Reservar períodos deliberados de solidão e silêncio — pelo menos 2 horas por semana',
        'Escolher um tema de fascínio genuíno e estudá-lo com rigor real',
        'Praticar meditação diariamente, mesmo que apenas 15 minutos',
        'Escrever em diário sem prompt — deixe surgir o que precisa surgir',
        'Consultar um terapeuta, mentor ou sábio sobre uma questão que pesa',
        'Reduzir compromissos sociais que drenam sem nutrir',
        'Dormir mais do que o habitual — o inconsciente processa à noite o que a mente não consegue durante o dia',
      ],
      evitar: [
        'Esconder-se da vida sob a aparência de contemplação',
        'Isolamento que vai além da solitude e vira solidão não escolhida',
        'Cinismo e niilismo gerados pelo excesso de análise',
        'Negligenciar o corpo em favor da mente',
      ],
      areas: ['Pesquisa pessoal e desenvolvimento intelectual', 'Prática espiritual e vida interior', 'Planejamento estratégico de longo prazo', 'Terapia, mentoria e autoconhecimento profundo'],
    },
    8: {
      energia: 'Realização e Poder',
      descricao: 'Mês de resultados, autoridade e materialização. O universo alinha recursos para quem está preparado para agir com poder e integridade.',
      profundidade: 'A energia executiva está no pico neste mês. O universo não distribui poder aleatoriamente — ele o entrega a quem está pronto para usá-lo com responsabilidade. Este é o mês para pedir o que você vale, fechar os acordos que importam, e resgatar o poder que você inconscientemente cedeu a outros — seja no trabalho, nas finanças, ou nas relações. Abundância não é apenas material: é um estado de consciência que atrai resultados materiais. Você está cobrando pelo que seu trabalho genuinamente vale?',
      reflexao: '"Onde tenho jogado menor do que meu potencial — e o que eu faria diferente se realmente acreditasse no meu próprio valor?"',
      acoes: [
        'Negociar um aumento, contrato ou acordo comercial que você vem postergando',
        'Implementar um plano financeiro ou revisar seus investimentos com seriedade',
        'Buscar uma promoção ou posição de liderança com esforço visível e ativo',
        'Tomar uma decisão significativa que você evitou pela responsabilidade que carrega',
        'Revisar sua precificação — você cobra o que seu trabalho genuinamente vale?',
        'Eliminar vazamentos financeiros: gastos recorrentes sem propósito real',
        'Mentorar ou patrocinar alguém menos experiente — poder se amplifica quando generosamente compartilhado',
      ],
      evitar: [
        'Crueldade em nome da ambição — sua reputação é um ativo de longo prazo',
        'Usar poder para compensar insegurança interna',
        'Workaholism disfarçado de disciplina',
        'Negligenciar saúde física e emocional em busca de resultados materiais',
      ],
      areas: ['Avanço profissional e reconhecimento', 'Estratégia financeira e construção de patrimônio', 'Desenvolvimento de negócios e negociação', 'Liderança e autoridade consciente'],
    },
    9: {
      energia: 'Conclusão e Liberação',
      descricao: 'Mês de encerramentos sagrados, desapego consciente e serviço. A arte de terminar bem é tão poderosa quanto a de começar.',
      profundidade: 'O portal da conclusão está aberto. Tudo que esteve se arrastando pede ser conscientemente encerrado. Liberação não é fracasso — é a sabedoria de reconhecer quando um capítulo cumpriu seu propósito, e a coragem de virar a página com gratidão em vez de lamento. Cada encerramento realizado com consciência cria espaço para algo genuinamente novo. O que você está carregando do passado que não pertence mais a quem você está se tornando? Este é o mês para responder essa pergunta com honestidade e agir de acordo.',
      reflexao: '"O que estou carregando do passado que já não pertence a quem estou me tornando — e o que seria possível se eu pudesse simplesmente baixar esse peso?"',
      acoes: [
        'Listar tudo que está incompleto em sua vida — projetos, conversas, decisões — e comprometer-se a encerrar cada item',
        'Praticar perdão ativamente — não pelo bem do outro, mas pela sua própria libertação',
        'Doar, vender ou liberar objetos, ideias e obrigações que pertencem ao passado',
        'Entrar em contato com alguém a quem você precisa agradecer ou pedir perdão',
        'Participar de uma causa filantrópica ou ato de serviço maior do que seus interesses pessoais',
        'Escrever uma carta para uma versão passada de si mesmo(a) — o que você diria?',
        'Criar um ritual pessoal de encerramento para este ciclo',
      ],
      evitar: [
        'Iniciar projetos novos importantes antes de limpar o que está incompleto',
        'Deixar a nostalgia impedir os encerramentos necessários',
        'Dramatizar as perdas — cada fim contém a semente de um começo',
        'Usar esta energia como desculpa para evitar responsabilidades atuais',
      ],
      areas: ['Conclusão de projetos e pendências', 'Cura emocional e perdão', 'Trabalho filantrópico e serviço', 'Transição consciente e preparação para o novo'],
    },
  }

  const info = energias[numeroEnergia] ?? {
    energia: 'Energia Variada',
    descricao: 'Mês de integração e equilíbrio entre diferentes forças.',
    profundidade: 'Um mês para integrar as lições dos ciclos anteriores e preparar-se conscientemente para o que vem.',
    reflexao: '"O que este mês tem me ensinado sobre mim mesmo(a)?"',
    acoes: [], evitar: [], areas: [],
  }

  return {
    mesNumero: numeroMesCalendario,
    soma: 0,
    reduzido: numeroEnergia,
    mesNome,
    energia: info.energia,
    descricao: info.descricao,
    profundidade: info.profundidade,
    reflexao: info.reflexao,
    acoes: info.acoes,
    evitar: info.evitar,
    areas: info.areas,
  }
}
