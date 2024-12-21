import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../../components/admin/Layout';
import { 
  Settings as SettingsIcon, 
  Save, 
  AlertCircle, 
  Key, 
  Upload, 
  Loader2,
  Image,
  Info,
  Globe,
  Share2,
  Twitter,
  MapPin,
  Mail,
  Clock,
  Instagram,
  Send,
  Phone
} from 'lucide-react';
import { settingsService } from '../../lib/services/settingsService';
import { imageService } from '../../lib/services/imageService';
import toast from 'react-hot-toast';

interface SettingField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'email' | 'tel' | 'url' | 'time';
  placeholder?: string;
  description?: string;
  icon?: React.ElementType;
  required?: boolean;
  group: string;
}

const SETTING_FIELDS: SettingField[] = [
  // Основные настройки
  {
    key: 'site_title',
    label: 'Название сайта',
    type: 'text',
    placeholder: 'Название вашего сайта',
    description: 'Название сайта, которое будет отображаться в заголовке браузера',
    icon: Globe,
    required: true,
    group: 'main'
  },
  {
    key: 'site_description',
    label: 'Описание сайта',
    type: 'textarea',
    placeholder: 'Краткое описание вашего сайта',
    description: 'Основное описание сайта для поисковых систем',
    icon: Info,
    required: true,
    group: 'main'
  },
  {
    key: 'site_url',
    label: 'URL сайта',
    type: 'url',
    placeholder: 'https://example.com',
    description: 'Полный URL вашего сайта',
    icon: Globe,
    required: true,
    group: 'main'
  },

  // Контактная информация
  {
    key: 'whatsapp_number',
    label: 'Номер WhatsApp',
    type: 'tel',
    placeholder: '+7XXXXXXXXXX',
    description: 'Номер WhatsApp для связи с клиентами',
    icon: Phone,
    required: true,
    group: 'contact'
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'contact@example.com',
    description: 'Контактный email организации',
    icon: Mail,
    group: 'contact'
  },
  {
    key: 'working_hours',
    label: 'Часы работы',
    type: 'text',
    placeholder: '09:00 - 18:00',
    description: 'Время работы организации',
    icon: Clock,
    group: 'contact'
  },

  // Адрес
  {
    key: 'address_locality',
    label: 'Город',
    type: 'text',
    placeholder: 'Название города',
    description: 'Город нахождения организации',
    icon: MapPin,
    group: 'address'
  },
  {
    key: 'address_region',
    label: 'Регион',
    type: 'text',
    placeholder: 'Название региона',
    description: 'Регион нахождения организации',
    icon: MapPin,
    group: 'address'
  },
  {
    key: 'street_address',
    label: 'Адрес',
    type: 'text',
    placeholder: 'Полный адрес',
    description: 'Полный адрес организации',
    icon: MapPin,
    group: 'address'
  },

  // Социальные сети
  {
    key: 'instagram_url',
    label: 'Instagram',
    type: 'url',
    placeholder: 'https://instagram.com/username',
    description: 'Ссылка на профиль Instagram',
    icon: Instagram,
    group: 'social'
  },
  {
    key: 'telegram_url',
    label: 'Telegram',
    type: 'url',
    placeholder: 'https://t.me/username',
    description: 'Ссылка на Telegram канал или профиль',
    icon: Send,
    group: 'social'
  },

  // SEO настройки
  {
    key: 'meta_keywords',
    label: 'META ключевые слова',
    type: 'textarea',
    placeholder: 'ключевое слово, другое ключевое слово',
    description: 'Ключевые слова для поисковых систем, разделенные запятыми',
    icon: Key,
    group: 'seo'
  },
  {
    key: 'meta_author',
    label: 'META автор',
    type: 'text',
    placeholder: 'Имя автора или организации',
    description: 'Имя автора или организации для мета-тегов',
    icon: Info,
    group: 'seo'
  },
  {
    key: 'meta_robots',
    label: 'META robots',
    type: 'text',
    placeholder: 'index, follow',
    description: 'Инструкции для поисковых роботов',
    icon: Globe,
    group: 'seo'
  },

  // Open Graph настройки
  {
    key: 'og_title',
    label: 'OpenGraph заголовок',
    type: 'text',
    placeholder: 'Заголовок для соцсетей',
    description: 'Заголовок при шаринге в социальных сетях',
    icon: Share2,
    group: 'og'
  },
  {
    key: 'og_description',
    label: 'OpenGraph описание',
    type: 'textarea',
    placeholder: 'Описание для соцсетей',
    description: 'Описание при шаринге в социальных сетях',
    icon: Share2,
    group: 'og'
  },
  {
    key: 'twitter_card',
    label: 'Twitter Card',
    type: 'text',
    placeholder: 'summary_large_image',
    description: 'Тип карточки для Twitter',
    icon: Twitter,
    group: 'og'
  },
  {
    key: 'canonical_url',
    label: 'Канонический URL',
    type: 'url',
    placeholder: 'https://example.com',
    description: 'Основной URL для SEO',
    icon: Globe,
    group: 'seo'
  }
];

const SETTING_GROUPS = {
  main: 'Основные настройки',
  contact: 'Контактная информация',
  address: 'Адрес',
  social: 'Социальные сети',
  seo: 'SEO настройки',
  og: 'Open Graph'
};

export function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [uploadingOgImage, setUploadingOgImage] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getAll();
      setSettings(data);
      setError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при загрузке настроек';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'favicon' | 'og_image'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const setUploading = {
      logo: setUploadingLogo,
      favicon: setUploadingFavicon,
      og_image: setUploadingOgImage
    }[type];

    const settingKey = {
      logo: 'logo_url',
      favicon: 'favicon_url',
      og_image: 'og_image'
    }[type];

    try {
      setUploading(true);
      const imageUrl = await imageService.upload(file);
      setSettings(prev => ({ ...prev, [settingKey]: imageUrl }));
      toast.success('Изображение успешно загружено');
    } catch (error) {
      toast.error('Ошибка при загрузке изображения');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      for (const [key, value] of Object.entries(settings)) {
        if (value !== undefined) {
          await settingsService.update(key, value);
        }
      }
      toast.success('Настройки успешно сохранены');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при сохранении настроек';
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const renderSettingFields = (group: string) => {
    return SETTING_FIELDS
      .filter(field => field.group === group)
      .map(field => (
        <div key={field.key} className="col-span-1">
          <label className="block text-sm font-medium text-gray-700 flex items-center space-x-2">
            {field.icon && <field.icon className="w-4 h-4" />}
            <span>{field.label}</span>
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              value={settings[field.key] || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              placeholder={field.placeholder}
              required={field.required}
            />
          ) : (
            <input
              type={field.type}
              value={settings[field.key] || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              placeholder={field.placeholder}
              required={field.required}
            />
          )}
          {field.description && (
            <p className="mt-1 text-sm text-gray-500">{field.description}</p>
          )}
        </div>
      ));
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
          <SettingsIcon className="w-8 h-8 text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-900">Настройки сайта</h1>
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Изображения</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Логотип сайта</label>
                <div className="flex items-center space-x-4">
                  {settings.logo_url && (
                    <img
                      src={settings.logo_url}
                      alt="Логотип"
                      className="h-16 w-auto object-contain rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={settings.logo_url || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, logo_url: e.target.value }))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="URL логотипа"
                      required
                    />
                  </div>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {uploadingLogo ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                    <span>{uploadingLogo ? 'Загрузка...' : 'Загрузить'}</span>
                  </button>
                </div>
              </div>

              {/* Favicon Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Фавикон</label>
                <div className="flex items-center space-x-4">
                  {settings.favicon_url && (
                    <img
                      src={settings.favicon_url}
                      alt="Фавикон"
                      className="h-8 w-8 object-contain rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={settings.favicon_url || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, favicon_url: e.target.value }))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="URL фавикона"
                    />
                  </div>
                  <input
                    type="file"
                    ref={faviconInputRef}
                    onChange={(e) => handleImageUpload(e, 'favicon')}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={uploadingFavicon}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {uploadingFavicon ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Image className="w-5 h-5" />
                    )}
                    <span>{uploadingFavicon ? 'Загрузка...' : 'Загрузить'}</span>
                  </button>
                </div>
              </div>

              {/* OG Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenGraph изображение
                </label>
                <div className="flex items-center space-x-4">
                  {settings.og_image && (
                    <img
                      src={settings.og_image}
                      alt="OG Image"
                      className="h-16 w-auto object-contain rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={settings.og_image || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, og_image: e.target.value }))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="URL OpenGraph изображения"
                    />
                  </div>
                  <input
                    type="file"
                    ref={ogImageInputRef}
                    onChange={(e) => handleImageUpload(e, 'og_image')}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => ogImageInputRef.current?.click()}
                    disabled={uploadingOgImage}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {uploadingOgImage ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Share2 className="w-5 h-5" />
                    )}
                    <span>{uploadingOgImage ? 'Загрузка...' : 'Загрузить'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Groups */}
          {Object.entries(SETTING_GROUPS).map(([groupKey, groupName]) => (
            <div key={groupKey} className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">{groupName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSettingFields(groupKey)}
              </div>
            </div>
          ))}

          {/* Submit Button */}
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
