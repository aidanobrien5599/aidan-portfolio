import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ArticleWindow } from "./ArticleWindow";

// ArticleWindow calls useRouter() from next/navigation (for the standalone
// close-button and un-maximize-reveals-the-desktop cases). That hook throws
// "invariant expected app router to be mounted" when rendered outside a real
// Next app-router context, which plain @testing-library/react render()
// doesn't provide — so it must be mocked. Exposed as a shared spy so tests
// can assert on what path it was pushed to.
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const REAL_SLUG = "self-hosted-email";

describe("ArticleWindow", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

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

  it("renders both dots in standalone mode too — same title bar either way", () => {
    const { container } = render(<ArticleWindow slug={REAL_SLUG} standalone />);
    const dots = container.querySelectorAll('span[style*="border-radius: 50%"]');
    expect(dots.length).toBe(2);
  });

  it("clicking the maximize dot in standalone mode navigates to reveal the real desktop with this article open, instead of toggling local state", () => {
    const { container } = render(<ArticleWindow slug={REAL_SLUG} standalone />);
    const dots = container.querySelectorAll('span[style*="border-radius: 50%"]');
    const greenDot = dots[1];
    fireEvent.click(greenDot);
    expect(mockPush).toHaveBeenCalledWith(`/?article=${REAL_SLUG}`);
    // Still full-screen locally (borderRadius: 0 / position: fixed only apply
    // while maximized) — the standalone window itself never actually
    // un-maximizes; the navigation is what reveals the desktop instead.
    expect(container.firstElementChild?.getAttribute("style")).toContain("border-radius: 0;");
    expect(container.firstElementChild?.getAttribute("style")).toContain("position: fixed;");
  });

  it("double-clicking the titlebar in standalone mode also navigates to reveal the desktop", () => {
    const { container } = render(<ArticleWindow slug={REAL_SLUG} standalone />);
    const closeDot = container.querySelector('span[style*="border-radius: 50%"]') as HTMLElement;
    const titlebar = closeDot.parentElement as HTMLElement;
    fireEvent.doubleClick(titlebar);
    expect(mockPush).toHaveBeenCalledWith(`/?article=${REAL_SLUG}`);
  });

  it("double-clicking the titlebar in embedded mode still maximizes locally, not a navigation", () => {
    const { container } = render(<ArticleWindow slug={REAL_SLUG} />);
    const closeDot = container.querySelector('span[style*="border-radius: 50%"]') as HTMLElement;
    const titlebar = closeDot.parentElement as HTMLElement;
    fireEvent.doubleClick(titlebar);
    expect(mockPush).not.toHaveBeenCalled();
  });
});
