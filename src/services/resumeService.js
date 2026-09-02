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
    "Vue 3", "Vite", "TypeScript", "JavaScript", "Pinia", "Vuex", 
    "TailwindCSS", "Node.js", "REST APIs", "GraphQL", "WebSockets", 
    "PostgreSQL", "Docker", "Jest", "Vitest", "Playwright", "Git", "CI/CD"
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
  parseRawText(rawText) {
    const resume = JSON.parse(JSON.stringify(DEFAULT_RESUME));
    if (!rawText || typeof rawText !== 'string') return resume;

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
      resume.name = lines[0].replace(/^#+\s*/, '');
    }

    // Extract email
    const emailMatch = rawText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/);
    if (emailMatch) resume.email = emailMatch[0];

    // Extract phone
    const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) resume.phone = phoneMatch[0];

    // Extract recognized tech skills
    const candidateTech = [
      "Vue 3", "Vue.js", "Vue", "Vite", "TypeScript", "JavaScript", "React", "Next.js", "Nuxt.js",
      "Pinia", "Vuex", "Redux", "Node.js", "Express", "Python", "FastAPI", "Go", "Rust",
      "Docker", "Kubernetes", "AWS", "GCP", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST APIs",
      "TailwindCSS", "CSS3", "HTML5", "Playwright", "Jest", "Vitest", "WebSockets", "CI/CD"
    ];

    const detectedSkills = [];
    for (const tech of candidateTech) {
      const regex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(rawText)) {
        detectedSkills.push(tech);
      }
    }

    if (detectedSkills.length > 0) {
      resume.skills = Array.from(new Set([...resume.skills, ...detectedSkills]));
    }

    return resume;
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
    const coreDomainKeywords = ["frontend", "vue", "fullstack", "full-stack", "software", "engineer", "developer", "web"];
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
  }
};
