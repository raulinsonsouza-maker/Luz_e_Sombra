import type { EstruturaTraco, EstruturasPct, EixosReich } from "@workspace/traco-imagem-engine";
import type { FusaoDiagnosticoEmocionalMetadata } from "@workspace/traco-diagnostico-fusion";
import * as T from "./tabelas.js";

type PadraoEmocional = "vinculo" | "controle" | "estrategia" | "retencao" | "desconexao";

const LABEL_PADRAO: Record<PadraoEmocional, string> = {
  vinculo: "vínculo e acolhimento",
  controle: "controle e organização interna",
  estrategia: "estratégia e adaptação",
  retencao: "retenção e acúmulo emocional",
  desconexao: "desconexão e proteção",
};

function topPadroes(fusao: FusaoDiagnosticoEmocionalMetadata): [PadraoEmocional, PadraoEmocional] {
  const entries = Object.entries(fusao.padroesEmocionaisNormalizados ?? {}) as [PadraoEmocional, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const p1 = sorted[0]?.[0] ?? "vinculo";
  const p2 = sorted[1]?.[0] ?? "controle";
  return [p1, p2];
}

function principalDePct(pct: EstruturasPct): EstruturaTraco {
  const sorted = (Object.entries(pct) as [EstruturaTraco, number][]).sort((a, b) => b[1] - a[1]);
  return sorted[0]![0];
}

export function montarLeituraEmocionalDeclarada(
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  fusao?: FusaoDiagnosticoEmocionalMetadata,
): string | undefined {
  const padroes = fusao?.padroesEmocionaisNormalizados;
  if (!padroes || Object.keys(padroes).length === 0) return undefined;
  const [p1, p2] = topPadroes(fusao);
  const l1 = LABEL_PADRAO[p1];
  const l2 = LABEL_PADRAO[p2];
  return `No questionário, destacam-se${l1}e${l2}, isso conversa com a couraça de${T.NOMES[principal].toLowerCase()}e com a influência de${T.NOMES[secundaria].toLowerCase()}no dia a dia.`;
}

export function montarContrasteFotosFormulario(
  estruturasIntegradas: EstruturasPct,
  estruturasSomenteFotos: EstruturasPct | undefined,
  fusao?: FusaoDiagnosticoEmocionalMetadata,
): string | undefined {
  if (!estruturasSomenteFotos || !fusao) return undefined;
  const alinhamento = fusao.alinhamentoFotosFormulario;
  const pFoto = principalDePct(estruturasSomenteFotos);
  const pIntegrado = principalDePct(estruturasIntegradas);
  if (pFoto === pIntegrado && alinhamento >= 75) return undefined;
  const nomeFoto = T.NOMES[pFoto];
  const nomeInt = T.NOMES[pIntegrado];
  if (alinhamento < 55) {
    return `Pelas fotos sozinhas, o corpo sugeria mais${nomeFoto}; com o que você declarou no questionário, o perfil integrado destaca${nomeInt}. As duas leituras são válidas, a fusão equilibra corpo e história emocional.`;
  }
  if (pFoto !== pIntegrado) {
    return `O corpo nas fotos apontava para ${nomeFoto}, enquanto o conjunto fotos + respostas confirma ${nomeInt} como eixo principal.`;
  }
  return undefined;
}

export function montarCouracaCorporal(
  principal: EstruturaTraco,
  eixos?: EixosReich,
): string | undefined {
  if (!eixos) return undefined;
  const partes: string[] = [];
  if (eixos.indiceContencao > 0.4) {
    partes.push("Há contenção perceptível no tórax e na cintura, o corpo segura o que sente antes de expressar.");
  }
  if (eixos.indiceRetracao > 0.4) {
    partes.push("Sinais de retração sugerem proteção: recuar antes de ser tocado emocionalmente.");
  }
  if (eixos.indiceCompressao > 0.4) {
    partes.push("Compressão vertical indica pressão acumulada, muitas vezes lealdade ou autocobrança guardadas no corpo.");
  }
  if (eixos.indiceExpansao > 0.45 && principal === "psicopata") {
    partes.push("Expansão superior: presença que ocupa espaço, com coração ainda em processo de abertura.");
  }
  if (partes.length === 0) {
    return `O fluxo energético de ${T.NOMES[principal].toLowerCase()} circula de forma relativamente equilibrada entre ação e sentimento.`;
  }
  const centro = T.CENTROS[principal];
  return `${partes.join(" ")} ${centro}`;
}

export function montarPontosCuidadoPrioritarios(
  principal: EstruturaTraco,
  secundaria: EstruturaTraco,
  pontosAtencao: string[],
  comboKey: string,
): string[] {
  const out: string[] = [];
  out.push(T.CUIDADOS_FERIDA[principal]);
  for (const p of pontosAtencao.slice(0, 2)) {
    if (!out.includes(p)) out.push(p);
  }
  const comboRec = T.COMBOS[comboKey];
  if (comboRec && out.length < 4) {
    const curta = comboRec.length > 120 ? `${comboRec.slice(0, 117)}…` : comboRec;
    if (!out.some((x) => x.includes(curta.slice(0, 40)))) {
      out.push(`No vínculo ${T.NOMES[principal].toLowerCase()} + ${T.NOMES[secundaria].toLowerCase()}: observe onde o corpo protege em vez de conectar.`);
    }
  }
  return out.slice(0, 4);
}
