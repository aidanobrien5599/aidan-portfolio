import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ArticleWindow } from "./ArticleWindow";

// ArticleWindow calls useRouter() from next/navigation (for the standalone
// close-button case). That hook throws "invariant expected app router to be
// mounted" when rendered outside a real Next app-router context, which plain
// @testing-library/react render() doesn't provide — so it must be mocked.
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const REAL_SLUG = "self-hosted-email";

describe("ArticleWindow", () => {
  it("renders the post title and content", () => {
    render(<ArticleWindow slug={REAL_SLUG} />);
    expect(screen.getAllByText(/SaaS is Dead to Me/).length).toBeGreaterThan(0);
    // "Mox" (the SMTP server product name) appears many times throughout the
    // real post content, so getByText would throw on multiple matches here.
    expect(screen.getAllByText(/Mox/).length).toBeGreaterThan(0);
  });

  it("returns null for an unknown slug", () => {
    const { container } = render(<ArticleWindow slug="does-not-exist" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders only two traffic-light dots (no minimize)", () => {
    const { container } = render(<ArticleWindow slug={REAL_SLUG} />);
    const dots = container.querySelectorAll('span[style*="border-radius: 50%"]');
    expect(dots.length).toBe(2);
  });

  it("calls onClose when the close dot is clicked in embedded mode", () => {
    const onClose = vi.fn();
    const { container } = render(<ArticleWindow slug={REAL_SLUG} onClose={onClose} />);
    const closeDot = container.querySelector('span[style*="border-radius: 50%"]');
    fireEvent.click(closeDot!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onFocus when clicked", () => {
    const onFocus = vi.fn();
    const { container } = render(<ArticleWindow slug={REAL_SLUG} onFocus={onFocus} />);
    fireEvent.mouseDown(container.firstChild!);
    expect(onFocus).toHaveBeenCalled();
  });
});
