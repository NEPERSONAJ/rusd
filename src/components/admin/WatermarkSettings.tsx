import React, { useState } from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { WatermarkSettings as WatermarkSettingsType } from '../../lib/types';
import { imageService } from '../../lib/services/imageService';
import toast from 'react-hot-toast';

interface WatermarkSettingsProps {
  settings: WatermarkSettingsType;
  onChange: (settings: WatermarkSettingsType) => void;
  onPreview?: (processedImageUrl: string) => void;
  productImage?: string;
  productId?: string;
}

export function WatermarkSettings({ 
  settings, 
  onChange,
  onPreview,
  productImage,
  productId
}: WatermarkSettingsProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleWatermarkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await imageService.upload(file);
      onChange({
        ...settings,
        image: imageUrl,
        enabled: true
      });
      toast.success('Водяной знак успешно загружен');
    } catch (error) {
      toast.error('Ошибка при загрузке водяного знака');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async () => {
    if (!productImage) {
      toast.error('Сначала загрузите изображение продукта');
      return;
    }

    try {
      const processedImageUrl = await imageService.applyWatermark(productImage, settings, productId);
      if (onPreview) {
        onPreview(processedImageUrl);
      }
    } catch (error) {
      toast.error('Ошибка при создании предпросмотра');
      console.error('Preview error:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          id="watermark-enabled"
          checked={settings.enabled}
          onChange={(e) => onChange({ ...settings, enabled: e.target.checked })}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label htmlFor="watermark-enabled" className="text-sm font-medium text-gray-700">
          Включить водяной знак
        </label>
      </div>

      {settings.enabled && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Изображение водяного знака
            </label>
            <div className="flex items-center space-x-4">
              {settings.image && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={settings.image}
                    alt="Водяной знак"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="text"
                  value={settings.image || ''}
                  onChange={(e) => onChange({ ...settings, image: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="URL водяного знака"
                />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleWatermarkUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                <span>{uploading ? 'Загрузка...' : 'Загрузить'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Позиция
              </label>
              <select
                value={settings.position}
                onChange={(e) => onChange({
                  ...settings,
                  position: e.target.value as WatermarkSettingsType['position']
                })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              >
                <option value="top-left">Сверху слева</option>
                <option value="top-right">Сверху справа</option>
                <option value="bottom-left">Снизу слева</option>
                <option value="bottom-right">Снизу справа</option>
                <option value="center">По центру</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Прозрачность (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.opacity * 100}
                onChange={(e) => onChange({
                  ...settings,
                  opacity: Number(e.target.value) / 100
                })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Размер (% от ширины изображения)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={(settings.size || 0.2) * 100}
                onChange={(e) => onChange({
                  ...settings,
                  size: Number(e.target.value) / 100
                })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>

          {productImage && (
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full justify-center"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Предпросмотр с водяным знаком</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
