// Run service - CRUD operations for runs
import { supabase, Run } from './supabase';

export const runService = {
  /**
   * Save a new run
   */
  async saveRun(runData: {
    userId: string;
    distance: number;
    duration: number;
    pace: number;
    calories?: number;
    avgHeartRate?: number;
    elevation?: number;
    route?: { lat: number; lng: number; timestamp: string }[];
    xpEarned: number;
    paceEarned: number;
    startTime: Date;
    endTime: Date;
  }): Promise<Run> {
    const { data, error } = await supabase
      .from('runs')
      .insert({
        user_id: runData.userId,
        distance: runData.distance,
        duration: runData.duration,
        pace: runData.pace,
        calories: runData.calories,
        avg_heart_rate: runData.avgHeartRate,
        elevation: runData.elevation,
        route: runData.route,
        xp_earned: runData.xpEarned,
        pace_earned: runData.paceEarned,
        is_pending: true,
        start_time: runData.startTime.toISOString(),
        end_time: runData.endTime.toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save run: ${error.message}`);
    }

    return data as Run;
  },

  /**
   * Get runs for a user
   */
  async getUserRuns(userId: string, limit?: number): Promise<Run[]> {
    let query = supabase
      .from('runs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching runs:', error);
      return [];
    }

    return data as Run[];
  },

  /**
   * Get recent runs (last 7 days)
   */
  async getRecentRuns(userId: string): Promise<Run[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching recent runs:', error);
      return [];
    }

    return data as Run[];
  },

  /**
   * Get weekly stats
   */
  async getWeeklyStats(userId: string): Promise<{
    distance: number;
    runs: number;
    calories: number;
    avgPace: number;
  }> {
    const runs = await this.getRecentRuns(userId);

    const distance = runs.reduce((sum, run) => sum + run.distance, 0);
    const calories = runs.reduce((sum, run) => sum + (run.calories || 0), 0);
    const avgPace = runs.length > 0
      ? runs.reduce((sum, run) => sum + run.pace, 0) / runs.length
      : 0;

    return {
      distance,
      runs: runs.length,
      calories,
      avgPace,
    };
  },

  /**
   * Get run by ID
   */
  async getRunById(runId: string): Promise<Run | null> {
    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (error) {
      console.error('Error fetching run:', error);
      return null;
    }

    return data as Run;
  },

  /**
   * Mark run as claimed (after blockchain reward claim)
   */
  async markRunAsClaimed(runId: string): Promise<void> {
    const { error } = await supabase
      .from('runs')
      .update({ is_pending: false })
      .eq('id', runId);

    if (error) {
      throw new Error(`Failed to mark run as claimed: ${error.message}`);
    }
  },

  /**
   * Get pending runs (unclaimed rewards)
   */
  async getPendingRuns(userId: string): Promise<Run[]> {
    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .eq('user_id', userId)
      .eq('is_pending', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending runs:', error);
      return [];
    }

    return data as Run[];
  },

  /**
   * Calculate total pending rewards
   */
  async getTotalPendingRewards(userId: string): Promise<number> {
    const pendingRuns = await this.getPendingRuns(userId);
    return pendingRuns.reduce((sum, run) => sum + run.pace_earned, 0);
  },
};
