import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { safeInternalPath } from "../safeInternalPath";

describe("safeInternalPath", () => {
  it("aceita paths internos", () => {
    assert.equal(safeInternalPath("/dashboard"), "/dashboard");
    assert.equal(safeInternalPath("/acesso-pos-compra?token=x"), "/acesso-pos-compra?token=x");
  });

  it("bloqueia open redirect", () => {
    assert.equal(safeInternalPath("https://evil.com"), "/dashboard");
    assert.equal(safeInternalPath("//evil.com"), "/dashboard");
    assert.equal(safeInternalPath("evil.com"), "/dashboard");
  });
});
