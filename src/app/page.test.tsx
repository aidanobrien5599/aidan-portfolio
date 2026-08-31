import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./page";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  Object.defineProperty(window, "innerWidth", { writable: true, value: 1024 });
});

afterEach(() => {
  vi.useRealTimers();
});

function renderAndMount() {
  const result = render(<Home />);
  vi.advanceTimersByTime(0);
  return result;
}

// ─── Rendering basics ───────────────────────────────────────────────

describe("Rendering basics", () => {
  it("renders the page with name", () => {
    renderAndMount();
    const names = screen.getAllByText(/Aidan O'Brien/);
    expect(names.length).toBeGreaterThan(0);
  });

  it("shows the tagline", () => {
    renderAndMount();
    expect(screen.getByText(/Software engineer\. CS @ UW-Madison\./)).toBeInTheDocument();
  });

  it("shows all work entries", () => {
    renderAndMount();
    expect(screen.getAllByText(/Netflix/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Intelligible/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CargoLabs/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Collectwise/).length).toBeGreaterThan(0);
  });

  it("shows work titles", () => {
    renderAndMount();
    expect(screen.getAllByText(/Software Engineer Intern/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Founding Engineer/).length).toBeGreaterThan(0);
  });

  it("shows work years", () => {
    renderAndMount();
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("2025-2026")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("shows work notes", () => {
    renderAndMount();
    expect(screen.getByText("Incoming in May")).toBeInTheDocument();
    expect(screen.getByText("YC F'24")).toBeInTheDocument();
  });

  it("shows projects", () => {
    renderAndMount();
    expect(screen.getByText("BadgerBase")).toBeInTheDocument();
    expect(screen.getByText("March Madness Predictor")).toBeInTheDocument();
  });

  it("shows project descriptions", () => {
    renderAndMount();
    expect(screen.getByText(/course discovery tool/)).toBeInTheDocument();
    expect(screen.getByText(/crack March Madness/)).toBeInTheDocument();
  });

  it("shows contact email", () => {
    renderAndMount();
    expect(screen.getByText("aob55992@gmail.com")).toBeInTheDocument();
  });

  it("shows contact links", () => {
    renderAndMount();
    const contactLinks = screen.getAllByText("GitHub");
    expect(contactLinks.length).toBeGreaterThan(0);
    expect(screen.getAllByText("LinkedIn").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Chess\.com/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Resume").length).toBeGreaterThan(0);
  });

  it("shows the headshot image", () => {
    renderAndMount();
    const img = screen.getByAltText("Aidan O'Brien");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/images/headshot.jpeg");
  });

  it("shows the bio text", () => {
    renderAndMount();
    expect(screen.getByText(/incoming software engineer intern/)).toBeInTheDocument();
    expect(screen.getByText(/BJJ/)).toBeInTheDocument();
  });

  it("shows the writing section placeholder", () => {
    renderAndMount();
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
  });

  it("shows the footer", () => {
    renderAndMount();
    expect(screen.getByText(/Aidan O'Brien v3/)).toBeInTheDocument();
  });
});

// ─── Section component ──────────────────────────────────────────────

describe("Section component", () => {
  it("renders section titles with $ prefix", () => {
    renderAndMount();
    const workHeading = screen.getByRole("heading", { name: /Work/ });
    expect(workHeading).toBeInTheDocument();
    expect(workHeading.textContent).toContain("$");

    const projectsHeading = screen.getByRole("heading", { name: /Projects/ });
    expect(projectsHeading).toBeInTheDocument();

    const writingHeading = screen.getByRole("heading", { name: /Writing/ });
    expect(writingHeading).toBeInTheDocument();

    const contactHeading = screen.getByRole("heading", { name: /Contact/ });
    expect(contactHeading).toBeInTheDocument();
  });

  it("renders all expected sections", () => {
    renderAndMount();
    const headings = screen.getAllByRole("heading");
    const headingTexts = headings.map((h) => h.textContent?.trim());
    expect(headingTexts).toEqual(
      expect.arrayContaining(["$ Work", "$ Projects", "$ Writing", "$ Contact"])
    );
  });
});

// ─── Terminal window titlebar ───────────────────────────────────────

describe("Terminal window titlebar", () => {
  it("shows the titlebar text", () => {
    renderAndMount();
    expect(screen.getByText(/aidan-obrien/)).toBeInTheDocument();
    expect(screen.getByText("portfolio")).toBeInTheDocument();
  });

  it("has three traffic light dots", () => {
    renderAndMount();
    const terminalTitlebar = screen.getByText(/aidan-obrien/).closest("div")!;
    const dots = terminalTitlebar.querySelectorAll("span");
    const coloredDots = Array.from(dots).filter((d) => {
      const bg = d.style.background;
      return bg.includes("dot-r") || bg.includes("dot-y") || bg.includes("dot-g");
    });
    expect(coloredDots.length).toBe(3);
  });
});

// ─── Terminal window controls ───────────────────────────────────────

describe("Terminal window controls", () => {
  function getTerminalWindow() {
    const titlebar = screen.getByText(/aidan-obrien/).closest("div")!;
    return titlebar.parentElement!;
  }

  function getTrafficLights() {
    const titlebar = screen.getByText(/aidan-obrien/).closest("div")!;
    const spans = titlebar.querySelectorAll("span");
    const dots = Array.from(spans).filter((s) => {
      const bg = s.style.background;
      return (
        bg === "var(--color-dot-r)" ||
        bg === "var(--color-dot-y)" ||
        bg === "var(--color-dot-g)"
      );
    });
    return { red: dots[0], yellow: dots[1], green: dots[2] };
  }

  it("red dot closes the terminal", () => {
    renderAndMount();
    const { red } = getTrafficLights();
    fireEvent.click(red);
    const termWindow = getTerminalWindow();
    expect(termWindow.style.pointerEvents).toBe("none");
  });

  it("yellow dot minimizes the terminal", () => {
    renderAndMount();
    const { yellow } = getTrafficLights();
    fireEvent.click(yellow);
    const termWindow = getTerminalWindow();
    expect(termWindow.style.pointerEvents).toBe("none");
  });

  it("green dot maximizes the terminal", () => {
    renderAndMount();
    const { green } = getTrafficLights();
    fireEvent.click(green);
    const termWindow = getTerminalWindow();
    expect(termWindow.style.position).toBe("fixed");
    expect(termWindow.style.width).toBe("100%");
    expect(termWindow.style.height).toBe("100%");
  });

  it("green dot toggles maximized back to open", () => {
    renderAndMount();
    const { green } = getTrafficLights();
    fireEvent.click(green);
    fireEvent.click(green);
    const termWindow = getTerminalWindow();
    expect(termWindow.style.position).toBe("absolute");
  });

  it("double-click titlebar maximizes", () => {
    renderAndMount();
    const titlebar = screen.getByText(/aidan-obrien/).closest("div")!;
    fireEvent.doubleClick(titlebar);
    const termWindow = getTerminalWindow();
    expect(termWindow.style.position).toBe("fixed");
  });
});

// ─── Window state transitions ───────────────────────────────────────

describe("Window state transitions", () => {
  function getTrafficLights() {
    const titlebar = screen.getByText(/aidan-obrien/).closest("div")!;
    const spans = titlebar.querySelectorAll("span");
    const dots = Array.from(spans).filter((s) => {
      const bg = s.style.background;
      return (
        bg === "var(--color-dot-r)" ||
        bg === "var(--color-dot-y)" ||
        bg === "var(--color-dot-g)"
      );
    });
    return { red: dots[0], yellow: dots[1], green: dots[2] };
  }

  function getTerminalWindow() {
    const titlebar = screen.getByText(/aidan-obrien/).closest("div")!;
    return titlebar.parentElement!;
  }

  it("open → minimized → open via dock", () => {
    renderAndMount();
    const { yellow } = getTrafficLights();
    fireEvent.click(yellow);
    let termWindow = getTerminalWindow();
    expect(termWindow.style.pointerEvents).toBe("none");

    const dockTerminal = screen.getByTitle("Terminal");
    fireEvent.click(dockTerminal);
    termWindow = getTerminalWindow();
    expect(termWindow.style.pointerEvents).not.toBe("none");
  });

  it("open → maximized → open", () => {
    renderAndMount();
    const { green } = getTrafficLights();
    fireEvent.click(green);
    let termWindow = getTerminalWindow();
    expect(termWindow.style.position).toBe("fixed");

    fireEvent.click(green);
    termWindow = getTerminalWindow();
    expect(termWindow.style.position).toBe("absolute");
  });

  it("open → closed → restored via dock", () => {
    renderAndMount();
    const { red } = getTrafficLights();
    fireEvent.click(red);
    let termWindow = getTerminalWindow();
    expect(termWindow.style.pointerEvents).toBe("none");

    const dockTerminal = screen.getByTitle("Terminal");
    fireEvent.click(dockTerminal);
    termWindow = getTerminalWindow();
    expect(termWindow.style.pointerEvents).not.toBe("none");
  });
});

// ─── Menu bar ───────────────────────────────────────────────────────

describe("Menu bar", () => {
  it("renders all menu items", () => {
    renderAndMount();
    expect(screen.getByRole("button", { name: "File" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Help" })).toBeInTheDocument();
  });

  it("shows shamrock logo in menu bar", () => {
    renderAndMount();
    const shamrocks = screen.getAllByText("☘");
    expect(shamrocks.length).toBeGreaterThanOrEqual(1);
  });

  it("clicking File opens dropdown with items", () => {
    renderAndMount();
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    expect(screen.getByText("About Aidan")).toBeInTheDocument();
    expect(screen.getByText("Open Resume")).toBeInTheDocument();
  });

  it("clicking View opens dropdown with items", () => {
    renderAndMount();
    fireEvent.click(screen.getByRole("button", { name: "View" }));
    expect(screen.getByText("Maximize")).toBeInTheDocument();
    expect(screen.getByText("Minimize")).toBeInTheDocument();
    expect(screen.getByText("Restore Default")).toBeInTheDocument();
  });

  it("clicking Go opens dropdown with items", () => {
    renderAndMount();
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    const goDropdown = screen.getByRole("button", { name: "Go" }).closest("div")!;
    const dropdownPanel = goDropdown.querySelector("div[style*='position: absolute']")!;
    expect(within(dropdownPanel as HTMLElement).getByText("GitHub")).toBeInTheDocument();
    expect(within(dropdownPanel as HTMLElement).getByText("LinkedIn")).toBeInTheDocument();
    expect(within(dropdownPanel as HTMLElement).getByText("Chess.com")).toBeInTheDocument();
    expect(within(dropdownPanel as HTMLElement).getByText("BadgerBase")).toBeInTheDocument();
  });

  it("clicking Help opens dropdown with Email Aidan", () => {
    renderAndMount();
    fireEvent.click(screen.getByRole("button", { name: "Help" }));
    expect(screen.getByRole("link", { name: "Email Aidan" })).toBeInTheDocument();
  });

  it("clicking a menu then clicking another switches dropdown", () => {
    renderAndMount();
    fireEvent.click(screen.getByRole("button", { name: "File" }));
    expect(screen.getByText("About Aidan")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(screen.queryByText("About Aidan")).not.toBeInTheDocument();
    const goDropdown = screen.getByRole("button", { name: "Go" }).closest("div")!;
    const dropdownPanel = goDropdown.querySelector("div[style*='position: absolute']")!;
    expect(within(dropdownPanel as HTMLElement).getByText("BadgerBase")).toBeInTheDocument();
  });

  it("menu bar is hidden when terminal is maximized", () => {
    renderAndMount();
    expect(screen.getByRole("button", { name: "File" })).toBeInTheDocument();

    const titlebar = screen.getByText(/aidan-obrien/).closest("div")!;
    const spans = titlebar.querySelectorAll("span");
    const green = Array.from(spans).find(
      (s) => s.style.background === "var(--color-dot-g)"
    )!;
    fireEvent.click(green);

    expect(screen.queryByRole("button", { name: "File" })).not.toBeInTheDocument();
  });

  it("Go menu links have correct hrefs", () => {
    renderAndMount();
    fireEvent.click(screen.getByRole("button", { name: "Go" }));
    const goDropdown = screen.getByRole("button", { name: "Go" }).closest("div")!;
    const dropdownPanel = goDropdown.querySelector("div[style*='position: absolute']")! as HTMLElement;
    expect(within(dropdownPanel).getByText("GitHub").closest("a")).toHaveAttribute(
      "href",
      "https://github.com/aidanobrien5599"
    );
    expect(within(dropdownPanel).getByText("LinkedIn").closest("a")).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/aidan-o-brien-393486274/"
    );
    expect(within(dropdownPanel).getByText("Chess.com").closest("a")).toHaveAttribute(
      "href",
      "https://chess.com/member/aidanob917"
    );
  });

  it("Help > Email Aidan has correct mailto href", () => {
    renderAndMount();
    fireEvent.click(screen.getByRole("button", { name: "Help" }));
    expect(screen.getByRole("link", { name: "Email Aidan" })).toHaveAttribute(
      "href",
      "mailto:aob55992@gmail.com"
    );
  });
});

// ─── Dock ───────────────────────────────────────────────────────────

describe("Dock", () => {
  it("renders Terminal dock icon", () => {
    renderAndMount();
    expect(screen.getByTitle("Terminal")).toBeInTheDocument();
  });

  it("renders Browser dock icon", () => {
    renderAndMount();
    expect(screen.getByTitle("Browser")).toBeInTheDocument();
  });

  it("renders Resume dock icon", () => {
    renderAndMount();
    expect(screen.getByTitle("Resume")).toBeInTheDocument();
  });

  it("renders GitHub dock icon", () => {
    renderAndMount();
    expect(screen.getByTitle("GitHub")).toBeInTheDocument();
  });

  it("renders LinkedIn dock icon", () => {
    renderAndMount();
    expect(screen.getByTitle("LinkedIn")).toBeInTheDocument();
  });

  it("renders Chess dock icon", () => {
    renderAndMount();
    expect(screen.getByTitle("Chess")).toBeInTheDocument();
  });

  it("renders DOOM dock icon", () => {
    renderAndMount();
    expect(screen.getByTitle("DOOM")).toBeInTheDocument();
  });

  it("terminal dock icon shows active indicator when terminal is open", () => {
    renderAndMount();
    const termDock = screen.getByTitle("Terminal");
    const activeIndicator = termDock.querySelector("span[style*='background: var(--color-accent)']");
    expect(activeIndicator).toBeTruthy();
  });

  it("clicking terminal dock minimizes when open", () => {
    renderAndMount();
    const dockTerminal = screen.getByTitle("Terminal");
    fireEvent.click(dockTerminal);
    const titlebar = screen.getByText(/aidan-obrien/).closest("div")!;
    const termWindow = titlebar.parentElement!;
    expect(termWindow.style.pointerEvents).toBe("none");
  });

  it("dock is hidden when terminal is maximized", () => {
    renderAndMount();
    const titlebar = screen.getByText(/aidan-obrien/).closest("div")!;
    const spans = titlebar.querySelectorAll("span");
    const green = Array.from(spans).find(
      (s) => s.style.background === "var(--color-dot-g)"
    )!;
    fireEvent.click(green);
    expect(screen.queryByTitle("Resume")).not.toBeInTheDocument();
  });
});

// ─── Desktop icons ──────────────────────────────────────────────────

describe("Desktop icons", () => {
  it("renders resume.pdf icon", () => {
    renderAndMount();
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
  });

  it("renders GitHub desktop icon", () => {
    renderAndMount();
    const githubIcons = screen.getAllByText("GitHub");
    expect(githubIcons.length).toBeGreaterThan(0);
  });

  it("renders LinkedIn desktop icon", () => {
    renderAndMount();
    const linkedinIcons = screen.getAllByText("LinkedIn");
    expect(linkedinIcons.length).toBeGreaterThan(0);
  });

  it("renders Chess.com desktop icon", () => {
    renderAndMount();
    expect(screen.getAllByText("Chess.com").length).toBeGreaterThan(0);
  });

  it("renders Browser desktop icon", () => {
    renderAndMount();
    const browserIcons = screen.getAllByText("Browser");
    expect(browserIcons.length).toBeGreaterThan(0);
  });

  it("resume.pdf links to the resume", () => {
    renderAndMount();
    const resumeLink = screen.getByText("resume.pdf").closest("a");
    expect(resumeLink).toHaveAttribute("href", "/OBRIEN_AIDAN_RESUME.pdf");
  });

  it("renders DOOM desktop icon", () => {
    renderAndMount();
    expect(screen.getByText("DOOM")).toBeInTheDocument();
  });
});

// ─── Blog folder icon ───────────────────────────────────────────────

describe("Blog folder icon", () => {
  it("renders the FolderIcon svg instead of the folder emoji on the desktop", () => {
    const { container } = renderAndMount();
    expect(container.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.queryByText("📁")).not.toBeInTheDocument();
  });
});

// ─── Browser window ─────────────────────────────────────────────────

describe("Browser window", () => {
  it("browser is closed by default", () => {
    renderAndMount();
    expect(screen.queryByPlaceholderText("Search or enter URL…")).not.toBeInTheDocument();
  });

  it("clicking browser dock icon opens browser window", () => {
    renderAndMount();
    const browserDock = screen.getByTitle("Browser");
    fireEvent.click(browserDock);
    expect(screen.getByPlaceholderText("Search or enter URL…")).toBeInTheDocument();
  });

  it("browser has home button", () => {
    renderAndMount();
    fireEvent.click(screen.getByTitle("Browser"));
    expect(screen.getByTitle("Home")).toBeInTheDocument();
  });

  it("browser URL input accepts text", () => {
    renderAndMount();
    fireEvent.click(screen.getByTitle("Browser"));
    const input = screen.getByPlaceholderText("Search or enter URL…") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "example.com" } });
    expect(input.value).toBe("example.com");
  });

  it("clicking browser dock when open minimizes it", () => {
    renderAndMount();
    const browserDock = screen.getByTitle("Browser");
    fireEvent.click(browserDock);
    expect(screen.getByPlaceholderText("Search or enter URL…")).toBeInTheDocument();

    fireEvent.click(browserDock);
    const urlInput = screen.getByPlaceholderText("Search or enter URL…");
    const browserWindow = urlInput.closest("div[style*='pointer-events']");
    expect(browserWindow).toBeTruthy();
  });
});

// ─── DOOM window ────────────────────────────────────────────────────

describe("DOOM window", () => {
  it("doom is closed by default", () => {
    renderAndMount();
    expect(screen.queryByText("Loading DOOM...")).not.toBeInTheDocument();
  });

  it("clicking doom dock icon opens doom window", () => {
    renderAndMount();
    const doomDock = screen.getByTitle("DOOM");
    fireEvent.click(doomDock);
    expect(screen.getByText("Loading DOOM...")).toBeInTheDocument();
  });

  it("clicking doom dock when open minimizes it", () => {
    renderAndMount();
    const doomDock = screen.getByTitle("DOOM");
    fireEvent.click(doomDock);
    expect(screen.getByText("Loading DOOM...")).toBeInTheDocument();

    fireEvent.click(doomDock);
    const loadingText = screen.getByText("Loading DOOM...");
    const doomWindow = loadingText.closest("div[style*='pointer-events']");
    expect(doomWindow).toBeTruthy();
  });
});

// ─── Minimized hint ─────────────────────────────────────────────────

describe("Minimized hint", () => {
  it("shows blinking cursor hint when terminal is minimized and browser closed", () => {
    renderAndMount();
    const titlebar = screen.getByText(/aidan-obrien/).closest("div")!;
    const yellow = Array.from(titlebar.querySelectorAll("span")).find(
      (s) => s.style.background === "var(--color-dot-y)"
    )!;
    fireEvent.click(yellow);
    expect(screen.getByText(/click the terminal in the dock/)).toBeInTheDocument();
  });

  it("does not show hint when terminal is open", () => {
    renderAndMount();
    expect(screen.queryByText(/click the terminal in the dock/)).not.toBeInTheDocument();
  });
});

// ─── Hydration safety ───────────────────────────────────────────────

describe("Hydration safety", () => {
  it("root element has opacity style", () => {
    const { container } = renderAndMount();
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.opacity).toBe("1");
  });
});

// ─── Mobile behavior ────────────────────────────────────────────────

describe("Mobile behavior", () => {
  it("hides desktop icons on mobile", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 500 });
    renderAndMount();
    expect(screen.queryByText("resume.pdf")).not.toBeInTheDocument();
  });

  it("hides dock on mobile", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 500 });
    renderAndMount();
    expect(screen.queryByTitle("Terminal")).not.toBeInTheDocument();
  });

  it("hides menu bar on mobile", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, value: 500 });
    renderAndMount();
    expect(screen.queryByRole("button", { name: "File" })).not.toBeInTheDocument();
  });
});
