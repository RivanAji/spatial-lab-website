import type { Project } from "./types";

// Leave unknown project metadata unset rather than guessing.
export const projects: Project[] = [
  {
    slug: "landusesim",
    category: "Software",
    name: "LanduseSim",
    description: "LandUse Simulation Software",
    year: 2013,
    developer: "Nursakti Adhi Pratomoatmojo",
  },
  {
    slug: "raneus",
    category: "Software",
    name: "RANEUS",
    description: "Research Agent for Naratif Evaluation of Urban Studies",
    year: 2025,
    developer: "Nursakti Adhi Pratomoatmojo",
  },
  {
    slug: "digital-education-access-pwd",
    category: "Study",
    name: "Designing a multiscale support system for digital education to improve higher education access for people with disabilities (PWD) at Institut Teknologi Sepuluh Nopember Surabaya",
    year: 2025,
    developer: "Siti Nurlaela, Anoraga Jatayu",
  },
  {
    slug: "baseline-energy-consumption-surabaya",
    category: "Study",
    name: "Baseline Energy Consumption in the Building Sector (Government, Commercial, and Residential) in Surabaya City",
    year: 2025,
    developer: "Anoraga Jatayu",
  },
  {
    slug: "energy-access-quality-ntt",
    category: "Study",
    name: "Mapping Energy Access Quality and Productive Use of Electricity Potential in East Nusa Tenggara",
    developer: "Rivan Aji Wahyu Dyan Syafitri",
  },
  {
    slug: "mrt-surabaya-metropolitan",
    category: "Study",
    name: "Mass Rapid Transit (MRT) Study for Surabaya Metropolitan Area",
    developer: "Siti Nurlaela, Anoraga Jatayu, Caesario Arif Wibowo",
  },
  {
    slug: "urbanscad",
    category: "Software",
    name: "UrbanSCAD",
    description: "Urban Simulation Computer Aided Design",
    year: 2019,
    developer: "Nursakti Adhi Pratomoatmojo",
  },
  {
    slug: "gravigis",
    category: "Software",
    name: "GraviGIS",
    description: "Gravity Modelling based on GIS",
    year: 2019,
    developer: "Nursakti Adhi Pratomoatmojo",
  },
  {
    slug: "urbanrvm",
    category: "Software",
    name: "UrbanRVM",
    description: "Urban Run Off Modelling Simulation",
    year: 2020,
    developer: "Nursakti Adhi Pratomoatmojo",
  },
  {
    slug: "urbangvi",
    category: "Software",
    name: "UrbanGVI",
    description: "Urban Greenness Visibility Index",
    year: 2020,
    developer: "Nursakti Adhi Pratomoatmojo",
  },
  {
    slug: "ai-larasati",
    category: "Software",
    name: "AI Larasati",
    developer: "Nursakti Adhi Pratomoatmojo, Rivan Aji Wahyu Dyan Syafitri",
  },
];

// Developer is free text, so team membership uses known member names.
export function projectsForTeam(teamMemberNames: string[]): Project[] {
  return projects.filter(
    (p) => p.developer && teamMemberNames.some((name) => p.developer!.includes(name)),
  );
}
