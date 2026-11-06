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

// ─── Personal Day ───────────────────────────────────────────────────────────

export function calcularDiaPessoal(dataNascimento: string, data: Date = new Date()) {
  const dataFmt = formatarDataBrasileira(dataNascimento)
  const ano = data.getFullYear()
  const mes = data.getMonth() + 1
  const dia = data.getDate()
  const anoPessoal = calcularAnoPessoal(dataFmt, ano)
  if (!anoPessoal) return null
  const clima = reduzirNumeroForcando(somaDigitosString(String(ano)))
  const ciclo = anoPessoal.reduzidoForcado
  const periodo = reduzirNumeroForcando(anoPessoal.reduzido + mes)
  const hoje = reduzirNumeroForcando(periodo + dia)
  return { hoje, periodo, ciclo, clima }
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
      energia: 'Começar',
      descricao: 'Este mês pede um começo de verdade. O que ficou parado só anda se você der o primeiro passo, mesmo pequeno.',
      profundidade: 'Escolha uma coisa só, aquela que você adia porque ainda não está redonda, e abra ela nesta semana. O que você inicia agora marca o tom dos meses seguintes. Repare se está começando porque quer, ou só para não ficar parado. Um começo consciente vale mais do que cinco aberturas por pressa.',
      reflexao: '"Qual começo você está esperando alguém autorizar?"',
      acoes: [
        'Abra nesta semana a única coisa que você mais adia. Uma versão simples já conta.',
        'Diga em voz alta, para alguém, o que você decidiu começar. Fica mais difícil voltar atrás.',
        'Se aparecer vontade de abrir mais três coisas, volte para a primeira.',
      ],
      evitar: [
        'Esperar o momento perfeito. Ele não chega antes do primeiro passo.',
        'Pedir opinião de todo mundo antes de agir.',
      ],
      areas: ['o projeto que você adia', 'as decisões que só você pode tomar', 'o jeito como você se mostra'],
    },
    2: {
      energia: 'Combinar',
      descricao: 'Este mês anda melhor em dois. Conversas, acordos e parcerias pesam mais do que a pressa de resolver sozinho.',
      profundidade: 'Antes de decidir algo que mexe com outra pessoa, ouça até o fim. A paciência daqui não é ficar parado: é entender o que o outro precisa para o combinado funcionar. Uma conversa honesta nesta semana vale mais do que um plano feito no escuro. Repare se você está ouvindo ou só esperando a sua vez de falar.',
      reflexao: '"Com quem você precisa conversar de verdade nesta semana?"',
      acoes: [
        'Marque a conversa que você vem empurrando. Ouça até o fim antes de responder.',
        'Feche um acordo que está pela metade. Diga o que você precisa e o que pode oferecer.',
        'Se um conflito passou do seu alcance, peça ajuda em vez de resolver sozinho.',
      ],
      evitar: [
        'Decidir por outra pessoa sem perguntar.',
        'Concordar só para evitar briga e guardar raiva depois.',
      ],
      areas: ['as conversas que você adia', 'os acordos pela metade', 'as pessoas com quem você divide o caminho'],
    },
    3: {
      energia: 'Falar e criar',
      descricao: 'Este mês pede que você diga e mostre. O que fica só na cabeça perde força. O que você fala com verdade chega mais longe.',
      profundidade: 'Pare de ensaiar a frase perfeita. Diga a coisa que você tem guardado, numa conversa, num texto ou num trabalho que ainda não saiu. Não precisa estar pronto. Precisa ser seu. Repare se você está falando para ser aceito ou para ser claro. A leveza deste mês aponta o caminho: onde tem gosto de verdade, vale seguir.',
      reflexao: '"O que você ainda não disse, e para quem?"',
      acoes: [
        'Diga a frase que está pronta na cabeça. Numa conversa, num texto ou no trabalho.',
        'Mostre uma coisa que você fez e ainda não mostrou a ninguém.',
        'Se a crítica vier, anote o que serve e solte o resto. Não pare por causa dela.',
      ],
      evitar: [
        'Abrir dez ideias e não terminar nenhuma.',
        'Usar piada para não falar do que dói.',
      ],
      areas: ['o que você ainda não disse', 'o trabalho que está guardado', 'as pessoas com quem vale se encontrar'],
    },
    4: {
      energia: 'Organizar',
      descricao: 'Este mês pede base. Contas, horários, hábitos e pendências. O que está solto pede uma ordem simples, que você consiga manter.',
      profundidade: 'Escolha a parte da vida que mais te atrapalha por falta de ordem e arrume ela de um jeito que dure. Pode ser o dinheiro, a semana de trabalho ou o corpo. Atalho agora cobra depois. Repare se a bagunça é falta de tempo ou um jeito de não olhar para o que já está claro.',
      reflexao: '"Qual parte da sua semana está tão solta que te atrapalha todo dia?"',
      acoes: [
        'Abra as contas e olhe o dinheiro: o que entra, o que sai e o que você nem lembra que paga.',
        'Escolha um horário fixo para a coisa do trabalho que sempre fica para depois.',
        'Arrume uma gaveta, uma pasta ou uma lista. Só uma. E mantenha assim até o fim do mês.',
      ],
      evitar: [
        'Querer deixar tudo perfeito e não entregar nada.',
        'Encher o dia de tarefa para não olhar o que já está claro.',
      ],
      areas: ['o dinheiro e as contas', 'a rotina da semana', 'o que está pela metade no trabalho'],
    },
    5: {
      energia: 'Mudar',
      descricao: 'Este mês mexe no que estava parado. Uma mudança, um convite ou uma interrupção pede que você solte o que já não cabe.',
      profundidade: 'Nem toda interrupção é problema. Às vezes é o sinal de que um hábito, um compromisso ou um medo está ocupando o lugar do que vem depois. Você não precisa controlar o mês inteiro. Precisa perceber o que está segurando por costume. Diga sim a uma coisa nova antes de analisar até cansar, e não decida nada definitivo no impulso.',
      reflexao: '"O que você segura só porque já está acostumado?"',
      acoes: [
        'Diga sim a um convite fora da rotina antes de pensar demais.',
        'Solte um compromisso, um hábito ou um combinado que só cansa.',
        'Não decida nada definitivo no calor do momento. Mude o passo, não a vida inteira numa tarde.',
      ],
      evitar: [
        'Ficar no que já não funciona só porque é conhecido.',
        'Gastar ou romper alguma coisa só pela empolgação do novo.',
      ],
      areas: ['o que você quer mudar e adia', 'um convite fora da rotina', 'um hábito que já cansa'],
    },
    6: {
      energia: 'Cuidar',
      descricao: 'Este mês pede presença em casa e nas pessoas próximas. Cuidar aqui é um ato concreto, não uma obrigação para ser bem visto.',
      profundidade: 'Olhe para a casa, para a família e para quem depende de você. Há uma conversa, uma arrumação ou um cuidado com o seu próprio corpo que está esperando. Repare se você ajuda porque quer ou porque tem medo de decepcionar. Cuidar sem se apagar é o ponto deste mês.',
      reflexao: '"Você está cuidando porque quer, ou porque tem medo de decepcionar?"',
      acoes: [
        'Passe um tempo com alguém próximo sem celular no meio.',
        'Faça a conversa de casa que está esperando. Sem consertar a pessoa, só falar o que pesa.',
        'Cuide do seu corpo nesta semana do mesmo jeito que você cuida dos outros.',
      ],
      evitar: [
        'Dar tanto que a raiva fica guardada.',
        'Usar o cuidado com os outros para não olhar para si.',
      ],
      areas: ['a casa', 'as pessoas mais próximas', 'o cuidado com o seu corpo'],
    },
    7: {
      energia: 'Entender',
      descricao: 'Este mês pede menos pressa e mais escuta. A resposta que você procura não vem de mais uma tarefa. Vem de um tempo quieto, só seu.',
      profundidade: 'Separe um horário curto, de verdade, sem tela e sem gente. Escreva o que você já sabe e ainda não admite. Estude uma coisa que te interessa, mas não encha a semana de compromisso para parecer ocupado. Repare se o silêncio está te ajudando a ver ou se virou um jeito de sumir.',
      reflexao: '"O que você já sabe e ainda não admite?"',
      acoes: [
        'Separe um horário curto, sem tela e sem gente. Escreva o que aparecer.',
        'Estude uma coisa só, aquela que te interessa de verdade, sem transformar isso em mais uma obrigação.',
        'Durma e coma direito. Pensar o mês inteiro sem cuidar do corpo não traz resposta.',
      ],
      evitar: [
        'Sumir das pessoas e chamar isso de reflexão.',
        'Pensar tanto que a conta, o trabalho e a casa ficam parados.',
      ],
      areas: ['o que você já sabe e não admite', 'um estudo que te interessa de verdade', 'o tempo sozinho na semana'],
    },
    8: {
      energia: 'Concretizar',
      descricao: 'Este mês pede resultado. Acordo, preço, promoção ou uma decisão que você vem empurrando porque pesa.',
      profundidade: 'Olhe para o que o seu trabalho vale e para o que você tem aceitado a menos. Feche um combinado, cobre o que é justo ou tome a decisão que está na mesa. Não é hora de se diminuir para evitar conflito. Também não é hora de passar por cima das pessoas para chegar lá. Repare onde você entrega o comando para outro decidir no seu lugar.',
      reflexao: '"Onde você está cobrando menos do que o seu trabalho vale?"',
      acoes: [
        'Feche o acordo, o preço ou a promoção que está em aberto. Diga o número.',
        'Corte um gasto que sai todo mês e você nem usa.',
        'Tome a decisão que está na mesa. Esperar outra pessoa decidir é entregar o seu lugar.',
      ],
      evitar: [
        'Passar por cima das pessoas para chegar no resultado.',
        'Trabalhar sem parar e chamar isso de foco.',
      ],
      areas: ['o valor do seu trabalho', 'um acordo que está aberto', 'o dinheiro que escapa sem você ver'],
    },
    9: {
      energia: 'Encerrar',
      descricao: 'Este mês pede fim. Pendência, conversa, objeto ou hábito que já cumpriu o tempo. Terminar bem abre espaço.',
      profundidade: 'Faça a lista do que está incompleto e feche o que dá para fechar agora. Encerrar não é fracasso. É reconhecer que aquilo já fez a parte dele. Agradeça, solte e não abra coisa nova grande antes de limpar a mesa. Repare o que você carrega por saudade e o que carrega por medo de ficar sem.',
      reflexao: '"O que já acabou e você ainda carrega?"',
      acoes: [
        'Faça a lista do que está pela metade e feche o que dá para fechar agora.',
        'Doe, venda ou jogue fora o que você guarda sem uso.',
        'Fale com a pessoa a quem você precisa agradecer ou pedir desculpa. Sem reabrir a história inteira.',
      ],
      evitar: [
        'Abrir projeto novo grande antes de limpar a mesa.',
        'Segurar o que já acabou só por saudade.',
      ],
      areas: ['o que está incompleto', 'uma conversa que precisa de um fim', 'o que você guarda sem uso'],
    },
  }

  const info = energias[numeroEnergia] ?? {
    energia: 'Equilibrar',
    descricao: 'Este mês pede que você junte o que os meses anteriores já mostraram, sem abrir frente nova.',
    profundidade: 'Olhe o que ficou pendente e escolha uma coisa para concluir. O resto pode esperar.',
    reflexao: '"O que este mês já te mostrou e você ainda não usou?"',
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
