/** Nomes dos templates aprovados na WABA (pt_BR). Ver docs/whatsapp-cloud-api-setup.md */

export const WA_TEMPLATES = {
  boasVindas: "portal_boas_vindas",
  pixPendente: "portal_pix_pendente",
  lembrete2h: "portal_lembrete_2h",
  lembrete24h: "portal_lembrete_24h",
  acessoLiberado: "portal_pagamento_ok",
  avisoCurso: "portal_aviso_curso",
  avisoComunidade: "portal_aviso_comunidade",
  avisoDia: "portal_aviso_dia",
} as const;

export const WA_TEMPLATE_LANG = "pt_BR";

export type WaTemplateName = (typeof WA_TEMPLATES)[keyof typeof WA_TEMPLATES];
