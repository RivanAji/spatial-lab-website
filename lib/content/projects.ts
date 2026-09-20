import type { Project } from "./types";

// Replaced the original 6-name-only list (2026-09-20, site owner's fuller
// list): six of these are short software/tool names with an expansion and
// a year (name + description + year, same shape the original six used
// once years arrived); four are long-title studies with no separate short
// name, so `name` carries the full title and `description` is left unset.
// Two of those four (#5, #6 below) genuinely have no known year yet — left
// unset rather than guessed, per PRD 6.6's no-invented-content rule; the
// year filter in Project.tsx only lists years that actually exist.
//
// #3's title arrived in the site owner's message in casual all-lowercase
// typing ("designing a multiscale support system... at institut teknologi
// sepuluh nopember surabaya") — normalized to sentence case here since
// that was clearly just fast typing, not a deliberate style choice; #4-6
// arrived already properly capitalized and are kept verbatim.
export const projects: Project[] = [
  {
    slug: "landusesim",
    name: "LanduseSim",
    description: "LandUse Simulation Software",
    year: 2013,
  },
  {
    slug: "raneus",
    name: "RANEUS",
    description: "Research Agent for Naratif Evaluation of Urban Studies",
    year: 2025,
  },
  {
    slug: "digital-education-access-pwd",
    name: "Designing a multiscale support system for digital education to improve higher education access for people with disabilities (PWD) at Institut Teknologi Sepuluh Nopember Surabaya",
    year: 2025,
  },
  {
    slug: "baseline-energy-consumption-surabaya",
    name: "Baseline Energy Consumption in the Building Sector (Government, Commercial, and Residential) in Surabaya City",
    year: 2025,
  },
  {
    slug: "energy-access-quality-ntt",
    name: "Mapping Energy Access Quality and Productive Use of Electricity Potential in East Nusa Tenggara",
  },
  {
    slug: "mrt-surabaya-metropolitan",
    name: "Mass Rapid Transit (MRT) Study for Surabaya Metropolitan Area",
  },
  {
    slug: "urbanscad",
    name: "UrbanSCAD",
    description: "Urban Simulation Computer Aided Design",
    year: 2019,
  },
  {
    slug: "gravigis",
    name: "GraviGIS",
    description: "Gravity Modelling based on GIS",
    year: 2019,
  },
  {
    slug: "urbanrvm",
    name: "UrbanRVM",
    description: "Urban Run Off Modelling Simulation",
    year: 2020,
  },
  {
    slug: "urbangvi",
    name: "UrbanGVI",
    description: "Urban Greenness Visibility Index",
    year: 2020,
  },
];
