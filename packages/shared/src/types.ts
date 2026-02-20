// Core types for the PACE DAO app

export interface User {
  id: string;
  address: string; // Ethereum address
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  paceBalance: number; // $PACE tokens
  streak: number;
  totalDistance: number; // in km
  totalRuns: number;
  joinedAt: Date;
  clubId?: string;
}

export interface Run {
  id: string;
  userId: string;
  distance: number; // km
  duration: number; // seconds
  pace: number; // min/km
  calories: number;
  avgHeartRate?: number;
  elevation?: number; // meters
  route: GeoPoint[];
  startTime: Date;
  endTime: Date;
  xpEarned: number;
  paceEarned: number;
  isPending: boolean; // true if $PACE reward not yet claimed
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
  timestamp: Date;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  location: string;
  memberCount: number;
  founderId: string;
  createdAt: Date;
  logoUrl?: string;
  totalDistance: number;
  requiresApproval: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirements: {
    type: 'distance' | 'runs' | 'streak' | 'pace' | 'xp';
    value: number;
  };
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  earnedAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'distance' | 'duration' | 'frequency';
  target: number;
  reward: {
    xp: number;
    pace: number;
  };
  startDate: Date;
  endDate: Date;
  participants: string[];
}

// Blockchain types
export interface TokenBalance {
  address: string;
  balance: string; // BigNumber as string
  decimals: number;
  symbol: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
}

// Gamification constants
export const GAMIFICATION_CONFIG = {
  XP_PER_KM: 100,
  PACE_PER_KM: 10,
  LEVEL_FORMULA: (level: number) => level * 1000 + (level - 1) * 500, // XP for next level
  STREAK_BONUS_MULTIPLIER: 1.1, // 10% bonus per day of streak
};

// Level calculation
export function calculateLevel(xp: number): number {
  let level = 1;
  let totalXpForNextLevel = GAMIFICATION_CONFIG.LEVEL_FORMULA(level);
  
  while (xp >= totalXpForNextLevel) {
    level++;
    totalXpForNextLevel += GAMIFICATION_CONFIG.LEVEL_FORMULA(level);
  }
  
  return level;
}

// XP for next level
export function xpForNextLevel(currentLevel: number): number {
  return GAMIFICATION_CONFIG.LEVEL_FORMULA(currentLevel + 1);
}

// Calculate pace rewards with streak bonus
export function calculatePaceReward(distanceKm: number, streak: number): number {
  const basePace = distanceKm * GAMIFICATION_CONFIG.PACE_PER_KM;
  const streakMultiplier = Math.pow(GAMIFICATION_CONFIG.STREAK_BONUS_MULTIPLIER, Math.min(streak, 7));
  return Math.floor(basePace * streakMultiplier);
}

// Format pace (seconds per km to min:sec/km)
export function formatPace(secondsPerKm: number): string {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.floor(secondsPerKm % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Format distance
export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(2)}km`;
}

// Format duration
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
}
