// Client-side ATS Service
// Connects to JobPulse Free Open ATS API with offline fallback

export const atsService = {
  async analyze({ resumeText, resumeJson, targetJob }) {
    try {
      const res = await fetch('/api/ats/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, resumeJson, targetJob })
      });

      if (res.ok) {
        const data = await res.json();
        return data.data;
      }
    } catch (e) {
      console.warn('[atsService] API error, using client fallback:', e.message);
    }

    // Client fallback heuristics
    return this.clientFallbackAnalysis(resumeText || '');
  },

  async parse(rawText) {
    try {
      const res = await fetch('/api/ats/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText })
      });
      if (res.ok) {
        const data = await res.json();
        return data.parsedCandidate;
      }
    } catch {}

    return {
      name: 'Candidate',
      email: '',
      phone: '',
      skills: [],
      rawTextLength: rawText.length
    };
  },

  async getSample() {
    try {
      const res = await fetch('/api/ats/sample');
      if (res.ok) {
        const data = await res.json();
        return data.sampleResume;
      }
    } catch {}
    return '';
  },

  clientFallbackAnalysis(text) {
    const textLower = text.toLowerCase();
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text);
    const hasPhone = /\d{3}[- ]?\d{3}[- ]?\d{4}/.test(text);
    const hasMetrics = /\b\d+%\b/.test(text);
    const words = text.split(/\s+/).filter(w => w.length > 2);

    let score = 50;
    if (hasEmail) score += 12;
    if (hasPhone) score += 10;
    if (hasMetrics) score += 15;
    if (words.length > 200) score += 10;

    return {
      overallScore: Math.min(95, score),
      grade: score >= 80 ? 'Excellent (ATS Ready)' : 'Good (Minor Tweaks Needed)',
      wordCount: words.length,
      breakdown: {
        contactInfo: { score: hasEmail && hasPhone ? 15 : 8, max: 15 },
        sections: { score: 12, max: 15 },
        actionVerbs: { score: 14, max: 20 },
        quantifiableImpact: { score: hasMetrics ? 18 : 8, max: 25 },
        formattingAndLength: { score: 20, max: 25 }
      },
      recommendations: [
        { priority: 'medium', category: 'Formatting', tip: 'Ensure all contact links and bullet points use standard bullet characters.' }
      ]
    };
  }
};
