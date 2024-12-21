import { useState, useEffect } from 'react';
import { Settings, settingsService } from '../lib/services/settingsService';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    site_title: '',
    site_description: '',
    logo_url: '',
    site_url: '',
    meta_keywords: '',
    meta_author: '',
    meta_robots: 'index, follow',
    whatsapp_number: '',
    favicon_url: '',
    canonical_url: '',
    address_locality: '',
    address_region: '',
    street_address: '',
    email: '',
    working_hours: '',
    instagram_url: '',
    telegram_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await settingsService.getAll();
        if (mounted) {
          setSettings(prev => ({ ...prev, ...data }));
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : 'Ошибка при загрузке настроек';
          setError(message);
          console.error('Error loading settings:', err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshSettings = async () => {
    try {
      const data = await settingsService.getAll();
      setSettings(prev => ({ ...prev, ...data }));
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при обновлении настроек';
      setError(message);
      console.error('Error refreshing settings:', err);
    }
  };

  return { settings, loading, error, refreshSettings };
}
