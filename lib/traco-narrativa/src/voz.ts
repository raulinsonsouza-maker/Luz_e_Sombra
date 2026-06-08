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

function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] ?? nome;
}

function adaptarTextoTerceira(texto: string, nome: string, generoFeminino?: boolean): string {
  const pronome = generoFeminino ? "ela" : "ele";
  const possessivo = generoFeminino ? "dela" : "dele";
  const objeto = generoFeminino ? "a" : "o";
  const reflexivo = generoFeminino ? "se" : "se";

  let t = texto;
  t = t.replace(/\bVocê\b/g, nome);
  t = t.replace(/\bvocê\b/g, pronome);
  t = t.replace(/\bSua (\w+)/g, `A $1 ${possessivo}`);
  t = t.replace(/\bsua (\w+)/g, `a $1 ${possessivo}`);
  t = t.replace(/\bSeu (\w+)/g, `O $1 ${possessivo}`);
  t = t.replace(/\bseu (\w+)/g, `o $1 ${possessivo}`);
  t = t.replace(/\bSuas (\w+)/g, `As $1 ${possessivo}`);
  t = t.replace(/\bsuas (\w+)/g, `as $1 ${possessivo}`);
  t = t.replace(/\bSeus (\w+)/g, `Os $1 ${possessivo}`);
  t = t.replace(/\bseus (\w+)/g, `os $1 ${possessivo}`);
  t = t.replace(/\bsua\b/g, possessivo);
  t = t.replace(/\bseu\b/g, possessivo);
  t = t.replace(/\bsuas\b/g, possessivo);
  t = t.replace(/\bseus\b/g, possessivo);
  t = t.replace(/\bte\b/g, reflexivo);
  t = t.replace(/\bTi\b/g, nome);
  t = t.replace(/\bti\b/g, nome);
  t = t.replace(/\bconsigo\b/g, `com ${pronome}`);
  t = t.replace(/\bsi mesmo\b/g, `${pronome} mesmo`);
  t = t.replace(/\bSi\b/g, nome);
  t = t.replace(/\bsi\b/g, nome);
  t = t.replace(/\bcontigo\b/g, `com ${pronome}`);
  t = t.replace(/\bpara você\b/gi, `para ${pronome}`);
  t = t.replace(/\bPara você\b/g, `Para ${pronome}`);
  t = t.replace(/\bquem você é\b/gi, `quem ${pronome} é`);
  t = t.replace(/\bo que você\b/gi, `o que ${pronome}`);
  t = t.replace(/\bO que você\b/g, `O que ${pronome}`);
  t = t.replace(/\bE você\b/g, `E ${pronome}`);
  t = t.replace(/\be você\b/g, `e ${pronome}`);
  t = t.replace(/\bquando você\b/gi, `quando ${pronome}`);
  t = t.replace(/\bQuando você\b/g, `Quando ${pronome}`);
  t = t.replace(/\bse sente\b/g, "se sente");
  t = t.replace(new RegExp(`\\b${nome} mesmo\\b`, "g"), `${pronome} mesmo`);
  void objeto;
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
