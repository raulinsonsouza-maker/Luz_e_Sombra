import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { combinacaoTrioDe } from "../combinacoes-trio.js";
import { PERFIS_TRACO } from "../perfis/index.js";
import { comporJornadaTraco, estruturaTerciariaDe, idsEtapas, textosDaJornada } from "./compor.js";

const BASE = {
  estruturas: {
    esquizoide: 11,
    oral: 29,
    psicopata: 13,
    masoquista: 22,
    rigido: 25,
  },
  estruturaPrincipal: "oral" as const,
  estruturaSecundaria: "rigido" as const,
};

describe("comporJornadaTraco", () => {
  it("devolve as nove etapas na ordem", () => {
    const jornada = comporJornadaTraco(BASE);
    assert.deepEqual(idsEtapas(jornada), [
      "mapa",
      "formacao",
      "dor",
      "recurso",
      "vida",
      "sombra",
      "outros",
      "integracao",
      "luz",
    ]);
    assert.equal(jornada.etapas.length, 9);
    assert.match(jornada.mapa.nomePrincipal, /Oral/);
    assert.match(jornada.mapa.nomeSecundaria, /Rígido/);
    assert.match(jornada.mapa.nomeTerciaria, /Masoquista/);
  });

  it("deriva o terceiro traço pelo ranking de percentuais", () => {
    assert.equal(estruturaTerciariaDe(BASE.estruturas, "oral", "rigido"), "masoquista");
  });

  it("explica percentuais no mapa e não fala em diagnóstico", () => {
    const jornada = comporJornadaTraco(BASE);
    const mapa = jornada.etapas.find((e) => e.id === "mapa");
    const blob = mapa?.blocos
      .filter((b) => b.tipo === "texto")
      .map((b) => b.texto)
      .join(" ");
    assert.match(blob ?? "", /distribuição relativa/i);
    assert.match(jornada.aviso, /não.*diagnóstico|não um diagnóstico/i);
  });

  it("formação traz interpretações da criança e estratégia", () => {
    const jornada = comporJornadaTraco(BASE);
    const formacao = jornada.etapas.find((e) => e.id === "formacao");
    const lista = formacao?.blocos.find((b) => b.tipo === "lista");
    assert.ok(lista && lista.tipo === "lista");
    assert.ok(lista.itens.length >= 3);
    const blob = formacao?.blocos
      .filter((b) => b.tipo === "texto")
      .map((b) => b.texto)
      .join(" ");
    assert.match(blob ?? "", /pode ter|observe se/i);
  });

  it("recurso usa tabela de quatro colunas", () => {
    const jornada = comporJornadaTraco(BASE);
    const recurso = jornada.etapas.find((e) => e.id === "recurso");
    const tabela = recurso?.blocos.find((b) => b.tipo === "tabela");
    assert.ok(tabela && tabela.tipo === "tabela");
    assert.equal(tabela.cabecalhos.length, 4);
    assert.ok(tabela.linhas.length >= 4);
    assert.equal(tabela.linhas[0]?.length, 4);
  });

  it("vida traz seis cenas concretas", () => {
    const jornada = comporJornadaTraco(BASE);
    const vida = jornada.etapas.find((e) => e.id === "vida");
    const cenas = vida?.blocos.filter((b) => b.tipo === "cena") ?? [];
    assert.equal(cenas.length, 6);
  });

  it("etapa 7 traz síntese do trio Oral+Rígido+Masoquista", () => {
    const jornada = comporJornadaTraco(BASE);
    const outros = jornada.etapas.find((e) => e.id === "outros");
    const texto = outros?.blocos
      .filter((b) => b.tipo === "texto" || b.tipo === "destaque")
      .map((b) => ("texto" in b ? b.texto : ""))
      .join(" ");
    assert.match(texto ?? "", /Oral/);
    assert.match(texto ?? "", /Rígido/);
    assert.match(texto ?? "", /Masoquista/);
    assert.match(texto ?? "", /tensão|tensões|comum|reciprocidade/i);
    const combo = combinacaoTrioDe("oral", "rigido", "masoquista");
    assert.ok(combo);
    assert.match(texto ?? "", /dedicada, comprometida e muito presente/i);
    const rotulos = outros?.blocos
      .filter((b) => b.tipo === "texto" && b.rotulo)
      .map((b) => (b.tipo === "texto" ? b.rotulo : ""))
      .join(" ");
    assert.match(rotulos ?? "", /vínculo|reconhecimento|sustentar/i);
  });

  it("não coloca jargão residual nem travessão na saída", () => {
    const jornada = comporJornadaTraco(BASE);
    const blob = textosDaJornada(jornada).join(" ");
    assert.equal(
      /convergência|assertividade|couraça|\bchakra\b|\bplexo\b|% de confiança|landmarks|biométrica|mecanismo de proteção/i.test(
        blob,
      ),
      false,
    );
    assert.equal(blob.includes("—"), false);
  });

  it("mantém os cinco perfis carregados", () => {
    assert.equal(Object.keys(PERFIS_TRACO).length, 5);
    for (const p of Object.values(PERFIS_TRACO)) {
      assert.ok(p.inteligenciaProtecao.recursos.length >= 4);
      assert.ok(p.integracao.exercicios.length >= 3);
      assert.ok(p.manifestacoes.trabalho.oQue);
    }
  });
});
