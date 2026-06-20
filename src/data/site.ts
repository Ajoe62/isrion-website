// ---------------------------------------------------------------------------
// ISRION International Ltd — site content
// Edit text here and it flows into the components. No markup changes needed.
// ---------------------------------------------------------------------------

export const company = {
  name: "ISRION International Ltd",
  short: "ISRION",
  rc: "RC 9120351",
  email: "isaelabor22@gmail.com",
  location: "Kubwa · FCT · Nigeria",
  address: "Flat 2, Block 59 Kubwa II, Kubwa, FCT, Nigeria",
  founded: "2025",
  tagline: "Innovative Solutions · Sustainable Futures",
  // Used for SEO + sitemap. Change to your real domain once registered.
  url: "https://www.isrion.com",
  coords: "09.04°N · 07.36°E — Abuja, Nigeria",
  // Formspree form ID — powers the contact form on any static host (Vercel etc).
  // Create a free form at https://formspree.io and paste the ID from the
  // endpoint it gives you (https://formspree.io/f/XXXXXXXX → use "XXXXXXXX").
  formspreeId: "YOUR_FORM_ID",
};

export const nav = [
  { label: "Capabilities", href: "#what" },
  { label: "Approach", href: "#approach" },
  { label: "Industries", href: "#industries" },
  { label: "About", href: "#about" },
];

export const values = [
  { title: "Integrity", body: "The highest ethical standards across every engagement." },
  { title: "Innovation", body: "Cutting-edge technology applied to real, complex problems." },
  { title: "Sustainability", body: "Solutions that are environmentally and socially responsible." },
  { title: "Excellence", body: "Work that consistently meets and exceeds expectations." },
];

export type Service = {
  idx: string;
  cat: string;
  title: string;
  desc: string;
  tags: string[];
};

export const services: Service[] = [
  {
    idx: "01", cat: "Environmental", title: "Environmental Consulting",
    desc: "Impact assessment, audits, restoration and monitoring that keep projects compliant and ecosystems intact.",
    tags: ["EIA", "Compliance", "Remediation", "Climate strategy"],
  },
  {
    idx: "02", cat: "Geospatial", title: "Geospatial Technology",
    desc: "GIS, remote sensing, drone mapping and GeoAI that turn terrain and imagery into decisions.",
    tags: ["GIS", "Remote sensing", "GeoAI", "Drone survey"],
  },
  {
    idx: "03", cat: "Engineering", title: "Engineering & Technical Consultancy",
    desc: "Civil and environmental engineering support, feasibility studies, due diligence and project oversight.",
    tags: ["Feasibility", "Design review", "Due diligence"],
  },
  {
    idx: "04", cat: "Energy", title: "Renewable Energy Solutions",
    desc: "Feasibility, solar integration, efficiency and transition planning toward clean, resilient power.",
    tags: ["Solar", "Efficiency", "Carbon", "Transition"],
  },
  {
    idx: "05", cat: "ESG", title: "ESG Advisory",
    desc: "Strategy, reporting, risk assessment and stakeholder engagement for credible sustainability programs.",
    tags: ["Strategy", "Reporting", "Risk"],
  },
  {
    idx: "06", cat: "Research", title: "Research & Development",
    desc: "Multidisciplinary research across climate, public health, agriculture and resource management.",
    tags: ["Climate", "Public health", "Resources"],
  },
  {
    idx: "07", cat: "Procurement", title: "Strategic Sourcing",
    desc: "Procurement planning, vendor evaluation and sourcing of analytical and scientific equipment.",
    tags: ["Sourcing", "Supply chain", "Equipment"],
  },
  {
    idx: "08", cat: "Agri-Tech", title: "Agriculture & Agri-Tech",
    desc: "Precision agriculture, resource mapping and soil & water assessment for productive, sustainable farming.",
    tags: ["Precision ag", "Soil & water", "Mapping"],
  },
];

export const steps = [
  { num: "STEP 01", title: "Listen & scope", body: "We define the real problem with you, mapping constraints, stakeholders and success criteria." },
  { num: "STEP 02", title: "Assess & analyse", body: "Field data, GIS and remote sensing build an evidence base you can trust." },
  { num: "STEP 03", title: "Design the solution", body: "Engineering, sustainability and technology combine into a buildable, compliant plan." },
  { num: "STEP 04", title: "Deliver & monitor", body: "We implement, measure impact and adapt — so results hold over the long term." },
];

export const industries = [
  "Oil & Gas", "Petrochemicals", "Renewable Energy", "Government",
  "Agriculture", "Environmental Mgmt", "Construction", "Mining",
  "Public Health", "Research Institutions", "Development Orgs", "Manufacturing",
];

export const objectives = [
  "Expert consulting in environmental studies and sustainability planning.",
  "Advanced GIS, remote sensing, GeoAI and decision-support systems.",
  "Integrated solutions across food, energy, water, climate and biodiversity.",
  "Research, innovation and training in sustainable development.",
];

export const leaders = [
  {
    initials: "IE", name: "Mr. Isa Elabor", role: "Director",
    bio: "Strategic leadership and corporate oversight, with experience across business administration, project management and environmental consulting.",
  },
  {
    initials: "RE", name: "Mrs. Rabi Elabor", role: "Director",
    bio: "Strategic planning, stakeholder engagement and operational management, supporting the company's commitment to sustainable growth.",
  },
];
