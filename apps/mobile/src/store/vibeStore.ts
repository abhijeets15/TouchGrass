import { create } from 'zustand';
import type { BudgetId, DistanceId, GroupId, TimeId, VibeId } from '../constants/vibes';
import type { Itinerary } from '../constants/types';

interface VibeState {
  // Query inputs
  vibe: VibeId | null;
  budget: BudgetId | null;
  time: TimeId | null;
  group: GroupId | null;
  distance: DistanceId | null;

  // Result
  itineraries: Itinerary[];
  selectedItinerary: Itinerary | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setVibe: (vibe: VibeId) => void;
  setBudget: (budget: BudgetId) => void;
  setTime: (time: TimeId) => void;
  setGroup: (group: GroupId) => void;
  setDistance: (distance: DistanceId) => void;
  setItineraries: (itineraries: Itinerary[]) => void;
  setSelectedItinerary: (itinerary: Itinerary) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Derived
  isQueryComplete: () => boolean;
}

const initialState = {
  vibe: null,
  budget: null,
  time: null,
  group: null,
  distance: null,
  itineraries: [],
  selectedItinerary: null,
  isLoading: false,
  error: null,
};

export const useVibeStore = create<VibeState>((set, get) => ({
  ...initialState,

  setVibe: (vibe) => set({ vibe }),
  setBudget: (budget) => set({ budget }),
  setTime: (time) => set({ time }),
  setGroup: (group) => set({ group }),
  setDistance: (distance) => set({ distance }),
  setItineraries: (itineraries) => set({ itineraries, error: null }),
  setSelectedItinerary: (selectedItinerary) => set({ selectedItinerary }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  reset: () => set(initialState),

  isQueryComplete: () => {
    const { vibe, budget, time, group, distance } = get();
    return !!(vibe && budget && time && group && distance);
  },
}));
