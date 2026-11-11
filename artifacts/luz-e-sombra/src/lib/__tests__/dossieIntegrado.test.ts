import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { gerarDossieIntegrado } from "../dossieIntegrado";

describe("gerarDossieIntegrado qualidade", () => {
  it("monta síntese sem 'e e' nem ponto duplo", () => {
    const d = gerarDossieIntegrado({
      primeiroNome: "Leticia",
      vidaNum: 8,
      expressaoNum: 9,
      almaNum: 7,
      personalidadeNum: 11,
      anoPessoalNum: 8,
      traco: {
        estruturaPrincipal: "oral",
        estruturas: { oral: 29, rigido: 22, esquizoide: 18, psicopata: 16, masoquista: 15 },
      },
      temperamento: {
        primario: "SANGUINEO",
        arquetipo: "Sanguíneo",
        pontoCego: "Quando a fase emocionante acaba, você pode abandonar antes de terminar.",
        trechoRelacoes: "Você cria conexão com leveza e presença.",
      },
      linguagens: {
        receberPrincipal: "palavras",
        expressarPrincipal: "palavras",
      },
      avaliacao: {
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
      },
      diagnosticoEmocional: {
        padroesPct: { vinculo: 24, controle: 18, estrategia: 16, retencao: 15, desconexao: 12 },
        mediaConsciencia: 4.2,
        tagEvolucao: "integrado",
      },
      idade: 35,
    });

    assert.ok(d.sinteseIdentidade);
    assert.ok(!d.sinteseIdentidade!.includes("e e "));
    assert.ok(!/\.\s*\./.test(d.sinteseIdentidade!));
    assert.ok(!d.sinteseIdentidade!.includes("Onde eu estou"));

    const padrao = d.mapaEntendimento.find((m) => m.titulo === "Padrão emocional dominante");
    assert.ok(padrao);
    assert.ok(padrao!.texto.includes("24%"));
    assert.ok(!padrao!.texto.includes("2400"));
    assert.ok(padrao!.texto.includes("vínculo"));

    const mapaTemp = d.mapaEntendimento.find((m) => m.titulo === "Como você decide e se relaciona");
    assert.ok(mapaTemp);
    assert.ok(!mapaTemp!.texto.includes("Onde eu estou, as coisas acontecem"));

    assert.ok(d.perguntaCentral);
    assert.ok(d.acoesPrioritarias.every((a) => !a.trim().endsWith("?")));
    assert.ok(!d.pontosChave.some((p) => p.toLowerCase().startsWith("ponto cego")));
    assert.ok(!JSON.stringify(d).includes("—"));
  });
});
