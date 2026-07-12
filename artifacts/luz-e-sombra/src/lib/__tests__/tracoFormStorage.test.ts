import test from "node:test";
import assert from "node:assert/strict";
import {
  storageKeyDiagnostico30,
  storageKeyLinguagensAmorDraft,
  storageSuffixForPessoa,
  clearTracoSessionStorage,
  clearPessoaLocalStorage,
  LEGACY_STORAGE_DIAGNOSTICO_30,
} from "../tracoFormStorage.js";

test("storageSuffixForPessoa distingue Eu e pessoa", () => {
  assert.equal(storageSuffixForPessoa(null), "eu");
  assert.equal(storageSuffixForPessoa(42), "p42");
});

test("storageKeyDiagnostico30 inclui userId quando fornecido", () => {
  assert.equal(storageKeyDiagnostico30(null, 7), "luz_diagnostico_emocional_30_v1_u7_eu");
  assert.equal(storageKeyDiagnostico30(3, 7), "luz_diagnostico_emocional_30_v1_u7_p3");
});

test("storageKeyDiagnostico30 sem userId usa formato legado", () => {
  const mem: Record<string, string> = {};
  const ls = {
    getItem: (k: string) => mem[k] ?? null,
    setItem: (k: string, v: string) => {
      mem[k] = v;
    },
    removeItem: (k: string) => {
      delete mem[k];
    },
    key: (i: number) => Object.keys(mem)[i] ?? null,
    get length() {
      return Object.keys(mem).length;
    },
  };
  const orig = globalThis.localStorage;
  Object.defineProperty(globalThis, "localStorage", { value: ls, configurable: true });
  assert.equal(storageKeyDiagnostico30(null), "luz_diagnostico_emocional_30_v1_eu");
  Object.defineProperty(globalThis, "localStorage", { value: orig, configurable: true });
});

test("storageKeyLinguagensAmorDraft distingue Eu, pessoa e userId", () => {
  assert.equal(storageKeyLinguagensAmorDraft(null, 7), "luz_linguagens_amor_v3_draft_u7_eu");
  assert.equal(storageKeyLinguagensAmorDraft(5, 7), "luz_linguagens_amor_v3_draft_u7_p5");
});

test("clearPessoaLocalStorage remove diagnóstico e draft de linguagens da pessoa", () => {
  const mem: Record<string, string> = {};
  const ls = {
    getItem: (k: string) => mem[k] ?? null,
    setItem: (k: string, v: string) => {
      mem[k] = v;
    },
    removeItem: (k: string) => {
      delete mem[k];
    },
    key: (i: number) => Object.keys(mem)[i] ?? null,
    get length() {
      return Object.keys(mem).length;
    },
  };
  const orig = globalThis.localStorage;
  Object.defineProperty(globalThis, "localStorage", { value: ls, configurable: true });

  mem[storageKeyDiagnostico30(3, 1)] = "{}";
  mem[storageKeyLinguagensAmorDraft(3, 1)] = "{}";
  mem["luz_linguagens_amor_v3_draft_3"] = "{}";
  mem[storageKeyDiagnostico30(null, 1)] = "keep";

  clearPessoaLocalStorage(3, 1);

  assert.equal(mem[storageKeyDiagnostico30(3, 1)], undefined);
  assert.equal(mem[storageKeyLinguagensAmorDraft(3, 1)], undefined);
  assert.equal(mem["luz_linguagens_amor_v3_draft_3"], undefined);
  assert.equal(mem[storageKeyDiagnostico30(null, 1)], "keep");

  Object.defineProperty(globalThis, "localStorage", { value: orig, configurable: true });
});

test("clearTracoSessionStorage remove chaves de diagnóstico", () => {
  const mem: Record<string, string> = {};
  const ls = {
    getItem: (k: string) => mem[k] ?? null,
    setItem: (k: string, v: string) => {
      mem[k] = v;
    },
    removeItem: (k: string) => {
      delete mem[k];
    },
    key: (i: number) => Object.keys(mem)[i] ?? null,
    get length() {
      return Object.keys(mem).length;
    },
  };
  const orig = globalThis.localStorage;
  Object.defineProperty(globalThis, "localStorage", { value: ls, configurable: true });

  mem["luz_diagnostico_emocional_30_v1_u1_eu"] = "{}";
  mem[LEGACY_STORAGE_DIAGNOSTICO_30] = "{}";
  mem["luz_questionario_20_respostas"] = "{}";
  mem["other_key"] = "keep";

  clearTracoSessionStorage();

  assert.equal(mem["luz_diagnostico_emocional_30_v1_u1_eu"], undefined);
  assert.equal(mem[LEGACY_STORAGE_DIAGNOSTICO_30], undefined);
  assert.equal(mem["luz_questionario_20_respostas"], undefined);
  assert.equal(mem["other_key"], "keep");

  Object.defineProperty(globalThis, "localStorage", { value: orig, configurable: true });
});
