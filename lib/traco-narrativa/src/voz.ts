import type { ResultadoAnalise } from "./types.js";

const CAMPOS_TEXTO: (keyof ResultadoAnalise)[] = [
  "sinteseHumana",
  "interpretacao",
  "padraoPostural",
  "perfilFisicoNarrado",
  "centroEnergetico",
  "padraoEnergetico",
  "mensagemTerapeutica",
  "fraseIdentidade",
  "ferida",
  "recurso",
  "perfilUnico",
  "perguntaTransformacao",
  "leituraEmocionalDeclarada",
  "contrasteFotosFormulario",
  "couracaCorporal",
  "dorLivro",
];

/** Palavra em português (inclui acentos — \w não cobre ç, ã, etc.). */
const PAL = String.raw`[\p{L}\p{M}]+`;

function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? nome;
}

function adaptarTextoTerceira(texto: string, nome: string, generoFeminino?: boolean): string {
  const pronome = generoFeminino ? "ela" : "ele";
  const possessivo = generoFeminino ? "dela" : "dele";
  const reflexivo = generoFeminino ? "se" : "se";

  let t = texto;
  t = t.replace(/\bVocê\b/gu, nome);
  t = t.replace(/\bvocê\b/gu, pronome);
  t = t.replace(/é a sua/giu, "é a");
  t = t.replace(/é o seu/giu, "é o");
  t = t.replace(new RegExp(`\\bSua (${PAL})`, "gu"), `A $1 ${possessivo}`);
  t = t.replace(new RegExp(`\\bsua (${PAL})`, "gu"), `a $1 ${possessivo}`);
  t = t.replace(new RegExp(`\\bSeu (${PAL})`, "gu"), `O $1 ${possessivo}`);
  t = t.replace(new RegExp(`\\bseu (${PAL})`, "gu"), `o $1 ${possessivo}`);
  t = t.replace(new RegExp(`\\bSuas (${PAL})`, "gu"), `As $1 ${possessivo}`);
  t = t.replace(new RegExp(`\\bsuas (${PAL})`, "gu"), `as $1 ${possessivo}`);
  t = t.replace(new RegExp(`\\bSeus (${PAL})`, "gu"), `Os $1 ${possessivo}`);
  t = t.replace(new RegExp(`\\bseus (${PAL})`, "gu"), `os $1 ${possessivo}`);
  t = t.replace(/\bsua\b/gu, possessivo);
  t = t.replace(/\bseu\b/gu, possessivo);
  t = t.replace(/\bsuas\b/gu, possessivo);
  t = t.replace(/\bseus\b/gu, possessivo);
  t = t.replace(/\bte\b/gu, reflexivo);
  t = t.replace(/\bTi\b/gu, nome);
  t = t.replace(/\bti\b/gu, nome);
  t = t.replace(/\bconsigo\b/gu, `com ${pronome}`);
  t = t.replace(/\bsi mesmo\b/gu, `${pronome} mesmo`);
  t = t.replace(/\bSi\b/gu, nome);
  t = t.replace(/\bsi\b/gu, nome);
  t = t.replace(/\bcontigo\b/gu, `com ${pronome}`);
  t = t.replace(/\bpara você\b/giu, `para ${pronome}`);
  t = t.replace(/\bPara você\b/gu, `Para ${pronome}`);
  t = t.replace(/\bquem você é\b/giu, `quem ${pronome} é`);
  t = t.replace(/\bo que você\b/giu, `o que ${pronome}`);
  t = t.replace(/\bO que você\b/gu, `O que ${pronome}`);
  t = t.replace(/\bE você\b/gu, `E ${pronome}`);
  t = t.replace(/\be você\b/gu, `e ${pronome}`);
  t = t.replace(/\bquando você\b/giu, `quando ${pronome}`);
  t = t.replace(/\bQuando você\b/gu, `Quando ${pronome}`);
  t = t.replace(/\bse sente\b/gu, "se sente");
  t = t.replace(new RegExp(`\\b${nome} mesmo\\b`, "gu"), `${pronome} mesmo`);
  return t;
}

function adaptarEstiloComunicacao(
  ec: ResultadoAnalise["estiloComunicacao"],
  nome: string,
  generoFeminino?: boolean,
): ResultadoAnalise["estiloComunicacao"] {
  return {
    tipo: ec.tipo,
    descricao: adaptarTextoTerceira(ec.descricao, nome, generoFeminino),
    emGrupos: adaptarTextoTerceira(ec.emGrupos, nome, generoFeminino),
    emRelacoes: adaptarTextoTerceira(ec.emRelacoes, nome, generoFeminino),
    emConflito: adaptarTextoTerceira(ec.emConflito, nome, generoFeminino),
    emTensao: adaptarTextoTerceira(ec.emTensao, nome, generoFeminino),
  };
}

function adaptarDinamica(
  d: ResultadoAnalise["dinamicaFuncional"],
  nome: string,
  generoFeminino?: boolean,
): ResultadoAnalise["dinamicaFuncional"] {
  return {
    trabalho: adaptarTextoTerceira(d.trabalho, nome, generoFeminino),
    relacoes: adaptarTextoTerceira(d.relacoes, nome, generoFeminino),
    estresse: adaptarTextoTerceira(d.estresse, nome, generoFeminino),
    decisoes: adaptarTextoTerceira(d.decisoes, nome, generoFeminino),
    energia: adaptarTextoTerceira(d.energia, nome, generoFeminino),
    sombra: adaptarTextoTerceira(d.sombra, nome, generoFeminino),
  };
}

/** Adapta narrativa para terceira pessoa quando a análise é de outra pessoa. */
export function adaptarVozNarrativa(
  resultado: ResultadoAnalise,
  pessoaNome?: string | null,
): ResultadoAnalise {
  if (!pessoaNome?.trim()) return resultado;
  const nome = primeiroNome(pessoaNome.trim());
  const generoFeminino = /a$/i.test(nome) || nome.toLowerCase().endsWith("icia");

  const out = { ...resultado, pessoaNome: pessoaNome.trim() };
  for (const k of CAMPOS_TEXTO) {
    const v = out[k];
    if (typeof v === "string" && v) {
      (out as Record<string, unknown>)[k] = adaptarTextoTerceira(v, nome, generoFeminino);
    }
  }
  if (out.estiloComunicacao) {
    out.estiloComunicacao = adaptarEstiloComunicacao(out.estiloComunicacao, nome, generoFeminino);
  }
  if (out.dinamicaFuncional) {
    out.dinamicaFuncional = adaptarDinamica(out.dinamicaFuncional, nome, generoFeminino);
  }
  if (out.observacoesPorFoto) {
    const obs: typeof out.observacoesPorFoto = {};
    for (const [tipo, texto] of Object.entries(out.observacoesPorFoto)) {
      if (texto) obs[tipo as keyof typeof obs] = adaptarTextoTerceira(texto, nome, generoFeminino);
    }
    out.observacoesPorFoto = obs;
  }
  if (out.pontosCuidadoPrioritarios) {
    out.pontosCuidadoPrioritarios = out.pontosCuidadoPrioritarios.map((p) =>
      adaptarTextoTerceira(p, nome, generoFeminino),
    );
  }
  if (out.recomendacoesPraticas) {
    out.recomendacoesPraticas = out.recomendacoesPraticas.map((p) =>
      adaptarTextoTerceira(p, nome, generoFeminino),
    );
  }
  return out;
}
