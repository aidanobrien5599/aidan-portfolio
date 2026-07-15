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
    <main className="max-w-2xl mx-auto px-8 py-20 text-[15px] leading-relaxed">
      <header className="mb-8">
        <h1
          className="mb-1 font-normal"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            letterSpacing: "-0.01em",
            color: "var(--color-heading)",
          }}
        >
          Aidan O&apos;Brien{" "}
          <span style={{ color: "var(--color-accent)", fontSize: 28 }}>☘</span>
        </h1>
        <p style={{ color: "var(--color-muted)", fontSize: 15 }}>
          Software engineer. Computer science @ UW–Madison.
        </p>
      </header>

      <section className="mb-8 space-y-4" style={{ color: "var(--color-body)" }}>
        <img
          src="/headshot.jpeg"
          alt="Aidan O'Brien"
          className="w-44 h-44 rounded-full object-cover mx-auto mb-4 sm:float-right sm:ml-6 sm:mb-2 sm:mx-0"
        />
        <p>
          I&apos;m an incoming software engineer intern at{" "}
          <span className="highlight">Netflix</span>, joining the Retention
          team this summer. Before that I was a founding engineer at{" "}
          <span className="highlight">Intelligible</span>, building data
          connectors for an early-stage AI company.
        </p>
        <p>
          I&apos;ve also interned at{" "}
          <span className="highlight">CargoLabs</span> and{" "}
          <span className="highlight">Collectwise</span> (YC F&apos;24), a YC
          agentic debt collection startup backed by 1984 Ventures.
        </p>
        <p>
          When I&apos;m not coding I&apos;m on the mat training BJJ or losing
          rating on chess.com.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="section-heading">Work</h2>
        <div>
          {work.map((job, i) => (
            <div key={i} className="work-row">
              <span className="work-year">{job.year}</span>
              <span>
                {job.company} · {job.title}
                {job.note && <span className="work-note">{job.note}</span>}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="section-heading">Projects</h2>
        <div>
          <p className="mb-2">
            <a href="https://badgerbase.app" className="link-accent">
              BadgerBase
            </a>
          </p>
          <p style={{ color: "var(--color-body)" }}>
            A course discovery tool for UW–Madison students. 2,000+ users use it
            to find, compare, and plan courses. Built with Next.js on top of a
            custom data pipeline scraping Madgrades, RateMyProfessor, and the
            university&apos;s course catalog.
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
            My annual attempt to crack March Madness with historical data. Proud
            winner of the $100 grand prize in my Jersey Shore friends&apos; 2026
            pool.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="section-heading">Writing</h2>
        <p style={{ color: "var(--color-muted)" }}>Nothing here yet.</p>
      </section>

      <section className="mb-20">
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
        <div className="flex gap-4 text-xs" style={{ color: "var(--color-muted)" }}>
          <a href="https://github.com/aidanobrien5599" className="contact-link">
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
          <a href="https://chess.com/member/aidanob917" className="contact-link">
            Chess.com
          </a>
        </div>
      </section>

      <footer
        className="pt-8 text-xs"
        style={{
          borderTop: "1px solid var(--color-border)",
          color: "var(--color-muted)",
        }}
      >
        {new Date().getFullYear()} — Aidan O&apos;Brien v3
      </footer>
    </main>
  );
}
