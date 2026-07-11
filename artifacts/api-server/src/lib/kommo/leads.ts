import { getKommoConfig } from "./config";
import { kommoRequest } from "./client";
import { firstNameFromFullName } from "./phone";

type CustomFieldValue = { field_id: number; values: Array<{ value: string | number }> };

type KommoEmbeddedLeads = { leads?: Array<{ id: number }> };
type KommoEmbeddedContacts = { contacts?: Array<{ id: number; _embedded?: { leads?: Array<{ id: number }> } }> };
type KommoComplexResponse = { _embedded?: KommoEmbeddedLeads & KommoEmbeddedContacts };

export type LeadCustomFieldsInput = {
  checkoutUrl?: string;
  loginUrl?: string;
  email?: string;
  usuarioId?: number;
};

export type CreateLeadInput = {
  nome: string;
  email: string;
  phoneE164: string;
  statusId: number;
  customFields?: LeadCustomFieldsInput;
};

export type UpsertLeadResult = {
  leadId: number;
  contactId: number | null;
  created: boolean;
};

function buildCustomFields(input?: LeadCustomFieldsInput): CustomFieldValue[] {
  const cfg = getKommoConfig();
  const fields: CustomFieldValue[] = [];

  if (cfg.cfCheckoutUrl && input?.checkoutUrl) {
    fields.push({ field_id: cfg.cfCheckoutUrl, values: [{ value: input.checkoutUrl }] });
  }
  if (cfg.cfLoginUrl && input?.loginUrl) {
    fields.push({ field_id: cfg.cfLoginUrl, values: [{ value: input.loginUrl }] });
  }
  if (cfg.cfEmail && input?.email) {
    fields.push({ field_id: cfg.cfEmail, values: [{ value: input.email }] });
  }
  if (cfg.cfUsuarioId && input?.usuarioId !== undefined) {
    fields.push({ field_id: cfg.cfUsuarioId, values: [{ value: input.usuarioId }] });
  }

  return fields;
}

function buildComplexPayload(input: CreateLeadInput) {
  const cfg = getKommoConfig();
  const firstName = firstNameFromFullName(input.nome);
  const customFields = buildCustomFields(input.customFields);

  return [
    {
      name: input.nome.trim(),
      pipeline_id: cfg.pipelineId,
      status_id: input.statusId,
      ...(customFields.length > 0 ? { custom_fields_values: customFields } : {}),
      _embedded: {
        contacts: [
          {
            first_name: firstName,
            name: input.nome.trim(),
            custom_fields_values: [
              {
                field_code: "EMAIL",
                values: [{ value: input.email, enum_code: "WORK" }],
              },
              {
                field_code: "PHONE",
                values: [{ value: input.phoneE164, enum_code: "WORK" }],
              },
            ],
          },
        ],
      },
    },
  ];
}

export async function findLeadByPhone(phoneE164: string): Promise<{ leadId: number; contactId: number | null } | null> {
  const query = phoneE164.replace(/\D/g, "");
  const data = await kommoRequest<{ _embedded?: KommoEmbeddedContacts }>({
    path: `/contacts?query=${encodeURIComponent(query)}&with=leads`,
  });

  const contact = data._embedded?.contacts?.[0];
  if (!contact) return null;

  const leadId = contact._embedded?.leads?.[0]?.id;
  if (!leadId) return null;

  return { leadId, contactId: contact.id ?? null };
}

export async function createLeadComplex(input: CreateLeadInput): Promise<UpsertLeadResult> {
  const data = await kommoRequest<KommoComplexResponse>({
    method: "POST",
    path: "/leads/complex",
    body: buildComplexPayload(input),
  });

  const leadId = data._embedded?.leads?.[0]?.id;
  const contactId = data._embedded?.contacts?.[0]?.id ?? null;

  if (!leadId) {
    throw new Error("Kommo não retornou lead_id em leads/complex");
  }

  return { leadId, contactId, created: true };
}

export async function upsertLeadFromFunnel(input: CreateLeadInput): Promise<UpsertLeadResult> {
  const existing = await findLeadByPhone(input.phoneE164);
  if (existing) {
    await updateLeadStage(existing.leadId, input.statusId);
    await setLeadCustomFields(existing.leadId, input.customFields);
    return { ...existing, created: false };
  }

  return createLeadComplex(input);
}

export async function updateLeadStage(leadId: number, statusId: number): Promise<void> {
  await kommoRequest({
    method: "PATCH",
    path: `/leads/${leadId}`,
    body: { status_id: statusId },
  });
}

export async function setLeadCustomFields(leadId: number, input?: LeadCustomFieldsInput): Promise<void> {
  const customFields = buildCustomFields(input);
  if (customFields.length === 0) return;

  await kommoRequest({
    method: "PATCH",
    path: `/leads/${leadId}`,
    body: { custom_fields_values: customFields },
  });
}

/** Monta payload para testes unitários. */
export function buildLeadComplexPayloadForTest(input: CreateLeadInput): unknown {
  return buildComplexPayload(input);
}
