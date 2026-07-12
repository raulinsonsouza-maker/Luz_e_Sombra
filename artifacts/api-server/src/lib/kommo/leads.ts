import { getKommoConfig } from "./config";
import { kommoRequest } from "./client";
import { updateContactPhoneMobile } from "./contacts";
import { firstNameFromFullName } from "./phone";

type CustomFieldValue = { field_id: number; values: Array<{ value: string | number }> };

type KommoEmbeddedLeads = { leads?: Array<{ id: number }> };
type KommoEmbeddedContacts = { contacts?: Array<{ id: number; _embedded?: { leads?: Array<{ id: number }> } }> };
type KommoComplexResponse =
  | Array<{ id: number; contact_id?: number | null }>
  | { _embedded?: KommoEmbeddedLeads & KommoEmbeddedContacts };

function parseComplexResponse(data: KommoComplexResponse): { leadId: number; contactId: number | null } {
  if (Array.isArray(data)) {
    const row = data[0];
    if (!row?.id) throw new Error("Kommo não retornou lead_id em leads/complex");
    return { leadId: row.id, contactId: row.contact_id ?? null };
  }

  const leadId = data._embedded?.leads?.[0]?.id;
  const contactId = data._embedded?.contacts?.[0]?.id ?? null;
  if (!leadId) throw new Error("Kommo não retornou lead_id em leads/complex");
  return { leadId, contactId };
}

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
    fields.push({ field_id: cfg.cfUsuarioId, values: [{ value: String(input.usuarioId) }] });
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
                values: [{ value: input.phoneE164, enum_code: "MOB" }],
              },
            ],
          },
        ],
      },
    },
  ];
}

type ContactLeadRow = { contactId: number; leadIds: number[] };

async function listContactsByPhone(phoneE164: string): Promise<ContactLeadRow[]> {
  const query = phoneE164.replace(/\D/g, "");
  const data = await kommoRequest<{ _embedded?: KommoEmbeddedContacts }>({
    path: `/contacts?query=${encodeURIComponent(query)}&with=leads`,
  });

  return (data._embedded?.contacts ?? [])
    .filter((contact): contact is { id: number; _embedded?: { leads?: Array<{ id: number }> } } => !!contact?.id)
    .map((contact) => ({
      contactId: contact.id,
      leadIds: contact._embedded?.leads?.map((lead) => lead.id) ?? [],
    }));
}

/** Primeiro contato da busca (legado). Prefira `findOrphanContactByPhone` para reutilizar WPP. */
export async function findContactByPhone(phoneE164: string): Promise<{ contactId: number; leadId: number | null } | null> {
  const contacts = await listContactsByPhone(phoneE164);
  const contact = contacts[0];
  if (!contact) return null;
  return { contactId: contact.contactId, leadId: contact.leadIds[0] ?? null };
}

/** Contato sem lead — prioriza o mais antigo (ID menor), que costuma ter canal WPP vinculado. */
export async function findOrphanContactByPhone(phoneE164: string): Promise<number | null> {
  const contacts = await listContactsByPhone(phoneE164);
  const orphans = contacts.filter((contact) => contact.leadIds.length === 0);
  if (orphans.length === 0) return null;
  orphans.sort((a, b) => a.contactId - b.contactId);
  return orphans[0]?.contactId ?? null;
}

async function pickLeadByPhone(phoneE164: string): Promise<{ leadId: number; contactId: number } | null> {
  const cfg = getKommoConfig();
  const contacts = await listContactsByPhone(phoneE164);
  const pairs: Array<{ leadId: number; contactId: number }> = [];

  for (const contact of contacts) {
    for (const leadId of contact.leadIds) {
      pairs.push({ leadId, contactId: contact.contactId });
    }
  }
  if (pairs.length === 0) return null;

  const active: Array<{ leadId: number; contactId: number }> = [];
  for (const pair of pairs) {
    const lead = await kommoRequest<{ pipeline_id?: number; status_id?: number; is_deleted?: boolean }>({
      path: `/leads/${pair.leadId}`,
    });
    if (lead.is_deleted) continue;
    if (cfg.statusPerdido && lead.status_id === cfg.statusPerdido) continue;
    active.push(pair);
  }
  if (active.length === 0) return null;
  if (active.length === 1) return active[0]!;

  if (cfg.pipelineId) {
    for (const pair of active) {
      const lead = await kommoRequest<{ pipeline_id?: number }>({ path: `/leads/${pair.leadId}` });
      if (lead.pipeline_id === cfg.pipelineId) return pair;
    }
  }

  return active[0]!;
}

export async function findLeadByPhone(phoneE164: string): Promise<{ leadId: number; contactId: number | null } | null> {
  const found = await pickLeadByPhone(phoneE164);
  if (!found) return null;
  return found;
}

async function ensureLeadOnFunnelPipeline(leadId: number, statusId: number): Promise<void> {
  const cfg = getKommoConfig();
  if (!cfg.pipelineId) return;

  const lead = await kommoRequest<{ pipeline_id?: number }>({ path: `/leads/${leadId}` });
  if (lead.pipeline_id === cfg.pipelineId) return;

  await kommoRequest({
    method: "PATCH",
    path: `/leads/${leadId}`,
    body: { pipeline_id: cfg.pipelineId, status_id: statusId },
  });
}

async function createLeadWithExistingContact(
  contactId: number,
  input: CreateLeadInput,
): Promise<UpsertLeadResult> {
  const cfg = getKommoConfig();
  const customFields = buildCustomFields(input.customFields);

  const data = await kommoRequest<{ id?: number }>({
    method: "POST",
    path: "/leads",
    body: [
      {
        name: input.nome.trim(),
        pipeline_id: cfg.pipelineId,
        status_id: input.statusId,
        ...(customFields.length > 0 ? { custom_fields_values: customFields } : {}),
        _embedded: {
          contacts: [{ id: contactId }],
        },
      },
    ],
  });

  const leadId = Array.isArray(data) ? data[0]?.id : data.id;
  if (!leadId) throw new Error("Kommo não retornou lead_id ao vincular contato existente");

  await updateContactPhoneMobile(contactId, input.phoneE164);
  return { leadId, contactId, created: true };
}

export async function createLeadComplex(input: CreateLeadInput): Promise<UpsertLeadResult> {
  const data = await kommoRequest<KommoComplexResponse>({
    method: "POST",
    path: "/leads/complex",
    body: buildComplexPayload(input),
  });

  const { leadId, contactId } = parseComplexResponse(data);
  return { leadId, contactId, created: true };
}

export async function upsertLeadFromFunnel(input: CreateLeadInput): Promise<UpsertLeadResult> {
  const existing = await findLeadByPhone(input.phoneE164);
  if (existing) {
    if (existing.contactId) {
      await updateContactPhoneMobile(existing.contactId, input.phoneE164);
    }
    await ensureLeadOnFunnelPipeline(existing.leadId, input.statusId);
    // Lead já existe (mesmo telefone): só atualiza campos — não muda etapa (evita re-disparar bots).
    await setLeadCustomFields(existing.leadId, input.customFields);
    return { ...existing, created: false };
  }

  // Contato existe sem lead (ex.: leads apagados no CRM) — reutiliza WPP vinculado.
  const orphanContactId = await findOrphanContactByPhone(input.phoneE164);
  if (orphanContactId) {
    return createLeadWithExistingContact(orphanContactId, input);
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

/** Parse da resposta leads/complex (formato array ou _embedded). */
export function parseLeadComplexResponseForTest(data: unknown): { leadId: number; contactId: number | null } {
  return parseComplexResponse(data as KommoComplexResponse);
}
