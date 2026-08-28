// Static build config used ONLY by the GitHub Pages workflow.
// The normal Lovable build keeps using vite.config.ts (Cloudflare target).
//
// Usage: BASE_PATH=/repo-name/ vite build --config vite.config.pages.ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const basePath = process.env["BASE_PATH"] || "/";

export default defineConfig({
  vite: {
    base: basePath,
    define: {
      "import.meta.env.VITE_BASE_PATH": JSON.stringify(basePath),
    },
  },
  nitro: false,
  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: true,
      autoSubfolderIndex: true,
    },
    pages: [
      { path: "/", prerender: { enabled: true } },
      { path: "/calculator-pret", prerender: { enabled: true } },
      { path: "/hidroizolatii-terase-circulabile", prerender: { enabled: true } },
      { path: "/ghid-proprietar-terasa", prerender: { enabled: true } },
    ],
  },
});
