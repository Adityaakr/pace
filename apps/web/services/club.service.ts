// Club service - CRUD operations for clubs
import { supabase, Club } from './supabase';

export const clubService = {
  /**
   * Create a new club
   */
  async createClub(clubData: {
    name: string;
    description?: string;
    location?: string;
    founderId: string;
    requiresApproval?: boolean;
  }): Promise<Club> {
    const { data, error } = await supabase
      .from('clubs')
      .insert({
        name: clubData.name,
        description: clubData.description,
        location: clubData.location,
        founder_id: clubData.founderId,
        requires_approval: clubData.requiresApproval || false,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create club: ${error.message}`);
    }

    // Add founder as first member
    await this.joinClub(data.id, clubData.founderId, 'founder');

    return data as Club;
  },

  /**
   * Get club by ID
   */
  async getClubById(clubId: string): Promise<Club | null> {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', clubId)
      .single();

    if (error) {
      console.error('Error fetching club:', error);
      return null;
    }

    return data as Club;
  },

  /**
   * Get all clubs
   */
  async getAllClubs(limit?: number): Promise<Club[]> {
    let query = supabase
      .from('clubs')
      .select('*')
      .order('member_count', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching clubs:', error);
      return [];
    }

    return data as Club[];
  },

  /**
   * Search clubs by location
   */
  async searchClubsByLocation(location: string): Promise<Club[]> {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .ilike('location', `%${location}%`)
      .order('member_count', { ascending: false });

    if (error) {
      console.error('Error searching clubs:', error);
      return [];
    }

    return data as Club[];
  },

  /**
   * Join a club
   */
  async joinClub(clubId: string, userId: string, role: string = 'member'): Promise<void> {
    const { error } = await supabase
      .from('club_members')
      .insert({
        club_id: clubId,
        user_id: userId,
        role,
      });

    if (error) {
      throw new Error(`Failed to join club: ${error.message}`);
    }

    // Update member count
    await this.updateMemberCount(clubId);
  },

  /**
   * Leave a club
   */
  async leaveClub(clubId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('club_members')
      .delete()
      .eq('club_id', clubId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to leave club: ${error.message}`);
    }

    // Update member count
    await this.updateMemberCount(clubId);
  },

  /**
   * Get club members
   */
  async getClubMembers(clubId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('club_members')
      .select(`
        *,
        users:user_id (
          id,
          wallet_address,
          display_name,
          avatar_url,
          level,
          total_distance
        )
      `)
      .eq('club_id', clubId);

    if (error) {
      console.error('Error fetching club members:', error);
      return [];
    }

    return data;
  },

  /**
   * Check if user is member of club
   */
  async isUserMember(clubId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('club_members')
      .select('*')
      .eq('club_id', clubId)
      .eq('user_id', userId)
      .single();

    return !!data && !error;
  },

  /**
   * Update member count (internal function)
   */
  async updateMemberCount(clubId: string): Promise<void> {
    const { count, error: countError } = await supabase
      .from('club_members')
      .select('*', { count: 'exact', head: true })
      .eq('club_id', clubId);

    if (countError) {
      console.error('Error counting members:', countError);
      return;
    }

    const { error: updateError } = await supabase
      .from('clubs')
      .update({ member_count: count || 0 })
      .eq('id', clubId);

    if (updateError) {
      console.error('Error updating member count:', updateError);
    }
  },

  /**
   * Get user's clubs
   */
  async getUserClubs(userId: string): Promise<Club[]> {
    const { data, error } = await supabase
      .from('club_members')
      .select(`
        *,
        clubs:club_id (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user clubs:', error);
      return [];
    }

    return data.map((item: any) => item.clubs) as Club[];
  },
};
