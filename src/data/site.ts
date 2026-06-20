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
  formspreeId: "xojzgypn",
};

// Primary navigation — individual pages (multi-page site).
// "Contact Us" is rendered separately as the highlighted CTA button.
export const nav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our Works", href: "/projects" },
];

export const socials = [
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" },
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

// ---------------------------------------------------------------------------
// PROJECTS / OUR WORKS — placeholder entries.
// Replace text with real projects and drop images in /public, then set the
// `image` field to e.g. "/projects/lagos-wetland.jpg" to show a photo instead
// of the gradient placeholder.
// ---------------------------------------------------------------------------
export type Project = {
  title: string;
  sector: string;
  year: string;
  location: string;
  summary: string;
  tags: string[];
  image?: string;
};

export const projects: Project[] = [
  {
    title: "Wetland Restoration & Monitoring",
    sector: "Environmental", year: "2025", location: "Niger Delta, NG",
    summary: "Baseline ecological survey and a multi-year monitoring framework to restore degraded wetland habitat around active industrial sites.",
    tags: ["EIA", "Remediation", "Monitoring"], image: "/img/env.jpg",
  },
  {
    title: "Regional Land-Use GIS Platform",
    sector: "Geospatial", year: "2025", location: "FCT, NG",
    summary: "Remote-sensing and GIS pipeline turning satellite imagery into a decision-support dashboard for sustainable regional planning.",
    tags: ["GIS", "Remote sensing", "GeoAI"], image: "/img/geo.jpg",
  },
  {
    title: "Solar Feasibility & Integration Study",
    sector: "Renewable Energy", year: "2024", location: "Kano, NG",
    summary: "Technical and financial feasibility for a hybrid solar deployment, including efficiency modelling and a phased transition plan.",
    tags: ["Solar", "Feasibility", "Transition"], image: "/img/solar.jpg",
  },
  {
    title: "Industrial ESG Reporting Programme",
    sector: "ESG Advisory", year: "2024", location: "Lagos, NG",
    summary: "End-to-end ESG strategy, materiality assessment and reporting aligned to international standards for a manufacturing client.",
    tags: ["Strategy", "Reporting", "Risk"], image: "/img/esg.jpg",
  },
  {
    title: "Precision Agriculture Soil & Water Survey",
    sector: "Agri-Tech", year: "2024", location: "Kaduna, NG",
    summary: "Soil and water resource mapping with precision-agriculture recommendations to lift yields while protecting the watershed.",
    tags: ["Soil & water", "Mapping", "Precision ag"], image: "/img/agri.jpg",
  },
  {
    title: "Infrastructure Feasibility & Due Diligence",
    sector: "Engineering", year: "2023", location: "Abuja, NG",
    summary: "Engineering feasibility, environmental due diligence and design review for a public infrastructure development.",
    tags: ["Feasibility", "Due diligence", "Design review"], image: "/img/eng.jpg",
  },
];
