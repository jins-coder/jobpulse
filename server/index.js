import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import jobsRoutes from './routes/jobs.js';
import atsRoutes from './routes/ats.js';
import applicationsRoutes from './routes/applications.js';

export const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/applications', applicationsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'JobPulse Node.js Backend API'
  });
});

// If run directly (e.g. node server/index.js)
const isDirectRun = process.argv[1] && process.argv[1].includes('server');
if (isDirectRun) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 JobPulse Node.js API Server listening on http://localhost:${PORT}`);
  });
}

export default app;
