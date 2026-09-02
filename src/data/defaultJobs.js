// Seed dataset of scraped tech jobs across multiple platforms

export const DEFAULT_JOBS = [
  {
    id: "job-001",
    title: "Senior Vue.js / Frontend Architect",
    company: "Vercel Labs",
    companyLogo: "VL",
    logoBg: "linear-gradient(135deg, #000000, #333333)",
    location: "Remote (Worldwide)",
    isRemote: true,
    platform: "LinkedIn",
    platformUrl: "https://www.linkedin.com/jobs/view/vue-architect",
    salary: { min: 165000, max: 210000, currency: "USD", formatted: "$165k - $210k/yr" },
    type: "Full-time",
    experienceLevel: "Senior",
    tags: ["Vue.js", "Vite", "TypeScript", "Pinia", "Microfrontends"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18m ago
    description: `We are looking for a Senior Vue.js Frontend Architect to spearhead next-generation developer tooling interfaces. You will collaborate with platform engineers, designers, and developer experience advocates to build ultra-fast, reactive web applications serving millions of developers.`,
    responsibilities: [
      "Architect and scale modular Vue 3 + Vite applications with strict TypeScript standards.",
      "Optimize bundle performance, web vitals, hydration speed, and reactive state stores.",
      "Design reusable design-system component libraries and documentation.",
      "Mentor junior and mid-level frontend engineers through thorough code reviews."
    ],
    requirements: [
      "5+ years of production experience in Vue.js (Vue 3, Composition API, Pinia).",
      "Deep understanding of Vite build plugins, SSR/SSG patterns, and browser runtime performance.",
      "Exceptional TypeScript skills and modern CSS architecture (CSS Variables, Container Queries).",
      "Experience with automated testing (Vitest, Playwright/Cypress)."
    ],
    benefits: [
      "100% remote flexibility with home-office equipment budget ($3,000)",
      "Comprehensive health, dental, and vision insurance coverage",
      "Unlimited PTO with mandatory 3-week minimum",
      "$2,500 annual learning and conference stipend"
    ],
    status: null
  },
  {
    id: "job-002",
    title: "Full-Stack Web Scraper & Automation Engineer",
    company: "DataPulse Intelligence",
    companyLogo: "DP",
    logoBg: "linear-gradient(135deg, #0ea5e9, #2563eb)",
    location: "New York, NY (Hybrid)",
    isRemote: false,
    platform: "Indeed",
    platformUrl: "https://www.indeed.com/viewjob?jk=scraper-eng",
    salary: { min: 140000, max: 175000, currency: "USD", formatted: "$140k - $175k/yr" },
    type: "Full-time",
    experienceLevel: "Mid",
    tags: ["Python", "Playwright", "Puppeteer", "Vue.js", "Node.js", "Docker"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42m ago
    description: `DataPulse is seeking a talented Automation and Web Scraping Engineer to design resilient data pipelines extracting millions of records daily across complex dynamic single-page applications.`,
    responsibilities: [
      "Build and maintain distributed crawlers utilizing Playwright, Puppeteer, and Scrapy.",
      "Bypass anti-bot mechanisms, Cloudflare challenges, and dynamic captcha solutions ethically.",
      "Develop internal monitoring dashboards with Vue 3 and Node.js for crawler health.",
      "Ensure extracted data compliance, deduplication, and streaming ingestion into ClickHouse."
    ],
    requirements: [
      "3+ years experience with large-scale web scraping and headless browser orchestration.",
      "Fluency in Python, JavaScript/Node.js, and proxy pool management (residential & mobile).",
      "Familiarity with Vue.js or similar reactive frontend for building monitoring tools.",
      "Strong knowledge of HTTP headers, TLS fingerprinting, and DOM query optimizations."
    ],
    benefits: [
      "Hybrid flexibility (2 days office, 3 days remote)",
      "401(k) matching up to 5%",
      "Catered lunches & wellness subsidy",
      "Stock option grants"
    ],
    status: null
  },
  {
    id: "job-003",
    title: "Lead Vue & Node.js Engineer",
    company: "Supabase Partner Network",
    companyLogo: "SP",
    logoBg: "linear-gradient(135deg, #10b981, #059669)",
    location: "Remote (US/EU)",
    isRemote: true,
    platform: "RemoteOK",
    platformUrl: "https://remoteok.com/remote-jobs/supabase-lead-vue",
    salary: { min: 170000, max: 220000, currency: "USD", formatted: "$170k - $220k/yr" },
    type: "Full-time",
    experienceLevel: "Lead",
    tags: ["Vue.js", "Node.js", "PostgreSQL", "Supabase", "TailwindCSS"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
    description: `Join an agile team building real-time collaboration tools on top of Supabase and Vue 3. As Lead Engineer, you'll guide architecture, code quality, and engineering velocity.`,
    responsibilities: [
      "Lead the engineering roadmap for customer-facing data visualization interfaces.",
      "Integrate PostgreSQL Row Level Security (RLS) with responsive Vue frontends.",
      "Champion CI/CD automation, unit testing, and end-to-end integration workflows.",
      "Partner with product managers to deliver features from conceptual wireframe to production."
    ],
    requirements: [
      "6+ years of full-stack engineering with deep mastery of Vue 3 and Node.js.",
      "Experience leading small teams (3-5 engineers) and establishing technical standards.",
      "Deep understanding of relational database modeling and WebSocket streaming.",
      "Proven track record of shipping production SaaS products."
    ],
    benefits: [
      "Competitive base salary + equity compensation",
      "Flexible working hours across timezone overlaps",
      "Generous health and parental leave packages",
      "Company retreats twice a year in Europe/Americas"
    ],
    status: null
  },
  {
    id: "job-004",
    title: "Frontend Developer (Vue 3 / Nuxt)",
    company: "GitLab Ecosystem",
    companyLogo: "GL",
    logoBg: "linear-gradient(135deg, #f97316, #ea580c)",
    location: "Remote (Worldwide)",
    isRemote: true,
    platform: "WeWorkRemotely",
    platformUrl: "https://weworkremotely.com/jobs/gitlab-ecosystem-vue",
    salary: { min: 125000, max: 155000, currency: "USD", formatted: "$125k - $155k/yr" },
    type: "Full-time",
    experienceLevel: "Mid",
    tags: ["Vue 3", "Nuxt.js", "GraphQL", "GitLab CI", "Jest"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    description: `We are scaling our core platform and looking for a product-minded Frontend Developer proficient with Vue 3, Nuxt, and GraphQL to create intuitive developer tools.`,
    responsibilities: [
      "Implement user flows for CI/CD pipeline visualizers and merge request diff viewers.",
      "Migrate legacy components to Vue 3 Composition API with full TypeScript support.",
      "Ensure high accessibility (WCAG AA) standards across all interactive interfaces."
    ],
    requirements: [
      "3+ years building responsive SPAs with Vue.js.",
      "Familiarity with Nuxt.js, SSR, and GraphQL query caching.",
      "Commitment to clean code, component modularity, and automated testing."
    ],
    benefits: [
      "Work from anywhere in the world",
      "Flexible schedule and asynchronous culture",
      "Comprehensive global healthcare coverage"
    ],
    status: null
  },
  {
    id: "job-005",
    title: "AI Integrations & Vue Engineer",
    company: "Synthesia AI",
    companyLogo: "SA",
    logoBg: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    location: "London, UK (Remote Eligible)",
    isRemote: true,
    platform: "Wellfound",
    platformUrl: "https://wellfound.com/jobs/synthesia-ai-vue",
    salary: { min: 130000, max: 165000, currency: "USD", formatted: "$130k - $165k/yr" },
    type: "Full-time",
    experienceLevel: "Mid",
    tags: ["Vue.js", "OpenAI API", "WebSockets", "Canvas API", "TypeScript"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    description: `Build bleeding-edge generative AI video and canvas interfaces powered by Vue 3, WebGPU, and LLM streaming protocols.`,
    responsibilities: [
      "Create interactive video generation timeline interfaces with Vue and HTML5 Canvas.",
      "Stream token responses and real-time generation previews to end users.",
      "Optimize client-side memory footprint for large multimedia rendering canvases."
    ],
    requirements: [
      "Experience with Vue 3 reactive system and custom canvas / WebGL rendering.",
      "Experience interacting with LLM APIs, WebSockets, and Server-Sent Events.",
      "Strong visual sensibility and eye for animation polish."
    ],
    benefits: [
      "Competitive equity stake in high-growth AI startup",
      "Choice of top-tier hardware (M3 Max MacBook Pro)",
      "Annual team offsites in the Swiss Alps"
    ],
    status: null
  },
  {
    id: "job-006",
    title: "Junior / Entry Frontend Web Scraper",
    company: "MarketScout Analytics",
    companyLogo: "MS",
    logoBg: "linear-gradient(135deg, #06b6d4, #0891b2)",
    location: "Austin, TX (Remote)",
    isRemote: true,
    platform: "LinkedIn",
    platformUrl: "https://www.linkedin.com/jobs/view/marketscout-junior",
    salary: { min: 85000, max: 105000, currency: "USD", formatted: "$85k - $105k/yr" },
    type: "Full-time",
    experienceLevel: "Entry",
    tags: ["JavaScript", "Cheerio", "Vue.js", "REST APIs", "Regex"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
    description: `Ideal role for an ambitious junior developer wanting to master data extraction, browser automation, and modern Vue web interfaces.`,
    responsibilities: [
      "Write and maintain site-specific scrapers using Cheerio, Puppeteer, and Axios.",
      "Inspect network waterfalls and reverse-engineer internal mobile and web APIs.",
      "Contribute to our internal Vue 3 analytics portal for monitoring scrape health."
    ],
    requirements: [
      "Solid foundation in JavaScript (ES6+), DOM manipulation, and CSS selectors.",
      "Basic experience with Vue.js or similar reactive library.",
      "Strong debugging curiosity and problem-solving mindset."
    ],
    benefits: [
      "Direct mentorship from Principal scraping engineers",
      "Flexible remote hours",
      "Full benefits package + 401(k)"
    ],
    status: null
  },
  {
    id: "job-007",
    title: "Senior Cloud & Scraper Infrastructure Engineer",
    company: "OctoCrawl Cloud",
    companyLogo: "OC",
    logoBg: "linear-gradient(135deg, #ec4899, #be185d)",
    location: "San Francisco, CA (Hybrid)",
    isRemote: false,
    platform: "Indeed",
    platformUrl: "https://www.indeed.com/viewjob?jk=octocrawl-infra",
    salary: { min: 180000, max: 230000, currency: "USD", formatted: "$180k - $230k/yr" },
    type: "Full-time",
    experienceLevel: "Senior",
    tags: ["Kubernetes", "Golang", "Python", "Proxy Management", "Redis"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    description: `Help us scale a planetary scraping infrastructure processing 500 million web requests every single day.`,
    responsibilities: [
      "Manage Kubernetes clusters running tens of thousands of headless browser worker pods.",
      "Build intelligent proxy rotation and IP reputation algorithms.",
      "Reduce latency and infrastructure cost across AWS and GCP multi-region clusters."
    ],
    requirements: [
      "5+ years backend / infrastructure experience with Go or Python.",
      "Extensive experience with Kubernetes, Redis, Kafka, and distributed queues.",
      "Deep understanding of networking protocols, HTTP/2, HTTP/3, and TLS handshakes."
    ],
    benefits: [
      "Top-tier compensation package with meaningful equity",
      "Comprehensive medical, dental, vision, life insurance",
      "Free daily gourmet meals at SF headquarters"
    ],
    status: null
  },
  {
    id: "job-008",
    title: "Vue & Nuxt UI/UX Designer-Developer",
    company: "Creative Studio Neon",
    companyLogo: "CN",
    logoBg: "linear-gradient(135deg, #f59e0b, #d97706)",
    location: "Berlin, Germany (Remote)",
    isRemote: true,
    platform: "RemoteOK",
    platformUrl: "https://remoteok.com/remote-jobs/neon-creative-vue",
    salary: { min: 110000, max: 140000, currency: "EUR", formatted: "€110k - €140k/yr" },
    type: "Full-time",
    experienceLevel: "Mid",
    tags: ["Vue 3", "GSAP", "TailwindCSS", "Figma", "Three.js"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    description: `Bring high-end designs to life with smooth micro-interactions, 3D elements, and reactive Vue architectures.`,
    responsibilities: [
      "Translate Figma prototypes into pixel-perfect Vue 3 components.",
      "Implement buttery-smooth scroll animations using GSAP and CSS animations.",
      "Work closely with creative directors to push the boundaries of digital experiences."
    ],
    requirements: [
      "Strong portfolio demonstrating exceptional eye for typography, layout, and motion.",
      "3+ years of Vue.js development experience.",
      "Experience with WebGL or Three.js is a strong plus."
    ],
    benefits: [
      "Flexible schedule and autonomous working style",
      "Annual studio retreat in Mallorca",
      "Hardware allowance renewed every 2 years"
    ],
    status: null
  }
];
