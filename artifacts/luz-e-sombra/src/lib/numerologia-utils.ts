export interface MesPessoal {
  mesNumero: number
  soma: number
  reduzido: number
  descricao: string
  mesNome: string
  energia: string
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

/** Caminho de Vida: dia + mês + ano completo (todos os dígitos), preservando mestres 11 22 33 */
export function calcularNumerodeVida(dataNascimentoDDMMYYYY: string): ResultadoNumero | null {
  const parts = dataNascimentoDDMMYYYY.split('/')
  if (parts.length !== 3) return null
  const dia = Number(parts[0])
  const mes = Number(parts[1])
  const anoStr = parts[2]
  const somaAno = somaDigitosString(anoStr)
  const soma = dia + mes + somaAno
  const valor = reduzirNumeroSimples(soma)
  return { valor, soma, passos: `${dia} + ${mes} + ${somaAno} → ${formatPassosReducao(soma)}` }
}

/** Número de Expressão (Destino): soma de todas as letras do nome */
export function calcularNumerodeExpressao(nome: string): ResultadoNumero {
  const letras = normalizar(nome).split('')
  const soma = somaLetras(letras)
  const valor = reduzirNumeroSimples(soma)
  return { valor, soma, passos: formatPassosReducao(soma) }
}

/** Número da Alma (Motivação Interior): soma das vogais */
export function calcularNumerodaAlma(nome: string): ResultadoNumero {
  const letras = normalizar(nome).split('').filter(l => VOGAIS.has(l))
  const soma = somaLetras(letras)
  const valor = reduzirNumeroSimples(soma)
  return { valor, soma, passos: formatPassosReducao(soma) }
}

/** Número da Personalidade: soma das consoantes */
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

// ─── Birth Table ────────────────────────────────────────────────────────────

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

  const energiasDetalhadas: Record<number, {
    energia: string; descricao: string; acoes: string[]; evitar: string[]; areas: string[]
  }> = {
    1: {
      energia: 'Início e Ação',
      descricao: 'Mês de novos começos, iniciativa e liderança. Energia yang, assertiva e pioneira.',
      acoes: ['Iniciar novos projetos pessoais ou profissionais','Tomar decisões importantes que você vem adiando','Lançar ideias e produtos','Assumir posições de liderança','Investir em sua marca pessoal','Fazer networking estratégico'],
      evitar: ['Procrastinação e indecisão','Dependência de aprovação externa','Passividade e espera','Medo de arriscar'],
      areas: ['Carreira e novos negócios','Liderança','Autonomia','Empreendedorismo']
    },
    2: {
      energia: 'Cooperação e Parcerias',
      descricao: 'Mês de cultivo de relações, negociações e sensibilidade. Energia yin, receptiva e diplomática.',
      acoes: ['Fortalecer parcerias existentes','Negociar acordos e contratos','Praticar escuta ativa e empatia','Trabalhar em equipe','Mediar conflitos','Cultivar relações afetivas'],
      evitar: ['Decisões impulsivas e solitárias','Conflitos desnecessários','Excesso de independência','Impaciência com processos lentos'],
      areas: ['Relações e parcerias','Negociações','Equilíbrio emocional','Colaboração']
    },
    3: {
      energia: 'Expressão e Criatividade',
      descricao: 'Mês de comunicação, criatividade e sociabilidade. Energia expansiva e alegre.',
      acoes: ['Criar e publicar conteúdo','Participar de eventos sociais','Expressar-se artisticamente','Fazer apresentações e palestras','Expandir rede de contatos','Investir em marketing e comunicação'],
      evitar: ['Dispersão e falta de foco','Superficialidade nas relações','Gastos impulsivos','Excesso de compromissos sociais'],
      areas: ['Comunicação e marketing','Criatividade','Vida social','Expressão artística']
    },
    4: {
      energia: 'Organização e Construção',
      descricao: 'Mês de trabalho metódico, organização e construção de bases sólidas. Energia terrena e prática.',
      acoes: ['Organizar finanças e documentos','Implementar sistemas e processos','Trabalhar com disciplina e foco','Concretizar projetos em andamento','Criar rotinas produtivas','Cuidar da saúde física'],
      evitar: ['Rigidez excessiva','Perfeccionismo paralisante','Sobrecarga de trabalho','Resistência a mudanças necessárias'],
      areas: ['Trabalho e produtividade','Organização','Finanças','Saúde e rotina']
    },
    5: {
      energia: 'Mudança e Liberdade',
      descricao: 'Mês de transformações, oportunidades inesperadas e liberdade. Energia dinâmica e aventureira.',
      acoes: ['Aceitar mudanças e adaptar-se','Viajar e explorar novos lugares','Experimentar coisas novas','Ser flexível com planos','Aproveitar oportunidades inesperadas','Sair da zona de conforto'],
      evitar: ['Resistência à mudança','Impulsividade destrutiva','Instabilidade financeira','Compromissos longos demais'],
      areas: ['Viagens e exploração','Mudanças','Liberdade','Novas experiências']
    },
    6: {
      energia: 'Responsabilidade e Harmonia',
      descricao: 'Mês de questões familiares, responsabilidades afetivas e busca por harmonia. Energia amorosa e cuidadora.',
      acoes: ['Fortalecer laços familiares','Resolver questões domésticas','Cuidar de entes queridos','Formalizar compromissos','Investir em bem-estar do lar','Praticar autocuidado com amor'],
      evitar: ['Auto-sacrifício excessivo','Cobranças emocionais','Perfeccionismo nas relações','Negligenciar autocuidado'],
      areas: ['Família e lar','Compromissos afetivos','Responsabilidade','Harmonia doméstica']
    },
    7: {
      energia: 'Reflexão e Estudo',
      descricao: 'Mês de interiorização, estudo profundo e planejamento estratégico. Energia contemplativa e analítica.',
      acoes: ['Estudar e aprofundar conhecimentos','Planejar estratégias de longo prazo','Meditar e praticar introspecção','Pesquisar e analisar dados','Buscar respostas internas','Fazer retiros ou momentos de solidão'],
      evitar: ['Isolamento social excessivo','Análise sem ação','Ceticismo paralisante','Frieza emocional'],
      areas: ['Estudos e pesquisa','Espiritualidade','Planejamento','Autoconhecimento']
    },
    8: {
      energia: 'Realização e Poder',
      descricao: 'Mês de negócios, finanças e conquistas materiais. Energia executiva e poderosa.',
      acoes: ['Focar em resultados financeiros','Negociar com firmeza e ética','Expandir negócios','Buscar promoções e oportunidades','Investir em crescimento patrimonial','Assumir liderança executiva'],
      evitar: ['Ganância e materialismo vazio','Abuso de poder','Decisões antiéticas','Estresse por controle excessivo'],
      areas: ['Negócios e finanças','Carreira executiva','Poder pessoal','Prosperidade']
    },
    9: {
      energia: 'Conclusão e Liberação',
      descricao: 'Mês de fechamentos, desapegos e transformação. Energia de finalização e compaixão.',
      acoes: ['Finalizar projetos pendentes','Fazer limpeza física e emocional','Doar e contribuir para causas','Perdoar e liberar mágoas','Encerrar ciclos com dignidade','Participar de ações humanitárias'],
      evitar: ['Apego ao que já passou','Resistência ao desapego','Melancolia paralisante','Iniciar grandes projetos'],
      areas: ['Finalizações','Causas sociais','Transformação','Desapego']
    },
  }

  const info = energiasDetalhadas[numeroEnergia] || {
    energia: 'Energia Variada', descricao: 'Mês de integração e equilíbrio.', acoes: [], evitar: [], areas: []
  }

  return {
    mesNumero: numeroMesCalendario, soma: 0, reduzido: numeroEnergia,
    mesNome, energia: info.energia, descricao: info.descricao,
    acoes: info.acoes, evitar: info.evitar, areas: info.areas
  }
}
