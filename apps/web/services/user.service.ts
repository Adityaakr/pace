// User service - CRUD operations for users
import { supabase, User } from './supabase';

export const userService = {
  /**
   * Get or create a user by wallet address
   */
  async getOrCreateUser(walletAddress: string, displayName?: string): Promise<User> {
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (existingUser) {
      return existingUser as User;
    }

    // Create new user if doesn't exist
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        wallet_address: walletAddress,
        display_name: displayName || `Runner ${walletAddress.slice(0, 6)}`,
      })
      .select()
      .single();

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`);
    }

    return newUser as User;
  },

  /**
   * Get user by wallet address
   */
  async getUserByWallet(walletAddress: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data as User;
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data as User;
  },

  /**
   * Update user profile
   */
  async updateUser(
    userId: string,
    updates: Partial<Pick<User, 'display_name' | 'avatar_url' | 'email'>>
  ): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    return data as User;
  },

  /**
   * Update user streak
   */
  async updateStreak(userId: string, streak: number): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ streak, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update streak: ${error.message}`);
    }
  },

  /**
   * Get user stats
   */
  async getUserStats(userId: string): Promise<{
    totalRuns: number;
    totalDistance: number;
    totalCalories: number;
    avgPace: number;
    longestRun: number;
  }> {
    const { data: runs, error } = await supabase
      .from('runs')
      .select('distance, pace, calories')
      .eq('user_id', userId);

    if (error || !runs) {
      return {
        totalRuns: 0,
        totalDistance: 0,
        totalCalories: 0,
        avgPace: 0,
        longestRun: 0,
      };
    }

    const totalRuns = runs.length;
    const totalDistance = runs.reduce((sum, run) => sum + run.distance, 0);
    const totalCalories = runs.reduce((sum, run) => sum + (run.calories || 0), 0);
    const avgPace = runs.reduce((sum, run) => sum + run.pace, 0) / (totalRuns || 1);
    const longestRun = Math.max(...runs.map((run) => run.distance), 0);

    return {
      totalRuns,
      totalDistance,
      totalCalories,
      avgPace,
      longestRun,
    };
  },

  /**
   * Get leaderboard by distance
   */
  async getLeaderboard(limit: number = 10): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('total_distance', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data as User[];
  },
};
