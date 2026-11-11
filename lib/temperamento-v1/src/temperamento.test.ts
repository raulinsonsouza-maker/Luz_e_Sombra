import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CODIGOS_ITEM, ITENS_EYSENCK } from "./itens";
import { entradaTemperamentoSchema } from "./schemas";
import { computarTemperamento } from "./compute";
import { tituloPerfilTemperamento, sanitizarTituloTemperamentoLegado } from "./interpretacao";
import { gerarOrdemItens } from "./shuffleItens";
import { semParagrafosDuplicados } from "./analiseAprofundada";
import { FRASE_ASSUMIR, FRASE_CRITICA, montarLeituraConversa } from "./leituraConversa";
import type { RespostaSimNao } from "./itens";

function textoDe(cartoes: { paragrafos: string[]; perguntas: string[]; passos: string[] }[]): string {
  return cartoes.map((cartao) => [...cartao.paragrafos, ...cartao.perguntas, ...cartao.passos].join(" ")).join(" ");
}

function frasesRepetidas(cartoes: { paragrafos: string[] }[]): string[] {
  const vistas = new Map<string, number>();
  for (const cartao of cartoes) {
    for (const frase of cartao.paragrafos) {
      if (frase.length < 40) continue;
      vistas.set(frase, (vistas.get(frase) ?? 0) + 1);
    }
  }
  return [...vistas.entries()].filter(([, vezes]) => vezes > 1).map(([frase]) => frase);
}

function contarCartao(cartoes: { paragrafos: string[] }[], frase: string): number {
  return cartoes.filter((cartao) => cartao.paragrafos.some((texto) => texto.includes(frase))).length;
}

function answersAll(resposta: RespostaSimNao): Record<string, RespostaSimNao> {
  return Object.fromEntries(CODIGOS_ITEM.map((c) => [c, resposta])) as Record<string, RespostaSimNao>;
}

function answersDoJeito(alvo: (typeof ITENS_EYSENCK)[number]["alvo"]): Record<string, RespostaSimNao> {
  const ans: Record<string, RespostaSimNao> = {};
  for (const item of ITENS_EYSENCK) {
    const acerta = item.alvo === alvo;
    ans[item.id] = item.direcao === "positiva" ? (acerta ? "sim" : "nao") : acerta ? "nao" : "sim";
  }
  return ans;
}

function answersSanguineo(): Record<string, RespostaSimNao> {
  return answersDoJeito("SANGUINEO");
}

function answersMelancolico(): Record<string, RespostaSimNao> {
  return answersDoJeito("MELANCOLICO");
}

describe("temperamento-v3 Eysenck-lite", () => {
  it("tem 16 itens (8E + 8N)", () => {
    assert.equal(ITENS_EYSENCK.length, 16);
    assert.equal(ITENS_EYSENCK.filter((i) => i.eixo === "E").length, 8);
    assert.equal(ITENS_EYSENCK.filter((i) => i.eixo === "N").length, 8);
  });

  it("viés de 'sim' em tudo reduz confiabilidade", () => {
    const raw = entradaTemperamentoSchema.parse({
      answers: answersAll("sim"),
      metadata: { tempo_total_segundos: 120 },
    });
    const r = computarTemperamento(raw);
    assert.equal(r.quality_flag, "HIGH_CENTRAL_TENDENCY");
    assert.ok(r.confiabilidade < 100);
  });

  it("gerarOrdemItens devolve 16 itens únicos intercalados", () => {
    const ordem = gerarOrdemItens();
    assert.equal(ordem.length, 16);
    const ids = new Set(ordem.map((i) => i.id));
    assert.equal(ids.size, 16);
  });

  it("narrativa v4 inclui análise aprofundada sem parágrafos duplicados", () => {
    const raw = entradaTemperamentoSchema.parse({
      answers: answersSanguineo(),
      metadata: { tempo_total_segundos: 180 },
    });
    const r = computarTemperamento(raw);
    assert.equal(r.versaoNarrativa, "temperamento_v5");
    assert.equal(r.perfil.primario, "SANGUINEO");
    assert.ok(r.analiseAprofundada.length >= 8);
    assert.ok(r.sinteseHumana.length > 40);
    assert.ok(r.portraitIdentidade.length > 20);
    const paragrafos = [
      r.sinteseHumana,
      r.portraitIdentidade,
      r.seuDom,
      r.pontoCego,
      ...r.analiseAprofundada.flatMap((s) => s.paragrafos),
    ];
    semParagrafosDuplicados(paragrafos);
    assert.ok(!JSON.stringify(r).includes("—"), "copy user-facing não deve conter travessões");
  });

  it("respostas extrovertidas estáveis produzem Sanguíneo dominante", () => {
    const raw = entradaTemperamentoSchema.parse({
      answers: answersSanguineo(),
      metadata: { tempo_total_segundos: 200 },
    });
    const r = computarTemperamento(raw);
    assert.equal(r.perfil.primario, "SANGUINEO");
    assert.ok(r.scores.scoreE >= 50);
    assert.ok(r.scores.scoreN <= 40);
    const sumPct = Object.values(r.scores.temperamentos_percentuais).reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(sumPct - 100) < 0.01);
  });

  it("jeito de animar as pessoas não vira colérico só porque a pessoa é expansiva", () => {
    const ans = answersSanguineo();
    ans.E05 = "sim";
    const r = computarTemperamento(
      entradaTemperamentoSchema.parse({ answers: ans, metadata: { tempo_total_segundos: 180 } }),
    );
    assert.equal(r.perfil.primario, "SANGUINEO");
    assert.notEqual(r.perfil.primario, "COLERICO");
  });

  it("quem decide e cobra resulta em Colérico", () => {
    const r = computarTemperamento(
      entradaTemperamentoSchema.parse({
        answers: answersDoJeito("COLERICO"),
        metadata: { tempo_total_segundos: 180 },
      }),
    );
    assert.equal(r.perfil.primario, "COLERICO");
  });

  it("respostas introvertidas instáveis produzem Melancólico", () => {
    const raw = entradaTemperamentoSchema.parse({
      answers: answersMelancolico(),
      metadata: { tempo_total_segundos: 200 },
    });
    const r = computarTemperamento(raw);
    assert.equal(r.perfil.primario, "MELANCOLICO");
    assert.ok(r.scores.scoreE <= 40);
    assert.ok(r.scores.scoreN >= 60);
  });

  it("rejeita códigos v2 obsoletos", () => {
    const parsed = entradaTemperamentoSchema.safeParse({
      answers: { T01: "sim" },
      metadata: {},
    });
    assert.equal(parsed.success, false);
  });

  it("a conversa é de um temperamento só e não usa termo clínico", () => {
    const percentuais = { SANGUINEO: 40, COLERICO: 30, MELANCOLICO: 20, FLEUMATICO: 10 };
    const sang = montarLeituraConversa({ primario: "SANGUINEO", percentuais });
    const col = montarLeituraConversa({
      primario: "COLERICO",
      percentuais: { COLERICO: 40, SANGUINEO: 30, MELANCOLICO: 20, FLEUMATICO: 10 },
    });
    const texto = sang.map((cartao) => [...cartao.paragrafos, ...cartao.perguntas, ...cartao.passos].join(" ")).join(" ");
    const tituloSang = sang.find((cartao) => cartao.id === "primeiro")?.titulo ?? "";
    const tituloCol = col.find((cartao) => cartao.id === "primeiro")?.titulo ?? "";
    assert.equal(sang.length, 11);
    assert.match(tituloSang, /Sanguíneo/);
    assert.match(tituloCol, /Colérico/);
    assert.doesNotMatch(texto, /secundári|combinaç|com características de/i);
    assert.match(texto, /pode|talvez/);
    assert.match(texto, /\?/);
    assert.match(texto, /possibilidade/);
    assert.match(texto, /enquanto fala/);
    assert.match(texto, /quando o ânimo passa e ninguém está te incentivando/);
    assert.doesNotMatch(texto, /regulação emocional|mecanismo de defesa|predominância|validação|diagnóstico|autossabotagem|impulsiv|perfeccionismo/i);
    assert.ok(!texto.includes(FRASE_ASSUMIR));
    assert.ok(!texto.includes(FRASE_CRITICA));
    assert.doesNotMatch(texto, /talvez|pode ser que|uma possibilidade é/i);
    assert.ok(!texto.includes("—"));
    const repetidas = frasesRepetidas(sang);
    assert.equal(repetidas.length, 0);
  });

  it("um não tira a cena daquele item no temperamento correspondente", () => {
    const base = answersAll("nao");
    const percentuaisCol = { COLERICO: 40, SANGUINEO: 30, MELANCOLICO: 20, FLEUMATICO: 10 };
    const percentuaisMel = { MELANCOLICO: 40, SANGUINEO: 30, COLERICO: 20, FLEUMATICO: 10 };
    const leituraCol = montarLeituraConversa({
      primario: "COLERICO",
      percentuais: percentuaisCol,
      respostas: { ...base, E06: "sim" },
      questionarioClaro: true,
    });
    const leituraMel = montarLeituraConversa({
      primario: "MELANCOLICO",
      percentuais: percentuaisMel,
      respostas: { ...base, N02: "sim" },
      questionarioClaro: true,
    });
    const semAssumir = textoDe(
      montarLeituraConversa({
        primario: "COLERICO",
        percentuais: percentuaisCol,
        respostas: { ...base, E06: "nao" },
        questionarioClaro: true,
      }),
    );
    const semCritica = textoDe(
      montarLeituraConversa({
        primario: "MELANCOLICO",
        percentuais: percentuaisMel,
        respostas: { ...base, N02: "nao" },
        questionarioClaro: true,
      }),
    );
    assert.doesNotMatch(FRASE_ASSUMIR, /talvez|pode ser que|uma possibilidade é/i);
    assert.doesNotMatch(FRASE_CRITICA, /talvez|pode ser que|uma possibilidade é/i);
    assert.equal(contarCartao(leituraCol, FRASE_ASSUMIR), 1);
    assert.equal(contarCartao(leituraMel, FRASE_CRITICA), 1);
    const passos = leituraCol.find((cartao) => cartao.id === "semana")?.passos ?? [];
    assert.equal(passos.length, 3);
    assert.equal(new Set(passos).size, 3);
    assert.ok(textoDe(leituraCol).includes(FRASE_ASSUMIR));
    assert.ok(textoDe(leituraMel).includes(FRASE_CRITICA));
    assert.ok(!semAssumir.includes(FRASE_ASSUMIR));
    assert.ok(!semCritica.includes(FRASE_CRITICA));
    assert.match(semCritica, /você não marcou um comportamento para destacar/);
  });

  it("resultado antigo não finge descoberta de item", () => {
    const leitura = montarLeituraConversa({
      primario: "SANGUINEO",
      percentuais: { SANGUINEO: 40, COLERICO: 30, MELANCOLICO: 20, FLEUMATICO: 10 },
      respostas: { ...answersAll("sim"), E06: "sim", N02: "sim" },
      questionarioClaro: false,
    });
    const texto = textoDe(leitura);
    assert.equal(leitura.length, 11);
    assert.match(texto, /possibilidade/);
    assert.ok(!texto.includes(FRASE_ASSUMIR));
    assert.ok(!texto.includes(FRASE_CRITICA));
  });

  it("titulo do perfil usa temperamento dominante", () => {
    assert.equal(tituloPerfilTemperamento("COLERICO", "SANGUINEO", "DUPLO"), "Colérico");
    assert.equal(
      sanitizarTituloTemperamentoLegado("O Executor", "COLERICO", "SANGUINEO", "DUPLO"),
      "Colérico",
    );
  });

  it("DOMINANTE e MISTO são alcançáveis", () => {
    const sanguineo = computarTemperamento(
      entradaTemperamentoSchema.parse({ answers: answersSanguineo(), metadata: { tempo_total_segundos: 200 } }),
    );
    assert.ok(["DOMINANTE", "ATIPICO", "MISTO", "DUPLO"].includes(sanguineo.perfil.tipo));
  });
});
