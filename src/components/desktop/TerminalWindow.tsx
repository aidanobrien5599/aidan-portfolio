"use client";

import { WindowChrome } from "./WindowChrome";
import { Section } from "./Section";
import { work, links } from "@/constants/portfolio";
import type { useWindowManager } from "@/hooks/useWindowManager";

interface TerminalWindowProps {
  wm: ReturnType<typeof useWindowManager>;
  isMobile: boolean;
  onFocus: () => void;
  onBounce: (id: string) => void;
  activeZIndex: number;
}

export function TerminalWindow({ wm, isMobile, onFocus, onBounce, activeZIndex }: TerminalWindowProps) {
  const handleMinimize = () => {
    wm.minimize();
    onBounce("terminal");
  };

  return (
    <div
      ref={wm.ref}
      onMouseDown={onFocus}
      style={{
        ...wm.getWindowStyle(),
        display: "flex",
        flexDirection: "column",
        borderRadius: wm.state === "maximized" || isMobile ? 0 : 10,
        boxShadow: wm.state === "maximized" || isMobile ? "none" : "var(--window-shadow)",
        overflow: "hidden",
        zIndex: wm.state === "maximized" ? 200 : activeZIndex,
      }}
    >
      <WindowChrome
        onClose={() => wm.setState("closed")}
        onMinimize={handleMinimize}
        onMaximize={wm.maximize}
        onDragStart={wm.handleDragStart}
        onDoubleClick={wm.maximize}
        isMaximized={wm.state === "maximized"}
        isMobile={isMobile}
        title={
          <>
            <span style={{ color: "var(--color-accent)" }}>☘</span>{" "}
            aidan-obrien{" "}
            <span style={{ opacity: 0.3 }}>/</span>{" "}
            <span style={{ color: "var(--color-accent)" }}>portfolio</span>
          </>
        }
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "var(--color-bg)",
          padding: isMobile ? "24px 20px" : "32px 36px",
          fontSize: 14,
          lineHeight: 1.7,
          color: "var(--color-body)",
          cursor: "text",
          overscrollBehavior: "contain",
        }}
      >
        <header style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "var(--color-heading)",
              marginBottom: 4,
            }}
          >
            Aidan O&apos;Brien{" "}
            <span style={{ color: "var(--color-accent)", fontSize: 20 }}>☘</span>
          </h1>
          <p style={{ color: "var(--color-muted)", fontSize: 13 }}>
            <span style={{ color: "var(--color-accent)", opacity: 0.5 }}>~ $ </span>
            Software engineer. CS @ UW-Madison.
          </p>
        </header>

        <section style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 14, lineHeight: 1.8 }}>
            <img
              src="/images/headshot.jpeg"
              alt="Aidan O'Brien"
              style={{
                width: isMobile ? 140 : 160,
                height: isMobile ? 140 : 160,
                borderRadius: "50%",
                objectFit: "cover",
                float: isMobile ? "none" : "right",
                margin: isMobile ? "0 auto 16px" : "0 0 8px 20px",
                display: isMobile ? "block" : "inline",
              }}
            />
            <p>
              I was a software engineer intern at{" "}
              <span style={{ color: "var(--color-heading)", fontWeight: 700 }}>Netflix</span>{" "}
              on the Retention team this summer. Before that I was a founding
              engineer at{" "}
              <span style={{ color: "var(--color-heading)", fontWeight: 700 }}>Intelligible</span>,
              building data connectors for an early-stage AI company.
            </p>
            <p style={{ marginTop: 10 }}>
              I&apos;ve also interned at{" "}
              <span style={{ color: "var(--color-heading)", fontWeight: 700 }}>CargoLabs</span> and{" "}
              <span style={{ color: "var(--color-heading)", fontWeight: 700 }}>Collectwise</span>{" "}
              (YC F&apos;24), a YC agentic debt collection startup backed by 1984 Ventures.
            </p>
            <p style={{ marginTop: 10 }}>
              When I&apos;m not coding I&apos;m on the mat training BJJ or losing
              rating on chess.com.
            </p>
          </div>
        </section>

        <Section title="Work">
          {work.map((job, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 16,
                fontSize: 13,
                lineHeight: 1.7,
                marginTop: i > 0 ? 4 : 0,
              }}
            >
              <span
                style={{
                  color: "var(--color-heading)",
                  fontWeight: 600,
                  width: 80,
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {job.year}
              </span>
              <span>
                {job.company} · {job.title}
                {job.note && (
                  <span style={{ fontSize: 11, color: "var(--color-accent)", marginLeft: 6 }}>
                    {job.note}
                  </span>
                )}
              </span>
            </div>
          ))}
        </Section>

        <Section title="Projects">
          <div style={{ marginBottom: 14 }}>
            <a
              href={links.badgerbase}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-accent)", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              BadgerBase
            </a>
            <p style={{ marginTop: 4, fontSize: 13 }}>
              A course discovery tool for UW-Madison students. 2,000+ users use it
              to find, compare, and plan courses. Built with Next.js on top of a
              custom data pipeline scraping Madgrades, RateMyProfessor, and the
              university&apos;s course catalog.
            </p>
          </div>
          <div>
            <a
              href={links.marchmadness}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-accent)", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              March Madness Predictor
            </a>
            <p style={{ marginTop: 4, fontSize: 13 }}>
              My annual attempt to crack March Madness with historical data. Proud
              winner of the $100 grand prize in my Jersey Shore friends&apos; 2026 pool.
            </p>
          </div>
        </Section>

        <Section title="Writing">
          <p style={{ color: "var(--color-muted)" }}>Nothing here yet.</p>
        </Section>

        <Section title="Contact">
          <a
            href={links.email}
            style={{ color: "var(--color-accent)", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            aob55992@gmail.com
          </a>
          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: 12,
              color: "var(--color-muted)",
              marginTop: 8,
            }}
          >
            {[
              { label: "GitHub", href: links.github },
              { label: "LinkedIn", href: links.linkedin },
              { label: "Chess.com", href: links.chess },
              { label: "Resume", href: links.resume },
            ].map((l, i) => (
              <span key={l.label}>
                {i > 0 && <span style={{ opacity: 0.3, marginRight: 12 }}>·</span>}
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--color-muted)", textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-accent)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-muted)")}
                >
                  {l.label}
                </a>
              </span>
            ))}
          </div>
        </Section>

        <footer
          style={{
            paddingTop: 16,
            marginTop: 8,
            borderTop: "1px solid var(--color-border)",
            fontSize: 11,
            color: "var(--color-muted)",
          }}
        >
          {new Date().getFullYear()} — Aidan O&apos;Brien v3
        </footer>
      </div>
    </div>
  );
}
