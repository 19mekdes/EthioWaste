import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {

      if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (req: Request, res: Response) => {
  res.json({ success: true, status: 'Healthy', timestamp: new Date().toISOString() });
});

// Versioned API routes
app.use('/api/v1', apiRouter);

// Centralized error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'An internal error occurred.' : message,
  });
});

app.listen(PORT, () => {
  console.log(`[Smart Waste Backend] Server running on http://localhost:${PORT}`);
  console.log(`[Smart Waste Backend] API Base URL: http://localhost:${PORT}/api/v1`);
});
