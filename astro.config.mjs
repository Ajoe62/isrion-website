// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import vercel from "@astrojs/vercel";
import { remarkNoEmDash } from "./src/lib/no-em-dash.mjs";

// Live domain; powers the sitemap and canonical URLs. Keep in sync with
// `company.url` in src/data/site.ts and the Sitemap line in public/robots.txt.
export default defineConfig({
  site: "https://www.isrioninternational.com",
  // Every page is still prerendered to static HTML. The adapter only serves the
  // routes Keystatic adds (/keystatic and /api/keystatic) as Vercel functions.
  adapter: vercel(),
  integrations: [
    // The admin panel is not a public page, so keep it out of the sitemap.
    sitemap({ filter: (page) => !page.includes("/keystatic") }),
    react(),
    keystatic(),
  ],
  markdown: {
    remarkPlugins: [remarkNoEmDash],
  },
  // Pin PostCSS to this project. Without an inline config, Vite searches up the
  // directory tree and picks up a stray postcss.config.js in the home folder
  // (which loads Tailwind and emits a spurious "content is missing" warning).
  // This project uses plain CSS, so an empty plugin list is correct.
  vite: {
    css: { postcss: { plugins: [] } },
  },
});
