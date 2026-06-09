import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CODIGOS_PERGUNTA } from "./perguntas";
import { entradaTemperamentoSchema } from "./schemas";
import { computarTemperamento } from "./compute";
import { tituloPerfilTemperamento, sanitizarTituloTemperamentoLegado } from "./interpretacao";
import { gerarOrdemBlocosPerguntas } from "./shuffle";
import { desvioPadrao } from "./qualidade";

function answersAll(value: number): Record<string, number> {
  return Object.fromEntries(CODIGOS_PERGUNTA.map((c) => [c, value])) as Record<string, number>;
}

describe("temperamento-v1", () => {
  it("todas as respostas 3 → baixa variância e status low_quality", () => {
    const raw = entradaTemperamentoSchema.parse({
      answers: answersAll(3),
      metadata: { tempo_total_segundos: 120 },
    });
    const r = computarTemperamento(raw);
    assert.equal(r.quality_flag, "LOW_VARIANCE");
    assert.equal(r.status, "low_quality");
    assert.ok(r.confiabilidade < 100);
  });

  it("desvio padrão de constantes é 0", () => {
    assert.equal(desvioPadrao([3, 3, 3, 3]), 0);
  });

  it("gerarOrdemBlocosPerguntas nunca coloca SOC no primeiro bloco", () => {
    for (let i = 0; i < 500; i++) {
      const blocos = gerarOrdemBlocosPerguntas();
      const d0 = blocos[0]![0]!.dimensao;
      assert.notEqual(d0, "SOC", `iteração ${i}`);
    }
  });

  it("narrativa v3 inclui retrato de identidade claro", () => {
    const ans = answersAll(3);
    for (const c of CODIGOS_PERGUNTA) {
      if (c.startsWith("ENG") || c.startsWith("DOM") || c.startsWith("SOC")) ans[c] = 5;
    }
    const raw = entradaTemperamentoSchema.parse({
      answers: ans,
      metadata: { tempo_total_segundos: 300 },
    });
    const r = computarTemperamento(raw);
    assert.equal(r.versaoNarrativa, "temperamento_v3");
    assert.ok(r.portraitIdentidade.length > 40);
    assert.ok(r.tracosMarcantes.length >= 1);
    assert.ok(r.sinteseHumana.includes("Você") || r.sinteseHumana.length > 10);
    assert.ok(!JSON.stringify(r).includes("—"), "copy user-facing não deve conter travessões");
  });

  it("respostas extremas altas aumentam ENG/DOM e devolvem perfil coerente", () => {
    const ans = answersAll(1);
    for (const c of CODIGOS_PERGUNTA) {
      if (c.startsWith("ENG") || c.startsWith("DOM")) ans[c] = 5;
    }
    const raw = entradaTemperamentoSchema.parse({
      answers: ans,
      metadata: { tempo_total_segundos: 300 },
    });
    const r = computarTemperamento(raw);
    assert.ok(r.scores.dimensoes.ENG.normalizado > 0.5);
    assert.ok(r.scores.dimensoes.DOM.normalizado > 0.5);
    const sumPct = Object.values(r.scores.temperamentos_percentuais).reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(sumPct - 100) < 0.01);
  });

  it("titulo do perfil usa temperamento dominante", () => {
    assert.equal(
      tituloPerfilTemperamento("COLERICO", "SANGUINEO", "DUPLO"),
      "Colérico",
    );
    assert.equal(tituloPerfilTemperamento("FLEUMATICO", "FLEUMATICO", "DOMINANTE"), "Fleumático");
    assert.equal(
      sanitizarTituloTemperamentoLegado("O Executor", "COLERICO", "SANGUINEO", "DUPLO"),
      "Colérico",
    );
    assert.equal(
      sanitizarTituloTemperamentoLegado("Colérico + Sanguíneo", "COLERICO", "SANGUINEO", "DUPLO"),
      "Colérico",
    );
  });
});
