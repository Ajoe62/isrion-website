// Resolves the `file` names in src/data/projects.ts to Astro image metadata.
//
// Images live in src/assets/maps/ so Astro's image pipeline (sharp) converts
// them to WebP, builds a responsive srcset and emits them into /_astro/, which
// both netlify.toml and vercel.json already cache immutable. The raw map
// exports are up to ~10,500px wide and 2 MB each, so shipping them from
// public/ verbatim would not be viable.
import type { ImageMetadata } from "astro";
import type { Plate, Project } from "../data/projects";

const files = import.meta.glob<{ default: ImageMetadata }>(
  "../assets/maps/*.{png,jpg,jpeg,webp}",
  { eager: true },
);

export const plateImage = (plate: Plate): ImageMetadata => {
  const entry = files[`../assets/maps/${plate.file}`];
  if (!entry) {
    throw new Error(
      `[projects] src/assets/maps/${plate.file} not found. ` +
        `Check the \`file\` value in src/data/projects.ts against the actual filename.`,
    );
  }
  return entry.default;
};

// The card thumbnail: the chosen plate, or the project's /public image when it
// has no plates of its own.
export const coverImage = (p: Project): ImageMetadata | string | undefined => {
  const plate = p.plates[p.cover ?? 0];
  return plate ? plateImage(plate) : p.image;
};

// "6 images", "1 image"
export const imageCount = (p: Project) =>
  `${p.plates.length} image${p.plates.length === 1 ? "" : "s"}`;
