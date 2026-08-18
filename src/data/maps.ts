// ---------------------------------------------------------------------------
// MAPS / CARTOGRAPHY: the map gallery on the "Our Works" page.
//
// To add a map:
//   1. Drop the raster into  src/assets/maps/   (PNG / JPG / WebP, not PDF)
//   2. Add an entry below with `file` set to the exact filename.
// The build fails by name if a `file` has no matching image, so a typo can
// never ship as a silently broken card.
//
// Cards render in pairs (two per row), so keep each pollutant's two years
// adjacent in this array.
// ---------------------------------------------------------------------------

export type MapWork = {
  file: string;          // filename inside src/assets/maps/
  pollutant: string;     // short chip label, e.g. "CH4"
  pollutantName: string; // full name, e.g. "Methane"
  year: string;
  title: string;
  description: string;
  range: string;         // legend min–max, shown in the spec row
  extent: string;        // spatial extent
  tags: string[];
  accent: string;        // card accent, matched to the map's own ramp
};

export const maps: MapWork[] = [
  {
    file: "CH4_2020.png",
    pollutant: "CH4", pollutantName: "Methane", year: "2020",
    title: "Annual Mean CH₄ Concentration over Nigeria",
    description:
      "Baseline national methane surface. Concentrations climb out of the humid south (the Niger Delta and the south-west hold the lowest readings) into a broad elevated band across the middle belt and north-east, peaking through Nassarawa, Benue, Taraba, Gombe and Borno.",
    range: "1,783 – 1,959 ppb",
    extent: "Nigeria · 36 states + FCT",
    tags: ["Annual mean", "5-class choropleth", "Sub-state resolution"],
    accent: "#c9453a",
  },
  {
    file: "CH4_2025.png",
    pollutant: "CH4", pollutantName: "Methane", year: "2025",
    title: "Annual Mean CH₄ Concentration over Nigeria",
    description:
      "The same surface five years on. Every class break shifts upward: the national ceiling rises from 1,959 to 2,007 ppb and the mid-range band moves roughly 30 ppb higher, with the elevated zone thickening across Niger, Kogi, Nassarawa and Kaduna.",
    range: "1,756 – 2,007 ppb",
    extent: "Nigeria · 36 states + FCT",
    tags: ["Annual mean", "Change vs. 2020", "Sub-state resolution"],
    accent: "#c9453a",
  },
  {
    file: "NO2_2020.png",
    pollutant: "NO2", pollutantName: "Nitrogen Dioxide", year: "2020",
    title: "Annual Mean Tropospheric NO₂ Concentration over Nigeria",
    description:
      "Tropospheric nitrogen dioxide traces combustion directly, so this reads as a map of economic activity: sharp maxima over the Lagos–Ogun conurbation, Abuja, Kano and the Port Harcourt oil corridor, set against a near-clean Sahel background.",
    range: "7.49 – 63.87 ppb",
    extent: "Nigeria · 36 states + FCT",
    tags: ["Annual mean", "Tropospheric column", "Urban hotspots"],
    accent: "#e0722c",
  },
  {
    file: "NO2_2025.png",
    pollutant: "NO2", pollutantName: "Nitrogen Dioxide", year: "2025",
    title: "Annual Mean Tropospheric NO₂ Concentration over Nigeria",
    description:
      "By 2025 the hotspots hold position but the moderate band spreads: the 16–21 ppb class now covers most of the middle belt and south-east rather than isolated corridors, and the national maximum climbs to 67 ppb.",
    range: "7.64 – 67.02 ppb",
    extent: "Nigeria · 36 states + FCT",
    tags: ["Annual mean", "Change vs. 2020", "Urban hotspots"],
    accent: "#e0722c",
  },
  {
    file: "PM2.5_2020.png",
    pollutant: "PM2.5", pollutantName: "Fine Particulate Matter", year: "2020",
    title: "Annual Mean PM₂.₅ Concentration over Nigeria",
    description:
      "Fine particulate matter follows the harmattan dust regime rather than the cities: a pronounced maximum across Katsina, Kano, Jigawa, Bauchi and northern Kaduna, falling steadily southward to the cleanest air along the coast and in the south-east.",
    range: "2.57 – 10.09 µg/m³",
    extent: "Nigeria · 36 states + FCT",
    tags: ["Annual mean", "Dust regime", "Public health"],
    accent: "#d63b30",
  },
  {
    file: "PM2.5_2022.png",
    pollutant: "PM2.5", pollutantName: "Fine Particulate Matter", year: "2022",
    title: "Annual Mean PM₂.₅ Concentration over Nigeria",
    description:
      "Two years later the northern maximum is both higher and wider: the top class rises from 10.09 to 11.78 µg/m³ and covers a contiguous block from Katsina through Kano and Jigawa into Bauchi, while the low-concentration southern zone pushes further north.",
    range: "1.56 – 11.78 µg/m³",
    extent: "Nigeria · 36 states + FCT",
    tags: ["Annual mean", "Change vs. 2020", "Public health"],
    accent: "#d63b30",
  },
];
