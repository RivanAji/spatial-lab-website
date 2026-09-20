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
//
// coverImage: three entries below carry a TEMPORARY placeholder — stock
// map photography from Unsplash, saved under public/images/
// publications-dummy/ — at the site owner's explicit request, purely so
// the new gallery card layout (PublicationsShowcase.tsx) could be
// previewed with real images instead of empty slots. These are NOT real
// covers and are not a quiet reversal of PRD 6.6's "no invented
// content"/"no stock photography standing in for real output" rule —
// they're marked here, and the plan is for the site owner to replace or
// remove them with actual cover art once that exists. Every other
// publication's coverImage stays unset, rendering the honest empty slot
// this file's own type comment (lib/content/types.ts) describes.
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
    coverImage: "/images/publications-dummy/transport-map.jpg", // dummy, see file-top note
  },
  // Added 2026-09-20 (site owner: "kok cuma segini, sepertinya masih
  // banyak yang belum masuk ke sini") — sourced from each member's own
  // ORCID record, Crossref (matched against ORCID/DOI where possible),
  // and the "Daftar Publikasi Tim" table built earlier the same day.
  // Two real candidates (Susetyo's "Orthogonal strategy..." and
  // Wibowo's "Mengungkap Pembangunan Kota Berkelanjutan...") aren't
  // here — neither has a confirmed publication year anywhere checked,
  // and year is required on this type, so they stay in
  // lib/content/publications.pending.json rather than getting a
  // guessed one (PRD 6.6).
  {
    slug: "analysis-of-the-inclusiveness-of-the-maas-based-public",
    title:
      "Analysis of the Inclusiveness of the MaaS-based Public Transport System in Surabaya City, Indonesia",
    authors: "Handayeni, K.D.M.E., Romadhon, K.C.",
    year: 2025,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "the-effect-of-the-built-environment-on-mode-choice-for",
    title:
      "The Effect of The Built Environment on Mode Choice for First and Last Mile Trip in Surabaya City, Indonesia",
    authors: "Handayeni, K.D.M.E., Rahmawati, A.S.",
    year: 2025,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "sensitivity-of-variables-affecting-urban-heat-island-uhi",
    title:
      "Sensitivity of Variables Affecting Urban Heat Island (UHI) Intensity to Different Levels of Transit Oriented Development (TOD) and Non-TOD Adjacent Areas in Jakarta City",
    authors: "Pranoto, G.N.A., Jatayu, A., Robbik, M.R.I., Hamdika, R., Nurjannah, N.",
    year: 2025,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "leveraging-land-value-capture-for-coastal-infrastructure",
    title:
      "Leveraging land value capture for coastal infrastructure financing: a case study of Kenjeran, Surabaya",
    authors: "Rahadyan, G.A., Wibowo, C.A.",
    year: 2025,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "identifying-users-needs-for-cycle-transit-facilities-in-mrt",
    title: "Identifying users' needs for cycle-transit facilities in MRT Jakarta",
    authors: "Ramadhanty, G.P.B., Nurlaela, S.",
    year: 2024,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "patterns-of-ride-sourcing-adoption-among-age-groups-in",
    title:
      "Patterns of ride sourcing adoption among age groups in three metropolitan cities of Indonesia",
    authors: "Khaitami, A.M., Nurlaela, S., Dharmowijoyo, D.B.E.",
    year: 2024,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "spatio-temporal-variations-of-ridehailing-use-on-campus",
    title:
      "Spatio Temporal Variations of Ridehailing Use on Campus Travel in Surabaya City, Indonesia",
    authors: "Handayeni, K.D.M.E., Rahma, N.Z.C., Anindya, A.I.",
    year: 2024,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "multi-scenario-location-allocation-in-decision-making-for",
    title:
      "Multi-scenario location-allocation in decision-making for improving educational facility services in Kupang City",
    authors: "Tallo, A.J., Alraouf, A.A., Wibowo, C.A.",
    year: 2024,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "identifikasi-pengaruh-tingkat-klaster-industri-terhadap",
    title:
      "Identifikasi Pengaruh Tingkat Klaster Industri Terhadap Konsentrasi Gas Emisi Di Kawasan Cikarang, Bekasi",
    authors: "Wibowo, C.A., Anindya, A.I., Widya, K.S., Santoso, E.B.",
    year: 2024,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "skenario-penyediaan-pos-pemadam-kebakaran-untuk-melayani",
    title:
      "Skenario Penyediaan Pos Pemadam Kebakaran Untuk Melayani Bangunan Tinggi di Kota Surabaya Berdasarkan Waktu Tanggap Ideal",
    authors: "Wibowo, C.A., Septanaya, I.D.M.F.",
    year: 2024,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "peningkatan-efektivitas-tindak-pemadaman-kebakaran-pada",
    title:
      "Peningkatan Efektivitas Tindak Pemadaman Kebakaran Pada Bangunan Tinggi di Kota Surabaya",
    authors: "Wibowo, C.A.",
    year: 2024,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "the-correlation-between-the-city-bus-accessibility-and",
    title:
      "The correlation between the city bus accessibility and transit ridership in Surabaya City, Indonesia",
    authors: "Handayeni, K.D.M.E., Firmansyah, F., Fathoni, S.",
    year: 2023,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "analisa-pengaruh-indeks-penutup-lahan-terhadap-suhu",
    title:
      "Analisa Pengaruh Indeks Penutup Lahan Terhadap Suhu Permukaan Tanah (Land Surface Temperature) Di Kota Surabaya",
    authors: "Wibowo, C.A.",
    year: 2023,
    venue: "",
    team: "sustainable-urban-transportation",
  },
  {
    slug: "assessment-of-the-perception-of-security-based-on-cpted-in",
    title: "Assessment of the Perception of Security Based on CPTED in Bundaran HI TOD",
    authors: "Nurlaela, S., Sugiono, S., Ismiralda, N.A., Navastara, A.M., Umilia, E., Koswara, A.Y.",
    year: 2021,
    venue: "TATALOKA",
    team: "sustainable-urban-transportation",
    doi: "10.14710/tataloka.23.4.536-552",
  },
  {
    slug: "implementation-of-non-pharmaceutical-intervention-of-covid",
    title:
      "Implementation of non-pharmaceutical intervention of COVID-19 in MRT through engineering controlled queue line using participatory ergonomics approach",
    authors: "Sugiono, S., Satrio N, W., Anggara, T., Nurlaela, S., Kusuma, A., Wicaksono, A., Lukodono, R.P.",
    year: 2021,
    venue: "EUREKA: Physics and Engineering",
    team: "sustainable-urban-transportation",
    doi: "10.21303/2461-4262.2021.001923",
  },
  {
    slug: "komparasi-tingkat-aksesibilitas-jaringan-transportasi",
    title:
      "Komparasi Tingkat Aksesibilitas Jaringan Transportasi Publik bagi Pekerja Ulang-Alik di Kawasan Surabaya Metropolitan Area",
    authors: "Shabrina, S., Nurlaela, S.",
    year: 2021,
    venue: "TATALOKA",
    team: "sustainable-urban-transportation",
    doi: "10.14710/tataloka.23.3.363-376",
  },
  {
    slug: "investigating-the-noise-barrier-impact-on-aerodynamics",
    title:
      "Investigating the Noise Barrier Impact on Aerodynamics Noise: Case Study at Jakarta MRT",
    authors: "Sugiono, S., Nurlaela, S., Kusuma, A., Wicaksono, A., Lukodono, R.P.",
    year: 2021,
    venue: "Advances in Intelligent Systems and Computing",
    team: "sustainable-urban-transportation",
    doi: "10.1007/978-981-15-4409-5_17",
  },
  {
    slug: "identification-scenario-of-dedicated-lane-for-suroboyo-bus",
    title:
      "Identification scenario of dedicated lane for Suroboyo Bus Purabaya - Rajawali route by Rapid Demand Assessment Method",
    authors: "Ekaningtiyas, N.R.F., Nurlaela, S.",
    year: 2020,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "sustainable-urban-transportation",
    doi: "10.1088/1755-1315/562/1/012021",
  },
  {
    slug: "the-school-bus-route-development-using-supply-demand",
    title:
      "The school bus route development using supply-demand competition based accessibility: Surabaya case study",
    authors: "Fakhrianto, I., Nurlaela, S.",
    year: 2020,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "sustainable-urban-transportation",
    doi: "10.1088/1755-1315/562/1/012032",
  },
  {
    slug: "qualitative-comparative-assessment-by-fsqca-for-transit",
    title:
      "Qualitative comparative assessment by fsQCA for Transit Oriented Development (TOD) area comparison",
    authors:
      "Nurlaela, S., Nadyla, A., Zuhdi, A.Y., Handayeni, K.D.M.E., Fakhrianto, I., Nurkhariza, A.R., Yusuf, L.",
    year: 2019,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "sustainable-urban-transportation",
    doi: "10.1088/1755-1315/340/1/012037",
  },
  {
    slug: "an-application-of-multinomial-logit-model-mnl-on-tourist",
    title: "An application of Multinomial Logit Model (MNL) on tourist destination choices",
    authors: "Nurlaela, S.",
    year: 2018,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "sustainable-urban-transportation",
    doi: "10.1088/1755-1315/202/1/012021",
  },
  {
    slug: "an-example-of-transport-policy-assessment-in-tresis-1-4-to",
    title:
      "An example of transport policy assessment in TRESIS 1.4 to reduce greenhouse gas emission in Sydney, Australia",
    authors: "Nurlaela, S.",
    year: 2018,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "sustainable-urban-transportation",
    doi: "10.1088/1755-1315/202/1/012071",
  },
  {
    slug: "exploring-distance-decay-pattern-of-public-transport",
    title:
      "Exploring distance decay pattern of public transport-induced agglomeration and its impacts on train ridership attraction",
    authors: "Nurlaela, S., Xia, J., Tuladhar, D., Lin, T., Lie, P.",
    year: 2018,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "sustainable-urban-transportation",
    doi: "10.1088/1755-1315/202/1/012051",
  },
  {
    slug: "modelling-toll-traffic-pattern-the-jagorawi-toll-case-study",
    title: "Modelling toll traffic pattern: The Jagorawi toll case study",
    authors: "Yosritzal, Nurlaela, S., Rizki, M., Taki, H.M.",
    year: 2018,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "sustainable-urban-transportation",
    doi: "10.1088/1755-1315/202/1/012022",
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
    coverImage: "/images/publications-dummy/data-map.jpg", // dummy, see file-top note
  },
  // Added 2026-09-20 — see this file's own note at the top of Team 01's
  // equivalent addition above for where these came from.
  {
    slug: "availability-assessment-of-sustainable-housing-materials",
    title:
      "Availability Assessment of Sustainable Housing Materials Using Remote Sensing and Logistic Regression",
    authors: "Susetyo, C., Firmansyah, F.",
    year: 2026,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    doi: "10.1088/1755-1315/1636/1/012007",
  },
  {
    slug: "uncovering-merging-and-joining-as-urban-expansion-processes",
    title: "Uncovering merging and joining as urban expansion processes",
    authors: "Pratomoatmojo, N.A., Koomen, E., de Groot, H.L.F.",
    year: 2026,
    venue: "",
    team: "spatial-data-science-ai",
  },
  {
    slug: "urban-expansion-patterns-and-metropolitan-development-a",
    title:
      "Urban Expansion Patterns and Metropolitan Development: A Comparative Study of Malang Raya and Surabaya Metropolitan Area",
    authors: "Firmansyah, F., Farras, M.H., Sihotang, R.Z.F., Kusuma, S.H.",
    year: 2025,
    venue: "",
    team: "spatial-data-science-ai",
  },
  {
    slug: "conservation-strategy-of-landuse-change-model-in-tropical",
    title:
      "Conservation Strategy of Landuse Change Model in Tropical Springwater Recharge Area (Case of: Umbulan Springwater, Pasuruan Regency)",
    authors: "Pamungkas, A., Jatayu, A., Ristanto, D.A., Cahyo, P.N.",
    year: 2025,
    venue: "",
    team: "spatial-data-science-ai",
  },
  {
    slug: "understanding-the-dynamics-of-evacuation-delays-a-study-of",
    title:
      "Understanding the dynamics of evacuation delays: A study of the 2021 Mount Semeru eruption through PLS-SEM analysis",
    authors: "Septanaya, I.D.M.F., Pamungkas, A., Jatayu, A., Syafitri, R.A.W.D., Widodo, A., Andrakayana, M.",
    year: 2025,
    venue: "",
    team: "spatial-data-science-ai",
  },
  {
    slug: "analysis-of-retail-store-preferences-in-surabaya-cbd",
    title:
      "Analysis of Retail Store Preferences in Surabaya CBD (Central Business District) Area Through the Perspective of Street Centrality",
    authors: "Hakim, M.A.A., Syafitri, R.A.W.D., Arisanti, K.N., Siregar, J.E.N., Ginting, J.A.G.R.",
    year: 2025,
    venue: "",
    team: "spatial-data-science-ai",
  },
  {
    slug: "sustainable-aquaculture-a-google-earth-engine-approach-to",
    title:
      "Sustainable Aquaculture: A Google Earth Engine Approach to Locating Solar-Powered Aeration Systems",
    authors: "Widaningrum, D.L., Chainando, N., Meilia, A., Nafi'Ah, R., Syafitri, R.A.W.D.",
    year: 2025,
    venue: "",
    team: "spatial-data-science-ai",
  },
  {
    slug: "measuring-levels-of-infrastructure-development-and-its",
    title:
      "Measuring Levels of Infrastructure Development and its Impact on Regional Growth - Insights from Indonesia",
    authors:
      "Jatayu, A., Zahara, S., Syafitri, R.A.W.D., Dafadhilah, S., Roosyanindhita, D.R., Sidiq, M.I., Priambodo, M.S.",
    year: 2024,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    doi: "10.1088/1755-1315/1353/1/012011",
  },
  {
    slug: "spatial-transformation-analysis-in-menganti-subdistrict-a",
    title:
      "Spatial Transformation Analysis in Menganti Subdistrict: A Study of Peri-Urban Area Typologies in the Face of Urban Expansion",
    authors: "Firmansyah, F., Jatayu, A., Imaduddin, B.R.",
    year: 2024,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    doi: "10.1088/1755-1315/1353/1/012039",
  },
  {
    slug: "analysis-of-the-potential-of-commercial-corridor-based-on",
    title:
      "Analysis of the Potential of Commercial Corridor Based on Consumer Movement Interactions in Central Jakarta",
    authors: "Syafitri, R.A.W.D., Trikurniawan, G.S., Rahma, D.A., Dhania, A.S., Nugraha, K.A.",
    year: 2024,
    venue: "",
    team: "spatial-data-science-ai",
  },
  {
    slug: "water-carrying-capacity-determination-based-on-ecosystem",
    title:
      "Water Carrying Capacity Determination based on Ecosystem Services in GKS Metropolitan Area",
    authors: "Firmansyah, F., Yusuf, M., Jatayu, A., Syafitri, R.A.W.D.",
    year: 2023,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    doi: "10.1088/1755-1315/1186/1/012004",
  },
  {
    slug: "determination-of-marine-conservation-areas-by-means-of",
    title:
      "Determination of Marine Conservation Areas by means of Satellite Imagery and Participatory Planning in Bawean Island, Gresik Regency, East Java",
    authors: "Firmansyah, F., Ariastita, P.G., Wirawan, I., Yusuf, M., Koswara, A.Y., Argarini, T.O.",
    year: 2023,
    venue: "",
    team: "spatial-data-science-ai",
  },
  {
    slug: "towards-a-sustainable-new-state-capital-ikn-sustainable",
    title:
      "Towards a sustainable new state capital (IKN): sustainable zoning plan formulation based on quantitative zoning approach",
    authors: "Ristanto, D.A., Jatayu, A., Sihotang, R.Z.F.",
    year: 2022,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    doi: "10.1088/1755-1315/1108/1/012051",
  },
  {
    slug: "application-of-sentinel-2a-sattelite-imagery-for-the",
    title:
      "Application of sentinel 2A sattelite imagery for the estimation of canopy cover spatial distribution at mangrove vegetation",
    authors: "Sulistiyono, N., Syafitri, R., Hudjimartsu, S.A.",
    year: 2022,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    doi: "10.1088/1755-1315/977/1/012092",
  },
  {
    slug: "spatial-interaction-modeling-for-assessment-and",
    title:
      "Spatial interaction modeling for assessment and determination Covid-19 handling policy in control of the pandemic spread between regions: A case study in the Surabaya Metropolitan Area",
    authors: "Santoso, E.B., Syafitri, R.A.W.D., Desiana, T.A.",
    year: 2022,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    doi: "10.1088/1755-1315/1015/1/012014",
  },
  {
    slug: "typology-of-manggarai-slum-area-the-strategy-of-resilient",
    title: "Typology of Manggarai slum area: The strategy of resilient city to fencing pandemic",
    authors: "Syafitri, R.A.W.D., Sukri, M.F., Hakim, D.N.",
    year: 2022,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    doi: "10.1088/1755-1315/1015/1/012013",
  },
  {
    slug: "modeling-the-effectiveness-of-the-psbb-based-on-covid-19",
    title: "Modeling the effectiveness of the PSBB based on COVID-19 case in Greater Surabaya Area",
    authors: "Santoso, E.B., Siswanto, V.K., Umilia, E., Syafitri, R.A.W.D., Desiana, T.A.",
    year: 2021,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    doi: "10.1088/1755-1315/778/1/012021",
  },
  {
    slug: "urban-form-factors-that-play-important-roles-on-uhi-spatial",
    title:
      "Urban Form Factors that Play Important Roles on UHI Spatial-Temporal Pattern: A Case Study of East Surabaya, Indonesia",
    authors: "Syafitri, R.A.W.D., Pamungkas, A., Santoso, E.B.",
    year: 2021,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    doi: "10.1088/1755-1315/764/1/012030",
  },
  {
    slug: "typology-of-socio-economic-characteristics-of",
    title:
      "Typology of socio-economic characteristics of municipalities and regencies in West Java Province",
    authors: "Yuwono, J., Jatayu, A., Aisharya, I.Y.",
    year: 2020,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    doi: "10.1088/1755-1315/562/1/012007",
  },
  {
    slug: "planning-for-compact-eco-cities-a-spatial-planning-to",
    title:
      "Planning for compact eco-cities: A spatial planning to prioritise green infrastructure development to mitigate urban heat island in Surabaya",
    authors: "Syafitri, R.A.W.D., Susetyo, C., Setiawan, R.P.",
    year: 2020,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "spatial-data-science-ai",
    doi: "10.1088/1755-1315/562/1/012019",
  },
  {
    slug: "a-brief-introduction-to-lensolver-as-linear-programming",
    title: "A brief introduction to LENSOLVER as linear programming application",
    authors: "Pratomoatmojo, N.A.",
    year: 2020,
    venue: "",
    team: "spatial-data-science-ai",
  },
  {
    slug: "a-conceptual-model-for-water-sensitive-city-in-surabaya",
    title: "A Conceptual Model for Water Sensitive City in Surabaya",
    authors: "Pamungkas, A., Tucunan, K.P., Navastara, A., Idajati, H., Pratomoatmojo, N.A.",
    year: 2017,
    venue: "",
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
    coverImage: "/images/publications-dummy/climate-map.jpg", // dummy, see file-top note
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
  // Added 2026-09-20 — see this file's own note at the top of Team 01's
  // equivalent addition above for where these came from.
  {
    slug: "determining-priority-programs-for-community-based",
    title:
      "Determining Priority Programs for Community-Based Infrastructure Provision and Management in the Fishing Settlement Area of Banjarkemuning Village, Sidoarjo Regency, Through a Participatory Approach",
    authors: "Firmansyah, F. et al.",
    year: 2025,
    venue: "",
    team: "decision-support-climate",
  },
  {
    slug: "the-effect-of-built-environment-on-carbon-emission-from",
    title:
      "The Effect of Built Environment on Carbon Emission from Travel Behavior in the City Center of Surabaya",
    authors: "Handayeni, K.D.M.E., Anindya, A.I.",
    year: 2024,
    venue: "",
    team: "decision-support-climate",
  },
  {
    slug: "how-carrying-capacity-and-water-storage-capacity-are-doing",
    title: "How Carrying Capacity and Water Storage Capacity Are Doing Right Now in Mojokerto City?",
    authors: "Idajati, H., Umilia, E., Firmansyah, F.",
    year: 2024,
    venue: "",
    team: "decision-support-climate",
  },
  {
    slug: "physical-vulnerability-of-surabaya-due-to-earthquake-based",
    title: "Physical Vulnerability of Surabaya due to Earthquake Based on Rapid Visual Screening",
    authors: "Habieb, A., Iranata, D., Nurlaela, S., Anggoro, R., Syafitri, R.",
    year: 2022,
    venue: "IOP Conference Series: Earth and Environmental Science",
    team: "decision-support-climate",
    doi: "10.1088/1755-1315/1091/1/012014",
  },
  {
    slug: "formulating-emergency-operation-posts-lesson-learned-from",
    title:
      "Formulating emergency operation posts: Lesson learned from Palu 2018 and Bantul 2006 Indonesian earthquake events",
    authors:
      "Pamungkas, A., Elisiyah, I., Sianturi, R.S., Kurniawati, U.F., Avila, B.E., Larasati, K.D., Siswanto, V.K., Widiyanto, I.",
    year: 2022,
    venue: "",
    team: "decision-support-climate",
  },
  {
    slug: "physical-characterization-manure-of-the-variation-adding",
    title:
      "Physical characterization manure of the variation adding earthworms L. lumbricus in the process of vermicomposting",
    authors: "Setiani, V., Siswanto, V.K., Nindyapuspa, A., Kurniawati, U.F., Kamilah, M.M.",
    year: 2021,
    venue: "",
    team: "decision-support-climate",
  },
  {
    slug: "ghg-inventory-on-energy-sector-using-mobile-application-in",
    title:
      "GHG Inventory on energy sector using mobile application in Surabaya City: Some challenges and opportunities",
    authors: "Handayeni, K.D.M.E., Kurniawati, U.F., Hafidz, I.",
    year: 2020,
    venue: "",
    team: "decision-support-climate",
  },
  {
    slug: "institutional-assessment-through-climate-and-disaster",
    title: "Institutional assessment through climate and disaster resilience initiative in Surabaya",
    authors: "Kurniawati, U.F., Susetyo, C., Setyasa, P.T.",
    year: 2020,
    venue: "",
    team: "decision-support-climate",
  },
  {
    slug: "analysis-of-spatial-parameter-formulation-in-the-effect-of",
    title:
      "Analysis of spatial parameter formulation in the effect of Green House Gas (GHG) emissions on food security in Surabaya",
    authors: "Kurniawati, U.F., Idajati, H.",
    year: 2019,
    venue: "",
    team: "decision-support-climate",
  },
  {
    slug: "shifting-the-focus-of-spatial-planning-in-indonesia-from",
    title: "Shifting the Focus of Spatial Planning in Indonesia; from General Planning to Detailed Planning",
    authors: "Susetyo, C. et al.",
    year: 2017,
    venue: "The Social Sciences",
    team: "decision-support-climate",
    doi: "10.3923/sscience.2017.555.560",
  },
  {
    slug: "spatial-service-of-petrol-filling-stations-in-surabaya-city",
    title: "Spatial Service of Petrol Filling Stations in Surabaya City",
    authors: "Susetyo, C.",
    year: 2016,
    venue: "Procedia - Social and Behavioral Sciences",
    team: "decision-support-climate",
    doi: "10.1016/j.sbspro.2016.06.052",
  },
];

export function publicationsByTeam(team: Publication["team"]): Publication[] {
  return publications.filter((p) => p.team === team);
}
