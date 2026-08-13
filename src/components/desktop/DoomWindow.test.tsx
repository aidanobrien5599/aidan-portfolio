import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DoomWindow } from "./DoomWindow";

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

describe("DoomWindow", () => {
  it("renders DOOM in the title bar", () => {
    render(
      <DoomWindow
        wm={makeWm()}
        onFocus={vi.fn()}
        onBounce={vi.fn()}
        activeZIndex={100}
      />
    );
    expect(screen.getByText("DOOM")).toBeInTheDocument();
  });

  it("shows loading text initially", () => {
    render(
      <DoomWindow
        wm={makeWm()}
        onFocus={vi.fn()}
        onBounce={vi.fn()}
        activeZIndex={100}
      />
    );
    expect(screen.getByText("Loading DOOM...")).toBeInTheDocument();
  });

  it("renders the traffic light dots in the title bar", () => {
    const { container } = render(
      <DoomWindow
        wm={makeWm()}
        onFocus={vi.fn()}
        onBounce={vi.fn()}
        activeZIndex={100}
      />
    );
    const dots = container.querySelectorAll('span[style*="border-radius: 50%"]');
    expect(dots.length).toBe(3);
  });
});
