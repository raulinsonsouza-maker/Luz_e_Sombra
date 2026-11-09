/**
 * Gera JPEG web + miniaturas das imagens do dia.
 *
 * Fonte:  docs/imagens_atualizadas/{n}.png
 * Web:    docs/imagens_atualizadas/{n}.jpg      (1080px)
 * Thumb:  docs/imagens_atualizadas/thumbs/{n}.jpg (360px)
 *
 * Uso (com sharp instalado no ambiente):
 *   node scripts/gerar-thumbs-imagens-dia.mjs
 */
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "docs", "imagens_atualizadas");
const thumbDir = path.join(srcDir, "thumbs");

async function main() {
  await mkdir(thumbDir, { recursive: true });
  const files = (await readdir(srcDir))
    .filter((f) => /^\d+\.png$/i.test(f))
    .sort((a, b) => Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, "")));

  if (files.length === 0) {
    console.error("Nenhuma imagem PNG numerada em", srcDir);
    process.exit(1);
  }

  console.log(`Processando ${files.length} imagens…`);
  let ok = 0;
  for (const file of files) {
    const n = file.replace(/\.png$/i, "");
    const input = path.join(srcDir, file);
    const img = sharp(input).rotate();

    await img
      .clone()
      .resize({ width: 1080, withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(path.join(srcDir, `${n}.jpg`));

    await img
      .clone()
      .resize({ width: 360, withoutEnlargement: true })
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(path.join(thumbDir, `${n}.jpg`));

    ok += 1;
    if (ok % 10 === 0 || ok === files.length) console.log(`  ${ok}/${files.length}`);
  }
  console.log("Pronto.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
