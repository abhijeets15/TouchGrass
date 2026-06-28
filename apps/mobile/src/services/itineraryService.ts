import type { Itinerary, VibeQuery } from '../constants/types';
import { authApi } from './authApi';

export async function generateItinerary(query: VibeQuery): Promise<Itinerary> {
  const response = await authApi.generateItinerary(query);
  return response as Itinerary;
}
