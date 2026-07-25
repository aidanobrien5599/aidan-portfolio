import type { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2
        style={{
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase" as const,
          color: "var(--color-accent)",
          marginBottom: 14,
        }}
      >
        <span style={{ color: "var(--color-muted)", fontWeight: 400 }}>$ </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
