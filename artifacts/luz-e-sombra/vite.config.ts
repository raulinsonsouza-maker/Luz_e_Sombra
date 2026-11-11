import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT ?? "5173";
const parsedPort = Number(rawPort);
const port = Number.isNaN(parsedPort) || parsedPort <= 0 ? 5173 : parsedPort;
const basePath = process.env.BASE_PATH ?? "/";
const imagensDiaSrc = path.resolve(import.meta.dirname, "../../docs/imagens_atualizadas");

/** Serve e copia o banco diário sem embutir 100 PNGs no JS. */
function imagensDoDiaPlugin(): Plugin {
  const tipo = (nome: string) => {
    if (nome.endsWith(".png")) return "image/png";
    if (nome.endsWith(".jpg") || nome.endsWith(".jpeg")) return "image/jpeg";
    if (nome.endsWith(".webp")) return "image/webp";
    return "application/octet-stream";
  };
  return {
    name: "imagens-do-dia",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/^\/imagens-dia\/([^/?#]+)$/);
        if (!match) return next();
        const arquivo = path.join(imagensDiaSrc, decodeURIComponent(match[1]));
        if (!arquivo.startsWith(imagensDiaSrc) || !fs.existsSync(arquivo)) {
          res.statusCode = 404;
          res.end("not found");
          return;
        }
        res.setHeader("Content-Type", tipo(arquivo.toLowerCase()));
        res.setHeader("Cache-Control", "public, max-age=86400");
        fs.createReadStream(arquivo).pipe(res);
      });
    },
    closeBundle() {
      const dest = path.resolve(import.meta.dirname, "dist/public/imagens-dia");
      if (!fs.existsSync(imagensDiaSrc)) return;
      fs.mkdirSync(dest, { recursive: true, mode: 0o755 });
      try {
        fs.chmodSync(dest, 0o755);
      } catch {
        /* Windows pode ignorar mode */
      }
      for (const nome of fs.readdirSync(imagensDiaSrc)) {
        if (!/\.(png|jpe?g|webp)$/i.test(nome)) continue;
        const alvo = path.join(dest, nome);
        fs.copyFileSync(path.join(imagensDiaSrc, nome), alvo);
        try {
          fs.chmodSync(alvo, 0o644);
        } catch {
          /* Windows pode ignorar mode */
        }
      }
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    imagensDoDiaPlugin(),
    // Overlay de erro só em dev — em produção atrapalha WebViews (Instagram/FB).
    ...(process.env.NODE_ENV !== "production" ? [runtimeErrorOverlay()] : []),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      allow: [path.resolve(import.meta.dirname, "../..")],
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
