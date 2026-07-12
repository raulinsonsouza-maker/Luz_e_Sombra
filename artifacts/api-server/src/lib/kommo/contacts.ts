import { kommoRequest } from "./client";
import { firstNameFromFullName } from "./phone";

/** Atualiza nome, e-mail e celular ao reutilizar contato existente no cadastro. */
export async function updateContactFromRegistration(
  contactId: number,
  input: { nome: string; email: string; phoneE164: string },
): Promise<void> {
  const firstName = firstNameFromFullName(input.nome);
  await kommoRequest({
    method: "PATCH",
    path: `/contacts/${contactId}`,
    body: {
      name: input.nome.trim(),
      first_name: firstName,
      custom_fields_values: [
        {
          field_code: "EMAIL",
          values: [{ value: input.email, enum_code: "WORK" }],
        },
        {
          field_code: "PHONE",
          values: [{ value: input.phoneE164, enum_code: "MOB" }],
        },
      ],
    },
  });
}

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
