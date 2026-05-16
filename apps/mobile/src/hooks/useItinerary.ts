import { useCallback } from 'react';
import { generateItinerary } from '../services/itineraryService';
import { useVibeStore } from '../store/vibeStore';
import type { VibeQuery } from '../constants/types';

export function useItinerary() {
  const { vibe, budget, time, group, distance, setItinerary, setLoading, setError, isQueryComplete } =
    useVibeStore();

  const buildItinerary = useCallback(async () => {
    if (!isQueryComplete()) return;

    const query: VibeQuery = {
      vibe: vibe!,
      budget: budget!,
      time: time!,
      group: group!,
      distance: distance!,
    };

    setLoading(true);
    setError(null);

    try {
      const itinerary = await generateItinerary(query);
      setItinerary(itinerary);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [vibe, budget, time, group, distance, setItinerary, setLoading, setError, isQueryComplete]);

  return { buildItinerary };
}
