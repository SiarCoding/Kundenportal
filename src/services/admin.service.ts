import { supabase } from '../lib/supabase';

export interface AdminSettings {
  id: string;
  logo_url: string | null;
  company_name: string;
  primary_color: string;
  created_at: string;
  updated_at: string;
}

export class AdminService {
  static async getSettings(): Promise<AdminSettings> {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      // If no settings exist, create default settings
      if (error.code === 'PGRST116') {
        const { data: newSettings, error: createError } = await supabase
          .from('admin_settings')
          .insert([{
            company_name: 'Kundenportal',
            primary_color: '#EAB308'
          }])
          .select()
          .single();

        if (createError) throw createError;
        return newSettings;
      }
      throw error;
    }

    return data;
  }

  static async updateSettings(updates: Partial<AdminSettings>): Promise<AdminSettings> {
    const { data, error } = await supabase
      .from('admin_settings')
      .update(updates)
      .eq('id', (await this.getSettings()).id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async uploadLogo(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `company-logo-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('admin')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('admin')
      .getPublicUrl(fileName);

    await this.updateSettings({ logo_url: data.publicUrl });

    return data.publicUrl;
  }
}