# Map images — drop raw exports here

Files in this folder are processed by Astro (`astro:assets`): converted to WebP,
given a responsive `srcset`, and emitted to `/_astro/` with a fingerprinted,
long-cached filename. That is why maps live here and not in `public/img/`.

## What to drop

- **Formats:** `.png` (best for crisp labels and legends), `.jpg`, or `.webp`.
  **PDF is not supported** — export a raster from QGIS / ArcGIS first.
- **Size:** 2000–3000px on the long edge is plenty. The build derives a ~900px
  card thumbnail and a ~2200px version for the lightbox.
- **Naming:** kebab-case and descriptive, e.g.
  `fct-landuse-2025.png`, `niger-delta-wetland-change.jpg`.

## Then

Add a matching entry in `src/data/maps.ts` with the exact filename in `file`,
plus the title, description, area, year, scale and tools. The card renders
automatically. A `file` with no matching image here fails the build by name.
