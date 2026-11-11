import type { AnalysisPageContent } from "../types";
import { ANALISE_TRACOS } from "./tracos-de-carater";
import { ANALISE_TEMPERAMENTO } from "./temperamento";
import { ANALISE_LINGUAGENS } from "./linguagens-do-amor";
import { ANALISE_RODA } from "./roda-da-vida";
import { ANALISE_NUMEROLOGIA } from "./numerologia";
import { ANALISE_CICLOS } from "./ciclos-numerologicos";
import { ANALISE_NUM_DIARIA } from "./numerologia-diaria";
import { ANALISE_REFLEXAO } from "./reflexao-diaria";
import { ANALISE_DOSSIE } from "./dossie-de-vida";

export const ANALISES: AnalysisPageContent[] = [
  ANALISE_TRACOS,
  ANALISE_TEMPERAMENTO,
  ANALISE_LINGUAGENS,
  ANALISE_RODA,
  ANALISE_NUMEROLOGIA,
  ANALISE_CICLOS,
  ANALISE_NUM_DIARIA,
  ANALISE_REFLEXAO,
  ANALISE_DOSSIE,
];

export function getAnaliseBySlug(slug: string) {
  return ANALISES.find((a) => a.slug === slug);
}

export function getAnaliseByPath(p: string) {
  return ANALISES.find((a) => a.path === p);
}
