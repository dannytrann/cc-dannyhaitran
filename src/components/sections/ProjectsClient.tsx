"use client";

import { useState } from "react";
import { FilterBar } from "@/components/ui/FilterBar";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { projectCategories, projects } from "@/lib/constants";

export function ProjectsClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <>
      <FilterBar
        categories={projectCategories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-16 text-center text-text-muted">
          No projects in this category yet.
        </p>
      )}
    </>
  );
}
