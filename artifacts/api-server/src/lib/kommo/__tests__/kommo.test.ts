import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeBrazilPhoneE164,
  firstNameFromFullName,
} from "../phone.js";
import { buildLeadComplexPayloadForTest, parseLeadComplexResponseForTest } from "../leads.js";
import { buildPixPendenteMessage, buildAcessoLiberadoMessage } from "../messages.js";

describe("kommo phone", () => {
  it("normaliza celular BR para E.164", () => {
    assert.equal(normalizeBrazilPhoneE164("(11) 99999-8888"), "+5511999998888");
    assert.equal(normalizeBrazilPhoneE164("11999998888"), "+5511999998888");
    assert.equal(normalizeBrazilPhoneE164("+55 11 99999-8888"), "+5511999998888");
    assert.equal(normalizeBrazilPhoneE164("5511999998888"), "+5511999998888");
  });

  it("rejeita telefone inválido", () => {
    assert.equal(normalizeBrazilPhoneE164("123"), null);
    assert.equal(normalizeBrazilPhoneE164(""), null);
    assert.equal(normalizeBrazilPhoneE164(null), null);
  });

  it("extrai primeiro nome", () => {
    assert.equal(firstNameFromFullName("Maria Silva"), "Maria");
    assert.equal(firstNameFromFullName("João"), "João");
  });
});

describe("kommo leads/complex payload", () => {
  it("monta lead com contato email e telefone", () => {
    process.env.KOMMO_PIPELINE_ID = "123";
    process.env.KOMMO_CF_CHECKOUT_URL = "1001";
    process.env.KOMMO_CF_LOGIN_URL = "1002";

    const payload = buildLeadComplexPayloadForTest({
      nome: "Maria Silva",
      email: "maria@example.com",
      phoneE164: "+5511999998888",
      statusId: 456,
      customFields: {
        checkoutUrl: "https://portaliluminando.com.br/checkout?token=abc",
        loginUrl: "https://portaliluminando.com.br/login",
        email: "maria@example.com",
        usuarioId: 42,
      },
    }) as Array<Record<string, unknown>>;

    assert.equal(payload.length, 1);
    const lead = payload[0]!;
    assert.equal(lead.pipeline_id, 123);
    assert.equal(lead.status_id, 456);
    assert.equal(lead.name, "Maria Silva");

    const embedded = lead._embedded as { contacts: Array<Record<string, unknown>> };
    const contact = embedded.contacts[0]!;
    assert.equal(contact.first_name, "Maria");

    const fields = contact.custom_fields_values as Array<{ field_code: string; values?: Array<{ enum_code?: string }> }>;
    assert.ok(fields.some((f) => f.field_code === "EMAIL"));
    const phoneField = fields.find((f) => f.field_code === "PHONE");
    assert.ok(phoneField);
    assert.equal(phoneField?.values?.[0]?.enum_code, "MOB");

    delete process.env.KOMMO_PIPELINE_ID;
    delete process.env.KOMMO_CF_CHECKOUT_URL;
    delete process.env.KOMMO_CF_LOGIN_URL;
  });

  it("parseia resposta array do leads/complex", () => {
    const parsed = parseLeadComplexResponseForTest([{ id: 6945514, contact_id: 17705710 }]);
    assert.equal(parsed.leadId, 6945514);
    assert.equal(parsed.contactId, 17705710);
  });
});

describe("kommo messages", () => {
  it("monta mensagem PIX pendente com primeiro nome e checkout", () => {
    const text = buildPixPendenteMessage({
      nome: "Maria Silva",
      checkoutUrl: "https://portaliluminando.com.br/checkout?token=abc",
    });
    assert.ok(text.includes("Oi, Maria!"));
    assert.ok(text.includes("checkout?token=abc"));
  });

  it("monta mensagem acesso liberado com email e login", () => {
    const text = buildAcessoLiberadoMessage({
      nome: "Maria Silva",
      email: "maria@example.com",
      loginUrl: "https://portaliluminando.com.br/login",
    });
    assert.ok(text.includes("Maria, pagamento confirmado"));
    assert.ok(text.includes("maria@example.com"));
    assert.ok(text.includes("/login"));
  });
});
