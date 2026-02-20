// Supabase client configuration for PACE DAO
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: undefined, // We'll use Privy for auth, not Supabase auth
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// Database types (generated from schema)
export interface User {
  id: string;
  wallet_address: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  xp: number;
  level: number;
  pace_balance: number;
  streak: number;
  total_distance: number;
  total_runs: number;
  total_calories: number;
  club_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Run {
  id: string;
  user_id: string;
  distance: number;
  duration: number;
  pace: number;
  calories?: number;
  avg_heart_rate?: number;
  elevation?: number;
  route?: { lat: number; lng: number; timestamp: string }[];
  xp_earned: number;
  pace_earned: number;
  is_pending: boolean;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  description?: string;
  location?: string;
  logo_url?: string;
  founder_id: string;
  member_count: number;
  total_distance: number;
  requires_approval: boolean;
  created_at: string;
  updated_at: string;
}

export interface Badge {
  id: string;
  name: string;
  description?: string;
  icon: string;
  icon_color: string;
  bg_color: string;
  requirement_type: 'distance' | 'runs' | 'streak' | 'pace' | 'xp';
  requirement_value: number;
  created_at: string;
}

export interface UserBadge {
  user_id: string;
  badge_id: string;
  earned_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  type: 'distance' | 'duration' | 'frequency';
  target: number;
  reward_xp: number;
  reward_pace: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface RewardQueue {
  id: string;
  user_id: string;
  run_id: string;
  amount: number;
  status: 'pending' | 'queued' | 'claimed' | 'failed';
  tx_hash?: string;
  created_at: string;
  queued_at?: string;
  claimed_at?: string;
}
