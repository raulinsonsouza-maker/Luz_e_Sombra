import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { comporLeitura } from "./compor.js";
import { MOLDURA } from "./moldura.js";

const SLOTS = {
  quemVoceE: "Você funciona assim no Esquizoide: a imaginação chega antes do corpo.",
  noDiaADia: "No trabalho você recua quando o ambiente fica barulhento demais.",
  sombra: "A sombra aqui é a rejeição. Não é um defeito. É o que ainda dói.",
  oQueFazer: "Hoje, fique um minuto com os pés no chão antes de responder a próxima mensagem.",
};

describe("comporLeitura", () => {
  it("devolve os quatro blocos na ordem da moldura", () => {
    const leitura = comporLeitura(SLOTS);
    assert.equal(leitura.secoes.length, 4);
    assert.deepEqual(
      leitura.secoes.map((s) => s.id),
      MOLDURA.secoes.map((s) => s.id),
    );
    assert.equal(leitura.secoes[0]?.titulo, "Quem você é");
    assert.equal(leitura.secoes[3]?.titulo, "O que fazer com isso");
  });

  it("limpa jargão e recusa o que sobrar", () => {
    const leitura = comporLeitura({
      ...SLOTS,
      quemVoceE: "Seu chakra do plexo solar pede pausa, e a couraça não é fraqueza.",
    });
    const texto = leitura.secoes[0]!.texto;
    assert.equal(/chakra|plexo|couraça|couraca/i.test(texto), false);
    assert.match(texto, /centro de energia/);
    assert.match(texto, /proteção/);
  });

  it("recusa leitura sem o passo prático", () => {
    assert.throws(() => comporLeitura({ ...SLOTS, oQueFazer: "   " }), /O que fazer com isso/);
  });

  it("mantém cada pedaço em seu parágrafo", () => {
    const leitura = comporLeitura({
      ...SLOTS,
      noDiaADia: ["No trabalho você precisa de silêncio.", "Em casa a conversa volta."],
    });
    assert.deepEqual(leitura.secoes[1]?.paragrafos, [
      "No trabalho você precisa de silêncio.",
      "Em casa a conversa volta.",
    ]);
    assert.equal(
      leitura.secoes[1]?.texto,
      "No trabalho você precisa de silêncio. Em casa a conversa volta.",
    );
  });

  it("não repete um pedaço que já está dentro de outro", () => {
    const leitura = comporLeitura({
      ...SLOTS,
      sombra: [
        "A rejeição dói quando o silêncio se prolonga demais.",
        "A rejeição dói quando o silêncio se prolonga demais. Ela não define quem você é.",
      ],
    });
    assert.equal(leitura.secoes[2]?.paragrafos.length, 1);
    assert.match(leitura.secoes[2]!.texto, /não define/);
  });

  it("guarda o título curto do pedaço", () => {
    const leitura = comporLeitura({
      ...SLOTS,
      noDiaADia: [{ rotulo: "No trabalho", texto: "Você precisa de silêncio para render." }],
    });
    assert.equal(leitura.secoes[1]?.itens[0]?.rotulo, "No trabalho");
    assert.match(leitura.secoes[1]!.texto, /silêncio/);
  });

  it("mantém os nomes dos cinco traços", () => {
    const leitura = comporLeitura({
      ...SLOTS,
      quemVoceE: "O traço Psicopata não é um apelido. É liderança e negociação aprendidas cedo.",
    });
    assert.match(leitura.secoes[0]!.texto, /Psicopata/);
  });
});
