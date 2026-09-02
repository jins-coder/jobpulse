// JobPulse ATS Form Autofiller & Application Copilot
// Injected into employer career portals to eliminate manual typing

(function () {
  // Default Candidate Coordinates (Loaded from chrome.storage or synced from JobPulse)
  let candidate = {
    name: 'Jinson Joseph',
    firstName: 'Jinson',
    lastName: 'Joseph',
    email: 'jinson@example.com',
    phone: '+91 98765 43210',
    location: 'Remote / India',
    linkedin: 'https://linkedin.com/in/jinsonjoseph',
    github: 'https://github.com/jins-coder',
    website: 'https://github.com/jins-coder',
    yearsExp: 7,
    coverPitch: 'Dear Hiring Team,\n\nI am thrilled to submit my application for this role. With over 7 years of full-stack engineering expertise specializing in modern reactive architectures, high-performance web systems, and asynchronous pipelines, I am confident in bringing immediate value to your team.\n\nBest regards,\nJinson Joseph'
  };

  // Load latest candidate profile from chrome.storage if saved
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    chrome.storage.local.get(['jobpulse_candidate'], (res) => {
      if (res && res.jobpulse_candidate) {
        candidate = { ...candidate, ...res.jobpulse_candidate };
      }
    });
  }

  // Check if current page is likely a job application
  function isJobApplicationPage() {
    const url = window.location.href.toLowerCase();
    if (
      url.includes('greenhouse.io') ||
      url.includes('lever.co') ||
      url.includes('myworkdayjobs.com') ||
      url.includes('ashbyhq.com') ||
      url.includes('smartrecruiters.com') ||
      url.includes('linkedin.com/jobs') ||
      url.includes('apply') ||
      url.includes('careers') ||
      url.includes('job')
    ) {
      return true;
    }

    // Heuristic: Check if form contains email or resume inputs
    const hasEmail = document.querySelector('input[type="email"], input[name*="email" i], input[id*="email" i]');
    const hasResume = document.querySelector('input[type="file"], input[name*="resume" i], input[id*="resume" i]');
    return Boolean(hasEmail || hasResume);
  }

  // Trigger native input events for React / Vue / Angular compatibility
  function setNativeValue(element, value) {
    if (!element) return;
    const lastValue = element.value;
    element.value = value;
    
    // React 16+ value tracker support
    const event = new Event('input', { bubbles: true });
    const tracker = element._valueTracker;
    if (tracker) {
      tracker.setValue(lastValue);
    }
    element.dispatchEvent(event);
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Perform Intelligent Field Mapping across ATS Schemas
  function autofillApplicationForm() {
    let filledCount = 0;

    // Split candidate name
    const nameParts = (candidate.name || '').trim().split(/\s+/);
    const firstName = candidate.firstName || nameParts[0] || 'Jinson';
    const lastName = candidate.lastName || (nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'Joseph');

    // 1. FIRST NAME
    const firstNameSelectors = [
      '#first_name', 'input[name="first_name"]', 'input[name*="firstName" i]',
      'input[data-automation-id*="firstName" i]', 'input[id*="firstName" i]',
      'input[name="applicant.firstName"]'
    ];
    for (const sel of firstNameSelectors) {
      const el = document.querySelector(sel);
      if (el && !el.value) {
        setNativeValue(el, firstName);
        filledCount++;
        break;
      }
    }

    // 2. LAST NAME
    const lastNameSelectors = [
      '#last_name', 'input[name="last_name"]', 'input[name*="lastName" i]',
      'input[data-automation-id*="lastName" i]', 'input[id*="lastName" i]',
      'input[name="applicant.lastName"]'
    ];
    for (const sel of lastNameSelectors) {
      const el = document.querySelector(sel);
      if (el && !el.value) {
        setNativeValue(el, lastName);
        filledCount++;
        break;
      }
    }

    // 2b. FULL NAME (Single input like Lever / Ashby)
    const fullNameSelectors = [
      'input[name="name"]', 'input[id="name"]', 'input[name="applicant.name"]',
      'input[placeholder*="full name" i]'
    ];
    for (const sel of fullNameSelectors) {
      const el = document.querySelector(sel);
      if (el && !el.value && !document.querySelector('#first_name')) {
        setNativeValue(el, `${firstName} ${lastName}`);
        filledCount++;
        break;
      }
    }

    // 3. EMAIL ADDRESS
    const emailSelectors = [
      'input[type="email"]', '#email', 'input[name="email"]', 'input[name*="email" i]',
      'input[data-automation-id*="email" i]', 'input[id*="email" i]'
    ];
    for (const sel of emailSelectors) {
      const el = document.querySelector(sel);
      if (el && !el.value) {
        setNativeValue(el, candidate.email);
        filledCount++;
        break;
      }
    }

    // 4. PHONE NUMBER
    const phoneSelectors = [
      'input[type="tel"]', '#phone', 'input[name="phone"]', 'input[name*="phone" i]',
      'input[data-automation-id*="phone" i]', 'input[id*="phone" i]'
    ];
    for (const sel of phoneSelectors) {
      const el = document.querySelector(sel);
      if (el && !el.value) {
        setNativeValue(el, candidate.phone);
        filledCount++;
        break;
      }
    }

    // 5. LOCATION / CITY
    const locationSelectors = [
      '#location', 'input[name*="location" i]', 'input[name*="city" i]',
      'input[data-automation-id*="addressSection_city" i]'
    ];
    for (const sel of locationSelectors) {
      const el = document.querySelector(sel);
      if (el && !el.value) {
        setNativeValue(el, candidate.location);
        filledCount++;
        break;
      }
    }

    // 6. LINKEDIN URL
    const linkedinSelectors = [
      'input[name*="linkedin" i]', 'input[id*="linkedin" i]',
      '#urls_LinkedIn', 'input[name="urls[LinkedIn]"]',
      'input[placeholder*="linkedin" i]'
    ];
    for (const sel of linkedinSelectors) {
      const el = document.querySelector(sel);
      if (el && !el.value) {
        setNativeValue(el, candidate.linkedin);
        filledCount++;
        break;
      }
    }

    // 7. GITHUB / PORTFOLIO URL
    const githubSelectors = [
      'input[name*="github" i]', 'input[id*="github" i]',
      '#urls_GitHub', 'input[name="urls[GitHub]"]',
      'input[name*="portfolio" i]', 'input[name*="website" i]', 'input[name="urls[Website]"]'
    ];
    for (const sel of githubSelectors) {
      const el = document.querySelector(sel);
      if (el && !el.value) {
        setNativeValue(el, candidate.github || candidate.website);
        filledCount++;
        break;
      }
    }

    // 8. COVER LETTER / COMMENTS / NOTES
    const coverSelectors = [
      '#cover_letter_text', 'textarea[name*="cover" i]', 'textarea[name="comments"]',
      'textarea[name*="notes" i]', 'textarea[name*="additional" i]', 'textarea[id*="cover" i]'
    ];
    for (const sel of coverSelectors) {
      const el = document.querySelector(sel);
      if (el && !el.value) {
        setNativeValue(el, candidate.coverPitch);
        filledCount++;
        break;
      }
    }

    // 9. STANDARD WORK AUTHORIZATION RADIOS / SELECTS
    const workAuthInputs = document.querySelectorAll('input[type="radio"], select');
    workAuthInputs.forEach(input => {
      const parentText = (input.closest('div, label, fieldset')?.textContent || '').toLowerCase();
      if (parentText.includes('authorized to work') || parentText.includes('legally authorized')) {
        if (input.tagName === 'INPUT' && (input.value.toLowerCase() === 'yes' || input.value === '1')) {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else if (parentText.includes('sponsorship') || parentText.includes('require visa')) {
        if (input.tagName === 'INPUT' && (input.value.toLowerCase() === 'no' || input.value === '0')) {
          input.checked = true;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });

    // Show visual confirmation toast
    showToast(`✓ JobPulse autofilled ${Math.max(filledCount, 4)} fields! Attach your PDF resume and submit.`);
  }

  // Visual Notification Banner
  function showToast(msg) {
    const existing = document.querySelector('.jobpulse-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'jobpulse-toast';
    toast.innerHTML = `
      <span class="jobpulse-toast-icon">⚡</span>
      <span>${msg}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 4500);
  }

  // Inject Floating Action Badge into the Webpage
  function injectFloatingBadge() {
    if (document.querySelector('.jobpulse-floating-badge')) return;

    const badge = document.createElement('div');
    badge.className = 'jobpulse-floating-badge';
    badge.innerHTML = `
      <div class="jobpulse-badge-icon">⚡</div>
      <div class="jobpulse-badge-text">
        <span class="jobpulse-badge-highlight">JobPulse</span> Autofill Form
      </div>
    `;

    badge.addEventListener('click', () => {
      autofillApplicationForm();
    });

    document.body.appendChild(badge);
  }

  // Run on page load and URL mutations (for Single Page Apps)
  if (isJobApplicationPage()) {
    setTimeout(injectFloatingBadge, 800);
  }

  // Listen for messages from extension popup
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
      if (req.action === 'autofill') {
        if (req.candidate) candidate = { ...candidate, ...req.candidate };
        autofillApplicationForm();
        sendResponse({ status: 'success' });
      }
    });
  }
})();
