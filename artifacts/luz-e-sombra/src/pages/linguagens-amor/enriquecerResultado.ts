import {
  COMBINACAO_PAR,
  CONTEUDO_LINGUAGEM,
  LABEL_LINGUAGEM,
  perfilDetalhe,
  type LinguagemAmor,
} from "@workspace/cinco-linguagens-amor";
import type { PerfilLinguagemDetalhe } from "@workspace/cinco-linguagens-amor";

export type ResultadoLinguagensUi = {
  versao?: string;
  principal?: LinguagemAmor;
  secundaria?: LinguagemAmor;
  sinteseHumana?: string;
  tanqueEmocional?: string;
  perfilPrincipal?: PerfilLinguagemDetalhe;
  perfilSecundario?: PerfilLinguagemDetalhe;
  perfilExpressar?: PerfilLinguagemDetalhe;
  combinacao?: string;
  paraQuemTeAma?: string;
  evitar?: string[];
  recomendacoes?: string[];
  reflexaoAmor?: string;
  perfilEquilibrado?: boolean;
  interpretacaoPar?: string;
  interpretacaoPrincipal?: string;
  desalinhamento?: { ativo?: boolean; texto?: string };
  metricas?: { confianca?: number; alertas?: string[] };
  receber?: {
    principal?: LinguagemAmor;
    secundaria?: LinguagemAmor;
    ranking?: { linguagem?: string; pontos?: number; pct?: number }[];
  };
  expressar?: {
    principal?: LinguagemAmor;
    secundaria?: LinguagemAmor;
    ranking?: { linguagem?: string; pontos?: number; pct?: number }[];
  };
  ranking?: { linguagem?: string; pontos?: number; pct?: number }[];
};

function chavePar(a: LinguagemAmor, b: LinguagemAmor): string {
  return `${a}+${b}`;
}

function combinacaoTexto(p: LinguagemAmor, s: LinguagemAmor): string {
  if (p === s) {
    return "Seu perfil concentra-se numa linguagem dominante. Invista nela com intenção e peça explicitamente o que enche seu tanque emocional.";
  }
  return (
    COMBINACAO_PAR[chavePar(p, s)] ??
    COMBINACAO_PAR[chavePar(s, p)] ??
    `Você combina ${LABEL_LINGUAGEM[p].toLowerCase()} com ${LABEL_LINGUAGEM[s].toLowerCase()}. Relações duradouras costumam alimentar as duas pontuações mais altas, não só a primeira.`
  );
}

function sinteseLegado(p: LinguagemAmor, s: LinguagemAmor, pct?: number): string {
  const lp = LABEL_LINGUAGEM[p].toLowerCase();
  const c = CONTEUDO_LINGUAGEM[p];
  if (p === s) {
    return c.essencia;
  }
  const ls = LABEL_LINGUAGEM[s].toLowerCase();
  const forte = (pct ?? 0) >= 35;
  if (forte) {
    return `${c.essencia} Sua segunda linguagem, ${ls}, complementa o tanque — quando as duas aparecem na relação, você se sente plenamente nutrido(a).`;
  }
  return `${c.essencia} Você também responde fortemente a ${ls}: relações que misturam as duas linguagens costumam durar mais e doer menos.`;
}

function adaptarTerceira(texto: string, nome: string): string {
  const pronome = /a$/i.test(nome) || nome.toLowerCase().endsWith("icia") ? "ela" : "ele";
  const possessivo = pronome === "ela" ? "dela" : "dele";
  return texto
    .replace(/\bVocê\b/g, nome)
    .replace(/\bvocê\b/g, pronome)
    .replace(/\bSua\b/g, `A de ${nome}`)
    .replace(/\bsua\b/g, possessivo)
    .replace(/\bSeu\b/g, `O de ${nome}`)
    .replace(/\bseu\b/g, possessivo)
    .replace(/\bte\b/g, pronome)
    .replace(/\bTi\b/g, nome)
    .replace(/\bti\b/g, nome);
}

export function isV2(r: ResultadoLinguagensUi): boolean {
  return r.versao === "linguagens_amor_v2" || (!!r.receber && !!r.expressar);
}

/** Preenche campos v2 a partir do motor quando o resultado guardado é v1. */
export function enriquecerResultado(
  raw: ResultadoLinguagensUi,
  nomePessoa?: string | null,
): ResultadoLinguagensUi {
  const v2 = isV2(raw);
  const principal = (v2 ? raw.receber?.principal : raw.principal) as LinguagemAmor | undefined;
  const secundaria = (v2 ? raw.receber?.secundaria : raw.secundaria) as LinguagemAmor | undefined;
  if (!principal) return raw;

  const pctTop = v2
    ? raw.receber?.ranking?.[0]?.pct
    : raw.ranking?.[0]?.pct;

  let out: ResultadoLinguagensUi = { ...raw };

  if (!v2) {
    out = {
      ...out,
      perfilPrincipal: out.perfilPrincipal ?? perfilDetalhe(principal),
      perfilSecundario:
        secundaria && secundaria !== principal
          ? (out.perfilSecundario ?? perfilDetalhe(secundaria))
          : out.perfilSecundario,
      sinteseHumana:
        out.sinteseHumana ??
        out.interpretacaoPar ??
        sinteseLegado(principal, secundaria ?? principal, pctTop),
      tanqueEmocional:
        out.tanqueEmocional ??
        `Seu tanque emocional enche principalmente com ${LABEL_LINGUAGEM[principal].toLowerCase()}. ${CONTEUDO_LINGUAGEM[principal].comoSeSenteAmado}`,
      combinacao:
        out.combinacao ??
        (secundaria ? combinacaoTexto(principal, secundaria) : undefined),
      paraQuemTeAma:
        out.paraQuemTeAma ?? CONTEUDO_LINGUAGEM[principal].dicaParaParceiro,
      evitar: out.evitar?.length ? out.evitar : [CONTEUDO_LINGUAGEM[principal].oQueMagoa],
      recomendacoes:
        out.recomendacoes?.length
          ? out.recomendacoes
          : CONTEUDO_LINGUAGEM[principal].acoesPraticas.slice(0, 3),
      reflexaoAmor:
        out.reflexaoAmor ??
        "Amor duradouro não é só paixão: é escolha diária de falar a linguagem do outro, mesmo quando não é a sua natural.",
    };
  }

  if (nomePessoa?.trim()) {
    const nome = nomePessoa.trim().split(/\s+/)[0]!;
    const camposTexto: (keyof ResultadoLinguagensUi)[] = [
      "sinteseHumana",
      "tanqueEmocional",
      "combinacao",
      "paraQuemTeAma",
      "reflexaoAmor",
      "interpretacaoPar",
      "interpretacaoPrincipal",
    ];
    for (const k of camposTexto) {
      const v = out[k];
      if (typeof v === "string" && v) {
        (out as Record<string, unknown>)[k] = adaptarTerceira(v, nome);
      }
    }
    if (out.desalinhamento?.texto) {
      out = {
        ...out,
        desalinhamento: {
          ...out.desalinhamento,
          texto: adaptarTerceira(out.desalinhamento.texto, nome),
        },
      };
    }
    if (out.perfilPrincipal) {
      out.perfilPrincipal = {
        ...out.perfilPrincipal,
        essencia: adaptarTerceira(out.perfilPrincipal.essencia, nome),
        comoSeSenteAmado: adaptarTerceira(out.perfilPrincipal.comoSeSenteAmado, nome),
        comoExpressa: adaptarTerceira(out.perfilPrincipal.comoExpressa, nome),
        dialetos: out.perfilPrincipal.dialetos.map((d) => adaptarTerceira(d, nome)),
      };
    }
    if (out.perfilSecundario) {
      out.perfilSecundario = {
        ...out.perfilSecundario,
        essencia: adaptarTerceira(out.perfilSecundario.essencia, nome),
        comoSeSenteAmado: adaptarTerceira(out.perfilSecundario.comoSeSenteAmado, nome),
      };
    }
    if (out.perfilExpressar) {
      out.perfilExpressar = {
        ...out.perfilExpressar,
        essencia: adaptarTerceira(out.perfilExpressar.essencia, nome),
        comoExpressa: adaptarTerceira(out.perfilExpressar.comoExpressa, nome),
      };
    }
    if (out.recomendacoes) {
      out.recomendacoes = out.recomendacoes.map((r) => adaptarTerceira(r, nome));
    }
    if (out.evitar) {
      out.evitar = out.evitar.map((e) => adaptarTerceira(e, nome));
    }
  }

  return out;
}
