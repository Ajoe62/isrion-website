# Project images: drop raw exports and photos here

Files in this folder are processed by Astro (`astro:assets`): converted to WebP,
given a responsive `srcset`, and emitted to `/_astro/` with a fingerprinted,
long-cached filename. That is why project images live here and not in
`public/img/`. The folder holds maps, charts and field photos alike.

## What to drop

- **Formats:** `.png` (best for crisp labels and legends), `.jpg` / `.jpeg`, or
  `.webp`. **PDF is not supported**. Export a raster from QGIS / ArcGIS first.
- **Size:** 2000–3000px on the long edge is plenty. The build derives card
  thumbnails, gallery images and a ~2000px version for the full-size viewer.
- **Naming:** kebab-case and descriptive, e.g.
  `fct-landuse-2025.png`, `niger-delta-wetland-change.jpg`.

## Then

Add the image to a project's `plates` list in `src/data/projects.ts` (or add a
new project) with the exact filename in `file`, plus a title, alt text and,
optionally, a description, key figure and tags. A `file` with no matching image
here fails the build by name.

Each project gets a card on `/projects` and its own page at
`/projects/<slug>/` showing every plate. Set `fit: "contain"` for maps and
charts (shown whole, never cropped) or `fit: "cover"` for photographs, and
`cover` to choose which plate is the card thumbnail.
