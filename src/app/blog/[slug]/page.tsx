import { notFound } from "next/navigation";
import { posts } from "@/constants/blog";
import type { Metadata } from "next";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} — Aidan O'Brien`,
    description: post.description,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-body)",
        fontFamily: "var(--font-mono)",
        fontSize: 14,
        lineHeight: 1.8,
        overflowY: "auto",
      }}
    >
      <article
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        <nav style={{ marginBottom: 32 }}>
          <a
            href="/"
            style={{
              color: "var(--color-accent)",
              textDecoration: "none",
              fontSize: 13,
            }}
          >
            &larr; back
          </a>
        </nav>

        <header style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--color-heading)",
              lineHeight: 1.4,
              marginBottom: 8,
            }}
          >
            {post.title}
          </h1>
          <time
            style={{
              fontSize: 12,
              color: "var(--color-muted)",
            }}
          >
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </header>

        <div className="blog-content">{post.content}</div>

        <footer
          style={{
            paddingTop: 24,
            marginTop: 48,
            borderTop: "1px solid var(--color-border)",
            fontSize: 11,
            color: "var(--color-muted)",
          }}
        >
          <a
            href="/"
            style={{ color: "var(--color-accent)", textDecoration: "none" }}
          >
            Aidan O&apos;Brien
          </a>{" "}
          &middot; {new Date().getFullYear()}
        </footer>
      </article>
    </div>
  );
}
