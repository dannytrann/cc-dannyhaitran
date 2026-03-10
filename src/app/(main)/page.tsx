import { HeroSection } from "@/components/sections/HeroSection";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutPreview />
      <FeaturedProjects />
      <ContactCTA />
    </>
  );
}
