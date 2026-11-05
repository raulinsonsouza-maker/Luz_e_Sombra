import fs from "node:fs";

const raw = fs.readFileSync(new URL("../docs/base_de_frases.txt", import.meta.url), "utf8");
const blocks = raw.split(/\n(?=DIA \d+)/).filter((b) => /^DIA \d+/.test(b.trim()));
const dias = blocks.map((b) => {
  const dia = Number(b.match(/^DIA (\d+)/)[1]);
  const frase = b.match(/Frase:\s*([\s\S]*?)\nReflexão:/)?.[1]?.replace(/\s+/g, " ").trim();
  const reflexao = b.match(/Reflexão:\s*([\s\S]*?)\nConvite do dia:/)?.[1]?.replace(/\s+/g, " ").trim();
  const convite = b.match(/Convite do dia:\s*([\s\S]*)$/)?.[1]?.replace(/\s+/g, " ").trim();
  if (!frase || !reflexao || !convite) throw new Error(`incompleto ${dia}`);
  return { dia, frase, reflexao, convite };
});

if (dias.length !== 365) throw new Error(`count ${dias.length}`);
for (let i = 1; i <= 365; i++) {
  if (dias[i - 1]?.dia !== i) throw new Error(`ordem ${i}`);
}

const body = dias
  .map(
    (d) =>
      `  { dia: ${d.dia}, frase: ${JSON.stringify(d.frase)}, reflexao: ${JSON.stringify(d.reflexao)}, convite: ${JSON.stringify(d.convite)} },`,
  )
  .join("\n");

const out = `export type FraseDia = {
  dia: number;
  frase: string;
  reflexao: string;
  convite: string;
};

export const FRASES_ANO: readonly FraseDia[] = [
${body}
];

/** Dia do calendário (1 = 1º de janeiro). O dia 366 reutiliza o 365. */
export function diaDoCalendario(data: Date = new Date()): number {
  const inicio = Date.UTC(data.getFullYear(), 0, 1);
  const atual = Date.UTC(data.getFullYear(), data.getMonth(), data.getDate());
  const n = Math.floor((atual - inicio) / 86400000) + 1;
  return Math.min(Math.max(n, 1), 365);
}

export function fraseDoDia(data: Date = new Date()): FraseDia {
  const n = diaDoCalendario(data);
  return FRASES_ANO[n - 1]!;
}

const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

export function dataPorExtenso(data: Date = new Date()): string {
  const dia = String(data.getDate()).padStart(2, "0");
  return \`\${DIAS[data.getDay()].toUpperCase()} · \${dia} DE \${MESES[data.getMonth()].toUpperCase()}\`;
}
`;

const dest = new URL("../artifacts/luz-e-sombra/src/lib/frasesAno.ts", import.meta.url);
fs.writeFileSync(dest, out);
console.log("ok", dias.length);
