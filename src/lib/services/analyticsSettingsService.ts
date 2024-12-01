import { supabase } from '../supabase';

export interface AnalyticsSettings {
  google_analytics_id: string;
  google_tag_manager_id: string;
  facebook_pixel_id: string;
  tiktok_pixel_id: string;
  vk_pixel_id: string;
  custom_head_scripts: string;
  custom_body_scripts: string;
}

export const analyticsSettingsService = {
  async getSettings(): Promise<AnalyticsSettings | null> {
    const { data: settings, error } = await supabase
      .from('analytics_settings')
      .select('*')
      .single();

    if (error) {
      console.error('Error fetching analytics settings:', error);
      throw error;
    }

    return settings;
  },

  async updateSettings(settings: Partial<AnalyticsSettings>): Promise<void> {
    const { error } = await supabase
      .from('analytics_settings')
      .upsert([
        {
          id: 1, // Используем фиксированный ID для настроек
          ...settings,
          updated_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error updating analytics settings:', error);
      throw error;
    }
  }
};
