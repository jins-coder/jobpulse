import { Router } from 'express';
import { atsEngine } from '../services/atsEngine.js';

const router = Router();

// Free Open ATS Scoring API
router.post('/analyze', (req, res) => {
  try {
    const { resumeText, resumeJson, targetJob } = req.body || {};

    if (!resumeText && !resumeJson) {
      return res.status(400).json({
        error: 'Please provide either resumeText (string) or resumeJson (structured object).'
      });
    }

    const result = atsEngine.analyze({ resumeText, resumeJson, targetJob });

    return res.json({
      status: 'success',
      service: 'JobPulse Free ATS Evaluation Engine',
      timestamp: new Date().toISOString(),
      data: result
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'ATS analysis error.' });
  }
});

// Free Resume Parser API
router.post('/parse', (req, res) => {
  try {
    const { rawText } = req.body || {};
    if (!rawText) {
      return res.status(400).json({ error: 'rawText is required.' });
    }

    // Extract basic fields
    const emailMatch = rawText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
    const phoneMatch = rawText.match(/(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/);
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    const candidateName = lines[0] || 'Candidate';

    // Extract recognized skills
    const techPool = [
      "Vue 3", "Vue.js", "Vite", "TypeScript", "JavaScript", "PHP", "Laravel", "Symfony", "WordPress",
      "Node.js", "Express", "Python", "FastAPI", "Go", "Docker", "Kubernetes", "AWS", "PostgreSQL",
      "MySQL", "Redis", "Pinia", "TailwindCSS", "REST APIs", "GraphQL", "Playwright", "Vitest", "Jest"
    ];

    const foundSkills = techPool.filter(tech => {
      const regex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      return regex.test(rawText);
    });

    return res.json({
      status: 'success',
      parsedCandidate: {
        name: candidateName,
        email: emailMatch ? emailMatch[0] : '',
        phone: phoneMatch ? phoneMatch[0] : '',
        skills: foundSkills,
        rawTextLength: rawText.length
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Benchmark / Sample Resume
router.get('/sample', (req, res) => {
  res.json({
    sampleResume: `Alex Morgan
Senior Frontend & Full-Stack Engineer | Vue 3, Vite & Node.js
Email: alex.morgan.dev@gmail.com | Phone: +1 (555) 382-9104 | Location: San Francisco, CA
LinkedIn: linkedin.com/in/alex-morgan | GitHub: github.com/alex-morgan

SUMMARY
Accomplished Senior Software Engineer with 6+ years of production experience architecting high-performance web applications, reactive dashboards, and scalable SPAs with Vue 3, TypeScript, Vite, and cloud microservices.

TECHNICAL SKILLS
- Languages & Frameworks: Vue 3, Vite, TypeScript, JavaScript (ES6+), PHP, Laravel, Node.js, Pinia, TailwindCSS
- Databases & Cloud: PostgreSQL, MySQL, Redis, Docker, Kubernetes, AWS (S3, RDS), REST APIs, WebSockets
- Testing & Tooling: Vitest, Playwright, Jest, Git, CI/CD pipelines

PROFESSIONAL EXPERIENCE
Senior Frontend Engineer | PulseStream Tech (2022 - Present)
- Architected core reactive analytics dashboard using Vue 3 Composition API and Vite, accelerating page load speeds by 48%.
- Spearheaded real-time telemetry streaming engine utilizing WebSockets and web workers for 100k+ concurrent active users.
- Automated testing pipelines with Vitest and Playwright, improving overall code coverage to 88% across 14 modules.

Full-Stack Engineer | CloudVenture Studios (2019 - 2022)
- Engineered scalable RESTful APIs with PHP/Laravel and Node.js, reducing server response times by 35%.
- Deployed automated data ingestion workers processing $2M+ in quarterly transactional billing data.
- Mentored 3 junior developers and delivered 10+ major sprint releases with 99.9% production uptime.

EDUCATION
B.S. in Computer Science | University of California (2015 - 2019)`
  });
});

// Agentic AI / RAG Resume Parsing Endpoint (Free Serverless Inference)
router.post('/agentic-parse', async (req, res) => {
  try {
    const { prompt, rawText } = req.body || {};
    const textToProcess = rawText || prompt || '';

    if (!textToProcess) {
      return res.status(400).json({ error: 'Text or prompt is required.' });
    }

    // Free Open Hugging Face Serverless Inference endpoint
    try {
      const hfResponse = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: prompt || `Extract JSON profile (name, email, phone, skills, yearsOfExperience) from resume:\n${textToProcess.slice(0, 1500)}`,
          parameters: { max_new_tokens: 500, temperature: 0.1 }
        })
      });

      if (hfResponse.ok) {
        const hfData = await hfResponse.json();
        const generated = Array.isArray(hfData) ? hfData[0]?.generated_text : hfData?.generated_text;
        if (generated) {
          return res.json({
            status: 'success',
            provider: 'HuggingFace Free Serverless',
            resultText: generated
          });
        }
      }
    } catch (hfErr) {
      // Fall through to deterministic response
    }

    return res.json({
      status: 'fallback',
      message: 'Client-side Agentic RAG engine active'
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
