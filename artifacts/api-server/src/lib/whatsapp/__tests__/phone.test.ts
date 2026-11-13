import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  firstNameFromFullName,
  normalizeBrazilPhoneE164,
  toWhatsAppRecipient,
} from "../phone";

describe("whatsapp phone", () => {
  it("normaliza BR para E.164", () => {
    assert.equal(normalizeBrazilPhoneE164("(11) 98888-7777"), "+5511988887777");
    assert.equal(normalizeBrazilPhoneE164("11988887777"), "+5511988887777");
    assert.equal(normalizeBrazilPhoneE164("+55 11 98888-7777"), "+5511988887777");
    assert.equal(normalizeBrazilPhoneE164("5511988887777"), "+5511988887777");
  });

  it("recipient sem +", () => {
    assert.equal(toWhatsAppRecipient("11988887777"), "5511988887777");
  });

  it("primeiro nome", () => {
    assert.equal(firstNameFromFullName("Maria Silva"), "Maria");
    assert.equal(firstNameFromFullName("  "), "Cliente");
  });
});
