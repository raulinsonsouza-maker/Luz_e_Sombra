import { MESES_PESSOAIS } from "@/lib/numerologia/mesesPessoais";

export interface MesPessoal {
  mesNumero: number
  soma: number
  reduzido: number
  mesNome: string
  energia: string
  descricao: string
  profundidade: string
  clima: string
  sombra: string
  reflexao: string
  acoes: string[]
  evitar: string[]
  areas: string[]
  palavrasChave: string[]
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

/**
 * Ano civil usado no Ano Pessoal vigente.
 * O ciclo vira no aniversário: antes do mês/dia usa ano−1; no dia e depois, o ano atual.
 */
export function anoCivilDoAnoPessoalVigente(
  dataNascimentoDDMMYYYY: string,
  hoje: Date = new Date(),
): number | null {
  const parts = dataNascimentoDDMMYYYY.split('/')
  if (parts.length !== 3) return null
  const dia = Number(parts[0])
  const mes = Number(parts[1])
  if (!Number.isFinite(dia) || !Number.isFinite(mes) || mes < 1 || mes > 12 || dia < 1 || dia > 31) {
    return null
  }
  const ano = hoje.getFullYear()
  const mesHoje = hoje.getMonth() + 1
  const diaHoje = hoje.getDate()
  if (mesHoje < mes || (mesHoje === mes && diaHoje < dia)) return ano - 1
  return ano
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
  const anoVigente = anoCivilDoAnoPessoalVigente(dataFmt, data)
  if (anoVigente == null) return null
  const mes = data.getMonth() + 1
  const dia = data.getDate()
  const anoPessoal = calcularAnoPessoal(dataFmt, anoVigente)
  if (!anoPessoal) return null
  // Preserva mestres 11/22/33 no ciclo, mês e dia pessoais.
  const clima = reduzirNumeroSimples(somaDigitosString(String(data.getFullYear())))
  const ciclo = reduzirNumeroSimples(anoPessoal.reduzido)
  const periodo = reduzirNumeroSimples(anoPessoal.reduzido + mes)
  const hoje = reduzirNumeroSimples(periodo + dia)
  return { hoje, periodo, ciclo, clima }
}

/**
 * Portais do calendário (ex.: 11/11) — momentos coletivos mestres
 * mesmo quando a soma civil reduziria a 1–9.
 */
export function portalCalendarioColetivo(data: Date = new Date()): number | null {
  const dia = data.getDate()
  const mes = data.getMonth() + 1
  // 11/11 — portal coletivo clássico
  if (dia === 11 && mes === 11) return 11
  // Dias 11 e 22 do calendário também carregam energia mestra coletiva
  if (dia === 11 || dia === 22) return dia
  return null
}

/** Dia universal civil — igual para todas as pessoas; preserva 11/22/33 e portais. */
export function calcularDiaUniversal(data: Date = new Date()): number {
  const portal = portalCalendarioColetivo(data)
  if (portal != null) return portal
  const dia = data.getDate()
  const mes = data.getMonth() + 1
  const somaAno = somaDigitosString(String(data.getFullYear()))
  return reduzirNumeroSimples(dia + mes + somaAno)
}

// ─── Personal Months ────────────────────────────────────────────────────────

export function calcularMesesPessoais(anoPessoal: number, anoAnalise: number): MesPessoal[] {
  const meses: MesPessoal[] = []
  for (let m = 1; m <= 12; m++) {
    const soma = anoPessoal + m
    const reduzido = reduzirNumeroSimples(soma)
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
  const info = MESES_PESSOAIS[numeroEnergia] ?? {
    energia: 'Equilibrar',
    titulo: 'Mês para juntar o que já aparece',
    descricao: 'Este mês pede que você junte o que os meses anteriores já mostraram, sem abrir frente nova.',
    profundidade: 'Olhe o que ficou pendente e escolha uma coisa para concluir. O resto pode esperar.',
    clima: 'Consolidar o que já começou.',
    sombra: 'Abrir frente nova por ansiedade.',
    reflexao: '"O que este mês já te mostrou e você ainda não usou?"',
    acoes: [] as string[],
    evitar: [] as string[],
    areas: [] as string[],
    palavrasChave: [] as string[],
  }

  return {
    mesNumero: numeroMesCalendario,
    soma: 0,
    reduzido: numeroEnergia,
    mesNome,
    energia: info.energia,
    descricao: info.descricao,
    profundidade: info.profundidade,
    clima: info.clima,
    sombra: info.sombra,
    reflexao: info.reflexao,
    acoes: info.acoes,
    evitar: info.evitar,
    areas: info.areas,
    palavrasChave: info.palavrasChave,
  }
}
