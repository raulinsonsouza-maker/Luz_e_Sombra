/** Sexo do cliente para concordância de tratamento (não entra em motores). */
export type SexoCliente = "feminino" | "masculino";

/** Fallback feminino = voz histórica do produto (ex.: Bem-vinda). */
export function sexoOuPadrao(sexo: string | null | undefined): SexoCliente {
  return sexo === "masculino" ? "masculino" : "feminino";
}

export function dirigir(
  sexo: string | null | undefined,
  variantes: { feminino: string; masculino: string },
): string {
  return sexoOuPadrao(sexo) === "masculino" ? variantes.masculino : variantes.feminino;
}

export const TRATAMENTO = {
  bemVindo: (sexo: string | null | undefined) =>
    dirigir(sexo, { feminino: "Bem-vinda", masculino: "Bem-vindo" }),
  mesmo: (sexo: string | null | undefined) =>
    dirigir(sexo, { feminino: "mesma", masculino: "mesmo" }),
  pronto: (sexo: string | null | undefined) =>
    dirigir(sexo, { feminino: "pronta", masculino: "pronto" }),
  iluminado: (sexo: string | null | undefined) =>
    dirigir(sexo, { feminino: "Iluminada", masculino: "Iluminado" }),
  chamada: (sexo: string | null | undefined) =>
    dirigir(sexo, { feminino: "chamada", masculino: "chamado" }),
} as const;

export function nomeNivelComSexo(nomeNivel: string, sexo: string | null | undefined): string {
  if (nomeNivel === "Iluminado" || nomeNivel === "Iluminada") {
    return TRATAMENTO.iluminado(sexo);
  }
  return nomeNivel;
}
