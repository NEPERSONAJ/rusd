import React, { useState, useRef } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { Product, WatermarkSettings } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { imageService } from '../../lib/services/imageService';
import { WatermarkSettings as WatermarkSettingsComponent } from './WatermarkSettings';
import toast from 'react-hot-toast';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const { categories } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() ?? '0',
    image: initialData?.image || '',
    processed_image: initialData?.processed_image || '',
    category_id: initialData?.category_id || '',
    specs: initialData?.specs || [''],
    isNew: initialData?.is_new || false,
    discount_enabled: initialData?.discount_enabled || false,
    discount_percentage: initialData?.discount_percentage?.toString() ?? '0',
    discount_price: initialData?.discount_price?.toString() ?? '0',
    discount_start_date: initialData?.discount_start_date ? new Date(initialData.discount_start_date).toISOString().slice(0, 16) : '',
    discount_end_date: initialData?.discount_end_date ? new Date(initialData.discount_end_date).toISOString().slice(0, 16) : ''
  });

  const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>({
    enabled: Boolean(initialData?.watermark_image),
    image: initialData?.watermark_image || '',
    position: initialData?.watermark_position || 'top-right',
    opacity: initialData?.watermark_opacity || 0.5
  });

  const flatCategories = categories.map(cat => ({
    ...cat,
    fullName: cat.parent_id 
      ? `${categories.find(c => c.id === cat.parent_id)?.name} → ${cat.name}`
      : cat.name
  }));

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await imageService.upload(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));

      // If watermark is enabled, automatically process the image
      if (watermarkSettings.enabled && watermarkSettings.image) {
        const processedUrl = await imageService.applyWatermark(imageUrl, watermarkSettings);
        setFormData(prev => ({ ...prev, processed_image: processedUrl }));
      }

      toast.success('Изображение успешно загружено');
    } catch (error) {
      toast.error('Ошибка при загрузке изображения');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleWatermarkSettingsChange = async (newSettings: WatermarkSettings) => {
    setWatermarkSettings(newSettings);
    
    // If we have both main image and watermark, process the image
    if (newSettings.enabled && formData.image && newSettings.image) {
      try {
        const processedUrl = await imageService.applyWatermark(formData.image, newSettings);
        setFormData(prev => ({ ...prev, processed_image: processedUrl }));
      } catch (error) {
        console.error('Error processing watermark:', error);
        toast.error('Ошибка при обработке водяного знака');
      }
    }
  };

  const handlePreview = async (processedImageUrl: string) => {
    setFormData(prev => ({ ...prev, processed_image: processedImageUrl }));
  };

  const handleSpecChange = (index: number, value: string) => {
    const newSpecs = [...formData.specs];
    newSpecs[index] = value;
    setFormData({ ...formData, specs: newSpecs });
  };

  const addSpec = () => {
    setFormData({ ...formData, specs: [...formData.specs, ''] });
  };

  const removeSpec = (index: number) => {
    const newSpecs = formData.specs.filter((_, i) => i !== index);
    setFormData({ ...formData, specs: newSpecs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalImageUrl = watermarkSettings.enabled ? formData.processed_image : formData.image;
    
    if (!finalImageUrl) {
      toast.error('Необходимо загрузить изображение продукта');
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price) || 0,
      image: finalImageUrl,
      watermark_image: watermarkSettings.enabled ? watermarkSettings.image : null,
      watermark_position: watermarkSettings.enabled ? watermarkSettings.position : null,
      watermark_opacity: watermarkSettings.enabled ? watermarkSettings.opacity : null,
      category_id: formData.category_id,
      specs: formData.specs.filter(spec => spec.trim() !== ''),
      isNew: formData.isNew,
      discount_enabled: formData.discount_enabled,
      discount_percentage: formData.discount_enabled ? Number(formData.discount_percentage) : null,
      discount_price: formData.discount_enabled ? Number(formData.discount_price) : null,
      discount_start_date: formData.discount_enabled ? formData.discount_start_date : null,
      discount_end_date: formData.discount_enabled ? formData.discount_end_date : null
    };

    await onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Название</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Описание</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Цена</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Изображение</label>
        <div className="flex items-center space-x-4">
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              placeholder="URL изображения"
              required
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Категория</label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-purple-500"
          required
        >
          <option value="">Выберите категорию</option>
          {flatCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.fullName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Характеристики</label>
        {formData.specs.map((spec, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={spec}
              onChange={(e) => handleSpecChange(index, e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
              placeholder="Например: Длина: 2000 мм"
            />
            <button
              type="button"
              onClick={() => removeSpec(index)}
              className="p-2 text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSpec}
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          + Добавить характеристику
        </button>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isNew}
          onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Отметить как новинку
        </label>
      </div>

      <div className="space-y-4 border-t pt-4 mt-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="discount_enabled"
            checked={formData.discount_enabled}
            onChange={(e) => setFormData({ ...formData, discount_enabled: e.target.checked })}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="discount_enabled" className="ml-2 block text-sm text-gray-700">
            Включить акцию для товара
          </label>
        </div>

        {formData.discount_enabled && (
          <div className="space-y-4 pl-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Процент скидки (%)
                </label>
                <input
                  type="number"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Цена со скидкой
                </label>
                <input
                  type="number"
                  value={formData.discount_price}
                  onChange={(e) => setFormData({ ...formData, discount_price: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Дата начала акции
                </label>
                <input
                  type="datetime-local"
                  value={formData.discount_start_date}
                  onChange={(e) => setFormData({ ...formData, discount_start_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Дата окончания акции
                </label>
                <input
                  type="datetime-local"
                  value={formData.discount_end_date}
                  onChange={(e) => setFormData({ ...formData, discount_end_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Настройки водяного знака</h3>
        <WatermarkSettingsComponent
          settings={watermarkSettings}
          onChange={handleWatermarkSettingsChange}
          onPreview={handlePreview}
          productImage={formData.image}
        />
      </div>

      {formData.processed_image && watermarkSettings.enabled && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Предпросмотр с водяным знаком</h3>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            <img
              src={formData.processed_image}
              alt="Предпросмотр с водяным знаком"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Отмена
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          {initialData ? 'Сохранить' : 'Добавить'}
        </button>
      </div>
    </form>
  );
}