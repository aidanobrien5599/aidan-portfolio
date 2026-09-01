import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BlogFolderWindow } from "./BlogFolderWindow";

function makeWm() {
  return {
    state: "open" as const,
    setState: vi.fn(),
    offset: { x: 0, y: 0 },
    ref: { current: null },
    minimize: vi.fn(() => "minimized"),
    maximize: vi.fn(),
    restore: vi.fn(),
    close: vi.fn(),
    open: vi.fn(),
    resetPosition: vi.fn(),
    handleDragStart: vi.fn(),
    getWindowStyle: vi.fn(() => ({})),
  };
}

describe("BlogFolderWindow", () => {
  it("lists posts by title, not their content", () => {
    render(
      <BlogFolderWindow wm={makeWm()} onFocus={vi.fn()} onBounce={vi.fn()} activeZIndex={10} onOpenArticle={vi.fn()} onClose={vi.fn()} />
    );
    expect(screen.getByText(/SaaS is Dead to Me/)).toBeInTheDocument();
    expect(screen.queryByText(/How I Pulled This Off/)).not.toBeInTheDocument();
  });

  it("calls onOpenArticle with the slug when a post row is clicked, without changing local content", () => {
    const onOpenArticle = vi.fn();
    render(
      <BlogFolderWindow wm={makeWm()} onFocus={vi.fn()} onBounce={vi.fn()} activeZIndex={10} onOpenArticle={onOpenArticle} onClose={vi.fn()} />
    );
    // Same reasoning as above: once the article window is open, its title also
    // matches /SaaS is Dead to Me/ (rendered again in the ArticleWindow's <h1>),
    // so index 0 (the folder's row, which is what's wired to onOpenArticle) is
    // the one to click.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[0]);
    expect(onOpenArticle).toHaveBeenCalledWith("self-hosted-email");
    expect(screen.getByText(/SaaS is Dead to Me/)).toBeInTheDocument();
  });

  it("has no back button (no inline article view)", () => {
    render(
      <BlogFolderWindow wm={makeWm()} onFocus={vi.fn()} onBounce={vi.fn()} activeZIndex={10} onOpenArticle={vi.fn()} onClose={vi.fn()} />
    );
    expect(screen.queryByText(/all posts/)).not.toBeInTheDocument();
  });
});
