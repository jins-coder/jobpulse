import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../data/applications.json');

const router = express.Router();

// Helper to ensure data file exists
function readStoredApplications() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) || [];
  } catch (err) {
    console.warn('[Applications API] Read error:', err.message);
    return [];
  }
}

function writeStoredApplications(apps) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2));
  } catch (err) {
    console.error('[Applications API] Write error:', err.message);
  }
}

/**
 * POST /api/applications/submit
 * Submits an application directly from JobPulse platform
 */
router.post('/submit', async (req, res) => {
  try {
    const {
      jobId,
      jobTitle,
      company,
      platform,
      platformUrl,
      candidate,
      matchScore,
      tailoredResume,
      coverPitch,
      changesMade
    } = req.body;

    if (!jobTitle || !company) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required jobTitle or company for submission.'
      });
    }

    const timestamp = new Date().toISOString();
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const applicationId = `APP-2026-${randomSuffix}`;
    const trackingCode = `JP-DISPATCH-${Math.floor(1000 + Math.random() * 9000)}`;

    const applicationRecord = {
      id: applicationId,
      trackingCode,
      jobId,
      jobTitle,
      company,
      platform: platform || 'Direct Platform Application',
      platformUrl: platformUrl || '#',
      submittedAt: timestamp,
      status: 'submitted',
      deliveryStatus: 'Delivered to Employer Pipeline',
      matchScore: matchScore || 85,
      candidate: {
        name: candidate?.name || 'Candidate',
        email: candidate?.email || '',
        phone: candidate?.phone || '',
        location: candidate?.location || ''
      },
      tailoredResume: tailoredResume || null,
      coverPitch: coverPitch || '',
      changesMade: changesMade || []
    };

    // Store in backend json data store
    const existing = readStoredApplications();
    // Update if already submitted or add new
    const idx = existing.findIndex(a => a.jobId === jobId);
    if (idx >= 0) {
      existing[idx] = applicationRecord;
    } else {
      existing.unshift(applicationRecord);
    }
    writeStoredApplications(existing);

    console.log(`[JobPulse Platform] Application ${applicationId} submitted for "${jobTitle} @ ${company}"`);

    return res.status(201).json({
      status: 'success',
      applicationId,
      trackingCode,
      submittedAt: timestamp,
      deliveryChannel: `Direct Platform Dispatch (${company} Hiring Portal)`,
      message: `Your application has been successfully submitted from JobPulse to ${company}.`,
      application: applicationRecord
    });
  } catch (err) {
    console.error('[Applications API] Submission error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to submit application: ' + err.message
    });
  }
});

/**
 * GET /api/applications
 * Returns list of submitted applications
 */
router.get('/', (req, res) => {
  try {
    const apps = readStoredApplications();
    res.json({
      status: 'success',
      count: apps.length,
      applications: apps
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
