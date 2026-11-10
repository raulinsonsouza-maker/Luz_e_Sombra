import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { estruturarTexto, pontuar } from "./formatarLeitura.ts";

const CARREIRA =
  "Você nasceu para os negócios. Empreendedorismo, finanças, investimentos, direito corporativo, política, medicina de alto nível, engenharia de grandes obras, gestão executiva. Você não é feito para trabalhar para os outros indefinidamente, cedo ou tarde, a liderança chama.";

const SAUDE =
  "Você trabalha até o limite e tende a ignorar sinais do corpo. Pontos de atenção: coração e sistema cardiovascular (pressão de responsabilidades), suprarrenais (burnout executivo), costas e ombros (peso que carrega). Pratique descanso com a mesma seriedade que trata negócios.";

const ESPIRITUAL =
  "Práticas de gratidão, filantropia consciente, meditação de intenção e trabalho com o karma são especialmente transformadores.";

const MES =
  "Escolha uma coisa só, aquela que você adia porque ainda não está redonda, e abra ela neste mês. O que você inicia agora marca o tom dos meses seguintes.";

describe("estruturarTexto", () => {
  it("tira a lista de profissões do meio do parágrafo", () => {
    const blocos = estruturarTexto(CARREIRA);
    assert.equal(blocos[0]?.tipo, "paragrafo");
    assert.equal(blocos[1]?.tipo, "lista");
    if (blocos[1]?.tipo === "lista") {
      assert.equal(blocos[1].itens[0], "Empreendedorismo.");
      assert.equal(blocos[1].itens.length, 8);
    }
    assert.match(blocos[2]?.tipo === "paragrafo" ? blocos[2].texto : "", /liderança chama/);
  });

  it("separa os pontos de atenção e mantém o que vem antes e depois", () => {
    const blocos = estruturarTexto(SAUDE);
    assert.equal(blocos[0]?.tipo, "paragrafo");
    assert.equal(blocos[1]?.tipo, "lista");
    if (blocos[1]?.tipo === "lista") {
      assert.equal(blocos[1].intro, "Pontos de atenção");
      assert.equal(blocos[1].itens.length, 3);
    }
    assert.match(blocos[2]?.tipo === "paragrafo" ? blocos[2].texto : "", /Pratique descanso/);
  });

  it("não parte uma frase que só enumera para concluir", () => {
    const blocos = estruturarTexto(ESPIRITUAL);
    assert.equal(blocos.length, 1);
    assert.equal(blocos[0]?.tipo, "paragrafo");
  });

  it("não parte o texto do mês", () => {
    const blocos = estruturarTexto(MES);
    assert.equal(blocos.length, 1);
    assert.equal(blocos[0]?.tipo, "paragrafo");
  });

  it("transforma os marcadores do ano em tópicos com ponto final", () => {
    const blocos = estruturarTexto(
      "Propósito central: Recomeço consciente e liderança pessoal.\n\nTemas principais:\n• INÍCIOS ESTRATÉGICOS: Não se trata de começar por começar.\n• AUTONOMIA VERDADEIRA: Aprenda a confiar nas suas escolhas.",
    );
    assert.equal(blocos[0]?.tipo, "rotulo");
    if (blocos[0]?.tipo === "rotulo") assert.equal(blocos[0].rotulo, "Propósito central");
    assert.equal(blocos[1]?.tipo, "rotulo");
    if (blocos[1]?.tipo === "rotulo") {
      assert.equal(blocos[1].rotulo, "Inícios estratégicos");
      assert.match(blocos[1].texto, /\.$/);
    }
  });

  it("lê os marcadores mesmo quando vêm na mesma linha", () => {
    const blocos = estruturarTexto(
      "Propósito central: Cultivar parcerias autênticas. Temas principais: • PARCERIAS ESTRATÉGICAS: As sementes plantadas precisam de colaboradores.",
    );
    assert.equal(blocos[0]?.tipo, "rotulo");
    assert.equal(blocos[1]?.tipo, "rotulo");
    if (blocos[1]?.tipo === "rotulo") assert.equal(blocos[1].rotulo, "Parcerias estratégicas");
  });

  it("fecha a citação e corrige a aspa depois do ponto", () => {
    const citacao = estruturarTexto('"Eu uso meu poder com sabedoria."');
    assert.equal(citacao[0]?.tipo, "citacao");
    const frase = estruturarTexto('Sensação de estar deslocado. "não pertenço aqui"');
    assert.match(frase[0]?.tipo === "paragrafo" ? frase[0].texto : "", /"Não pertenço aqui\."/);
  });

  it("põe ponto no tópico que chegou sem pontuação", () => {
    assert.equal(pontuar("Dificuldade em mostrar vulnerabilidade"), "Dificuldade em mostrar vulnerabilidade.");
    assert.equal(pontuar("Já termina."), "Já termina.");
  });

  it("não parte a prosa de comunicação Oral em tópicos preposicionais", () => {
    const blocos = estruturarTexto(
      "Você se comunica com abertura. A emoção aparece na voz e também no tom e no gesto. Falar ajuda a organizar o que sente.",
    );
    assert.ok(blocos.every((b) => b.tipo === "paragrafo"));
    assert.equal(
      blocos.some((b) => b.tipo === "lista"),
      false,
    );
  });

  it("não transforma 'nas palavras, no tom, no gesto' em lista", () => {
    const blocos = estruturarTexto("As emoções aparecem nas palavras, no tom, no gesto.");
    assert.equal(blocos.length, 1);
    assert.equal(blocos[0]?.tipo, "paragrafo");
  });

  it("não parte o cruzamento do trio do Traço em tópicos", () => {
    const blocos = estruturarTexto(
      "Lendo os três juntos, o centro da sua vida costuma girar em torno de vínculo e cuidado, com a cor de forma e compromisso e um fio de permanência e sustentação. Na prática, o Oral conduz; o Rígido organiza o jeito de conduzir; o Masoquista acrescenta textura.",
    );
    assert.ok(blocos.every((b) => b.tipo === "paragrafo"));
  });

  it("não parte a integração Oral+Rígido após dois-pontos longos", () => {
    const blocos = estruturarTexto(
      "A integração abre o vínculo sem perder a forma: receber sem se desorganizar, se entregar sem se abandonar, e deixar o afeto existir também fora da planilha emocional.",
    );
    assert.equal(blocos.length, 1);
    assert.equal(blocos[0]?.tipo, "paragrafo");
  });
});
