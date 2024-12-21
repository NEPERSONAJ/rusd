import { supabase } from '../supabase';

export interface Settings {
  site_title: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;
  meta_keywords: string;
  meta_author: string;
  meta_robots: string;
  whatsapp_number: string;
  imgbb_api_key?: string;
  site_url: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: string;
  schema_markup?: string;
  canonical_url: string;
  address_locality: string;
  address_region: string;
  street_address: string;
  email: string;
  working_hours: string;
  instagram_url: string;
  telegram_url: string;
}

export const settingsService = {
  async getAll(): Promise<Settings> {
    const { data, error } = await supabase
      .from('settings')
      .select('*');

    if (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }

    const settings: Record<string, string> = {};
    
    if (data) {
      data.forEach(item => {
        if (item.key && item.value !== null && item.value !== undefined) {
          settings[item.key] = item.value;
        }
      });
    }

    return settings as Settings;
  },

  async update(key: string, value: string): Promise<void> {
    const { error: existingError, data: existing } = await supabase
      .from('settings')
      .select('id')
      .eq('key', key)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error checking existing setting:', existingError);
      throw existingError;
    }

    const timestamp = new Date().toISOString();

    if (existing) {
      const { error: updateError } = await supabase
        .from('settings')
        .update({ 
          value, 
          updated_at: timestamp 
        })
        .eq('key', key);

      if (updateError) {
        console.error('Error updating setting:', updateError);
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from('settings')
        .insert([{ 
          id: crypto.randomUUID(),
          key, 
          value, 
          updated_at: timestamp 
        }]);

      if (insertError) {
        console.error('Error inserting setting:', insertError);
        throw insertError;
      }
    }
  }
};
