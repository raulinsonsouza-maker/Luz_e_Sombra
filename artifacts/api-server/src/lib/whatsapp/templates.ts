/** Nomes dos templates Fase 1 (Letícia). Ver docs/whatsapp-cloud-api-setup.md
 *
 * Nota Meta: nomes ideais (portal_lembrete_2h / _24h / portal_pix_pendente /
 * portal_comunidade_nova_postagem) ficaram bloqueados (conteúdo antigo sem delete).
 * Usamos aliases aprováveis abaixo com o mesmo texto/botões.
 */

export const WA_TEMPLATES = {
  cadastroIniciado: "portal_cadastro_iniciado",
  lembrete2h: "portal_checkout_2h",
  lembrete24h: "portal_checkout_24h",
  pixPendente: "portal_pix_aguardando",
  acessoAtivado: "portal_acesso_ativado",
  comunidadeNovaPostagem: "portal_comunidade_aviso",
} as const;

export const WA_TEMPLATE_LANG = "pt_BR";

export type WaTemplateName = (typeof WA_TEMPLATES)[keyof typeof WA_TEMPLATES];

/** Textos de body (sem acentos). Links vão nos botões. */
export const WA_TEMPLATE_BODIES: Record<WaTemplateName, string> = {
  portal_cadastro_iniciado:
    "Oi, {{1}}! Recebemos seu cadastro para a Jornada Da Sombra a Luz, do Portal Iluminando. Para concluir sua inscricao e liberar seu acesso, finalize o pagamento pelo botao abaixo. Sua jornada esta a um passo de comecar!",
  portal_checkout_2h:
    "Oi, {{1}}! Sua inscricao na Jornada Da Sombra a Luz ainda nao foi concluida. Se deseja iniciar sua jornada de autoconhecimento no Portal Iluminando, voce pode retomar seu cadastro pelo botao abaixo.",
  portal_checkout_24h:
    "Oi, {{1}}! Passando para lembrar que sua inscricao no Portal Iluminando continua pendente. Se ainda deseja iniciar sua Jornada Da Sombra a Luz, voce pode concluir seu pagamento pelo botao abaixo.",
  portal_pix_aguardando:
    "Oi, {{1}}! O pagamento via PIX do pedido {{2}} ainda esta pendente. Assim que a confirmacao for recebida, seu acesso ao Portal Iluminando sera ativado.",
  portal_acesso_ativado:
    "Oi, {{1}}! Seu pagamento do pedido {{2}} foi confirmado e seu acesso ao Portal Iluminando esta ativo. Sua Jornada Da Sombra a Luz ja esta disponivel. Que bom ter voce por aqui. Seja bem-vindo(a) a essa jornada de autoconhecimento!",
  portal_comunidade_aviso:
    "Oi, {{1}}! Uma nova publicacao foi compartilhada na Comunidade do Portal Iluminando: {{2}}. Sua jornada continua em cada nova descoberta.",
};
