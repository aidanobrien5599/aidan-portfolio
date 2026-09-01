import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts } from "@/constants/blog";
import { ArticleWindow } from "@/components/desktop/ArticleWindow";

interface PageParams {
  params: { slug: string };
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageParams): Metadata {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Aidan O'Brien`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default function ArticlePage({ params }: PageParams) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        background: "var(--color-bg)",
        overflow: "hidden",
      }}
    >
      <ArticleWindow slug={params.slug} standalone />
    </div>
  );
}
