import { kommoRequest } from "./client";

/** Telefone celular (MOB) — Kommo/WhatsApp Lite associa melhor que Tel comercial (WORK). */
export async function updateContactPhoneMobile(
  contactId: number,
  phoneE164: string,
): Promise<void> {
  await kommoRequest({
    method: "PATCH",
    path: `/contacts/${contactId}`,
    body: {
      custom_fields_values: [
        {
          field_code: "PHONE",
          values: [{ value: phoneE164, enum_code: "MOB" }],
        },
      ],
    },
  });
}
