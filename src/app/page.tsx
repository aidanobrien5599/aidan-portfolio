const work = [
  {
    year: "2026",
    company: "Netflix",
    title: "Software Engineer Intern",
    note: "Incoming in May",
  },
  {
    year: "2025-2026",
    company: "Intelligible",
    title: "Founding Engineer",
    note: null,
  },
  {
    year: "2025",
    company: "CargoLabs",
    title: "Software Engineer Intern",
    note: null,
  },
  {
    year: "2024",
    company: "Collectwise",
    title: "Software Engineer Intern",
    note: "YC F'24",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      {/* Title bar */}
      <div className="titlebar" style={{ borderRadius: 0 }}>
        <span
          className="titlebar-dot"
          style={{ background: "var(--color-dot-r)" }}
        ></span>
        <span
          className="titlebar-dot"
          style={{ background: "var(--color-dot-y)" }}
        ></span>
        <span
          className="titlebar-dot"
          style={{ background: "var(--color-dot-g)" }}
        ></span>
        <span className="titlebar-path">
          <span style={{ color: "var(--color-accent)" }}>☘</span>{" "}
          aidan-obrien{" "}
          <span style={{ opacity: 0.3 }}>/</span>{" "}
          <span style={{ color: "var(--color-accent)" }}>portfolio</span>
        </span>
      </div>

      {/* Terminal body */}
      <main className="max-w-2xl mx-auto px-8 py-10 sm:px-10">
            <header className="mb-10">
              <h1
                className="mb-1"
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "var(--color-heading)",
                }}
              >
                Aidan O&apos;Brien{" "}
                <span style={{ color: "var(--color-accent)", fontSize: 24 }}>
                  ☘
                </span>
              </h1>
              <p style={{ color: "var(--color-muted)", fontSize: 14 }}>
                <span style={{ color: "var(--color-accent)", opacity: 0.5 }}>
                  ~ ${" "}
                </span>
                Software engineer. CS @ UW–Madison.
              </p>
            </header>

            <section className="mb-10">
              <div
                className="space-y-3"
                style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-body)" }}
              >
                <img
                  src="/images/headshot.jpeg"
                  alt="Aidan O'Brien"
                  className="w-44 h-44 rounded-full object-cover mx-auto mb-4 sm:float-right sm:ml-6 sm:mb-2 sm:mx-0"
                />
                <p>
                  I&apos;m an incoming software engineer intern at{" "}
                  <span className="highlight">Netflix</span>, joining the
                  Retention team this summer. Before that I was a founding
                  engineer at{" "}
                  <span className="highlight">Intelligible</span>, building data
                  connectors for an early-stage AI company.
                </p>
                <p>
                  I&apos;ve also interned at{" "}
                  <span className="highlight">CargoLabs</span> and{" "}
                  <span className="highlight">Collectwise</span> (YC F&apos;24),
                  a YC agentic debt collection startup backed by 1984 Ventures.
                </p>
                <p>
                  When I&apos;m not coding I&apos;m on the mat training BJJ or
                  losing rating on chess.com.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="section-heading">Work</h2>
              <div>
                {work.map((job, i) => (
                  <div key={i} className="work-row">
                    <span className="work-year">{job.year}</span>
                    <span>
                      {job.company} · {job.title}
                      {job.note && (
                        <span className="work-note">{job.note}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-10">
              <h2 className="section-heading">Projects</h2>
              <div>
                <p className="mb-2">
                  <a href="https://badgerbase.app" className="link-accent">
                    BadgerBase
                  </a>
                </p>
                <p style={{ color: "var(--color-body)" }}>
                  A course discovery tool for UW–Madison students. 2,000+ users
                  use it to find, compare, and plan courses. Built with Next.js
                  on top of a custom data pipeline scraping Madgrades,
                  RateMyProfessor, and the university&apos;s course catalog.
                </p>
              </div>
              <div className="mt-6">
                <p className="mb-2">
                  <a
                    href="https://github.com/aidanobrien5599/MarchMadnessPredictor"
                    className="link-accent"
                  >
                    March Madness Predictor
                  </a>
                </p>
                <p style={{ color: "var(--color-body)" }}>
                  My annual attempt to crack March Madness with historical data.
                  Proud winner of the $100 grand prize in my Jersey Shore
                  friends&apos; 2026 pool.
                </p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="section-heading">Writing</h2>
              <p style={{ color: "var(--color-muted)" }}>Nothing here yet.</p>
            </section>

            <section className="mb-10">
              <h2 className="section-heading">Contact</h2>
              <div className="flex items-center gap-4 mb-4">
                <a href="mailto:aob55992@gmail.com" className="link-accent">
                  aob55992@gmail.com
                </a>
                <span style={{ color: "var(--color-border)" }}>·</span>
                <a
                  href="/OBRIEN_AIDAN_RESUME.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  Resume
                </a>
              </div>
              <div
                className="flex gap-4 text-xs"
                style={{ color: "var(--color-muted)" }}
              >
                <a
                  href="https://github.com/aidanobrien5599"
                  className="contact-link"
                >
                  GitHub
                </a>
                <span>·</span>
                <a
                  href="https://www.linkedin.com/in/aidan-o-brien-393486274/"
                  className="contact-link"
                >
                  LinkedIn
                </a>
                <span>·</span>
                <a
                  href="https://chess.com/member/aidanob917"
                  className="contact-link"
                >
                  Chess.com
                </a>
              </div>
            </section>

            <footer
              className="pt-6 text-xs"
              style={{
                borderTop: "1px solid var(--color-border)",
                color: "var(--color-muted)",
              }}
            >
              {new Date().getFullYear()} — Aidan O&apos;Brien v3
            </footer>
      </main>
    </div>
  );
}
