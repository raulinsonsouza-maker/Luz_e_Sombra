import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CODIGOS_PAR, PARES_FORCADOS } from "./pares";
import { entradaTemperamentoSchema } from "./schemas";
import { computarTemperamento } from "./compute";
import { tituloPerfilTemperamento, sanitizarTituloTemperamentoLegado } from "./interpretacao";
import { gerarOrdemPares } from "./shufflePares";
import { TEMPERAMENTOS } from "./types";

function answersAll(lado: "a" | "b"): Record<string, "a" | "b"> {
  return Object.fromEntries(CODIGOS_PAR.map((c) => [c, lado])) as Record<string, "a" | "b">;
}

function answersFavorecendo(temp: "COLERICO" | "SANGUINEO" | "MELANCOLICO" | "FLEUMATICO"): Record<string, "a" | "b"> {
  const ans: Record<string, "a" | "b"> = {};
  for (const par of PARES_FORCADOS) {
    if (par.temperamentoA === temp) ans[par.id] = "a";
    else if (par.temperamentoB === temp) ans[par.id] = "b";
    else ans[par.id] = "a";
  }
  return ans;
}

describe("temperamento-v2", () => {
  it("matriz balanceada: cada temperamento aparece 12 vezes", () => {
    const count = { COLERICO: 0, SANGUINEO: 0, MELANCOLICO: 0, FLEUMATICO: 0 };
    for (const par of PARES_FORCADOS) {
      count[par.temperamentoA]++;
      count[par.temperamentoB]++;
    }
    for (const t of TEMPERAMENTOS) {
      assert.equal(count[t], 12, `${t} deve aparecer 12 vezes`);
    }
    assert.equal(PARES_FORCADOS.length, 24);
  });

  it("viés de lado A reduz confiabilidade", () => {
    const raw = entradaTemperamentoSchema.parse({
      answers: answersAll("a"),
      metadata: { tempo_total_segundos: 120 },
    });
    const r = computarTemperamento(raw);
    assert.equal(r.quality_flag, "HIGH_CENTRAL_TENDENCY");
    assert.ok(r.confiabilidade < 100);
  });

  it("gerarOrdemPares devolve 24 pares únicos", () => {
    const ordem = gerarOrdemPares();
    assert.equal(ordem.length, 24);
    const ids = new Set(ordem.map((p) => p.id));
    assert.equal(ids.size, 24);
  });

  it("narrativa v3 inclui retrato de identidade claro", () => {
    const raw = entradaTemperamentoSchema.parse({
      answers: answersFavorecendo("COLERICO"),
      metadata: { tempo_total_segundos: 300 },
    });
    const r = computarTemperamento(raw);
    assert.equal(r.versaoNarrativa, "temperamento_v3");
    assert.equal(r.perfil.primario, "COLERICO");
    assert.ok(r.portraitIdentidade.length > 40);
    assert.ok(r.tracosMarcantes.length >= 1);
    assert.ok(!JSON.stringify(r).includes("—"), "copy user-facing não deve conter travessões");
  });

  it("escolhas consistentes produzem perfil dominante coerente", () => {
    const raw = entradaTemperamentoSchema.parse({
      answers: answersFavorecendo("SANGUINEO"),
      metadata: { tempo_total_segundos: 300 },
    });
    const r = computarTemperamento(raw);
    assert.equal(r.perfil.primario, "SANGUINEO");
    assert.ok(r.scores.temperamentos_percentuais.SANGUINEO > 40);
    const sumPct = Object.values(r.scores.temperamentos_percentuais).reduce((a, b) => a + b, 0);
    assert.ok(Math.abs(sumPct - 100) < 0.01);
  });

  it("rejeita códigos v1 obsoletos", () => {
    const parsed = entradaTemperamentoSchema.safeParse({
      answers: { ENG01: "a" },
      metadata: {},
    });
    assert.equal(parsed.success, false);
  });

  it("titulo do perfil usa temperamento dominante", () => {
    assert.equal(tituloPerfilTemperamento("COLERICO", "SANGUINEO", "DUPLO"), "Colérico");
    assert.equal(tituloPerfilTemperamento("FLEUMATICO", "FLEUMATICO", "DOMINANTE"), "Fleumático");
    assert.equal(
      sanitizarTituloTemperamentoLegado("O Executor", "COLERICO", "SANGUINEO", "DUPLO"),
      "Colérico",
    );
  });
});
