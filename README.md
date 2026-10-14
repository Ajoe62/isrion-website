# ISRION International Ltd Website

A fast, animated marketing site built with **Astro 6**, **Lenis** (smooth scroll) and **GSAP / ScrollTrigger** (scroll choreography). Static output, deployed on Vercel.

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

Recommended VS Code extension: **Astro** (`astro-build.astro-vscode`). You'll be prompted to install it when you open the folder.

---

## Where things live

```
src/
├── pages/index.astro      ← the home page (composes the components)
├── layouts/BaseLayout.astro ← <head>, fonts, SEO/meta, View Transitions, motion script
├── components/            ← one file per section (Hero, Capabilities, About, …)
├── data/site.ts           ← ALL TEXT CONTENT lives here; edit copy without touching markup
├── scripts/motion.ts      ← Lenis + GSAP setup + the animated hero canvas
└── styles/global.css      ← design tokens (:root) + every section's styles
public/                    ← favicon, robots.txt, and any images you add
```

### To change wording, services, industries or leadership
Edit **`src/data/site.ts`**. The components map over that data, so updates appear everywhere automatically.

### To change colours, spacing or fonts
Edit the `:root` tokens at the top of **`src/styles/global.css`**.

### To tweak the animations
Everything is in **`src/scripts/motion.ts`**: the hero load sequence, scroll reveals, the pinned horizontal capabilities reel, the nav behaviour and the contour canvas. Motion automatically respects `prefers-reduced-motion`.

---

## Add a new page (e.g. /services, /insights)

1. Create `src/pages/services.astro`.
2. Wrap your content in the layout:
   ```astro
   ---
   import BaseLayout from "../layouts/BaseLayout.astro";
   ---
   <BaseLayout title="Services | ISRION International Ltd">
     <!-- your sections -->
   </BaseLayout>
   ```
3. Link to it with `<a href="/services">`. Because **View Transitions** is already wired up in `BaseLayout`, navigation between pages fades smoothly with no extra work.

For a blog/insights section, use Astro **Content Collections** (Markdown/MDX); see https://docs.astro.build/en/guides/content-collections/.

---

## Hosting overview

| Piece | Provider |
|---|---|
| Site hosting | **Vercel** (deploys from GitHub) |
| Domain registrar | **Truehost** (`isrioninternational.com`) |
| DNS | **Cloudflare** (Truehost nameservers point to Cloudflare) |
| Email | **Cloudflare Email Routing** (forwards to Gmail) |
| Contact form | **Formspree** |

Live site: https://www.isrioninternational.com (the bare domain redirects to `www`).

### Deploy (Vercel)
The repo is connected to Vercel, which reads `vercel.json` (build `npm run build`, output `dist`, security headers). Every `git push` to `main` redeploys automatically.

`netlify.toml` is kept only as a fallback config and is not in use.

### Domain & DNS (Truehost → Cloudflare → Vercel)
1. **Cloudflare:** add `isrioninternational.com` on the Free plan and note the two nameservers it assigns.
2. **Truehost:** under the domain's **Nameservers**, switch to custom nameservers and enter Cloudflare's two (turn DNSSEC off first if it is on).
3. **Vercel:** in the project, **Settings → Domains**, add `www.isrioninternational.com` (primary) and `isrioninternational.com` (redirects to www).
4. **Cloudflare DNS records** (use the values Vercel shows if they differ):

   | Type | Name | Value | Proxy |
   |---|---|---|---|
   | A | `@` | `76.76.21.21` | DNS only |
   | CNAME | `www` | `cname.vercel-dns.com` | DNS only |

   Keep these grey-clouded (DNS only) so Vercel issues and renews the SSL certificate. If you ever proxy them (orange cloud), set Cloudflare **SSL/TLS** to **Full (strict)** to avoid a redirect loop.

If the domain ever changes, update all three of: `site` in `astro.config.mjs`, `company.url` in `src/data/site.ts` and the `Sitemap:` line in `public/robots.txt`.

### Email (Cloudflare Email Routing)
Free, receive-only forwarding: mail to addresses like `info@isrioninternational.com` is forwarded to `isrioninternational@gmail.com`. Cloudflare does not store mail or send it.

1. Cloudflare: **Email → Email Routing → Get started**.
2. Add the Gmail address as a destination and confirm the verification email.
3. Create the custom addresses (e.g. `info@`) and let Cloudflare add its MX and SPF records automatically.

To *send* as `info@isrioninternational.com` from Gmail, add an SMTP relay (e.g. Brevo's free tier) under Gmail **Settings → Accounts → Send mail as**.

### Contact form
`ContactForm.astro` posts to **Formspree** (no backend, works on any host). The form ID lives in `company.formspreeId` in `src/data/site.ts`; submissions arrive by email and in the Formspree dashboard.

---

## Things to finish before launch
- [ ] Swap the placeholder `I` logo mark for the real ISRION logo (in `Nav.astro`, `Footer.astro`, and `public/favicon.svg`).
- [ ] Add real, licensed photography (don't reuse the stock images embedded in the PDF; those are licensed to someone else).
- [ ] Add real social links in `Footer.astro`.
- [x] Register the domain (`isrioninternational.com`).
- [x] Update `site` in `astro.config.mjs` to the real domain.
- [ ] Point DNS through Cloudflare to Vercel and confirm HTTPS on both `www` and the bare domain.
- [ ] Set up Cloudflare Email Routing, then switch `company.email` in `src/data/site.ts` to `info@isrioninternational.com`.
```
