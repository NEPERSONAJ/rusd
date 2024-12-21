import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/admin/Layout';
import { Settings, Save, Loader } from 'lucide-react';
import { aiSettingsService, AISettings } from '../../lib/services/aiSettingsService';
import toast from 'react-hot-toast';

export function AISettingsPage() {
  const [settings, setSettings] = useState<Partial<AISettings>>({
    api_url: '',
    api_key: '',
    model: 'gpt-4o',
    temperature: 0.7,
    max_tokens: 2000
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await aiSettingsService.getSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      toast.error('Ошибка при загрузке настроек');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await aiSettingsService.updateSettings(settings);
      toast.success('Настройки успешно сохранены');
    } catch (error) {
      toast.error('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Настройки ИИ-ассистента</h1>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL API
              </label>
              <input
                type="url"
                value={settings.api_url}
                onChange={(e) => setSettings({ ...settings, api_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                placeholder="https://api.example.com/v1/chat/completions"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Ключ
              </label>
              <input
                type="password"
                value={settings.api_key}
                onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
                placeholder="sk-..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Модель
              </label>
              <select
                value={settings.model}
                onChange={(e) => setSettings({ ...settings, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              > <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-4o-mini">GPT-4o mini</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature (0-1)
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Tokens
              </label>
              <input
                type="number"
                min="100"
                max="4000"
                step="100"
                value={settings.max_tokens}
                onChange={(e) => setSettings({ ...settings, max_tokens: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Сохранить</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
