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
      temperamento: {
        primario: "MELANCOLICO",
        pontoCego: "Cobrar demais de si.",
        trechoRelacoes: "Você cria conexão com leveza e presença. Depois vem o desafio da constância.",
        trechoTrabalho: "Você brilha com pessoas e precisa de variedade. Rotina simples ajuda na entrega.",
      },
      traco: {
        estruturaPrincipal: "rigido",
        dinamicaFuncional: {
          relacoes: "Nas relações, a correção aparece antes do calor. Isso se repete em vários vínculos.",
          energia: "A energia sobe com dever cumprido. Sem lista, falta combustível.",
          trabalho: "No trabalho, o acerto importa mais que o ritmo. Isolamento longo drena.",
        },
      },
      linguagens: {
        receberPrincipal: "tempo",
        expressarPrincipal: "servicos",
        desalinhamento: { ativo: true, texto: "Você cuida na prática e precisa de presença." },
        cena: "Você fez algo difícil e ouviu um obrigado.",
      },
    });
    assert.equal(r.fontes.temperamento, true);
    assert.equal(r.fontes.traco, true);
    assert.equal(r.fontes.linguagens, true);

    const plenitude = r.analises.find((a) => a.id === "plenitudeFelicidade");
    assert.ok(plenitude?.comoTemperamentoEntra);
    assert.ok(plenitude?.comoTracoEntra);
    assert.ok(plenitude?.comoLinguagensEntram);
    assert.ok(!plenitude?.comoTracoEntra?.includes("energia sobe com dever"));

    const saude = r.analises.find((a) => a.id === "saudeDisposicao");
    assert.ok(saude?.comoTemperamentoEntra);
    assert.equal(saude?.comoLinguagensEntram, undefined);
    assert.ok(!saude?.comoTracoEntra?.includes("baixa voltagem") && !saude?.comoTracoEntra?.includes("energia sobe"));

    const amor = r.analises.find((a) => a.id === "desenvolvimentoAmoroso");
    assert.ok(amor?.comoLinguagensEntram);
    assert.ok(!amor?.comoLinguagensEntram?.includes("obrigado"));

    // trecho de relações não pode se repetir em família + amor + social
    const comTrechoLeveza = r.analises.filter((a) => a.comoTemperamentoEntra?.includes("leveza e presença"));
    assert.equal(comTrechoLeveza.length, 1);

    // gesto genérico do temperamento só nas frágeis, uma vez
    const gestoPlateia = r.analises.filter((a) =>
      a.comoMelhorar.some((p) => p.includes("sem plateia") || p.includes("bom o bastante") || p.includes("pare dois minutos")),
    );
    assert.ok(gestoPlateia.length <= 2);
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

  it("coloca gestos concretos nas áreas frágeis sem repetir o mesmo em todas", () => {
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
    const meio = r.analises.filter((a) => a.valor === 7);
    const meioComGestoSanguineo = meio.filter((a) =>
      a.comoMelhorar.some((p) => p.includes("sem plateia")),
    );
    assert.equal(meioComGestoSanguineo.length, 0);
  });
});
