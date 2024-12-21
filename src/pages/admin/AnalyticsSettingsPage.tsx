import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/admin/Layout';
import { BarChart3, Save, AlertCircle } from 'lucide-react';
import { analyticsSettingsService } from '../../lib/services/analyticsSettingsService';
import toast from 'react-hot-toast';

export function AnalyticsSettingsPage() {
  const [settings, setSettings] = useState({
    google_analytics_id: '',
    google_tag_manager_id: '',
    facebook_pixel_id: '',
    tiktok_pixel_id: '',
    vk_pixel_id: '',
    custom_head_scripts: '',
    custom_body_scripts: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await analyticsSettingsService.getSettings();
      if (data) {
        // Ensure all values are strings, not null
        setSettings({
          google_analytics_id: data.google_analytics_id || '',
          google_tag_manager_id: data.google_tag_manager_id || '',
          facebook_pixel_id: data.facebook_pixel_id || '',
          tiktok_pixel_id: data.tiktok_pixel_id || '',
          vk_pixel_id: data.vk_pixel_id || '',
          custom_head_scripts: data.custom_head_scripts || '',
          custom_body_scripts: data.custom_body_scripts || ''
        });
      }
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при загрузке настроек';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await analyticsSettingsService.updateSettings(settings);
      toast.success('Настройки успешно сохранены');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при сохранении настроек';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(6)].map((_, index) => (
                <div key={index}>
                  <div className="h-4 bg-gray-200 rounded w-1/6 mb-1"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Настройки аналитики</h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-red-800 font-medium">Ошибка</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Google Analytics и Tag Manager</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Google Analytics ID (GA4)
                </label>
                <input
                  type="text"
                  value={settings.google_analytics_id}
                  onChange={(e) => setSettings(prev => ({ ...prev, google_analytics_id: e.target.value }))}
                  placeholder="G-XXXXXXXXXX"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
                <p className="mt-1 text-sm text-gray-500">Например: G-XXXXXXXXXX</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Google Tag Manager ID
                </label>
                <input
                  type="text"
                  value={settings.google_tag_manager_id}
                  onChange={(e) => setSettings(prev => ({ ...prev, google_tag_manager_id: e.target.value }))}
                  placeholder="GTM-XXXXXXX"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
                <p className="mt-1 text-sm text-gray-500">Например: GTM-XXXXXXX</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Пиксели социальных сетей</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Facebook Pixel ID
                </label>
                <input
                  type="text"
                  value={settings.facebook_pixel_id}
                  onChange={(e) => setSettings(prev => ({ ...prev, facebook_pixel_id: e.target.value }))}
                  placeholder="XXXXXXXXXXXXXXXXXX"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  TikTok Pixel ID
                </label>
                <input
                  type="text"
                  value={settings.tiktok_pixel_id}
                  onChange={(e) => setSettings(prev => ({ ...prev, tiktok_pixel_id: e.target.value }))}
                  placeholder="XXXXXXXXXXXXXXXXXX"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  VK Pixel ID
                </label>
                <input
                  type="text"
                  value={settings.vk_pixel_id}
                  onChange={(e) => setSettings(prev => ({ ...prev, vk_pixel_id: e.target.value }))}
                  placeholder="VK-XXXXXXXXXX"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Пользовательские скрипты</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Скрипты в head
                </label>
                <textarea
                  value={settings.custom_head_scripts}
                  onChange={(e) => setSettings(prev => ({ ...prev, custom_head_scripts: e.target.value }))}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500 font-mono text-sm"
                  placeholder="<!-- Вставьте ваши скрипты здесь -->"
                />
                <p className="mt-1 text-sm text-gray-500">Скрипты будут добавлены в секцию head</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Скрипты в body
                </label>
                <textarea
                  value={settings.custom_body_scripts}
                  onChange={(e) => setSettings(prev => ({ ...prev, custom_body_scripts: e.target.value }))}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500 font-mono text-sm"
                  placeholder="<!-- Вставьте ваши скрипты здесь -->"
                />
                <p className="mt-1 text-sm text-gray-500">Скрипты будут добавлены перед закрывающим тегом body</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <Save className={`w-4 h-4 mr-2 ${saving ? 'animate-spin' : ''}`} />
              {saving ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
