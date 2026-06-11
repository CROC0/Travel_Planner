export type ActivityCategory =
  | 'sightseeing'
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'shopping'
  | 'nature'
  | 'nightlife'
  | 'beach'
  | 'culture'
  | 'free';

export interface Activity {
  id: string;
  title: string;
  location?: string;
  startTime: string; // "HH:MM" 24-hour
  endTime?: string;  // "HH:MM" 24-hour
  category: ActivityCategory;
  notes?: string;
  emoji?: string;
  isUserAdded: boolean;
  googleMapsUrl?: string;
}

export interface DayPlan {
  day: number;       // 1–10
  date: string;      // "2026-09-25" through "2026-10-04"
  label: string;     // "Day 1 — Arrival"
  activities: Activity[];
  notes?: string;
}

export type Itinerary = DayPlan[];

export type AttractionCategory =
  | 'landmark'
  | 'museum'
  | 'nature'
  | 'shopping'
  | 'beach'
  | 'viewpoint'
  | 'theme-park'
  | 'culture'
  | 'nightlife';

export interface Attraction {
  id: string;
  name: string;
  category: AttractionCategory;
  description: string;
  imageUrl: string;
  googleMapsUrl: string;
  entryFee?: string;
  openingHours?: string;
  tipText?: string;
  tags: string[];
}

export type FoodCategory = 'hawker' | 'fine-dining' | 'cafe' | 'bar' | 'dessert';

export interface FoodSpot {
  id: string;
  name: string;
  category: FoodCategory;
  description: string;
  imageUrl: string;
  googleMapsUrl: string;
  mustTry: string[];
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  location: string;
}

export interface PracticalInfo {
  id: string;
  title: string;
  icon: string;
  content: string;
  category: 'transport' | 'money' | 'connectivity' | 'safety' | 'culture';
}

export interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export interface AddActivityFormValues {
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  category: ActivityCategory;
  notes: string;
  emoji: string;
  googleMapsUrl: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
}

export type TodoCategory = 'general' | 'documents' | 'packing' | 'bookings' | 'money' | 'health';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: TodoCategory;
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: number;
}

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  emoji?: string;
  color?: string;
  tagline?: string;
}

export interface Holiday {
  id: string;
  userId: string;
  name: string;
  destination: string;
  startDate: string; // ISO "2026-09-25"
  endDate: string;   // ISO "2026-10-04"
  coverEmoji?: string;
  crew?: CrewMember[];
  isPublic?: boolean; // owner opted in to a read-only public share link
  createdAt: number;
}

export interface HolidayDocument {
  id: string;
  name: string;
  url: string;
  contentType: string;
  size: number;
  uploadedAt: number;
}
