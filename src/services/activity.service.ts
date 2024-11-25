import { supabase } from '../lib/supabase';

export class ActivityService {
  static async trackActivity(
    userId: string,
    activityType: string,
    activityData: any
  ): Promise<void> {
    try {
      const { error } = await supabase.rpc('track_user_activity', {
        p_user_id: userId,
        p_activity_type: activityType,
        p_activity_data: activityData
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking activity:', error);
      throw error;
    }
  }

  static async getUserActivities(userId: string) {
    const { data, error } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}