// Core domain types shared across mobile, web, and API

export type Vibe =
  | 'chill' | 'social' | 'romantic' | 'adventurous'
  | 'foodie' | 'nightlife' | 'outdoorsy' | 'productive'
  | 'cultural' | 'spontaneous';

export type BudgetTier = 'free' | 'cheap' | 'moderate' | 'splurge';
export type TimeSlot = 'right now' | 'tonight' | 'this weekend' | 'next week' | 'trip';
export type GroupType = 'solo' | 'date' | 'friends' | 'family';
export type EnergyLevel = 'low' | 'medium' | 'high';

export interface VibeQuery {
  vibe: Vibe;
  budget: BudgetTier;
  timeSlot: TimeSlot;
  groupType: GroupType;
  energyLevel: EnergyLevel;
  radiusMiles: number;
  location: Coordinates;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description: string;
  location: Coordinates;
  address: string;
  distanceMiles?: number;
  priceRange: BudgetTier;
  rating?: number;
  reviewCount?: number;
  imageUrls: string[];
  tags: string[];
  openNow?: boolean;
  hours?: string;
  sourceUrl?: string;
  sponsored?: boolean;
}

export type ActivityCategory =
  | 'restaurant' | 'bar' | 'cafe' | 'park' | 'museum'
  | 'event' | 'nightlife' | 'outdoor' | 'shopping'
  | 'wellness' | 'entertainment' | 'hidden_gem';

export interface Itinerary {
  id: string;
  title: string;
  vibe: Vibe;
  duration: string;
  stops: ItineraryStop[];
  totalEstimatedCost: string;
  neighborhood?: string;
}

export interface ItineraryStop {
  order: number;
  activity: Activity;
  suggestedDuration: string;
  note?: string;
  transitToNext?: string;
}

export interface User {
  id: string;
  displayName: string;
  preferences?: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  defaultRadius: number;
  defaultBudget: BudgetTier;
  savedVibes: Vibe[];
  homeLocation?: Coordinates;
}
