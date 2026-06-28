import { Router } from 'express';
import { z } from 'zod';
import * as itineraryService from '../services/itineraryService';

const router = Router();

const itinerarySchema = z.object({
  vibe: z.string(),
  budget: z.string(),
  time: z.string(),
  group: z.string(),
  distance: z.string(),
  destination: z.string().optional(),
});

function handleError(res: import('express').Response, err: unknown) {
  const e = err as Error & { status?: number };
  const status = e.status ?? 500;
  const message = e.message || 'Internal server error';
  console.error('Itinerary route error:', e);
  res.status(status).json({ error: message });
}

router.post('/generate', async (req, res) => {
  console.log('Received itinerary request:', req.body);
  const parsed = itinerarySchema.safeParse(req.body);
  if (!parsed.success) {
    console.log('Validation failed:', parsed.error.errors);
    res.status(400).json({ error: 'Invalid input parameters' });
    return;
  }
  try {
    console.log('Calling generateItinerary with:', parsed.data);
    const itinerary = await itineraryService.generateItinerary(parsed.data);
    console.log('Itinerary generated successfully');
    res.json(itinerary);
  } catch (err) {
    console.error('Error in generate route:', err);
    handleError(res, err);
  }
});

export default router;
