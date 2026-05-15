export const VIBES = [
  'chill',
  'social',
  'romantic',
  'adventurous',
  'foodie',
  'nightlife',
  'outdoorsy',
  'productive',
  'cultural',
  'spontaneous',
] as const;

export type Vibe = (typeof VIBES)[number];
