// Resume Management, Compatibility Matching & Gap-Filling Engine for JobPulse

const STORAGE_KEY_RESUME = 'jobpulse_master_resume_v1';

// Default realistic candidate profile (Senior Vue / Full-Stack Engineer)
export const DEFAULT_RESUME = {
  name: "Alex Morgan",
  email: "alex.morgan.dev@gmail.com",
  phone: "+1 (555) 382-9104",
  location: "San Francisco, CA (Open to Remote)",
  headline: "Senior Frontend & Vue.js Full-Stack Engineer",
  summary: "Results-driven Software Engineer with 6+ years of experience building high-performance web applications, reactive dashboards, and scalable SPAs with Vue 3, TypeScript, Vite, and modern cloud architectures. Passionate about developer tooling, real-time data streaming, and web scraping systems.",
  yearsOfExperience: 6,
  skills: [
    "Vue 3", "Vite", "TypeScript", "JavaScript", "PHP", "Laravel", "MySQL", 
    "Pinia", "Vuex", "TailwindCSS", "Node.js", "REST APIs", "GraphQL", 
    "WebSockets", "PostgreSQL", "Docker", "Jest", "Vitest", "Playwright", "Git", "CI/CD"
  ],
  experience: [
    {
      role: "Senior Frontend Engineer",
      company: "PulseStream Tech",
      period: "2022 - Present",
      location: "Remote",
      highlights: [
        "Architected core reactive dashboard using Vue 3 Composition API, Pinia, and Vite, improving load times by 48%.",
        "Engineered real-time telemetry streaming engine utilizing WebSockets and web worker pipelines.",
        "Mentored 4 junior engineers and spearheaded testing initiatives with Vitest and Playwright (88% code coverage)."
      ]
    },
    {
      role: "Full-Stack Web Developer",
      company: "CloudVenture Studios",
      period: "2019 - 2022",
      location: "San Francisco, CA",
      highlights: [
        "Built and maintained responsive enterprise client portals using Vue.js, Node.js, Express, and PostgreSQL.",
        "Integrated automated web scraper pipelines to aggregate market intelligence and vendor analytics.",
        "Collaborated in Agile sprints to ship 14 major feature releases with zero downtime."
      ]
    }
  ],
  education: [
    {
      degree: "B.S. in Computer Science",
      institution: "University of California, Davis",
      year: "2019"
    }
  ],
  projects: [
    {
      name: "JobPulse Explorer",
      description: "Live multi-source job crawling and career intelligence dashboard with zero-dependency architecture."
    },
    {
      name: "Vue State Inspector",
      description: "Lightweight devtool extension for visualizing deep reactivity mutations and component lifecycles."
    }
  ]
};

// Preset Resumes for Instant Profile Switching & Matching Testing
export const PRESET_RESUMES = {
  php: {
    name: "Rajesh Sharma",
    email: "rajesh.sharma.dev@gmail.com",
    phone: "+91 98450 21980",
    location: "Bengaluru, India (Open to Remote)",
    headline: "Senior PHP & Laravel Backend Architect",
    summary: "Senior Backend Engineer with 8+ years designing scalable microservices, high-volume transactional APIs, and database architectures using PHP, Laravel, MySQL, Redis, and AWS.",
    yearsOfExperience: 8,
    skills: ["PHP", "Laravel", "MySQL", "Redis", "AWS", "Docker", "REST APIs", "WordPress", "Microservices", "Git"],
    experience: [
      {
        role: "Lead PHP / Laravel Engineer",
        company: "PayMatrix India",
        period: "2021 - Present",
        location: "Bengaluru",
        highlights: [
          "Architected real-time payment webhook engine in Laravel and Redis processing 2M+ transactions daily.",
          "Optimized high-traffic MySQL relational database schemas, cutting query latencies by 60%."
        ]
      }
    ]
  },
  vue: {
    name: "Alex Morgan",
    email: "alex.morgan.dev@gmail.com",
    phone: "+1 (555) 382-9104",
    location: "San Francisco, CA (Open to Remote)",
    headline: "Senior Frontend & Vue.js Full-Stack Engineer",
    summary: "Results-driven Software Engineer with 6+ years building high-performance SPAs, reactive dashboards, and design systems with Vue 3, Vite, TypeScript, and Pinia.",
    yearsOfExperience: 6,
    skills: ["Vue 3", "Vite", "TypeScript", "JavaScript", "Pinia", "TailwindCSS", "Node.js", "Vitest", "Docker", "REST APIs"],
    experience: [
      {
        role: "Senior Frontend Engineer",
        company: "PulseStream Tech",
        period: "2022 - Present",
        location: "Remote",
        highlights: [
          "Architected core reactive analytics dashboard using Vue 3 Composition API, improving load times by 48%."
        ]
      }
    ]
  },
  python: {
    name: "Maya Patel",
    email: "maya.patel.ai@gmail.com",
    phone: "+91 97112 45890",
    location: "Hyderabad, India (Open to Remote)",
    headline: "Full-Stack Python & Data Automation Engineer",
    summary: "Specialist in building high-throughput web crawlers, data ingestion pipelines, and REST APIs with Python, FastAPI, Django, PostgreSQL, and Playwright.",
    yearsOfExperience: 5,
    skills: ["Python", "FastAPI", "Django", "PostgreSQL", "Docker", "Playwright", "Web Scraping", "Redis", "REST APIs", "Vue 3"],
    experience: [
      {
        role: "Automation & Backend Engineer",
        company: "DataSprint Labs",
        period: "2021 - Present",
        location: "Hyderabad",
        highlights: [
          "Engineered distributed web scraping clusters extracting 500k+ data points daily with sub-second turnaround."
        ]
      }
    ]
  },
  wordpress: {
    name: "Rahul Verma",
    email: "rahul.verma.web@gmail.com",
    phone: "+91 99231 87654",
    location: "Pune, India (Open to Remote)",
    headline: "WordPress & Modern PHP Specialist",
    summary: "Web Engineer with 5+ years developing custom WordPress themes, WooCommerce extensions, headless PHP backends, and responsive JavaScript web interfaces.",
    yearsOfExperience: 5,
    skills: ["WordPress", "PHP", "JavaScript", "MySQL", "CSS3", "HTML5", "WooCommerce", "REST APIs", "TailwindCSS"],
    experience: [
      {
        role: "Senior WordPress Consultant",
        company: "PixelCraft Digital",
        period: "2021 - Present",
        location: "Pune",
        highlights: [
          "Developed custom headless WordPress enterprise portals with 99+ Google Lighthouse performance scores."
        ]
      }
    ]
  }
};

export const resumeService = {
  // 1. Get Master Resume from storage or seed default
  getMasterResume() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_RESUME);
      if (!data) {
        this.saveMasterResume(DEFAULT_RESUME);
        return JSON.parse(JSON.stringify(DEFAULT_RESUME));
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to load master resume", e);
      return JSON.parse(JSON.stringify(DEFAULT_RESUME));
    }
  },

  saveMasterResume(resume) {
    try {
      localStorage.setItem(STORAGE_KEY_RESUME, JSON.stringify(resume));
    } catch (e) {
      console.error("Failed to save master resume", e);
    }
  },

  // 2. Parse uploaded raw resume text / markdown
  parseRawText(rawText, filename = '') {
    if (!rawText || typeof rawText !== 'string') return JSON.parse(JSON.stringify(DEFAULT_RESUME));

    // Support direct JSON resume paste
    const trimmed = rawText.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const json = JSON.parse(trimmed);
        if (json.name || json.skills) {
          return {
            name: json.name || 'Candidate Profile',
            headline: json.headline || (json.skills?.length ? `${json.skills.slice(0, 3).join(', ')} Specialist` : 'Software Engineer'),
            email: json.email || '',
            phone: json.phone || '',
            location: json.location || 'Remote / Worldwide',
            yearsOfExperience: json.yearsOfExperience || (json.experience?.length ? json.experience.length * 2 : 4),
            summary: json.summary || '',
            skills: Array.isArray(json.skills) ? json.skills : [],
            experience: Array.isArray(json.experience) ? json.experience : []
          };
        }
      } catch (e) {
        // Continue to text parser
      }
    }

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

    // 1. Candidate Name
    let candidateName = '';
    const ignoreNames = /^(curriculum vitae|resume|cv|bio|profile|summary|contact|experience|work experience|skills|technical skills|about me|portfolio|page \d|references)/i;
    
    // First try lines from top
    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      let l = lines[i].replace(/^#+\s*/, '').replace(/^(name|candidate|applicant):\s*/i, '').trim();
      if (l && !ignoreNames.test(l) && !l.includes('@') && !l.includes('http') && !/^\+?\d/.test(l)) {
        if (l.length >= 2 && l.length <= 40 && l.split(/\s+/).length <= 5) {
          candidateName = l;
          break;
        }
      }
    }

    // Fallback to filename if no clean name found
    if (!candidateName && filename) {
      const cleanFile = filename.replace(/\.(pdf|docx?|txt|md|json)$/i, '').replace(/[-_]/g, ' ');
      const words = cleanFile.split(/\s+/).filter(w => !ignoreNames.test(w) && w.length > 1);
      if (words.length >= 1 && words.length <= 4) {
        candidateName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
    }

    if (!candidateName) candidateName = 'Candidate Profile';

    // 2. Email
    const emailMatch = rawText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/);
    const candidateEmail = emailMatch ? emailMatch[0] : '';

    // 3. Phone
    const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/);
    const candidatePhone = phoneMatch ? phoneMatch[0] : '';

    // 4. Recognized Tech Skills Dictionary (Comprehensive 160+ tech skills)
    const candidateTech = [
      // Frontend
      "Vue 3", "Vue.js", "Vue", "Vite", "TypeScript", "JavaScript", "React", "Next.js", "Nuxt.js", "Angular", "Svelte",
      "TailwindCSS", "CSS3", "HTML5", "Bootstrap", "Sass", "SCSS", "jQuery", "Redux", "Pinia", "Vuex",
      // Backend
      "PHP", "Laravel", "Symfony", "CodeIgniter", "WordPress", "WooCommerce", "Magento",
      "Python", "FastAPI", "Django", "Flask", "Pandas", "NumPy", "Web Scraping",
      "Node.js", "Express", "NestJS", "Go", "Golang", "Rust", "Java", "Spring Boot", "C#", ".NET", "ASP.NET", "Ruby", "Rails",
      // Databases
      "MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "OpenSearch", "SQLite", "DynamoDB", "Firebase", "Supabase", "Oracle",
      // DevOps & Cloud
      "Docker", "Kubernetes", "AWS", "GCP", "Azure", "CI/CD", "Git", "GitHub Actions", "Terraform", "Linux", "Nginx", "Apache",
      // APIs & Architecture
      "GraphQL", "REST APIs", "RESTful", "WebSockets", "Kafka", "RabbitMQ", "Microservices", "OOP", "MVC", "Agile", "Scrum",
      // Testing
      "Playwright", "Jest", "Vitest", "Cypress", "Selenium", "Puppeteer", "Unit Testing"
    ];

    const detectedSkills = [];
    for (const tech of candidateTech) {
      const regex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(rawText)) {
        detectedSkills.push(tech);
      }
    }

    // Also look for explicit Skills list in text (e.g. Skills: Go, Kubernetes, Terraform)
    const skillsSectionMatch = rawText.match(/(?:skills|technical skills|technologies|competencies|tools)[\s:]+([^\n\r#]+)/i);
    if (skillsSectionMatch && skillsSectionMatch[1]) {
      const tokens = skillsSectionMatch[1].split(/[,•|/]/).map(t => t.trim()).filter(Boolean);
      for (const t of tokens) {
        if (t.length >= 2 && t.length <= 25 && !detectedSkills.some(s => s.toLowerCase() === t.toLowerCase())) {
          detectedSkills.push(t);
        }
      }
    }

    // 5. Years of Experience
    let yearsExp = 3;
    const expMatch = rawText.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp|production|hands-on)/i);
    if (expMatch) {
      yearsExp = parseInt(expMatch[1], 10);
    } else {
      // Look for year ranges like 2018 - 2024 or 2019 - Present
      const yearRangeMatch = rawText.match(/\b(200\d|201\d|202\d)\s*[-–—to]+\s*(?:present|current|now|202\d)/i);
      if (yearRangeMatch) {
        const startYear = parseInt(yearRangeMatch[1], 10);
        const currentYear = new Date().getFullYear();
        yearsExp = Math.max(1, currentYear - startYear);
      } else if (detectedSkills.length > 7) {
        yearsExp = 5;
      }
    }

    // 6. Professional Headline
    let headline = '';
    for (let i = 1; i < Math.min(lines.length, 5); i++) {
      let l = lines[i].replace(/^#+\s*/, '').trim();
      if (/engineer|developer|architect|consultant|specialist|lead|manager|programmer/i.test(l) && l.length < 80) {
        headline = l;
        break;
      }
    }
    if (!headline) {
      const topStack = detectedSkills.slice(0, 3).join(' / ') || 'Software';
      headline = `${yearsExp}+ Yrs ${topStack} Engineer`;
    }

    // 7. Location
    let candidateLocation = 'Remote (Worldwide)';
    const locMatch = rawText.match(/Location:\s*([^\n|]+)/i) || 
      rawText.match(/\b(Bengaluru|Bangalore|Hyderabad|Pune|Mumbai|Chennai|Delhi|Noida|Gurgaon|Kolkata|Ahmedabad|San Francisco|New York|Seattle|Austin|Chicago|London|Berlin|Toronto|Remote India|India|Remote)\b/i);
    if (locMatch) {
      candidateLocation = (locMatch[1] || locMatch[0]).trim();
    }

    // 8. Summary
    const summaryMatch = rawText.match(/(?:summary|about me|profile|overview)[\s:]+([^\n\r#]+)/i);
    const candidateSummary = summaryMatch ? summaryMatch[1].trim() : `Experienced engineer with ${yearsExp}+ years background in ${detectedSkills.slice(0, 4).join(', ')}.`;

    return {
      name: candidateName,
      headline,
      email: candidateEmail,
      phone: candidatePhone,
      location: candidateLocation,
      yearsOfExperience: yearsExp,
      summary: candidateSummary,
      skills: detectedSkills.length > 0 ? detectedSkills : ["Software Engineering", "Problem Solving", "Git"],
      experience: []
    };
  },

  // 3. Multi-Dimensional Compatibility Matcher
  computeCompatibility(job, candidateResume = null) {
    const resume = candidateResume || this.getMasterResume();
    const candidateSkillsLower = (resume.skills || []).map(s => s.toLowerCase());
    
    // Normalize job tags & title keywords
    const jobTags = job.tags || [];
    const titleWords = (job.title || '').toLowerCase().split(/\W+/).filter(w => w.length > 2);
    const descText = ((job.description || '') + ' ' + (job.responsibilities || []).join(' ')).toLowerCase();

    // Matched skills calculation
    const matchedSkills = [];
    const missingSkills = [];

    for (const tag of jobTags) {
      const tagLower = tag.toLowerCase();
      const isDirectMatch = candidateSkillsLower.some(cs => cs === tagLower || cs.includes(tagLower) || tagLower.includes(cs));
      const isInExperience = descText.includes(tagLower);

      if (isDirectMatch) {
        matchedSkills.push(tag);
      } else {
        missingSkills.push(tag);
      }
    }

    // Skill match score (0 - 65% weight)
    const skillRatio = jobTags.length > 0 ? (matchedSkills.length / jobTags.length) : 0.85;
    const skillScore = Math.round(skillRatio * 65);

    // Title / Domain relevancy score (0 - 20% weight)
    let titleMatchCount = 0;
    const coreDomainKeywords = ["frontend", "backend", "vue", "php", "laravel", "fullstack", "full-stack", "software", "engineer", "developer", "web"];
    for (const kw of coreDomainKeywords) {
      if (titleWords.includes(kw) && (resume.headline || '').toLowerCase().includes(kw)) {
        titleMatchCount++;
      }
    }
    const titleScore = Math.min(20, Math.max(10, titleMatchCount * 6));

    // Seniority & Experience alignment (0 - 15% weight)
    let experienceScore = 15;
    const requiredLevel = (job.experienceLevel || '').toLowerCase();
    if (requiredLevel.includes('senior') || requiredLevel.includes('lead')) {
      experienceScore = resume.yearsOfExperience >= 5 ? 15 : 10;
    } else if (requiredLevel.includes('mid')) {
      experienceScore = 15;
    }

    const overallScore = Math.min(99, Math.max(35, skillScore + titleScore + experienceScore));

    return {
      overallScore,
      isCompatible: overallScore >= 75,
      matchedSkills,
      missingSkills,
      skillScore,
      titleScore,
      experienceScore,
      breakdown: {
        skillsMatched: `${matchedSkills.length}/${jobTags.length}`,
        seniorityFit: resume.yearsOfExperience >= 5 ? "Strong Senior Alignment" : "Good Experience Match",
        domainFit: "High Engineering Alignment"
      }
    };
  },

  // 4. Auto-Tailoring & Gap-Filling Engine (For jobs >= 75%)
  tailorResumeForJob(job, baseResume = null) {
    const resume = JSON.parse(JSON.stringify(baseResume || this.getMasterResume()));
    const compatibility = this.computeCompatibility(job, resume);

    const missing = compatibility.missingSkills;
    const matched = compatibility.matchedSkills;

    // A. Tailor Headline & Professional Summary
    const company = job.company || 'the team';
    const roleTitle = job.title || 'Software Engineer';
    const primaryStack = (job.tags || []).slice(0, 4).join(', ');

    resume.headline = `${roleTitle} | Specializing in ${primaryStack || 'Vue 3 & Scalable Web Apps'}`;
    resume.summary = `Accomplished ${roleTitle} with ${resume.yearsOfExperience}+ years of engineering excellence, tailored for ${company}. Demonstrates proven track record in ${primaryStack || 'modern web architecture'}, coupled with deep expertise in reactive state management, asynchronous data pipelines, and high-reliability production systems.`;

    // B. Gap-Filling: Bridge missing secondary skills with transferable project experience
    const bridgedHighlights = [];
    if (missing.length > 0) {
      const missingList = missing.slice(0, 3).join(' and ');
      bridgedHighlights.push(
        `Applied modern engineering best practices and architectural patterns including ${missingList} to streamline deployment velocity and code quality.`
      );
      // Seamlessly integrate bridged skills into candidate's skill catalog
      resume.skills = Array.from(new Set([...resume.skills, ...missing.slice(0, 3)]));
    }

    // C. Enhance most recent experience bullet points with targeted job keywords
    if (resume.experience && resume.experience.length > 0) {
      const topRole = resume.experience[0];
      const customBullet = `Accelerated enterprise feature delivery utilizing ${primaryStack || 'Vue 3 & TypeScript'}, driving 35% improvements in pipeline responsiveness for high-traffic environments.`;
      
      // Inject tailored bullets at the top
      topRole.highlights = [
        customBullet,
        ...(bridgedHighlights.length > 0 ? [bridgedHighlights[0]] : []),
        ...topRole.highlights.slice(0, 2)
      ];
    }

    // D. Generate Custom 1-Paragraph Application Cover Note
    const coverPitch = `Dear Hiring Team at ${company},\n\nI am thrilled to apply for the ${roleTitle} position. With over ${resume.yearsOfExperience} years of experience specializing in ${primaryStack}, I have built enterprise-grade applications with exceptional performance and reactive architectures. Having reviewed your current requirements, I am confident my hands-on background in ${matched.slice(0, 3).join(', ')}${missing.length ? ` and agile adoption of ${missing[0]}` : ''} will bring immediate value to ${company}'s engineering objectives.\n\nBest regards,\n${resume.name}`;

    return {
      tailoredResume: resume,
      compatibility,
      coverPitch,
      changesMade: [
        `Aligned Headline & Summary to "${roleTitle} @ ${company}"`,
        missing.length > 0 
          ? `Bridged skill gap for: ${missing.slice(0, 3).join(', ')} with relevant enterprise experience` 
          : `Amplified core matched skills (${matched.slice(0, 4).join(', ')})`,
        `Generated personalized 1-paragraph cover letter pitch for ${company}`,
        `Optimized primary experience bullets with target tech stack keywords (${primaryStack})`
      ]
    };
  },

  // 5. Parse and Rank the Most Confident Job Matches for Active Resume
  findTopConfidentJobs(jobs = [], candidateResume = null, limit = 4) {
    if (!jobs || jobs.length === 0) return [];
    const resume = candidateResume || this.getMasterResume();

    const scoredJobs = jobs.map(job => {
      const comp = this.computeCompatibility(job, resume);
      return {
        ...job,
        compatibility: comp,
        matchScore: comp.overallScore,
        confidenceRationale: this.buildConfidenceRationale(job, comp, resume)
      };
    });

    // Sort descending by match score
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    return scoredJobs.slice(0, limit);
  },

  buildConfidenceRationale(job, comp, resume) {
    const matchedCount = comp.matchedSkills.length;
    const topSkills = comp.matchedSkills.slice(0, 3).join(', ');
    if (comp.overallScore >= 90) {
      return `Exceptional fit: ${matchedCount} verified skills aligned (${topSkills}) with senior domain match.`;
    }
    if (comp.overallScore >= 80) {
      return `Strong match: High overlap on core requirements (${topSkills}); ready for immediate impact.`;
    }
    if (comp.overallScore >= 75) {
      return `Solid match: Eligible for automated gap-filling to bridge secondary skills (${comp.missingSkills.slice(0, 2).join(', ')}).`;
    }
    return `Partial alignment: Has core fundamentals with upskilling potential in ${comp.missingSkills.slice(0, 2).join(', ')}.`;
  },

  // 6. User Suggestion & AI Prompt Filter Engine
  getJobsBySuggestion(jobs = [], candidateResume = null, promptText = '') {
    if (!jobs || jobs.length === 0) return [];
    const resume = candidateResume || this.getMasterResume();
    const query = (promptText || '').toLowerCase().trim();

    if (!query) {
      return this.findTopConfidentJobs(jobs, resume, 10);
    }

    const keywords = query.split(/\W+/).filter(w => w.length > 1);

    const scored = jobs.map(job => {
      const comp = this.computeCompatibility(job, resume);
      const textToSearch = [
        job.title,
        job.company,
        job.location,
        job.platform,
        job.experienceLevel,
        ...(job.tags || []),
        job.description || ''
      ].join(' ').toLowerCase();

      let promptHits = 0;
      for (const kw of keywords) {
        if (textToSearch.includes(kw)) {
          promptHits++;
        }
      }

      // Special prompt checks
      if (query.includes('remote') && job.isRemote) promptHits += 2;
      if (query.includes('high') && (query.includes('salary') || query.includes('paying')) && (job.salary?.min || 0) >= 130000) {
        promptHits += 2;
      }
      if (query.includes('startup') && (job.platform === 'Wellfound' || (job.company || '').includes('Studios'))) {
        promptHits += 2;
      }

      const promptScore = keywords.length > 0 ? Math.min(100, (promptHits / Math.max(1, keywords.length)) * 100) : 100;
      
      // Combined weighted confidence: 60% resume compatibility + 40% user suggestion prompt fit
      const combinedScore = Math.round((comp.overallScore * 0.6) + (promptScore * 0.4));

      return {
        ...job,
        compatibility: comp,
        matchScore: comp.overallScore,
        combinedScore,
        promptHits,
        suggestionRationale: `Matched prompt keywords (${promptHits} criteria) + ${comp.overallScore}% resume alignment`
      };
    });

    // Filter out completely irrelevant if query had specific keywords
    const filtered = scored.filter(j => j.promptHits > 0 || j.combinedScore >= 70);
    filtered.sort((a, b) => b.combinedScore - a.combinedScore);

    return filtered.length > 0 ? filtered : scored.sort((a, b) => b.combinedScore - a.combinedScore).slice(0, 6);
  }
};
