const work = [
  {
    year: "2025",
    company: "Netflix",
    title: "Software Engineer, Retention",
    note: "incoming",
  },
  {
    year: "2025",
    company: "Intelligible",
    title: "Founding Engineer, Data Connectors",
    note: null,
  },
  {
    year: "2024",
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
  {
    year: "2024",
    company: "UW–Madison",
    title: "Research Assistant",
    note: null,
  },
];

export default function Home() {
  return (
    <main className="max-w-xl mx-auto px-6 py-20 text-sm leading-relaxed">
      <header className="mb-16">
        <h1 className="text-base font-medium text-gray-900 dark:text-gray-50 mb-1">
          Aidan O&apos;Brien{" "}
          <span className="text-green-600 dark:text-green-500 text-xs">☘</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Software engineer. Computer science @ UW–Madison.
        </p>
      </header>

      <section className="mb-16 space-y-4 text-gray-600 dark:text-gray-300">
        <p>
          I&apos;m an incoming software engineer at{" "}
          <span className="text-gray-900 dark:text-gray-100">Netflix</span>,
          joining the retention team this summer. Before that I was a founding
          engineer at{" "}
          <span className="text-gray-900 dark:text-gray-100">Intelligible</span>
          , building data connectors for an early-stage AI company.
        </p>
        <p>
          I&apos;ve also interned at{" "}
          <span className="text-gray-900 dark:text-gray-100">CargoLabs</span>{" "}
          and{" "}
          <span className="text-gray-900 dark:text-gray-100">Collectwise</span>{" "}
          (YC F&apos;24), and done ML research at school on generative AI and
          diffusion models.
        </p>
        <p>
          Outside of work I train Brazilian Jiu-Jitsu, play chess, and read more
          than I write — working on fixing that last one.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-green-700 dark:text-green-500 mb-6">
          Work
        </h2>
        <div className="space-y-3">
          {work.map((job, i) => (
            <div key={i} className="flex gap-6 text-gray-600 dark:text-gray-300">
              <span className="text-gray-400 dark:text-gray-600 w-10 flex-shrink-0">
                {job.year}
              </span>
              <span>
                <span className="text-gray-900 dark:text-gray-100">
                  {job.company}
                </span>
                {" · "}
                {job.title}
                {job.note && (
                  <span className="text-green-600 dark:text-green-500 text-xs ml-2">
                    {job.note}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-green-700 dark:text-green-500 mb-6">
          Projects
        </h2>
        <div>
          <p className="mb-2">
            <a
              href="https://badgerbase.app"
              className="text-green-700 dark:text-green-400 hover:underline"
            >
              BadgerBase
            </a>
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            A course discovery tool for UW–Madison students. 2,000+ users use
            it to find, compare, and plan courses. Built with Next.js on top of
            a custom data pipeline scraping the university&apos;s course catalog.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-widest text-green-700 dark:text-green-500 mb-6">
          Writing
        </h2>
        <p className="text-gray-400 dark:text-gray-600">Nothing here yet.</p>
      </section>

      <section className="mb-20">
        <h2 className="text-xs uppercase tracking-widest text-green-700 dark:text-green-500 mb-6">
          Contact
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          <a
            href="mailto:aob55992@gmail.com"
            className="text-green-700 dark:text-green-400 hover:underline"
          >
            aob55992@gmail.com
          </a>
        </p>
        <div className="flex gap-4 text-gray-400 dark:text-gray-500 text-xs">
          <a
            href="https://github.com/aidanobrien5599"
            className="hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            GitHub
          </a>
          <span>·</span>
          <a
            href="https://www.linkedin.com/in/aidan-o-brien-393486274/"
            className="hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            LinkedIn
          </a>
          <span>·</span>
          {/* TODO: replace YOUR_USERNAME with your chess.com handle */}
          <a
            href="https://chess.com/member/YOUR_USERNAME"
            className="hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            chess.com
          </a>
        </div>
      </section>

      <footer className="pt-8 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-300 dark:text-gray-700">
        {new Date().getFullYear()} — Aidan O&apos;Brien
      </footer>
    </main>
  );
}
