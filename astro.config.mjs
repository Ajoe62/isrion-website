// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Update `site` to your real domain once registered — it powers the sitemap.
export default defineConfig({
  site: "https://www.isrion.com",
  integrations: [sitemap()],
  // Pin PostCSS to this project. Without an inline config, Vite searches up the
  // directory tree and picks up a stray postcss.config.js in the home folder
  // (which loads Tailwind and emits a spurious "content is missing" warning).
  // This project uses plain CSS, so an empty plugin list is correct.
  vite: {
    css: { postcss: { plugins: [] } },
  },
});
