import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { initDatabase, getDb } from './database';
import { runMigrations } from './migrations';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth';
import landingPageRoutes from './routes/landingPages';
import signupRoutes from './routes/signups';
import invitationRoutes from './routes/invitations';
import buildPlanRoutes from './routes/buildPlan';
import publicRoutes from './routes/public';

const app = express();

// Security & parsing middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/landing-pages', landingPageRoutes);
app.use('/api/signups', signupRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/build-plan', buildPlanRoutes);
app.use('/api/public', publicRoutes);

// Error handler
app.use(errorHandler);

// Initialize database and start server
async function start(): Promise<void> {
  try {
    await initDatabase();
    runMigrations();
    console.log('Database migrations completed successfully');

    // Verify database connection
    const db = getDb();
    db.prepare('SELECT 1 as ok').get();
    console.log('Database connection verified');

    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
