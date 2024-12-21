import { supabase } from '../supabase';

export interface AISettings {
  id: string;
  api_url: string;
  api_key: string;
  model: string;
  temperature: number;
  max_tokens: number;
  created_at: string;
  updated_at: string;
}

export const aiSettingsService = {
  async getSettings(): Promise<AISettings | null> {
    const { data, error } = await supabase
      .from('ai_settings')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async updateSettings(settings: Partial<AISettings>): Promise<AISettings> {
    const { data, error } = await supabase
      .from('ai_settings')
      .upsert([{
        id: '1', // Always use the same ID for settings
        ...settings,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

