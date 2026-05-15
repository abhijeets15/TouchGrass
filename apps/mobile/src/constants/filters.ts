export const BUDGET_TIERS = ['free', 'cheap', 'moderate', 'splurge'] as const;
export const DISTANCE_OPTIONS_MILES = [1, 5, 10, 25, 50] as const;
export const TIME_SLOTS = ['right now', 'tonight', 'this weekend', 'next week', 'trip'] as const;
export const GROUP_TYPES = ['solo', 'date', 'friends', 'family'] as const;

export type BudgetTier = (typeof BUDGET_TIERS)[number];
export type TimeSlot = (typeof TIME_SLOTS)[number];
export type GroupType = (typeof GROUP_TYPES)[number];
