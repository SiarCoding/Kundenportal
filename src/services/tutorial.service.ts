import { supabase } from '../lib/supabase';
import { TutorialContent, TutorialProgress } from '../types/tutorial';

export class TutorialService {
  static async fetchTutorials(): Promise<TutorialContent[]> {
    const { data, error } = await supabase
      .from('tutorials')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async fetchTutorialById(id: string): Promise<TutorialContent> {
    const { data, error } = await supabase
      .from('tutorials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async createTutorial(tutorial: Partial<TutorialContent>): Promise<TutorialContent> {
    const { data, error } = await supabase
      .from('tutorials')
      .insert([
        {
          ...tutorial,
          status: 'published',
          order: await this.getNextOrder(),
          tags: [],
          lastUpdated: new Date()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getNextOrder(): Promise<number> {
    const { data, error } = await supabase
      .from('tutorials')
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return (data?.order || 0) + 1;
  }

  static async updateProgress(progress: TutorialProgress): Promise<void> {
    const { error } = await supabase
      .from('tutorial_progress')
      .upsert({
        user_id: progress.userId,
        tutorial_id: progress.tutorialId,
        completed: progress.completed,
        last_viewed: progress.lastViewed,
        time_spent: progress.timeSpent
      });

    if (error) throw error;
  }

  static async markAsComplete(userId: string, tutorialId: string): Promise<void> {
    const { error } = await supabase
      .from('tutorial_progress')
      .upsert({
        user_id: userId,
        tutorial_id: tutorialId,
        completed: true,
        last_viewed: new Date(),
      });

    if (error) throw error;
  }

  static async fetchUserProgress(userId: string): Promise<TutorialProgress[]> {
    const { data, error } = await supabase
      .from('tutorial_progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }
}