import type { BudgetId, DistanceId, GroupId, TimeId, VibeId } from '../constants/vibes';

export interface VibeQuery {
  vibe: VibeId;
  budget: BudgetId;
  time: TimeId;
  group: GroupId;
  distance: DistanceId;
}

export interface ItineraryStop {
  name: string;
  type: string;
  duration: string;
  note: string;
  priceTier: string;
}

export interface Itinerary {
  title: string;
  duration: string;
  estimatedCost: string;
  closingNote: string;
  stops: ItineraryStop[];
}
