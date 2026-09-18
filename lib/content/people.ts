import type { Person } from "./types";

// Real members and roles, per PRD section 3.1 / 3.2. No `photo` field yet:
// reuse permission for the ITS-hosted portraits is still an open item
// (PRD 3.5), so every member renders as an initials block (PRD 7.7) until
// that's confirmed and real files are brought into this repo — hotlinking
// to another site's media isn't the answer either way.
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
  },
  {
    slug: "nursakti-adhi-pratomoatmojo",
    name: "Nursakti Adhi Pratomoatmojo",
    role: "Lecturer",
    expertise: [
      "Urban Modelling and Scenario Testing",
      "Transportation Modelling",
      "Land Use Planning",
    ],
    teams: ["spatial-data-science-ai"],
    coordinatorOf: "spatial-data-science-ai",
    scholarId: "bxZEsvwAAAAJ",
  },
  {
    slug: "fendy-firmansyah",
    name: "Fendy Firmansyah",
    role: "Lecturer",
    expertise: ["Spatial Analysis and Machine Learning", "Spatial Data Analysis", "Remote Sensing"],
    teams: ["spatial-data-science-ai", "decision-support-climate"],
    scholarId: "n5SIxGUAAAAJ",
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
  },
  {
    slug: "caesario-arif-wibowo",
    name: "Caesario Arif Wibowo",
    role: "Lecturer",
    // Newest member — no public profile found yet (PRD 3.1 / 3.5). Left
    // empty rather than guessed at.
    expertise: [],
    teams: ["sustainable-urban-transportation"],
  },
];

export function getPerson(slug: string): Person | undefined {
  return people.find((p) => p.slug === slug);
}
