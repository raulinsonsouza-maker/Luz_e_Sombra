import { LABEL_LINGUAGEM } from "./perguntas/index.js";
import { CONTEUDO_LINGUAGEM } from "./narrativa/tabelas.js";
import type { LinguagemAmor, PerfilLinguagemDetalhe } from "./types.js";

export function perfilDetalhe(linguagem: LinguagemAmor): PerfilLinguagemDetalhe {
  const c = CONTEUDO_LINGUAGEM[linguagem];
  return {
    linguagem,
    label: LABEL_LINGUAGEM[linguagem],
    essencia: c.essencia,
    comoSeSenteAmado: c.comoSeSenteAmado,
    comoExpressa: c.comoExpressa,
    dialetos: [...c.dialetos],
    oQueMagoa: c.oQueMagoa,
    acoesPraticas: [...c.acoesPraticas],
    dicaParaParceiro: c.dicaParaParceiro,
  };
}
