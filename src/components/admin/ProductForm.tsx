import React, { useState, useRef } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Product } from '../../types';
import { Search, Tag, Clock, ChevronRight, ChevronDown, Upload, Loader2, X } from 'lucide-react';
import { imageService } from '../../lib/services/imageService';
import { WatermarkSettings } from './WatermarkSettings';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const { categories } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price?.toString() ?? '0',
    image: initialData?.image || '',
    additional_images: initialData?.additional_images || [],
    processed_image: initialData?.processed_image || '',
    processed_additional_images: initialData?.processed_additional_images || [],
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
    opacity: initialData?.watermark_opacity || 0.5,
    size: initialData?.watermark_size || 0.2
  });

  const flatCategories = categories.map(cat => ({
    ...cat,
    fullName: cat.parent_id 
      ? `${categories.find(c => c.id === cat.parent_id)?.name} → ${cat.name}`
      : cat.name
  }));

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, isAdditional: boolean = false) => {
    const files = event.target.files;
    if (!files?.length) return;

    try {
      setUploading(true);
      
      if (isAdditional) {
        const uploadPromises = Array.from(files).map(file => imageService.upload(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        
        setFormData(prev => ({
          ...prev,
          additional_images: [...prev.additional_images, ...uploadedUrls]
        }));

        // Apply watermarks if enabled
        if (watermarkSettings.enabled && watermarkSettings.image) {
          const processedUrls = await Promise.all(
            uploadedUrls.map(url => 
              imageService.applyWatermark(url, watermarkSettings)
            )
          );
          
          setFormData(prev => ({
            ...prev,
            processed_additional_images: [...(prev.processed_additional_images || []), ...processedUrls]
          }));
        }
      } else {
        const imageUrl = await imageService.upload(files[0]);
        setFormData(prev => ({ ...prev, image: imageUrl }));

        if (watermarkSettings.enabled && watermarkSettings.image) {
          const processedUrl = await imageService.applyWatermark(imageUrl, watermarkSettings);
          setFormData(prev => ({ ...prev, processed_image: processedUrl }));
        }
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
    
    if (newSettings.enabled && newSettings.image) {
      try {
        // Process main image
        if (formData.image) {
          const processedUrl = await imageService.applyWatermark(formData.image, newSettings);
          setFormData(prev => ({ ...prev, processed_image: processedUrl }));
        }

        // Process additional images
        if (formData.additional_images.length > 0) {
          const processedUrls = await Promise.all(
            formData.additional_images.map(img => 
              imageService.applyWatermark(img, newSettings)
            )
          );
          
          setFormData(prev => ({
            ...prev,
            processed_additional_images: processedUrls
          }));
        }
      } catch (error) {
        console.error('Error processing watermarks:', error);
        toast.error('Ошибка при обработке водяных знаков');
      }
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index),
      processed_additional_images: prev.processed_additional_images?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return;

    try {
      setSubmitting(true);
      
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price) || 0,
        image: formData.image.trim(),
        additional_images: formData.additional_images,
        processed_additional_images: formData.processed_additional_images,
        category_id: formData.category_id,
        specs: formData.specs.filter(spec => spec.trim() !== ''),
        is_new: formData.isNew,
        discount_enabled: formData.discount_enabled,
        discount_percentage: formData.discount_enabled ? Number(formData.discount_percentage) : null,
        discount_price: formData.discount_enabled ? Number(formData.discount_price) : null,
        discount_start_date: formData.discount_enabled ? formData.discount_start_date : null,
        discount_end_date: formData.discount_enabled ? formData.discount_end_date : null,
        watermark_image: watermarkSettings.enabled ? watermarkSettings.image : null,
        watermark_position: watermarkSettings.enabled ? watermarkSettings.position : null,
        watermark_opacity: watermarkSettings.enabled ? watermarkSettings.opacity : null,
        watermark_size: watermarkSettings.enabled ? watermarkSettings.size : null,
        processed_image: formData.processed_image
      };

      await onSubmit(submitData);
      toast.success(initialData ? 'Товар успешно обновлен' : 'Товар успешно добавлен');
    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error('Ошибка при сохранении товара');
    } finally {
      setSubmitting(false);
    }
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
          disabled={submitting}
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
          disabled={submitting}
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
          disabled={submitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Основное изображение</label>
        <div className="flex items-center space-x-4">
          {formData.image && (
            <img
              src={formData.processed_image || formData.image}
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
              disabled={submitting}
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleImageUpload(e, false)}
            accept="image/*"
            className="hidden"
            disabled={submitting}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || submitting}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Дополнительные изображения</label>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            {formData.additional_images.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={formData.processed_additional_images?.[index] || img}
                  alt={`Дополнительное изображение ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeAdditionalImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  disabled={submitting}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="file"
              ref={additionalImagesInputRef}
              onChange={(e) => handleImageUpload(e, true)}
              accept="image/*"
              multiple
              className="hidden"
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => additionalImagesInputRef.current?.click()}
              disabled={uploading || submitting}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
              <span>{uploading ? 'Загрузка...' : 'Добавить фото'}</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Категория</label>
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-purple-500"
          required
          disabled={submitting}
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
          <div key={index} className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={spec}
                onChange={(e) => {
                  const newSpecs = [...formData.specs];
                  newSpecs[index] = e.target.value;
                  setFormData({ ...formData, specs: newSpecs });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Например: Длина: 2000 мм"
                disabled={submitting}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const newSpecs = formData.specs.filter((_, i) => i !== index);
                setFormData({ ...formData, specs: newSpecs });
              }}
              className="p-2 text-gray-400 hover:text-red-500"
              disabled={submitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setFormData({ ...formData, specs: [...formData.specs, ''] })}
          className="text-sm text-purple-600 hover:text-purple-700"
          disabled={submitting}
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
          disabled={submitting}
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
            disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
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
                  disabled={submitting}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Настройки водяного знака</h3>
        <WatermarkSettings
          settings={watermarkSettings}
          onChange={handleWatermarkSettingsChange}
          onPreview={(processedImageUrl) => {
            setFormData(prev => ({ ...prev, processed_image: processedImageUrl }));
          }}
          productImage={formData.image}
        />
      </div>

      {formData.processed_image && watermarkSettings.enabled && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Предпросмотр с водяным знаком</h3>
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
          disabled={submitting}
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="relative px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <AnimatePresence>
            {submitting ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-purple-600 rounded-md"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="ml-2">Сохранение...</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <span className={submitting ? 'opacity-0' : ''}>
            {initialData ? 'Сохранить' : 'Добавить'}
          </span>
        </button>
      </div>
    </form>
  );
}
