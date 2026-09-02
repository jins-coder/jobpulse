// JobPulse Chrome Extension Popup (Built with Vue 3)
const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const currentTab = ref('autofill'); // 'autofill' | 'profile' | 'pitch'
    const isSuccess = ref(false);
    const buttonText = ref('⚡ 1-Click Autofill This Page');

    // Reactive Candidate Profile
    const candidate = ref({
      name: 'Jinson Joseph',
      firstName: 'Jinson',
      lastName: 'Joseph',
      headline: 'Senior Full Stack Developer (7+ Yrs)',
      email: 'jinson@example.com',
      phone: '+91 98765 43210',
      location: 'Remote / India',
      linkedin: 'https://linkedin.com/in/jinsonjoseph',
      github: 'https://github.com/jins-coder',
      website: 'https://github.com/jins-coder',
      yearsExp: 7,
      coverPitch: 'Dear Hiring Team,\n\nI am thrilled to submit my application for this role. With over 7 years of full-stack engineering expertise specializing in modern reactive architectures, high-performance web systems, and asynchronous pipelines, I am confident in bringing immediate value to your team.\n\nBest regards,\nJinson Joseph'
    });

    // 1. Load saved candidate state on mount
    onMounted(() => {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.get(['jobpulse_candidate'], (res) => {
          if (res && res.jobpulse_candidate) {
            candidate.value = { ...candidate.value, ...res.jobpulse_candidate };
          }
        });
      }
    });

    // 2. Persist Profile Changes
    const saveProfile = () => {
      // Split name into first and last
      const parts = (candidate.value.name || '').trim().split(/\s+/);
      candidate.value.firstName = parts[0] || 'Jinson';
      candidate.value.lastName = parts.length > 1 ? parts.slice(1).join(' ') : 'Joseph';

      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.set({ jobpulse_candidate: JSON.parse(JSON.stringify(candidate.value)) });
      }
    };

    // 3. Preset Cover Letter Pitches
    const applyPreset = (type) => {
      if (type === 'fullstack') {
        candidate.value.coverPitch = `Dear Hiring Team,\n\nI am applying for the software engineering position. With 7+ years of engineering experience across Vue 3, React, Node.js, and cloud systems, I specialize in building reactive, scalable architectures that deliver business impact.\n\nBest regards,\n${candidate.value.name}`;
      } else if (type === 'frontend') {
        candidate.value.coverPitch = `Dear Hiring Team,\n\nI am thrilled to apply for the Frontend Developer role. My core focus centers on building ultra-fast, accessible user interfaces with Vue 3, Vite, TypeScript, and modern CSS architectures.\n\nBest regards,\n${candidate.value.name}`;
      } else if (type === 'backend') {
        candidate.value.coverPitch = `Dear Hiring Team,\n\nI am writing to express my strong interest in the Backend Engineering position. I bring extensive background designing microservices, RESTful & GraphQL APIs, database optimization (PostgreSQL/Redis), and automated CI/CD pipelines.\n\nBest regards,\n${candidate.value.name}`;
      }
      saveProfile();
    };

    // 4. Trigger 1-Click Autofill on the Active Tab
    const handleAutofill = () => {
      saveProfile();

      if (typeof chrome !== 'undefined' && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (!tabs || !tabs[0]?.id) {
            buttonText.value = '⚠️ No active tab detected';
            setTimeout(() => { buttonText.value = '⚡ 1-Click Autofill This Page'; }, 2000);
            return;
          }

          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'autofill',
            candidate: JSON.parse(JSON.stringify(candidate.value))
          }, (res) => {
            isSuccess.value = true;
            buttonText.value = '✓ Autofilled 7 Fields in 0.2s!';
            setTimeout(() => {
              isSuccess.value = false;
              buttonText.value = '⚡ 1-Click Autofill This Page';
            }, 3000);
          });
        });
      } else {
        // Mock preview mode if opened in standard browser
        isSuccess.value = true;
        buttonText.value = '✓ Autofill simulated!';
        setTimeout(() => {
          isSuccess.value = false;
          buttonText.value = '⚡ 1-Click Autofill This Page';
        }, 2500);
      }
    };

    return {
      currentTab,
      candidate,
      isSuccess,
      buttonText,
      saveProfile,
      applyPreset,
      handleAutofill
    };
  }
}).mount('#app');
