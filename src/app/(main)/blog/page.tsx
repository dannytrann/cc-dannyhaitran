import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { blogPosts } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on web development, creative coding, and accessibility.",
};

export default function BlogPage() {
  return (
    <Container narrow>
      <SectionHeading subtitle="Thoughts on web development, creative coding, and accessibility">
        Blog
      </SectionHeading>

      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block border-2 border-shadow bg-surface p-6 shadow-brutal-sm transition-all hover:-translate-y-0.5 hover:shadow-brutal"
            >
              <div className="mb-2 flex items-center gap-3 text-sm text-text-muted">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                {post.readingTime && <span>· {post.readingTime}</span>}
              </div>

              <h2 className="mb-2 font-heading text-xl italic text-text group-hover:text-accent transition-colors">
                {post.title}
              </h2>

              <p className="mb-3 text-sm text-text-muted">{post.excerpt}</p>

              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded border border-lavender/50 px-2 py-0.5 text-xs text-text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </Container>
  );
}
