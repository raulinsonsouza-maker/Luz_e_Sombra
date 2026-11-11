import type { EstruturaTraco, EstruturasPct } from "../types.js";

export type EtapaJornadaId =
  | "mapa"
  | "formacao"
  | "dor"
  | "recurso"
  | "vida"
  | "sombra"
  | "outros"
  | "integracao"
  | "luz";

export type BlocoJornada =
  | { tipo: "texto"; rotulo?: string; texto: string }
  | { tipo: "lista"; rotulo?: string; itens: string[] }
  | { tipo: "tabela"; rotulo?: string; cabecalhos: string[]; linhas: string[][] }
  | { tipo: "passos"; rotulo?: string; itens: string[] }
  | { tipo: "destaque"; rotulo?: string; texto: string }
  | {
      tipo: "cena";
      rotulo?: string;
      oQue: string;
      reacao: string;
      protege: string;
      consequencia: string;
    };

export type EtapaJornada = {
  id: EtapaJornadaId;
  numero: number;
  titulo: string;
  subtitulo: string;
  blocos: BlocoJornada[];
};

export type MapaJornada = {
  principal: EstruturaTraco;
  secundaria: EstruturaTraco;
  terciaria: EstruturaTraco;
  nomePrincipal: string;
  nomeSecundaria: string;
  nomeTerciaria: string;
  percentuais: EstruturasPct;
  pontosFortes: string[];
  pontosAtencao: string[];
  significado: string;
};

export type JornadaTraco = {
  aviso: string;
  mapa: MapaJornada;
  etapas: EtapaJornada[];
};
