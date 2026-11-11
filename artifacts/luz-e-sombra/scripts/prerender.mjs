/**
 * Pré-render leve das rotas públicas.
 * Se Playwright não estiver disponível, mantém o shell do Vite (meta já está no index.html)
 * e grava um manifesto das rotas que deveriam ser pré-renderizadas.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist/public");

const ROUTES = [
  "/",
  "/vsl",
  "/sobre-o-portal",
  "/metodologia",
  "/jornada-da-sombra-a-luz",
  "/como-funciona",
  "/contato",
  "/planos",
  "/analises",
  "/analises/tracos-de-carater",
  "/analises/temperamento",
  "/analises/linguagens-do-amor",
  "/analises/roda-da-vida",
  "/analises/numerologia",
  "/analises/ciclos-numerologicos",
  "/analises/numerologia-diaria",
  "/analises/reflexao-diaria",
  "/analises/dossie-de-vida",
  "/blog",
  "/guia",
  "/glossario",
  "/perguntas-frequentes",
  "/autoconhecimento",
  "/padroes-de-comportamento",
  "/desenvolvimento-pessoal",
  "/inteligencia-emocional",
  "/autoconhecimento-e-relacionamentos",
];

function loadBlogRoutes() {
  try {
    const data = fs.readFileSync(path.join(root, "content/artigos/data.ts"), "utf8");
    return [...new Set([...data.matchAll(/"path":\s*"(\/blog\/[^"]+)"/g)].map((m) => m[1]))];
  } catch {
    return [];
  }
}

async function tryPlaywright(routes) {
  let playwright;
  try {
    playwright = await import("playwright");
  } catch {
    console.warn("[prerender] playwright não instalado — pulando HTML capturado. Meta/robots/sitemap já estão no dist.");
    fs.writeFileSync(
      path.join(dist, "prerender-manifest.json"),
      JSON.stringify({ skipped: true, reason: "playwright_missing", routes }, null, 2),
    );
    return false;
  }

  const { chromium } = playwright;
  const preview = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["vite", "preview", "--host", "127.0.0.1", "--port", "4179", "--config", "vite.config.ts"],
    { cwd: root, stdio: "ignore", shell: true },
  );

  await new Promise((r) => setTimeout(r, 2500));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  for (const route of routes) {
    const url = `http://127.0.0.1:4179${route}`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForSelector("h1", { timeout: 15000 }).catch(() => null);
      const html = await page.content();
      const outDir = route === "/" ? dist : path.join(dist, route.replace(/^\//, ""));
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html);
      console.log("[prerender]", route);
    } catch (e) {
      console.warn("[prerender] falha", route, e.message);
    }
  }

  await browser.close();
  preview.kill();
  return true;
}

const routes = [...ROUTES, ...loadBlogRoutes()];
if (!fs.existsSync(dist)) {
  console.error("[prerender] dist/public ausente — rode vite build antes.");
  process.exit(0);
}
await tryPlaywright(routes);
fs.writeFileSync(path.join(dist, "prerender-routes.json"), JSON.stringify(routes, null, 2));
console.log("[prerender] done", routes.length, "routes");
