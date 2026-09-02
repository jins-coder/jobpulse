// ATS (Applicant Tracking System) Evaluation Engine
// Analyzes structure, keyword density, quantifiable impact, and action verb strength

const POWER_ACTION_VERBS = [
  "architected", "spearheaded", "engineered", "accelerated", "optimized",
  "automated", "streamlined", "implemented", "delivered", "deployed",
  "scaled", "orchestrated", "refactored", "built", "designed",
  "integrated", "pioneered", "enhanced", "reduced", "increased",
  "resolved", "maximized", "transformed", "directed", "formulated",
  "launched", "standardized", "mentored", "championed", "established"
];

const STANDARD_SECTIONS = [
  { name: "Summary / Objective", keywords: ["summary", "objective", "profile", "about"] },
  { name: "Work Experience", keywords: ["experience", "work history", "employment", "professional experience"] },
  { name: "Skills / Competencies", keywords: ["skills", "technical skills", "technologies", "competencies", "stack"] },
  { name: "Education", keywords: ["education", "academic", "university", "degree", "bachelor", "master"] }
];

const METRIC_PATTERNS = [
  /\b\d+%\b/g,                               // e.g. 48%, 35%
  /\$\d+[\d,]*\b/g,                          // e.g. $10,000, $2M
  /₹\d+[\d,]*\b/g,                          // e.g. ₹25L, ₹10,000
  /\b\d+\+\s*(years?|users?|engineers?|clients?|releases?)\b/gi,
  /\b(reduced|increased|improved|boosted|saved|cut)\s+\w+\s+by\s+\d+%/gi,
  /\b(sub-\d+ms|\d+ms)\b/gi,                 // latency e.g. sub-20ms, 100ms
  /\b\d+k\+|\d+m\+|\d+\s*million\b/gi        // scale e.g. 100k+, 10 million
];

export const atsEngine = {
  analyze({ resumeText = '', resumeJson = null, targetJob = null }) {
    // Standardize input into raw text for heuristic scanning
    let fullText = resumeText;
    if (!fullText && resumeJson) {
      fullText = [
        resumeJson.name,
        resumeJson.headline,
        resumeJson.email,
        resumeJson.phone,
        resumeJson.location,
        resumeJson.summary,
        (resumeJson.skills || []).join(', '),
        (resumeJson.experience || []).map(e => `${e.role} ${e.company} ${(e.highlights || []).join(' ')}`).join(' '),
        (resumeJson.education || []).map(ed => `${ed.degree} ${ed.school || ''}`).join(' ')
      ].filter(Boolean).join('\n');
    }

    const textLower = fullText.toLowerCase();

    // 1. Contact Info & Essential Details (Max 15 points)
    let contactScore = 0;
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(fullText);
    const hasPhone = /(\+\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/.test(fullText);
    const hasLocation = /\b(remote|ca|ny|india|bengaluru|london|germany|usa|street|city)\b/i.test(fullText);
    const hasLinks = /(linkedin\.com|github\.com|portfolio|\.dev|\.io)/i.test(fullText);

    if (hasEmail) contactScore += 5;
    if (hasPhone) contactScore += 4;
    if (hasLocation) contactScore += 3;
    if (hasLinks) contactScore += 3;

    // 2. Standard Section Headings Check (Max 15 points)
    let sectionsFound = 0;
    const missingSections = [];
    for (const section of STANDARD_SECTIONS) {
      const found = section.keywords.some(kw => textLower.includes(kw));
      if (found) {
        sectionsFound++;
      } else {
        missingSections.push(section.name);
      }
    }
    const sectionScore = Math.round((sectionsFound / STANDARD_SECTIONS.length) * 15);

    // 3. High-Impact Action Verbs (Max 20 points)
    const detectedActionVerbs = [];
    for (const verb of POWER_ACTION_VERBS) {
      const regex = new RegExp(`\\b${verb}\\b`, 'i');
      if (regex.test(fullText)) {
        detectedActionVerbs.push(verb);
      }
    }
    const actionVerbScore = Math.min(20, Math.round((detectedActionVerbs.length / 8) * 20));

    // 4. Quantifiable Impact & Metrics (Max 25 points)
    const matchedMetrics = [];
    for (const pattern of METRIC_PATTERNS) {
      const matches = fullText.match(pattern);
      if (matches) {
        matchedMetrics.push(...matches);
      }
    }
    const uniqueMetrics = Array.from(new Set(matchedMetrics));
    const metricScore = Math.min(25, Math.round((uniqueMetrics.length / 5) * 25));

    // 5. Keyword Density & Formatting (Max 25 points)
    const words = fullText.split(/\s+/).filter(w => w.length > 2);
    const wordCount = words.length;
    let formatScore = 15;
    if (wordCount < 150) formatScore = 8;
    else if (wordCount > 1000) formatScore = 12;
    else formatScore = 25;

    // Overall ATS score calculation
    const overallScore = Math.min(99, Math.max(25, contactScore + sectionScore + actionVerbScore + metricScore + formatScore));

    // 6. Target Job Comparison (if target job provided)
    let jobMatchAnalysis = null;
    if (targetJob) {
      const jobTags = (targetJob.tags || []).map(t => t.toLowerCase());
      const jobDesc = ((targetJob.description || '') + ' ' + (targetJob.title || '')).toLowerCase();
      
      const matchedJobKeywords = [];
      const missingJobKeywords = [];

      for (const tag of targetJob.tags || []) {
        if (textLower.includes(tag.toLowerCase())) {
          matchedJobKeywords.push(tag);
        } else {
          missingJobKeywords.push(tag);
        }
      }

      const matchPercentage = jobTags.length > 0 ? Math.round((matchedJobKeywords.length / jobTags.length) * 100) : 85;
      jobMatchAnalysis = {
        targetTitle: targetJob.title,
        targetCompany: targetJob.company,
        matchPercentage,
        matchedJobKeywords,
        missingJobKeywords
      };
    }

    // 7. Actionable Recommendations
    const recommendations = [];
    if (!hasLinks) {
      recommendations.push({
        priority: 'high',
        category: 'Formatting',
        tip: 'Add clickable links to your GitHub profile, LinkedIn, or live portfolio site.'
      });
    }
    if (uniqueMetrics.length < 3) {
      recommendations.push({
        priority: 'high',
        category: 'Quantifiable Impact',
        tip: `Include more numerical metrics (e.g. "% improvement in performance", "$ saved", "users supported"). Current metrics detected: ${uniqueMetrics.length}.`
      });
    }
    if (detectedActionVerbs.length < 6) {
      recommendations.push({
        priority: 'medium',
        category: 'Action Verbs',
        tip: `Replace passive phrasing with active power verbs like 'Architected', 'Spearheaded', 'Optimized', or 'Automated'.`
      });
    }
    if (missingSections.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'ATS Structure',
        tip: `Ensure standard ATS headings are explicitly labeled: Missing (${missingSections.join(', ')}).`
      });
    }
    if (jobMatchAnalysis && jobMatchAnalysis.missingJobKeywords.length > 0) {
      recommendations.push({
        priority: 'critical',
        category: 'Job Alignment',
        tip: `Add missing target job keywords to your skills or experience bullets: ${jobMatchAnalysis.missingJobKeywords.slice(0, 4).join(', ')}.`
      });
    }

    return {
      overallScore,
      grade: overallScore >= 85 ? 'Excellent (ATS Ready)' : overallScore >= 70 ? 'Good (Minor Tweaks Needed)' : 'Needs Improvement',
      wordCount,
      breakdown: {
        contactInfo: { score: contactScore, max: 15, hasEmail, hasPhone, hasLocation, hasLinks },
        sections: { score: sectionScore, max: 15, missingSections },
        actionVerbs: { score: actionVerbScore, max: 20, count: detectedActionVerbs.length, detected: detectedActionVerbs },
        quantifiableImpact: { score: metricScore, max: 25, count: uniqueMetrics.length, metricsDetected: uniqueMetrics.slice(0, 8) },
        formattingAndLength: { score: formatScore, max: 25, wordCount }
      },
      jobMatchAnalysis,
      recommendations
    };
  }
};
