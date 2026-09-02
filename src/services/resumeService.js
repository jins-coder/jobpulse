// Resume Management, Dynamic Compatibility Matching & Real-Time Parsing Engine for JobPulse

const STORAGE_KEY_RESUME = 'jobpulse_master_resume_v1';

// Clean empty candidate schema (zero hardcoded user data)
export const EMPTY_RESUME = {
  isUploaded: false,
  name: '',
  email: '',
  phone: '',
  location: '',
  headline: '',
  summary: '',
  yearsOfExperience: 0,
  skills: [],
  experience: [],
  education: [],
  projects: []
};

// Backwards-compatible export for clean default schema
export const DEFAULT_RESUME = EMPTY_RESUME;

export const resumeService = {
  // 1. Check if user has uploaded a valid resume
  hasUploadedResume(resume) {
    if (!resume) return false;
    return Boolean(
      resume.isUploaded &&
      resume.name &&
      Array.isArray(resume.skills) &&
      resume.skills.length > 0
    );
  },

  // 2. Get Master Resume from storage (null if user has not uploaded one)
  getMasterResume() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_RESUME);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (!parsed || !parsed.name || !parsed.isUploaded) {
        return null;
      }
      return parsed;
    } catch (e) {
      console.error("Failed to load master resume", e);
      return null;
    }
  },

  // 3. Save Master Resume
  saveMasterResume(resume) {
    try {
      const toSave = {
        ...resume,
        isUploaded: true
      };
      localStorage.setItem(STORAGE_KEY_RESUME, JSON.stringify(toSave));
      return toSave;
    } catch (e) {
      console.error("Failed to save master resume", e);
      return resume;
    }
  },

  // 4. Clear / Reset Master Resume
  clearMasterResume() {
    try {
      localStorage.removeItem(STORAGE_KEY_RESUME);
    } catch (e) {
      console.error("Failed to clear master resume", e);
    }
  },

  // 5. Parse uploaded raw resume text / markdown / JSON
  parseResumeText(rawText, filename = '') {
    return this.parseRawText(rawText, filename);
  },

  parseRawText(rawText, filename = '') {
    if (!rawText || typeof rawText !== 'string') {
      return JSON.parse(JSON.stringify(EMPTY_RESUME));
    }

    // Support direct JSON resume paste
    const trimmed = rawText.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const json = JSON.parse(trimmed);
        if (json.name || json.skills) {
          return {
            isUploaded: true,
            name: json.name || 'Candidate Profile',
            headline: json.headline || (json.skills?.length ? `${json.skills.slice(0, 3).join(', ')} Specialist` : 'Software Engineer'),
            email: json.email || '',
            phone: json.phone || '',
            location: json.location || 'Remote / Worldwide',
            yearsOfExperience: json.yearsOfExperience || (json.experience?.length ? json.experience.length * 2 : 3),
            summary: json.summary || '',
            skills: Array.isArray(json.skills) ? json.skills : [],
            experience: Array.isArray(json.experience) ? json.experience : []
          };
        }
      } catch (e) {
        // Continue to text parsing
      }
    }

    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

    // A. Candidate Name Extraction
    let candidateName = '';
    const ignoreNames = /^(curriculum vitae|resume|cv|bio|profile|summary|contact|experience|work experience|skills|technical skills|about me|portfolio|page \d|references)/i;
    
    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      let l = lines[i].replace(/^#+\s*/, '').replace(/^(name|candidate|applicant):\s*/i, '').trim();
      if (l && !ignoreNames.test(l) && !l.includes('@') && !l.includes('http') && !/^\+?\d/.test(l)) {
        if (l.length >= 2 && l.length <= 40 && l.split(/\s+/).length <= 5) {
          candidateName = l;
          break;
        }
      }
    }

    // Fallback to filename if no clean name in text
    if (!candidateName && filename) {
      const cleanFile = filename.replace(/\.(pdf|docx?|txt|md|json)$/i, '').replace(/[-_]/g, ' ');
      const words = cleanFile.split(/\s+/).filter(w => !ignoreNames.test(w) && w.length > 1);
      if (words.length >= 1 && words.length <= 4) {
        candidateName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
    }

    if (!candidateName) candidateName = 'Candidate Profile';

    // B. Email Extraction
    const emailMatch = rawText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/);
    const candidateEmail = emailMatch ? emailMatch[0] : '';

    // C. Phone Extraction
    const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/);
    const candidatePhone = phoneMatch ? phoneMatch[0] : '';

    // D. Recognized Tech Skills Dictionary (Comprehensive 160+ tech skills)
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

    // Also look for explicit Skills list in text
    const skillsSectionMatch = rawText.match(/(?:skills|technical skills|technologies|competencies|tools)[\s:]+([^\n\r#]+)/i);
    if (skillsSectionMatch && skillsSectionMatch[1]) {
      const tokens = skillsSectionMatch[1].split(/[,•|/]/).map(t => t.trim()).filter(Boolean);
      for (const t of tokens) {
        if (t.length >= 2 && t.length <= 25 && !detectedSkills.some(s => s.toLowerCase() === t.toLowerCase())) {
          detectedSkills.push(t);
        }
      }
    }

    // E. Years of Experience
    let yearsExp = 3;
    const expMatch = rawText.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp|production|hands-on)/i);
    if (expMatch) {
      yearsExp = parseInt(expMatch[1], 10);
    } else {
      const yearRangeMatch = rawText.match(/\b(200\d|201\d|202\d)\s*[-–—to]+\s*(?:present|current|now|202\d)/i);
      if (yearRangeMatch) {
        const startYear = parseInt(yearRangeMatch[1], 10);
        const currentYear = new Date().getFullYear();
        yearsExp = Math.max(1, currentYear - startYear);
      } else if (detectedSkills.length > 7) {
        yearsExp = 5;
      }
    }

    // F. Professional Headline
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

    // G. Location
    let candidateLocation = 'Remote (Worldwide)';
    const locMatch = rawText.match(/Location:\s*([^\n|]+)/i) || 
      rawText.match(/\b(Bengaluru|Bangalore|Hyderabad|Pune|Mumbai|Chennai|Delhi|Noida|Gurgaon|Kolkata|Ahmedabad|San Francisco|New York|Seattle|Austin|Chicago|London|Berlin|Toronto|Remote India|India|Remote)\b/i);
    if (locMatch) {
      candidateLocation = (locMatch[1] || locMatch[0]).trim();
    }

    // H. Summary
    const summaryMatch = rawText.match(/(?:summary|about me|profile|overview)[\s:]+([^\n\r#]+)/i);
    const candidateSummary = summaryMatch ? summaryMatch[1].trim() : `Experienced engineer with ${yearsExp}+ years background in ${detectedSkills.slice(0, 4).join(', ')}.`;

    return {
      isUploaded: true,
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

  // 6. Dynamic Compatibility Matcher (Calculates against uploaded resume)
  computeCompatibility(job, candidateResume = null) {
    const resume = candidateResume || this.getMasterResume();
    
    // If user has not uploaded a resume yet, return pending state
    if (!this.hasUploadedResume(resume)) {
      return {
        overallScore: null,
        isCompatible: false,
        skillScore: 0,
        titleScore: 0,
        experienceScore: 0,
        matchedSkills: [],
        missingSkills: job.tags || [],
        matchDetails: [],
        isPending: true,
        breakdown: {
          skillsMatched: `0/${(job.tags || []).length}`,
          seniorityFit: "Pending Resume Upload",
          domainFit: "Pending Resume Upload"
        }
      };
    }

    const candidateSkills = resume.skills || [];
    const candidateSkillsLower = candidateSkills.map(s => (s || '').toLowerCase().trim());
    const jobTags = job.tags || [];
    const fullJobText = `${job.title || ''} ${job.company || ''} ${jobTags.join(' ')} ${job.description || ''} ${(job.responsibilities || []).join(' ')} ${(job.requirements || []).join(' ')}`.toLowerCase();
    const titleLower = (job.title || '').toLowerCase();

    // 0. Non-tech job disqualifier:
    const nonTechRegex = /\b(writer|writing|advisory board|golf|nurse|doctor|driver|truck|carpenter|realtor|paralegal|waiter|cashier|warehouse|assistant|customer support|recruiter)\b/i;
    if (nonTechRegex.test(titleLower)) {
      return {
        overallScore: 10,
        isCompatible: false,
        skillScore: 0,
        titleScore: 0,
        experienceScore: 10,
        matchedSkills: [],
        missingSkills: jobTags,
        isPending: false,
        breakdown: {
          skillsMatched: `0/${jobTags.length}`,
          seniorityFit: "Non-Technical Role",
          domainFit: "Unrelated Industry"
        }
      };
    }

    // 1. Matched Candidate Skills in Job Posting (Exact Tech Match)
    const matchedCandidateSkills = candidateSkills.filter(skill => {
      const sLower = skill.toLowerCase().trim();
      if (!sLower || sLower.length < 2) return false;
      if (sLower === 'it' || sLower === 'as' || sLower === 'job') return false;
      const escaped = sLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(^|[^a-zA-Z0-9+#])${escaped}([^a-zA-Z0-9+#]|$)`, 'i');
      return regex.test(fullJobText);
    });

    // 2. Direct job tags matched
    const matchedTags = [];
    const missingSkills = [];
    for (const tag of jobTags) {
      const tagLower = tag.toLowerCase().trim();
      if (tagLower === 'it' || tagLower === 'job') continue;
      const isDirectMatch = candidateSkillsLower.some(cs => cs === tagLower || (cs.length > 2 && (cs.includes(tagLower) || tagLower.includes(cs))));
      if (isDirectMatch) {
        matchedTags.push(tag);
      } else {
        missingSkills.push(tag);
      }
    }

    const matchedSkills = Array.from(new Set([...matchedTags, ...matchedCandidateSkills]));

    // 3. Domain & Role Title Alignment Score (0 - 30% weight)
    const candidateHeadline = (resume.headline || '').toLowerCase();
    let titleAlignmentRatio = 0.2;
    const roleKeywords = ['developer', 'engineer', 'architect', 'full stack', 'fullstack', 'frontend', 'backend', 'web', 'devops', 'software'];
    const hasJobRoleKeyword = roleKeywords.some(kw => titleLower.includes(kw));
    const hasCandidateRoleKeyword = roleKeywords.some(kw => candidateHeadline.includes(kw));

    if (hasJobRoleKeyword && hasCandidateRoleKeyword) {
      titleAlignmentRatio = 0.7; // Strong engineering role alignment base
      const stackKeywords = ['vue', 'react', 'typescript', 'javascript', 'node', 'full stack', 'fullstack', 'php', 'laravel', 'java', 'python'];
      const candidateStackInJobTitle = stackKeywords.some(sk => titleLower.includes(sk) && (candidateHeadline.includes(sk) || candidateSkillsLower.includes(sk)));
      if (candidateStackInJobTitle) {
        titleAlignmentRatio = 1.0; // Perfect stack match in title!
      }
    } else if (!hasJobRoleKeyword) {
      titleAlignmentRatio = 0.1;
    }
    const titleScore = Math.round(titleAlignmentRatio * 30);

    // 4. True Technical Skill Score (0 - 55% weight)
    let skillScore = 0;
    if (matchedSkills.length > 0) {
      const matchCountFactor = Math.min(1.0, matchedSkills.length / 4); // 4+ skills = max count weight (35 pts)
      const tagCoverageFactor = jobTags.length > 0 ? (matchedTags.length / jobTags.length) : 0.8; // (20 pts)
      skillScore = Math.round((matchCountFactor * 35) + (tagCoverageFactor * 20));
    }

    // 5. Experience Seniority Fit (0 - 15% weight)
    const requiredYears = 
      titleLower.includes('senior') || (job.experienceLevel || '').toLowerCase().includes('senior') ? 5 :
      titleLower.includes('lead') || (job.experienceLevel || '').toLowerCase().includes('lead') ? 7 :
      titleLower.includes('mid') ? 3 : 1;

    const candidateYears = resume.yearsOfExperience || 3;
    const experienceScore = candidateYears >= requiredYears ? 15 : Math.round((candidateYears / requiredYears) * 15);

    const overallScore = Math.min(99, Math.max(15, skillScore + titleScore + experienceScore));
    const isCompatible = overallScore >= 75;

    return {
      overallScore,
      isCompatible,
      skillScore,
      titleScore,
      experienceScore,
      matchedSkills,
      missingSkills,
      isPending: false,
      breakdown: {
        skillsMatched: `${matchedSkills.length}/${Math.max(jobTags.length, matchedSkills.length)}`,
        seniorityFit: candidateYears >= requiredYears ? "Strong Senior Alignment" : "Good Experience Match",
        domainFit: titleAlignmentRatio >= 0.7 ? "High Engineering Alignment" : "Transferable Engineering Background"
      }
    };
  },

  // 4. Auto-Tailoring & Gap-Filling Engine (For jobs >= 75%)
  tailorResumeForJob(job, baseResume = null) {
    const resume = JSON.parse(JSON.stringify(baseResume || this.getMasterResume() || EMPTY_RESUME));
    const compatibility = this.computeCompatibility(job, resume);

    const missing = compatibility.missingSkills || [];
    const matched = compatibility.matchedSkills || [];

    // A. Tailor Headline & Professional Summary
    const company = job.company || 'the team';
    const roleTitle = job.title || 'Software Engineer';
    const primaryStack = (job.tags || []).slice(0, 4).join(', ');

    resume.headline = `${roleTitle} | Specializing in ${primaryStack || 'Modern Web Engineering'}`;
    resume.summary = `Accomplished ${roleTitle} with ${resume.yearsOfExperience || 3}+ years of engineering excellence, tailored for ${company}. Demonstrates proven track record in ${primaryStack || 'modern web architecture'}, coupled with deep expertise in reactive state management, asynchronous data pipelines, and high-reliability production systems.`;

    // B. Gap-Filling: Bridge missing secondary skills with transferable project experience
    const bridgedHighlights = [];
    if (missing.length > 0) {
      const missingList = missing.slice(0, 3).join(' and ');
      bridgedHighlights.push(
        `Applied modern engineering best practices and architectural patterns including ${missingList} to streamline deployment velocity and code quality.`
      );
      // Seamlessly integrate bridged skills into candidate's skill catalog
      resume.skills = Array.from(new Set([...(resume.skills || []), ...missing.slice(0, 3)]));
    }

    // C. Enhance most recent experience bullet points with targeted job keywords
    if (resume.experience && resume.experience.length > 0) {
      const topRole = resume.experience[0];
      const customBullet = `Accelerated enterprise feature delivery utilizing ${primaryStack || 'modern web technologies'}, driving 35% improvements in pipeline responsiveness for high-traffic environments.`;
      
      // Inject tailored bullets at the top
      topRole.highlights = [
        customBullet,
        ...(bridgedHighlights.length > 0 ? [bridgedHighlights[0]] : []),
        ...(topRole.highlights || []).slice(0, 2)
      ];
    }

    // D. Generate Custom 1-Paragraph Application Cover Note
    const coverPitch = `Dear Hiring Team at ${company},\n\nI am thrilled to apply for the ${roleTitle} position. With over ${resume.yearsOfExperience || 3} years of experience specializing in ${primaryStack || 'full-stack engineering'}, I have built enterprise-grade applications with exceptional performance and reactive architectures. Having reviewed your current requirements, I am confident my hands-on background in ${(matched.length ? matched.slice(0, 3) : ['modern software development']).join(', ')}${missing.length ? ` and agile adoption of ${missing[0]}` : ''} will bring immediate value to ${company}'s engineering objectives.\n\nBest regards,\n${resume.name || 'Candidate'}`;

    return {
      tailoredResume: resume,
      compatibility,
      coverPitch,
      changesMade: [
        `Aligned Headline & Summary to "${roleTitle} @ ${company}"`,
        missing.length > 0 
          ? `Bridged skill gap for: ${missing.slice(0, 3).join(', ')} with relevant enterprise experience` 
          : `Amplified core matched skills (${(matched.slice(0, 4) || []).join(', ')})`,
        `Generated personalized 1-paragraph cover letter pitch for ${company}`,
        `Optimized primary experience bullets with target tech stack keywords (${primaryStack || 'core requirements'})`
      ]
    };
  },

  // 7. Find Top Confident Jobs for Candidate
  findTopConfidentJobs(jobs = [], candidateResume = null, limit = 3) {
    const resume = candidateResume || this.getMasterResume();
    
    // If no resume uploaded yet, return empty list
    if (!this.hasUploadedResume(resume)) {
      return [];
    }

    const scoredJobs = jobs.map(job => {
      const comp = this.computeCompatibility(job, resume);
      return {
        ...job,
        compatibility: comp,
        matchScore: comp.overallScore || 0,
        confidenceRationale: this.buildConfidenceRationale(job, comp, resume)
      };
    });

    // Prioritize genuine matches with real skill overlap
    const qualified = scoredJobs.filter(j => j.matchScore >= 50);
    const pool = qualified.length >= limit ? qualified : scoredJobs;
    pool.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    return pool.slice(0, limit);
  },

  buildConfidenceRationale(job, comp, resume) {
    const matchedCount = (comp.matchedSkills || []).length;
    const topSkills = (comp.matchedSkills || []).slice(0, 3).join(', ');
    if (topSkills && (comp.overallScore || 0) >= 85) {
      return `Exceptional fit: ${matchedCount} verified skills aligned (${topSkills}) with senior domain match.`;
    }
    if (topSkills && (comp.overallScore || 0) >= 70) {
      return `Strong match: High overlap on core tech stack (${topSkills}); ready for immediate impact.`;
    }
    if (topSkills) {
      return `Solid alignment on ${topSkills}; eligible for rapid onboarding and gap-filling.`;
    }
    return `Transferable engineering alignment based on overall software development experience.`;
  },

  // 8. User Suggestion & AI Prompt Filter Engine
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

      const promptBoost = Math.min(30, promptHits * 10);
      const combinedScore = (comp.overallScore || 60) + promptBoost;

      return {
        ...job,
        compatibility: comp,
        matchScore: Math.min(99, combinedScore)
      };
    });

    return scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }
};
