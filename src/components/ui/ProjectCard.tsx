"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group block overflow-hidden border-2 border-shadow bg-surface shadow-brutal transition-all hover:-translate-y-1 hover:shadow-brutal-lg"
      >
        {/* macOS window chrome */}
        <div className="macos-dots border-b border-shadow/20 bg-lavender/10">
          <span />
          <span />
          <span />
        </div>

        {/* Image area */}
        <div className="relative aspect-video overflow-hidden bg-lavender/20">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              {project.category}
            </span>
            <span className="text-xs text-text-muted">{project.date}</span>
          </div>

          <h3 className="mb-2 font-heading text-xl italic text-text group-hover:text-accent transition-colors">
            {project.title}
          </h3>

          <p className="mb-3 line-clamp-2 text-sm text-text-muted">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded border border-lavender/50 px-2 py-0.5 text-xs text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
