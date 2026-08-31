import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useWindowManager } from "./useWindowManager";

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
});
