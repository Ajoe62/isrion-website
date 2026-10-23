# ISRION International Ltd Website

A fast, animated marketing site built with **Astro 6**, **Lenis** (smooth scroll) and **GSAP / ScrollTrigger** (scroll choreography). Static output, deployed on Vercel, with a **Keystatic** CMS for news (see [Posting news](#posting-news-for-editors)).

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

---

## Posting news (for editors)

News articles are written in the **ISRION Newsroom**, a web form at
**https://www.isrioninternational.com/keystatic**. You don't need to touch any code.

### Signing in
You'll receive an email invitation from **Keystatic Cloud**. Accept it, then
open the link above and sign in with the same email. No GitHub account needed.

### Writing an article
1. Click **News** in the sidebar, then **Add**.
2. Fill in the form:
   - **Title**: the web address is filled in from it automatically.
   - **Status**: leave it on **Draft** while you work.
   - **Publication date**, **Category**, **Summary** (one or two sentences for the card) and **Author**.
   - **Cover image** (optional): drag a landscape JPG or PNG in, then describe what it shows under **Cover image description**.
   - **Tags**, **Feature this article** and **External link** are optional.
3. Write the article in the large editor. Use the toolbar for headings, bold, lists, links and images.
4. Click **Save**. You can come back and continue at any time.

### Approval
- When the article is finished, the writer sets **Status** to **Ready for review** and saves.
- The approver opens **News** (the list shows each article's status), reads the article, and sets **Status** to **Published**, then saves.
- About a minute later it's live on **/news**. Draft and Ready for review articles never appear on the website.

Only the approver sets **Published**. The CMS doesn't enforce this, so it's an agreement among the team.

To take an article down, set it back to **Draft** and save. To delete it, use the
**⋯** menu on the article.

### House style
The site never shows em dashes. Any that you type are changed to commas
automatically when the site is published, so you don't have to worry about them.

### For developers
- The form is defined in `keystatic.config.ts`; the build rules in `src/content.config.ts`. Keep them in step.
- Each save is a commit to `main` by the editor; Vercel redeploys. Pull before you work on the site.
- Locally, `npm run dev` then open http://127.0.0.1:4321/keystatic (sign in through Keystatic Cloud). Saves still commit to GitHub.
- Uploaded images land in `src/assets/news/<article>/`.
- Editors are managed at https://keystatic.cloud (project `isrion-news/isrion-news`; the free plan allows 3 users).
- Events are still edited by hand in `src/content/events/`.

---

## Hosting overview

| Piece | Provider |
|---|---|
| Site hosting | **Vercel** (deploys from GitHub) |
| Domain registrar | **Truehost** (`isrioninternational.com`) |
| DNS | **Cloudflare** (Truehost nameservers point to Cloudflare) |
| Email | **Cloudflare Email Routing** (forwards to Gmail) |
| Contact form | **Formspree** |
| Newsletter | **Brevo** (double opt-in list) |

Live site: https://www.isrioninternational.com (the bare domain redirects to `www`).

### Deploy (Vercel)
The repo is connected to Vercel, which reads `vercel.json` (build `npm run build`, security headers). Every `git push` to `main`, including every CMS save, redeploys automatically.

The `@astrojs/vercel` adapter writes the deployment to `.vercel/output`. Every page is still prerendered static HTML; only the CMS routes (`/keystatic`, `/api/keystatic`) and the newsletter endpoint (`/api/subscribe`) run as Vercel functions. Keep the adapter on the major version that matches Astro (`@astrojs/vercel@10` for Astro 6).

`netlify.toml` is kept only as a fallback config and is not in use. It would no longer work as is, because the build now targets Vercel.

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
Free, receive-only forwarding: mail sent to a custom address on the domain is forwarded to a Gmail inbox. Cloudflare does not store or send mail.

Planned addresses:

| Address | Forwards to |
|---|---|
| `founder@isrioninternational.com` | Isa Elabor's Gmail |
| `rabi@isrioninternational.com` | Rabi Elabor's Gmail |
| `support@isrioninternational.com` | `isrioninternational@gmail.com` |
| `news@isrioninternational.com` | `isrioninternational@gmail.com` (newsletter sender and replies) |

1. Cloudflare: **Email → Email Routing → Get started**, and let Cloudflare add its MX and SPF records.
2. **Destination addresses:** add each Gmail inbox and click the verification link Cloudflare emails to it.
3. **Routing rules → Custom addresses:** create each address above and pick its destination. Optionally turn on **Catch-all** to route any other `@isrioninternational.com` address to the main inbox.
4. **Sending as these addresses:** Cloudflare only receives. In Brevo, open **SMTP & API → SMTP** for the relay login. Then in each Gmail account go to **Settings → Accounts → Send mail as → Add another email address**, using `smtp-relay.brevo.com`, port `587`, TLS.
5. **Authentication (DNS, in Cloudflare):** a domain may have only **one** SPF record, so merge Cloudflare's and Brevo's into one: `v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all`. Add the DKIM and verification records Brevo shows under **Senders, Domains & Dedicated IPs → Domains → Authenticate**. Add a DMARC record: TXT `_dmarc` = `v=DMARC1; p=none; rua=mailto:support@isrioninternational.com`, and tighten it to `p=quarantine` once reports look clean.
6. Once mail to `support@` arrives, switch `company.email` in `src/data/site.ts` to it.

### Newsletter (Brevo)
The **Subscribe** band on `/news` (`src/components/SubscribeForm.astro`) posts to `/api/subscribe` (`src/pages/api/subscribe.ts`). That endpoint runs as a Vercel function and asks Brevo to send a **double opt-in** email; a person joins the list only after clicking the confirmation link. Brevo handles unsubscribes.

One-time setup in Brevo:
1. **Contacts → Lists:** create a list (e.g. "ISRION newsletter") and note its ID.
2. **Templates:** create a template tagged as a double opt-in confirmation (it must contain the `{{ doubleoptin }}` link) and note its ID. Use `news@isrioninternational.com` as the sender after the domain is authenticated (step 5 above).
3. **SMTP & API → API keys:** create a key.
4. **Vercel → Settings → Environment Variables** (Production and Preview), then redeploy:

   | Variable | Example |
   |---|---|
   | `BREVO_API_KEY` | `xkeysib-...` |
   | `BREVO_LIST_ID` | `3` |
   | `BREVO_DOI_TEMPLATE_ID` | `7` |
   | `BREVO_REDIRECT_URL` | `https://www.isrioninternational.com/news?subscribed=1#subscribe` |

For local testing, put the same four values in a `.env` file at the project root (it is git-ignored; see `.env.example`). Newsletters are written and sent from Brevo's **Campaigns** screen.

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
- [ ] Set up Cloudflare Email Routing (founder@, rabi@, support@, news@), then switch `company.email` in `src/data/site.ts` to `support@isrioninternational.com`.
- [ ] Create the Brevo list, double opt-in template and API key, and add the four `BREVO_*` variables in Vercel.
```
