export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'Voeding' | 'Beweging' | 'Mentaal' | 'Medisch';
  content: string;
  imageUrl: string;
  date: string;
  author: string;
}

export interface User {
  id: string;
  email: string;
  passwordHash: string; // In a real app, this would be hashed securely
  profile: UserProfile;
}

export interface WeightEntry {
  id: string;
  date: string; // ISO date string
  weight: number;
  note?: string;
}

export interface DailyCheckIn {
  id: string;
  date: string;
  energy: number; // 1-10
  strength: number; // 1-10
  hunger: number; // 1-10
  mood: number; // 1-10
  stress: number; // 1-10
  sleep: number; // 1-10
}

export interface UserProfile {
  name: string; // Pseudonym preferred
  startWeight: number;
  goalWeight: number;
  themePreference?: 'light' | 'dark';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Algemeen' | 'Behandeling' | 'Leefstijl' | 'Hormoontherapie';
}