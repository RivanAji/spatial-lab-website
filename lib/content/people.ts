import type { Person } from "./types";

// Real members and roles, per PRD section 3.1 / 3.2. Most still have no
// `photo`: reuse permission for the ITS-hosted portraits is still an
// open item (PRD 3.5), so those members render as an initials block
// (PRD 7.7) until that's confirmed and real files are brought into this
// repo — hotlinking to another site's media isn't the answer either
// way. Nursakti Adhi Pratomoatmojo is the first exception: the site
// owner sent his portrait directly in this conversation (2026-09-20,
// for the new team detail page), saved to public/images/people/.
export const people: Person[] = [
  {
    slug: "siti-nurlaela",
    name: "Siti Nurlaela",
    role: "Head of Laboratory",
    expertise: [
      "Urban Transportation Management",
      "Spatial Analysis",
      "Transportation Management and Modelling",
    ],
    teams: ["sustainable-urban-transportation", "decision-support-climate"],
    coordinatorOf: "sustainable-urban-transportation",
    scholarId: "BYOW-fMAAAAJ",
    profileUrl: "https://scholar.its.ac.id/en/persons/siti-nurlaela/",
    // Seen on her Scopus author page (scopus.com/authid/detail.uri?
    // authorId=57430713400), 2026-09-20; see the orcidId field's own
    // comment in lib/content/types.ts. The rest of this file's orcidId
    // values came directly from the site owner the same day.
    orcidId: "0000-0002-7562-6548",
  },
  {
    slug: "cahyono-susetyo",
    name: "Cahyono Susetyo",
    role: "Lecturer",
    expertise: [
      "Evaluation and Method Development in Urban and Regional Planning",
      "Urban Modelling and Scenario Testing",
      "Spatial Engineering",
    ],
    teams: ["decision-support-climate"],
    coordinatorOf: "decision-support-climate",
    scholarId: "NoF6s4gAAAAJ",
    profileUrl: "https://scholar.its.ac.id/en/persons/cahyono-susetyo/",
    orcidId: "0000-0003-0553-9761",
  },
  {
    slug: "ketut-dewi-martha-erli-handayeni",
    name: "Ketut Dewi Martha Erli Handayeni",
    role: "Lecturer",
    expertise: [
      "Urban Transportation Planning and Modelling",
      "Urban Infrastructure and Transportation Planning",
      "Transportation Modelling",
    ],
    teams: ["sustainable-urban-transportation", "decision-support-climate"],
    scholarId: "SI7zbOsAAAAJ",
    profileUrl: "https://scholar.its.ac.id/en/persons/ketut-dewi-martha-erli-handayeni/",
  },
  {
    slug: "nursakti-adhi-pratomoatmojo",
    name: "Nursakti Adhi Pratomoatmojo",
    role: "Lecturer",
    photo: "/images/people/nursakti-adhi-pratomoatmojo.webp",
    expertise: [
      "Urban Modelling and Scenario Testing",
      "Transportation Modelling",
      "Land Use Planning",
    ],
    teams: ["spatial-data-science-ai"],
    coordinatorOf: "spatial-data-science-ai",
    scholarId: "bxZEsvwAAAAJ",
    profileUrl: "https://scholar.its.ac.id/en/persons/nursakti-adhi-pratomoatmojo/",
  },
  {
    slug: "fendy-firmansyah",
    name: "Fendy Firmansyah",
    role: "Lecturer",
    expertise: ["Spatial Analysis and Machine Learning", "Spatial Data Analysis", "Remote Sensing"],
    teams: ["spatial-data-science-ai", "decision-support-climate"],
    scholarId: "n5SIxGUAAAAJ",
    profileUrl: "https://scholar.its.ac.id/en/persons/fendy-firmansyah-2/",
  },
  {
    slug: "ummi-fadlilah-kurniawati",
    name: "Ummi Fadlilah Kurniawati",
    role: "Lecturer",
    expertise: [
      "Climate Change and Sustainable Modeling",
      "Risk Management (Climate Change)",
      "Environmental Management",
    ],
    teams: ["decision-support-climate"],
    scholarId: "qB5qFscAAAAJ",
    profileUrl: "https://scholar.its.ac.id/en/persons/ummi-fadlilah-kurniawati/",
  },
  {
    slug: "anoraga-jatayu",
    name: "Anoraga Jatayu",
    role: "Lecturer",
    expertise: [
      "Spatial Statistics and Modeling",
      "Sustainable Urban Form Modeling",
      "Spatial Econometrics",
    ],
    teams: ["sustainable-urban-transportation", "spatial-data-science-ai"],
    profileUrl: "https://scholar.its.ac.id/en/persons/anoraga-jatayu/",
    orcidId: "0000-0002-5825-3823",
  },
  {
    slug: "rivan-aji-wahyu-dyan-syafitri",
    name: "Rivan Aji Wahyu Dyan Syafitri",
    role: "Lecturer",
    expertise: [
      "Spatial Data Science",
      "Spatial Data Mining",
      "Spatial Data Infrastructure",
      "Spatial Data-Driven Transport Analysis",
    ],
    teams: ["spatial-data-science-ai"],
    profileUrl: "https://scholar.its.ac.id/en/persons/rivan-aji-wahyu-dyan-syafitri/",
    orcidId: "0009-0006-3825-1560",
  },
  {
    slug: "caesario-arif-wibowo",
    name: "Caesario Arif Wibowo",
    role: "Lecturer",
    // Newest member — no ITS Scholar profile yet (PRD 3.1 / 3.5), but
    // the site owner gave a Google Scholar citations link directly
    // (2026-09-20), unlike everyone else's ITS Scholar links above.
    expertise: [],
    teams: ["sustainable-urban-transportation"],
    profileUrl: "https://scholar.google.com/citations?user=Ri83cGgAAAAJ&hl=en",
    orcidId: "0009-0004-5080-2068",
  },
];

export function getPerson(slug: string): Person | undefined {
  return people.find((p) => p.slug === slug);
}
