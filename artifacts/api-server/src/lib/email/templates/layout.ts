import { EMAIL_JOURNEY_NAME, EMAIL_PORTAL_NAME } from "../branding";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface EmailLayoutParams {
  preheader?: string;
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  footerNote?: string;
}

export function renderEmailLayout({
  preheader,
  title,
  bodyHtml,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  footerNote,
}: EmailLayoutParams): string {
  const safeTitle = escapeHtml(title);

  const primaryCta =
    ctaLabel && ctaHref
      ? `<a href="${ctaHref}" style="display:inline-block;background:linear-gradient(135deg,#9c7742,#c8a56b);color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:12px;">
              ${escapeHtml(ctaLabel)}
            </a>`
      : "";

  const secondaryCta =
    secondaryCtaLabel && secondaryCtaHref
      ? `<a href="${secondaryCtaHref}" style="display:inline-block;margin-top:12px;color:#c8a56b;text-decoration:none;font-weight:600;font-size:14px;">
              ${escapeHtml(secondaryCtaLabel)} →
            </a>`
      : "";

  const ctaBlock =
    primaryCta || secondaryCta
      ? `<tr>
          <td style="padding: 28px 32px 8px;font-family:Arial,Helvetica,sans-serif;">
            ${primaryCta}
            ${secondaryCta ? `<br />${secondaryCta}` : ""}
          </td>
        </tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle} — ${escapeHtml(EMAIL_PORTAL_NAME)}</title>
</head>
<body style="margin:0;padding:0;background:#130f09;font-family:Georgia,'Times New Roman',serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>` : ""}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#130f09;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#1e1812;border:1px solid rgba(200,165,107,0.18);border-radius:18px;overflow:hidden;">
          <tr>
            <td style="padding:28px 32px 12px;border-bottom:1px solid rgba(200,165,107,0.12);">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#c8a56b;">${escapeHtml(EMAIL_PORTAL_NAME)}</p>
              <p style="margin:0 0 12px;font-size:12px;color:rgba(200,165,107,0.55);font-family:Arial,Helvetica,sans-serif;">${escapeHtml(EMAIL_JOURNEY_NAME)}</p>
              <h1 style="margin:0;font-size:24px;line-height:1.3;color:#f7f2ec;font-weight:400;">${safeTitle}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 8px;color:rgba(247,242,236,0.78);font-size:15px;line-height:1.7;font-family:Arial,Helvetica,sans-serif;">
              ${bodyHtml}
            </td>
          </tr>
          ${ctaBlock}
          <tr>
            <td style="padding:24px 32px 28px;color:rgba(247,242,236,0.35);font-size:12px;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">
              ${footerNote ? `<p style="margin:0 0 12px;">${footerNote}</p>` : ""}
              <p style="margin:0;">${escapeHtml(EMAIL_PORTAL_NAME)} · ${escapeHtml(EMAIL_JOURNEY_NAME)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function p(text: string): string {
  return `<p style="margin:0 0 16px;">${text}</p>`;
}

export function strong(text: string): string {
  return `<strong style="color:#f7f2ec;">${escapeHtml(text)}</strong>`;
}

export function link(href: string, label: string): string {
  return `<a href="${href}" style="color:#c8a56b;text-decoration:underline;">${escapeHtml(label)}</a>`;
}
