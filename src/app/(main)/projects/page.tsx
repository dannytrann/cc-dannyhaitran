import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectsClient } from "@/components/sections/ProjectsClient";

export const metadata: Metadata = {
  title: "Projects | Campbell River Website Design Portfolio",
  description:
    "Web design and development portfolio by Danny Tran. Websites built for local businesses across Campbell River and Vancouver Island, BC.",
  alternates: { canonical: "https://dannytran.dev/projects" },
};

export default function ProjectsPage() {
  return (
    <Container>
      <SectionHeading
        as="h1"
        subtitle="Websites built for local businesses across Vancouver Island"
      >
        Projects
      </SectionHeading>
      <ProjectsClient />
    </Container>
  );
}
