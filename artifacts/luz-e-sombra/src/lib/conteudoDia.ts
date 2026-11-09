import { apiFetch } from "@/lib/auth";
import { dataCurta, fraseDoDia, type FraseDia } from "@/lib/frasesAno";
import { imagemDoDia } from "@/lib/imagemDoDia";

export type ConteudoDia = {
  data: string;
  diaCalendario: number;
  frase: string;
  reflexao: string;
  convite: string;
  /** URL pública para exibir (pode ser /api/conteudo-dia/imagem/:id). */
  imagemUrl: string;
  /** Path armazenado (/imagens-dia/N.png ou /objects/...). */
  imagemPath?: string;
  /** Override de data na tela (ex: 11/11). Null = padrão. */
  dataExibicao?: string | null;
  /** Texto final da data para a UI. */
  dataRotulo?: string;
  editado: boolean;
  overrideId: number | null;
};

function dataLocalISO(data: Date = new Date()): string {
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, "0");
  const d = String(data.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fallbackLocal(data: Date = new Date()): ConteudoDia {
  const frase: FraseDia = fraseDoDia(data);
  return {
    data: dataLocalISO(data),
    diaCalendario: frase.dia,
    frase: frase.frase,
    reflexao: frase.reflexao,
    convite: frase.convite,
    imagemUrl: imagemDoDia(data),
    dataExibicao: null,
    dataRotulo: dataCurta(data),
    editado: false,
    overrideId: null,
  };
}

/** Busca o conteúdo editorial do dia (API com fallback local). */
export async function buscarConteudoDia(data?: Date | string): Promise<ConteudoDia> {
  const iso =
    typeof data === "string"
      ? data
      : data
        ? dataLocalISO(data)
        : dataLocalISO();
  const localDate =
    typeof data === "string"
      ? new Date(`${data}T12:00:00`)
      : data ?? new Date();

  try {
    const res = await apiFetch(`/conteudo-dia?data=${encodeURIComponent(iso)}`);
    if (res.ok) {
      const json = (await res.json()) as ConteudoDia;
      if (json?.frase && json?.imagemUrl) return json;
    }
  } catch {
    /* fallback */
  }
  return fallbackLocal(localDate);
}

export type ConteudoDiaMes = {
  ano: number;
  mes: number;
  dias: ConteudoDia[];
};

export async function buscarConteudoDiaMes(ano: number, mes: number): Promise<ConteudoDiaMes | null> {
  const res = await apiFetch(`/conteudo-dia/admin?ano=${ano}&mes=${mes}`);
  if (!res.ok) return null;
  return (await res.json()) as ConteudoDiaMes;
}
