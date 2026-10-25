// ---------------------------------------------------------------------------
// MAPS / CARTOGRAPHY: the map gallery on the "Our Works" page.
//
// To add a map:
//   1. Drop the raster into  src/assets/maps/   (PNG / JPG / WebP, not PDF)
//   2. Add an entry to a series below with `file` set to the exact filename.
// The build fails by name if a `file` has no matching image, so a typo can
// never ship as a silently broken card.
//
// Each series renders as one row card: text on the left, the active plate on
// the right and a thumbnail strip beneath it to switch plates. Order plates so
// that ones which compare (e.g. the same pollutant in two years) sit next to
// each other in the strip. The row's frame takes the shape of the tallest plate
// in the series, so switching never resizes the card or crops a legend.
// ---------------------------------------------------------------------------

export type MapWork = {
  file: string;          // filename inside src/assets/maps/
  chip: string;          // short chip label, e.g. "CH4"
  label: string;         // header label beside the chip, e.g. "Methane"
  year?: string;
  title: string;
  description: string;
  stat: string;          // key figure, shown first in the spec row
  extent: string;        // spatial extent
  tags: string[];
  accent: string;        // card accent, matched to the map's own ramp
  alt: string;
};

export type MapSeries = {
  id: string;
  label: string;         // small label above the series title
  title: string;
  intro: string;
  period?: string;       // shown in the row's meta list, e.g. "2020–2025"
  plates: MapWork[];
};

export const mapSeries: MapSeries[] = [
  {
    id: "air-quality",
    label: "Atmospheric pollutants",
    title: "Air quality across Nigeria, mapped.",
    period: "2020–2025",
    intro:
      "A national atlas of atmospheric pollutants (methane, nitrogen dioxide and fine particulate matter) resolved below state level and paired across years so change is visible at a glance.",
    plates: [
      {
        file: "CH4_2020.png",
        chip: "CH4", label: "Methane", year: "2020",
        title: "Annual Mean CH₄ Concentration over Nigeria",
        description:
          "Baseline national methane surface. Concentrations climb out of the humid south (the Niger Delta and the south-west hold the lowest readings) into a broad elevated band across the middle belt and north-east, peaking through Nassarawa, Benue, Taraba, Gombe and Borno.",
        stat: "1,783 – 1,959 ppb",
        extent: "Nigeria · 36 states + FCT",
        tags: ["Annual mean", "5-class choropleth", "Sub-state resolution"],
        accent: "#c9453a",
        alt: "Choropleth map of Nigeria showing annual mean methane concentration in 2020, 1,783 – 1,959 ppb, with state boundaries and labels.",
      },
      {
        file: "CH4_2025.png",
        chip: "CH4", label: "Methane", year: "2025",
        title: "Annual Mean CH₄ Concentration over Nigeria",
        description:
          "The same surface five years on. Every class break shifts upward: the national ceiling rises from 1,959 to 2,007 ppb and the mid-range band moves roughly 30 ppb higher, with the elevated zone thickening across Niger, Kogi, Nassarawa and Kaduna.",
        stat: "1,756 – 2,007 ppb",
        extent: "Nigeria · 36 states + FCT",
        tags: ["Annual mean", "Change vs. 2020", "Sub-state resolution"],
        accent: "#c9453a",
        alt: "Choropleth map of Nigeria showing annual mean methane concentration in 2025, 1,756 – 2,007 ppb, with state boundaries and labels.",
      },
      {
        file: "NO2_2020.png",
        chip: "NO2", label: "Nitrogen Dioxide", year: "2020",
        title: "Annual Mean Tropospheric NO₂ Concentration over Nigeria",
        description:
          "Tropospheric nitrogen dioxide traces combustion directly, so this reads as a map of economic activity: sharp maxima over the Lagos–Ogun conurbation, Abuja, Kano and the Port Harcourt oil corridor, set against a near-clean Sahel background.",
        stat: "7.49 – 63.87 ppb",
        extent: "Nigeria · 36 states + FCT",
        tags: ["Annual mean", "Tropospheric column", "Urban hotspots"],
        accent: "#e0722c",
        alt: "Choropleth map of Nigeria showing annual mean nitrogen dioxide concentration in 2020, 7.49 – 63.87 ppb, with state boundaries and labels.",
      },
      {
        file: "NO2_2025.png",
        chip: "NO2", label: "Nitrogen Dioxide", year: "2025",
        title: "Annual Mean Tropospheric NO₂ Concentration over Nigeria",
        description:
          "By 2025 the hotspots hold position but the moderate band spreads: the 16–21 ppb class now covers most of the middle belt and south-east rather than isolated corridors, and the national maximum climbs to 67 ppb.",
        stat: "7.64 – 67.02 ppb",
        extent: "Nigeria · 36 states + FCT",
        tags: ["Annual mean", "Change vs. 2020", "Urban hotspots"],
        accent: "#e0722c",
        alt: "Choropleth map of Nigeria showing annual mean nitrogen dioxide concentration in 2025, 7.64 – 67.02 ppb, with state boundaries and labels.",
      },
      {
        file: "PM2.5_2020.png",
        chip: "PM2.5", label: "Fine Particulate Matter", year: "2020",
        title: "Annual Mean PM₂.₅ Concentration over Nigeria",
        description:
          "Fine particulate matter follows the harmattan dust regime rather than the cities: a pronounced maximum across Katsina, Kano, Jigawa, Bauchi and northern Kaduna, falling steadily southward to the cleanest air along the coast and in the south-east.",
        stat: "2.57 – 10.09 µg/m³",
        extent: "Nigeria · 36 states + FCT",
        tags: ["Annual mean", "Dust regime", "Public health"],
        accent: "#d63b30",
        alt: "Choropleth map of Nigeria showing annual mean fine particulate matter concentration in 2020, 2.57 – 10.09 µg/m³, with state boundaries and labels.",
      },
      {
        file: "PM2.5_2022.png",
        chip: "PM2.5", label: "Fine Particulate Matter", year: "2022",
        title: "Annual Mean PM₂.₅ Concentration over Nigeria",
        description:
          "Two years later the northern maximum is both higher and wider: the top class rises from 10.09 to 11.78 µg/m³ and covers a contiguous block from Katsina through Kano and Jigawa into Bauchi, while the low-concentration southern zone pushes further north.",
        stat: "1.56 – 11.78 µg/m³",
        extent: "Nigeria · 36 states + FCT",
        tags: ["Annual mean", "Change vs. 2020", "Public health"],
        accent: "#d63b30",
        alt: "Choropleth map of Nigeria showing annual mean fine particulate matter concentration in 2022, 1.56 – 11.78 µg/m³, with state boundaries and labels.",
      },
    ],
  },

  // Figures from the Kwara SAR flood mapping manuscript
  // (src/assets/Kwara_FloodMapping_Manuscript.docx).
  {
    id: "kwara-flood",
    label: "Flood hazard · Sentinel-1 SAR",
    title: "Dam-induced flooding in Kwara State, 2018–2025.",
    period: "2018–2025",
    intro:
      "A multi-temporal radar assessment of five flood events traced to releases from the Jebba and Kainji hydroelectric dams on the River Niger. Flood extents were detected by backscatter change in Google Earth Engine, then overlaid on cropland, population and LGA boundaries to measure what each release put under water.",
    plates: [
      {
        file: "KWARA_FLOOD_1.jpg",
        chip: "SAR", label: "Flood statistics", year: "2018–2025",
        title: "Multi-Event Flood Statistics Dashboard",
        description:
          "Five dam-release events compared side by side: total flooded area, flooded cropland, estimated population exposure, the temporal trend and land-cover composition. Inundation grew from 7 km² in October 2018 to a peak of 255 km² in September 2022, while flooded cropland rose with every event to 122 km² in April 2025, 63.5% of that event's footprint.",
        stat: "Peak 255 km² · Sep 2022",
        extent: "Kwara State, Nigeria",
        tags: ["Sentinel-1 GRD", "VV + VH change detection", "Google Earth Engine"],
        accent: "#2a7de1",
        alt: "Dashboard of five bar and line charts comparing flooded area, flooded cropland, population exposed, temporal trend and cropland share for five dam-induced flood events in Kwara State between 2018 and 2025.",
      },
      {
        file: "KWARA_FLOOD_2.jpg",
        chip: "Exposure", label: "Population", year: "2018–2025",
        title: "Population Exposure to Dam-Induced Flooding",
        description:
          "WorldPop 2020 population overlaid on each flood mask. The September 2022 release exposed an estimated 24,822 people, the largest of the study period, and the dry-season release of February 2025 still reached 15,623. A second panel sets out the population of each flood-affected LGA.",
        stat: "24,822 exposed · Sep 2022",
        extent: "Kwara State, Nigeria",
        tags: ["WorldPop 2020", "Per-event exposure", "Cumulative trend"],
        accent: "#2a7de1",
        alt: "Bar chart of estimated population exposed per flood event in Kwara State with a cumulative line, beside a grid of population totals for flood-affected LGAs.",
      },
      {
        file: "KWARA_FLOOD_3.jpg",
        chip: "LGA", label: "Flooded area", year: "2018–2025",
        title: "Flooded Area per LGA per Event",
        description:
          "Flooded km² by Local Government Area for every event. Pategi (129.3 km²) and Edu (120.4 km²) held 98% of the September 2022 inundation; then the flood centroid shifted, with Kaiama taking 166.6 km² in April 2025, 87% of that event.",
        stat: "Kaiama 166.6 km² · Apr 2025",
        extent: "Kwara State, Nigeria",
        tags: ["Zonal statistics", "FAO GAUL LGAs", "Centroid shift"],
        accent: "#2a7de1",
        alt: "Heatmap of flooded area in square kilometres for six Kwara State LGAs across five flood events from October 2018 to April 2025.",
      },
      {
        file: "KWARA_FLOOD_4.jpg",
        chip: "LGA", label: "Exposure grid", year: "2018–2025",
        title: "LGA-Level Flood Exposure",
        description:
          "Two matrices summarise exposure by LGA: how many of the five events reached each one, and the largest area it lost in a single event. Pategi and Edu flooded in every event, the chronic flood core along the Niger floodplain, while Ilorin East and Ilorin West register for the first time in 2025.",
        stat: "Pategi + Edu · 5 of 5 events",
        extent: "Kwara State, Nigeria",
        tags: ["Event frequency", "Max single-event area", "Chronic flood core"],
        accent: "#2a7de1",
        alt: "Two colour-coded grids of Kwara State LGAs showing the number of flood events and the maximum single-event flooded area for each LGA.",
      },
      {
        file: "KWARA_FLOOD_5.jpg",
        chip: "Risk", label: "Classification", year: "2018–2025",
        title: "LGA Flood Risk Classification",
        description:
          "Each affected LGA ranked by its maximum single-event flood area and its event frequency, then graded from Very High to Low, with a separate watch class for urban Ilorin. Pategi, Edu and Kaiama sit in the Very High tier, followed by Moro and Baruten.",
        stat: "3 LGAs rated Very High",
        extent: "Kwara State, Nigeria",
        tags: ["Risk tiers", "Early warning", "Dam release governance"],
        accent: "#2a7de1",
        alt: "Horizontal bar charts ranking ten Kwara State LGAs by maximum flood area and flood event frequency, coloured by risk class.",
      },
    ],
  },

  {
    id: "delta-sampling",
    label: "Field sampling · Delta State",
    title: "Gas flare sampling sites, Delta State.",
    intro:
      "Location maps for an environmental sampling campaign around oil and gas facilities in Delta State. Each plate places the sampling points (ambient air and rainwater at set distances from the flare, groundwater, storm water, produced water and creek water from up-stream to down-stream) inside Delta State and Nigeria locator frames.",
    plates: [
      {
        file: "JACIO_1.jpg",
        chip: "Site map", label: "Sampling sites",
        title: "Sampling Sites near Kwale",
        description:
          "Six sampling points on the creek system near Kwale: paired air-quality and rainwater stations 30 m and 75 m from the flare, a groundwater well, up-stream and mid-stream surface water, and a storm water point to the north-west.",
        stat: "6 sampling points",
        extent: "Delta State, Nigeria",
        tags: ["Air quality", "Rainwater", "Surface water"],
        accent: "#e0463a",
        alt: "Location map of six sampling sites near Kwale beside a meandering creek, with locator insets of Delta State and Nigeria.",
      },
      {
        file: "JACIO_3.jpg",
        chip: "Site map", label: "Jones Creek",
        title: "Jones Creek Sites",
        description:
          "The Jones Creek campaign: up-stream and down-stream water stations grouped with an air-quality and rainwater point 60 m from the flare, plus two stations on the water to the south-east at the Gracious 1 and Gracious 2 houseboats.",
        stat: "5 sampling points",
        extent: "Delta State, Nigeria",
        tags: ["Air quality", "Surface water", "Houseboat stations"],
        accent: "#e0463a",
        alt: "Location map of Jones Creek sampling sites, including up-stream, down-stream and houseboat stations, with locator insets of Delta State and Nigeria.",
      },
      {
        file: "JACIO_4.jpg",
        chip: "Site map", label: "Flow stations",
        title: "Egwa and Amaranta Flow Stations",
        description:
          "A dense station layout around the Egwa and Amaranta flow stations: an air-quality and rainwater transect at 60 m, 200 m and 500 m from the flare, produced water, storm water, a groundwater well, and up-stream, mid-stream and down-stream creek samples.",
        stat: "9 sampling points",
        extent: "Delta State, Nigeria",
        tags: ["Flare distance transect", "Produced water", "Groundwater"],
        accent: "#e0463a",
        alt: "Point map of nine sampling stations at the Egwa and Amaranta flow stations, with locator maps of Nigeria and Delta State below.",
      },
      {
        file: "JACIO_2.jpg",
        chip: "Site map", label: "Station layout",
        title: "Flow Station Sampling Layout",
        description:
          "The nine-point flow station design in an alternate layout: air-quality and rainwater stations at 60 m, 200 m and 500 m from the flare alongside produced water, storm water, groundwater and creek samples, set against a green national locator.",
        stat: "9 sampling points",
        extent: "Delta State, Nigeria",
        tags: ["Flare distance transect", "Produced water", "Groundwater"],
        accent: "#e0463a",
        alt: "Point map of nine sampling stations around a flow station, with locator maps of Nigeria and Delta State below.",
      },
    ],
  },
];
