/**
 * Notifica IndexNow sobre URLs públicas.
 * Requer INDEXNOW_KEY ou VITE_INDEXNOW_KEY e arquivo público `/{key}.txt` no site.
 * Submissão ≠ indexação confirmada.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const SITE = "https://portaliluminando.com.br";
const key = process.env.INDEXNOW_KEY || process.env.VITE_INDEXNOW_KEY;

if (!key) {
  console.error("Defina INDEXNOW_KEY (ou VITE_INDEXNOW_KEY).");
  process.exit(1);
}

const sitemap = fs.readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const host = "portaliluminando.com.br";
const body = {
  host,
  key,
  keyLocation: `${SITE}/${key}.txt`,
  urlList: urls,
};

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(body),
});

console.log("IndexNow status", res.status, await res.text());
if (!res.ok) process.exit(1);
