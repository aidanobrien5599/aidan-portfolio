import sidefolioMoonbeam from "public/images/sidefolio-moonbeam.png";
import sidefolioMoonbeam2 from "public/images/sidefolio-moonbeam-2.png";
import sidefolioTailwindMasterKit from "public/images/sidefolio-tailwindmasterkit.png";
import sidefolioTailwindMasterKit2 from "public/images/sidefolio-tailwindmasterkit-2.png";
import sidefolioNoteGPT from "public/images/NoteGPT.png";
import sidefolioNoteGPT2 from "public/images/NoteGPT2.png";
import sidefolioTeeko2 from "public/images/sidefolio-teeko2.png";
import sidefolioInvestmentCalc from "public/images/sidefolio-investmentcalc.png";
import sidefolioInvestmentCalc2 from "public/images/sidefolio-investmentcalc2.jpg";
import sidefolioInvestmentCalc3 from "public/images/sidefolio-investmentcalc3.png";
import sidefolioSocialMedia from "public/images/sidefolio-socialmedia.png";
import heapSimulator from "public/images/heap-simulator.png";
import additionIcon from "public/images/NodePackage.png";
import sidefolioBadgerBase from "public/images/BadgerBase.png";
import sidefolioBadgerBase2 from "public/images/BadgerBaseScreenshot.png";

export const products = [

  {


    
    href: "https://badgerbase.app",
    linktype: "Demo",
    title: "BadgerBase",
    description: "A web app with 2000+ users helping UW-Madison students find the best courses.",
    thumbnail: sidefolioBadgerBase,
    images: [sidefolioBadgerBase, sidefolioBadgerBase2],
    stack: ["Next.js", "Railway", "API Development", "MySQL", "Vercel", "TypeScript"],
    slug: "badgerbase",
    content: (
      <div>
        <p>
        With<strong> over 2000 users</strong>, BadgerBase is a comprehensive data aggregator that revolutionizes the course search experience at UW-Madison. Sourcing data from UW-Madison&apos;s live course catalog, Rate My Professor, and Madgrades for an all-in-one course search experience.

         
        </p>
        <p>
          I built the backend with automated data collection pipelines by reverse engineering the source websites APIs. 
          The MySQL database is hosted on Railway, ads well as the API server. 
      
        </p>
        <p>
          The frontend is built with Next.js, Tailwind CSS, and Shadcn/UI hosted on Vercel.
        </p>
      </div>
    ),
  },
  {



    href: "https://github.com/aidanobrien5599/TeekoAI",
    linktype: "Github",
    title: "Teeko AI Bot",
    description: "A strategic board game powered by a minimax AI bot.",
    thumbnail: sidefolioTeeko2,
    images: [],
    stack: ["Python", "Minimax", "AI", "Game Dev"],
    slug: "teeko-ai-bot",
    content: (
      <div>
        <p>
          Teeko is a two-player abstract strategy game that was solved in 1998
          by Guy Steele using a supercomputer. Since I only had a MacBook, I
          couldn&#39;t brute-force the solution — so I took a smarter route.
        </p>
        <p>
          I implemented a <strong>minimax algorithm</strong> to simulate and
          evaluate the game tree, using a custom{" "}
          <strong>heuristic function</strong> to approximate the best move at
          each turn. Guardrails were added to prevent obvious mistakes in
          crucial scenarios, ensuring a consistent and competitive AI.
        </p>
        <p>
          The current version runs in the command line, but I&#39;m actively working
          on a <strong>web-based GUI</strong> so anyone can play against the AI
          in a live demo. The was my favorite project from my Artificial Intelligence class.
        </p>
      </div>
    ),
  },
  {
    href: "https://notegpt-87917.web.app/",
    linktype: "Demo",
    title: "NoteGPT",
    description: "AI-assisted WYSIWYG note taking app",
    thumbnail: sidefolioNoteGPT,
    images: [sidefolioNoteGPT, sidefolioNoteGPT2],
    stack: ["React", "Firebase", "MaterialUI"],
    slug: "notegpt",
    content: (
      <div>
        <p>
          Have you ever struggled to keep up with fast-paced lectures while
          taking notes? NoteGPT is an AI-assisted WYSIWYG note-taking app
          designed to solve that problem by enhancing your writing with
          real-time GPT-powered language suggestions. Built using React,
          Firebase, and Material UI, NoteGPT integrates a modern, intuitive
          interface with the intelligence of LLMs.
        </p>
        <p>
          Users can log in securely using Firebase Authentication, and all notes
          are saved and synced in real-time using Firestore, ensuring a seamless
          cross-device experience. The app features an autoAI toggle, allowing
          users to enable or disable autocomplete suggestions dynamically.
          Confirming AI-generated completions is as simple as pressing the Tab
          or Alt key, making note-taking smoother and smarter.
        </p>{" "}
        <p>
          While still a prototype, NoteGPT was my first deep dive into
          cloud-based web development, teaching me how to manage user sessions,
          real-time databases, and deploy production-ready full-stack
          applications. It demonstrates the power of combining frontend
          technology with intelligent backend services to create a truly helpful
          educational tool.{" "}
        </p>
      </div>
    ),
  },
  {
    href: "https://deploymentcalc.vercel.app/",
    linktype: "Demo",
    title: "Investment Forecaster",
    description:
      "Python-powered investment forecasting tool with Flask integration",
    thumbnail: sidefolioInvestmentCalc2,
    images: [sidefolioInvestmentCalc, sidefolioInvestmentCalc3],
    stack: ["Python", "Flask", "SQL", "Numpy", "Matplotlib", "Jinja"],
    slug: "investmentcalc",
    content: (
      <div>
        <p>
          Originally developed as my final project for AP Computer Science
          Principles back in sophomore year of high school, Stock Forecaster is
          a fully-featured financial calculator and investment visualization
          tool. It accepts user-defined parameters such as initial investment,
          annual contribution, growth rate, and time horizon to compute future
          value projections.
        </p>
        <p>
          The backend is built with <strong>Python</strong>, leveraging{" "}
          <strong>Numpy</strong> for compound interest calculations and{" "}
          <strong>Matplotlib</strong> for generating detailed, year-by-year
          investment growth graphs. As I began exploring web development
          recently, I revisited the project and connected it to a{" "}
          <strong>Flask</strong> backend with a <strong>Jinja</strong>-templated
          frontend, styled for usability and clarity.
        </p>
        <p>
          A <strong>SQL database</strong> was added to persist user scenarios
          and allow retrieval of past forecasts. The project taught me
          foundational principles of full-stack development and how to combine
          data science, financial modeling, and modern web frameworks into one
          cohesive application.
        </p>
      </div>
    ),
  },
  {
    href: "https://github.com/aidanobrien5599/Social-Media-App",
    linktype: "Github",
    title: "SocialNet Prototype",
    description:
      "Social media prototype with RESTful API and full CRUD support",
    thumbnail: sidefolioSocialMedia,
    images: [],
    stack: ["React", "Flask", "SQLAlchemy", "Axios"],
    slug: "socialnet",
    content: (
      <div>
        <p>
          SocialNet is a prototype for a simple social media platform featuring
          a <strong>RESTful API</strong> backend built with{" "}
          <strong>Flask</strong> and a modern <strong>React</strong> frontend.
          The app supports full <strong>CRUD operations</strong>—allowing users
          to register, log in, post content, and manage profiles—through
          structured <strong>Axios</strong> requests to the backend API.
        </p>
        <p>
          User data and posts are stored using <strong>SQLAlchemy</strong>, and
          user authentication is handled securely through Flask sessions. The
          project emphasizes a clean separation of concerns between backend
          logic, API routing, and frontend state management.
        </p>
        <p>
          While the app is not intended for production use, building this
          project helped me grasp the challenges of managing a multilanguage
          codebase and designing layered architectures. It served as a valuable
          introduction to <strong>system design</strong>,{" "}
          <strong>API integration</strong>, and cross-stack communication.
        </p>
      </div>
    ),
  },
  {
    href: "",
    linktype: "None",
    title: "Heap Simulator",
    description: "Memory allocator with best-fit strategy and block coalescing",
    thumbnail: heapSimulator,
    images: [],
    stack: ["C", "Memory Management", "Systems Programming"],
    slug: "heap-simulator",
    content: (
      <div>
        <p>
          This project involved developing a{" "}
          <strong>heap memory simulator</strong> from scratch, replicating how
          low-level memory allocation works in modern systems. Each memory block
          in the simulator consists of a header, payload, and footer, and memory
          is allocated in 8-byte aligned chunks to mimic real-world constraints.
        </p>
        <p>
          The allocator implements a best-fit allocation strategy: when a memory
          request is made, the system searches the free list and selects the
          block that most closely matches the requested size. To make the most
          of available space, the simulator supports free block splitting
          (breaking up larger blocks) and block coalescing (merging adjacent
          free blocks when necessary).
        </p>
        <p>
          This project deepened my understanding of{" "}
          <strong>dynamic memory management</strong>, memory alignment,
          fragmentation, and the internal design of allocators like malloc.
          Though not open-source due to academic policies, this simulator
          reflects my foundational experience in{" "}
          <strong>systems programming</strong> and efficient data structure
          manipulation. This project my favorite from my Computer Systems and Organization class.
        </p>
      </div>
    ),
  },
  {
    href: "https://aidanobrien.docs.buildwithfern.com/get-started/getting-started",
    linktype: "Docs",
    title: "useless-addition-package",
    description:
      "A simple project built to learn Fern Docs and NPM publishing.",
    thumbnail: additionIcon, // Replace this with your actual image or asset
    images: [],
    stack: ["JavaScript", "NPM", "Fern", "MDX"],
    slug: "useless-addition-package",
    content: (
      <div>
        <p>
          The <strong>useless-addition-package</strong> is a deliberately simple
          JavaScript package that exports a single `add` function. The real
          purpose of this project wasn&#39;t the functionality; it was to learn how
          to:
        </p>
        <ul>
          <li>
            Build and publish a package to the <strong>NPM registry</strong>
          </li>
          <li>
            Write developer documentation in <strong>MDX</strong>
          </li>
          <li>
            Use <strong>Fern</strong> to generate and deploy modern API
            documentation
          </li>
          <li>Host docs at a custom Fern subdomain</li>
        </ul>
        <p>
          The result is a working package — even if trivial — with fully hosted
          docs at{" "}
          <a
            href="https://aidanobrien.docs.buildwithfern.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            aidanobrien.docs.buildwithfern.com
          </a>
          .
        </p>

        <p>You can install the package via:</p>
        <pre>
          <code>npm install useless-addition-package</code>
        </pre>

        <p>And use it like this:</p>
        <pre>
          <code>{`const { add } = require("useless-addition-package");
    console.log(add(2, 3)); // 5`}</code>
        </pre>

        <p>
          This project solidified my understanding of the JavaScript packaging
          ecosystem, open-source publishing, and the power of developer tools
          like Fern for writing and hosting technical documentation.
        </p>
      </div>
    ),
  },
];
