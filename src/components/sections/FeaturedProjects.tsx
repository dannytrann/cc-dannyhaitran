"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projects } from "@/lib/constants";

export function FeaturedProjects() {
  return (
    <section className="bg-lavender/5 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading subtitle="A selection of recent work">
          Projects
        </SectionHeading>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
