// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Live domain; powers the sitemap and canonical URLs. Keep in sync with
// `company.url` in src/data/site.ts and the Sitemap line in public/robots.txt.
export default defineConfig({
  site: "https://www.isrioninternational.com",
  integrations: [sitemap()],
  // Pin PostCSS to this project. Without an inline config, Vite searches up the
  // directory tree and picks up a stray postcss.config.js in the home folder
  // (which loads Tailwind and emits a spurious "content is missing" warning).
  // This project uses plain CSS, so an empty plugin list is correct.
  vite: {
    css: { postcss: { plugins: [] } },
  },
});
