# GEO — verificação GSC, Bing e IndexNow

## Google Search Console

1. Adicione a propriedade `https://portaliluminando.com.br`.
2. Verificação: meta tag com `VITE_GSC_VERIFICATION` **ou** arquivo HTML, **ou** DNS.
3. Envie `https://portaliluminando.com.br/sitemap.xml`.
4. Use Inspeção de URL nas LPs e páginas `/analises/*` e `/blog/*`.

Submeter o sitemap **não** garante indexação.

## Bing Webmaster Tools

1. Importe a propriedade a partir do GSC ou verifique com `VITE_BING_VERIFICATION`.
2. Envie o mesmo sitemap.
3. IndexNow pode acelerar descoberta; não confirma ranking.

## IndexNow

1. Gere uma chave (UUID) e publique em `https://portaliluminando.com.br/{chave}.txt` (conteúdo = a própria chave).
2. Defina `INDEXNOW_KEY` / `VITE_INDEXNOW_KEY` no ambiente de build/deploy.
3. Rode `pnpm --filter @workspace/luz-e-sombra indexnow` após publicar URLs novas, ou use o botão no admin GEO Intelligence.

## Arquivos públicos de descoberta

- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`
- `/llms-full.txt`
- `/humans.txt`
