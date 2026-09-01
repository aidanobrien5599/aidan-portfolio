import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("includes the homepage, the blog index, and every post", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://aidanpobrien.com/");
    expect(urls).toContain("https://aidanpobrien.com/blog");
    expect(urls).toContain("https://aidanpobrien.com/blog/self-hosted-email");
  });
});
