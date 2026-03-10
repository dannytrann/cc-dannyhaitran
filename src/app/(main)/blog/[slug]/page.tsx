import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { LinkHoverFill } from "@/components/ui/LinkHoverFill";
import { blogPosts } from "@/lib/constants";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <Container narrow>
      <LinkHoverFill href="/blog" className="mb-8 inline-block text-sm text-text-muted">
        ← Back to Blog
      </LinkHoverFill>

      <article>
        <div className="mb-4 flex items-center gap-3 text-sm text-text-muted">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.readingTime && <span>· {post.readingTime}</span>}
        </div>

        <h1
          className="mb-8 font-heading italic text-text"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          {post.title}
        </h1>

        <div className="mb-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-lavender/50 bg-lavender/10 px-3 py-1 text-sm text-text"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Article content placeholder — would be MDX in production */}
        <div className="space-y-6 text-text-muted" style={{ lineHeight: 1.8 }}>
          <p>
            {post.excerpt}
          </p>
          <p>
            This is a placeholder for the full blog post content. In a production
            setup, this would be rendered from MDX files using next-mdx-remote,
            with full support for code blocks, images, and custom components.
          </p>
        </div>
      </article>
    </Container>
  );
}
