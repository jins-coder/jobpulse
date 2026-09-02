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
  },
  {
    id: "job-009",
    title: "Senior PHP / Laravel Backend Engineer",
    company: "Razorpay",
    companyLogo: "RZ",
    logoBg: "linear-gradient(135deg, #0c2340, #0070ba)",
    location: "Bengaluru, Karnataka, India",
    isRemote: false,
    platform: "LinkedIn",
    platformUrl: "https://www.linkedin.com/jobs/view/razorpay-senior-php",
    salary: { min: 2400000, max: 3600000, currency: "INR", formatted: "₹24L - ₹36L/yr" },
    type: "Full-time",
    experienceLevel: "Senior",
    tags: ["PHP", "Laravel", "MySQL", "Redis", "REST APIs", "AWS"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    description: `Razorpay is India's leading fintech unicorn processing billions in online payments. We are looking for a Senior PHP / Laravel Engineer to scale high-throughput core transaction routing engines and financial ledger microservices.`,
    responsibilities: [
      "Architect and maintain high-volume transaction processing microservices using PHP 8.2+ and Laravel.",
      "Design zero-latency MySQL schemas, partitioning strategies, and Redis caching layers.",
      "Integrate banking partner APIs with idempotency guarantees, webhooks, and circuit breakers.",
      "Collaborate with security and compliance teams to ensure PCI-DSS standards."
    ],
    requirements: [
      "5+ years of robust backend development experience in PHP and Laravel.",
      "Solid understanding of relational database indexing, ACID compliance, and concurrency locking.",
      "Familiarity with distributed caching, queue workers (Horizon/RabbitMQ), and containerized deployments."
    ],
    benefits: [
      "Competitive salary with high-growth ESOP grants",
      "Comprehensive family health insurance with parent coverage",
      "Annual learning & professional certification reimbursement",
      "Flexible hybrid model with cab allowance in Bengaluru"
    ],
    status: null
  },
  {
    id: "job-010",
    title: "Full-Stack Engineer (PHP & Vue.js)",
    company: "Zoho Corporation",
    companyLogo: "ZH",
    logoBg: "linear-gradient(135deg, #e11d48, #be123c)",
    location: "Chennai, Tamil Nadu, India",
    isRemote: false,
    platform: "Indeed",
    platformUrl: "https://www.indeed.com/viewjob?jk=zoho-fullstack-php-vue",
    salary: { min: 1600000, max: 2600000, currency: "INR", formatted: "₹16L - ₹26L/yr" },
    type: "Full-time",
    experienceLevel: "Mid",
    tags: ["PHP", "Vue.js", "Laravel", "PostgreSQL", "JavaScript", "REST APIs"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    description: `Join Zoho's SaaS product engineering team building cloud business applications used by over 100 million users worldwide. You will craft responsive SPAs with Vue and build reliable backend endpoints in modern PHP.`,
    responsibilities: [
      "Develop responsive user interfaces using Vue 3 and modern frontend build tools.",
      "Build secure RESTful APIs and business logic modules using modern object-oriented PHP.",
      "Optimize SQL queries on multi-terabyte PostgreSQL clusters.",
      "Participate in product architecture discussions from design to production release."
    ],
    requirements: [
      "3+ years of experience with PHP and modern frontend frameworks (Vue or React).",
      "Strong proficiency in JavaScript (ES6+), CSS3, and DOM manipulation.",
      "Hands-on experience with relational databases and API design."
    ],
    benefits: [
      "On-campus gourmet cafeteria with free breakfast, lunch & dinner",
      "Transport facilities across Chennai hubs",
      "Annual performance bonuses and career progression frameworks"
    ],
    status: null
  },
  {
    id: "job-011",
    title: "Lead PHP / Symfony Microservices Architect",
    company: "Swiggy",
    companyLogo: "SW",
    logoBg: "linear-gradient(135deg, #fc8019, #e65100)",
    location: "Bengaluru / Remote (India)",
    isRemote: true,
    platform: "LinkedIn",
    platformUrl: "https://www.linkedin.com/jobs/view/swiggy-php-architect",
    salary: { min: 3800000, max: 5500000, currency: "INR", formatted: "₹38L - ₹55L/yr" },
    type: "Full-time",
    experienceLevel: "Lead",
    tags: ["PHP", "Symfony", "Kafka", "Docker", "Kubernetes", "Redis", "Microservices"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    description: `Swiggy is seeking an experienced Backend Architect to lead order dispatch and hyper-local logistics microservices built on high-performance PHP and Symfony frameworks.`,
    responsibilities: [
      "Lead architectural decisions for distributed backend services serving 100k+ concurrent delivery partners.",
      "Optimize Symfony and Swoole-based asynchronous PHP runtimes for sub-20ms response latencies.",
      "Drive observability standards across distributed tracing, Prometheus, and Grafana.",
      "Mentor 12+ backend developers across multiple cross-functional pods."
    ],
    requirements: [
      "7+ years of engineering experience with at least 4 years in high-scale PHP (Symfony or Laravel).",
      "Deep expertise in event-driven architectures with Apache Kafka or RabbitMQ.",
      "Demonstrated experience designing high-availability systems on AWS or GCP."
    ],
    benefits: [
      "Top-tier compensation with lucrative quarterly stock vesting",
      "100% remote flexibility with ergonomic setup allowance",
      "Generous food & grocery credits on Swiggy platform",
      "Comprehensive medical insurance including mental health support"
    ],
    status: null
  },
  {
    id: "job-012",
    title: "WordPress & Modern PHP Platform Engineer",
    company: "Automattic",
    companyLogo: "AT",
    logoBg: "linear-gradient(135deg, #0284c7, #0369a1)",
    location: "Remote (India & Global)",
    isRemote: true,
    platform: "RemoteOK",
    platformUrl: "https://remoteok.com/remote-jobs/automattic-wordpress-php",
    salary: { min: 2800000, max: 4200000, currency: "INR", formatted: "₹28L - ₹42L/yr" },
    type: "Full-time",
    experienceLevel: "Mid-Senior",
    tags: ["PHP", "WordPress", "Gutenberg", "React", "MySQL", "REST APIs"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    description: `Work from anywhere on the planet for Automattic, the company behind WordPress.com, WooCommerce, and Tumblr. We are seeking a passionate PHP engineer to enhance the open web.`,
    responsibilities: [
      "Develop custom WordPress themes, plugins, and Gutenberg editor blocks.",
      "Scale high-traffic WordPress VIP enterprise installations handling billions of monthly pageviews.",
      "Contribute to WordPress core open-source projects and community packages."
    ],
    requirements: [
      "4+ years of professional PHP engineering experience with deep WordPress internals expertise.",
      "Experience with modern JavaScript (React / Gutenberg block development).",
      "Strong written communication skills for asynchronous remote collaboration."
    ],
    benefits: [
      "Work from anywhere in India or the world with full remote autonomy",
      "Open vacation policy with no maximum limits",
      "Home office setup budget ($2,000) and coworking space stipend",
      "Annual global company retreats in exciting destinations"
    ],
    status: null
  },
  {
    id: "job-013",
    title: "Full-Stack PHP Developer (Laravel + Vue.js)",
    company: "Freshworks",
    companyLogo: "FW",
    logoBg: "linear-gradient(135deg, #f97316, #ea580c)",
    location: "Hyderabad, Telangana, India",
    isRemote: false,
    platform: "LinkedIn",
    platformUrl: "https://www.linkedin.com/jobs/view/freshworks-php-developer",
    salary: { min: 1800000, max: 2800000, currency: "INR", formatted: "₹18L - ₹28L/yr" },
    type: "Full-time",
    experienceLevel: "Mid",
    tags: ["PHP", "Laravel", "Vue.js", "MySQL", "AWS", "Docker"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    description: `Freshworks makes refreshing business software. We're hiring a Full-Stack Engineer in Hyderabad to power our Freshdesk customer support portal with scalable Laravel backends and snappy Vue 3 interfaces.`,
    responsibilities: [
      "Build customer portal features using Laravel, PHP 8, and Vue 3.",
      "Design clean RESTful and GraphQL APIs consumed by web and mobile clients.",
      "Write comprehensive automated tests with PHPUnit and Jest."
    ],
    requirements: [
      "3+ years building commercial SaaS applications in PHP / Laravel.",
      "Proficiency with Vue.js, Vuex or Pinia, and modern CSS frameworks.",
      "Good knowledge of AWS services (S3, RDS, SQS, EC2)."
    ],
    benefits: [
      "Health insurance with maternity and dependent coverage",
      "Well-stocked pantry, games room, and fitness center",
      "Relocation assistance for candidates moving to Hyderabad"
    ],
    status: null
  },
  {
    id: "job-014",
    title: "Senior Frontend Engineer (Vue 3 & TypeScript)",
    company: "Postman India",
    companyLogo: "PM",
    logoBg: "linear-gradient(135deg, #ef4444, #dc2626)",
    location: "Bengaluru, Karnataka, India",
    isRemote: true,
    platform: "LinkedIn",
    platformUrl: "https://www.linkedin.com/jobs/view/postman-vue-engineer",
    salary: { min: 3000000, max: 4800000, currency: "INR", formatted: "₹30L - ₹48L/yr" },
    type: "Full-time",
    experienceLevel: "Senior",
    tags: ["Vue 3", "TypeScript", "Vite", "Pinia", "REST APIs", "Electron"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    description: `Postman is used by over 30 million developers. Join our core desktop and web application team in Bengaluru to build lightning-fast API client experiences with Vue 3 and TypeScript.`,
    responsibilities: [
      "Build complex interactive interfaces for API request builders, collections, and mock servers.",
      "Optimize rendering performance of large JSON response payloads (100MB+).",
      "Work closely with product managers to deliver intuitive developer experiences."
    ],
    requirements: [
      "5+ years of frontend development experience with strong focus on Vue 3 or modern frameworks.",
      "Mastery of TypeScript, state management, and web worker threading.",
      "Deep empathy for developer workflows and API tooling."
    ],
    benefits: [
      "Competitive base salary with lucrative Postman stock options",
      "Flexible remote working policy with collaborative coworking hubs",
      "Annual wellness stipend and comprehensive medical benefits"
    ],
    status: null
  },
  {
    id: "job-015",
    title: "DevOps & Cloud Automation Engineer",
    company: "Zerodha",
    companyLogo: "ZD",
    logoBg: "linear-gradient(135deg, #387ed1, #1e40af)",
    location: "Bengaluru, Karnataka, India",
    isRemote: false,
    platform: "WeWorkRemotely",
    platformUrl: "https://weworkremotely.com/jobs/zerodha-devops",
    salary: { min: 2800000, max: 4500000, currency: "INR", formatted: "₹28L - ₹45L/yr" },
    type: "Full-time",
    experienceLevel: "Senior",
    tags: ["Python", "Go", "Docker", "Kubernetes", "PostgreSQL", "Linux", "AWS"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
    description: `Zerodha is India's largest stock broker, executing billions in daily trading volume with zero outside capital. We believe in lean software, open-source technology, and rock-solid systems.`,
    responsibilities: [
      "Maintain and harden high-availability Linux servers and Bare-metal Kubernetes clusters.",
      "Automate multi-region failover and disaster recovery systems for real-time market data feeds.",
      "Build internal monitoring, latency tracing, and alerting pipelines."
    ],
    requirements: [
      "4+ years managing production Linux infrastructure at scale.",
      "Strong scripting ability in Python, Bash, or Go.",
      "Experience with PostgreSQL tuning, HAProxy, and networking security."
    ],
    benefits: [
      "Generous annual profit-sharing bonus",
      "Health insurance with 100% coverage for family",
      "Zero corporate bureaucracy and complete technical autonomy"
    ],
    status: null
  },
  {
    id: "job-016",
    title: "Senior PHP / Magento E-Commerce Architect",
    company: "TCS Digital Labs",
    companyLogo: "TC",
    logoBg: "linear-gradient(135deg, #1e293b, #334155)",
    location: "Pune, Maharashtra, India",
    isRemote: false,
    platform: "Indeed",
    platformUrl: "https://www.indeed.com/viewjob?jk=tcs-magento-php-pune",
    salary: { min: 2000000, max: 3200000, currency: "INR", formatted: "₹20L - ₹32L/yr" },
    type: "Full-time",
    experienceLevel: "Senior",
    tags: ["PHP", "Magento 2", "MySQL", "Docker", "REST APIs", "Redis"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 220).toISOString(),
    description: `TCS Digital is looking for a Senior Magento / PHP Solution Architect in Pune to design enterprise e-commerce platforms for global Fortune 500 retail clients.`,
    responsibilities: [
      "Architect headless Adobe Commerce / Magento 2 implementations with microservices backends.",
      "Optimize checkout funnels, catalog indexing, and payment gateway integrations.",
      "Conduct code quality reviews and performance benchmarking."
    ],
    requirements: [
      "5+ years experience in PHP development with 3+ years in Adobe Commerce / Magento 2.",
      "Strong background in MySQL optimization and Elasticsearch integration.",
      "Adobe Certified Expert or Professional certification is a plus."
    ],
    benefits: [
      "Permanent full-time role with structured global mobility options",
      "Health insurance, gratuity, and retirement benefits",
      "Access to extensive enterprise upskilling certifications"
    ],
    status: null
  },
  {
    id: "job-017",
    title: "Full-Stack PHP & Laravel Engineer (Remote)",
    company: "RemoteBase",
    companyLogo: "RB",
    logoBg: "linear-gradient(135deg, #059669, #047857)",
    location: "Kochi, Kerala / Remote (India)",
    isRemote: true,
    platform: "RemoteOK",
    platformUrl: "https://remoteok.com/remote-jobs/remotebase-laravel-php",
    salary: { min: 1400000, max: 2400000, currency: "INR", formatted: "₹14L - ₹24L/yr" },
    type: "Full-time",
    experienceLevel: "Mid",
    tags: ["PHP", "Laravel", "TailwindCSS", "Livewire", "MySQL", "Vue.js"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 260).toISOString(),
    description: `RemoteBase connects exceptional Indian engineers with global fast-paced startups. We're looking for a Full-Stack PHP developer with strong Laravel and Tailwind expertise.`,
    responsibilities: [
      "Develop end-to-end web applications with Laravel, Livewire, and TailwindCSS.",
      "Build REST APIs for mobile and third-party integrations.",
      "Deploy and maintain applications on AWS and DigitalOcean."
    ],
    requirements: [
      "3+ years with PHP / Laravel framework.",
      "Experience with modern frontend tooling (Tailwind, Vue, or Livewire).",
      "Good communication skills and remote work discipline."
    ],
    benefits: [
      "100% remote work with flexible hours",
      "Payment in USD equivalent with biannual appraisal cycles",
      "Home office setup stipend and annual wellness allowance"
    ],
    status: null
  },
  {
    id: "job-018",
    title: "Part-Time Senior PHP / Laravel Consultant",
    company: "Codex Media India",
    companyLogo: "CM",
    logoBg: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    location: "Bengaluru / Remote (India)",
    isRemote: true,
    platform: "LinkedIn",
    platformUrl: "https://www.linkedin.com/jobs/view/codex-parttime-php",
    salary: { min: 1000000, max: 1600000, currency: "INR", formatted: "₹10L - ₹16L/yr (20h/wk)" },
    type: "Part-time",
    experienceLevel: "Senior",
    tags: ["PHP", "Laravel", "MySQL", "Part-Time", "REST APIs", "Redis"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    description: `We are seeking a Part-Time Senior PHP / Laravel specialist (20 hours per week) to assist in refactoring high-traffic legacy APIs into modern Laravel 11 microservices.`,
    responsibilities: [
      "Dedicate 15-20 flexible hours per week to code architecture and endpoint optimization.",
      "Conduct code reviews and guide core developers on Laravel and database best practices.",
      "Optimize complex SQL queries and introduce Redis caching strategies."
    ],
    requirements: [
      "5+ years of robust PHP / Laravel background.",
      "Proven track record of high-quality autonomous engineering delivery.",
      "Available for 3-4 hours daily during IST business overlap."
    ],
    benefits: [
      "Complete schedule flexibility with hourly or monthly billing",
      "Long-term part-time retainer contract with performance bonuses",
      "Direct technical leadership role without operational overhead"
    ],
    status: null
  },
  {
    id: "job-019",
    title: "Part-Time Vue 3 & Frontend UI Engineer",
    company: "SaaSify Labs",
    companyLogo: "SL",
    logoBg: "linear-gradient(135deg, #06b6d4, #0891b2)",
    location: "Remote (Worldwide)",
    isRemote: true,
    platform: "RemoteOK",
    platformUrl: "https://remoteok.com/remote-jobs/saasify-vue-parttime",
    salary: { min: 65000, max: 90000, currency: "USD", formatted: "$65k - $90k/yr ($50/hr • 20h/wk)" },
    type: "Part-time",
    experienceLevel: "Mid-Senior",
    tags: ["Vue 3", "Vite", "TypeScript", "TailwindCSS", "Part-Time", "Pinia"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    description: `SaaSify Labs is looking for a part-time frontend engineer (approx 20 hours/week) to design and ship snappy Vue 3 dashboards and landing pages.`,
    responsibilities: [
      "Build modular and accessible Vue 3 components with Vite and TypeScript.",
      "Implement design system tokens and responsive layouts using TailwindCSS.",
      "Participate in weekly syncs and maintain high test coverage with Vitest."
    ],
    requirements: [
      "3+ years of Vue.js experience with strong modern CSS fundamentals.",
      "Good communicator who thrives in an asynchronous, remote-first culture.",
      "Experience with Git, PR workflows, and component documentation."
    ],
    benefits: [
      "Predictable 20 hours weekly commitment with flexible timing",
      "Competitive hourly rate paid bi-weekly in USD",
      "Opportunity to transition to full-time as product line expands"
    ],
    status: null
  },
  {
    id: "job-020",
    title: "Part-Time WordPress / Modern PHP Specialist",
    company: "PixelCraft Digital",
    companyLogo: "PC",
    logoBg: "linear-gradient(135deg, #f59e0b, #d97706)",
    location: "Pune, Maharashtra / Remote (India)",
    isRemote: true,
    platform: "Indeed",
    platformUrl: "https://www.indeed.com/viewjob?jk=pixelcraft-parttime-wp",
    salary: { min: 800000, max: 1400000, currency: "INR", formatted: "₹8L - ₹14L/yr (Part-Time)" },
    type: "Part-time",
    experienceLevel: "Mid",
    tags: ["PHP", "WordPress", "WooCommerce", "Part-Time", "JavaScript", "MySQL"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
    description: `PixelCraft is looking for an experienced part-time developer to maintain and optimize custom e-commerce WordPress installations and WooCommerce plugins.`,
    responsibilities: [
      "Maintain, update, and optimize custom WordPress plugins and WooCommerce themes.",
      "Audit page speed, database queries, and server caching performance.",
      "Troubleshoot plugin conflicts and implement custom checkout modifications."
    ],
    requirements: [
      "3+ years building and maintaining custom WordPress & WooCommerce systems.",
      "Proficient in PHP, JavaScript, CSS3, and MySQL query profiling.",
      "Reliable availability for 15-20 hours weekly."
    ],
    benefits: [
      "100% remote working from anywhere in India",
      "Flexible schedule around your primary commitments",
      "Bi-weekly payments with project completion bonuses"
    ],
    status: null
  },
  {
    id: "job-021",
    title: "Part-Time Web Scraping & Python Automation Specialist",
    company: "DataSprint Analytics",
    companyLogo: "DS",
    logoBg: "linear-gradient(135deg, #10b981, #047857)",
    location: "Hyderabad / Remote (India)",
    isRemote: true,
    platform: "Wellfound",
    platformUrl: "https://wellfound.com/jobs/datasprint-parttime-scraping",
    salary: { min: 1100000, max: 1800000, currency: "INR", formatted: "₹11L - ₹18L/yr (Part-Time)" },
    type: "Part-time",
    experienceLevel: "Mid",
    tags: ["Python", "Playwright", "FastAPI", "Part-Time", "Docker", "PostgreSQL"],
    scrapedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString(),
    description: `DataSprint is seeking a skilled Part-Time Automation & Scraping Developer to build headless crawlers and automated extractors for market pricing intelligence.`,
    responsibilities: [
      "Build resilient scrapers using Playwright and Python asyncio.",
      "Integrate proxy rotation, headless browser pools, and error recovery handlers.",
      "Deliver structured JSON datasets to internal PostgreSQL endpoints."
    ],
    requirements: [
      "Solid experience with Python, web scraping, and DOM manipulation.",
      "Familiarity with anti-bot bypass techniques and rate limiting.",
      "Available 15-20 hours per week."
    ],
    benefits: [
      "Flexible evening or weekend hours permissible",
      "High hourly rate with monthly retainer option",
      "Full cloud credits and tooling budget provided"
    ],
    status: null
  }
];
