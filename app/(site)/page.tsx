import { Hero } from "@/components/hero/Hero";
import { HeroBackdrop } from "@/components/hero/HeroBackdrop";
import { PublicationsShowcase } from "@/components/sections/PublicationsShowcase";
import { Project } from "@/components/sections/Project";
import { Roadmap } from "@/components/sections/Roadmap";
import { Team } from "@/components/sections/Team";

export default function Home() {
  return (
    <main>
      <div className="relative overflow-hidden">
        <HeroBackdrop />
        <Hero />
        <PublicationsShowcase />
      </div>
      <Project />
      <Roadmap />
      <Team />
    </main>
  );
}
