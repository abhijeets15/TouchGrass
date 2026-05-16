export const VIBES = [
  { id: 'chill',       label: 'Chill',       emoji: '🌙', desc: 'Low-key, relaxed' },
  { id: 'social',      label: 'Social',      emoji: '🍻', desc: 'Bars, people, energy' },
  { id: 'romantic',    label: 'Romantic',    emoji: '🕯️', desc: 'Date night vibes' },
  { id: 'adventurous', label: 'Adventurous', emoji: '⚡', desc: 'Spontaneous & bold' },
  { id: 'foodie',      label: 'Foodie',      emoji: '🍜', desc: 'Eat your way around' },
  { id: 'outdoorsy',   label: 'Outdoorsy',   emoji: '🌿', desc: 'Fresh air & nature' },
  { id: 'cultural',    label: 'Cultural',    emoji: '🎨', desc: 'Art, music, history' },
  { id: 'nightlife',   label: 'Nightlife',   emoji: '🎶', desc: 'Late nights out' },
] as const;

export type VibeId = typeof VIBES[number]['id'];

export const BUDGET_OPTIONS = [
  { id: 'free',     label: 'Free',      desc: 'No spend' },
  { id: 'cheap',    label: '$ Cheap',   desc: 'Under $20' },
  { id: 'moderate', label: '$$ Mid',    desc: '$20–$60' },
  { id: 'splurge',  label: '$$$ Treat', desc: '$60+' },
] as const;

export type BudgetId = typeof BUDGET_OPTIONS[number]['id'];

export const TIME_OPTIONS = [
  { id: 'right now',    label: 'Right now' },
  { id: 'tonight',      label: 'Tonight' },
  { id: 'this weekend', label: 'Weekend' },
  { id: 'day trip',     label: 'Day trip' },
] as const;

export type TimeId = typeof TIME_OPTIONS[number]['id'];

export const GROUP_OPTIONS = [
  { id: 'solo',    label: 'Just me', emoji: '🧍' },
  { id: 'date',    label: 'Date',    emoji: '💑' },
  { id: 'friends', label: 'Friends', emoji: '👥' },
  { id: 'family',  label: 'Family',  emoji: '👨‍👩‍👧' },
] as const;

export type GroupId = typeof GROUP_OPTIONS[number]['id'];

export const DISTANCE_OPTIONS = [
  { id: '1 mile',   label: 'Walkable' },
  { id: '5 miles',  label: 'Nearby' },
  { id: '15 miles', label: '15 mi' },
  { id: '50 miles', label: 'Road trip' },
] as const;

export type DistanceId = typeof DISTANCE_OPTIONS[number]['id'];
