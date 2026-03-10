import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button3D } from "@/components/ui/Button3D";
import { LinkHoverFill } from "@/components/ui/LinkHoverFill";
import { projects } from "@/lib/constants";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <Container narrow>
      <LinkHoverFill href="/projects" className="mb-8 inline-block text-sm text-text-muted">
        ← Back to Projects
      </LinkHoverFill>

      <div className="mb-4 flex items-center gap-3">
        <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
          {project.category}
        </span>
        <span className="text-sm text-text-muted">{project.date}</span>
      </div>

      <h1
        className="mb-6 font-heading italic text-text"
        style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
      >
        {project.title}
      </h1>

      {/* Project screenshot */}
      <div className="relative mb-8 aspect-video border-2 border-shadow shadow-brutal overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>

      <div className="prose-container mb-10">
        <p className="text-text-muted" style={{ lineHeight: 1.8 }}>
          {project.description}
        </p>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded border border-lavender/50 bg-lavender/10 px-3 py-1 text-sm text-text"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
            <Button3D variant="primary">View Live</Button3D>
          </a>
        )}
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
            <Button3D variant="outline">Source Code</Button3D>
          </a>
        )}
      </div>
    </Container>
  );
}
