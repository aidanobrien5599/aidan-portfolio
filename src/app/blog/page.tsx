import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/constants/blog";

export const metadata: Metadata = {
  title: "Blog — Aidan O'Brien",
  description: "Writing from Aidan O'Brien.",
};

export default function BlogIndexPage() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "64px 24px", fontFamily: "var(--font-mono)" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--color-heading)", marginBottom: 24 }}>
        Blog
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--color-heading)" }}>
              {post.title}
            </div>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 4 }}>
              {post.description} &middot;{" "}
              {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <p style={{ color: "var(--color-muted)", fontSize: 13 }}>Nothing here yet.</p>
        )}
      </div>
      <Link href="/" style={{ display: "inline-block", marginTop: 40, fontSize: 12, color: "var(--color-accent)" }}>
        &larr; Back home
      </Link>
    </main>
  );
}
