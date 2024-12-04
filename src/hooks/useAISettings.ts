import { useState, useEffect } from 'react';
import { AISettings, aiSettingsService, DEFAULT_SETTINGS } from '../lib/services/aiSettingsService';

export function useAISettings() {
  const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await aiSettingsService.getSettings();
      setSettings(data || DEFAULT_SETTINGS);
    } catch (error) {
      // Silently fall back to defaults
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    loadSettings
  };
}