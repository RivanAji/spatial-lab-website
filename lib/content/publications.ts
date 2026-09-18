import type { Publication } from "./types";

// Real publications collected from each member's Google Scholar profile
// (PRD section 3.3, 2026-09-19). This is launch seed content, not
// placeholder text — every title, author string, and citation count here
// is real. A few venues came back blank from Scholar (theses, some
// conference listings); those stay blank rather than getting a guessed-at
// journal name (PRD 6.6 / 29.9 — no invented content).
//
// One placement note: the carbon-stock paper below is filed under
// decision-support-climate, not spatial-data-science-ai as an earlier
// draft of this table had it — Kurniawati isn't a member of that second
// team, and climate is the better thematic fit anyway.
export const publications: Publication[] = [
  // Team 01 — Sustainable Urban Transportation
  {
    slug: "modeling-household-residential-location-choice",
    title:
      "Modeling household residential location choice and travel behavior and its relationship with public transport accessibility",
    authors: "Nurlaela, S., Curtis, C.",
    year: 2012,
    venue: "Procedia Social and Behavioral Sciences 54",
    team: "sustainable-urban-transportation",
    citations: 73,
  },
  {
    slug: "concept-of-carrying-capacity",
    title: "Concept of carrying capacity: Challenges in spatial planning",
    authors: "Handayeni, K.D.M.E., Santoso, E.B., Aulia, B.U., Ghozali, A.",
    year: 2014,
    venue: "Procedia Social and Behavioral Sciences",
    team: "sustainable-urban-transportation",
    citations: 72,
  },
  {
    slug: "tod-best-practice-ghg-mitigation",
    title: "TOD best practice: Lesson learned for GHG mitigation",
    authors: "Handayeni, K.D.M.E.",
    year: 2014,
    venue: "Procedia Social and Behavioral Sciences",
    team: "sustainable-urban-transportation",
    citations: 31,
  },
  {
    slug: "accessibility-improvement-property-value-perth-mandurah",
    title:
      "Assessing the impact of accessibility improvement on property value capitalization post Perth-Mandurah railway opening",
    authors: "Nurlaela, S., Pamungkas, A.",
    year: 2014,
    venue: "Procedia Social and Behavioral Sciences 135",
    team: "sustainable-urban-transportation",
    citations: 8,
  },
  {
    slug: "evaluasi-kualitas-pelayanan-commuter-line-gender",
    title: "Evaluasi kualitas pelayanan commuter line berdasarkan perspektif gender",
    authors: "Nurlaela, S., Laia, T.C.",
    year: 2020,
    venue: "Jurnal Teknik ITS 9(2)",
    team: "sustainable-urban-transportation",
    citations: 16,
  },
  {
    slug: "elevated-outdoor-mrt-station-thermal-comfort-jakarta",
    title:
      "Impact of elevated outdoor MRT station towards passenger thermal comfort: A case study in Jakarta MRT",
    authors: "Nurlaela, S., Sugiono, S., Kusuma, A., Wicaksono, A., Lukodono, R.P.",
    year: 2020,
    venue: "Scientific Review Engineering and Environmental Sciences",
    team: "sustainable-urban-transportation",
    citations: 7,
  },
  {
    slug: "faktor-kecelakaan-lalu-lintas-surabaya-tata-ruang",
    title:
      "Analisis faktor kecelakaan lalu lintas Surabaya berdasarkan perspektif tata ruang melalui pemodelan spasial",
    authors: "Nurlaela, S., Adlina, Y.Y.N.",
    year: 2021,
    venue: "Jurnal Teknik ITS 10(1)",
    team: "sustainable-urban-transportation",
    citations: 11,
  },
  {
    slug: "keterjangkauan-fasilitas-halte-koridor-jalan-kota",
    title: "Analisis Keterjangkauan Fasilitas Halte pada Koridor Ruas Jalan Kota",
    authors: "Larasati, A.F., Nurlaela, S., Susetyo, C.",
    year: 2022,
    venue: "Jurnal Penelitian Transportasi Darat 24(1)",
    team: "sustainable-urban-transportation",
    citations: 9,
  },
  {
    slug: "transjakarta-covid-19-twitter-sentiment",
    title:
      "TransJakarta Service Evaluation in Controlling COVID-19 Transmission Using Twitter Sentiment Analysis",
    authors: "Nurlaela, S., William, A.",
    year: 2023,
    venue: "Journal of Regional and City Planning 34(2)",
    team: "sustainable-urban-transportation",
    citations: 4,
  },

  // Team 02 — Spatial Data Science and AI for Urban Analytics
  {
    slug: "model-kerentanan-wilayah-pesisir-banjir-pasang",
    title: "Model kerentanan wilayah pesisir berdasarkan perubahan garis pantai dan banjir pasang",
    authors: "Pratomoatmojo, N.A., Marfai, M.A., Hidayatullah, T., Nirwansyah, A.W.",
    year: 2011,
    venue: "",
    team: "spatial-data-science-ai",
    citations: 38,
  },
  {
    slug: "land-use-change-tidal-flood-markov-cellular-automata",
    title: "Land use change modelling under tidal flood scenario by means of Markov-Cellular Automata",
    authors: "Pratomoatmojo, N.A.",
    year: 2012,
    venue: "",
    team: "spatial-data-science-ai",
    citations: 25,
  },
  {
    slug: "landusesim-aplikasi-pemodelan-simulasi-spasial",
    title: "LanduseSim sebagai aplikasi pemodelan dan simulasi spasial perubahan penggunaan lahan",
    authors: "Pratomoatmojo, N.A.",
    year: 2014,
    venue: "",
    team: "spatial-data-science-ai",
    citations: 33,
  },
  {
    slug: "landusesim-algorithm-cellular-automata-gis",
    title: "LanduseSim algorithm: land use change modelling by means of cellular automata and geographic information system",
    authors: "Pratomoatmojo, N.A.",
    year: 2018,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    citations: 39,
  },
  {
    slug: "landusesim-methods-land-use-class-hierarchy",
    title: "LanduseSim Methods: Land use class hierarchy for simulations of multiple land use growth",
    authors: "Pratomoatmojo, N.A.",
    year: 2018,
    venue: "",
    team: "spatial-data-science-ai",
    citations: 18,
  },
  {
    slug: "urban-form-changes-north-cianjur",
    title:
      "A Quantitative Approach to Characterizing the Changes and Managing Urban Form for Sustaining the Suburb of a Mega-Urban Region: The Case of North Cianjur",
    authors: "Jatayu, A. et al.",
    year: 2020,
    venue: "Sustainability 12(19)",
    team: "spatial-data-science-ai",
  },
  {
    slug: "urban-form-dynamics-hinterland-north-cianjur",
    title:
      "Urban Form Dynamics and Modelling towards Sustainable Hinterland Development in North Cianjur, Jakarta-Bandung Mega-Urban Region",
    authors: "Jatayu, A. et al.",
    year: 2022,
    venue: "Sustainability 14(2)",
    team: "spatial-data-science-ai",
  },
  {
    slug: "urban-expansion-impact-jbmur-south-conurbation",
    title:
      "Metric-Based Approach for Quantifying Urban Expansion Impact on Urban Form Changes in the JBMUR South Conurbation Corridor",
    authors: "Jatayu, A. et al.",
    year: 2023,
    venue: "Land 12(4)",
    team: "spatial-data-science-ai",
  },

  // Team 03 — Decision Support and Climate Change
  {
    slug: "computer-mediated-e-negotiation-support-system",
    title: "Computer-mediated e-negotiation support system",
    authors: "Susetyo, C.",
    year: 2013,
    venue: "CUPUM 2013",
    team: "decision-support-climate",
  },
  {
    slug: "comparison-digital-elevation-modelling-urban",
    title: "Comparison of Digital Elevation Modelling Methods for Urban Environment",
    authors: "Susetyo, C.",
    year: 2016,
    venue: "ARPN Journal of Engineering and Applied Sciences 11(5)",
    team: "decision-support-climate",
    citations: 19,
  },
  {
    slug: "sustainable-food-land-policy-east-java",
    title: "Problematic determination of sustainable food land policy in East Java",
    authors: "Kurniawati, U.F., Siswanto, V.K.",
    year: 2016,
    venue: "Procedia Social and Behavioral Sciences",
    team: "decision-support-climate",
    citations: 8,
  },
  {
    slug: "land-use-change-paddy-field-food-security-gerbangkertosusila",
    title:
      "Land use change trend of paddy field and its influence on food security in Gerbangkertosusila Region",
    authors: "Firmansyah, F., Susetyo, C., Pratomoatmojo, N.A., Kurniawati, U.F., Yusuf, M.",
    year: 2021,
    venue: "IOP Conference Series: Earth and Environmental Science 778(1)",
    team: "decision-support-climate",
    citations: 16,
  },
  {
    slug: "spatial-planning-flood-prevention-kedurus-river",
    title: "Spatial planning concept for flood prevention in the Kedurus River watershed",
    authors: "Susetyo, C. et al.",
    year: 2022,
    venue: "Open Geosciences",
    team: "decision-support-climate",
    citations: 2,
  },
  {
    slug: "spatial-data-strategic-environmental-assessment",
    title: "The role of spatial data to support strategic environmental assessment for general spatial planning",
    authors: "Susetyo, C. et al.",
    year: 2022,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "decision-support-climate",
    citations: 3,
  },
  {
    slug: "health-facility-coverage-covid-19-surabaya",
    title:
      "Spatial analysis of health facility service coverage in handling of COVID-19 patients in the area Surabaya City Settlement",
    authors: "Susetyo, C. et al.",
    year: 2022,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "decision-support-climate",
    citations: 2,
  },
  {
    slug: "carrying-capacity-ecosystem-services-surabaya",
    title: "Carrying capacity and environmental capacity analysis based on ecosystem services in Surabaya",
    authors: "Pratomoatmojo, N.A., Firmansyah, F., Umilia, E., Yusuf, M.",
    year: 2020,
    venue: "",
    team: "decision-support-climate",
    citations: 10,
  },
  {
    slug: "photogrammetry-3d-gis-jambi-spatial-utilization",
    title:
      "Integration of photogrammetry data and 3D modelling GIS for analyzing spatial utilization intensity based on Jambi city government regulations in sustainable spatial planning",
    authors: "Susetyo, C. et al.",
    year: 2026,
    venue: "BIO Web of Conferences",
    team: "decision-support-climate",
  },
  {
    slug: "dampak-perubahan-lahan-stok-karbon-surabaya",
    title: "Dampak perubahan penggunaan lahan terhadap besaran stok karbon di Kota Surabaya",
    authors: "Kurniawati, U.F.",
    year: 2021,
    venue: "Jurnal Penataan Ruang",
    team: "decision-support-climate",
    citations: 24,
  },
];

export function publicationsByTeam(team: Publication["team"]): Publication[] {
  return publications.filter((p) => p.team === team);
}
