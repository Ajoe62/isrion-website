// ---------------------------------------------------------------------------
// KEYSTATIC CMS
//
// The admin panel at /keystatic. Editors sign in through Keystatic Cloud
// (project isrion-news/isrion-news); every save is a commit to `main`, which
// Vercel deploys automatically.
//
// This file describes the editing form. The rules the site builds against stay
// in src/content.config.ts, so keep the two in step: a field added here must
// also be added there, and the select options must match its enums.
// ---------------------------------------------------------------------------
import { config, collection, fields } from "@keystatic/core";

const NEWS_IMAGES = { directory: "src/assets/news", publicPath: "../../assets/news/" };

export default config({
  storage: { kind: "cloud" },
  cloud: { project: "isrion-news/isrion-news" },
  ui: {
    brand: { name: "ISRION Newsroom" },
  },
  collections: {
    news: collection({
      label: "News",
      path: "src/content/news/*",
      slugField: "title",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["status", "date", "category"],
      schema: {
        title: fields.slug({
          name: { label: "Title", validation: { length: { min: 1, max: 120 } } },
          slug: {
            label: "Web address",
            description: "Filled in from the title. The article will live at /news/<web address>/.",
          },
        }),
        status: fields.select({
          label: "Status",
          description:
            "Writers: choose “Ready for review” when the article is finished. " +
            "Only the approver changes this to “Published”, which puts it on the website.",
          options: [
            { label: "Draft (not on the website)", value: "draft" },
            { label: "Ready for review (not on the website)", value: "review" },
            { label: "Published (live on the website)", value: "published" },
          ],
          defaultValue: "draft",
        }),
        date: fields.date({
          label: "Publication date",
          description: "Articles are listed newest first.",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: "Category",
          options: [
            { label: "News", value: "News" },
            { label: "Research", value: "Research" },
            { label: "Insight", value: "Insight" },
            { label: "Publication", value: "Publication" },
            { label: "Announcement", value: "Announcement" },
          ],
          defaultValue: "News",
        }),
        summary: fields.text({
          label: "Summary",
          description: "One or two sentences. Shown on the article card and in search results.",
          multiline: true,
          validation: { length: { min: 1, max: 300 } },
        }),
        author: fields.text({ label: "Author", defaultValue: "ISRION team" }),
        cover: fields.image({
          label: "Cover image",
          description: "Optional. A landscape JPG or PNG works best.",
          ...NEWS_IMAGES,
        }),
        coverAlt: fields.text({
          label: "Cover image description",
          description:
            "Describe what the image shows, for people using screen readers. Required when there is a cover image.",
          multiline: true,
        }),
        tags: fields.array(fields.text({ label: "Tag" }), {
          label: "Tags",
          itemLabel: (props) => props.value || "New tag",
        }),
        featured: fields.checkbox({
          label: "Feature this article",
          description: "Pins it to the large slot at the top of the News page. Otherwise the newest article is featured.",
        }),
        external: fields.object(
          {
            label: fields.text({ label: "Button text", description: "e.g. “Read the paper”" }),
            href: fields.url({ label: "Link" }),
          },
          {
            label: "External link (optional)",
            description: "A button to a journal article, dataset or report. Leave the link empty for none.",
          },
        ),
        content: fields.markdoc({
          label: "Article",
          extension: "md",
          options: {
            heading: [2, 3],
            // Markdoc tables are written as {% table %} tags, which the site's
            // Markdown renderer cannot read.
            table: false,
            image: NEWS_IMAGES,
          },
        }),
      },
    }),
  },
});
