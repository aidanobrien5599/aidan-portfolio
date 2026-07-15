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
    <main className="max-w-xl mx-auto px-6 py-20 text-sm leading-relaxed">
      <header className="mb-8">
        <h1 className="text-lg font-medium text-zinc-900 dark:text-green-100 mb-1">
          Aidan O&apos;Brien{" "}
          <span className="text-green-600 dark:text-green-600 text-2xl">☘</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Software engineer. Computer science @ UW–Madison.
        </p>
      </header>

      <section className="mb-8 space-y-4 text-zinc-600 dark:text-zinc-400">
        <img
          src="/headshot.jpeg"
          alt="Aidan O'Brien"
          className="w-36 h-36 rounded-full object-cover mx-auto mb-4 sm:float-right sm:ml-6 sm:mb-2 sm:mx-0"
        />
        <p>
          I&apos;m an incoming software engineer intern at{" "}
          <span className="text-zinc-900 dark:text-zinc-50">Netflix</span>,
          joining the Retention team this summer. Before that I was a founding
          engineer at{" "}
          <span className="text-zinc-900 dark:text-zinc-50">Intelligible</span>
          , building data connectors for an early-stage AI company.
        </p>
        <p>
          I&apos;ve also interned at{" "}
          <span className="text-zinc-900 dark:text-zinc-50">CargoLabs</span>{" "}
          and{" "}
          <span className="text-zinc-900 dark:text-zinc-50">Collectwise</span>{" "}
          (YC F&apos;24), a YC agentic debt collection startup backed by 1984 Ventures.
        </p>
        <p>
          When I&apos;m not coding I&apos;m on the mat training BJJ or losing rating on chess.com.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-s uppercase tracking-widest text-green-900 dark:text-green-100 mb-6">
          Work
        </h2>
        <div className="space-y-2">
          {work.map((job, i) => (
            <div key={i} className="flex gap-6 text-zinc-600 dark:text-zinc-400">
              <span className="text-zinc-800 dark:text-zinc-300 w-20 flex-shrink-0">
                {job.year}
              </span>
              <span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {job.company}
                </span>
                {" · "}
                {job.title}
                {job.note && (
                  <span className="text-green-700 dark:text-green-600 text-xs ml-2">
                    {job.note}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-s uppercase tracking-widest text-green-900 dark:text-green-100 mb-6">
          Projects
        </h2>
        <div>
          <p className="mb-2">
            <a
              href="https://badgerbase.app"
              className="text-green-700 dark:text-green-600 hover:underline"
            >
              BadgerBase
            </a>
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            A course discovery tool for UW–Madison students. 2,000+ users use
            it to find, compare, and plan courses. Built with Next.js on top of
            a custom data pipeline scraping Madgrades, RateMyProfessor, and the university&apos;s course catalog.
          </p>
        </div>
        <div className="mt-6">
          <p className="mb-2">
            <a
              href="https://github.com/aidanobrien5599/MarchMadnessPredictor"
              className="text-green-700 dark:text-green-600 hover:underline"
            >
              March Madness Predictor
            </a>
          </p>
          <p className="text-zinc-600 dark:text-zinc-400">
            My annual attempt to crack March Madness with historical data. Proud
            winner of the $100 grand prize in my Jersey Shore friends&apos; 2026 pool.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-s uppercase tracking-widest text-green-900 dark:text-green-100 mb-6">
          Writing
        </h2>
        <p className="text-zinc-400 dark:text-zinc-600">Nothing here yet.</p>
      </section>

      <section className="mb-20">
        <h2 className="text-s uppercase tracking-widest text-green-900 dark:text-green-100 mb-6">
          Contact
        </h2>
        <div className="flex items-center gap-4 mb-4">
          <a
            href="mailto:aob55992@gmail.com"
            className="text-green-700 dark:text-green-400 hover:underline text-zinc-600 dark:text-zinc-300"
          >
            aob55992@gmail.com
          </a>
          <span className="text-zinc-300 dark:text-zinc-600">·</span>
          <a
            href="/OBRIEN_AIDAN_RESUME.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 dark:text-zinc-500 hover:text-green-700 dark:hover:text-green-600 transition-colors"
          >
            Resume
          </a>
        </div>
        <div className="flex gap-4 text-zinc-400 dark:text-zinc-500 text-xs">
          <a
            href="https://github.com/aidanobrien5599"
            className="hover:text-green-700 dark:hover:text-green-600 transition-colors"
          >
            GitHub
          </a>
          <span>·</span>
          <a
            href="https://www.linkedin.com/in/aidan-o-brien-393486274/"
            className="hover:text-green-700 dark:hover:text-green-600 transition-colors"
          >
            LinkedIn
          </a>
          <span>·</span>
          <a
            href="https://chess.com/member/aidanob917"
            className="hover:text-green-700 dark:hover:text-green-600 transition-colors"
          >
            Chess.com
          </a>
        </div>
      </section>

      <footer className="pt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-300 dark:text-zinc-700">
        {new Date().getFullYear()} — Aidan O&apos;Brien v3
      </footer>
    </main>
  );
}
