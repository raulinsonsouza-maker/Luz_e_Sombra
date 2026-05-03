export type Dimensao = "ENG" | "SOC" | "DOM" | "EST" | "PRO";

export type TemperamentoCodigo = "COLERICO" | "SANGUINEO" | "MELANCOLICO" | "FLEUMATICO";

export type TipoPerfil = "DOMINANTE" | "DUPLO" | "MISTO" | "ATIPICO";

export type QualityFlag = "OK" | "LOW_VARIANCE" | "HIGH_CENTRAL_TENDENCY";

export type StatusResultado = "success" | "low_quality" | "error";

export const TEMPERAMENTOS: readonly TemperamentoCodigo[] = [
  "COLERICO",
  "SANGUINEO",
  "MELANCOLICO",
  "FLEUMATICO",
] as const;

export const DIMENSOES: readonly Dimensao[] = ["ENG", "SOC", "DOM", "EST", "PRO"] as const;
