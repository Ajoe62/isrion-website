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
| Email (receiving) | **Cloudflare Email Routing** (forwards to Gmail) |
| Email (sending as @isrioninternational.com) | **Gmail "Send mail as"** through **Brevo SMTP** |
| support@ auto-reply | **Cloudflare Email Worker** (`workers/support-autoreply`) |
| Contact form | `/api/contact` → **Brevo** transactional email, **Cloudflare Turnstile** anti-spam |
| Newsletter | **Brevo** (double opt-in list) |

Live site: https://www.isrioninternational.com (the bare domain redirects to `www`).

### Deploy (Vercel)
The repo is connected to Vercel, which reads `vercel.json` (build `npm run build`, security headers). Every `git push` to `main`, including every CMS save, redeploys automatically.

The `@astrojs/vercel` adapter writes the deployment to `.vercel/output`. Every page is still prerendered static HTML; only the CMS routes (`/keystatic`, `/api/keystatic`), the newsletter endpoint (`/api/subscribe`) and the contact endpoint (`/api/contact`) run as Vercel functions. Keep the adapter on the major version that matches Astro (`@astrojs/vercel@10` for Astro 6).

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

### Email (Cloudflare Email Routing + Brevo SMTP)
Free setup. Cloudflare receives mail for the domain and forwards it to Gmail; it does not store or send mail. Sending as a domain address goes from Gmail through Brevo's SMTP relay.

| Address | Route |
|---|---|
| `founder@isrioninternational.com` | Isa Elabor's Gmail |
| `rabi@isrioninternational.com` | Rabi Elabor's Gmail |
| `support@isrioninternational.com` | **Send to a Worker:** `isrion-support-autoreply` (forwards to `isrioninternational@gmail.com` and auto-replies) |
| `news@isrioninternational.com` | `isrioninternational@gmail.com` (newsletter sender and replies) |
| Catch-all (any other address) | `isrioninternational@gmail.com` |

**Receiving**
1. Cloudflare: **Email → Email Routing → Get started**, and let Cloudflare add its MX and SPF records.
2. **Destination addresses:** add each Gmail inbox and click the verification link Cloudflare emails to it.
3. **Routing rules → Custom addresses:** create each address above. Route `support@` to the main Gmail for now, and switch it to the Worker once that is deployed (see "Support auto-reply" below). Turn on **Catch-all** for the main inbox.

**Authentication (DNS, in Cloudflare)**

4. A domain may have only **one** SPF record, so merge Cloudflare's and Brevo's into one: `v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all`.
5. In Brevo, **Senders, Domains & Dedicated IPs → Domains → Add a domain → Authenticate**, and add the DKIM and verification records it shows (DNS only). Wait until Brevo shows the domain as authenticated.
6. Add a DMARC record: TXT `_dmarc` = `v=DMARC1; p=none; rua=mailto:support@isrioninternational.com`, and tighten it to `p=quarantine` after two weeks of clean reports.

**Sending as these addresses**

7. In Brevo, **SMTP & API → SMTP** shows the SMTP login (it looks like `xxxx@smtp-brevo.com`). Generate an **SMTP key** there; it is not the same as the API key.
8. In each Gmail account, **Settings → See all settings → Accounts → Send mail as → Add another email address**. Enter the name and address (e.g. `founder@isrioninternational.com`), leave **Treat as an alias** ticked, then use server `smtp-relay.brevo.com`, port `587`, TLS, with the SMTP login and key from step 7. Gmail emails a code to the address; it arrives in the same inbox through Cloudflare.
9. In the same screen choose **Reply from the same address the message was sent to**.
10. Test: send to each address from an outside account, reply, and check the score at [mail-tester.com](https://www.mail-tester.com) (aim for 9/10 or better).

Brevo's free plan sends **300 emails a day**, shared by Gmail sending, newsletter confirmations, welcome emails and contact form emails. If that becomes tight, Brevo's Starter plan removes the daily cap with no other changes.

### Support auto-reply (Cloudflare Email Worker)
`workers/support-autoreply` is a small Cloudflare Worker that receives every message sent to `support@`. It always forwards the message to `FORWARD_TO` (set in its `wrangler.toml`), then sends the sender one "we've received your email" reply, threaded to their message.

It does not reply to bounces, mailing lists, newsletters, other auto-replies, no-reply senders, or mail from our own domain (such as contact form notifications), so it cannot loop. Cloudflare only lets it reply to mail that passes DMARC, so spoofed senders get nothing. It runs on Cloudflare's free plan and does not use the Brevo quota.

Deploy (once, and again after any change):
1. `cd workers/support-autoreply && npm install`
2. `npx wrangler login` (opens the browser; sign in to the Cloudflare account that holds the domain)
3. `npm run deploy`
4. Cloudflare: **Email → Email Routing → Routing rules**, edit `support@`, set the action to **Send to a Worker** and pick `isrion-support-autoreply`.
5. Email `support@` from an outside account: the message should land in the support Gmail and the sender should receive the auto-reply. `npm run tail` shows live logs.

Optional: to send at most one auto-reply per sender per day, create a KV namespace (`npx wrangler kv namespace create REPLIED`), uncomment the `kv_namespaces` block in `wrangler.toml` with its id, and redeploy. The reply text lives in `buildReply` in `src/index.ts`.

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

5. **Welcome email:** **Automations → Create an automation → Welcome message**, triggered when a contact is added to the newsletter list, sending a short welcome email from `news@`. Optionally add a second step that emails `support@` about each new subscriber.

For local testing, put the same four values in a `.env` file at the project root (it is git-ignored; see `.env.example`). Newsletters are written and sent from Brevo's **Campaigns** screen.

What a subscriber sees: a "check your inbox" message under the form, the confirmation email, a "You're subscribed" message when the confirm link brings them back to `/news`, then the welcome email.

### Contact form
`ContactForm.astro` posts to `/api/contact` (`src/pages/api/contact.ts`), a Vercel function. It checks the Cloudflare Turnstile token, then sends two emails through Brevo's transactional API:

1. a notification to `CONTACT_TO`, with **Reply-To** set to the visitor, so pressing Reply in Gmail answers them directly;
2. an acknowledgement to the visitor from `CONTACT_FROM`. It is deliberately generic and never repeats the visitor's name or message, so the form cannot be used to send spam to someone else.

The visitor also sees a success or error message under the form. If the notification cannot be sent, they are asked to email `company.email` instead.

One-time setup:
1. Cloudflare: **Turnstile → Add widget**, name it "ISRION contact form", add the hostnames `isrioninternational.com` and `www.isrioninternational.com`, mode **Managed**. Note the site key and secret key.
2. The sender address (`CONTACT_FROM`) must be on the domain authenticated in Brevo (step 5 under Email).
3. **Vercel → Settings → Environment Variables** (Production and Preview), then redeploy:

   | Variable | Example |
   |---|---|
   | `CONTACT_TO` | `support@isrioninternational.com` |
   | `CONTACT_FROM` | `support@isrioninternational.com` |
   | `PUBLIC_TURNSTILE_SITE_KEY` | `0x4AAAA...` (public; baked into the page at build time) |
   | `TURNSTILE_SECRET_KEY` | `0x4AAAA...` |

   `BREVO_API_KEY` is shared with the newsletter. For local development, `.env.example` contains Cloudflare's test Turnstile keys, which always pass.

---

## Things to finish before launch
- [ ] Swap the placeholder `I` logo mark for the real ISRION logo (in `Nav.astro`, `Footer.astro`, and `public/favicon.svg`).
- [ ] Add real, licensed photography (don't reuse the stock images embedded in the PDF; those are licensed to someone else).
- [ ] Add real social links in `Footer.astro`.
- [x] Register the domain (`isrioninternational.com`).
- [x] Update `site` in `astro.config.mjs` to the real domain.
- [ ] Point DNS through Cloudflare to Vercel and confirm HTTPS on both `www` and the bare domain.
- [ ] Set up Cloudflare Email Routing (founder@, rabi@, support@, news@). `company.email` in `src/data/site.ts` already shows `support@isrioninternational.com`, so do this before deploying.
- [ ] Authenticate the domain in Brevo, merge SPF, add DMARC, and set up Gmail "Send mail as" for each address.
- [ ] Deploy `workers/support-autoreply` and route `support@` to it.
- [ ] Create the Brevo list, double opt-in template, welcome automation and API key, and add the four `BREVO_*` variables in Vercel.
- [ ] Create the Turnstile widget and add `CONTACT_TO`, `CONTACT_FROM`, `PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel.
```
