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
import sidefolioWSH from "public/images/bashgrep.png";
import sidefolioGRPC from "public/images/address-search.png";

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
          The app relies on cron based automated data collection pipelines that utilize reverse engineering of the source websites APIs. These pipelines are triggered by GitHub Actions, and run every 12 hours. 
          After the data is extractored and transormed into usable form, it is dumped into a MySQL database on Railway. 
      
        </p>
        <p>
          From there, the data is served to the frontend via a RESTful API built with Hono on Bun runtime and hosted on Railway. The frontend is built with Next.js, Tailwind CSS, and Shadcn/UI hosted on Vercel.
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

    href: "",
    linktype: "None",
    title: "WSH Shell",
    description: "A Linux Shell made from scratch in C.",
    thumbnail: sidefolioWSH,
    images: [],
    stack: ["C", "Docker", "Systems Programming"],
    slug: "wsh-shell",
    content: (
      <div>
        <p>
          For my Operating Systems class, I built a Linux Shell called wsh from scratch in C. The shell supports the following features:
          <br />
          <ul>
            <li>
              built in commands for exit, alias, unalias, history, which, path, and cd
            </li>
            <li>
              batch mode and interactive mode execution 
            </li>
            <li>
              piping of commands
            </li>
            <li>
              support for external commands and external processes
            </li>
          
          </ul>
          
        </p>
        <p>
          The shell is built with several files, a massive main .c file with the main program, and several other files for implementation of necessary data structures needed (dynamic array for history and hash table for aliases). Along with this were subsequent .h files. Testing was done using a combination of valgrind and given test cases to be run in a Docker container.
        </p>
        <p>
          Some challenges I faced were ensuring that the shell was able to handle all of the edge cases of the commands, properly preventing memory leaks, and all the different error cases that could arise. Piping was a particularly challenging feature to implement due to technical complexity of the system calls needed (dup2, fork, waitpid, etc.), making the code not entirely intuitive to understand.
        </p>
        <p>
          This certainly has been my favorite project thus far in Operating Systems because it has demystified the internals of shells like bash and zsh that I have used for years.
        </p>
      </div>
    ),
  },

  {
    href: "https://github.com/yourusername/grpc-containers-project",
    linktype: "GitHub",
    title: "Address Search",
    description: "A multi-container distributed system with gRPC, load balancing, and LRU caching for Madison property lookups.",
    thumbnail: sidefolioGRPC,
    images: [],
    stack: ["Python", "gRPC", "Docker", "Flask", "Protocol Buffers"],
    slug: "grpc-fault-tolerant-system",
    content: (
      <div>
        <p>
          For my Big Data Systems class, I built a fault-tolerant distributed system that serves Madison property addresses through a multi-container architecture. This project introduced me to the fascinating world of building resilient systems that can gracefully handle failures.
          <br />
          The system consists of two layers:
          <ul>
            <li>
              <strong>Dataset Layer:</strong> Two replicated gRPC servers hosting the complete Madison address dataset, ensuring data availability even if one server fails
            </li>
            <li>
              <strong>Cache Layer:</strong> Three HTTP servers with built-in LRU caches that distribute requests across dataset servers and implement retry logic with exponential backoff
            </li>
            <li>
              Load balancing through round-robin request distribution between dataset replicas
            </li>
            <li>
              Automatic failover with up to 5 retry attempts when servers go down
            </li>
            <li>
              LRU cache of size 3 storing 8 addresses per zipcode to reduce dataset server load
            </li>
          </ul>
        </p>
        <p>
          The architecture uses Protocol Buffers for efficient serialization, gRPC for high-performance inter-service communication, and Flask for the HTTP interface. Everything is orchestrated with Docker Compose, making the entire system reproducible and deployable with a single command.
        </p>
        <p>
          What fascinated me most was designing the retry logic and cache invalidation strategy. When a dataset server fails, the cache layer automatically routes requests to the healthy server after a 100ms sleep. The LRU cache ensures that even if all dataset servers are down, users can still access recently queried zipcodes, providing graceful degradation rather than complete failure.
        </p>
        <p>
          This project opened my eyes to the complexities of distributed systems and fault tolerance. It made me reflect on <strong>BadgerBase</strong>, my course search platform serving 2000+ UW-Madison students. Currently, BadgerBase runs on a single-server architecture with a MySQL database on Railway and a Hono API, both hosted on single instances. While the GitHub Actions-based data pipelines provide some resilience through scheduled retries, the core infrastructure lacks the redundancy I implemented in this gRPC project.
        </p>
        <p>
          Moving forward, I&apos;m considering how to apply these fault-tolerance principles to BadgerBase. Some ideas include:
          <ul>
            <li>Implementing read replicas for the MySQL database to handle increased load and provide failover capability</li>
            <li>Adding a Redis caching layer similar to the LRU cache in this project to reduce database queries</li>
            <li>Deploying multiple API server instances behind a load balancer</li>
            <li>Setting up health checks and automatic container restarts</li>
          </ul>
        </p>
        <p>
          Building fault-tolerant systems is incredibly exciting to me because it&apos;s about designing for reality—systems fail, networks partition, and servers crash. Creating software that anticipates and handles these failures gracefully is both an engineering challenge and an art form. This project was just the beginning of my journey into distributed systems, and I can&apos;t wait to apply these lessons to make BadgerBase more resilient for its growing user base.
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
