import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FolderIcon } from "./FolderIcon";

describe("FolderIcon", () => {
  it("renders an svg with the two-tone folder fills", () => {
    const { container } = render(<FolderIcon />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(container.querySelectorAll('[fill="#d9a441"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('[fill="#f2c14e"]').length).toBeGreaterThan(0);
  });

  it("respects a custom size", () => {
    const { container } = render(<FolderIcon size={40} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "40");
    expect(svg).toHaveAttribute("height", "40");
  });
});
