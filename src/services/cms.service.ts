import { supabase } from '../lib/supabase';

export interface CMSContent {
  id: string;
  title: string;
  content_type: 'tutorial' | 'document' | 'video';
  content: {
    description: string;
    category?: string;
    url: string;
    thumbnailUrl?: string;
    requiredForOnboarding?: boolean;
  };
  status: 'draft' | 'published';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export class CMSService {
  static async fetchContents(options: {
    type?: 'tutorial' | 'document' | 'video';
    status?: 'draft' | 'published';
  } = {}): Promise<CMSContent[]> {
    let query = supabase
      .from('cms_content')
      .select('*')
      .order('created_at', { ascending: false });

    if (options.type) {
      query = query.eq('content_type', options.type);
    }

    if (options.status) {
      query = query.eq('status', options.status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async createContent(content: Omit<CMSContent, 'id' | 'created_at' | 'updated_at'>): Promise<CMSContent> {
    const { data, error } = await supabase
      .from('cms_content')
      .insert([content])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateContent(id: string, updates: Partial<CMSContent>): Promise<CMSContent> {
    const { data, error } = await supabase
      .from('cms_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteContent(id: string): Promise<void> {
    const { error } = await supabase
      .from('cms_content')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async uploadFile(file: File, contentType: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${contentType}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('cms-content')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('cms-content')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  static async publishContent(id: string): Promise<void> {
    const { error } = await supabase
      .from('cms_content')
      .update({ status: 'published' })
      .eq('id', id);

    if (error) throw error;
  }

  static async unpublishContent(id: string): Promise<void> {
    const { error } = await supabase
      .from('cms_content')
      .update({ status: 'draft' })
      .eq('id', id);

    if (error) throw error;
  }
}