
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

export interface MealEntry {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  name: string;
  description?: string;
  calories: number;
}

export type CarePathId = 'active_surveillance' | 'treatment_lt_6m' | 'treatment_6_12w' | 'high_risk';

export interface UserProfile {
  name: string; // Pseudonym preferred
  startWeight: number;
  goalWeight: number;
  height: number; // in cm
  gender: 'man' | 'vrouw' | 'anders';
  themePreference?: 'light' | 'dark';
  
  // Gamification fields
  points: number;
  level: string; // 'Starter' | 'Doorzetter' | 'Krachtpatser' | 'VitaMeester'

  activeChallengeId?: string | null; // Track the single active challenge
  activeChallengeStartDate?: string | null; // ISO Date string when the challenge was started
  carePathId?: CarePathId | null; // The selected medical care path
  hasSeenOnboarding?: boolean; // Flag for dashboard tour
  
  // New fields for Freeze/Pause logic
  lastFreeFreezeDate?: string | null; // ISO Date string of last used free freeze
  medicalPause?: {
    isActive: boolean;
    startDate: string;
    endDate: string;
  } | null;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Algemeen' | 'Behandeling' | 'Leefstijl' | 'Hormoontherapie';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string; // Reference to Lucide icon
  conditionType: 'streak' | 'weight_entry' | 'knowledge' | 'checkin';
  threshold: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  participants: number;
  category: 'Voeding' | 'Beweging' | 'Mentaal';
}

export type ReactionType = 'heart' | 'muscle' | 'clap';

export interface CommunityPost {
  id: string;
  userPseudonym: string;
  actionType: 'challenge_join' | 'streak_milestone' | 'badge_earned' | 'checkin_complete';
  content: string; // System generated text, e.g. "Heeft 7 dagen volgehouden!"
  timestamp: string;
  reactions: {
    heart: number;
    muscle: number;
    clap: number;
  };
  currentUserReacted?: ReactionType[]; // Local tracking for UI
}
