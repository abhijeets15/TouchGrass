import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import itineraryRoutes from './routes/itinerary';
import { config } from './config';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: config.corsOrigin === '*' ? true : config.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'vibecheck-api' });
  });

  app.use('/auth', authRoutes);
  app.use('/itinerary', itineraryRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
