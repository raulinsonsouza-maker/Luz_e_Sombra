import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { verifyCaktoWebhookSecret } from "../caktoWebhookAuth.js";

describe("verifyCaktoWebhookSecret", () => {
  it("rejeita quando secret não está configurado", () => {
    assert.equal(verifyCaktoWebhookSecret("anything", ""), false);
    assert.equal(verifyCaktoWebhookSecret(undefined, ""), false);
  });

  it("rejeita secret errado ou ausente no header", () => {
    assert.equal(verifyCaktoWebhookSecret(undefined, "segredo"), false);
    assert.equal(verifyCaktoWebhookSecret("errado", "segredo"), false);
  });

  it("aceita header correto", () => {
    assert.equal(verifyCaktoWebhookSecret("segredo", "segredo"), true);
  });
});
