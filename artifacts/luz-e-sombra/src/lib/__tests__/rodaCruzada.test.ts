import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  AREAS_RODA_ORDEM,
  gerarAnaliseRodaCruzada,
  type AreaVidaId,
} from "../rodaCruzada";

const scoresLeticia: Record<AreaVidaId, number> = {
  plenitudeFelicidade: 4,
  espiritualidade: 8,
  saudeDisposicao: 7,
  desenvolvimentoIntelectual: 9,
  equilibrioEmocional: 8,
  familia: 7,
  desenvolvimentoAmoroso: 9,
  vidaSocial: 9,
  realizacaoProposito: 7,
  recursosFinanceiros: 7,
  contribuicaoSocial: 7,
  criatividadeHobbyDiversao: 4,
};

describe("gerarAnaliseRodaCruzada", () => {
  it("gera 12 áreas ordenadas da mais frágil à mais forte", () => {
    const r = gerarAnaliseRodaCruzada(scoresLeticia, {
      temperamento: null,
      traco: null,
      linguagens: null,
    });
    assert.equal(r.analises.length, 12);
    assert.equal(r.analises[0].id, "plenitudeFelicidade");
    assert.ok(r.analises[0].valor <= r.analises[r.analises.length - 1].valor);
    assert.equal(r.fontes.temperamento, false);
    assert.equal(r.fontes.traco, false);
    assert.equal(r.fontes.linguagens, false);
  });

  it("omite cruzamentos quando o módulo falta", () => {
    const r = gerarAnaliseRodaCruzada(scoresLeticia, {
      temperamento: null,
      traco: null,
      linguagens: null,
    });
    for (const a of r.analises) {
      assert.equal(a.comoTemperamentoEntra, undefined);
      assert.equal(a.comoTracoEntra, undefined);
      assert.equal(a.comoLinguagensEntram, undefined);
      assert.ok(a.oQueAcontece.length > 20);
      assert.ok(a.comoMelhorar.length >= 1);
      assert.ok(a.pergunta.endsWith("?"));
    }
  });

  it("inclui temperamento, traço e linguagens quando há contexto", () => {
    const r = gerarAnaliseRodaCruzada(scoresLeticia, {
      temperamento: { primario: "MELANCOLICO", pontoCego: "cobrar demais de si" },
      traco: {
        estruturaPrincipal: "rigido",
        dinamicaFuncional: {
          relacoes: "Nas relações, a correção aparece antes do calor.",
          energia: "A energia sobe com dever cumprido.",
        },
      },
      linguagens: {
        receberPrincipal: "tempo",
        expressarPrincipal: "servicos",
        desalinhamento: { ativo: true, texto: "Você cuida na prática e precisa de presença." },
      },
    });
    assert.equal(r.fontes.temperamento, true);
    assert.equal(r.fontes.traco, true);
    assert.equal(r.fontes.linguagens, true);

    const plenitude = r.analises.find((a) => a.id === "plenitudeFelicidade");
    assert.ok(plenitude?.comoTemperamentoEntra);
    assert.ok(plenitude?.comoTracoEntra);
    assert.ok(plenitude?.comoLinguagensEntram);

    const saude = r.analises.find((a) => a.id === "saudeDisposicao");
    assert.ok(saude?.comoTemperamentoEntra);
    assert.equal(saude?.comoLinguagensEntram, undefined);

    const amor = r.analises.find((a) => a.id === "desenvolvimentoAmoroso");
    assert.ok(amor?.comoLinguagensEntram?.includes("tempo") || amor?.comoLinguagensEntram?.includes("presença"));
  });

  it("não coloca travessão na saída", () => {
    const r = gerarAnaliseRodaCruzada(scoresLeticia, {
      temperamento: { primario: "COLERICO" },
      traco: { estruturaPrincipal: "oral" },
      linguagens: { receberPrincipal: "palavras", expressarPrincipal: "palavras" },
    });
    const raw = JSON.stringify(r);
    assert.ok(!raw.includes("—"), "copy não deve conter travessões");
    assert.equal(AREAS_RODA_ORDEM.length, 12);
  });

  it("coloca gestos concretos nas áreas frágeis", () => {
    const r = gerarAnaliseRodaCruzada(scoresLeticia, {
      temperamento: { primario: "SANGUINEO" },
      traco: { estruturaPrincipal: "masoquista" },
      linguagens: null,
    });
    const frageis = r.analises.filter((a) => a.valor <= 5);
    assert.ok(frageis.length >= 2);
    for (const a of frageis) {
      assert.ok(a.comoMelhorar.length >= 1);
      assert.ok(a.comoMelhorar.join(" ").length > 30);
    }
  });
});
