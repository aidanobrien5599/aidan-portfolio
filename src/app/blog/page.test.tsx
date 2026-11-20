import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import BlogIndexPage from "./page";

describe("BlogIndexPage", () => {
  it("lists every post with a link to its slug", () => {
    render(<BlogIndexPage />);
    const link = screen.getByRole("link", { name: /Fun stuff with self-hosted email servers/ });
    expect(link).toHaveAttribute("href", "/blog/self-hosted-email");
  });

  it("shows the post description", () => {
    render(<BlogIndexPage />);
    expect(screen.getByText(/Replacing \$300\/year in SaaS email/)).toBeInTheDocument();
  });
});
