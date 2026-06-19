# ISRION International Ltd — Website

A fast, animated marketing site built with **Astro 6**, **Lenis** (smooth scroll) and **GSAP / ScrollTrigger** (scroll choreography). Static output, deploys to Netlify.

---

## Run it locally (VS Code)

You need **Node.js 22 or newer** (Astro 6 requires it). Check with `node -v`.

```bash
npm install      # install dependencies
npm run dev      # start dev server → http://localhost:4321
```

Other commands:

```bash
npm run build    # production build into /dist
npm run preview  # preview the production build locally
```

Recommended VS Code extension: **Astro** (`astro-build.astro-vscode`) — you'll be prompted to install it when you open the folder.

---

## Where things live

```
src/
├── pages/index.astro      ← the home page (composes the components)
├── layouts/BaseLayout.astro ← <head>, fonts, SEO/meta, View Transitions, motion script
├── components/            ← one file per section (Hero, Capabilities, About, …)
├── data/site.ts           ← ALL TEXT CONTENT lives here — edit copy without touching markup
├── scripts/motion.ts      ← Lenis + GSAP setup + the animated hero canvas
└── styles/global.css      ← design tokens (:root) + every section's styles
public/                    ← favicon, robots.txt, and any images you add
```

### To change wording, services, industries or leadership
Edit **`src/data/site.ts`**. The components map over that data, so updates appear everywhere automatically.

### To change colours, spacing or fonts
Edit the `:root` tokens at the top of **`src/styles/global.css`**.

### To tweak the animations
Everything is in **`src/scripts/motion.ts`** — the hero load sequence, scroll reveals, the pinned horizontal capabilities reel, the nav behaviour and the contour canvas. Motion automatically respects `prefers-reduced-motion`.

---

## Add a new page (e.g. /services, /insights)

1. Create `src/pages/services.astro`.
2. Wrap your content in the layout:
   ```astro
   ---
   import BaseLayout from "../layouts/BaseLayout.astro";
   ---
   <BaseLayout title="Services — ISRION International Ltd">
     <!-- your sections -->
   </BaseLayout>
   ```
3. Link to it with `<a href="/services">`. Because **View Transitions** is already wired up in `BaseLayout`, navigation between pages fades smoothly with no extra work.

For a blog/insights section, use Astro **Content Collections** (Markdown/MDX) — see https://docs.astro.build/en/guides/content-collections/.

---

## Deploy to Netlify

1. Push this folder to a **GitHub** repo.
2. In Netlify: **Add new site → Import from Git**, pick the repo.
3. Netlify reads `netlify.toml` automatically (build `npm run build`, publish `dist`, Node 22). Click **Deploy**.

Every `git push` then redeploys automatically.

### Contact form
The contact form in `CTA.astro` uses **Netlify Forms** — no backend. It only processes submissions once deployed to Netlify; submissions appear under **Forms** in your Netlify dashboard. Locally the form renders but won't send.

### Custom domain & email
Add your domain in Netlify under **Domain settings**. Then update two places to your real domain:
- `site` in `astro.config.mjs`
- the `Sitemap:` line in `public/robots.txt`

For professional email (e.g. `info@isrion.com`), use Zoho Mail (free tier) or Google Workspace.

---

## Switching to Cloudflare Pages later (optional)

Astro is now maintained by Cloudflare and deploys there just as easily. In Cloudflare Pages, set the build command to `npm run build` and the output directory to `dist`. You'd replace Netlify Forms with Formspree or a Cloudflare Worker for the contact form.

---

## Things to finish before launch
- [ ] Swap the placeholder `I` logo mark for the real ISRION logo (in `Nav.astro`, `Footer.astro`, and `public/favicon.svg`).
- [ ] Add real, licensed photography (don't reuse the stock images embedded in the PDF — those are licensed to someone else).
- [ ] Add real social links in `Footer.astro`.
- [ ] Register the domain and set up domain email.
- [ ] Update `site` in `astro.config.mjs` to the real domain.
```
