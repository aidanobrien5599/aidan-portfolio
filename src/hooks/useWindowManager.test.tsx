import { renderHook, render, screen, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useWindowManager } from "./useWindowManager";
import type { WindowState } from "@/constants/portfolio";

// Renders the style produced during an actual React render/commit, not a
// fresh post-effect call to getWindowStyle() — the two can legitimately
// differ (see the tests below), and only the former reflects what a real
// browser paints.
function TestWindow(props: {
  isMobile: boolean;
  mounted: boolean;
  initialState?: WindowState;
}) {
  const wm = useWindowManager({ defaultWidth: 680, ...props });
  return <div data-testid="win" style={wm.getWindowStyle()} />;
}

describe("useWindowManager", () => {
  it("defaults offset to {0,0} when initialOffset is not provided", () => {
    const { result } = renderHook(() =>
      useWindowManager({ defaultWidth: 680, isMobile: false, mounted: true })
    );
    expect(result.current.offset).toEqual({ x: 0, y: 0 });
  });

  it("uses initialOffset as the starting offset when provided", () => {
    const { result } = renderHook(() =>
      useWindowManager({
        defaultWidth: 680,
        isMobile: false,
        mounted: true,
        initialOffset: { x: 28, y: 56 },
      })
    );
    expect(result.current.offset).toEqual({ x: 28, y: 56 });
  });

  it("does not play the windowOpen animation on the render that first mounts already maximized", () => {
    render(<TestWindow isMobile={false} mounted initialState="maximized" />);
    expect(screen.getByTestId("win").style.animation).toBe("none");
  });

  it("plays the windowOpen animation when maximize() is called after mount", () => {
    const { result, rerender } = renderHook(() =>
      useWindowManager({ defaultWidth: 680, isMobile: false, mounted: true, initialState: "open" })
    );
    expect(result.current.getWindowStyle().animation).toBeUndefined();

    act(() => {
      result.current.maximize();
    });
    rerender();

    expect(result.current.getWindowStyle().animation).toBe("windowOpen 0.25s ease");
  });
});
