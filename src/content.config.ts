// ---------------------------------------------------------------------------
// CONTENT COLLECTIONS
//
// "news" powers the News & Events section: one Markdown file per item in
// src/content/news/, listed at /news and rendered at /news/<filename>/.
//
// To add an item: copy an existing file in src/content/news/, rename it
// (the filename becomes the URL) and edit the front matter below the `---`.
// A file that breaks the schema fails the build with the field name, so a
// malformed item can never ship silently.
// ---------------------------------------------------------------------------
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/news" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Publication date. Drives the ordering of the listing page.
      date: z.coerce.date(),
      type: z.enum(["News", "Event", "Publication"]),
      // One or two sentences: used on the card and as the page description.
      summary: z.string(),
      // Set on events only: the date the event takes place. A future date
      // lifts the item into the "Upcoming" strip at the top of /news.
      eventDate: z.coerce.date().optional(),
      location: z.string().optional(),
      // Optional cover image. Put the file in src/assets/news/ and reference
      // it relative to this Markdown file, e.g. ../../assets/news/launch.jpg
      cover: image().optional(),
      coverAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      // Optional outbound link, e.g. to a journal article or an event page.
      external: z.object({ label: z.string(), href: z.string().url() }).optional(),
      // Drafts show in `npm run dev` and are dropped from production builds.
      draft: z.boolean().default(false),
    }),
});

export const collections = { news };
