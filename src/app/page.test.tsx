import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Home from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// Home() calls useTheme() from ThemeContext (pre-existing, unrelated to this task —
// see src/app/layout.tsx, which wraps the app in <ThemeProvider> in production).
// useTheme() throws outside a ThemeProvider, which plain render(<Home />) doesn't
// supply. This was previously masked because page.tsx failed to even compile (it
// imported the now-deleted BlogWindow); fixing that import surfaces this pre-existing
// gap. Mocked the same way next/navigation is mocked above, rather than mounting the
// real ThemeProvider, to avoid an unrelated jsdom/localStorage environment issue.
vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({ backgroundValue: "" }),
}));

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

describe("Blog multi-window", () => {
  it("opens an article as its own window when clicked from the folder", () => {
    renderAndMount();
    // "Blog" appears once (desktop icon label) before the folder window is open —
    // the desktop icon is always index 0, since DesktopIcons renders before any
    // window in page.tsx's JSX tree.
    fireEvent.click(screen.getAllByText("Blog")[0]);
    // Once the folder is open, /SaaS is Dead to Me/ matches twice: TerminalWindow's
    // "Writing" section link (index 0 — TerminalWindow renders before
    // BlogFolderWindow in page.tsx's JSX tree, and stays mounted since it's open by
    // default) and the folder's own row (index 1), which is the one wired to
    // onOpenArticle.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[1]);
    // "Mox" also appears in the Terminal/folder row descriptions, so use getAllByText
    // rather than getByText (which requires a single match).
    expect(screen.getAllByText(/Mox/).length).toBeGreaterThan(0);
  });

  it("dedups: clicking the same post twice keeps only one article window open, just refocused", () => {
    renderAndMount();
    // "Blog" appears once (desktop icon label) before the folder window is open —
    // the desktop icon is always index 0, since DesktopIcons renders before any
    // window in page.tsx's JSX tree.
    fireEvent.click(screen.getAllByText("Blog")[0]);
    // Once the folder is open, /SaaS is Dead to Me/ matches twice: TerminalWindow's
    // "Writing" section link (index 0) and the folder's own row (index 1), which is
    // the one wired to onOpenArticle.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[1]);
    // "Blog" appears twice once the folder window is open (desktop icon label +
    // window title bar) — the desktop icon is always index 0, since DesktopIcons
    // renders before any window in page.tsx's JSX tree.
    fireEvent.click(screen.getAllByText("Blog")[0]);
    // Same index reasoning as above: the folder's row is still index 1 (Terminal's
    // link is index 0) even with the article window open, since the article window's
    // own title text renders after the folder row in DOM order.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[1]);
    // "Mox" appears many times within a single article's own body content (it's the
    // product name discussed throughout), so counting "Mox" occurrences cannot
    // distinguish one open article window from two. Instead assert there is exactly
    // one <h1> with this title — ArticleWindow renders the title in an <h1> only in
    // its body (its titlebar uses a <span>), so this <h1> count is exactly the count
    // of mounted ArticleWindow instances for this slug.
    expect(screen.getAllByRole("heading", { level: 1, name: /SaaS is Dead to Me/ }).length).toBe(1);
  });

  it("closing an article does not close the folder window", () => {
    renderAndMount();
    // "Blog" appears once (desktop icon label) before the folder window is open —
    // the desktop icon is always index 0, since DesktopIcons renders before any
    // window in page.tsx's JSX tree.
    fireEvent.click(screen.getAllByText("Blog")[0]);
    // Once the folder is open, /SaaS is Dead to Me/ matches twice: TerminalWindow's
    // "Writing" section link (index 0) and the folder's own row (index 1), which is
    // the one wired to onOpenArticle.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[1]);
    // DOM order: TerminalWindow renders first (open by default, 3 dots: red, yellow,
    // green), then BlogFolderWindow (3 more dots), then the ArticleWindow (2 dots:
    // red, green), then the Dock's small active-indicator dot for the open Terminal
    // icon (1 more, also styled with border-radius: 50%) — 9 total. Index 6 is the
    // article's close (red) dot.
    const dots = document.querySelectorAll('span[style*="border-radius: 50%"]');
    expect(dots.length).toBe(9);
    fireEvent.click(dots[6]);
    // The article's <h1> (unique to its body, see the dedup test above) should be gone.
    expect(screen.queryByRole("heading", { level: 1, name: /SaaS is Dead to Me/ })).not.toBeInTheDocument();
    // "Blog" still appears twice: desktop icon label + the still-open folder window's title
    expect(screen.getAllByText("Blog").length).toBe(2);
  });

  it("refocusing the folder window brings it above an already-open article in z-order", () => {
    renderAndMount();
    // Open the folder (desktop icon, index 0 — see comment on the dedup test above).
    fireEvent.click(screen.getAllByText("Blog")[0]);
    // Open the article from the folder's row (index 1 — Terminal's "Writing" link is
    // index 0, same index reasoning as the dedup test above).
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[1]);

    // Each window's outer div (the one carrying ref={wm.ref} in BlogFolderWindow.tsx /
    // ArticleWindow.tsx) is the closest ancestor with an inline border-radius style —
    // WindowChrome's titlebar div and the scrollable content div beneath it don't set
    // border-radius, only the top-level window div does — so climbing from any element
    // inside a window via closest() reliably lands on that window's outer div, whose
    // inline zIndex is exactly blogZIndex(id) from page.tsx (getWindowStyle() only sets
    // its own zIndex for the mobile/maximized case, which doesn't apply here).
    function outerWindowOf(el: HTMLElement) {
      return el.closest('div[style*="border-radius"]') as HTMLElement;
    }

    // Folder titlebar text is "Blog" at index 1 (index 0 is the desktop icon label).
    const folderOuter = outerWindowOf(screen.getAllByText("Blog")[1]);
    // The article's <h1> is unique to its body content (see the dedup test above).
    const articleOuter = outerWindowOf(
      screen.getByRole("heading", { level: 1, name: /SaaS is Dead to Me/ })
    );

    // The article was opened after the folder, so it was focused last and should sit
    // above it in z-order.
    expect(Number(articleOuter.style.zIndex)).toBeGreaterThan(Number(folderOuter.style.zIndex));

    // Refocus the folder by mousing down on its titlebar. mousedown bubbles from
    // WindowChrome's titlebar div (which only handles drag-start, no
    // stopPropagation) up to BlogFolderWindow's outer div, whose onMouseDown={onFocus}
    // calls focusBlogWindow("blogFolder") in page.tsx, pushing "blogFolder" back to
    // the top of blogZOrder.
    fireEvent.mouseDown(screen.getAllByText("Blog")[1]);

    const folderOuterAfter = outerWindowOf(screen.getAllByText("Blog")[1]);
    const articleOuterAfter = outerWindowOf(
      screen.getByRole("heading", { level: 1, name: /SaaS is Dead to Me/ })
    );

    // The folder was just refocused, so it must now render above the article — this
    // is the part a no-op or constant-z-index focusBlogWindow would fail to satisfy.
    expect(Number(folderOuterAfter.style.zIndex)).toBeGreaterThan(Number(articleOuterAfter.style.zIndex));
  });

  it("does not update the URL when an article is merely opened (floating, not maximized)", () => {
    renderAndMount();
    // "Blog" appears once (desktop icon label) before the folder window is open —
    // the desktop icon is always index 0, since DesktopIcons renders before any
    // window in page.tsx's JSX tree.
    fireEvent.click(screen.getAllByText("Blog")[0]);
    // Once the folder is open, /SaaS is Dead to Me/ matches twice: TerminalWindow's
    // "Writing" section link (index 0) and the folder's own row (index 1), which is
    // the one wired to onOpenArticle.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[1]);
    // Opening an article is a purely desktop-only interaction — only a maximized
    // article counts as a full-page view worth reflecting in the address bar.
    expect(window.location.pathname).toBe("/");
  });

  it("updates the URL to /blog/<slug> only once the article is maximized, and back to / when un-maximized", () => {
    renderAndMount();
    fireEvent.click(screen.getAllByText("Blog")[0]);
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[1]);
    expect(window.location.pathname).toBe("/");

    // Same DOM order as the "closing an article" test above: Terminal (3 dots) +
    // Folder (3 dots) + Article (2 dots: red close at 6, green maximize at 7) +
    // Dock's active-indicator dot (1) — 9 total.
    const dots = document.querySelectorAll('span[style*="border-radius: 50%"]');
    expect(dots.length).toBe(9);
    fireEvent.click(dots[7]);
    expect(window.location.pathname).toBe("/blog/self-hosted-email");

    // maximize() toggles — clicking the same dot again un-maximizes, which should
    // pull the URL back to "/" since the article is no longer a full-page view.
    fireEvent.click(dots[7]);
    expect(window.location.pathname).toBe("/");
  });

  it("never updates the URL for the folder window, in any state", () => {
    renderAndMount();
    fireEvent.click(screen.getAllByText("Blog")[0]);
    expect(window.location.pathname).toBe("/");

    // With only the folder open (no article), DOM order is: Terminal (3 dots:
    // red/yellow/green at 0,1,2, open by default), BlogFolderWindow (3 dots:
    // red/yellow/green at 3,4,5), then the Dock's active-indicator dot for the
    // open Terminal icon (1 more) — 7 total. Index 5 is the folder's green
    // (maximize) dot.
    const dots = document.querySelectorAll('span[style*="border-radius: 50%"]');
    expect(dots.length).toBe(7);
    fireEvent.click(dots[5]);
    // Maximizing the folder must not touch the URL either — only a maximized
    // article does.
    expect(window.location.pathname).toBe("/");
  });
});

describe("Opening an article while the folder is maximized", () => {
  it("starts the article maximized (not floating-behind-the-folder) and pushes the URL", () => {
    renderAndMount();
    fireEvent.click(screen.getAllByText("Blog")[0]);

    // Maximize the folder first. With only Terminal + the folder open (no
    // article yet), DOM order is: Terminal (3 dots: 0,1,2), BlogFolderWindow
    // (3 dots: 3,4,5), Dock's active-indicator dot (1) — 7 total. Index 5 is
    // the folder's green (maximize) dot — same layout as the "never updates
    // the URL for the folder window" test above.
    let dots = document.querySelectorAll('span[style*="border-radius: 50%"]');
    expect(dots.length).toBe(7);
    fireEvent.click(dots[5]);

    // Now open the article from the folder's row (index 1 — Terminal's
    // "Writing" link is index 0, same reasoning as the other tests above).
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[1]);

    // A floating article would render with borderRadius: 10 and a boxShadow;
    // a maximized one renders borderRadius: 0, no boxShadow, position: fixed.
    // Find the article's outer window via its <h1>.
    const h1 = screen.getByRole("heading", { level: 1, name: /SaaS is Dead to Me/ });
    let articleOuter: HTMLElement | null = h1;
    while (articleOuter && !articleOuter.getAttribute("style")?.includes("border-radius")) {
      articleOuter = articleOuter.parentElement;
    }
    expect(articleOuter?.getAttribute("style")).toContain("border-radius: 0");
    expect(articleOuter?.getAttribute("style")).toContain("position: fixed");

    // Maximized article -> URL syncs, same as any other maximize.
    expect(window.location.pathname).toBe("/blog/self-hosted-email");
  });

  it("does not retroactively maximize an article that was already open floating before the folder maximized", () => {
    renderAndMount();
    fireEvent.click(screen.getAllByText("Blog")[0]);
    // Open the article first, while the folder is still just "open" (not
    // maximized) — it should be floating, per normal behavior.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[1]);
    expect(window.location.pathname).toBe("/");

    // Now maximize the folder. DOM order with folder + one floating article
    // open: Terminal (3), Folder (3), Article (2), Dock (1) — 9 total (same
    // count as the "closing an article" test above). Folder's green dot is
    // still index 5.
    let dots = document.querySelectorAll('span[style*="border-radius: 50%"]');
    expect(dots.length).toBe(9);
    fireEvent.click(dots[5]);

    // Re-clicking the already-open article's row should just refocus it —
    // "isNewlyOpened" is false, so it must not suddenly jump to maximized.
    fireEvent.click(screen.getAllByText(/SaaS is Dead to Me/)[1]);
    expect(window.location.pathname).toBe("/");
  });
});

describe("Reveal-the-desktop navigation (?article= param)", () => {
  it("opens the given article, floating, on mount when ?article=<slug> is present, and strips the query string", () => {
    // Simulates arriving here the way ArticleWindow's standalone un-maximize
    // navigates: router.push(`/?article=${slug}`).
    window.history.pushState(null, "", "/?article=self-hosted-email");
    renderAndMount();

    expect(screen.getByRole("heading", { level: 1, name: /SaaS is Dead to Me/ })).toBeInTheDocument();
    // The query string is a one-shot signal, not part of the app's normal URL
    // vocabulary — it's consumed and cleaned up immediately.
    expect(window.location.search).toBe("");
    expect(window.location.pathname).toBe("/");
  });

  it("does nothing when there is no ?article= param", () => {
    window.history.pushState(null, "", "/");
    renderAndMount();
    expect(screen.queryByRole("heading", { level: 1, name: /SaaS is Dead to Me/ })).not.toBeInTheDocument();
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
