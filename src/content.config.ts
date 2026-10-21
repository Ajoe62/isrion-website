// ---------------------------------------------------------------------------
// CONTENT COLLECTIONS
//
// "news"   powers the newsroom (blog): one Markdown file per article in
//          src/content/news/, listed at /news and rendered at /news/<filename>/.
// "events" powers the events calendar: one Markdown file per event in
//          src/content/events/, listed at /events and rendered at /events/<filename>/.
//
// News is written in the Keystatic CMS at /keystatic (form defined in
// keystatic.config.ts), which saves these same Markdown files. Events are
// still edited by hand: copy an existing file in the folder, rename it (the
// filename becomes the URL) and edit the front matter below the `---`.
// A file that breaks the schema fails the build with the field name, so a
// malformed item can never ship silently.
// ---------------------------------------------------------------------------
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { noEmDash } from "./lib/no-em-dash.mjs";

// Free text shown on the site, with any em dash rewritten (see lib/no-em-dash.mjs).
const copy = () => z.string().transform(noEmDash);

// Editors never see build errors, so this schema must accept anything the CMS
// form lets them save. A stricter rule here blocks every deploy until a
// developer notices. Put new requirements in keystatic.config.ts instead.
const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: ({ image }) =>
    z
      .object({
        title: copy(),
        // The approval step. Writers save as "draft" or "review"; only
        // "published" articles reach the production build. Everything shows in
        // `npm run dev`.
        status: z.enum(["draft", "review", "published"]).default("draft"),
        // Publication date. Drives the ordering of the listing page.
        date: z.coerce.date(),
        // Drives the filter chips on /news and the card colour.
        category: z.enum(["News", "Research", "Insight", "Publication", "Announcement"]),
        // One or two sentences: used on the card and as the page description.
        summary: copy(),
        author: copy().default("ISRION team"),
        // Pins the article to the featured slot at the top of /news. Without it,
        // the newest article is featured.
        featured: z.boolean().default(false),
        // Optional cover image, relative to this Markdown file. The CMS saves
        // uploads to ../../assets/news/<slug>/cover.<ext>.
        cover: image().optional(),
        coverAlt: copy().optional(),
        tags: z.array(copy()).default([]),
        // Optional outbound link, e.g. to a journal article or a dataset. The CMS
        // writes an empty object when the link is left blank, so that counts as
        // no link.
        external: z.preprocess(
          (v) => (v && typeof v === "object" && "href" in v ? v : undefined),
          z.object({ label: copy().default("Read more"), href: z.string().url() }).optional(),
        ),
      }),
});

const events = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        summary: z.string(),
        // The day the event starts. For a multi-day event, set endDate too.
        // While the last day is today or later the event is "upcoming";
        // after that it moves to the past events archive.
        startDate: z.coerce.date(),
        endDate: z.coerce.date().optional(),
        // Free text, shown as written, e.g. "09:00 – 16:00 WAT".
        time: z.string().optional(),
        category: z.enum([
          "Conference", "Workshop", "Training", "Webinar", "Panel", "Exhibition", "Stakeholder session",
        ]),
        format: z.enum(["In person", "Online", "Hybrid"]).default("In person"),
        // What ISRION is doing there. Shown on the card and the details panel.
        role: z.enum(["Hosting", "Speaking", "Exhibiting", "Partnering", "Attending"]).optional(),
        venue: z.string().optional(),
        // City and country, or "Online".
        location: z.string(),
        // Registration or event website. The button hides once the event ends.
        registration: z
          .object({ label: z.string().default("Register"), href: z.string().url() })
          .optional(),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
      })
      .refine((d) => !d.endDate || d.endDate >= d.startDate, {
        message: "endDate must be on or after startDate",
        path: ["endDate"],
      }),
});

export const collections = { news, events };
