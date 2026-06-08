import test from "node:test";
import assert from "node:assert/strict";
import { agregarMarcadores } from "../marcadores.js";
import type { MarcadoresFoto } from "../types.js";

test("fotosComPoseCorpo 0 quando nenhuma foto de corpo tem pose completa", () => {
  const fotos: MarcadoresFoto[] = [
    {
      tipo: "rosto",
      poseDetectada: true,
      qualidadeFoto: 0.7,
      shr: null,
      wsr: null,
      ulr: null,
      simetria: 0.9,
      densidadeCorpo: null,
      definicaoBorda: null,
      inclinacaoAnterior: null,
      projecaoPeito: null,
      projecaoCraniana: null,
      ombrosAdiantados: null,
      colapsoToracico: null,
      simetriaFacial: 0.9,
      tensaoMandibula: 0.2,
      rigidezCervical: null,
    },
    {
      tipo: "corpo-frente",
      poseDetectada: false,
      qualidadeFoto: 0,
      shr: null,
      wsr: null,
      ulr: null,
      simetria: null,
      densidadeCorpo: null,
      definicaoBorda: null,
      inclinacaoAnterior: null,
      projecaoPeito: null,
      projecaoCraniana: null,
      ombrosAdiantados: null,
      colapsoToracico: null,
      simetriaFacial: null,
      tensaoMandibula: null,
      rigidezCervical: null,
    },
  ];
  const ag = agregarMarcadores(fotos);
  assert.equal(ag.fotosComPoseCorpo, 0);
});
