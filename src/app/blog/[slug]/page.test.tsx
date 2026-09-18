import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ArticlePage, { generateStaticParams, generateMetadata } from "./page";

// ArticlePage renders ArticleWindow standalone, which calls useRouter() from
// next/navigation — mocked for the same reason as in ArticleWindow.test.tsx.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  notFound: () => { throw new Error("notFound() called"); },
}));

describe("generateStaticParams", () => {
  it("returns one entry per post slug", () => {
    expect(generateStaticParams()).toEqual([{ slug: "self-hosted-email" }]);
  });
});

describe("generateMetadata", () => {
  it("returns the post's title and description for a known slug", async () => {
    const meta = await generateMetadata({ params: { slug: "self-hosted-email" } });
    expect(meta.title).toContain("SaaS is Dead to Me");
    expect(meta.description).toBe(
      "How I Set Up My Own Email Server for $22/Year"
    );
  });
});

describe("ArticlePage", () => {
  it("renders the real article content server-side (crawlable, not gated behind client state)", () => {
    render(<ArticlePage params={{ slug: "self-hosted-email" }} />);
    expect(screen.getAllByText(/SaaS is Dead to Me/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Mox/).length).toBeGreaterThan(0);
  });
});
