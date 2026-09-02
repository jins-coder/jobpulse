import { Router } from 'express';

const router = Router();

// Health / Jobs API
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'JobPulse Jobs & Scraper API is active.'
  });
});

export default router;
