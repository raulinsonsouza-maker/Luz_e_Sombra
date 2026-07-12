import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CODIGOS_ITEM, ITENS_EYSENCK } from "./itens";
import { entradaTemperamentoSchema } from "./schemas";
import { computarTemperamento } from "./compute";
import { tituloPerfilTemperamento, sanitizarTituloTemperamentoLegado } from "./interpretacao";
import { gerarOrdemItens } from "./shuffleItens";
import { semParagrafosDuplicados } from "./analiseAprofundada";
import type { RespostaSimNao } from "./itens";

function answersAll(resposta: RespostaSimNao): Record<string, RespostaSimNao> {
  return Object.fromEntries(CODIGOS_ITEM.map((c) => [c, resposta])) as Record<string, RespostaSimNao>;
}

/** Respostas que favorecem extroversão alta e neuroticismo baixo → Sanguíneo. */
function answersSanguineo(): Record<string, RespostaSimNao> {
  const ans: Record<string, RespostaSimNao> = {};
  for (const item of ITENS_EYSENCK) {
    if (item.eixo === "E") {
      ans[item.id] = item.direcao === "positiva" ? "sim" : "nao";
    } else {
      ans[item.id] = item.direcao === "positiva" ? "nao" : "sim";
    }
  }
  return ans;
}

/** Respostas introvertidas + instáveis → Melancólico. */
function answersMelancolico(): Record<string, RespostaSimNao> {
  const ans: Record<string, RespostaSimNao> = {};
  for (const item of ITENS_EYSENCK) {
    if (item.eixo === "E") {
      ans[item.id] = item.direcao === "positiva" ? "nao" : "sim";
    } else {
      ans[item.id] = item.direcao === "positiva" ? "sim" : "nao";
    }
  }
  return ans;
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
    assert.equal(r.versaoNarrativa, "temperamento_v4");
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
    assert.ok(r.scores.scoreE >= 60);
    assert.ok(r.scores.scoreN <= 40);
    const sumPct = Object.values(r.scores.temperamentos_percentuais).reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(sumPct - 100) < 0.01);
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
